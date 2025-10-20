# Remove Framer Motion - Batch Replacement Script
Write-Host "🚀 Removing Framer Motion from all form components..." -ForegroundColor Yellow

$files = @(
    "src/components/forms/SummarySection.tsx",
    "src/components/forms/SkillsSection.tsx",
    "src/components/forms/ReviewSection.tsx",
    "src/components/forms/ReferencesSection.tsx",
    "src/components/forms/ProgressSidebar.tsx",
    "src/components/forms/MultiStepForm.tsx",
    "src/components/forms/ExperienceSection.tsx",
    "src/components/forms/EducationSection.tsx",
    "src/components/forms/CertificationsSection.tsx"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "  Processing: $file" -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw
        
        # Remove framer-motion imports
        $content = $content -replace "import \{ motion,? ?AnimatePresence? ?\} from ['`"]framer-motion['`"];?`n", ""
        $content = $content -replace "import \{ motion ?\} from ['`"]framer-motion['`"];?`n", ""
        $content = $content -replace "import \{ AnimatePresence ?\} from ['`"]framer-motion['`"];?`n", ""
        
        # Replace motion.div with div
        $content = $content -replace "<motion\.div", "<div"
        $content = $content -replace "</motion\.div>", "</div>"
        
        # Replace motion.button with button
        $content = $content -replace "<motion\.button", "<button"
        $content = $content -replace "</motion\.button>", "</button>"
        
        # Replace motion.p with p
        $content = $content -replace "<motion\.p", "<p"
        $content = $content -replace "</motion\.p>", "</p>"
        
        # Remove AnimatePresence wrappers
        $content = $content -replace "<AnimatePresence[^>]*>", ""
        $content = $content -replace "</AnimatePresence>", ""
        
        # Remove framer-motion props (initial, animate, exit, transition, variants, whileHover, whileTap)
        $content = $content -replace '\s+initial=\{[^\}]+\}', ""
        $content = $content -replace '\s+animate=\{[^\}]+\}', ""
        $content = $content -replace '\s+exit=\{[^\}]+\}', ""
        $content = $content -replace '\s+transition=\{[^\}]+\}', ""
        $content = $content -replace '\s+variants=\{[^\}]+\}', ""
        $content = $content -replace '\s+whileHover=\{[^\}]+\}', ""
        $content = $content -replace '\s+whileTap=\{[^\}]+\}', ""
        $content = $content -replace '\s+key=\{currentStep\}', ""
        $content = $content -replace '\s+mode="[^"]*"', ""
        
        # Add animation classes where appropriate
        $content = $content -replace '(<div[^>]*className="[^"]*)(space-y-\d+)', '$1$2 animate-slideUp'
        
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "    ✅ Updated" -ForegroundColor Green
    } else {
        Write-Host "    ❌ File not found: $filePath" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done! All Framer Motion code removed." -ForegroundColor Green
Write-Host "📦 Next: Run 'npm uninstall framer-motion' to remove the package." -ForegroundColor Yellow
