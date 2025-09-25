## 🔐 Vercel Environment Variables Checklist

### Required Environment Variables

#### Firebase Configuration (Client-side)
- `NEXT_PUBLIC_FIREBASE_API_KEY` = your_firebase_api_key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = your_project.firebaseapp.com  
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = your_project_id
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = your_project.appspot.com
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = your_sender_id
- `NEXT_PUBLIC_FIREBASE_APP_ID` = your_app_id
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = G-XXXXXXXXXX

#### Firebase Admin SDK (Server-side)
- `FIREBASE_SERVICE_ACCOUNT_KEY` = base64_encoded_service_account_json

#### reCAPTCHA v3
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = your_recaptcha_site_key
- `RECAPTCHA_SECRET_KEY` = your_recaptcha_secret_key

### ⚠️ Important Notes

1. **FIREBASE_SERVICE_ACCOUNT_KEY must be base64-encoded**
   ```bash
   # Encode your service account JSON:
   cat serviceAccount.json | base64 -w 0
   ```

2. **All NEXT_PUBLIC_ variables are exposed to the client**
   - Only put public configuration in NEXT_PUBLIC_ variables
   - Keep secrets (like RECAPTCHA_SECRET_KEY) without NEXT_PUBLIC_ prefix

3. **After adding environment variables**
   - Redeploy your Vercel application
   - Check deployment logs for any initialization errors

### 🧪 Test Your Deployment

After deployment, test the full flow:
1. Visit your deployed site
2. Go to `/unlock` page
3. Sign in with Google or Email/Password
4. Click "Unlock Resume Kit Now"
5. Verify PDF download works
6. Check Vercel Functions logs for any errors

### 🔍 Debugging Tips

If deployment fails:
- Check Vercel build logs for Firebase initialization errors
- Verify all environment variables are set correctly
- Ensure FIREBASE_SERVICE_ACCOUNT_KEY is properly base64-encoded
- Test reCAPTCHA keys are valid for your domain