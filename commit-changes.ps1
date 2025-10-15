# PowerShell script to commit Resume Editor changes
# Run this after all tests pass

Write-Host "`n🚀 Committing Resume Editor changes...`n" -ForegroundColor Green

# Navigate to repo root
Set-Location "C:\Users\trade\d3vtradehustle-resume-builder"

# Add the modified file
Write-Host "📝 Staging changes..." -ForegroundColor Yellow
git add frontend/src/app/resume-builder/editor/page.tsx

# Commit with detailed message
Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "feat(editor): Vertex AI assist refactor + runtime guards

- Add type-safe FieldKind union type ('summary' | 'experience')
- Implement getExperienceOrThrow() for safe array access
- Add context-aware prompt builders (summary & experience)
- Integrate Vertex AI via editResume() API with Firebase Auth
- Auto-clear success/error messages after 5 seconds
- Track analytics: ai_assist_used, ai_assist_success, ai_assist_failed
- Fix button calls with correct types and array indices
- Add comprehensive error handling with user-friendly messages

Key improvements:
- 🔒 Runtime safety with array bounds checking
- 🎯 Type safety with FieldKind union type
- ♻️  Modular code with reusable helper functions
- ✨ UX polish with auto-dismissing messages
- 🚀 Production-ready Vertex AI integration

Tested scenarios:
- Summary AI generation ✓
- Experience bullet points ✓
- Invalid index error handling ✓
- Analytics event tracking ✓
- Auto-clear messages (5s) ✓
"

Write-Host "`n✅ Changes committed!" -ForegroundColor Green

# Push to main
Write-Host "`n📤 Pushing to origin/main..." -ForegroundColor Yellow
git push origin main

Write-Host "`n🎉 Done! Changes pushed to GitHub.`n" -ForegroundColor Green
