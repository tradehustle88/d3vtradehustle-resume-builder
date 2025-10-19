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
echo "🚀 Hustle level: optimal"
