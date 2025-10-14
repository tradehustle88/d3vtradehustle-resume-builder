# Backend Setup & Lint Fix Script
# Fixes CRLF line ending errors and installs Stripe dependency

Write-Host "🔧 Trade Hustle Backend Setup" -ForegroundColor Cyan
Write-Host ""

# Navigate to api-functions
Set-Location -Path "api-functions"

# Install new dependencies (Stripe)
Write-Host "📦 Installing Stripe dependency..." -ForegroundColor Yellow
npm install

# Run ESLint auto-fix
Write-Host "🧹 Running ESLint auto-fix (fixing CRLF → LF line endings)..." -ForegroundColor Yellow
npm run lint -- --fix

# Check for remaining errors
Write-Host "✅ Checking for remaining errors..." -ForegroundColor Yellow
npm run lint

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Add Stripe API keys to .env file"
Write-Host "  2. Test locally: npm run serve"
Write-Host "  3. Deploy: npm run deploy"
Write-Host ""
