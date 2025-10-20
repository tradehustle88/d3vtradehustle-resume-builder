# Trade Batch Generation Script
# Generates multiple trade data entries using Vertex AI

param(
    [switch]$All,
    [string]$Trade = "",
    [switch]$Verbose
)

Write-Host @"
╔═══════════════════════════════════════════════════════════════╗
║     Trade Hustle - Automated Trade Data Generator            ║
║     Powered by Vertex AI • Scaling to 40+ Trades             ║
╚═══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "tradehustleresumebuilder"
$LOCATION = "us-central1"
$MODEL = "gemini-2.0-flash-exp"
$VERTEX_ENDPOINT = "https://$LOCATION-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/$LOCATION/publishers/google/models/${MODEL}:generateContent"
$TRADES_FILE = ".\trades_data.json"

# Trade definitions
$TRADE_DEFINITIONS = @{
    "CDL_DRIVER" = @{
        title = "Commercial CDL Driver"
        icon = "🚚"
        description = "Professional truck driver with commercial driver's license"
    }
    "WELDER" = @{
        title = "Certified Welder"
        icon = "🔥"
        description = "Skilled welder specializing in various welding techniques"
    }
    "CARPENTER" = @{
        title = "Carpenter"
        icon = "🪚"
        description = "Experienced carpenter for residential and commercial construction"
    }
    "AUTO_MECHANIC" = @{
        title = "Automotive Technician"
        icon = "🔩"
        description = "ASE-certified mechanic specializing in vehicle repair and maintenance"
    }
    "PAINTER" = @{
        title = "Professional Painter"
        icon = "🎨"
        description = "Skilled painter for residential and commercial properties"
    }
    "MASON" = @{
        title = "Mason / Bricklayer"
        icon = "🧱"
        description = "Expert in masonry, brickwork, and concrete construction"
    }
    "ROOFER" = @{
        title = "Roofing Contractor"
        icon = "🏠"
        description = "Licensed roofer specializing in installation and repair"
    }
    "LANDSCAPER" = @{
        title = "Landscape Technician"
        icon = "🌳"
        description = "Professional landscaper for design and maintenance"
    }
    "SOLAR_INSTALLER" = @{
        title = "Solar Panel Installer"
        icon = "☀️"
        description = "Certified solar energy system installer"
    }
    "PIPE_FITTER" = @{
        title = "Pipe Fitter"
        icon = "🔧"
        description = "Industrial pipe fitter for commercial and industrial systems"
    }
}

# Get authentication token
Write-Host "`n[STEP 1] Authenticating with Google Cloud..." -ForegroundColor Yellow
try {
    $token = gcloud auth application-default print-access-token 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Authentication successful" -ForegroundColor Green
    } else {
        throw "Authentication failed"
    }
} catch {
    Write-Host "❌ Authentication failed. Run: gcloud auth application-default login" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Function to generate trade data via AI
function Generate-TradeData {
    param(
        [string]$TradeKey,
        [hashtable]$TradeInfo
    )

    Write-Host "`n[GENERATING] $($TradeInfo.title) ($TradeKey)..." -ForegroundColor Cyan

    $systemPrompt = @"
You are a resume data expert specializing in skilled trades.
Generate realistic, industry-standard data for a $($TradeInfo.title) position.

REQUIREMENTS:
- Research actual certifications required for this trade
- List 6-10 core technical skills specific to this trade
- Create professional placeholder text for resume sections
- Ensure all data is ATS-optimized and industry-accurate
"@

    $userPrompt = @"
Generate complete trade data for: $($TradeInfo.title)
Description: $($TradeInfo.description)

Return ONLY a valid JSON object with this exact structure:
{
  "TRADE_TITLE": "$($TradeInfo.title)",
  "CERTIFICATIONS": [
    "Certification 1",
    "Certification 2",
    "Certification 3"
  ],
  "SKILLS": [
    "Skill 1",
    "Skill 2",
    "Skill 3",
    "Skill 4",
    "Skill 5",
    "Skill 6"
  ],
  "PLACEHOLDERS": {
    "SUMMARY_SENTENCE_1": "Professional summary first sentence",
    "SUMMARY_SENTENCE_2": "Professional summary second sentence",
    "SKILL_1": "Detailed skill description 1",
    "SKILL_2": "Detailed skill description 2",
    "SKILL_3": "Detailed skill description 3",
    "SKILL_4": "Detailed skill description 4",
    "SKILL_5": "Detailed skill description 5",
    "SKILL_6": "Detailed skill description 6",
    "CERT_1": "Certification detail 1",
    "CERT_2": "Certification detail 2",
    "CERT_3": "Certification detail 3",
    "EXPERIENCE_TITLE_1": "Job title",
    "EXPERIENCE_COMPANY_1": "Company name",
    "EXPERIENCE_DATES_1": "Date range",
    "EXPERIENCE_BULLET_1": "Achievement bullet point 1",
    "EXPERIENCE_BULLET_2": "Achievement bullet point 2",
    "EXPERIENCE_BULLET_3": "Achievement bullet point 3"
  }
}

Return ONLY the JSON. No markdown formatting.
"@

    $body = @{
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
            maxOutputTokens = 2048
        }
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri $VERTEX_ENDPOINT -Method Post -Headers $headers -Body $body -ErrorAction Stop
        $generatedContent = $response.candidates[0].content.parts[0].text

        # Clean JSON
        $jsonContent = $generatedContent -replace '```json', '' -replace '```', '' | Out-String | ForEach-Object { $_.Trim() }
        
        # Parse and validate
        $tradeData = $jsonContent | ConvertFrom-Json

        Write-Host "✅ Generated $($TradeInfo.title)" -ForegroundColor Green
        if ($Verbose) {
            Write-Host "   Certifications: $($tradeData.CERTIFICATIONS.Count)" -ForegroundColor Gray
            Write-Host "   Skills: $($tradeData.SKILLS.Count)" -ForegroundColor Gray
            Write-Host "   Tokens: $($response.usageMetadata.totalTokenCount)" -ForegroundColor Gray
        }

        return $tradeData
    } catch {
        Write-Host "❌ Failed to generate $TradeKey" -ForegroundColor Red
        Write-Host "   Error: $_" -ForegroundColor Red
        return $null
    }
}

