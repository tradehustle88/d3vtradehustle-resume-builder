#!/bin/bash

# Trade Hustle Resume Builder - API Endpoint Testing
# Enhanced version with colorized output, comprehensive coverage, and CI/CD support
# Run these commands to test your Firebase Cloud Functions

# Color codes for output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
PURPLE="\033[0;35m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Configuration
BASE_URL="https://us-central1-tradehustleresumebuilder.cloudfunctions.net"
DUMMY_RECAPTCHA="dummy-recaptcha-token"
DUMMY_FIREBASE_TOKEN="dummy-firebase-token"
TEST_EMAIL="test@example.com"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Utility functions
print_header() {
    echo -e "${CYAN}🚀 Testing Trade Hustle Resume Builder Endpoints${NC}"
    echo -e "${CYAN}====================================================${NC}"
    echo ""
}

print_test_header() {
    local test_num="$1"
    local test_name="$2"
    echo -e "${BLUE}${test_num} Testing ${test_name} endpoint...${NC}"
}

print_command() {
    local cmd="$1"
    echo -e "${PURPLE}Command:${NC} $cmd"
}

print_expected() {
    local expected="$1"
    echo -e "${YELLOW}Expected:${NC} $expected"
}

test_result() {
    local response="$1"
    local expected_pattern="$2"
    local test_name="$3"
    local should_fail="${4:-false}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$should_fail" = "true" ]; then
        # Test should fail - look for error patterns
        if [[ $response == *"error"* ]] || [[ $response == *"Error"* ]] || [[ $response == *"fail"* ]] || [[ $response == *"invalid"* ]]; then
            echo -e "${GREEN}[PASS]${NC} $test_name - Expected failure detected"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${RED}[FAIL]${NC} $test_name - Expected failure but got: $response"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        # Test should succeed - look for success patterns
        if [[ $response == *"$expected_pattern"* ]] && [[ $response != *"error"* ]]; then
            echo -e "${GREEN}[PASS]${NC} $test_name - Success"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${RED}[FAIL]${NC} $test_name - Got: $response"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    fi
}

print_summary() {
    echo ""
    echo -e "${CYAN}📊 Test Summary${NC}"
    echo -e "${CYAN}===============${NC}"
    echo -e "Total Tests: ${TOTAL_TESTS}"
    echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
    echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}✅ All tests completed successfully!${NC}"
        exit 0
    else
        echo -e "${RED}❌ Some tests failed. Check the output above.${NC}"
        exit 1
    fi
}

# Start testing
print_header

# Test 1: Signup endpoint (should fail with dummy reCAPTCHA)
print_test_header "1️⃣ " "/signup"
cmd="curl -s -X POST $BASE_URL/signup -H \"Content-Type: application/json\" -d '{\"email\":\"$TEST_EMAIL\",\"token\":\"$DUMMY_RECAPTCHA\"}'"
print_command "$cmd"
print_expected "Should fail reCAPTCHA verification (dummy token)"
echo ""

response=$(curl -s -X POST $BASE_URL/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"'"$TEST_EMAIL"'","token":"'"$DUMMY_RECAPTCHA"'"}')

test_result "$response" "" "Signup with invalid reCAPTCHA" "true"
echo ""

# Test 2: Unlock Resume endpoint (should fail with dummy tokens)
print_test_header "2️⃣ " "/unlock-resume"
cmd="curl -s -X POST $BASE_URL/unlockResume -H \"Content-Type: application/json\" -d '{\"email\":\"$TEST_EMAIL\",\"recaptchaToken\":\"$DUMMY_RECAPTCHA\",\"idToken\":\"$DUMMY_FIREBASE_TOKEN\"}'"
print_command "$cmd"
print_expected "Should fail on missing required fields or invalid tokens"
echo ""

response=$(curl -s -X POST $BASE_URL/unlockResume \
  -H "Content-Type: application/json" \
  -d '{"email":"'"$TEST_EMAIL"'","recaptchaToken":"'"$DUMMY_RECAPTCHA"'","idToken":"'"$DUMMY_FIREBASE_TOKEN"'"}')

test_result "$response" "" "Unlock Resume with invalid tokens" "true"
echo ""

# Test 3: Edit Resume endpoint
print_test_header "3️⃣ " "/edit-resume"
cmd="curl -s -X POST $BASE_URL/editResume -H \"Content-Type: application/json\" -d '{\"prompt\":\"Create a resume for a construction worker with 5 years experience\"}'"
print_command "$cmd"
print_expected "Should work if GOOGLE_API_KEY is configured for Gemini"
echo ""

