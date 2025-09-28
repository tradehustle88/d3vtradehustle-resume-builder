# 🚀 Trade Hustle Resume Builder  

A Firebase + FCM powered web app built for tradespeople.  
Create, edit, and download **ATS-optimized resumes** with real-time push notifications, secure token handling, and modular resume templates.  

---

## ✨ Features  
- **Firebase Hosting + Cloud Functions** for serverless backend.  
- **Push Notifications** with FCM + VAPID key setup.  
- **ATS-optimized resume templates** for trades (HVAC, Electrical, Maintenance, etc.).  
- **Secure Service Account handling** (`.gitignore` protects private keys).  

---

## 🛠 Tech Stack  
- **Firebase Hosting** (frontend hosting)  
- **Firestore** (data persistence)  
- **Firebase Cloud Messaging (FCM)**  
- **Cloud Functions** (Express.js API)  
- **Frontend**: HTML / JavaScript (with plans for Next.js upgrade)  

---

## 🚧 Setup  

### 1. Clone this repo  
```bash
git clone https://github.com/tradehustle88/d3vtradehustle-resume-builder.git
cd d3vtradehustle-resume-builder
```

### 2. Set up environment variables
Copy the example environment file and configure your Firebase credentials:

```bash
# For root-level scripts (src/adminTest.js)
cp .env.example .env.local

# For frontend (Next.js)
cp frontend/.env.example frontend/.env.local
```

#### Firebase Admin SDK Setup
You have two options for configuring Firebase Admin SDK:

**Option 1: JSON String (Recommended for development)**
Set `FIREBASE_SERVICE_ACCOUNT_KEY` to your full service account JSON:
```bash
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

**Option 2: Individual Variables (Recommended for production)**
Set individual environment variables:
```bash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
# ... (see .env.example for complete list)
```

#### Getting Your Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file and use its contents for environment variables

⚠️ **Security Note**: Never commit your service account keys to version control. The `.gitignore` file already excludes credential files.

### 3. Install dependencies and run

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

#### Test Firebase Admin SDK
```bash
# From root directory
node src/adminTest.js
```

---

## 🔒 Security Migration Complete

This project has been updated to use environment variables instead of service account JSON files for enhanced security:

- ✅ **No more `serviceAccountKey.json`** - All credentials are now environment variables
- ✅ **Flexible configuration** - Supports both JSON string format and individual variables  
- ✅ **Production ready** - Individual environment variables recommended for deployment
- ✅ **Development friendly** - JSON string format works great for local development

### Migration Notes
- The `src/adminTest.js` script now loads credentials from environment variables
- All Firebase Admin SDK integrations use `process.env.FIREBASE_SERVICE_ACCOUNT_KEY`
- Environment files (`.env.local`, `.env`) are properly ignored by git
- Complete setup instructions are provided above

---

## 🤖 AI Development Assistant

This repository includes comprehensive GitHub Copilot instructions to assist with development:

- **Copilot Instructions**: See `.github/copilot-instructions.md` for detailed AI coding guidelines
- **Architecture Patterns**: Pre-configured Firebase, Next.js, and deployment patterns
- **Environment Setup**: Complete environment variable documentation and examples
- **Common Issues**: Solutions for Firebase deployment and development setup issues

The instructions help AI assistants understand the project structure, coding patterns, and deployment requirements.

---
