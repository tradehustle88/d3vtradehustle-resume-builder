#!/bin/bash

# Test script for the new Gemini AI Agent endpoint
# Tests both Gemini API and Vertex AI modes

set -e

# Configuration
BASE_URL="${BASE_URL:-https://us-central1-tradehustle88-resume-builder.cloudfunctions.net}"
TEST_EMAIL="test@tradehustle.dev"
TEST_PROMPT="Write a professional summary for a software engineer with 5 years of experience."

echo "🧪 Testing Gemini AI Agent Endpoint"
echo "📍 Base URL: $BASE_URL"
echo "✉️  Test Email: $TEST_EMAIL"
echo ""

# Function to get auth token (mock for testing)
get_test_token() {
    echo "mock-firebase-token-for-testing"
}

# Test 1: Health check to verify environment
echo "🔍 Step 1: Checking service health..."
curl -s "$BASE_URL/api/status" | jq .

echo ""

# Test 2: Test Gemini API mode (default)
echo "🤖 Step 2: Testing Gemini API mode..."
TOKEN=$(get_test_token)

GEMINI_RESPONSE=$(curl -s -X POST "$BASE_URL/api/geminiAgent" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"prompt\": \"$TEST_PROMPT\",
        \"useVertexAI\": false,
        \"model\": \"gemini-1.5-flash\"
    }")

echo "Response: $GEMINI_RESPONSE"
echo ""

# Test 3: Test Vertex AI mode
echo "🔬 Step 3: Testing Vertex AI mode..."
VERTEX_RESPONSE=$(curl -s -X POST "$BASE_URL/api/geminiAgent" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"prompt\": \"$TEST_PROMPT\",
        \"useVertexAI\": true,
        \"model\": \"gemini-1.5-flash\"
    }")

echo "Response: $VERTEX_RESPONSE"
echo ""

# Test 4: Test without authentication (should fail)
echo "🚫 Step 4: Testing without authentication (should fail)..."
UNAUTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/geminiAgent" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"test\"}")

echo "Response: $UNAUTH_RESPONSE"
echo ""

# Test 5: Test with missing prompt (should fail)
echo "⚠️  Step 5: Testing with missing prompt (should fail)..."
NO_PROMPT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/geminiAgent" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{}")

echo "Response: $NO_PROMPT_RESPONSE"
echo ""

echo "✅ Gemini AI Agent testing complete!"
echo ""
echo "💡 Usage Examples:"
echo "   • Frontend integration: fetch('/api/geminiAgent', { method: 'POST', body: JSON.stringify({prompt: 'your prompt'}) })"
echo "   • Vertex AI mode: Add 'useVertexAI: true' to request body"
echo "   • Custom model: Add 'model: \"gemini-1.5-pro\"' to request body"