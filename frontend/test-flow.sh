#!/bin/bash

# Test Script for Complete Authentication Flow
# Usage: ./test-flow.sh

echo "🧪 Testing Complete Authentication Flow"
echo "======================================"

BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing Homepage..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL"

echo ""
echo "2. Testing Unlock Page..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/unlock"

echo ""
echo "3. Testing PDF Accessibility..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$BASE_URL/resume-kit.pdf"

echo ""
echo "4. Testing API Route (without auth - should fail)..."
curl -X POST "$BASE_URL/api/unlock-resume" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","resume":"test","recaptchaToken":"test","idToken":"test"}' \
  -w "\nStatus: %{http_code}\n"

echo ""
echo "✅ Basic connectivity tests complete!"
echo ""
echo "🔐 For complete flow testing:"
echo "1. Visit: $BASE_URL/unlock"
echo "2. Sign in with Google or Email/Password"
echo "3. Click 'Unlock Resume Kit Now'"
echo "4. Verify PDF download starts"
echo "5. Check Firestore 'unlocks' collection for new document"
echo ""
echo "📋 Manual Test Checklist:"
echo "□ Firebase Auth Google Sign-In works"
echo "□ Firebase Auth Email/Password works"
echo "□ reCAPTCHA v3 executes silently"
echo "□ API route validates tokens properly"
echo "□ Firestore document is created"
echo "□ PDF download triggers successfully"
echo "□ Error handling works for invalid inputs"