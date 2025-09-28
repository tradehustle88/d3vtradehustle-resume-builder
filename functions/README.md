# Firebase Functions - Secondary Functions Directory

This directory contains additional Firebase Functions with dotenv support.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables in `.env`:**
   ```
   RECAPTCHA_SECRET=your_actual_recaptcha_secret_key
   ```

## Available Functions

- `verifyRecaptcha` - Standalone reCAPTCHA verification function
- `signup` - Basic signup functionality
- `unlockResume` - Resume unlock functionality
- `editResume` - Resume editing functionality
- `app` - Main Express app

## Security Notes

- ⚠️ **Never commit your `.env` file** - it's already in `.gitignore`
- 🔒 Environment variables are loaded automatically via `require('dotenv').config()`
- 🚀 In production, secrets are injected by the deployment pipeline

## Testing

```bash
node -e "require('dotenv').config(); console.log('RECAPTCHA_SECRET:', process.env.RECAPTCHA_SECRET ? 'loaded' : 'missing');"
```