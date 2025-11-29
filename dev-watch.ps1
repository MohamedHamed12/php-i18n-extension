#!/usr/bin/env pwsh
# Development script to watch for changes and auto-reload

Write-Host "=== PHP i18n Extension - Dev Watch Mode ===" -ForegroundColor Cyan
Write-Host "This will watch for file changes and prompt to reload the extension" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop watching`n" -ForegroundColor Gray

# Start TypeScript watch in background
$WatchJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot
    npm run watch
}

Write-Host "TypeScript watch mode started (Job ID: $($WatchJob.Id))" -ForegroundColor Green
Write-Host "`nWhen you make changes, run: .\dev-reload.ps1" -ForegroundColor Yellow
Write-Host "Or press 'R' to reload now`n" -ForegroundColor Yellow

try {
    while ($true) {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Key -eq 'R') {
                Write-Host "`nReloading extension..." -ForegroundColor Cyan
                & "$PSScriptRoot\dev-reload.ps1"
            } elseif ($key.Key -eq 'C' -and $key.Modifiers -eq 'Control') {
                break
            }
        }
        Start-Sleep -Milliseconds 100
    }
} finally {
    Write-Host "`nStopping watch mode..." -ForegroundColor Yellow
    Stop-Job $WatchJob
    Remove-Job $WatchJob
    Write-Host "Watch mode stopped." -ForegroundColor Green
}
