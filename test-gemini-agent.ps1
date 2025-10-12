# Test script for the new Gemini AI Agent endpoint
# Tests both Gemini API and Vertex AI modes

# Configuration
$BASE_URL = if ($env:BASE_URL) { $env:BASE_URL } else { "https://us-central1-tradehustle88-resume-builder.cloudfunctions.net" }
$TEST_EMAIL = "test@tradehustle.dev"
$TEST_PROMPT = "Write a professional summary for a software engineer with 5 years of experience."

Write-Host "🧪 Testing Gemini AI Agent Endpoint" -ForegroundColor Green
Write-Host "📍 Base URL: $BASE_URL" -ForegroundColor Cyan
Write-Host "✉️  Test Email: $TEST_EMAIL" -ForegroundColor Cyan
Write-Host ""

# Function to get auth token (mock for testing)
function Get-TestToken {
    return "mock-firebase-token-for-testing"
}

# Test 1: Health check to verify environment
Write-Host "🔍 Step 1: Checking service health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$BASE_URL/api/status" -Method Get
    $healthResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Test Gemini API mode (default)
Write-Host "🤖 Step 2: Testing Gemini API mode..." -ForegroundColor Yellow
$token = Get-TestToken

$geminiBody = @{
    prompt = $TEST_PROMPT
    useVertexAI = $false
    model = "gemini-1.5-flash"
} | ConvertTo-Json

try {
    $geminiResponse = Invoke-RestMethod -Uri "$BASE_URL/api/geminiAgent" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $geminiBody
    
    Write-Host "Response:" -ForegroundColor Green
    $geminiResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Gemini API test failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Test Vertex AI mode
Write-Host "🔬 Step 3: Testing Vertex AI mode..." -ForegroundColor Yellow
$vertexBody = @{
    prompt = $TEST_PROMPT
    useVertexAI = $true
    model = "gemini-1.5-flash"
} | ConvertTo-Json

try {
    $vertexResponse = Invoke-RestMethod -Uri "$BASE_URL/api/geminiAgent" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $vertexBody
    
    Write-Host "Response:" -ForegroundColor Green
    $vertexResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Vertex AI test failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Test without authentication (should fail)
Write-Host "🚫 Step 4: Testing without authentication (should fail)..." -ForegroundColor Yellow
$unauthBody = @{ prompt = "test" } | ConvertTo-Json

try {
    $unauthResponse = Invoke-RestMethod -Uri "$BASE_URL/api/geminiAgent" `
        -Method Post `
        -ContentType "application/json" `
        -Body $unauthBody
    
    Write-Host "Response:" -ForegroundColor Red
    $unauthResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ Authentication properly rejected: $($_.Exception.Message)" -ForegroundColor Green
}
Write-Host ""

# Test 5: Test with missing prompt (should fail)
Write-Host "⚠️  Step 5: Testing with missing prompt (should fail)..." -ForegroundColor Yellow
$noPromptBody = @{} | ConvertTo-Json

try {
    $noPromptResponse = Invoke-RestMethod -Uri "$BASE_URL/api/geminiAgent" `
        -Method Post `
        -ContentType "application/json" `
        -Headers @{ "Authorization" = "Bearer $token" } `
        -Body $noPromptBody
    
    Write-Host "Response:" -ForegroundColor Red
    $noPromptResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ Missing prompt properly rejected: $($_.Exception.Message)" -ForegroundColor Green
}
Write-Host ""

Write-Host "✅ Gemini AI Agent testing complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Usage Examples:" -ForegroundColor Cyan
Write-Host "  - Frontend integration: fetch('/api/geminiAgent', { method: 'POST', body: JSON.stringify({prompt: 'your prompt'}) })"
Write-Host "  - Vertex AI mode: Add 'useVertexAI: true' to request body"
Write-Host "  - Custom model: Add 'model: 'gemini-1.5-pro'' to request body"