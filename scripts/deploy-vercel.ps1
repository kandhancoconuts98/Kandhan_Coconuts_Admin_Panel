# Deploy Kandhan Coconuts Next.js app to Vercel
# Prereq: npx vercel login (once)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
Write-Host @"

Required env vars in Vercel project settings:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  SUPABASE_SERVICE_ROLE_KEY
  COCONEST_FARM_ID=Kandhan Coconuts

"@

npx vercel deploy --prod
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "After deploy, set mobile/.env:" -ForegroundColor Green
Write-Host "  EXPO_PUBLIC_API_URL=https://YOUR-PROJECT.vercel.app"
Write-Host ""
Write-Host "Then rebuild APK: npm run mobile:apk"
