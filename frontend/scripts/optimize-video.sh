#!/bin/bash

###############################################################################
# Video Optimization Script
# Converts videos to optimized MP4 and WebM formats with poster images
#
# Requirements:
# - FFmpeg installed (https://ffmpeg.org/download.html)
# - Input video in frontend/public/videos/
#
# Usage:
#   chmod +x scripts/optimize-video.sh
#   ./scripts/optimize-video.sh
#
# Output:
# - paint-splatter-optimized.mp4 (H.264, CRF 28)
# - paint-splatter-optimized.webm (VP9, CRF 32)
# - paint-splatter-poster.jpg (First frame)
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
INPUT_DIR="public/videos"
OUTPUT_DIR="public/videos/optimized"
INPUT_FILE="$INPUT_DIR/paint-splatter.mp4"
OUTPUT_MP4="$OUTPUT_DIR/paint-splatter-optimized.mp4"
OUTPUT_WEBM="$OUTPUT_DIR/paint-splatter-optimized.webm"
POSTER="$OUTPUT_DIR/paint-splatter-poster.jpg"

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}✗ FFmpeg not found${NC}"
    echo "Please install FFmpeg:"
    echo "  - Windows: choco install ffmpeg"
    echo "  - macOS: brew install ffmpeg"
    echo "  - Linux: apt-get install ffmpeg"
    exit 1
fi

echo -e "${BLUE}======================================"
echo "🎬 Video Optimization Script"
echo -e "======================================${NC}\n"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}✗ Input file not found: $INPUT_FILE${NC}"
    exit 1
fi

# Get original file size
ORIGINAL_SIZE=$(stat -f%z "$INPUT_FILE" 2>/dev/null || stat -c%s "$INPUT_FILE" 2>/dev/null)
ORIGINAL_SIZE_MB=$(echo "scale=2; $ORIGINAL_SIZE / 1024 / 1024" | bc)

echo -e "${YELLOW}Original file: $INPUT_FILE${NC}"
echo -e "Original size: ${ORIGINAL_SIZE_MB} MB\n"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Extract poster image (first frame)
echo -e "${BLUE}Extracting poster image...${NC}"
ffmpeg -i "$INPUT_FILE" -vf "select=eq(n\,0)" -q:v 2 -vframes 1 "$POSTER" -y 2>&1 | grep -v "frame=" || true

if [ -f "$POSTER" ]; then
    POSTER_SIZE=$(stat -f%z "$POSTER" 2>/dev/null || stat -c%s "$POSTER" 2>/dev/null)
    POSTER_SIZE_KB=$(echo "scale=1; $POSTER_SIZE / 1024" | bc)
    echo -e "${GREEN}✓ Poster created: ${POSTER_SIZE_KB} KB${NC}\n"
else
    echo -e "${RED}✗ Failed to create poster${NC}\n"
fi

# Optimize MP4 (H.264)
echo -e "${BLUE}Optimizing MP4 (H.264, CRF 28)...${NC}"
echo "This may take a few minutes..."

ffmpeg -i "$INPUT_FILE" \
  -c:v libx264 \
  -crf 28 \
  -preset slow \
  -profile:v main \
  -level 4.0 \
  -movflags +faststart \
  -an \
  "$OUTPUT_MP4" -y 2>&1 | grep -v "frame=" || true

if [ -f "$OUTPUT_MP4" ]; then
    MP4_SIZE=$(stat -f%z "$OUTPUT_MP4" 2>/dev/null || stat -c%s "$OUTPUT_MP4" 2>/dev/null)
    MP4_SIZE_MB=$(echo "scale=2; $MP4_SIZE / 1024 / 1024" | bc)
    MP4_SAVINGS=$(echo "scale=1; (1 - $MP4_SIZE / $ORIGINAL_SIZE) * 100" | bc)
    echo -e "${GREEN}✓ MP4 created: ${MP4_SIZE_MB} MB (${MP4_SAVINGS}% smaller)${NC}\n"
else
    echo -e "${RED}✗ Failed to create MP4${NC}\n"
fi

# Optimize WebM (VP9)
echo -e "${BLUE}Optimizing WebM (VP9, CRF 32)...${NC}"
echo "This may take longer than MP4..."

ffmpeg -i "$INPUT_FILE" \
  -c:v libvpx-vp9 \
  -crf 32 \
  -b:v 0 \
  -deadline good \
  -cpu-used 2 \
  -row-mt 1 \
  -an \
  "$OUTPUT_WEBM" -y 2>&1 | grep -v "frame=" || true

if [ -f "$OUTPUT_WEBM" ]; then
    WEBM_SIZE=$(stat -f%z "$OUTPUT_WEBM" 2>/dev/null || stat -c%s "$OUTPUT_WEBM" 2>/dev/null)
    WEBM_SIZE_MB=$(echo "scale=2; $WEBM_SIZE / 1024 / 1024" | bc)
    WEBM_SAVINGS=$(echo "scale=1; (1 - $WEBM_SIZE / $ORIGINAL_SIZE) * 100" | bc)
    echo -e "${GREEN}✓ WebM created: ${WEBM_SIZE_MB} MB (${WEBM_SAVINGS}% smaller)${NC}\n"
else
    echo -e "${RED}✗ Failed to create WebM${NC}\n"
fi

# Summary
echo -e "${BLUE}======================================"
echo "📊 Optimization Summary"
echo -e "======================================${NC}\n"

echo "Original:  ${ORIGINAL_SIZE_MB} MB"
[ -f "$OUTPUT_MP4" ] && echo "MP4:       ${MP4_SIZE_MB} MB (${MP4_SAVINGS}% reduction)"
[ -f "$OUTPUT_WEBM" ] && echo "WebM:      ${WEBM_SIZE_MB} MB (${WEBM_SAVINGS}% reduction)"
[ -f "$POSTER" ] && echo "Poster:    ${POSTER_SIZE_KB} KB"

echo -e "\n${GREEN}✓ Optimization complete!${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update video component to use OptimizedVideo component"
echo "2. Point to optimized files in public/videos/optimized/"
echo "3. Test on Safari (MP4) and Chrome (WebM)"
echo "4. Verify poster image loads before video"
echo ""
