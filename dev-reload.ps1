#!/usr/bin/env pwsh
# Development script to rebuild and reinstall the extension in VS Code

Write-Host "=== PHP i18n Extension - Dev Reload Script ===" -ForegroundColor Cyan

# Get the extension directory
$ExtensionDir = $PSScriptRoot
$ExtensionName = "php-i18n-viewer"

Write-Host "`n[1/5] Compiling TypeScript..." -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/5] Packaging extension..." -ForegroundColor Yellow
# Install vsce if not already installed
if (!(Get-Command vsce -ErrorAction SilentlyContinue)) {
    Write-Host "Installing vsce..." -ForegroundColor Yellow
    npm install -g @vscode/vsce
}

vsce package --out extension.vsix --allow-star-activation
if ($LASTEXITCODE -ne 0) {
    Write-Host "Packaging failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[3/5] Uninstalling old version..." -ForegroundColor Yellow
code --uninstall-extension $ExtensionName 2>$null

Write-Host "`n[4/5] Installing new version..." -ForegroundColor Yellow
$VsixFile = Get-ChildItem -Path $ExtensionDir -Filter "*.vsix" | Select-Object -First 1
if ($VsixFile) {
    code --install-extension $VsixFile.FullName --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[5/5] Extension installed successfully!" -ForegroundColor Green
        Write-Host "`nPlease reload VS Code window to activate the changes." -ForegroundColor Yellow
        Write-Host "Press Ctrl+Shift+P -> 'Developer: Reload Window'" -ForegroundColor Yellow
    } else {
        Write-Host "Installation failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "No VSIX file found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Done! ===" -ForegroundColor Cyan
