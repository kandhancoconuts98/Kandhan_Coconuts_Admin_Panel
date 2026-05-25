# Build React Native (Expo) release APK
param(
  [string]$ApiUrl = ''
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$mobile = Join-Path $root 'mobile'
Set-Location $mobile

if ($ApiUrl) {
  "EXPO_PUBLIC_API_URL=$($ApiUrl.TrimEnd('/'))" | Set-Content -Path '.env' -Encoding ascii
  Write-Host "EXPO_PUBLIC_API_URL=$ApiUrl"
} elseif (-not (Test-Path '.env')) {
  Copy-Item '.env.example' '.env'
  Write-Host "Created mobile/.env from example — edit EXPO_PUBLIC_API_URL before production use."
}

$sdk = $env:ANDROID_HOME
if (-not $sdk) { $sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
if (-not (Test-Path $sdk)) {
  Write-Host 'Install Android Studio and SDK first.' -ForegroundColor Red
  exit 1
}

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'

if (-not (Test-Path 'android')) {
  Write-Host 'Running expo prebuild...'
  npx expo prebuild --platform android --no-install
}

$localProps = Join-Path $mobile 'android\local.properties'
"sdk.dir=$($sdk -replace '\\','/')" | Set-Content -Path $localProps -Encoding ascii

Set-Location (Join-Path $mobile 'android')
.\gradlew.bat assembleRelease

$apk = Get-ChildItem -Path 'app\build\outputs\apk\release' -Recurse -Filter '*.apk' -ErrorAction SilentlyContinue | Select-Object -First 1
if ($apk) {
  Write-Host ""
  Write-Host "APK:" -ForegroundColor Green
  Write-Host $apk.FullName
} else {
  Write-Host "Build done — check android\app\build\outputs\apk\release\" -ForegroundColor Yellow
}
