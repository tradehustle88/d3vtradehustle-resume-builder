#!/bin/bash
echo "⚡ Trade Hustle Vibe Check ⚡"

# Auth
gcloud auth print-access-token >/dev/null 2>&1 \
  && echo "✅ Auth token valid" \
  || echo "🔒 Token expired — run: gcloud auth login"

# Git
git status -s | grep . >/dev/null 2>&1 \
  && echo "🟡 Git changes detected" \
  || echo "✅ Git repo clean"

# Firebase
firebase projects:list >/dev/null 2>&1 \
  && echo "🔥 Firebase connected" \
  || echo "❌ Firebase not authenticated"

echo "💾 Disk space:" && df -h | grep "/$"
echo "⚙️ Node:" $(node -v)
echo ""
echo "🚀 Hustle level: optimal"
echo ""

# Quick access shortcuts
echo "⚡ Quick Access Commands:"
echo "  npm run open:gcp-creds       # GCP Credentials"
echo "  npm run open:firebase        # Firebase Console"
echo "  npm run open:firebase:auth   # Firebase Auth"
echo "  npm run open:github          # GitHub Repo"
