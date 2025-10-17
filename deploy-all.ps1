# Deploy Trade Resume System - Complete Workflow

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║     Trade Hustle Resume Builder - Deployment Script          ║
║     Frontend + Backend + Trade Data Generation               ║
╚═══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

param(
    [switch]$GenerateTrades,
    [switch]$Frontend,
    [switch]$Backend,
    [switch]$All,
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

# === STEP 1: Generate New Trades ===
if ($GenerateTrades -or $All) {
    Write-Host "`n[STEP 1] Generating Trade Data..." -ForegroundColor Yellow
    
    if (Test-Path ".\generate-trades.ps1") {
        & .\generate-trades.ps1 -All -Verbose
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Trade generation failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️  generate-trades.ps1 not found, skipping..." -ForegroundColor Yellow
    }
}

# === STEP 2: Test API ===
if (-not $SkipTests) {
    Write-Host "`n[STEP 2] Testing Vertex AI Integration..." -ForegroundColor Yellow
    
    if (Test-Path ".\test-vertex-ai.ps1") {
        & .\test-vertex-ai.ps1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ API tests failed" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️  test-vertex-ai.ps1 not found, skipping tests..." -ForegroundColor Yellow
    }
}

# === STEP 3: Build Frontend ===
if ($Frontend -or $All) {
    Write-Host "`n[STEP 3] Building Frontend..." -ForegroundColor Yellow
    
    Push-Location frontend
    
    Write-Host "   Running type check..." -ForegroundColor Gray
    npm run type-check
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ TypeScript errors found" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "   Running lint..." -ForegroundColor Gray
    npm run lint
    
    Write-Host "   Building production bundle..." -ForegroundColor Gray
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "   Exporting static files..." -ForegroundColor Gray
    npm run export
    
    Pop-Location
    
    Write-Host "✅ Frontend build complete" -ForegroundColor Green
}

# === STEP 4: Git Commit ===
Write-Host "`n[STEP 4] Committing Changes..." -ForegroundColor Yellow

$changedFiles = git status --porcelain
if ($changedFiles) {
    Write-Host "   Files to commit:" -ForegroundColor Gray
    git status --short
    
    git add .
    
    $commitMessage = "feat: Complete frontend integration with trade generation

- Add /generate-resume page with 5-step wizard
- Create TradeCard, ProgressSidebar, ResumePreviewNew components
- Integrate generateTradeResume API client
- Add generate-trades.ps1 automation script
- Update TypeScript types (UserData, TradePlaceholderMap)
- Add comprehensive documentation"
    
    git commit -m $commitMessage
    
    Write-Host "✅ Changes committed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
}

# === STEP 5: Deploy Functions ===
if ($Backend -or $All) {
    Write-Host "`n[STEP 5] Deploying Firebase Functions..." -ForegroundColor Yellow
    
    firebase deploy --only functions
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Functions deployment failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Functions deployed" -ForegroundColor Green
}

# === STEP 6: Deploy Hosting ===
if ($Frontend -or $All) {
    Write-Host "`n[STEP 6] Deploying Firebase Hosting..." -ForegroundColor Yellow
    
    firebase deploy --only hosting
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Hosting deployment failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Hosting deployed" -ForegroundColor Green
}

# === STEP 7: Git Push ===
Write-Host "`n[STEP 7] Pushing to GitHub..." -ForegroundColor Yellow

$currentBranch = git branch --show-current
Write-Host "   Branch: $currentBranch" -ForegroundColor Gray

git push origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git push failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Pushed to GitHub" -ForegroundColor Green

# === COMPLETE ===
Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║                  DEPLOYMENT COMPLETE                          ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Green

Write-Host "🎉 Trade Resume System is Live!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Visit your resume generator: https://YOUR_DOMAIN/generate-resume" -ForegroundColor White
Write-Host "2. Test with a real Firebase user account" -ForegroundColor White
Write-Host "3. Verify API calls work end-to-end" -ForegroundColor White
Write-Host "4. Monitor Firebase Functions logs for errors" -ForegroundColor White

Write-Host "`nUseful Commands:" -ForegroundColor Cyan
Write-Host "  firebase functions:log                    # View function logs" -ForegroundColor Gray
Write-Host "  firebase hosting:channel:deploy test      # Deploy to preview channel" -ForegroundColor Gray
Write-Host "  .\generate-trades.ps1 -Trade CDL_DRIVER   # Add single trade" -ForegroundColor Gray
Write-Host "  .\test-vertex-ai.ps1                      # Test API integration" -ForegroundColor Gray
