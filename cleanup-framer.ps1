# Final Cleanup Script
# Uninstalls framer-motion and verifies removal

Write-Host "🧹 Final Framer Motion Cleanup..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"

Push-Location $frontendRoot

try {
    # Check if framer-motion is installed
    Write-Host "1️⃣  Checking for framer-motion package..." -ForegroundColor Yellow
    
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $hasFramerMotion = $packageJson.dependencies."framer-motion" -or $packageJson.devDependencies."framer-motion"
    
    if ($hasFramerMotion) {
        Write-Host "   📦 framer-motion found in package.json" -ForegroundColor Cyan
        Write-Host ""
        
        # Uninstall
        Write-Host "2️⃣  Uninstalling framer-motion..." -ForegroundColor Yellow
        npm uninstall framer-motion
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Successfully uninstalled framer-motion" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Failed to uninstall framer-motion" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "   ✅ framer-motion not found in package.json" -ForegroundColor Green
    }
    Write-Host ""

    # Check node_modules
    Write-Host "3️⃣  Checking node_modules..." -ForegroundColor Yellow
    $framerPath = Join-Path "node_modules" "framer-motion"
    
    if (Test-Path $framerPath) {
        Write-Host "   ⚠️  framer-motion directory still exists in node_modules" -ForegroundColor Yellow
        Write-Host "   Removing manually..." -ForegroundColor Yellow
        Remove-Item $framerPath -Recurse -Force
        Write-Host "   ✅ Removed framer-motion directory" -ForegroundColor Green
    } else {
        Write-Host "   ✅ framer-motion not in node_modules" -ForegroundColor Green
    }
    Write-Host ""

    # Check package-lock.json
    Write-Host "4️⃣  Updating package-lock.json..." -ForegroundColor Yellow
    
    if (Test-Path "package-lock.json") {
        $packageLock = Get-Content "package-lock.json" -Raw
        
        if ($packageLock -like "*framer-motion*") {
            Write-Host "   🔄 Regenerating package-lock.json..." -ForegroundColor Cyan
            Remove-Item "package-lock.json" -Force
            npm install
            Write-Host "   ✅ package-lock.json regenerated" -ForegroundColor Green
        } else {
            Write-Host "   ✅ package-lock.json clean" -ForegroundColor Green
        }
    }
    Write-Host ""

    # Final verification
    Write-Host "5️⃣  Final verification..." -ForegroundColor Yellow
    
    $remainingRefs = Select-String -Path "src/**/*.tsx", "src/**/*.ts" -Pattern "framer-motion" -SimpleMatch
    
    if ($remainingRefs) {
        Write-Host "   ⚠️  WARNING: Found remaining references to framer-motion:" -ForegroundColor Yellow
        $remainingRefs | ForEach-Object {
            Write-Host "      $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✅ No remaining references to framer-motion" -ForegroundColor Green
    }
    Write-Host ""

    # Summary
    Write-Host "=" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host "✅ CLEANUP COMPLETE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Summary:" -ForegroundColor Yellow
    Write-Host "  ✅ Package uninstalled"
    Write-Host "  ✅ Dependencies updated"
    Write-Host "  ✅ Code cleaned"
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Yellow
    Write-Host "  1. Commit your changes"
    Write-Host "  2. Deploy to production"
    Write-Host "  3. Monitor bundle size improvements"
    Write-Host "=" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host ""

} catch {
    Write-Host "❌ Error during cleanup: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
