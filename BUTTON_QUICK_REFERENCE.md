# 🔘 Button Quick Reference Card

**Quick copy-paste reference for Trade Hustle button classes**

---

## 🎯 Most Common Buttons

### Primary CTA (Hustle Red)
```jsx
<button className="btn-hustle">Unlock The Hustle</button>
```

### Premium/Gold
```jsx
<button className="btn-gold">Upgrade Now</button>
```

### AI/Tech (Electric Blue)
```jsx
<button className="btn-electric">AI Generate</button>
```

---

## ⚡ Quick Patterns

### Hero CTA Section
```jsx
<div className="flex gap-4 justify-center">
  <button className="btn-hustle btn-lg">Get Started Free</button>
  <button className="btn-glass">Watch Demo</button>
</div>
```

### Form Actions
```jsx
<div className="flex gap-4">
  <button className="btn-electric">Save</button>
  <button className="btn-secondary">Cancel</button>
</div>
```

### Delete/Danger Action
```jsx
<button className="btn-danger">Delete Resume</button>
```

### Modal Buttons
```jsx
<div className="flex gap-3 justify-end">
  <button className="btn-ghost">Cancel</button>
  <button className="btn-hustle">Confirm</button>
</div>
```

---

## 📏 Sizes

```jsx
<button className="btn-hustle btn-sm">Small</button>
<button className="btn-hustle">Default</button>
<button className="btn-hustle btn-lg">Large</button>
<button className="btn-hustle btn-xl">Extra Large</button>
```

---

## ✨ Special Effects

```jsx
{/* Animated gradient */}
<button className="btn-gradient-animated">Get Started</button>

{/* Pulsing attention grabber */}
<button className="btn-hustle btn-pulse">Limited Offer</button>

{/* Glowing premium */}
<button className="btn-glow">Premium Feature</button>
```

---

## 🎭 States

### Disabled
```jsx
<button className="btn-hustle" disabled>Disabled</button>
```

### Loading
```jsx
<button className="btn-electric btn-loading">
  <span className="btn-spinner"></span>
  Processing...
</button>
```

---

## 🔗 Full Class List

| Class | Purpose | Color |
|-------|---------|-------|
| `btn-hustle` | Primary CTA | Deep Red |
| `btn-gold` | Premium/Paid | Gold |
| `btn-electric` | AI/Tech | Electric Blue |
| `btn-secondary` | Secondary | Gray |
| `btn-danger` | Delete/Warning | Dark Red |
| `btn-ghost` | Minimal/Cancel | Transparent |
| `btn-glass` | Modern/Overlay | Glass |
| `btn-icon` | Icon-only | Transparent |
| `btn-gradient-animated` | Animated | Red Gradient |
| `btn-glow` | Premium/Special | Blue Glow |

---

## 📱 Responsive

```jsx
{/* Full width on mobile, auto on desktop */}
<button className="btn-hustle w-full md:w-auto">Sign Up</button>

{/* Stack buttons vertically on mobile */}
<div className="flex flex-col sm:flex-row gap-4">
  <button className="btn-hustle">Primary</button>
  <button className="btn-secondary">Secondary</button>
</div>
```

---

## ♿ Accessibility

```jsx
{/* Icon button with label */}
<button className="btn-icon" aria-label="Close dialog">
  <svg>...</svg>
</button>

{/* Loading button announcement */}
<button className="btn-hustle btn-loading" aria-busy="true">
  <span className="btn-spinner" aria-hidden="true"></span>
  Processing...
</button>
```

---

## 💡 Decision Tree

**Choose your button:**

1. **Main conversion action?** → `btn-hustle`
2. **Premium/paid feature?** → `btn-gold`
3. **AI/tech feature?** → `btn-electric`
4. **Secondary option?** → `btn-secondary`
5. **Delete/danger?** → `btn-danger`
6. **Cancel/dismiss?** → `btn-ghost`
7. **Modern overlay?** → `btn-glass`
8. **Icon only?** → `btn-icon`

---

**Updated**: October 2025 | **Version**: 2.0
