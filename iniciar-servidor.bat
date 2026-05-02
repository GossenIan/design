@echo off
setlocal

set PORT=%1
if "%PORT%"=="" set PORT=5500

where python >nul 2>nul
if %errorlevel%==0 (
  python server.py --port %PORT%
  goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
  py server.py --port %PORT%
  goto :eof
)

set BUNDLED_PYTHON=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe
if exist "%BUNDLED_PYTHON%" (
  "%BUNDLED_PYTHON%" server.py --port %PORT%
  goto :eof
)

echo No se encontro Python. Instala Python o ejecuta server.py con tu runtime preferido.
pause
