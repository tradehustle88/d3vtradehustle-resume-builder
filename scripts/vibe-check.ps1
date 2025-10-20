#!/usr/bin/env pwsh
Write-Host "⚡ Trade Hustle Vibe Check ⚡" -ForegroundColor Cyan

# Auth
try {
    gcloud auth print-access-token *>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Auth token valid" -ForegroundColor Green
    } else {
        Write-Host "🔒 Token expired — run: gcloud auth login" -ForegroundColor Yellow
    }
} catch {
    Write-Host "🔒 gcloud not found or token expired" -ForegroundColor Yellow
}

# Git
try {
    $gitStatus = git status -s 2>$null
    if ($gitStatus) {
        Write-Host "🟡 Git changes detected" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Git repo clean" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Not a git repository" -ForegroundColor Red
}

# Firebase
try {
    firebase projects:list *>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🔥 Firebase connected" -ForegroundColor Green
    } else {
        Write-Host "❌ Firebase not authenticated" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Firebase CLI not found" -ForegroundColor Red
}

# Disk space
Write-Host "💾 Disk space:" -ForegroundColor Cyan
Get-PSDrive C | Select-Object @{N="Drive";E={$_.Name}},@{N="Used (GB)";E={[math]::Round($_.Used/1GB,2)}},@{N="Free (GB)";E={[math]::Round($_.Free/1GB,2)}},@{N="Total (GB)";E={[math]::Round(($_.Used+$_.Free)/1GB,2)}} | Format-Table

# Node version
try {
    $nodeVersion = node -v
    Write-Host "⚙️  Node: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Node not found" -ForegroundColor Red
}

# NPM packages check
try {
    $outdated = npm outdated 2>$null
    if ($outdated) {
        Write-Host "📦 NPM packages need updates" -ForegroundColor Yellow
    } else {
        Write-Host "✅ NPM packages up to date" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not check NPM packages" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Hustle level: optimal" -ForegroundColor Magenta
Write-Host ""

# Quick access shortcuts
Write-Host "⚡ Quick Access Commands:" -ForegroundColor Cyan
Write-Host "  npm run open:gcp-creds       # GCP Credentials" -ForegroundColor Gray
Write-Host "  npm run open:firebase        # Firebase Console" -ForegroundColor Gray
Write-Host "  npm run open:firebase:auth   # Firebase Auth" -ForegroundColor Gray
Write-Host "  npm run open:github          # GitHub Repo" -ForegroundColor Gray
