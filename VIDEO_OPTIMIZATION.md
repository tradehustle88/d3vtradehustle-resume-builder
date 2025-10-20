# Video Optimization Guide

## Current Status
- **File**: `VerifierSection.mp4`
- **Size**: 4.42MB
- **Impact**: Major performance bottleneck

## Recommended Optimizations

### Option 1: Compress with FFmpeg (Recommended)
```bash
# Install FFmpeg first: https://ffmpeg.org/download.html
# Then run:
ffmpeg -i public/assets/VerifierSection.mp4 \
  -vcodec h264 \
  -crf 28 \
  -preset slow \
  -vf "scale=480:640" \
  -movflags +faststart \
  public/assets/VerifierSection-optimized.mp4
```

**Expected result**: ~500KB (89% smaller)

### Option 2: Use Poster Image + Lazy Load
Replace video with a static poster image that loads the video on interaction:

```tsx
<video 
  poster="/assets/verifier-poster.jpg"  // Add a poster
  preload="none"                         // Don't preload
  onClick={(e) => e.currentTarget.play()} // Play on click
>
```

### Option 3: Use WebM Format (Better Compression)
```bash
ffmpeg -i public/assets/VerifierSection.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  public/assets/VerifierSection.webm
```

## Quick Win: Change preload attribute
Change from `preload="auto"` to `preload="metadata"` or `preload="none"`

This alone will save 4.4MB on initial page load!
