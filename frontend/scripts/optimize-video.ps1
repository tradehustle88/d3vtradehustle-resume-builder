# Video Optimization Script (PowerShell)
# Windows version of optimize-video.sh
#
# Requirements:
# - FFmpeg installed (choco install ffmpeg)
# - Input video in frontend/public/videos/
#
# Usage:
#   .\scripts\optimize-video.ps1
#
# Output:
# - paint-splatter-optimized.mp4 (H.264, CRF 28)
# - paint-splatter-optimized.webm (VP9, CRF 32)
# - paint-splatter-poster.jpg (First frame)

param(
    [string]$InputFile = "public\videos\paint-splatter.mp4",
    [string]$OutputDir = "public\videos\optimized"
)

# Configuration
$InputPath = Join-Path $PSScriptRoot "..\$InputFile"
$OutputDirPath = Join-Path $PSScriptRoot "..\$OutputDir"
$OutputMP4 = Join-Path $OutputDirPath "paint-splatter-optimized.mp4"
$OutputWebM = Join-Path $OutputDirPath "paint-splatter-optimized.webm"
$Poster = Join-Path $OutputDirPath "paint-splatter-poster.jpg"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Cyan "======================================"
Write-ColorOutput Cyan "🎬 Video Optimization Script"
Write-ColorOutput Cyan "======================================`n"

# Check if FFmpeg is installed
try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-Object -First 1
    Write-ColorOutput Green "✓ FFmpeg found: $ffmpegVersion`n"
} catch {
    Write-ColorOutput Red "✗ FFmpeg not found"
    Write-Output "Please install FFmpeg:"
    Write-Output "  choco install ffmpeg"
    Write-Output "  or download from https://ffmpeg.org/download.html"
    exit 1
}

# Check if input file exists
if (-not (Test-Path $InputPath)) {
    Write-ColorOutput Red "✗ Input file not found: $InputPath"
    exit 1
}

# Get original file size
$OriginalSize = (Get-Item $InputPath).Length
$OriginalSizeMB = [math]::Round($OriginalSize / 1MB, 2)

Write-ColorOutput Yellow "Original file: $InputPath"
Write-Output "Original size: $OriginalSizeMB MB`n"

# Create output directory
New-Item -ItemType Directory -Force -Path $OutputDirPath | Out-Null

# Extract poster image (first frame)
Write-ColorOutput Cyan "Extracting poster image..."
$posterArgs = @(
    "-i", $InputPath,
    "-vf", "select=eq(n\,0)",
    "-q:v", "2",
    "-vframes", "1",
    "-y",
    $Poster
)
Start-Process -FilePath "ffmpeg" -ArgumentList $posterArgs -Wait -NoNewWindow

if (Test-Path $Poster) {
    $PosterSize = (Get-Item $Poster).Length
    $PosterSizeKB = [math]::Round($PosterSize / 1KB, 1)
    Write-ColorOutput Green "✓ Poster created: $PosterSizeKB KB`n"
} else {
    Write-ColorOutput Red "✗ Failed to create poster`n"
}

# Optimize MP4 (H.264)
Write-ColorOutput Cyan "Optimizing MP4 (H.264, CRF 28)..."
Write-Output "This may take a few minutes...`n"

$mp4Args = @(
    "-i", $InputPath,
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "slow",
    "-profile:v", "main",
    "-level", "4.0",
    "-movflags", "+faststart",
    "-an",
    "-y",
    $OutputMP4
)
Start-Process -FilePath "ffmpeg" -ArgumentList $mp4Args -Wait -NoNewWindow

if (Test-Path $OutputMP4) {
    $MP4Size = (Get-Item $OutputMP4).Length
    $MP4SizeMB = [math]::Round($MP4Size / 1MB, 2)
    $MP4Savings = [math]::Round((1 - $MP4Size / $OriginalSize) * 100, 1)
    Write-ColorOutput Green "✓ MP4 created: $MP4SizeMB MB ($MP4Savings% smaller)`n"
} else {
    Write-ColorOutput Red "✗ Failed to create MP4`n"
}

# Optimize WebM (VP9)
Write-ColorOutput Cyan "Optimizing WebM (VP9, CRF 32)..."
Write-Output "This may take longer than MP4...`n"

$webmArgs = @(
    "-i", $InputPath,
    "-c:v", "libvpx-vp9",
    "-crf", "32",
    "-b:v", "0",
    "-deadline", "good",
    "-cpu-used", "2",
    "-row-mt", "1",
    "-an",
    "-y",
    $OutputWebM
)
Start-Process -FilePath "ffmpeg" -ArgumentList $webmArgs -Wait -NoNewWindow

if (Test-Path $OutputWebM) {
    $WebMSize = (Get-Item $OutputWebM).Length
    $WebMSizeMB = [math]::Round($WebMSize / 1MB, 2)
    $WebMSavings = [math]::Round((1 - $WebMSize / $OriginalSize) * 100, 1)
    Write-ColorOutput Green "✓ WebM created: $WebMSizeMB MB ($WebMSavings% smaller)`n"
} else {
    Write-ColorOutput Red "✗ Failed to create WebM`n"
}

# Summary
Write-ColorOutput Cyan "======================================"
Write-ColorOutput Cyan "📊 Optimization Summary"
Write-ColorOutput Cyan "======================================`n"

Write-Output "Original:  $OriginalSizeMB MB"
if (Test-Path $OutputMP4) { Write-Output "MP4:       $MP4SizeMB MB ($MP4Savings% reduction)" }
if (Test-Path $OutputWebM) { Write-Output "WebM:      $WebMSizeMB MB ($WebMSavings% reduction)" }
if (Test-Path $Poster) { Write-Output "Poster:    $PosterSizeKB KB" }

Write-Output ""
Write-ColorOutput Green "✓ Optimization complete!`n"

Write-ColorOutput Yellow "Next steps:"
Write-Output "1. Update video component to use OptimizedVideo component"
Write-Output "2. Point to optimized files in public/videos/optimized/"
Write-Output "3. Test on Safari (MP4) and Chrome (WebM)"
Write-Output "4. Verify poster image loads before video"
Write-Output ""
