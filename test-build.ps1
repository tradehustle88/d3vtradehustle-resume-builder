# Test Build Script
# Runs a production build and checks for errors

Write-Host "🔨 Testing Production Build..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"

Push-Location $frontendRoot

try {
    # Clean previous builds
    Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Host "   ✅ Cleaned .next directory" -ForegroundColor Green
    }
    if (Test-Path "out") {
        Remove-Item "out" -Recurse -Force
        Write-Host "   ✅ Cleaned out directory" -ForegroundColor Green
    }
    Write-Host ""

    # Run build
    Write-Host "📦 Running npm run build..." -ForegroundColor Yellow
    $buildOutput = npm run build 2>&1
    $buildExitCode = $LASTEXITCODE
    
    Write-Host $buildOutput
    Write-Host ""

    if ($buildExitCode -eq 0) {
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed with exit code: $buildExitCode" -ForegroundColor Red
        exit 1
    }
    Write-Host ""

    # Run export
    Write-Host "📤 Running npm run export..." -ForegroundColor Yellow
    $exportOutput = npm run export 2>&1
    $exportExitCode = $LASTEXITCODE
    
    Write-Host $exportOutput
    Write-Host ""

    if ($exportExitCode -eq 0) {
        Write-Host "✅ Export completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Export failed with exit code: $exportExitCode" -ForegroundColor Red
        exit 1
    }
    Write-Host ""

    # Check output size
    Write-Host "📊 Checking bundle size..." -ForegroundColor Yellow
    
    if (Test-Path "out") {
        $outSize = (Get-ChildItem "out" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   Total output size: $([math]::Round($outSize, 2)) MB" -ForegroundColor Cyan
        
        # Check for largest files
        Write-Host "   Largest files:" -ForegroundColor Cyan
        Get-ChildItem "out" -Recurse -File | 
            Sort-Object Length -Descending | 
            Select-Object -First 5 | 
            ForEach-Object {
                $size = $_.Length / 1KB
                Write-Host "      $($_.Name): $([math]::Round($size, 2)) KB" -ForegroundColor Gray
            }
    }
    Write-Host ""

    # Final summary
    Write-Host "=" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to deploy:" -ForegroundColor Yellow
    Write-Host "  firebase deploy --only hosting" -ForegroundColor White
    Write-Host "=" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host "❌ Error during build test: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