# Main execution
if ($All) {
    Write-Host "`n[STEP 2] Generating all trade data..." -ForegroundColor Yellow
    Write-Host "This will generate $($TRADE_DEFINITIONS.Count) trades. This may take 2-3 minutes." -ForegroundColor Gray

    # Load existing trades
    $existingTrades = @{}
    if (Test-Path $TRADES_FILE) {
        $existingTrades = Get-Content $TRADES_FILE -Raw | ConvertFrom-Json | ConvertTo-Json -Depth 10 | ConvertFrom-Json -AsHashtable
    }

    $newTrades = @{}
    $successCount = 0

    foreach ($tradeKey in $TRADE_DEFINITIONS.Keys) {
        # Check if already exists
        if ($existingTrades.ContainsKey($tradeKey)) {
            Write-Host "`n[SKIPPING] $tradeKey - already exists" -ForegroundColor Yellow
            $newTrades[$tradeKey] = $existingTrades[$tradeKey]
            continue
        }

        $tradeData = Generate-TradeData -TradeKey $tradeKey -TradeInfo $TRADE_DEFINITIONS[$tradeKey]
        
        if ($tradeData) {
            $newTrades[$tradeKey] = $tradeData
            $successCount++
            
            # Rate limiting - wait 2 seconds between requests
            Start-Sleep -Seconds 2
        }
    }

    # Merge with existing trades
    foreach ($key in $existingTrades.Keys) {
        if (-not $newTrades.ContainsKey($key)) {
            $newTrades[$key] = $existingTrades[$key]
        }
    }

    # Save to file
    Write-Host "`n[STEP 3] Saving to $TRADES_FILE..." -ForegroundColor Yellow
    $newTrades | ConvertTo-Json -Depth 10 | Set-Content $TRADES_FILE -Encoding UTF8

    # Copy to api-functions
    Write-Host "[STEP 4] Copying to api-functions directory..." -ForegroundColor Yellow
    Copy-Item $TRADES_FILE ".\api-functions\trades_data.json" -Force

    Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║                   GENERATION COMPLETE                         ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Green

    Write-Host "✅ Successfully generated $successCount new trades" -ForegroundColor Green
    Write-Host "✅ Total trades in system: $($newTrades.Count)" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. git add trades_data.json api-functions/trades_data.json" -ForegroundColor White
    Write-Host "2. git commit -m 'feat: Add $successCount new trade types via AI generation'" -ForegroundColor White
    Write-Host "3. firebase deploy --only functions" -ForegroundColor White

} elseif ($Trade -ne "") {
    # Generate single trade
    if ($TRADE_DEFINITIONS.ContainsKey($Trade)) {
        $tradeData = Generate-TradeData -TradeKey $Trade -TradeInfo $TRADE_DEFINITIONS[$Trade]
        
        if ($tradeData) {
            Write-Host "`nGenerated trade data:" -ForegroundColor Cyan
            $tradeData | ConvertTo-Json -Depth 10
        }
    } else {
        Write-Host "❌ Unknown trade: $Trade" -ForegroundColor Red
        Write-Host "Available trades: $($TRADE_DEFINITIONS.Keys -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host @"

Usage:
  .\generate-trades.ps1 -All           # Generate all missing trades
  .\generate-trades.ps1 -Trade CDL_DRIVER    # Generate single trade
  .\generate-trades.ps1 -All -Verbose  # Show detailed output

Available Trades:
"@ -ForegroundColor Yellow

    foreach ($key in $TRADE_DEFINITIONS.Keys) {
        $info = $TRADE_DEFINITIONS[$key]
        Write-Host "  $($info.icon) $key - $($info.title)" -ForegroundColor Cyan
    }
}
