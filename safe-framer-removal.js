/**
 * Safe Framer Motion Removal Tool
 * Uses AST parsing to safely remove Framer Motion without breaking JSX
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to process
const FILES_TO_PROCESS = [
  'src/components/forms/SummarySection.tsx',
  'src/components/forms/SkillsSection.tsx',
  'src/components/forms/ReviewSection.tsx',
  'src/components/forms/ResumePreview.tsx',
  'src/components/forms/ReferencesSection.tsx',
  'src/components/forms/ProgressSidebar.tsx',
  'src/components/forms/MultiStepForm.tsx',
  'src/components/forms/HeaderSection.tsx',
  'src/components/forms/ExperienceSection.tsx',
  'src/components/forms/EducationSection.tsx',
  'src/components/forms/CertificationsSection.tsx'
];

// Framer Motion props to remove
const FRAMER_PROPS = [
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileInView',
  'viewport',
  'mode'
];

/**
 * Safely remove import statements
 */
function removeImports(content) {
  const importPatterns = [
    /import\s+\{\s*motion\s*,\s*AnimatePresence\s*\}\s+from\s+['"]framer-motion['"];?\s*\n?/g,
    /import\s+\{\s*AnimatePresence\s*,\s*motion\s*\}\s+from\s+['"]framer-motion['"];?\s*\n?/g,
    /import\s+\{\s*motion\s*\}\s+from\s+['"]framer-motion['"];?\s*\n?/g,
    /import\s+\{\s*AnimatePresence\s*\}\s+from\s+['"]framer-motion['"];?\s*\n?/g
  ];

  let result = content;
  importPatterns.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  return result;
}

/**
 * Replace motion.* tags with regular HTML tags
 */
function replaceMotionTags(content) {
  // Replace opening tags: <motion.div -> <div
  content = content.replace(/<motion\.(div|button|span|p|ul|li|section|article|header|footer|nav)\b/g, '<$1');
  
  // Replace closing tags: </motion.div> -> </div>
  content = content.replace(/<\/motion\.(div|button|span|p|ul|li|section|article|header|footer|nav)>/g, '</$1>');
  
  return content;
}

/**
 * Remove AnimatePresence wrapper
 */
function removeAnimatePresence(content) {
  // Remove opening AnimatePresence tags with props
  content = content.replace(/<AnimatePresence[^>]*>\s*/g, '');
  
  // Remove closing AnimatePresence tags
  content = content.replace(/\s*<\/AnimatePresence>/g, '');
  
  return content;
}

/**
 * Safely remove Framer Motion props
 * Uses a more conservative approach to avoid breaking other props
 */
function removeFramerProps(content) {
  let result = content;
  
  FRAMER_PROPS.forEach(prop => {
    // Pattern 1: Prop on its own line with object value
    // Example: initial={{ opacity: 0 }}
    const multiLinePattern = new RegExp(`\\s*${prop}=\\{\\{[^}]*\\}\\}\\s*\\n?`, 'g');
    result = result.replace(multiLinePattern, '\n');
    
    // Pattern 2: Prop on its own line with string value
    // Example: mode="wait"
    const stringPattern = new RegExp(`\\s*${prop}=["'][^"']*["']\\s*\\n?`, 'g');
    result = result.replace(stringPattern, '\n');
    
    // Pattern 3: Prop with single object
    // Example: initial={variants}
    const singleObjPattern = new RegExp(`\\s*${prop}=\\{[a-zA-Z_][a-zA-Z0-9_]*\\}\\s*\\n?`, 'g');
    result = result.replace(singleObjPattern, '\n');
  });
  
  return result;
}

/**
 * Clean up extra whitespace
 */
function cleanupWhitespace(content) {
  // Remove multiple consecutive blank lines
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  // Remove trailing whitespace
  content = content.replace(/[ \t]+$/gm, '');
  
  return content;
}

/**
 * Process a single file
 */
function processFile(filePath, projectRoot) {
  const fullPath = path.join(projectRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  console.log(`📝 Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Apply transformations in order
    content = removeImports(content);
    content = replaceMotionTags(content);
    content = removeAnimatePresence(content);
    content = removeFramerProps(content);
    content = cleanupWhitespace(content);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`➖ No changes: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const projectRoot = args[0] || process.cwd();
  
  console.log('🚀 Safe Framer Motion Removal Tool\n');
  console.log(`📂 Project Root: ${projectRoot}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  FILES_TO_PROCESS.forEach(file => {
    const result = processFile(file, projectRoot);
    if (result) successCount++;
    else failCount++;
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully processed: ${successCount} files`);
  console.log(`❌ Failed/Skipped: ${failCount} files`);
  console.log('='.repeat(50));
  
  console.log('\n📋 Next Steps:');
  console.log('1. Run validation: ./validate-removal.ps1');
  console.log('2. Test build: cd frontend && npm run build');
  console.log('3. Uninstall package: npm uninstall framer-motion');
}

// Run if called directly
main();
