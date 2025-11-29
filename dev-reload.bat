@echo off
REM Simple batch wrapper for PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0dev-reload.ps1"
