// Convert PNG to WebP with transparency preserved
const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not installed. Installing now...');
  const { execSync } = require('child_process');
  execSync('npm install sharp', { stdio: 'inherit' });
  sharp = require('sharp');
}

const inputPath = path.join(__dirname, 'public', 'assets', 'resumeBuilderLogo-v3.png');
const outputPath = path.join(__dirname, 'public', 'assets', 'resumeBuilderLogo-v3.webp');

console.log('🔄 Converting PNG to WebP with transparency...\n');
console.log(`Input:  ${inputPath}`);
console.log(`Output: ${outputPath}\n`);

sharp(inputPath)
  .webp({
    quality: 90,           // High quality
    alphaQuality: 100,     // Perfect transparency
    lossless: false,       // Use lossy for smaller size
    nearLossless: false,   // Balanced approach
    smartSubsample: true,  // Better quality
    effort: 6              // Maximum compression effort
  })
  .toFile(outputPath)
  .then(info => {
    console.log('✅ Conversion successful!\n');
    console.log('Output info:');
    console.log(`  Format: ${info.format}`);
    console.log(`  Width: ${info.width}px`);
    console.log(`  Height: ${info.height}px`);
    console.log(`  Size: ${(info.size / 1024).toFixed(2)} KB`);
    console.log(`  Channels: ${info.channels} ${info.channels === 4 ? '(RGBA - Has transparency! ✅)' : ''}`);
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    const originalSize = originalStats.size / 1024;
    const newSize = info.size / 1024;
    const savings = originalSize - newSize;
    const percentage = ((savings / originalSize) * 100).toFixed(1);
    
    console.log('\n📊 Comparison:');
    console.log(`  Original PNG: ${originalSize.toFixed(2)} KB`);
    console.log(`  New WebP: ${newSize.toFixed(2)} KB`);
    console.log(`  Saved: ${savings.toFixed(2)} KB (-${percentage}%)`);
    
    console.log('\n✨ Done! The transparent WebP is ready to use.');
  })
  .catch(err => {
    console.error('❌ Error during conversion:', err);
    process.exit(1);
  });
