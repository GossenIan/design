using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;

internal static class SquatGymLauncher
{
    private const int StartPort = 5500;
    private const int MaxUploadBytes = 8 * 1024 * 1024;
    private static readonly string RootDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd(Path.DirectorySeparatorChar);
    private static readonly string UploadDir = Path.Combine(RootDir, "img", "uploads");
    private static TcpListener listener;
    private static int activePort;
    private static string appUrl;
    private static NotifyIcon trayIcon;

    [STAThread]
    private static void Main()
    {
        try
        {
            if (!File.Exists(Path.Combine(RootDir, "home", "home.html")))
            {
                MessageBox.Show(
                    "No se encontro home\\home.html. Deja SquatGym.exe dentro de la carpeta del proyecto TPI.",
                    "SquatGym",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
                return;
            }

            StartServer();
            appUrl = "http://127.0.0.1:" + activePort + "/home/home.html";
            OpenBrowser(appUrl);

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            CreateTrayIcon();
            Application.Run(new ApplicationContext());
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "SquatGym", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private static void StartServer()
    {
        for (int port = StartPort; port < StartPort + 10; port++)
        {
            try
            {
                listener = new TcpListener(IPAddress.Loopback, port);
                listener.Start();
                activePort = port;

                Thread thread = new Thread(AcceptLoop);
                thread.IsBackground = true;
                thread.Start();
                return;
            }
            catch (SocketException)
            {
                if (listener != null)
                {
                    try { listener.Stop(); } catch { }
                }
            }
        }

        throw new InvalidOperationException("No hay puertos libres entre 5500 y 5509.");
    }

    private static void AcceptLoop()
    {
        while (true)
        {
            try
            {
                TcpClient client = listener.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(delegate { HandleClient(client); });
            }
            catch
            {
                return;
            }
        }
    }

    private static void HandleClient(TcpClient client)
    {
        using (client)
        {
            client.ReceiveTimeout = 10000;
            client.SendTimeout = 10000;

            NetworkStream stream = client.GetStream();
            byte[] headerBytes = ReadHeaders(stream);

            if (headerBytes.Length == 0)
            {
                return;
            }

            string headerText = Encoding.UTF8.GetString(headerBytes);
            string[] headerParts = headerText.Split(new[] { "\r\n" }, StringSplitOptions.None);

            if (headerParts.Length == 0)
            {
                return;
            }

            string[] requestParts = headerParts[0].Split(' ');

            if (requestParts.Length < 2)
            {
                SendText(stream, 400, "Bad Request", "Solicitud invalida.", "text/plain; charset=utf-8");
                return;
            }

            string method = requestParts[0].ToUpperInvariant();
            string rawPath = requestParts[1];
            Dictionary<string, string> headers = ParseHeaders(headerParts);

            if (method == "OPTIONS")
            {
                SendOptions(stream);
                return;
            }

            if (method == "POST" && GetPath(rawPath) == "/api/upload-image")
            {
                HandleUpload(stream, headers);
                return;
            }

            if (method == "GET" || method == "HEAD")
            {
                ServeFile(stream, method, rawPath);
                return;
            }

            SendText(stream, 405, "Method Not Allowed", "Metodo no permitido.", "text/plain; charset=utf-8");
        }
    }

    private static byte[] ReadHeaders(NetworkStream stream)
    {
        MemoryStream buffer = new MemoryStream();
        int matched = 0;
        int next;
        byte[] end = new byte[] { 13, 10, 13, 10 };

        while ((next = stream.ReadByte()) != -1)
        {
            buffer.WriteByte((byte)next);
            matched = next == end[matched] ? matched + 1 : (next == end[0] ? 1 : 0);

            if (matched == end.Length)
            {
                break;
            }

            if (buffer.Length > 65536)
            {
                break;
            }
        }

        return buffer.ToArray();
    }

    private static Dictionary<string, string> ParseHeaders(string[] lines)
    {
        Dictionary<string, string> headers = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        for (int i = 1; i < lines.Length; i++)
        {
            int separator = lines[i].IndexOf(':');
            if (separator <= 0)
            {
                continue;
            }

            headers[lines[i].Substring(0, separator).Trim()] = lines[i].Substring(separator + 1).Trim();
        }

        return headers;
    }

    private static string GetPath(string rawPath)
    {
        string pathOnly = rawPath.Split('?')[0];
        return Uri.UnescapeDataString(pathOnly);
    }

    private static void ServeFile(NetworkStream stream, string method, string rawPath)
    {
        string urlPath = GetPath(rawPath);

        if (urlPath == "/")
        {
            urlPath = "/home/home.html";
        }

        string relativePath = urlPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        string fullPath = Path.GetFullPath(Path.Combine(RootDir, relativePath));
        string rootWithSeparator = RootDir + Path.DirectorySeparatorChar;

        if (!fullPath.StartsWith(rootWithSeparator, StringComparison.OrdinalIgnoreCase) && !fullPath.Equals(RootDir, StringComparison.OrdinalIgnoreCase))
        {
            SendText(stream, 403, "Forbidden", "Acceso denegado.", "text/plain; charset=utf-8");
            return;
        }

        if (Directory.Exists(fullPath))
        {
            fullPath = Path.Combine(fullPath, "index.html");
        }

        if (!File.Exists(fullPath))
        {
            SendText(stream, 404, "Not Found", "Archivo no encontrado.", "text/plain; charset=utf-8");
            return;
        }

        byte[] bytes = File.ReadAllBytes(fullPath);
        SendHeaders(stream, 200, "OK", GetMimeType(fullPath), bytes.Length);

        if (method != "HEAD")
        {
            stream.Write(bytes, 0, bytes.Length);
        }
    }

    private static void HandleUpload(NetworkStream stream, Dictionary<string, string> headers)
    {
        try
        {
            int length = headers.ContainsKey("Content-Length") ? int.Parse(headers["Content-Length"]) : 0;

            if (length <= 0)
            {
                throw new InvalidOperationException("No se recibio ninguna imagen.");
            }

            if (length > MaxUploadBytes)
            {
                throw new InvalidOperationException("La imagen supera los 8 MB.");
            }

            string contentType = headers.ContainsKey("Content-Type") ? headers["Content-Type"] : "";
            string boundary = ParseBoundary(contentType);

            if (string.IsNullOrEmpty(boundary))
            {
                throw new InvalidOperationException("La solicitud no es multipart/form-data.");
            }

            byte[] body = ReadBody(stream, length);
            UploadedFile uploaded = ParseMultipartImage(body, Encoding.UTF8.GetBytes("--" + boundary));

            if (uploaded.Data.Length == 0)
            {
                throw new InvalidOperationException("La imagen esta vacia.");
            }

            string extension = DetectExtension(uploaded.Data);
            string fileName = SafeFileName(uploaded.FileName, extension);

            Directory.CreateDirectory(UploadDir);
            File.WriteAllBytes(Path.Combine(UploadDir, fileName), uploaded.Data);

            SendJson(stream, 200, "OK", "{\"ok\":true,\"url\":\"/img/uploads/" + JsonEscape(fileName) + "\",\"fileName\":\"uploads/" + JsonEscape(fileName) + "\"}");
        }
        catch (Exception ex)
        {
            SendJson(stream, 400, "Bad Request", "{\"ok\":false,\"error\":\"" + JsonEscape(ex.Message) + "\"}");
        }
    }

    private static byte[] ReadBody(NetworkStream stream, int length)
    {
        byte[] body = new byte[length];
        int offset = 0;

        while (offset < length)
        {
            int read = stream.Read(body, offset, length - offset);
            if (read <= 0)
            {
                break;
            }
            offset += read;
        }

        if (offset == length)
        {
            return body;
        }

        byte[] resized = new byte[offset];
        Buffer.BlockCopy(body, 0, resized, 0, offset);
        return resized;
    }

    private static string ParseBoundary(string contentType)
    {
        Match match = Regex.Match(contentType, "boundary=(?:\"([^\"]+)\"|([^;]+))", RegexOptions.IgnoreCase);
        if (!match.Success)
        {
            return "";
        }
        return (match.Groups[1].Success ? match.Groups[1].Value : match.Groups[2].Value).Trim();
    }

    private static UploadedFile ParseMultipartImage(byte[] body, byte[] boundary)
    {
        int boundaryIndex = IndexOf(body, boundary, 0);

        while (boundaryIndex >= 0)
        {
            int partStart = boundaryIndex + boundary.Length;

            if (partStart + 1 < body.Length && body[partStart] == '-' && body[partStart + 1] == '-')
            {
                break;
            }

            if (partStart + 1 < body.Length && body[partStart] == 13 && body[partStart + 1] == 10)
            {
                partStart += 2;
            }

            int headersEnd = IndexOf(body, new byte[] { 13, 10, 13, 10 }, partStart);
            if (headersEnd < 0)
            {
                break;
            }

            string partHeaders = Encoding.UTF8.GetString(body, partStart, headersEnd - partStart);
            int contentStart = headersEnd + 4;
            int nextBoundary = IndexOf(body, boundary, contentStart);

            if (nextBoundary < 0)
            {
                break;
            }

            int contentEnd = nextBoundary;
            if (contentEnd >= 2 && body[contentEnd - 2] == 13 && body[contentEnd - 1] == 10)
            {
                contentEnd -= 2;
            }

            if (partHeaders.IndexOf("name=\"image\"", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                string fileName = "producto";
                Match fileMatch = Regex.Match(partHeaders, "filename=\"([^\"]*)\"", RegexOptions.IgnoreCase);
                if (fileMatch.Success && !string.IsNullOrWhiteSpace(fileMatch.Groups[1].Value))
                {
                    fileName = fileMatch.Groups[1].Value.Trim();
                }

                byte[] data = new byte[Math.Max(0, contentEnd - contentStart)];
                Buffer.BlockCopy(body, contentStart, data, 0, data.Length);
                return new UploadedFile(fileName, data);
            }

            boundaryIndex = nextBoundary;
        }

        throw new InvalidOperationException("No se encontro el archivo de imagen.");
    }

    private static int IndexOf(byte[] source, byte[] pattern, int start)
    {
        for (int i = start; i <= source.Length - pattern.Length; i++)
        {
            bool match = true;
            for (int j = 0; j < pattern.Length; j++)
            {
                if (source[i + j] != pattern[j])
                {
                    match = false;
                    break;
                }
            }

            if (match)
            {
                return i;
            }
        }

        return -1;
    }

    private static string DetectExtension(byte[] data)
    {
        if (data.Length >= 3 && data[0] == 0xff && data[1] == 0xd8 && data[2] == 0xff) return ".jpg";
        if (data.Length >= 8 && data[0] == 0x89 && data[1] == 0x50 && data[2] == 0x4e && data[3] == 0x47) return ".png";
        if (data.Length >= 6 && Encoding.ASCII.GetString(data, 0, 6).StartsWith("GIF")) return ".gif";
        if (data.Length >= 12 && Encoding.ASCII.GetString(data, 0, 4) == "RIFF" && Encoding.ASCII.GetString(data, 8, 4) == "WEBP") return ".webp";
        throw new InvalidOperationException("Formato de imagen no soportado. Usa JPG, PNG, WEBP o GIF.");
    }

    private static string SafeFileName(string originalName, string extension)
    {
        string stem = Path.GetFileNameWithoutExtension(originalName).ToLowerInvariant();
        stem = Regex.Replace(stem, "[^a-z0-9_-]+", "-").Trim('-');
        if (string.IsNullOrEmpty(stem))
        {
            stem = "producto";
        }

        return stem + "-" + DateTime.Now.ToString("yyyyMMdd-HHmmss") + "-" + Guid.NewGuid().ToString("N").Substring(0, 8) + extension;
    }

    private static void SendOptions(NetworkStream stream)
    {
        string headers =
            "HTTP/1.1 204 No Content\r\n" +
            "Access-Control-Allow-Origin: *\r\n" +
            "Access-Control-Allow-Methods: POST, OPTIONS\r\n" +
            "Access-Control-Allow-Headers: Content-Type\r\n" +
            "Connection: close\r\n\r\n";
        byte[] bytes = Encoding.UTF8.GetBytes(headers);
        stream.Write(bytes, 0, bytes.Length);
    }

    private static void SendJson(NetworkStream stream, int status, string reason, string json)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(json);
        SendHeaders(stream, status, reason, "application/json; charset=utf-8", bytes.Length);
        stream.Write(bytes, 0, bytes.Length);
    }

    private static void SendText(NetworkStream stream, int status, string reason, string text, string contentType)
    {
        byte[] bytes = Encoding.UTF8.GetBytes(text);
        SendHeaders(stream, status, reason, contentType, bytes.Length);
        stream.Write(bytes, 0, bytes.Length);
    }

    private static void SendHeaders(NetworkStream stream, int status, string reason, string contentType, int contentLength)
    {
        string headers =
            "HTTP/1.1 " + status + " " + reason + "\r\n" +
            "Content-Type: " + contentType + "\r\n" +
            "Content-Length: " + contentLength + "\r\n" +
            "Access-Control-Allow-Origin: *\r\n" +
            "Cache-Control: no-store\r\n" +
            "Connection: close\r\n\r\n";
        byte[] bytes = Encoding.UTF8.GetBytes(headers);
        stream.Write(bytes, 0, bytes.Length);
    }

    private static string GetMimeType(string filePath)
    {
        switch (Path.GetExtension(filePath).ToLowerInvariant())
        {
            case ".html": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js": return "application/javascript; charset=utf-8";
            case ".json": return "application/json; charset=utf-8";
            case ".png": return "image/png";
            case ".jpg":
            case ".jpeg": return "image/jpeg";
            case ".gif": return "image/gif";
            case ".webp": return "image/webp";
            case ".svg": return "image/svg+xml";
            case ".ico": return "image/x-icon";
            case ".woff": return "font/woff";
            case ".woff2": return "font/woff2";
            default: return "application/octet-stream";
        }
    }

    private static string JsonEscape(string value)
    {
        return value.Replace("\\", "\\\\").Replace("\"", "\\\"");
    }

    private static void OpenBrowser(string url)
    {
        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }

    private static void CreateTrayIcon()
    {
        ContextMenuStrip menu = new ContextMenuStrip();
        menu.Items.Add("Abrir SquatGym", null, delegate { OpenBrowser(appUrl); });
        menu.Items.Add("Salir", null, delegate { ExitApplication(); });

        trayIcon = new NotifyIcon();
        trayIcon.Icon = SystemIcons.Application;
        trayIcon.Text = "SquatGym - servidor local " + activePort;
        trayIcon.Visible = true;
        trayIcon.ContextMenuStrip = menu;
        trayIcon.DoubleClick += delegate { OpenBrowser(appUrl); };
    }

    private static void ExitApplication()
    {
        if (trayIcon != null)
        {
            trayIcon.Visible = false;
            trayIcon.Dispose();
        }

        if (listener != null)
        {
            listener.Stop();
        }

        Application.Exit();
    }

    private sealed class UploadedFile
    {
        public readonly string FileName;
        public readonly byte[] Data;

        public UploadedFile(string fileName, byte[] data)
        {
            FileName = fileName;
            Data = data;
        }
    }
}
