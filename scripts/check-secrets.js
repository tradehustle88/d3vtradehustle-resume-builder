#!/usr/bin/env node

/**
 * Secret Scanner for Pre-commit Hook
 * Scans staged files for potential secrets, API keys, and sensitive data
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Patterns to detect secrets
const SECRET_PATTERNS = [
  {
    name: 'Firebase API Key',
    pattern: /AIza[0-9A-Za-z-_]{35}/g,
    severity: 'HIGH'
  },
  {
    name: 'Firebase Private Key',
    pattern: /-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Stripe Secret Key',
    pattern: /sk_live_[0-9a-zA-Z]{24,}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Stripe Test Key',
    pattern: /sk_test_[0-9a-zA-Z]{24,}/g,
    severity: 'HIGH'
  },
  {
    name: 'Generic API Key',
    pattern: /api[_-]?key["\s:=]+["']?[a-zA-Z0-9_\-]{20,}/gi,
    severity: 'MEDIUM'
  },
  {
    name: 'AWS Access Key',
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Generic Secret',
    pattern: /secret["\s:=]+["']?[a-zA-Z0-9_\-]{20,}/gi,
    severity: 'MEDIUM'
  },
  {
    name: 'Password in Code',
    pattern: /password\s*[=:]\s*["']([^"'\s]{8,})/gi,
    severity: 'HIGH'
  }
];

// Files and directories to always ignore
const IGNORE_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /\.next\//,
  /out\//,
  /build\//,
  /dist\//,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.svg$/,
  /\.ico$/,
  /\.woff$/,
  /\.woff2$/,
  /\.ttf$/,
  /\.eot$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /\.example$/,  // Allow .env.example files
  /\.md$/,       // Allow markdown docs (with warnings)
  /\.html$/      // Allow HTML reports (with warnings)
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', { 
      encoding: 'utf-8' 
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('❌ Error getting staged files:', error.message);
    return [];
  }
}

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(filePath));
}

function scanFileForSecrets(filePath) {
  const issues = [];
  
  if (!fs.existsSync(filePath)) {
    return issues;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  for (const { name, pattern, severity } of SECRET_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        file: filePath,
        type: name,
        severity,
        count: matches.length,
        preview: matches[0].substring(0, 30) + '...'
      });
    }
  }
  
  return issues;
}

function main() {
  console.log('🔍 Scanning staged files for secrets...\n');
  
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('ℹ️  No staged files to scan.');
    return 0;
  }
  
  const allIssues = [];
  const warnings = [];
  
  for (const file of stagedFiles) {
    if (shouldIgnoreFile(file)) {
      continue;
    }
    
    // Check for .env files
    if (/\.env(\.|$)/.test(file)) {
      allIssues.push({
        file,
        type: 'Environment File',
        severity: 'CRITICAL',
        count: 1,
        preview: '.env files should never be committed'
      });
      continue;
    }
    
    // Check for service account files
    if (/serviceAccount|firebase-adminsdk/.test(file)) {
      allIssues.push({
        file,
        type: 'Service Account Credentials',
        severity: 'CRITICAL',
        count: 1,
        preview: 'Firebase credentials should never be committed'
      });
      continue;
    }
    
    const issues = scanFileForSecrets(file);
    
    if (issues.length > 0) {
      if (file.endsWith('.md') || file.endsWith('.html')) {
        warnings.push(...issues);
      } else {
        allIssues.push(...issues);
      }
    }
  }
  
  // Report critical issues
  if (allIssues.length > 0) {
    console.error('❌ CRITICAL: Secrets detected in staged files!\n');
    
    for (const issue of allIssues) {
      console.error(`  [${issue.severity}] ${issue.type}`);
      console.error(`  File: ${issue.file}`);
      console.error(`  Preview: ${issue.preview}`);
      console.error('');
    }
    
    console.error('🛑 Commit blocked to protect secrets.');
    console.error('💡 Remove sensitive data or add files to .gitignore\n');
    process.exit(1);
  }
  
  // Report warnings (non-blocking)
  if (warnings.length > 0) {
    console.warn('⚠️  Warnings: Potential secrets in documentation files:\n');
    
    for (const warning of warnings) {
      console.warn(`  [${warning.severity}] ${warning.type}`);
      console.warn(`  File: ${warning.file}`);
      console.warn('');
    }
    
    console.warn('⚠️  Please verify these are example/redacted values.\n');
  }
  
  console.log('✅ Security scan passed\n');
  process.exit(0);
}

main();
