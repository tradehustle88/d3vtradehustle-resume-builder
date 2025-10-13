#!/bin/bash

# Frontend Deployment Test Script
# Tests all key pages in the Trade Hustle Resume Builder funnel

echo "🚀 Testing Frontend Deployment: https://tradehustleresumebuilder.web.app"
echo "=================================================="

BASE_URL="https://tradehustleresumebuilder.web.app"

# Array of all pages to test
declare -a pages=(
    "/"                                    # Landing page
    "/free-pdf"                           # Lead magnet entry
    "/free-pdf/confirm"                   # Email confirmation
    "/free-pdf/thankyou"                  # Thank you page
    "/resume-builder"                     # Main funnel entry
    "/resume-builder/trade"               # Trade selection
    "/resume-builder/template"            # Template selection
    "/resume-builder/editor"              # Resume editor
    "/resume-builder/checkout"            # Payment page
    "/resume-builder/confirm"             # Order confirmation
    "/resume-builder/thankyou"            # Final thank you
    "/unlock"                            # Resume unlock page
    "/auth"                              # Authentication
    "/api-demo"                          # API testing page
)

echo "🔍 Testing Page Accessibility..."
echo "----------------------------------"

for page in "${pages[@]}"; do
    url="${BASE_URL}${page}"
    echo -n "Testing ${page}: "
    
    # Use curl to check if page returns 200 status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "200" ]; then
        echo "✅ OK (${status})"
    else
        echo "❌ FAILED (${status})"
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.5
done

echo ""
echo "🧪 Testing Key Functionality..."
echo "------------------------------"

echo "📱 Responsive Design: Check mobile/desktop layouts"
echo "🎨 Brand Elements: Verify Trade Hustle branding and colors"
echo "📝 Forms: Test email capture and resume builder forms"
echo "🔗 Navigation: Verify funnel flow between pages"
echo "📊 Analytics: Check if Google Analytics is firing"

echo ""
echo "🔧 Next Steps for Functions Testing:"
echo "-----------------------------------"
echo "1. Fix Cloud Build permissions in Google Cloud Console"
echo "2. Deploy Firebase Functions: firebase deploy --only functions:api"
echo "3. Test API endpoints: /api/signup, /api/unlock-resume, /api/edit-resume"
echo "4. Verify complete user journey from landing to resume download"

echo ""
echo "🌐 Live Site: ${BASE_URL}"
echo "📊 Firebase Console: https://console.firebase.google.com/project/tradehustleresumebuilder"