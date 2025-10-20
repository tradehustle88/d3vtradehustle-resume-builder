# 🧪 Drag-and-Drop Quick Test Guide

**Quick visual test to verify drag-and-drop is working**

---

## 🚀 Quick Start Test (2 minutes)

### 1. Start Dev Server
```bash
cd frontend
npm run dev
```

### 2. Open Browser
Visit: http://localhost:3000

### 3. Navigate to Resume Builder
Click "Get Started" or "Build Resume"

### 4. Test Work Experience

**Navigate to:** Experience section

**What to test:**
1. ✅ See the drag handle (⋮⋮) on the left of each position
2. ✅ Hover over the handle → cursor changes to "grab" (👋)
3. ✅ Click and drag → cursor changes to "grabbing" (✊)
4. ✅ Drag → item becomes semi-transparent (50% opacity)
5. ✅ Drop → item moves to new position smoothly
6. ✅ Order persists when you navigate away and back

**Expected Result:**
```
Before drag:
┌─────────────────────────────────────────┐
│ ⋮⋮  Position 1                          │
│ ⋮⋮  Position 2                          │
│ ⋮⋮  Position 3                          │
└─────────────────────────────────────────┘

After dragging Position 3 to top:
┌─────────────────────────────────────────┐
│ ⋮⋮  Position 3                          │
│ ⋮⋮  Position 1                          │
│ ⋮⋮  Position 2                          │
└─────────────────────────────────────────┘
```

### 5. Test Certifications

**Navigate to:** Certifications section

**What to test:**
- ✅ Drag certifications list
- ✅ Drag education list separately
- ✅ Both lists work independently
- ✅ Order persists for both

---

## 📱 Mobile Test (5 minutes)

### Open on Mobile Device or Use DevTools

**Chrome DevTools:**
1. Press F12
2. Click mobile icon (top-left)
3. Select device (iPhone, Pixel, etc.)

**What to test:**
1. ✅ Touch and hold drag handle
2. ✅ Drag with finger
3. ✅ Item moves smoothly
4. ✅ Drop updates order
5. ✅ No layout issues

---

## ⌨️ Keyboard Test (3 minutes)

### Test Accessibility

**What to test:**
1. ✅ Press Tab → focus moves to drag handle
2. ✅ Press Space → activates drag mode
3. ✅ Press ↑/↓ arrows → move item
4. ✅ Press Enter → confirm position
5. ✅ Press Escape → cancel drag

---

## ✅ Success Checklist

- [ ] Drag handle (⋮⋮) is visible
- [ ] Cursor changes on hover (grab)
- [ ] Cursor changes while dragging (grabbing)
- [ ] Item becomes transparent while dragging
- [ ] Smooth animation when dropping
- [ ] Order persists after navigation
- [ ] Works on mobile/touch devices
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] No data loss

---

## 🐛 Common Issues & Solutions

### Drag handle not showing
**Fix:** Check CSS is imported
```tsx
import "@/components/dnd/dnd.css";
```

### Items not reordering
**Fix:** Check items have unique IDs
```tsx
const items = data.map((item, idx) => ({
  ...item,
  id: item.id || `item-${idx}-${Date.now()}`
}));
```

### Drag not working
**Fix:** Check @dnd-kit packages installed
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Console errors
**Fix:** Check browser console for specific error
- Missing props?
- ID conflicts?
- Import errors?

---

## 📊 Visual Verification

### Expected UI Elements

**Drag Handle:**
```
⋮⋮  ← Should see 6 vertical dots
```

**Hover State:**
```
⋮⋮  Position 1  ← Cursor becomes grab hand
```

**Dragging State:**
```
⋮⋮  Position 1  ← 50% transparent, cursor is grabbing
```

**After Drop:**
```
⋮⋮  Position 1  ← Back to 100% opacity, new order
```

---

## 🎯 Performance Check

### Expected Performance

- ✅ Smooth 60fps animations
- ✅ No lag when dragging
- ✅ Instant response to mouse/touch
- ✅ No flickering
- ✅ No layout jumps

### If Performance is Poor

**Check:**
1. Browser DevTools Performance tab
2. Reduce number of items (test with 3-5 items)
3. Check for console warnings
4. Verify React DevTools shows minimal re-renders

---

## 📸 Screenshot Checklist

Take screenshots of:
- [ ] Drag handle in rest state
- [ ] Drag handle on hover
- [ ] Item while being dragged
- [ ] Items after reorder
- [ ] Mobile view
- [ ] Keyboard focus state

---

## ✅ Final Verification

**All these should be TRUE:**

1. ✅ Drag handle visible on all list items
2. ✅ Visual feedback (cursor, opacity) works
3. ✅ Items reorder smoothly
4. ✅ Order persists across navigation
5. ✅ No console errors or warnings
6. ✅ Works on desktop (mouse)
7. ✅ Works on mobile (touch)
8. ✅ Works with keyboard
9. ✅ Accessible to screen readers
10. ✅ No data loss during drag operations

---

## 🎊 Test Complete!

If all checks pass: **Drag-and-drop is working perfectly!** ✅

If issues found: See `DRAG_AND_DROP_GUIDE.md` for troubleshooting.

---

**Test Duration:** 2-10 minutes  
**Status:** Ready for testing  
**Last Updated:** October 20, 2025
