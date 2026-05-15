$ErrorActionPreference = "Stop"

Write-Host "Creating web.zip..."
$webTemp = "web-deploy"
if (Test-Path $webTemp) { Remove-Item -Path $webTemp -Recurse -Force }
New-Item -ItemType Directory -Force -Path $webTemp | Out-Null
Copy-Item -Path "apps\web\.next\standalone\*" -Destination $webTemp -Recurse -Force
Copy-Item -Path "apps\web\public" -Destination "$webTemp\public" -Recurse -Force
New-Item -ItemType Directory -Force -Path "$webTemp\.next" | Out-Null
Copy-Item -Path "apps\web\.next\static" -Destination "$webTemp\.next\static" -Recurse -Force
Set-Content -Path "$webTemp\.env.production" -Value 'NEXT_PUBLIC_API_URL="https://api.deira.store/api/v1"' -Encoding UTF8

if (Test-Path "web.zip") { Remove-Item "web.zip" -Force }
Compress-Archive -Path "$webTemp\*" -DestinationPath "web.zip" -Force
Remove-Item -Path $webTemp -Recurse -Force

Write-Host "Creating api-monorepo.zip..."
$apiTemp = "api-deploy"
if (Test-Path $apiTemp) { Remove-Item -Path $apiTemp -Recurse -Force }
New-Item -ItemType Directory -Force -Path $apiTemp | Out-Null

# Use robocopy to copy all files excluding specific ones.
robocopy . $apiTemp /E /XD node_modules .git .next /XF web.zip api-monorepo.zip "PostgreSQL Password  10mohamed10.txt" "build-zips.ps1" | Out-Null

if (Test-Path "api-monorepo.zip") { Remove-Item "api-monorepo.zip" -Force }
Compress-Archive -Path "$apiTemp\*" -DestinationPath "api-monorepo.zip" -Force
Remove-Item -Path $apiTemp -Recurse -Force

Write-Host "Done."
$webSize = (Get-Item "web.zip").Length / 1MB
$apiSize = (Get-Item "api-monorepo.zip").Length / 1MB

Write-Host "web.zip size: $([math]::Round($webSize, 2)) MB"
Write-Host "api-monorepo.zip size: $([math]::Round($apiSize, 2)) MB"
