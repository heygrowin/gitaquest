# GitaQuest Android APK Build Script
$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "       GitaQuest Android APK Build Pipeline      " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Yellow

$rootDir = "C:\all projects\gita"
Set-Location $rootDir

# 1. Locate JDK (Adoptium Temurin 21 or local JDK)
$adoptiumJdk = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
if (Test-Path $adoptiumJdk) {
    $env:JAVA_HOME = $adoptiumJdk
    $env:Path = "$adoptiumJdk\bin;$env:Path"
    Write-Host "[✓] JAVA_HOME set to Adoptium JDK 21: $env:JAVA_HOME" -ForegroundColor Green
} else {
    $jdkDir = Get-ChildItem -Path "C:\Program Files\Eclipse Adoptium" -Directory -Filter "*jdk*" -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $jdkDir) {
        $jdkDir = Get-ChildItem -Path $rootDir -Directory -Filter "*jdk*" -ErrorAction SilentlyContinue | Select-Object -First 1
    }
    if ($jdkDir) {
        $env:JAVA_HOME = $jdkDir.FullName
        $env:Path = "$($jdkDir.FullName)\bin;$env:Path"
        Write-Host "[✓] JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
    } else {
        Write-Host "[!] Checking system Java..." -ForegroundColor Yellow
    }
}

java -version
if ($LASTEXITCODE -ne 0) {
    Write-Error "Java is not available. Please ensure JDK 17 is extracted."
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

# 4. Assemble Debug APK
Write-Host "`n[3/4] Compiling Android project with Gradle..." -ForegroundColor Cyan
Set-Location "$rootDir\android"

# Set Android SDK location if present
if (Test-Path "$rootDir\android-sdk") {
    $env:ANDROID_HOME = "$rootDir\android-sdk"
    $env:ANDROID_SDK_ROOT = "$rootDir\android-sdk"
}

.\gradlew.bat assembleDebug --stacktrace
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle build failed."
}

Set-Location $rootDir

# 5. Output APK Verification
$apkSource = "$rootDir\android\app\build\outputs\apk\debug\app-debug.apk"
$apkDest = "$rootDir\GitaQuest.apk"

if (Test-Path $apkSource) {
    Copy-Item $apkSource $apkDest -Force
    # Also keep gita-sadhana-debug.apk as copy if needed
    Copy-Item $apkSource "$rootDir\gita-sadhana-debug.apk" -Force -ErrorAction SilentlyContinue
    $fileInfo = Get-Item $apkDest
    $hash = (Get-FileHash $apkDest -Algorithm SHA256).Hash

    Write-Host "`n=================================================" -ForegroundColor Green
    Write-Host " [✓] APK BUILD SUCCESSFUL! " -ForegroundColor Green
    Write-Host "=================================================" -ForegroundColor Green
    Write-Host "APK Location: $apkDest" -ForegroundColor White
    Write-Host "File Size:    $([math]::Round($fileInfo.Length / 1MB, 2)) MB ($($fileInfo.Length) bytes)" -ForegroundColor White
    Write-Host "SHA256:       $hash" -ForegroundColor Gray
    Write-Host "=================================================" -ForegroundColor Green
} else {
    Write-Error "APK file not found at expected location: $apkSource"
}
