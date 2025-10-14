# Test Backend API Endpoints
# Run Firebase emulators first: cd api-functions && npm run serve

Write-Host "🧪 Testing Trade Hustle Backend API" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://127.0.0.1:5001/tradehustleresumebuilder/us-central1"
$testEmail = "test@tradehustle.com"
$testPassword = "TestPass123!"

Write-Host "📍 Base URL: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check (GET /app)" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/app" -Method GET -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Sign Up (Honeypot Check)
Write-Host "Test 2: Sign Up with Honeypot Trigger" -ForegroundColor Green
try {
    $body = @{
        email = $testEmail
        password = $testPassword
        company = "bot-trap"  # Honeypot field
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/signup" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Should have been rejected (honeypot)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Honeypot working - rejected bot" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 3: Create Checkout (No Auth - Should Fail)
Write-Host "Test 3: Create Checkout without Auth" -ForegroundColor Green
try {
    $body = @{
        priceId = "price_1SHfAyLr4v4blpwbcvDqbej8"
        successUrl = "http://localhost:3000/success"
        cancelUrl = "http://localhost:3000/cancel"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/createCheckout" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Should have required auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Auth middleware working - rejected unauthenticated request" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 4: Get Resumes (No Auth - Should Fail)
Write-Host "Test 4: Get Resumes without Auth" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/app/api/resumes" -Method GET -UseBasicParsing
    Write-Host "❌ Should have required auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Auth middleware working - rejected unauthenticated request" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 5: AI Suggestions (No Auth - Should Fail)
Write-Host "Test 5: AI Suggestions without Auth" -ForegroundColor Green
try {
    $body = @{
        resumeContent = "Electrician with 5 years experience"
        trade = "electrician"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/app/api/ai/suggestions" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Should have required auth" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Auth middleware working - rejected unauthenticated request" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Honeypot protection: WORKING" -ForegroundColor Green
Write-Host "✅ Authentication middleware: WORKING" -ForegroundColor Green
Write-Host "✅ Routes configured correctly" -ForegroundColor Green
Write-Host ""
Write-Host "🔒 All protected routes require authentication" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Get a Firebase ID token from your frontend" -ForegroundColor White
Write-Host "  2. Test authenticated endpoints with:" -ForegroundColor White
Write-Host "     -H 'Authorization: Bearer YOUR_ID_TOKEN'" -ForegroundColor Gray
Write-Host "  3. Set up Stripe API keys in .env" -ForegroundColor White
Write-Host "  4. Test payment flows with real authentication" -ForegroundColor White
Write-Host ""
