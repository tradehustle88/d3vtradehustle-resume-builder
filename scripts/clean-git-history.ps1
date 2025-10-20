# 🧹 Git History Cleanup Script
# Removes sensitive data from git history
# CAUTION: This rewrites git history - coordinate with your team!

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🔒 Git History Cleanup for Sensitive Data" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Files and patterns to remove
$SensitiveFiles = @(
    ".env.local",
    "frontend/.env.local",
    "frontend_backup/.env.local",
    "api-functions/.env",
    "functions/.env",
    "serviceAccountKey.json",
    "serviceAccount.json",
    "serviceAccount.b64",
    "firebase-adminsdk-*.json"
)

$SensitivePatterns = @(
    "AIzaSyD-nOOjvBgp5lls0qRG_VAWFt95-XoBbPk"  # Exposed Firebase API key
)

# Pre-flight checks
Write-Host "📋 Pre-flight Checks..." -ForegroundColor Yellow

# Check if git repo
if (-not (Test-Path .git)) {
    Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status -and -not $Force) {
    Write-Host "❌ Error: You have uncommitted changes" -ForegroundColor Red
    Write-Host "   Commit or stash your changes first, or use -Force to proceed" -ForegroundColor Yellow
    exit 1
}

# Backup warning
if (-not $DryRun) {
    Write-Host "`n⚠️  WARNING: This will rewrite git history!" -ForegroundColor Red
    Write-Host "   All team members will need to re-clone the repository" -ForegroundColor Red
    Write-Host "   This cannot be undone easily`n" -ForegroundColor Red
    
    if (-not $Force) {
        $confirm = Read-Host "Type 'YES' to continue"
        if ($confirm -ne "YES") {
            Write-Host "❌ Aborted" -ForegroundColor Yellow
            exit 0
        }
    }
}

# Create backup
if (-not $DryRun) {
    Write-Host "`n📦 Creating backup..." -ForegroundColor Yellow
    $backupDir = "..\d3vtradehustle-resume-builder-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    
    if (Test-Path $backupDir) {
        Remove-Item -Recurse -Force $backupDir
    }
    
    Copy-Item -Recurse -Path . -Destination $backupDir
    Write-Host "✅ Backup created at: $backupDir" -ForegroundColor Green
}

# Method 1: Using git filter-repo (recommended)
function Use-GitFilterRepo {
    Write-Host "`n🔧 Method 1: Using git-filter-repo" -ForegroundColor Cyan
    
    # Check if git-filter-repo is installed
    $filterRepoInstalled = $false
    try {
        $result = git filter-repo --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            $filterRepoInstalled = $true
            Write-Host "✅ git-filter-repo is installed: $result" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  git-filter-repo not found" -ForegroundColor Yellow
    }
    
    if (-not $filterRepoInstalled) {
        Write-Host "`nTo install git-filter-repo:" -ForegroundColor Yellow
        Write-Host "  pip install git-filter-repo" -ForegroundColor White
        Write-Host "  OR download from: https://github.com/newren/git-filter-repo`n" -ForegroundColor White
        return $false
    }
    
    # Create patterns file
    $patternsFile = ".git-filter-patterns.txt"
    $SensitiveFiles | Out-File -FilePath $patternsFile -Encoding utf8
    
    Write-Host "`n📝 Files to remove:" -ForegroundColor Yellow
    $SensitiveFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
    
    if ($DryRun) {
        Write-Host "`n🔍 DRY RUN - Would execute:" -ForegroundColor Cyan
        Write-Host "   git filter-repo --invert-paths --paths-from-file $patternsFile --force" -ForegroundColor White
        return $true
    }
    
    # Execute filter-repo
    Write-Host "`n🚀 Running git filter-repo..." -ForegroundColor Yellow
    git filter-repo --invert-paths --paths-from-file $patternsFile --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ History rewritten successfully" -ForegroundColor Green
        Remove-Item $patternsFile -ErrorAction SilentlyContinue
        return $true
    } else {
        Write-Host "❌ Error running git filter-repo" -ForegroundColor Red
        return $false
    }
}

