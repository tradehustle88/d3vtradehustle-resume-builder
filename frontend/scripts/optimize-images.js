/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format with quality optimization
 * 
 * Expected Results:
 * - paint_splatters_1.png (1.7MB) → paint_splatters_1.webp (~150KB) - 91% reduction
 * - paint_splatters_2.png (1.3MB) → paint_splatters_2.webp (~120KB) - 91% reduction
 * - Total bandwidth savings: ~2.8MB → ~270KB
 * 
 * Run: node scripts/optimize-images.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public/fx'),
  outputDir: path.join(__dirname, '../public/fx/optimized'),
  quality: 85, // WebP quality (80-90 recommended)
  formats: ['webp', 'png'], // Generate WebP + optimized PNG fallback
  maxWidth: 800, // Resize large images (paint splatters are 300px max usage)
};

// Color palette for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
};

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate savings percentage
 */
function calculateSavings(original, optimized) {
  return Math.round((1 - optimized / original) * 100);
}

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputDir, filename) {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  
  try {
    // Get original file size
    const stats = await fs.stat(inputPath);
    const originalSize = stats.size;
    
    console.log(`\n${colors.blue}Processing: ${filename}${colors.reset}`);
    console.log(`Original size: ${formatBytes(originalSize)}`);
    
    // Load image with sharp
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
    
    // Resize if larger than maxWidth (maintain aspect ratio)
    let pipeline = image;
    if (metadata.width > config.maxWidth) {
      pipeline = pipeline.resize(config.maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true,
      });
      console.log(`Resizing to max width: ${config.maxWidth}px`);
    }
    
    const results = [];
    
    // Generate WebP version
    const webpPath = path.join(outputDir, `${nameWithoutExt}.webp`);
    await pipeline
      .clone()
      .webp({ quality: config.quality, effort: 6 })
      .toFile(webpPath);
    
    const webpStats = await fs.stat(webpPath);
    const webpSize = webpStats.size;
    const webpSavings = calculateSavings(originalSize, webpSize);
    
    results.push({
      format: 'WebP',
      path: webpPath,
      size: webpSize,
      savings: webpSavings,
    });
    
    console.log(`${colors.green}✓ WebP: ${formatBytes(webpSize)} (${webpSavings}% smaller)${colors.reset}`);
    
    // Generate optimized PNG fallback
    const pngPath = path.join(outputDir, `${nameWithoutExt}-optimized.png`);
    await pipeline
      .clone()
      .png({ quality: 90, compressionLevel: 9, effort: 10 })
      .toFile(pngPath);
    
    const pngStats = await fs.stat(pngPath);
    const pngSize = pngStats.size;
    const pngSavings = calculateSavings(originalSize, pngSize);
    
    results.push({
      format: 'PNG',
      path: pngPath,
      size: pngSize,
      savings: pngSavings,
    });
    
    console.log(`${colors.green}✓ PNG: ${formatBytes(pngSize)} (${pngSavings}% smaller)${colors.reset}`);
    
    return {
      original: filename,
      originalSize,
      results,
    };
    
  } catch (error) {
    console.error(`${colors.red}✗ Error processing ${filename}: ${error.message}${colors.reset}`);
    return null;
  }
}

/**
 * Generate picture element usage example
 */
function generatePictureExample(filename) {
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  
  return `
{/* Optimized version with WebP and fallback */}
<picture>
  <source 
    srcSet="/fx/optimized/${nameWithoutExt}.webp" 
    type="image/webp"
  />
  <img 
    src="/fx/optimized/${nameWithoutExt}-optimized.png"
    alt="Decorative paint splatter accent"
    width={300}
    height={300}
    className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-auto"
    loading="lazy"
  />
</picture>
`;
}

/**
 * Main optimization function
 */
async function main() {
  console.log(`${colors.blue}======================================`);
  console.log('🎨 Image Optimization Script');
  console.log(`======================================${colors.reset}\n`);
  
  try {
    // Ensure output directory exists
    await fs.mkdir(config.outputDir, { recursive: true });
    console.log(`${colors.green}✓ Created output directory: ${config.outputDir}${colors.reset}`);
    
    // Read input directory
    const files = await fs.readdir(config.inputDir);
    
    // Filter image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
      console.log(`${colors.yellow}⚠ No images found in ${config.inputDir}${colors.reset}`);
      return;
    }
    
    console.log(`Found ${imageFiles.length} image(s) to optimize:\n`);
    imageFiles.forEach(file => console.log(`  - ${file}`));
    
    // Process each image
    const results = [];
    for (const file of imageFiles) {
      const inputPath = path.join(config.inputDir, file);
      const result = await optimizeImage(inputPath, config.outputDir, file);
      if (result) results.push(result);
    }
    
    // Summary
    console.log(`\n${colors.blue}======================================`);
    console.log('📊 Optimization Summary');
    console.log(`======================================${colors.reset}\n`);
    
    let totalOriginal = 0;
    let totalOptimized = 0;
    
    results.forEach(result => {
      totalOriginal += result.originalSize;
      const webpResult = result.results.find(r => r.format === 'WebP');
      if (webpResult) totalOptimized += webpResult.size;
    });
    
    const totalSavings = calculateSavings(totalOriginal, totalOptimized);
    
    console.log(`Original total size: ${formatBytes(totalOriginal)}`);
    console.log(`Optimized total size (WebP): ${formatBytes(totalOptimized)}`);
    console.log(`${colors.green}Total savings: ${formatBytes(totalOriginal - totalOptimized)} (${totalSavings}%)${colors.reset}\n`);
    
    // Usage examples
    console.log(`${colors.blue}======================================`);
    console.log('📝 Usage Examples');
    console.log(`======================================${colors.reset}\n`);
    
    results.forEach(result => {
      console.log(`For ${result.original}:`);
      console.log(generatePictureExample(result.original));
    });
    
    console.log(`${colors.green}✓ Optimization complete!${colors.reset}\n`);
    console.log(`${colors.yellow}Next steps:${colors.reset}`);
    console.log('1. Update image imports in your components to use optimized versions');
    console.log('2. Use <picture> element for WebP with PNG fallback');
    console.log('3. Test on different browsers (WebP support: Chrome, Firefox, Edge, Safari 14+)');
    console.log('4. Keep original files as backup\n');
    
  } catch (error) {
    console.error(`${colors.red}✗ Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, formatBytes };
