#!/bin/bash

# Trade Hustle Resume Builder - API Endpoint Testing
# Run these commands to test your Firebase Cloud Functions

echo "🚀 Testing Trade Hustle Resume Builder Endpoints"
echo "================================================="

BASE_URL="https://us-central1-tradehustleresumebuilder.cloudfunctions.net"

echo ""
echo "1️⃣  Testing /signup endpoint..."
echo "curl -X POST $BASE_URL/signup \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"test@example.com\",\"token\":\"dummy-recaptcha-token\"}'"
echo ""
echo "Expected: Should fail reCAPTCHA verification (dummy token)"
echo "Running..."

curl -X POST $BASE_URL/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"dummy-recaptcha-token"}'

echo ""
echo ""
echo "2️⃣  Testing /unlock-resume endpoint..."
echo "curl -X POST $BASE_URL/unlockResume \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"test@example.com\",\"recaptchaToken\":\"dummy-token\",\"idToken\":\"dummy-firebase-token\"}'"
echo ""
echo "Expected: Should fail on missing required fields or invalid tokens"
echo "Running..."

curl -X POST $BASE_URL/unlockResume \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","recaptchaToken":"dummy-token","idToken":"dummy-firebase-token"}'

echo ""
echo ""
echo "3️⃣  Testing /edit-resume endpoint..."
echo "curl -X POST $BASE_URL/editResume \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"prompt\":\"Create a resume for a construction worker with 5 years experience\"}'"
echo ""
echo "Expected: Should work if GOOGLE_API_KEY is configured for Gemini"
echo "Running..."

curl -X POST $BASE_URL/editResume \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a resume for a construction worker with 5 years experience"}'

echo ""
echo ""
echo "4️⃣  Testing main /app endpoint (GET)..."
echo "curl $BASE_URL/app"
echo ""
echo "Expected: Should return welcome message"
echo "Running..."

curl $BASE_URL/app

echo ""
echo ""
echo "5️⃣  Testing /api/status health check..."
echo "curl $BASE_URL/app/api/status"
echo ""
echo "Expected: Should return status OK with timestamp"
echo "Running..."

curl $BASE_URL/app/api/status

echo ""
echo ""
echo "✅ Testing Complete!"
echo ""
echo "🔧 Individual Commands (copy/paste to test manually):"
echo ""
echo "# Signup test:"
echo "curl -X POST $BASE_URL/signup -H \"Content-Type: application/json\" -d '{\"email\":\"test@example.com\",\"token\":\"dummy-recaptcha-token\"}'"
echo ""
echo "# Unlock Resume test:"
echo "curl -X POST $BASE_URL/unlockResume -H \"Content-Type: application/json\" -d '{\"email\":\"test@example.com\",\"recaptchaToken\":\"dummy-token\",\"idToken\":\"dummy-firebase-token\"}'"
echo ""
echo "# Edit Resume test:"
echo "curl -X POST $BASE_URL/editResume -H \"Content-Type: application/json\" -d '{\"prompt\":\"Create a resume for a construction worker with 5 years experience\"}'"
echo ""
echo "# Main app test:"
echo "curl $BASE_URL/app"
echo ""
echo "# Health check:"
echo "curl $BASE_URL/app/api/status"
echo ""