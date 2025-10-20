# Drag-and-Drop Implementation Guide

**Project:** Trade Hustle Resume Builder
**Library:** @dnd-kit (v6+)
**Framework:** Next.js 14 (App Router) + Tailwind CSS

---

## Overview

This project uses **@dnd-kit** for drag-and-drop functionality in the resume builder. It's a modern, lightweight, and accessible library that works perfectly with React Server Components and Next.js App Router.

---

## Installation

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Packages installed:**
- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list presets
- `@dnd-kit/utilities` - Helper utilities (CSS transforms, etc.)

---

## Architecture

### Reusable Components

We've created two reusable components for drag-and-drop:

#### 1. `SortableList` Component
**Location:** `frontend/src/components/dnd/SortableList.tsx`

A generic wrapper that handles all drag-and-drop logic for any array of items.

**Props:**
```typescript
interface SortableListProps<T> {
  items: T[];                                    // Array of items to sort
  onReorder: (items: T[]) => void;               // Callback when order changes
  children: (item: T, index: number) => ReactNode; // Render function
  getId: (item: T) => string;                    // Function to get unique ID
  className?: string;                             // Optional CSS class
}
```

**Features:**
- ✅ Generic TypeScript support
- ✅ Keyboard accessibility (Tab, Space, Arrow keys)
- ✅ Touch support for mobile
- ✅ Minimum drag distance (8px) to prevent accidental drags
- ✅ Vertical list sorting strategy

#### 2. `SortableItem` Component
**Location:** `frontend/src/components/dnd/SortableItem.tsx`

Wraps individual items with drag handle and visual feedback.

**Props:**
```typescript
interface SortableItemProps {
  id: string;            // Unique identifier
  children: ReactNode;   // Item content
  className?: string;    // Optional CSS class
}
```

**Features:**
- ✅ Visual drag handle with 6-dot icon
- ✅ Opacity transition when dragging
- ✅ Cursor changes (grab → grabbing)
- ✅ Accessible focus states
- ✅ Hover effects

---

## Usage Examples

### Example 1: Work Experience Form

**File:** `frontend/src/components/builder/forms/ExperienceForm.tsx`

```typescript
import SortableList from "../../dnd/SortableList";
import SortableItem from "../../dnd/SortableItem";
import "../../dnd/dnd.css";

export default function ExperienceForm({ data, onUpdate, trade }) {
  // Add unique IDs to each item
  const experience = (data.experience || []).map((exp, idx) => ({
    ...exp,
    id: exp.id || `exp-${idx}-${Date.now()}`,
  }));

  const handleReorder = (reordered) => {
    onUpdate({ experience: reordered });
  };

  return (
    <SortableList
      items={experience}
      onReorder={handleReorder}
      getId={(item) => item.id}
    >
      {(exp, index) => (
        <SortableItem key={exp.id} id={exp.id}>
          <div className="list-item">
            {/* Your form fields here */}
            <input value={exp.title} />
            <input value={exp.company} />
          </div>
        </SortableItem>
      )}
    </SortableList>
  );
}
```

### Example 2: Certifications Form

**File:** `frontend/src/components/builder/forms/CertificationsForm.tsx`

The same pattern is used for certifications and education sections, allowing users to drag and reorder both lists independently.

---

## Key Concepts

### 1. Unique IDs Are Required

Every item MUST have a unique `id` property:

```typescript
// ✅ Good - Items have IDs
const items = [
  { id: 'item-1', name: 'First' },
  { id: 'item-2', name: 'Second' },
];

// ❌ Bad - No IDs
const items = [
  { name: 'First' },
  { name: 'Second' },
];
```

### 2. Auto-Generate IDs

If your data doesn't have IDs, generate them:

```typescript
const itemsWithIds = (data.items || []).map((item, idx) => ({
  ...item,
  id: item.id || `item-${idx}-${Date.now()}`,
}));
```

### 3. Reorder Handler

The `onReorder` callback receives the reordered array:

```typescript
const handleReorder = (reordered) => {
  // Update parent state with new order
  onUpdate({ items: reordered });
};
```

---

## Styling

### Default Styles

**File:** `frontend/src/components/dnd/dnd.css`

Includes:
- Drag handle styling
- Hover/active states
- Dragging opacity
- Mobile optimizations
- Dark mode support
- Accessibility (focus outlines)

### Customization

Override styles with your own classes:

```tsx
<SortableList className="my-custom-list">
  <SortableItem className="my-custom-item">
    {/* ... */}
  </SortableItem>
</SortableList>
```

---

## Features & Behavior

