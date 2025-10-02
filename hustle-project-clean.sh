#!/bin/bash
# Quick cleanup script for Trade Hustle Resume Builder project

echo "🔥 Trade Hustle Project Cleanup"
echo "================================"
echo ""

PROJECT_DIR="/home/ellisgang8819/d3vtradehustle-resume-builder"

cd "$PROJECT_DIR" || exit 1

# Clean frontend
echo "🧹 Cleaning frontend..."
if [ -d "frontend/.next" ]; then
    echo "  Removing frontend/.next ($(du -sh frontend/.next 2>/dev/null | cut -f1))"
    rm -rf frontend/.next
fi

if [ -d "frontend/node_modules" ]; then
    SIZE=$(du -sh frontend/node_modules 2>/dev/null | cut -f1)
    echo "  Found frontend/node_modules ($SIZE)"
    read -p "  Delete and reinstall? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf frontend/node_modules
        cd frontend && npm install
        cd ..
    fi
fi

# Clean api-functions
echo ""
echo "🧹 Cleaning api-functions..."
if [ -d "api-functions/node_modules" ]; then
    SIZE=$(du -sh api-functions/node_modules 2>/dev/null | cut -f1)
    echo "  Found api-functions/node_modules ($SIZE)"
    read -p "  Delete and reinstall? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf api-functions/node_modules
        cd api-functions && npm install
        cd ..
    fi
fi

# Clean other function directories
for dir in backend functions; do
    if [ -d "$dir/node_modules" ]; then
        echo ""
        echo "🧹 Cleaning $dir..."
        SIZE=$(du -sh "$dir/node_modules" 2>/dev/null | cut -f1)
        echo "  Found $dir/node_modules ($SIZE)"
        read -p "  Delete? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$dir/node_modules"
        fi
    fi
done

echo ""
echo "✅ Project cleanup complete!"
echo ""
echo "To start dev server: cd frontend && npm run dev"
echo ""
