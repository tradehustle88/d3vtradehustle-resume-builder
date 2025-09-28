# Firebase Functions - Environment Configuration

This directory contains Firebase Functions with secure environment variable management using dotenv.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env  # if you have an example, or create manually
   ```

3. **Configure your environment variables in `.env`:**
   ```
   RECAPTCHA_SECRET=your_actual_recaptcha_secret_key
   ```

## Available Functions

- `verifyRecaptcha` - Standalone reCAPTCHA verification function
- `signup` - User signup with reCAPTCHA verification  
- `unlockResume` - Resume unlock with reCAPTCHA verification
- `editResume` - Resume editing functionality
- `app` - Main Express app with all routes

## Security Notes

- ⚠️ **Never commit your `.env` file** - it's already in `.gitignore`
- 🔒 Environment variables are loaded automatically when functions start
- 🚀 In production, secrets are injected by the deployment pipeline

## Testing

Test that environment variables load correctly:
```bash
node -e "require('dotenv').config(); console.log('RECAPTCHA_SECRET:', process.env.RECAPTCHA_SECRET ? 'loaded' : 'missing');"
```

## Deployment

Environment variables are automatically injected during GitHub Actions deployment from GitHub Secrets.