/**
 * Environment Variable Validation
 * Validates required environment variables at build time
 * Prevents deployment failures and runtime errors
 * 
 * Usage:
 * Import at the top of next.config.js or root layout:
 * ```js
 * import './src/lib/validateEnv';
 * ```
 * 
 * Features:
 * - Type-safe environment variables
 * - Clear error messages with missing vars
 * - Build-time validation (fail fast)
 * - Development-friendly (warns instead of crashes)
 */

interface EnvVarConfig {
  name: string;
  required: boolean;
  description: string;
  example?: string;
}

/**
 * Required environment variables configuration
 */
const ENV_VARS: EnvVarConfig[] = [
  // Firebase Configuration (Public)
  {
    name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    required: true,
    description: 'Firebase API key for client-side authentication',
    example: 'AIzaSyA...',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    required: true,
    description: 'Firebase authentication domain',
    example: 'your-app.firebaseapp.com',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    required: true,
    description: 'Firebase project ID',
    example: 'your-project-id',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    required: true,
    description: 'Firebase storage bucket URL',
    example: 'your-project.appspot.com',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    required: true,
    description: 'Firebase Cloud Messaging sender ID',
    example: '123456789012',
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    required: true,
    description: 'Firebase application ID',
    example: '1:123456789012:web:abcdef',
  },
  
  // API Configuration
  {
    name: 'NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL',
    required: false,
    description: 'Firebase Functions base URL (defaults to production if not set)',
    example: 'https://us-central1-your-project.cloudfunctions.net/api',
  },
  
  // Google Analytics
  {
    name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    description: 'Google Analytics 4 measurement ID',
    example: 'G-XXXXXXXXXX',
  },
];

/**
 * Color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

/**
 * Validate a single environment variable
 */
function validateEnvVar(config: EnvVarConfig): boolean {
  const value = process.env[config.name];
  
  if (!value || value.trim() === '') {
    if (config.required) {
      console.error(
        `${colors.red}${colors.bold}✗ Missing required environment variable: ${config.name}${colors.reset}`
      );
      console.error(`  ${colors.yellow}Description: ${config.description}${colors.reset}`);
      if (config.example) {
        console.error(`  ${colors.blue}Example: ${config.example}${colors.reset}\n`);
      }
      return false;
    } else {
      console.warn(
        `${colors.yellow}⚠ Optional environment variable not set: ${config.name}${colors.reset}`
      );
      console.warn(`  ${colors.yellow}Description: ${config.description}${colors.reset}\n`);
      return true;
    }
  }
  
  return true;
}

/**
 * Validate all environment variables
 */
export function validateEnvironment(): void {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isBuild = process.env.NODE_ENV === 'production' || process.argv.includes('build');
  
  console.log(`${colors.blue}${colors.bold}Validating environment variables...${colors.reset}\n`);
  
  const results = ENV_VARS.map(validateEnvVar);
  const allValid = results.every(result => result === true);
  const missingRequired = results.filter((result, i) => !result && ENV_VARS[i].required).length;
  
  if (allValid) {
    console.log(`${colors.green}${colors.bold}✓ All required environment variables are set${colors.reset}\n`);
    return;
  }
  
  // In development, warn but don't fail
  if (isDevelopment && !isBuild) {
    console.warn(
      `${colors.yellow}${colors.bold}⚠ ${missingRequired} required variable(s) missing${colors.reset}`
    );
    console.warn(
      `${colors.yellow}Development mode: Application may not function correctly.${colors.reset}\n`
    );
    return;
  }
  
  // In production/build, fail hard
  console.error(
    `${colors.red}${colors.bold}✗ ${missingRequired} required variable(s) missing${colors.reset}`
  );
  console.error(`${colors.red}Cannot proceed with build/deployment.${colors.reset}\n`);
  console.error(`${colors.blue}How to fix:${colors.reset}`);
  console.error('1. Copy .env.example to .env.local');
  console.error('2. Fill in all required values');
  console.error('3. Restart the development server or build process\n');
  
  process.exit(1);
}

/**
 * Type-safe environment variable getter
 */
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is not set and no fallback provided`);
  }
  
  return value || fallback || '';
}

/**
 * Get typed environment configuration
 */
export function getEnvConfig() {
  return {
    firebase: {
      apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
      authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
    },
    api: {
      functionsUrl: getEnv(
        'NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL',
        'https://us-central1-your-project.cloudfunctions.net/api'
      ),
    },
    analytics: {
      measurementId: getEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', ''),
    },
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
}

// Run validation when this module is imported
if (typeof window === 'undefined') {
  // Only run in Node.js environment (build time)
  validateEnvironment();
}
