# Test Resume Builder Wizard
# Run this from PowerShell: .\test-wizard.ps1

Write-Host "🧪 Testing Resume Builder Wizard Components" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "frontend\src\components\HustleEngine.tsx")) {
    Write-Host "❌ Error: Please run this from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found HustleEngine.tsx" -ForegroundColor Green

# Check dependencies
Write-Host "`n📦 Checking component files..." -ForegroundColor Yellow

$components = @(
    "frontend\src\components\HustleEngine.tsx",
    "frontend\src\components\ResumePreview.tsx",
    "frontend\src\components\PricingModal.tsx"
)

$allFound = $true
foreach ($component in $components) {
    if (Test-Path $component) {
        Write-Host "  ✓ $component" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $component (MISSING)" -ForegroundColor Red
        $allFound = $false
    }
}

if (-not $allFound) {
    Write-Host "`n❌ Some components are missing!" -ForegroundColor Red
    exit 1
}

# Check pages
Write-Host "`n📄 Checking page files..." -ForegroundColor Yellow

$pages = @(
    "frontend\src\app\wizard\page.tsx",
    "frontend\src\app\builder-advanced\page.tsx"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "  ✓ $page" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $page (MISSING)" -ForegroundColor Red
    }
}

# Check type definitions
Write-Host "`n🔤 Checking TypeScript types..." -ForegroundColor Yellow

if (Test-Path "frontend\src\types\database.ts") {
    Write-Host "  ✓ database.ts types found" -ForegroundColor Green
} else {
    Write-Host "  ✗ database.ts types missing" -ForegroundColor Red
}

# Check Firebase config
Write-Host "`n🔥 Checking Firebase configuration..." -ForegroundColor Yellow

if (Test-Path "frontend\src\lib\firebase.ts") {
    Write-Host "  ✓ firebase.ts found" -ForegroundColor Green
} else {
    Write-Host "  ✗ firebase.ts missing" -ForegroundColor Red
}

# Check analytics
if (Test-Path "frontend\src\lib\analytics.ts") {
    Write-Host "  ✓ analytics.ts found" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  analytics.ts not found (optional)" -ForegroundColor Yellow
}

Write-Host "`n🎯 Testing URLs (requires dev server running)..." -ForegroundColor Yellow
Write-Host "To start the dev server, run:" -ForegroundColor Gray
Write-Host "  cd frontend && npm run dev`n" -ForegroundColor Gray

$testUrls = @(
    "http://localhost:3000/wizard?trade=electrician",
    "http://localhost:3000/wizard?trade=plumber",
    "http://localhost:3000/builder-advanced?trade=hvac",
    "http://localhost:3000/builder?trade=carpenter"
)

Write-Host "Test these URLs in your browser:" -ForegroundColor Cyan
foreach ($url in $testUrls) {
    Write-Host "  • $url" -ForegroundColor White
}

# Summary
Write-Host "`n✨ Component Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "1️⃣  HustleEngine.tsx - 4-step resume builder" -ForegroundColor White
Write-Host "2️⃣  ResumePreview.tsx - Live preview with ATS scoring" -ForegroundColor White
Write-Host "3️⃣  PricingModal.tsx - Subscription tier selection" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host "`n📚 Quick Start Guide:" -ForegroundColor Cyan
Write-Host "1. Start dev server: cd frontend && npm run dev" -ForegroundColor White
Write-Host "2. Visit: http://localhost:3000/wizard?trade=electrician" -ForegroundColor White
Write-Host "3. Sign in with Google or email" -ForegroundColor White
Write-Host "4. Fill out the 4-step wizard" -ForegroundColor White
Write-Host "5. Click 'Save Resume' to save to Firestore" -ForegroundColor White

Write-Host "`n🔧 Customization:" -ForegroundColor Cyan
Write-Host "• Colors: Update #ffd700 (gold) and #001a33 (navy) in components" -ForegroundColor White
Write-Host "• Validation: Modify validateStep functions in HustleEngine.tsx" -ForegroundColor White
Write-Host "• Fields: Add/remove fields in the form state" -ForegroundColor White
Write-Host "• Analytics: Events tracked in lib/analytics.ts" -ForegroundColor White

Write-Host "`n📖 Documentation:" -ForegroundColor Cyan
Write-Host "See WIZARD_INTEGRATION_GUIDE.md for complete documentation" -ForegroundColor White

Write-Host "`n✅ All checks complete!`n" -ForegroundColor Green
