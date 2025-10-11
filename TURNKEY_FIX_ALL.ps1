# ============================================
# COMPREHENSIVE FIX SCRIPT
# Fixes all critical issues found in audit
# ============================================
# 
# Run with: .\TURNKEY_FIX_ALL.ps1
#

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🔧 TRADE HUSTLE - COMPREHENSIVE FIX SCRIPT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$FixCount = 0

# Navigate to project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "📂 Project root: $ProjectRoot" -ForegroundColor White
Write-Host ""

# ============================================
# PHASE 1: INSTALL MISSING PACKAGES
# ============================================
Write-Host "📦 PHASE 1: Installing Missing Packages" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    Set-Location frontend
    
    Write-Host "Installing web-vitals..." -ForegroundColor Gray
    npm install web-vitals --save
    $FixCount++
    
    Write-Host "Installing sharp (image optimization)..." -ForegroundColor Gray
    npm install sharp --save
    $FixCount++
    
    Write-Host "Installing dev dependencies..." -ForegroundColor Gray
    npm install --save-dev @types/web-vitals @types/sharp
    $FixCount++
    
    Write-Host "✅ Packages installed successfully" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error installing packages: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 2: FIX TYPESCRIPT DECLARATIONS
# ============================================
Write-Host "📝 PHASE 2: Fixing TypeScript Declarations" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $globalDtsPath = "src/global.d.ts"
    
    $globalDts = @"
