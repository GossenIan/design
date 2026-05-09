from __future__ import annotations

import argparse
import json
import os
import re
import socket
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse
from uuid import uuid4

ROOT_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = ROOT_DIR / "img" / "uploads"
DATA_BACKUP_FILE = ROOT_DIR / "js" / "squatgym-data-backup.js"
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
MAX_DATA_BACKUP_BYTES = 10 * 1024 * 1024


def json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict) -> None:
  data = json.dumps(payload).encode("utf-8")
  handler.send_response(status)
  handler.send_header("Content-Type", "application/json; charset=utf-8")
  handler.send_header("Content-Length", str(len(data)))
  handler.send_header("Access-Control-Allow-Origin", "*")
  handler.end_headers()
  handler.wfile.write(data)


def parse_boundary(content_type: str) -> Optional[bytes]:
  match = re.search(r'boundary=(?:"([^"]+)"|([^;]+))', content_type)

  if not match:
    return None

  boundary = (match.group(1) or match.group(2)).strip()

  return f"--{boundary}".encode("utf-8")


def parse_multipart_file(body: bytes, boundary: bytes) -> tuple[str, bytes]:
  for raw_part in body.split(boundary):
    part = raw_part.strip(b"\r\n")

    if not part or part == b"--" or b"\r\n\r\n" not in part:
      continue

    raw_headers, content = part.split(b"\r\n\r\n", 1)
    header_text = raw_headers.decode("utf-8", errors="replace")

    if 'name="image"' not in header_text:
      continue

    filename_match = re.search(r'filename="([^"]*)"', header_text)
    filename = filename_match.group(1).strip() if filename_match else "producto"
    content = content.rstrip(b"\r\n")

    if content.endswith(b"--"):
      content = content[:-2].rstrip(b"\r\n")

    return filename, content

  raise ValueError("No se encontro el archivo de imagen.")


def detect_extension(data: bytes) -> str:
  if data.startswith(b"\xff\xd8\xff"):
    return ".jpg"

  if data.startswith(b"\x89PNG\r\n\x1a\n"):
    return ".png"

  if data.startswith((b"GIF87a", b"GIF89a")):
    return ".gif"

  if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
    return ".webp"

  raise ValueError("Formato de imagen no soportado. Usa JPG, PNG, WEBP o GIF.")


def safe_filename(original_name: str, extension: str) -> str:
  stem = Path(original_name).stem.lower()
  stem = re.sub(r"[^a-z0-9_-]+", "-", stem).strip("-") or "producto"
  stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
  token = uuid4().hex[:8]

  return f"{stem}-{stamp}-{token}{extension}"


def persist_data_backup(raw_body: bytes) -> dict:
  if len(raw_body) > MAX_DATA_BACKUP_BYTES:
    raise ValueError("El backup supera los 10 MB.")

  snapshot = json.loads(raw_body.decode("utf-8"))
  data = snapshot.get("data")

  if not isinstance(data, dict):
    raise ValueError("Backup invalido.")

  safe_data = {
    str(key): str(value)
    for key, value in data.items()
    if str(key).startswith("squatgym-")
    and str(key) not in {"squatgym-data-snapshot-version", "squatgym-data-snapshot-applied-at"}
  }
  version = str(snapshot.get("version") or int(datetime.now().timestamp() * 1000))
  safe_snapshot = {
    "version": version,
    "createdAt": str(snapshot.get("createdAt") or datetime.now().isoformat()),
    "origin": str(snapshot.get("origin") or ""),
    "data": safe_data
  }
  js_payload = "window.SquatGymDataBackup = " + json.dumps(safe_snapshot, ensure_ascii=True, indent=2) + ";\n"
  DATA_BACKUP_FILE.parent.mkdir(parents=True, exist_ok=True)
  DATA_BACKUP_FILE.write_text(js_payload, encoding="utf-8")

  return {"ok": True, "version": version, "keys": len(safe_data)}


class SquatGymHandler(SimpleHTTPRequestHandler):
  def do_OPTIONS(self) -> None:
    self.send_response(204)
    self.send_header("Access-Control-Allow-Origin", "*")
    self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
    self.send_header("Access-Control-Allow-Headers", "Content-Type")
    self.end_headers()

  def do_POST(self) -> None:
    route = urlparse(self.path).path

    if route == "/api/persist-data":
      try:
        length = int(self.headers.get("Content-Length", "0"))

        if length <= 0:
          raise ValueError("No se recibieron datos.")

        json_response(self, 200, persist_data_backup(self.rfile.read(length)))
      except (ValueError, json.JSONDecodeError) as error:
        json_response(self, 400, {"ok": False, "error": str(error)})
      except OSError:
        json_response(self, 500, {"ok": False, "error": "No se pudo escribir js/squatgym-data-backup.js."})
      return

    if route != "/api/upload-image":
      json_response(self, 404, {"ok": False, "error": "Endpoint no encontrado."})
      return

    try:
      length = int(self.headers.get("Content-Length", "0"))

      if length <= 0:
        raise ValueError("No se recibio ninguna imagen.")

      if length > MAX_UPLOAD_BYTES:
        raise ValueError("La imagen supera los 8 MB.")

      boundary = parse_boundary(self.headers.get("Content-Type", ""))

      if not boundary:
        raise ValueError("La solicitud no es multipart/form-data.")

      original_name, image_data = parse_multipart_file(self.rfile.read(length), boundary)

      if not image_data:
        raise ValueError("La imagen esta vacia.")

      extension = detect_extension(image_data)
      filename = safe_filename(original_name, extension)
      UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
      target = UPLOAD_DIR / filename
      target.write_bytes(image_data)

      json_response(self, 200, {
        "ok": True,
        "url": f"/img/uploads/{filename}",
        "fileName": f"uploads/{filename}"
      })
    except ValueError as error:
      json_response(self, 400, {"ok": False, "error": str(error)})
    except OSError:
      json_response(self, 500, {"ok": False, "error": "No se pudo escribir la imagen en img/uploads."})


def port_is_busy(host: str, port: int) -> bool:
  try:
    with socket.create_connection((host, port), timeout=0.35):
      return True
  except OSError:
    return False


def run_server(host: str, port: int) -> None:
  server = ThreadingHTTPServer((host, port), SquatGymHandler)
  print(f"SquatGym listo en http://{host}:{port}/home/home.html")
  print(f"Kiosco disponible en http://{host}:{port}/home/kiosco/kiosco.html")
  print("Las imagenes subidas se guardan en img/uploads.")
  server.serve_forever()


def main() -> None:
  parser = argparse.ArgumentParser(description="Servidor local de SquatGym con subida de imagenes.")
  parser.add_argument("--host", default="127.0.0.1")
  parser.add_argument("--port", type=int, default=5500)
  args = parser.parse_args()

  os.chdir(ROOT_DIR)

  for port in range(args.port, args.port + 10):
    if port_is_busy(args.host, port):
      print(f"Puerto {port} ocupado, probando {port + 1}...")
      continue

    try:
      run_server(args.host, port)
      return
    except OSError:
      if port == args.port + 9:
        raise

      print(f"Puerto {port} ocupado, probando {port + 1}...")


if __name__ == "__main__":
  main()
