const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '..', 'public', 'assets', 'templates');

async function optimizeTemplates() {
  const files = fs.readdirSync(TEMPLATE_DIR).filter(file => file.endsWith('-thumbnail.png'));
  
  console.log(`\n🖼️  Optimizing ${files.length} template thumbnail images...\n`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const file of files) {
    const filePath = path.join(TEMPLATE_DIR, file);
    const tempPath = path.join(TEMPLATE_DIR, `temp_${file}`);
    
    const inputStats = fs.statSync(filePath);
    const inputSizeKB = (inputStats.size / 1024).toFixed(2);
    totalOriginal += inputStats.size;
    
    // Optimize in place
    await sharp(filePath)
      .resize(400, 500, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      })
      .png({
        quality: 85,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true // Use palette for smaller file size
      })
      .toFile(tempPath);
    
    // Replace original with optimized
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);
    
    const outputStats = fs.statSync(filePath);
    const outputSizeKB = (outputStats.size / 1024).toFixed(2);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    totalOptimized += outputStats.size;
    
    console.log(`✅ ${file}`);
    console.log(`   ${inputSizeKB}KB → ${outputSizeKB}KB (${savings}% smaller)\n`);
  }
  
  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  const savedMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2);
  
  console.log('═══════════════════════════════════════');
  console.log('🎉 Image optimization complete!');
  console.log(`📊 Total savings: ${savedMB}MB (${totalSavings}%)`);
  console.log('═══════════════════════════════════════\n');
}

optimizeTemplates().catch(console.error);