### User Experience

✅ **Visual Feedback:**
- Grab cursor on hover
- Grabbing cursor when dragging
- 50% opacity for dragged item
- Smooth animations

✅ **Accessibility:**
- Keyboard navigation (Tab, Space, Arrow keys)
- Screen reader friendly
- Focus indicators

✅ **Touch Support:**
- Works on mobile devices
- Minimum drag distance prevents accidental drags

✅ **Performance:**
- Lightweight (no heavy dependencies)
- Smooth 60fps animations
- Optimized re-renders

---

## Comparison: @dnd-kit vs react-beautiful-dnd

| Feature | @dnd-kit | react-beautiful-dnd |
|---------|----------|---------------------|
| **Bundle Size** | ~15KB | ~40KB |
| **Next.js 13+ Support** | ✅ Excellent | ⚠️ Limited |
| **TypeScript** | ✅ Native | ✅ Good |
| **Keyboard Support** | ✅ Built-in | ✅ Built-in |
| **Touch Support** | ✅ Built-in | ✅ Built-in |
| **Accessibility** | ✅ WCAG 2.1 | ✅ WCAG 2.0 |
| **Active Development** | ✅ Active | ⚠️ Maintenance |
| **RSC Compatible** | ✅ Yes | ❌ No |

**Why we chose @dnd-kit:**
- ✅ Modern, actively maintained
- ✅ Works with Next.js App Router
- ✅ Smaller bundle size
- ✅ Better TypeScript support
- ✅ Modular architecture

---

## Adding Drag-and-Drop to New Components

### Step 1: Import Dependencies

```typescript
import SortableList from "@/components/dnd/SortableList";
import SortableItem from "@/components/dnd/SortableItem";
import "@/components/dnd/dnd.css";
```

### Step 2: Add IDs to Your Data

```typescript
const items = data.items.map((item, idx) => ({
  ...item,
  id: item.id || `item-${idx}-${Date.now()}`,
}));
```

### Step 3: Create Reorder Handler

```typescript
const handleReorder = (reordered) => {
  onUpdate({ items: reordered });
};
```

### Step 4: Wrap with SortableList

```tsx
<SortableList
  items={items}
  onReorder={handleReorder}
  getId={(item) => item.id}
>
  {(item, index) => (
    <SortableItem key={item.id} id={item.id}>
      {/* Your content here */}
    </SortableItem>
  )}
</SortableList>
```

---

## Current Implementation

### Forms with Drag-and-Drop

✅ **ExperienceForm** - Work experience positions
✅ **CertificationsForm** - Certifications & licenses
✅ **CertificationsForm** - Education entries

### Forms Without (Can Be Added)

- SkillsForm (text-based, not ideal for drag-and-drop)
- ContactInfoForm (single item, no sorting needed)
- ReviewForm (read-only, no editing)

---

## Troubleshooting

### Issue: Items not dragging

**Solution:** Ensure each item has a unique `id` property:

```typescript
getId={(item) => item.id}  // Make sure this returns a string
```

### Issue: Order not persisting

**Solution:** Make sure `onReorder` updates the parent state:

```typescript
const handleReorder = (reordered) => {
  onUpdate({ items: reordered }); // Must update parent
};
```

### Issue: Drag handle not appearing

**Solution:** Import the CSS file:

```typescript
import "../../dnd/dnd.css";
```

---

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance Tips

1. **Memoize handlers:**
   ```typescript
   const handleReorder = useCallback((reordered) => {
     onUpdate({ items: reordered });
   }, [onUpdate]);
   ```

2. **Use stable IDs:**
   Generate IDs once, not on every render:
   ```typescript
   // ✅ Good - ID persists
   { id: `item-${Date.now()}`, ... }

   // ❌ Bad - New ID every render
   { id: Math.random(), ... }
   ```

3. **Avoid re-renders:**
   Only update state when order actually changes

---

## Future Enhancements

Potential improvements:
- [ ] Multi-column drag-and-drop
- [ ] Drag between different lists
- [ ] Animated drop zones
- [ ] Custom drag preview
- [ ] Undo/redo for reordering

---

## Resources

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [@dnd-kit GitHub](https://github.com/clauderic/dnd-kit)
- [Examples & Demos](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/)

---

## Support

For issues or questions:
1. Check the [@dnd-kit docs](https://docs.dndkit.com/)
2. Review this guide
3. Check existing components (ExperienceForm, CertificationsForm)

---

**Last Updated:** October 20, 2025
**Version:** 1.0
**Maintained by:** Trade Hustle Resume Builder Team