// Global type declarations for Trade Hustle Resume Builder

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Window extensions for Google Analytics
interface Window {
  gtag: (...args: any[]) => void;
  dataLayer: any[];
}
"@

    $globalDts | Out-File -FilePath $globalDtsPath -Encoding UTF8 -Force
    Write-Host "✅ Created/updated $globalDtsPath" -ForegroundColor Green
    $FixCount++
    Write-Host ""
} catch {
    Write-Host "❌ Error creating global.d.ts: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 3: FIX WEBVITALS.TS
# ============================================
Write-Host "🌐 PHASE 3: Fixing webVitals.ts" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $webVitalsPath = "src/lib/webVitals.ts"
    
    if (Test-Path $webVitalsPath) {
        # Read file
        $content = Get-Content $webVitalsPath -Raw
        
        # Remove duplicate Window declaration
        $content = $content -replace "(?ms)// Extend Window type for TypeScript.*?declare global \{.*?\}\s*\}\s*\}", ""
        
        # Fix metric type annotations
        $content = $content -replace "getCLS\(\(metric\)", "getCLS((metric: Metric)"
        $content = $content -replace "getFID\(\(metric\)", "getFID((metric: Metric)"
        $content = $content -replace "getFCP\(\(metric\)", "getFCP((metric: Metric)"
        $content = $content -replace "getLCP\(\(metric\)", "getLCP((metric: Metric)"
        $content = $content -replace "getTTFB\(\(metric\)", "getTTFB((metric: Metric)"
        
        # Write back
        $content | Out-File -FilePath $webVitalsPath -Encoding UTF8 -Force
        Write-Host "✅ Fixed webVitals.ts type declarations" -ForegroundColor Green
        $FixCount++
    } else {
        Write-Host "⚠️  webVitals.ts not found, skipping..." -ForegroundColor Yellow
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error fixing webVitals.ts: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 4: FIX OPTIMIZE-IMAGES.JS LINE LENGTH
# ============================================
Write-Host "⏱️  PHASE 4: Fixing Line Length in optimize-images.js" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $optimizeImagesPath = "scripts/optimize-images.js"
    
    if (Test-Path $optimizeImagesPath) {
        $content = Get-Content $optimizeImagesPath -Raw
        
        # Fix line 219 - split long line
        $oldLine = "console.log\(`\`\${colors.green}Total savings: \${formatBytes\(totalOriginal - totalOptimized\)} \(\${totalSavings}%\)\${colors.reset}\\n`\);"
        $newLines = @"
    const savingsMsg = ``Total savings: `` + formatBytes(totalOriginal - totalOptimized);
    const percentMsg = ``(`` + totalSavings + ``%)``;
    console.log(``$${colors.green}$${savingsMsg} $${percentMsg}$${colors.reset}\n``);
"@
        
        $content = $content -replace [regex]::Escape($oldLine), $newLines
        
        $content | Out-File -FilePath $optimizeImagesPath -Encoding UTF8 -Force
        Write-Host "✅ Fixed line length in optimize-images.js" -ForegroundColor Green
        $FixCount++
    } else {
        Write-Host "⚠️  optimize-images.js not found, skipping..." -ForegroundColor Yellow
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error fixing optimize-images.js: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 5: CREATE .ENV.EXAMPLE
# ============================================
Write-Host "🔐 PHASE 5: Creating .env.example" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $envExamplePath = ".env.example"
    
    if (-not (Test-Path $envExamplePath)) {
        $envExample = @"
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# API Configuration (Optional - defaults to production)
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net/api

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_URL=https://resume.nexxgennhustle.com
"@
        $envExample | Out-File -FilePath $envExamplePath -Encoding UTF8
        Write-Host "✅ Created .env.example" -ForegroundColor Green
        $FixCount++
    } else {
        Write-Host "ℹ️  .env.example already exists" -ForegroundColor Cyan
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error creating .env.example: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 6: UPDATE .GITIGNORE
# ============================================
Write-Host "🚫 PHASE 6: Updating .gitignore" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $gitignorePath = ".gitignore"
    
    if (Test-Path $gitignorePath) {
        $content = Get-Content $gitignorePath -Raw
        
        if ($content -notmatch "public/fx/optimized/") {
            $additions = @"

# Optimized assets (generated)
public/fx/optimized/
public/videos/optimized/
*.webp
"@
            Add-Content -Path $gitignorePath -Value $additions -Encoding UTF8
            Write-Host "✅ Updated .gitignore" -ForegroundColor Green
            $FixCount++
        } else {
            Write-Host "ℹ️  .gitignore already updated" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  .gitignore not found" -ForegroundColor Yellow
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error updating .gitignore: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 7: CHECK VIDEO FILES
# ============================================
Write-Host "🎥 PHASE 7: Checking Video Files" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

$videoPath = "public/videos/paint-splatter.mp4"
if (Test-Path $videoPath) {
    $videoSize = (Get-Item $videoPath).Length / 1MB
    Write-Host "✅ Video file found: $($videoSize.ToString('F2')) MB" -ForegroundColor Green
} else {
    Write-Host "⚠️  Video file missing: $videoPath" -ForegroundColor Yellow
    Write-Host "   This will cause 416 errors in the browser" -ForegroundColor Yellow
    Write-Host "   Action required: Add video file or comment out video elements" -ForegroundColor Yellow
    $ErrorCount++
}
Write-Host ""

# ============================================
# PHASE 8: CHECK FOR DUPLICATE DIRECTORIES
# ============================================
Write-Host "📁 PHASE 8: Checking for Duplicate Directories" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

if (Test-Path "frontend/frontend") {
    Write-Host "⚠️  Duplicate frontend directory found!" -ForegroundColor Yellow
    Write-Host "   Location: frontend/frontend/" -ForegroundColor Yellow
    Write-Host "   Manual review recommended before deletion" -ForegroundColor Yellow
    $ErrorCount++
} else {
    Write-Host "✅ No duplicate directories found" -ForegroundColor Green
}
Write-Host ""

# ============================================
# PHASE 9: RUN TYPE CHECK
# ============================================
Write-Host "🔍 PHASE 9: Running TypeScript Type Check" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $typeCheckOutput = npm run type-check 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Type check passed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Type check found issues:" -ForegroundColor Yellow
        Write-Host $typeCheckOutput -ForegroundColor Gray
        $ErrorCount++
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error running type check: $_" -ForegroundColor Red
    $ErrorCount++
}

# ============================================
# PHASE 10: RUN LINT
# ============================================
Write-Host "🎨 PHASE 10: Running ESLint" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

try {
    $lintOutput = npm run lint 2>&1
    
    if ($LASTEXITCODE -eq 0 -or $lintOutput -match "No ESLint warnings or errors") {
        Write-Host "✅ Lint check passed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Lint found issues:" -ForegroundColor Yellow
        Write-Host $lintOutput -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error running lint: $_" -ForegroundColor Red
}

# ============================================
# SUMMARY REPORT
# ============================================
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📊 FIX SUMMARY REPORT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Fixes Applied: $FixCount" -ForegroundColor Green
Write-Host "⚠️  Issues Remaining: $ErrorCount" -ForegroundColor $(if ($ErrorCount -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "🎉 ALL CRITICAL ISSUES RESOLVED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Review .env.local and add your Firebase credentials" -ForegroundColor White
    Write-Host "2. Run: npm run dev (to test locally)" -ForegroundColor White
    Write-Host "3. Run: node scripts/optimize-images.js (optimize images)" -ForegroundColor White
    Write-Host "4. Run: .\scripts\optimize-video.ps1 (optimize video)" -ForegroundColor White
    Write-Host "5. Test unlock flow at: http://localhost:3000/unlock" -ForegroundColor White
} else {
    Write-Host "⚠️  Some issues require manual attention:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please review the warnings above and:" -ForegroundColor White
    Write-Host "1. Check if video file exists or add it" -ForegroundColor White
    Write-Host "2. Review duplicate directories if found" -ForegroundColor White
    Write-Host "3. Fix any remaining TypeScript errors" -ForegroundColor White
    Write-Host "4. Review lint warnings" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Full Audit Report: CODEBASE_AUDIT_REPORT.md" -ForegroundColor Cyan
Write-Host ""

# Return to project root
Set-Location $ProjectRoot

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Script complete!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
