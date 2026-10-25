# GitaQuest Google Play Release Build Script (AAB & APK)
$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "   GitaQuest Google Play AAB & APK Release Build " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Yellow

$rootDir = "C:\all projects\gita"
Set-Location $rootDir

# 1. Locate JDK (Adoptium Temurin 21)
$adoptiumJdk = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
if (Test-Path $adoptiumJdk) {
    $env:JAVA_HOME = $adoptiumJdk
    $env:Path = "$adoptiumJdk\bin;$env:Path"
    Write-Host "[✓] JAVA_HOME set to Adoptium JDK 21: $env:JAVA_HOME" -ForegroundColor Green
} else {
    Write-Host "[!] Checking system Java..." -ForegroundColor Yellow
}

java -version
if ($LASTEXITCODE -ne 0) {
    Write-Error "Java is not available."
}

# 2. Build Web Bundle
Write-Host "`n[1/4] Building production web assets..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Web build failed."
}

# 3. Sync with Capacitor Android
Write-Host "`n[2/4] Syncing assets to native Android project..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Error "Capacitor sync failed."
}

# 4. Assemble Release App Bundle (AAB) & APK
Write-Host "`n[3/4] Compiling Signed Release App Bundle and APK..." -ForegroundColor Cyan
Set-Location "$rootDir\android"

.\gradlew.bat bundleRelease assembleRelease --stacktrace
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle build failed."
}

Set-Location $rootDir

# 5. Output Verification
$aabSource = "$rootDir\android\app\build\outputs\bundle\release\app-release.aab"
$aabDest = "$rootDir\GitaQuest.aab"

$apkSource = "$rootDir\android\app\build\outputs\apk\release\app-release.apk"
$apkDest = "$rootDir\GitaQuest.apk"

if (Test-Path $aabSource) {
    Copy-Item $aabSource $aabDest -Force
    $aabInfo = Get-Item $aabDest
    $aabHash = (Get-FileHash $aabDest -Algorithm SHA256).Hash

    if (Test-Path $apkSource) {
        Copy-Item $apkSource $apkDest -Force
        $apkInfo = Get-Item $apkDest
        $apkHash = (Get-FileHash $apkDest -Algorithm SHA256).Hash
    }

    Write-Host "`n=================================================" -ForegroundColor Green
    Write-Host " [✓] GOOGLE PLAY RELEASE BUILD SUCCESSFUL!       " -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Green
    Write-Host "Play Store AAB: $aabDest" -ForegroundColor White
    Write-Host "AAB Size:       $([math]::Round($aabInfo.Length / 1MB, 2)) MB ($($aabInfo.Length) bytes)" -ForegroundColor White
    Write-Host "AAB SHA256:     $aabHash" -ForegroundColor Gray
    Write-Host "-------------------------------------------------" -ForegroundColor Green
    Write-Host "Testing APK:    $apkDest" -ForegroundColor White
    Write-Host "APK Size:       $([math]::Round($apkInfo.Length / 1MB, 2)) MB ($($apkInfo.Length) bytes)" -ForegroundColor White
    Write-Host "APK SHA256:     $apkHash" -ForegroundColor Gray
    Write-Host "=================================================" -ForegroundColor Green
} else {
    Write-Error "AAB file not found at expected location: $aabSource"
}
