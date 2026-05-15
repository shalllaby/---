$source = "api-monorepo"
$target = "deploy_hostinger"

# Clean target if exists
if (Test-Path $target) { Remove-Item -Recurse -Force $target }
New-Item -ItemType Directory -Path $target | Out-Null

# Create folders
New-Item -ItemType Directory -Path "$target\apps\api" -Force | Out-Null
New-Item -ItemType Directory -Path "$target\packages\database\prisma" -Force | Out-Null

# Copy apps/api/dist
if (Test-Path "$source\apps\api\dist") {
    Copy-Item -Recurse -Force "$source\apps\api\dist" "$target\apps\api\dist"
} else {
    Write-Host "WARNING: dist not found"
}

# Copy packages/database (schema and package.json)
Copy-Item -Force "$source\packages\database\prisma\schema.prisma" "$target\packages\database\prisma\schema.prisma"
Copy-Item -Force "$source\packages\database\package.json" "$target\packages\database\package.json"

# Copy package.json files
Copy-Item -Force "$source\package.json" "$target\package.json"
Copy-Item -Force "$source\apps\api\package.json" "$target\apps\api\package.json"

# Copy index.js
Copy-Item -Force "$source\index.js" "$target\index.js"

# Add pnpm-workspace.yaml so workspaces work on hostinger if they use pnpm
if (Test-Path "$source\pnpm-workspace.yaml") {
    Copy-Item -Force "$source\pnpm-workspace.yaml" "$target\pnpm-workspace.yaml"
}

# Zip it
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipFile = "deploy_hostinger.zip"
if (Test-Path $zipFile) { Remove-Item -Force $zipFile }
[System.IO.Compression.ZipFile]::CreateFromDirectory($target, $zipFile, 'Optimal', $false)

Write-Host "Zipping completed."
