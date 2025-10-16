# Hero Background Video

## Video Requirements

**Format:** MP4 (H.264 codec recommended for best browser support)  
**Duration:** 5-10 seconds (will loop seamlessly)  
**Resolution:** 1920x1080 (1080p) minimum  
**File Size:** Keep under 5MB for fast loading  
**Aspect Ratio:** 16:9  
**Frame Rate:** 30fps or 60fps  

## Recommended Sources

### Free Stock Video Sites

1. **Pexels Videos** - https://www.pexels.com/videos/
   - Search terms: "construction", "crane", "welding", "trades", "tools"
   
2. **Pixabay Videos** - https://pixabay.com/videos/
   - Search terms: "construction site", "heavy machinery", "industrial"
   
3. **Videvo** - https://www.videvo.net/
   - Has construction and industrial categories

### Suggested Video Themes

✅ **Best Options:**
- Aerial crane lifting shot at golden hour
- Slow-motion construction sparks (welding/grinding)
- Earth mover/bulldozer at sunrise
- Time-lapse of construction work
- Close-up of power tools in action
- Overhead view of workers on site

⚠️ **Avoid:**
- Too busy/chaotic scenes (will distract from content)
- Videos with people's faces (privacy/licensing)
- Shaky/handheld footage
- Videos with visible branding

## Video Optimization

Before using your video:

### 1. Compress the video
```bash
# Using ffmpeg (recommended)
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf "scale=1920:1080" -b:v 2M trade-hero.mp4
```

### 2. Remove audio (if present)
```bash
ffmpeg -i input.mp4 -an -vcodec copy trade-hero.mp4
```

### 3. Create seamless loop
- Ensure first and last frames match
- Consider videos naturally designed to loop

## File Naming

Place your optimized video as:
```
/frontend/public/videos/trade-hero.mp4
```

## Alternative: Use Animated Background

If you don't want to use video, you can create an animated CSS gradient instead:

```css
.hero-gradient {
  background: linear-gradient(
    -45deg,
    #001a33 0%,
    #1673FF 25%,
    #FFD700 50%,
    #DC2626 75%,
    #001a33 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## Testing Checklist

- [ ] Video loads quickly (< 5MB)
- [ ] Video loops seamlessly
- [ ] Opacity is subtle (0.25-0.35)
- [ ] Text remains readable over video
- [ ] Works on mobile devices
- [ ] No audio plays
- [ ] Poster image displays while loading

## Current Implementation

The hero section is configured to:
- Display video at 30% opacity
- Shimmer/fade effect (4s loop)
- Parallax scroll effect (moves slower than page)
- White gradient overlay for text readability
- Fallback to static image if video unavailable
