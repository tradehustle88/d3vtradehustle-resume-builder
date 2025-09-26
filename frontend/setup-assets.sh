#!/bin/bash

# setup-assets.sh - Helper script to set up assets folder and move images

echo "🚀 Setting up assets folder for Trade Hustle Resume Builder"

# Create assets folder if it doesn't exist
mkdir -p public/assets

echo "✅ Created public/assets/ folder"

# Check if user has the brick wall image
if [ -f "rickwall-background.webp" ]; then
    echo "📁 Found rickwall-background.webp - moving to public/assets/"
    mv rickwall-background.webp public/assets/
    echo "✅ Moved rickwall-background.webp to public/assets/"
else
    echo "⚠️  rickwall-background.webp not found in current directory"
    echo "   Please place your brick wall image in frontend/public/assets/rickwall-background.webp"
fi

# Check Downloads folder
if [ -f "$HOME/Downloads/rickwall-background.webp" ]; then
    echo "📁 Found rickwall-background.webp in Downloads - moving to public/assets/"
    mv "$HOME/Downloads/rickwall-background.webp" public/assets/
    echo "✅ Moved rickwall-background.webp from Downloads to public/assets/"
fi

# List assets folder contents
echo ""
echo "📂 Current assets folder contents:"
ls -la public/assets/ 2>/dev/null || echo "   (empty)"

echo ""
echo "🎨 Your brick wall background will be available at: /assets/rickwall-background.webp"
echo "   Use the BrickWallHero component to display it with paint effects!"
echo ""
echo "   Example usage:"
echo "   import BrickWallHero from '@/components/BrickWallHero';"
echo ""
echo "   <BrickWallHero>"
echo "     <h1>Your Content Here</h1>"
echo "   </BrickWallHero>"