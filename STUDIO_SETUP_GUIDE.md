# 🎨 Trade Hustle Studio - Setup Guide

## Complete Setup in 10 Minutes

This guide will walk you through setting up your Trade Hustle Studio so you can start editing your site live.

---

## 📋 Prerequisites

- ✅ Firebase project (you already have this)
- ✅ Firebase CLI installed (`npm install -g firebase-tools`)
- ✅ Access to Firebase Console

---

## 🚀 Step 1: Enable Firestore Database (3 minutes)

1. **Open Firebase Console:**
   - Go to https://console.firebase.google.com
   - Select your project: `d3vtradehustle-resume-builder`

2. **Navigate to Firestore:**
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

3. **Choose Starting Mode:**
   - Select **"Start in production mode"**
   - Click "Next"

4. **Choose Location:**
   - Select **"us-central (Iowa)"** or your preferred region
   - Click "Enable"

5. **Wait for Setup:**
   - Firestore will take 30-60 seconds to initialize
   - You'll see an empty database when ready

✅ **Firestore is now enabled!**

---

## 🔐 Step 2: Deploy Firestore Security Rules (2 minutes)

Your project already has security rules defined in `firestore.rules`. Let's deploy them.

### Option A: Using Firebase CLI (Recommended)

```bash
# From your project root
firebase deploy --only firestore:rules
```

### Option B: Manual Setup in Console

If the CLI doesn't work, you can set up rules manually:

1. In Firebase Console → Firestore Database
2. Click the "Rules" tab
3. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to homepage layout for everyone
    match /layouts/homepage {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Protect all other collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

✅ **Security rules deployed!**

---

## 👤 Step 3: Create Admin User (2 minutes)

You need a user account to access the Studio.

1. **Go to Authentication:**
   - Firebase Console → Authentication
   - Click "Get started" if you haven't set it up yet

2. **Enable Email/Password:**
   - Click the "Sign-in method" tab
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"

3. **Add Your Admin User:**
   - Click the "Users" tab
   - Click "Add user"
   - Enter your email: `your-email@example.com`
   - Enter a password: (use a strong password)
   - Click "Add user"

4. **Save Your Credentials:**
   - Email: `_________________`
   - Password: `_________________`
   - **Keep these secure!**

✅ **Admin user created!**

---

## 🗄️ Step 4: Initialize Homepage Layout (1 minute)

Now we need to create the initial layout document in Firestore.

### Option A: Automatic (When you first visit the homepage)

1. Visit http://localhost:3000
2. The app will automatically create the default layout in Firestore
3. This happens once on first load

### Option B: Manual Creation

If you want to create it manually:

1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `layouts`
4. Click "Next"
5. Document ID: `homepage`
6. Add fields:
   - Field: `sections`, Type: `array`
   - Add items:
     ```json
     [
       { "id": "hero", "visible": true },
       { "id": "verifier", "visible": true },
       { "id": "proof", "visible": true },
       { "id": "visual", "visible": true },
       { "id": "cta", "visible": true }
     ]
     ```
   - Field: `updatedAt`, Type: `timestamp`, Value: (current timestamp)
7. Click "Save"

✅ **Layout initialized!**

---

## ✅ Step 5: Test Your Studio (2 minutes)

1. **Start Dev Server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Visit Studio:**
   - Open http://localhost:3000/studio
   - You should see the login form

3. **Sign In:**
   - Enter your admin email
   - Enter your password
   - Click "Sign in"

4. **Test Editing:**
   - You should see your homepage sections in a list
   - Try dragging a section (use the ⋮⋮ handle)
   - Try toggling visibility with the switch
   - Check "All changes saved" appears in the header

5. **Verify Homepage:**
   - Open http://localhost:3000 in a new tab
   - The sections should appear in the order you set
   - Hidden sections should not appear

✅ **Studio is working!**

---

## 🔥 Quick Test Script

Run this to verify everything is set up correctly:

```bash
# 1. Check if Firestore is accessible
curl -X GET "https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/layouts/homepage"

# 2. Start your app
cd frontend && npm run dev

# 3. Visit these URLs:
# http://localhost:3000 - Homepage
# http://localhost:3000/studio - Studio (requires login)
```

---

## 🎯 What You Can Do Now

### In the Studio (/studio)
- ✅ Drag sections to reorder them
- ✅ Toggle section visibility on/off
- ✅ Changes save automatically
- ✅ See "All changes saved" indicator
- ✅ Sign out when done

### On Your Homepage (/)
- ✅ Sections appear in your custom order
- ✅ Hidden sections don't show
- ✅ Changes from Studio appear within 60 seconds (ISR cache)

---

## 🚨 Troubleshooting

### "Permission denied" Error
- **Problem:** Firestore rules not deployed
- **Solution:** Run `firebase deploy --only firestore:rules`

### "Loading Studio..." Never Ends
- **Problem:** Firestore not enabled
- **Solution:** Enable Firestore in Firebase Console

### Login Form Doesn't Work
- **Problem:** Authentication not enabled
- **Solution:** Enable Email/Password in Firebase Console → Authentication

### "No such document" Error
- **Problem:** Layout document doesn't exist
- **Solution:** Visit homepage once to auto-create it, or create manually

### Changes Don't Appear on Homepage
- **Problem:** ISR cache (Next.js caches pages for 60 seconds)
- **Solution:** Wait 60 seconds or force refresh with Ctrl+Shift+R

---

## 🎓 How It Works

```
┌─────────────────────────────────────────────┐
│  YOU (in /studio)                           │
│  Drag sections, toggle visibility           │
└────────────┬────────────────────────────────┘
             │ Saves to Firestore
             ↓
┌─────────────────────────────────────────────┐
│  FIRESTORE                                  │
│  layouts/homepage document                  │
│  { sections: [...], updatedAt: ... }       │
└────────────┬────────────────────────────────┘
             │ Read by homepage
             ↓
┌─────────────────────────────────────────────┐
│  HOMEPAGE (/)                               │
│  Renders sections in your custom order     │
└─────────────────────────────────────────────┘
```

**No code changes. No deploys. Just drag and save.** 🎉

---

## 📚 Next Steps

Once your Studio is working:

1. **Add More Sections:**
   - Create new section components in `frontend/src/components/sections/`
   - Register them in `section-registry.ts`
   - They'll automatically appear in Studio

2. **Customize Styling:**
   - Edit section components to match your brand
   - Modify `StudioBuilder.tsx` for custom UI

3. **Deploy to Production:**
   - Run `npm run build` in frontend
   - Deploy to Vercel, Netlify, or Firebase Hosting
   - Studio works in production too!

4. **Multi-Page Support:**
   - Duplicate the layout system for other pages
   - Create `/studio/about`, `/studio/pricing`, etc.

---

## 🎉 You're Ready!

Your Trade Hustle Studio is now fully functional. Go edit your site!

**Quick Access:**
- 🏠 Homepage: http://localhost:3000
- 🎨 Studio: http://localhost:3000/studio
- 🎪 Drag Demo: http://localhost:3000/drag-drop-demo

**Remember:**
- Sign in with your admin credentials
- Changes save automatically
- Wait up to 60 seconds for homepage updates
- Sign out when done editing

---

**Built with:**
🔴 Hustle Red • 💛 Hustle Yellow • 🔵 Electric Blue

**Need help?** Check the troubleshooting section or review the code in:
- `frontend/src/components/StudioBuilder.tsx`
- `frontend/src/lib/firestore.ts`
- `frontend/src/app/studio/page.tsx`

**Happy editing! 🚀**
