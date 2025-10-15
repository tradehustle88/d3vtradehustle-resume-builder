# Firebase Functions - Environment Configuration

This directory contains Firebase Functions with secure environment variable management using dotenv.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your environment variables in `.env`:**
   ```properties
   # Firebase Configuration
   PROJECT_ID=tradehustleresumebuilder
   REGION=us-central1

   # API Keys (configure for production)
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   RECAPTCHA_SECRET=your_recaptcha_secret_here

   # Gmail Configuration (optional for email notifications)
   GMAIL_USER=your_gmail_username
   GMAIL_PASS=your_gmail_app_password
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
node -e "require('dotenv').config(); console.log('✅ Environment Status:'); console.log('PROJECT_ID:', process.env.PROJECT_ID || 'missing'); console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? 'configured' : 'missing');"
```

## Deployment

Environment variables are automatically injected during GitHub Actions deployment from GitHub Secrets.
