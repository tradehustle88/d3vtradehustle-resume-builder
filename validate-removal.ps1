# Validation Script for Framer Motion Removal
# Checks for remaining references and validates TypeScript

Write-Host "🔍 Validating Framer Motion Removal..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
$frontendRoot = Join-Path $projectRoot "frontend"
$hasErrors = $false

# Change to frontend directory
Push-Location $frontendRoot

try {
    # Check 1: Search for remaining framer-motion imports
    Write-Host "1️⃣  Checking for remaining framer-motion imports..." -ForegroundColor Yellow
    $imports = Select-String -Path "src/**/*.tsx", "src/**/*.ts" -Pattern "from ['`"]framer-motion['`"]" -SimpleMatch
    
    if ($imports) {
        Write-Host "   ❌ Found framer-motion imports:" -ForegroundColor Red
        $imports | ForEach-Object {
            Write-Host "      $($_.Path):$($_.LineNumber)" -ForegroundColor Red
        }
        $hasErrors = $true
    } else {
        Write-Host "   ✅ No framer-motion imports found" -ForegroundColor Green
    }
    Write-Host ""

    # Check 2: Search for motion.* tags
    Write-Host "2️⃣  Checking for remaining motion.* tags..." -ForegroundColor Yellow
    $motionTags = Select-String -Path "src/**/*.tsx" -Pattern "</?motion\." -SimpleMatch
    
    if ($motionTags) {
        Write-Host "   ❌ Found motion tags:" -ForegroundColor Red
        $motionTags | ForEach-Object {
            Write-Host "      $($_.Path):$($_.LineNumber)" -ForegroundColor Red
        }
        $hasErrors = $true
    } else {
        Write-Host "   ✅ No motion tags found" -ForegroundColor Green
    }
    Write-Host ""

    # Check 3: Search for AnimatePresence
    Write-Host "3️⃣  Checking for remaining AnimatePresence..." -ForegroundColor Yellow
    $animatePresence = Select-String -Path "src/**/*.tsx" -Pattern "AnimatePresence" -SimpleMatch
    
    if ($animatePresence) {
        Write-Host "   ❌ Found AnimatePresence:" -ForegroundColor Red
        $animatePresence | ForEach-Object {
            Write-Host "      $($_.Path):$($_.LineNumber)" -ForegroundColor Red
        }
        $hasErrors = $true
    } else {
        Write-Host "   ✅ No AnimatePresence found" -ForegroundColor Green
    }
    Write-Host ""

    # Check 4: Verify package.json
    Write-Host "4️⃣  Checking package.json..." -ForegroundColor Yellow
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    if ($packageJson.dependencies."framer-motion" -or $packageJson.devDependencies."framer-motion") {
        Write-Host "   ⚠️  framer-motion still in package.json (run: npm uninstall framer-motion)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ framer-motion not in package.json" -ForegroundColor Green
    }
    Write-Host ""

    # Check 5: TypeScript validation
    Write-Host "5️⃣  Running TypeScript validation..." -ForegroundColor Yellow
    $tscOutput = npm run type-check 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ TypeScript validation passed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ TypeScript validation failed:" -ForegroundColor Red
        Write-Host $tscOutput -ForegroundColor Red
        $hasErrors = $true
    }
    Write-Host ""

    # Check 6: ESLint validation
    Write-Host "6️⃣  Running ESLint validation..." -ForegroundColor Yellow
    $lintOutput = npm run lint 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ ESLint validation passed" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  ESLint warnings/errors found" -ForegroundColor Yellow
        Write-Host $lintOutput -ForegroundColor Yellow
    }
    Write-Host ""

    # Summary
    Write-Host "=" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    
    if ($hasErrors) {
        Write-Host "❌ VALIDATION FAILED - Please fix the issues above" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common fixes:" -ForegroundColor Yellow
        Write-Host "  • Re-run safe-framer-removal.js if references remain"
        Write-Host "  • Check for nested motion components"
        Write-Host "  • Verify all JSX props are intact"
    } else {
        Write-Host "✅ VALIDATION PASSED - All checks successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. npm run build (test production build)"
        Write-Host "  2. npm uninstall framer-motion (remove package)"
        Write-Host "  3. Test the application locally"
    }
    
    Write-Host "=" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host ""

} finally {
    Pop-Location
}

exit $(if ($hasErrors) { 1 } else { 0 })
