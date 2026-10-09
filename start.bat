@echo off
title Pixel ITAM - Desktop Management
echo ===================================================
echo  Starting Pixel ITAM Desktop Management Server...
echo  Opening browser at http://localhost:3000
echo ===================================================
start "" "http://localhost:3000"
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
