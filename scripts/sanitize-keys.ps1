# 🧹 Remove Exposed API Keys from Documentation
# Sanitizes markdown files and reports by replacing real keys with placeholders

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🔒 Sanitizing Exposed API Keys" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

# Exposed keys to replace (ADD YOUR EXPOSED KEYS HERE)
$ExposedKeys = @{
    "AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk" = "YOUR_FIREBASE_API_KEY"
}

# File patterns to scan
$FilePatterns = @(
    "*.md",
    "*.html",
    "*.json"
)

# Directories to exclude
$ExcludeDirs = @(
    "node_modules",
    ".git",
    ".next",
    "out",
    "build",
    "dist",
    "frontend_backup"
)

# Find files to process
Write-Host "🔍 Scanning for files..." -ForegroundColor Yellow

$allFiles = @()
foreach ($pattern in $FilePatterns) {
    $files = Get-ChildItem -Path . -Filter $pattern -Recurse -File | Where-Object {
        $path = $_.FullName
        $exclude = $false
        foreach ($dir in $ExcludeDirs) {
            if ($path -like "*\$dir\*") {
                $exclude = $true
                break
            }
        }
        -not $exclude
    }
    $allFiles += $files
}

Write-Host "   Found $($allFiles.Count) files to scan`n" -ForegroundColor White

if ($allFiles.Count -eq 0) {
    Write-Host "✅ No files to process" -ForegroundColor Green
    exit 0
}

# Process files
$modifiedFiles = @()
$totalReplacements = 0

foreach ($file in $allFiles) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) {
        continue
    }
    
    $modified = $false
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($key in $ExposedKeys.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $replacement = $ExposedKeys[$key]
            $count = ([regex]::Matches($content, [regex]::Escape($key))).Count
            
            if ($count -gt 0) {
                Write-Host "📝 $($file.Name)" -ForegroundColor Yellow
                Write-Host "   Found $count occurrence(s) of exposed key" -ForegroundColor White
                Write-Host "   Replacing with: $replacement" -ForegroundColor Gray
                
                $content = $content -replace [regex]::Escape($key), $replacement
                $modified = $true
                $fileReplacements += $count
            }
        }
    }
    
    if ($modified) {
        $modifiedFiles += $file.FullName
        $totalReplacements += $fileReplacements
        
        if (-not $DryRun) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "   ✅ Saved" -ForegroundColor Green
        } else {
            Write-Host "   🔍 DRY RUN - Would save" -ForegroundColor Cyan
        }
        Write-Host ""
    }
}

# Summary
Write-Host "`n📊 Summary" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "Files scanned:   $($allFiles.Count)" -ForegroundColor White
Write-Host "Files modified:  $($modifiedFiles.Count)" -ForegroundColor $(if ($modifiedFiles.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host "Total replacements: $totalReplacements" -ForegroundColor White

if ($DryRun) {
    Write-Host "`n🔍 DRY RUN - No files were modified" -ForegroundColor Cyan
    Write-Host "   Run without -DryRun to apply changes`n" -ForegroundColor Gray
} else {
    if ($modifiedFiles.Count -gt 0) {
        Write-Host "`n✅ Keys sanitized successfully`n" -ForegroundColor Green
        
        Write-Host "📋 Modified files:" -ForegroundColor Cyan
        $modifiedFiles | ForEach-Object { 
            Write-Host "   - $($_ -replace [regex]::Escape($PWD), '.')" -ForegroundColor White 
        }
        
        Write-Host "`n⚠️  Next steps:" -ForegroundColor Yellow
        Write-Host "1. Review the changes:" -ForegroundColor White
        Write-Host "   git diff" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Commit the sanitized files:" -ForegroundColor White
        Write-Host "   git add ." -ForegroundColor Gray
        Write-Host "   git commit -m 'security: remove exposed API keys from documentation'" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. Clean git history (removes keys from ALL commits):" -ForegroundColor White
        Write-Host "   .\scripts\clean-git-history.ps1`n" -ForegroundColor Gray
    } else {
        Write-Host "`n✅ No exposed keys found in documentation`n" -ForegroundColor Green
    }
}
