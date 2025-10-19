# 🔐 Quick Access - GCP Credentials Manager
# Opens Google Cloud Platform credentials page for your project

param(
    [Parameter(Mandatory=$false)]
    [switch]$Help
)

$PROJECT_ID = "tradehustleresumebuilder"
$GCP_CREDS_URL = "https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"

if ($Help) {
    Write-Host "🔐 GCP Credentials Manager" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opens Google Cloud Platform credentials page for:" -ForegroundColor White
    Write-Host "  Project: $PROJECT_ID" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor White
    Write-Host "  npm run open:gcp-creds" -ForegroundColor Gray
    Write-Host "  .\scripts\open-gcp-creds.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "What you can do there:" -ForegroundColor White
    Write-Host "  - View/manage API keys" -ForegroundColor Gray
    Write-Host "  - Revoke compromised keys" -ForegroundColor Gray
    Write-Host "  - Add domain restrictions" -ForegroundColor Gray
    Write-Host "  - Create new credentials" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

Write-Host "🔐 Opening GCP Credentials..." -ForegroundColor Cyan
Write-Host "   Project: $PROJECT_ID" -ForegroundColor Gray
Write-Host "   URL: $GCP_CREDS_URL" -ForegroundColor Gray

try {
    Start-Process $GCP_CREDS_URL
    Write-Host "✅ Browser opened successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to open browser" -ForegroundColor Red
    Write-Host "   Manually go to: $GCP_CREDS_URL" -ForegroundColor Yellow
    exit 1
}
