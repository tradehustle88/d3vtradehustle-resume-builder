#!/bin/bash

# Script to help set up brick wall background image
# Run this script from the frontend/ directory

echo "🧱 Trade Hustle - Brick Wall Setup Script"
echo "=========================================="

# Check if assets directory exists
if [ ! -d "public/assets" ]; then
    echo "📂 Creating assets directory..."
    mkdir -p public/assets
    echo "✅ Created public/assets/"
else
    echo "✅ Assets directory already exists"
fi

# Check for brick wall image
if [ -f "public/assets/brickwall.webp" ]; then
    echo "✅ Brick wall image found!"
elif [ -f "public/assets/brickwall-background.webp" ]; then
    echo "✅ Brick wall background image found!"
else
    echo "❌ Brick wall image not found"
    echo ""
    echo "📥 To add your brick wall image:"
    echo "1. Save your brick wall image as brickwall.webp"
    echo "2. Move it to: frontend/public/assets/brickwall.webp"
    echo ""
    echo "💡 Alternative file names supported:"
    echo "   - brickwall.webp"
    echo "   - brickwall-background.webp"
    echo "   - brick-wall.webp"
    echo ""
    echo "🖥️  Terminal command example:"
    echo "   mv ~/Downloads/brickwall.webp public/assets/"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Add your brick wall image to public/assets/"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "🎨 Your paint effects are ready:"
ls -la public/fx/ 2>/dev/null || echo "   (Paint effects not found in public/fx/)"

echo ""
echo "✨ Happy building!"