# Firebase Functions - API Functions

This directory contains Firebase Cloud Functions for the TradeHustle Resume Builder application.

## Setup

### 1. Install Dependencies

```bash
cd api-functions
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in this directory:

```bash
# Environment variables for Firebase Functions
RECAPTCHA_SECRET=your_actual_secret_key_here
FIREBASE_PROJECT_ID=tradehustleresumebuilder
```

**⚠️ Important**: Never commit the `.env` file to version control. It's already added to `.gitignore`.

### 3. Available Functions

- **verifyRecaptcha**: Verifies reCAPTCHA tokens from the frontend
- **signup**: Handles user registration with reCAPTCHA verification
- **unlockResume**: Unlocks resume content after reCAPTCHA verification

### 4. Local Development

Start the Firebase emulator:

```bash
npm run serve
```

This will start the functions emulator locally for testing.

### 5. Deployment

Deploy to Firebase:

```bash
npm run deploy
```

Or deploy from the root directory:

```bash
firebase deploy --only functions
```

### 6. CI/CD with GitHub Actions

The deployment workflow automatically:

1. Creates the `.env` file from GitHub Secrets
2. Installs dependencies
3. Deploys functions to Firebase

**Required GitHub Secrets**:
- `RECAPTCHA_SECRET`: Your reCAPTCHA secret key
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RECAPTCHA_SECRET` | reCAPTCHA secret key from Google reCAPTCHA console | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project identifier | Yes |

## Function Endpoints

When deployed, your functions will be available at:

- `https://us-central1-[PROJECT_ID].cloudfunctions.net/verifyRecaptcha`
- `https://us-central1-[PROJECT_ID].cloudfunctions.net/signup`
- `https://us-central1-[PROJECT_ID].cloudfunctions.net/unlockResume`

## Migration from Next.js API Routes

If you're migrating from Next.js API routes, update your frontend calls to use the new Firebase Function endpoints instead of `/api/` routes.

## Security Notes

- Environment variables are loaded using dotenv
- The `.env` file is gitignored to prevent committing secrets
- CORS is properly configured for frontend requests
- Input validation is implemented for all functions
