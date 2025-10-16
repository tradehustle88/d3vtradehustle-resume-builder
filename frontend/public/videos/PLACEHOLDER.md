# Video Placeholder

This file serves as a placeholder until you add your actual trade video.

## Quick Setup

1. Download a free construction/trades video from:
   - Pexels: https://www.pexels.com/videos/
   - Pixabay: https://pixabay.com/videos/
   - Videvo: https://www.videvo.net/

2. Optimize the video:
   ```bash
   ffmpeg -i your-video.mp4 -vcodec h264 -vf "scale=1920:1080" -b:v 2M trade-hero.mp4
   ```

3. Place it here as: `trade-hero.mp4`

## Current Fallback

The site uses `tools-background.png` as a poster/fallback image when the video is not available.

This provides a seamless experience even without the video file.
