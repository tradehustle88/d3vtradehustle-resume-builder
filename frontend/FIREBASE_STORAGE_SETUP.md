# Firebase Storage Setup for Resume Download

## Required Setup

To make the unlock-resume API work properly, you need to upload the resume file to Firebase Storage:

### 1. Upload resume-kit.pdf to Firebase Storage

```bash
# Using Firebase CLI (if installed)
firebase storage:upload public/resume-kit.pdf resume-kit.pdf

# Or manually upload via Firebase Console:
# 1. Go to Firebase Console -> Storage
# 2. Upload public/resume-kit.pdf as "resume-kit.pdf" in root
```

### 2. Set Storage Rules

Make sure your `firestore.rules` file has appropriate rules for the storage bucket. The current API generates signed URLs which bypass storage rules, but it's good practice to have proper rules.

### 3. Environment Variables Required

The following environment variables must be set in `.env.local`:

- `FIREBASE_SERVICE_ACCOUNT_KEY` - Base64 encoded service account JSON
- `FIREBASE_STORAGE_BUCKET` - Your Firebase Storage bucket name (e.g., `yourproject.appspot.com`)
- `RECAPTCHA_SECRET_KEY` - Your reCAPTCHA v3 secret key

### 4. Service Account Permissions

Ensure your service account has the following permissions:
- Storage Admin (to create signed URLs)
- Firebase Authentication Admin (to verify ID tokens)
- Cloud Datastore User (to read/write Firestore)

## API Usage

The API endpoint `/api/unlock-resume` expects:

```json
{
  "email": "user@example.com",
  "resume": "optional resume text",
  "recaptchaToken": "recaptcha_response_token",
  "idToken": "firebase_auth_id_token"
}
```

Returns:

```json
{
  "success": true,
  "message": "Resume unlocked successfully",
  "downloadUrl": "https://storage.googleapis.com/signed-url..."
}
```

The `downloadUrl` is valid for 1 hour and triggers an automatic download when accessed.