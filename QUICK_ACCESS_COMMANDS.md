Key: AIzaSyD-nOO...XoBbPk    ← DELETE THIS ONE (old exposed key)
Key: AIzaSyCFCN9...v6-_fM    ← KEEP THIS ONE (your current key)# ⚡ Quick Access Commands

**Fast access to all your project resources and tools**

---

## 🚀 NPM Scripts

### Development
```powershell
npm run dev                      # Start Next.js dev server
npm run build                    # Build for production
npm run start                    # Start production server
npm run lint                     # Run ESLint
```

### Security
```powershell
npm run check-secrets            # Scan for secrets (runs on commit)
npm run security-audit           # Run npm security audit
```

### Health Checks
```powershell
npm run vibe-check               # Bash vibe check (cross-platform)
npm run vibe-check:ps            # PowerShell vibe check (detailed)
```

### Quick Access (New! 🎉)
```powershell
# Google Cloud Platform
npm run open:gcp-creds           # GCP Credentials Manager
                                 # ⚠️ Use this to revoke old API keys!

# Firebase Console
npm run open:firebase            # Firebase General Settings
npm run open:firebase:auth       # Authentication & Users
npm run open:firebase:firestore  # Firestore Database
npm run open:firebase:functions  # Cloud Functions
npm run open:firebase:hosting    # Firebase Hosting

# GitHub
npm run open:github              # GitHub Repository
```

---

## 🔧 PowerShell Scripts

### Security Tools
```powershell
.\scripts\check-secrets.js           # Secret scanner (Node.js)
.\scripts\update-env.ps1             # Update environment variables
.\scripts\sanitize-keys.ps1          # Remove exposed keys from files
.\scripts\clean-git-history.ps1      # Clean git history
```

### Quick Access
```powershell
.\scripts\open-gcp-creds.ps1         # Open GCP Credentials
.\scripts\open-firebase.ps1          # Open Firebase Console
.\scripts\open-firebase.ps1 -Page auth       # Specific Firebase page
.\scripts\open-firebase.ps1 -Help            # Show help
```

### Health Checks
```powershell
.\scripts\vibe-check.ps1             # System health check
.\scripts\vibe-check.sh              # Bash version
```

---

## 🔐 GCP Credentials Manager

**Quick access to manage API keys**

### Usage
```powershell
npm run open:gcp-creds
```

**What you can do:**
- ✅ View all API keys
- ✅ Revoke compromised keys
- ✅ Add domain restrictions
- ✅ Create new credentials
- ✅ Monitor API usage

**⚠️ IMPORTANT:** Use this to revoke the old exposed API key!

---

## 🔥 Firebase Console Quick Access

**Jump directly to any Firebase page**

### General Settings
```powershell
npm run open:firebase
```
**Access:** Project settings, API keys, app configuration

### Authentication
```powershell
npm run open:firebase:auth
```
**Access:** User management, auth providers, settings

### Firestore Database
```powershell
npm run open:firebase:firestore
```
**Access:** Collections, documents, indexes, rules

### Cloud Functions
```powershell
npm run open:firebase:functions
```
**Access:** Function logs, metrics, configuration

### Firebase Hosting
```powershell
npm run open:firebase:hosting
```
**Access:** Deployment history, custom domains, rollbacks

### Advanced Usage
```powershell
# Use the PowerShell script directly
.\scripts\open-firebase.ps1 -Page storage    # Cloud Storage
.\scripts\open-firebase.ps1 -Page analytics  # Google Analytics
.\scripts\open-firebase.ps1 -Help            # Show all options
```

---

## 🌐 GitHub Repository

**Quick access to your GitHub repo**

```powershell
npm run open:github
```

**Access:**
- Repository code
- Pull requests
- Issues
- Actions (CI/CD)
- Settings
- Security analysis

---

## 📊 Vibe Check with Quick Access

**Run the vibe check to see all quick access commands:**

```powershell
npm run vibe-check:ps
```

**Output includes:**
- ✅ System health status
- ✅ Git status
- ✅ Firebase connection
- ✅ Disk space
- ✅ Node version
- ⚡ **Quick access command list**

---

## 🎯 Common Workflows

### Morning Startup
```powershell
# 1. Check system health
npm run vibe-check:ps

# 2. Start dev server
cd frontend && npm run dev

# 3. Open Firebase Console
npm run open:firebase
```

### Security Task: Revoke Old API Key
```powershell
# 1. Open GCP Credentials
npm run open:gcp-creds

# 2. Find and delete the old key
# Look for: AIzaSyD-***REDACTED***

# 3. Verify current environment
cat frontend\.env.local

# 4. Test application
cd frontend && npm run dev
```

### Deploy New Version
```powershell
# 1. Build frontend
cd frontend && npm run build && npm run export

# 2. Deploy functions
firebase deploy --only functions:api

# 3. Deploy hosting
firebase deploy --only hosting

# 4. Open Firebase Hosting
npm run open:firebase:hosting
```

### Debug Auth Issues
```powershell
# 1. Check Firebase Auth users
npm run open:firebase:auth

# 2. Check GCP credentials
npm run open:gcp-creds

# 3. View logs
firebase functions:log
```

---

## 🆘 Troubleshooting

### "Command not found"
Make sure you're in the project root directory:
```powershell
cd C:\Users\trade\d3vtradehustle-resume-builder
```

### "Cannot open browser"
Scripts will show the URL - copy and paste into your browser manually

### "Permission denied"
Run PowerShell as Administrator:
```powershell
Start-Process powershell -Verb RunAs
```

---

## 📝 Adding Your Own Commands

### 1. Create a PowerShell Script
```powershell
# Create new script
New-Item -Path "scripts/your-script.ps1" -ItemType File

# Add your code
# ...

# Make it executable
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 2. Add to package.json
```json
{
  "scripts": {
    "your-command": "pwsh -File scripts/your-script.ps1"
  }
}
```

### 3. Update Vibe Check (Optional)
Add your command to the quick access list in `scripts/vibe-check.ps1`

---

## 🎓 Pro Tips

1. **Alias your favorites:**
   ```powershell
   # Add to PowerShell profile
   function gcp { npm run open:gcp-creds }
   function fb { npm run open:firebase }
   ```

2. **Chain commands:**
   ```powershell
   npm run vibe-check:ps; npm run open:firebase
   ```

3. **Use tab completion:**
   ```powershell
   npm run open:f<TAB>  # Completes to open:firebase
   ```

4. **Create shortcuts:**
   - Right-click desktop → New → Shortcut
   - Target: `powershell -Command "cd C:\Users\trade\d3vtradehustle-resume-builder; npm run open:firebase"`

---

## 📚 Related Documentation

- **Security:** `SECURITY_QUICKSTART.md`
- **Repository Status:** `REPOSITORY_STATUS.md`
- **Full Command List:** This file!

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Status:** ✅ All scripts tested and working

---

*Want to add more quick access commands? Edit `package.json` and create new scripts in the `scripts/` folder!*
