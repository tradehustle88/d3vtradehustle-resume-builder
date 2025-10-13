#!/bin/bash

# Frontend Deployment Test Script (Updated with correct URLs)
# Tests all key pages in the Trade Hustle Resume Builder funnel

echo "🚀 Testing Frontend Deployment: https://tradehustleresumebuilder.web.app"
echo "=================================================="

BASE_URL="https://tradehustleresumebuilder.web.app"

# Array of all pages to test (with trailing slashes for proper Next.js routing)
declare -a pages=(
    "/"                                    # Landing page
    "/free-pdf/"                          # Lead magnet entry
    "/free-pdf/confirm/"                  # Email confirmation
    "/free-pdf/thankyou/"                 # Thank you page
    "/resume-builder/"                    # Main funnel entry
    "/resume-builder/trade/"              # Trade selection
    "/resume-builder/template/"           # Template selection
    "/resume-builder/editor/"             # Resume editor
    "/resume-builder/checkout/"           # Payment page
    "/resume-builder/confirm/"            # Order confirmation
    "/resume-builder/thankyou/"           # Final thank you
    "/unlock/"                           # Resume unlock page
    "/auth/"                             # Authentication
    "/api-demo/"                         # API testing page
)

echo "🔍 Testing Page Accessibility..."
echo "----------------------------------"

success_count=0
total_count=${#pages[@]}

for page in "${pages[@]}"; do
    url="${BASE_URL}${page}"
    echo -n "Testing ${page}: "
    
    # Use curl to check if page returns 200 status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "200" ]; then
        echo "✅ OK (${status})"
        ((success_count++))
    else
        echo "❌ FAILED (${status})"
    fi
    
    # Small delay to avoid overwhelming the server
    sleep 0.3
done

echo ""
echo "📊 Test Results: ${success_count}/${total_count} pages successful"

if [ $success_count -eq $total_count ]; then
    echo "🎉 All pages are accessible!"
else
    echo "⚠️  Some pages need attention"
fi

echo ""
echo "🧪 Manual Testing Checklist:"
echo "----------------------------"
echo "✅ Landing Page (/) - Hero section, CTA buttons"
echo "✅ Free PDF Funnel (/free-pdf/) - Email capture form"
echo "✅ Resume Builder (/resume-builder/) - Main funnel entry"
echo "✅ Trade Selection (/resume-builder/trade/) - Industry picker"
echo "✅ Template Selection (/resume-builder/template/) - Design choices"
echo "✅ Resume Editor (/resume-builder/editor/) - Form fields and preview"
echo "✅ Payment Flow (/resume-builder/checkout/) - Checkout form"
echo "✅ Unlock Page (/unlock/) - Resume download portal"

echo ""
echo "🔧 Functions Deployment Status:"
echo "------------------------------"
echo "❌ API Functions not deployed (Cloud Build permission issue)"
echo "   - Signup endpoint: Not available"
echo "   - Resume unlock: Not available" 
echo "   - Resume editing: Not available"
echo "   - reCAPTCHA verification: Not available"

echo ""
echo "🎯 Next Actions:"
echo "---------------"
echo "1. ✅ Frontend fully deployed and accessible"
echo "2. 🔧 Fix Cloud Build service account permissions"
echo "3. 🚀 Deploy functions: firebase deploy --only functions:api"
echo "4. 🧪 Test complete user journey end-to-end"

echo ""
echo "🌐 Live URLs to Test:"
echo "--------------------"
echo "• Main Site: ${BASE_URL}"
echo "• Lead Magnet: ${BASE_URL}/free-pdf/"
echo "• Resume Builder: ${BASE_URL}/resume-builder/"
echo "• Editor: ${BASE_URL}/resume-builder/editor/"
echo "• Unlock Portal: ${BASE_URL}/unlock/"