# Method 2: Using BFG Repo-Cleaner
function Use-BFG {
    Write-Host "`n🔧 Method 2: Using BFG Repo-Cleaner" -ForegroundColor Cyan
    
    # Check if BFG is available
    $bfgPath = "bfg.jar"
    if (-not (Test-Path $bfgPath)) {
        Write-Host "⚠️  BFG not found at $bfgPath" -ForegroundColor Yellow
        Write-Host "`nTo use BFG:" -ForegroundColor Yellow
        Write-Host "  1. Download from: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor White
        Write-Host "  2. Place bfg.jar in the repository root`n" -ForegroundColor White
        return $false
    }
    
    if ($DryRun) {
        Write-Host "`n🔍 DRY RUN - Would execute:" -ForegroundColor Cyan
        $SensitiveFiles | ForEach-Object {
            Write-Host "   java -jar bfg.jar --delete-files '$_'" -ForegroundColor White
        }
        return $true
    }
    
    # Execute BFG
    Write-Host "`n🚀 Running BFG..." -ForegroundColor Yellow
    foreach ($file in $SensitiveFiles) {
        Write-Host "   Removing: $file" -ForegroundColor White
        java -jar bfg.jar --delete-files $file
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Files removed from history" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Error running BFG" -ForegroundColor Red
        return $false
    }
}

# Method 3: Using git filter-branch (fallback)
function Use-GitFilterBranch {
    Write-Host "`n🔧 Method 3: Using git filter-branch (legacy)" -ForegroundColor Cyan
    Write-Host "⚠️  Warning: This method is slower and less reliable" -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "`n🔍 DRY RUN - Would execute:" -ForegroundColor Cyan
        Write-Host '   git filter-branch --force --index-filter "git rm -rf --cached --ignore-unmatch <files>" --prune-empty --tag-name-filter cat -- --all' -ForegroundColor White
        return $true
    }
    
    # Build file removal command
    $fileList = ($SensitiveFiles -join " ") -replace "/", "\\"
    $filterCmd = "git rm -rf --cached --ignore-unmatch $fileList"
    
    Write-Host "`n🚀 Running git filter-branch..." -ForegroundColor Yellow
    Write-Host "   This may take several minutes..." -ForegroundColor Gray
    
    git filter-branch --force --index-filter $filterCmd --prune-empty --tag-name-filter cat -- --all
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ History rewritten" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Error running git filter-branch" -ForegroundColor Red
        return $false
    }
}

# Execute cleanup
$success = $false

# Try methods in order of preference
if (Use-GitFilterRepo) {
    $success = $true
} elseif (Use-BFG) {
    $success = $true
} elseif (Use-GitFilterBranch) {
    $success = $true
} else {
    Write-Host "`n❌ No cleanup method available" -ForegroundColor Red
    Write-Host "   Install git-filter-repo or BFG to continue" -ForegroundColor Yellow
    exit 1
}

if (-not $success -or $DryRun) {
    exit 0
}

# Cleanup and garbage collection
Write-Host "`n🧹 Cleaning up..." -ForegroundColor Yellow

# Remove backup refs
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin

# Expire reflog
git reflog expire --expire=now --all

# Garbage collection
Write-Host "   Running garbage collection..." -ForegroundColor Gray
git gc --prune=now --aggressive

Write-Host "✅ Cleanup complete`n" -ForegroundColor Green

# Verify sensitive files are gone
Write-Host "🔍 Verifying sensitive files removed..." -ForegroundColor Yellow
$foundFiles = @()
foreach ($file in $SensitiveFiles) {
    $found = git log --all --pretty=format: --name-only --diff-filter=A | Select-String $file
    if ($found) {
        $foundFiles += $file
    }
}

if ($foundFiles.Count -gt 0) {
    Write-Host "⚠️  Warning: Some files may still be in history:" -ForegroundColor Yellow
    $foundFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
} else {
    Write-Host "✅ All sensitive files removed from history`n" -ForegroundColor Green
}

# Next steps
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Verify the repository is clean:" -ForegroundColor White
Write-Host "   git log --all --oneline --decorate --graph" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Force push to remote (WARNING: Destructive!):" -ForegroundColor White
Write-Host "   git push origin --force --all" -ForegroundColor Gray
Write-Host "   git push origin --force --tags" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Notify all team members to re-clone:" -ForegroundColor White
Write-Host "   cd .." -ForegroundColor Gray
Write-Host "   Remove-Item -Recurse -Force d3vtradehustle-resume-builder" -ForegroundColor Gray
Write-Host "   git clone <repository-url>" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Rotate all exposed API keys immediately!" -ForegroundColor Red
Write-Host "   See: SECURITY_INCIDENT_RESPONSE.md`n" -ForegroundColor Gray

Write-Host "✅ Script completed successfully`n" -ForegroundColor Green
