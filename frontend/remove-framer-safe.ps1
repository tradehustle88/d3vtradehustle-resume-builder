# Safer Framer Motion Removal - Preserves JSX structure
Write-Host "🚀 Safely removing Framer Motion..." -ForegroundColor Yellow

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
        
        # 1. Remove imports
        $content = $content -replace "import \{ motion, AnimatePresence \} from ['`"]framer-motion['`"];?\r?\n", ""
        $content = $content -replace "import \{ motion \} from ['`"]framer-motion['`"];?\r?\n", ""
        $content = $content -replace "import \{ AnimatePresence \} from ['`"]framer-motion['`"];?\r?\n", ""
        
        # 2. Replace <motion.TAG to <TAG (opening tags)
        $content = $content -replace "<motion\.(div|button|p)\b", "<`$1"
        
        # 3. Replace </motion.TAG> to </TAG> (closing tags)
        $content = $content -replace "</motion\.(div|button|p)>", "</`$1>"
        
        # 4. Remove AnimatePresence tags
        $content = $content -replace "<AnimatePresence[^>]*>\r?\n?", ""
        $content = $content -replace "\s*</AnimatePresence>\r?\n?", ""
        
        # 5. Remove framer-motion props line by line (safer)
        $content = $content -replace "\s+initial=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+animate=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+exit=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+transition=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+variants=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+whileHover=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+whileTap=\{[^\}]*\}\r?\n?", ""
        $content = $content -replace "\s+mode=[`"][^`"]*[`"]\r?\n?", ""
        
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "    ✅ Updated" -ForegroundColor Green
    }
}

Write-Host "`n✨ Done!" -ForegroundColor Green