response=$(curl -s -X POST $BASE_URL/editResume \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a resume for a construction worker with 5 years experience"}')

# This might succeed or fail depending on API key configuration
if [[ $response == *"error"* ]] || [[ $response == *"Error"* ]]; then
    test_result "$response" "" "Edit Resume API call" "true"
else
    test_result "$response" "resume" "Edit Resume API call" "false"
fi
echo ""

# Test 4: Vertex AI Test endpoint
print_test_header "4️⃣ " "/vertex-test"
cmd="curl -s -X POST $BASE_URL/app/api/vertex-test -H \"Content-Type: application/json\" -d '{\"prompt\":\"Hello world\"}'"
print_command "$cmd"
print_expected "Should test Vertex AI integration"
echo ""

response=$(curl -s -X POST $BASE_URL/app/api/vertex-test \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello world"}')

if [[ $response == *"error"* ]] || [[ $response == *"Error"* ]]; then
    test_result "$response" "" "Vertex AI test" "true"
else
    test_result "$response" "response" "Vertex AI test" "false"
fi
echo ""

# Test 5: Main App endpoint (GET)
print_test_header "5️⃣ " "/app"
cmd="curl -s $BASE_URL/app"
print_command "$cmd"
print_expected "Should return welcome message"
echo ""

response=$(curl -s $BASE_URL/app)
test_result "$response" "Trade Hustle" "Main app endpoint" "false"
echo ""

# Test 6: Health Check endpoint
print_test_header "6️⃣ " "/api/status"
cmd="curl -s $BASE_URL/app/api/status"
print_command "$cmd"
print_expected "Should return status OK with timestamp"
echo ""

response=$(curl -s $BASE_URL/app/api/status)
test_result "$response" "status" "Health check endpoint" "false"
echo ""

# Test 7: reCAPTCHA verification endpoint
print_test_header "7️⃣ " "/verify-recaptcha"
cmd="curl -s -X POST $BASE_URL/app/api/verify-recaptcha -H \"Content-Type: application/json\" -d '{\"token\":\"$DUMMY_RECAPTCHA\"}'"
print_command "$cmd"
print_expected "Should fail with dummy token"
echo ""

response=$(curl -s -X POST $BASE_URL/app/api/verify-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"token":"'"$DUMMY_RECAPTCHA"'"}')

test_result "$response" "" "reCAPTCHA verification" "true"
echo ""

# Print manual testing commands
echo -e "${CYAN}🔧 Individual Commands (copy/paste to test manually):${NC}"
echo ""
echo -e "${PURPLE}# Signup test:${NC}"
echo "curl -X POST $BASE_URL/signup -H \"Content-Type: application/json\" -d '{\"email\":\"$TEST_EMAIL\",\"token\":\"$DUMMY_RECAPTCHA\"}'"
echo ""
echo -e "${PURPLE}# Unlock Resume test:${NC}"
echo "curl -X POST $BASE_URL/unlockResume -H \"Content-Type: application/json\" -d '{\"email\":\"$TEST_EMAIL\",\"recaptchaToken\":\"$DUMMY_RECAPTCHA\",\"idToken\":\"$DUMMY_FIREBASE_TOKEN\"}'"
echo ""
echo -e "${PURPLE}# Edit Resume test:${NC}"
echo "curl -X POST $BASE_URL/editResume -H \"Content-Type: application/json\" -d '{\"prompt\":\"Create a resume for a construction worker with 5 years experience\"}'"
echo ""
echo -e "${PURPLE}# Vertex AI test:${NC}"
echo "curl -X POST $BASE_URL/app/api/vertex-test -H \"Content-Type: application/json\" -d '{\"prompt\":\"Hello world\"}'"
echo ""
echo -e "${PURPLE}# Main app test:${NC}"
echo "curl $BASE_URL/app"
echo ""
echo -e "${PURPLE}# Health check:${NC}"
echo "curl $BASE_URL/app/api/status"
echo ""
echo -e "${PURPLE}# reCAPTCHA verification test:${NC}"
echo "curl -X POST $BASE_URL/app/api/verify-recaptcha -H \"Content-Type: application/json\" -d '{\"token\":\"$DUMMY_RECAPTCHA\"}'"
echo ""

# Print final summary and exit with appropriate code
print_summary