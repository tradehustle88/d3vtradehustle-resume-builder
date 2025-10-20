# 🔑 Update Environment Variables Script
# This script helps you safely update your environment variables with new Firebase credentials

param(
    [Parameter(Mandatory=$false)]
    [string]$NewApiKey,
    
    [Parameter(Mandatory=$false)]
    [switch]$Interactive = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🔑 Firebase Environment Update" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

# Files to update
$FrontendEnv = "frontend\.env.local"
$BackendEnv = "api-functions\.env.local"

# Check if files exist
if (-not (Test-Path $FrontendEnv)) {
    Write-Host "❌ Frontend .env.local not found at: $FrontendEnv" -ForegroundColor Red
    exit 1
}

# Current values
Write-Host "📋 Current Configuration:" -ForegroundColor Yellow
Write-Host ""
$currentContent = Get-Content $FrontendEnv -Raw
if ($currentContent -match 'NEXT_PUBLIC_FIREBASE_API_KEY=(.+)') {
    $currentKey = $matches[1].Trim()
    Write-Host "Current API Key: $currentKey" -ForegroundColor Gray
    
    # Check if it's the exposed key
    if ($currentKey -eq "AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk") {
        Write-Host "⚠️  WARNING: This is the EXPOSED key!" -ForegroundColor Red
        Write-Host "   You MUST rotate this key immediately!" -ForegroundColor Red
    }
}
Write-Host ""

# Interactive mode
if ($Interactive -or -not $NewApiKey) {
    Write-Host "🔐 Get your new Firebase API key:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://console.firebase.google.com/project/tradehustleresumebuilder/settings/general/" -ForegroundColor White
    Write-Host "   2. Under 'Your apps', find your Web app" -ForegroundColor White
    Write-Host "   3. Click the gear icon → Settings" -ForegroundColor White
    Write-Host "   4. Find 'Web API Key'" -ForegroundColor White
    Write-Host "   5. Click 'Regenerate Web API Key' if needed" -ForegroundColor White
    Write-Host ""
    
    $NewApiKey = Read-Host "Enter your NEW Firebase API Key (or press Enter to skip)"
    
    if ([string]::IsNullOrWhiteSpace($NewApiKey)) {
        Write-Host "⚠️  No API key provided. Exiting..." -ForegroundColor Yellow
        exit 0
    }
}

# Validate API key format
if ($NewApiKey -notmatch '^AIza[0-9A-Za-z-_]{35}$') {
    Write-Host "⚠️  Warning: API key format doesn't match expected pattern" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "❌ Aborted" -ForegroundColor Red
        exit 0
    }
}

# Check if it's the same exposed key
if ($NewApiKey -eq "AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk") {
    Write-Host "❌ ERROR: You entered the EXPOSED key!" -ForegroundColor Red
    Write-Host "   You must generate a NEW key from Firebase Console!" -ForegroundColor Red
    exit 1
}

# Update frontend .env.local
Write-Host "📝 Updating $FrontendEnv..." -ForegroundColor Yellow

$content = Get-Content $FrontendEnv -Raw
$content = $content -replace 'NEXT_PUBLIC_FIREBASE_API_KEY=.*', "NEXT_PUBLIC_FIREBASE_API_KEY=$NewApiKey"

Set-Content -Path $FrontendEnv -Value $content -NoNewline

Write-Host "✅ Frontend environment updated" -ForegroundColor Green

# Verify the update
Write-Host ""
Write-Host "🔍 Verifying update..." -ForegroundColor Yellow
$verifyContent = Get-Content $FrontendEnv -Raw
if ($verifyContent -match "NEXT_PUBLIC_FIREBASE_API_KEY=$([regex]::Escape($NewApiKey))") {
    Write-Host "✅ Verification successful!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Could not verify update" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "✅ Frontend API key updated" -ForegroundColor Green
Write-Host ""

# Backend service account check
Write-Host "📋 Backend Configuration:" -ForegroundColor Yellow
$serviceAccountPath = "$env:USERPROFILE\.firebase\keys\serviceAccountKey.json"
if (Test-Path $serviceAccountPath) {
    Write-Host "✅ Service account found at: $serviceAccountPath" -ForegroundColor Green
} else {
    Write-Host "⚠️  Service account not found at: $serviceAccountPath" -ForegroundColor Yellow
    Write-Host "   Make sure you've moved the file there!" -ForegroundColor Gray
}

if (Test-Path $BackendEnv) {
    Write-Host "✅ Backend .env.local exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend .env.local not found" -ForegroundColor Yellow
}

# Next steps
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test the application:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Revoke the old key in Firebase Console:" -ForegroundColor White
Write-Host "   https://console.firebase.google.com/project/tradehustleresumebuilder/settings/iam" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Clean git history to remove exposed key:" -ForegroundColor White
Write-Host "   .\scripts\clean-git-history.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Environment update complete!`n" -ForegroundColor Green
