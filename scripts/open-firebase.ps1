# 🔥 Quick Access - Firebase Console
# Opens Firebase Console for your project

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("general", "auth", "firestore", "storage", "functions", "hosting", "analytics")]
    [string]$Page = "general",
    
    [Parameter(Mandatory=$false)]
    [switch]$Help
)

$PROJECT_ID = "tradehustleresumebuilder"

$FIREBASE_URLS = @{
    "general" = "https://console.firebase.google.com/project/$PROJECT_ID/settings/general/"
    "auth" = "https://console.firebase.google.com/project/$PROJECT_ID/authentication/users"
    "firestore" = "https://console.firebase.google.com/project/$PROJECT_ID/firestore/data"
    "storage" = "https://console.firebase.google.com/project/$PROJECT_ID/storage"
    "functions" = "https://console.firebase.google.com/project/$PROJECT_ID/functions"
    "hosting" = "https://console.firebase.google.com/project/$PROJECT_ID/hosting"
    "analytics" = "https://console.firebase.google.com/project/$PROJECT_ID/analytics"
}

if ($Help) {
    Write-Host "🔥 Firebase Console Quick Access" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opens Firebase Console for project: $PROJECT_ID" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor White
    Write-Host "  npm run open:firebase" -ForegroundColor Gray
    Write-Host "  npm run open:firebase:auth" -ForegroundColor Gray
    Write-Host "  .\scripts\open-firebase.ps1 -Page <page>" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available Pages:" -ForegroundColor White
    Write-Host "  general    - Project settings (default)" -ForegroundColor Gray
    Write-Host "  auth       - Authentication users" -ForegroundColor Gray
    Write-Host "  firestore  - Firestore database" -ForegroundColor Gray
    Write-Host "  storage    - Cloud Storage" -ForegroundColor Gray
    Write-Host "  functions  - Cloud Functions" -ForegroundColor Gray
    Write-Host "  hosting    - Firebase Hosting" -ForegroundColor Gray
    Write-Host "  analytics  - Google Analytics" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

$url = $FIREBASE_URLS[$Page]

Write-Host "🔥 Opening Firebase Console..." -ForegroundColor Cyan
Write-Host "   Project: $PROJECT_ID" -ForegroundColor Gray
Write-Host "   Page: $Page" -ForegroundColor Gray

try {
    Start-Process $url
    Write-Host "✅ Browser opened successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to open browser" -ForegroundColor Red
    Write-Host "   Manually go to: $url" -ForegroundColor Yellow
    exit 1
}
