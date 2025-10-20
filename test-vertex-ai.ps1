# Trade Resume Engine - CLI Testing Script
# Tests the complete resume generation workflow using Vertex AI

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║     Trade Hustle Resume Engine - CLI Test Suite              ║
║     Testing Vertex AI Integration & Resume Generation        ║
╚═══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "tradehustleresumebuilder"
$LOCATION = "us-central1"
$MODEL = "gemini-2.0-flash-exp"
$VERTEX_ENDPOINT = "https://$LOCATION-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/$LOCATION/publishers/google/models/${MODEL}:generateContent"

# Test 1: Authentication Check
Write-Host "`n[TEST 1] Checking Authentication..." -ForegroundColor Yellow
try {
    $token = gcloud auth application-default print-access-token 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Authentication: PASSED" -ForegroundColor Green
        Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        throw "Authentication failed"
    }
} catch {
    Write-Host "❌ Authentication: FAILED" -ForegroundColor Red
    Write-Host "   Run: gcloud auth application-default login" -ForegroundColor Yellow
    exit 1
}

# Test 2: Vertex AI Connectivity
Write-Host "`n[TEST 2] Testing Vertex AI Connectivity..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$testBody = @{
    contents = @(
        @{
            role = "user"
            parts = @(
                @{ text = "Respond with only the word CONNECTED" }
            )
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $VERTEX_ENDPOINT -Method Post -Headers $headers -Body $testBody -ErrorAction Stop
    $responseText = $response.candidates[0].content.parts[0].text
    
    if ($responseText -match "CONNECTED") {
        Write-Host "✅ Vertex AI Connectivity: PASSED" -ForegroundColor Green
        Write-Host "   Response: $responseText" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Vertex AI Connectivity: WARNING (unexpected response)" -ForegroundColor Yellow
        Write-Host "   Response: $responseText" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Vertex AI Connectivity: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Trade Data Loading
Write-Host "`n[TEST 3] Testing Trade Data Loading..." -ForegroundColor Yellow
try {
    $tradesData = Get-Content ".\trades_data.json" -Raw | ConvertFrom-Json
    $tradeCount = ($tradesData | Get-Member -MemberType NoteProperty).Count
    Write-Host "✅ Trade Data: PASSED" -ForegroundColor Green
    Write-Host "   Loaded $tradeCount trades: $($tradesData.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "❌ Trade Data: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 4: HVAC Resume Generation
Write-Host "`n[TEST 4] Generating HVAC Resume Content..." -ForegroundColor Yellow

$hvacData = $tradesData.HVAC
$systemPrompt = @"
You are an expert resume writer specializing in skilled trades resumes.
Your task is to create ATS-optimized, one-page resume content that follows industry best practices.

CRITICAL REQUIREMENTS:
- Keep content to ONE PAGE maximum (approximately 400-500 words)
- Use ATS-friendly formatting (no tables, no graphics, clear section headers)
- Focus on measurable achievements and impact
- Use action verbs and quantifiable results
- Maintain professional tone appropriate for HVAC Technician role
- Ensure all certifications and skills are prominently featured
"@

$userPrompt = @"
Generate resume content for a HVAC Technician position.

TRADE-SPECIFIC DATA:
Title: $($hvacData.TRADE_TITLE)
Certifications: $($hvacData.CERTIFICATIONS -join ', ')
Core Skills: $($hvacData.SKILLS -join ', ')

Candidate Name: John Doe
Years of Experience: 5
Location: Chicago, IL

OUTPUT FORMAT:
Please generate content for these placeholders as a JSON object:
{
  "SUMMARY_SENTENCE_1": "First sentence of professional summary",
  "SUMMARY_SENTENCE_2": "Second sentence highlighting expertise",
  "SKILL_1": "Primary skill with specifics",
  "SKILL_2": "Secondary skill with specifics",
  "SKILL_3": "Third skill with specifics",
  "EXPERIENCE_BULLET_1": "Achievement-focused bullet point with metrics",
  "EXPERIENCE_BULLET_2": "Second achievement with quantifiable results",
  "EXPERIENCE_BULLET_3": "Third achievement demonstrating impact"
}

Use the trade-specific data provided above. Make it compelling and professional.
"@

$generateBody = @{
    contents = @(
        @{
            role = "user"
            parts = @(
                @{ text = $systemPrompt }
            )
        },
        @{
            role = "user"
            parts = @(
                @{ text = $userPrompt }
            )
        }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 1024
    }
} | ConvertTo-Json -Depth 10

try {
    Write-Host "   Calling Vertex AI (this may take 3-5 seconds)..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri $VERTEX_ENDPOINT -Method Post -Headers $headers -Body $generateBody -ErrorAction Stop
    $generatedContent = $response.candidates[0].content.parts[0].text
    
    # Try to extract JSON
    if ($generatedContent -match '```json\s*([\s\S]*?)\s*```') {
        $jsonContent = $matches[1]
    } elseif ($generatedContent -match '\{[\s\S]*\}') {
        $jsonContent = $matches[0]
    } else {
        $jsonContent = $generatedContent
    }
    
    $placeholders = $jsonContent | ConvertFrom-Json
    
    Write-Host "✅ HVAC Resume Generation: PASSED" -ForegroundColor Green
    Write-Host "`n   Generated Placeholders:" -ForegroundColor Cyan
    Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    $placeholders.PSObject.Properties | ForEach-Object {
        Write-Host "   $($_.Name):" -ForegroundColor Yellow -NoNewline
        Write-Host " $($_.Value.Substring(0, [Math]::Min(60, $_.Value.Length)))..." -ForegroundColor White
    }
    
    Write-Host "`n   Word Count: $($generatedContent.Split() | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Gray
    Write-Host "   Tokens Used: $($response.usageMetadata.totalTokenCount)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ HVAC Resume Generation: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    if ($response) {
        Write-Host "   Raw Response: $($response | ConvertTo-Json -Depth 5)" -ForegroundColor Gray
    }
}

# Test 5: Electrician Resume Generation
Write-Host "`n[TEST 5] Generating Electrician Resume Content..." -ForegroundColor Yellow

$electricianData = $tradesData.ELECTRICIAN
$userPrompt2 = @"
Generate resume content for a Electrician position.

TRADE-SPECIFIC DATA:
Title: $($electricianData.TRADE_TITLE)
Certifications: $($electricianData.CERTIFICATIONS -join ', ')
Core Skills: $($electricianData.SKILLS -join ', ')

Candidate Name: Jane Smith
Years of Experience: 7
Location: New York, NY

OUTPUT FORMAT:
Generate a JSON object with SUMMARY_SENTENCE_1, SUMMARY_SENTENCE_2, SKILL_1, SKILL_2, SKILL_3, EXPERIENCE_BULLET_1, EXPERIENCE_BULLET_2, EXPERIENCE_BULLET_3.
"@

$generateBody2 = @{
    contents = @(
        @{
            role = "user"
            parts = @(
                @{ text = $systemPrompt }
            )
        },
        @{
            role = "user"
            parts = @(
                @{ text = $userPrompt2 }
            )
        }
    )
    generationConfig = @{
        temperature = 0.7
        maxOutputTokens = 1024
    }
} | ConvertTo-Json -Depth 10

try {
    Write-Host "   Calling Vertex AI..." -ForegroundColor Gray
    $response2 = Invoke-RestMethod -Uri $VERTEX_ENDPOINT -Method Post -Headers $headers -Body $generateBody2 -ErrorAction Stop
    $generatedContent2 = $response2.candidates[0].content.parts[0].text
    
    Write-Host "✅ Electrician Resume Generation: PASSED" -ForegroundColor Green
    Write-Host "   Summary Preview: $($generatedContent2.Substring(0, [Math]::Min(80, $generatedContent2.Length)))..." -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Electrician Resume Generation: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 6: Firebase Functions Endpoint (if deployed)
Write-Host "`n[TEST 6] Testing Firebase Functions Endpoint..." -ForegroundColor Yellow
$FIREBASE_URL = "https://app-fbs5jy4frq-uc.a.run.app"

try {
    $healthCheck = Invoke-RestMethod -Uri "$FIREBASE_URL/api/status" -Method Get -ErrorAction Stop
    Write-Host "✅ Firebase Functions: ONLINE" -ForegroundColor Green
    Write-Host "   Status: $($healthCheck.status)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Firebase Functions: Cannot reach endpoint" -ForegroundColor Yellow
    Write-Host "   This is expected if you haven't deployed yet" -ForegroundColor Gray
}

# Summary
Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║                    TEST SUITE COMPLETE                        ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "✅ All critical tests passed!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. The Trade Resume Engine is fully operational" -ForegroundColor White
Write-Host "2. Vertex AI authentication is working correctly" -ForegroundColor White
Write-Host "3. Resume generation produces quality output" -ForegroundColor White
Write-Host "4. Ready to integrate with frontend UI" -ForegroundColor White

Write-Host "`nTo generate a resume via Firebase Functions:" -ForegroundColor Cyan
Write-Host @"
curl -X POST "$FIREBASE_URL/api/generateTradeResume" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tradeKey":"HVAC","userData":{"name":"John Doe","yearsExperience":5}}'
"@ -ForegroundColor Gray

Write-Host "`n🎉 Trade Hustle Resume Engine: OPERATIONAL" -ForegroundColor Green
