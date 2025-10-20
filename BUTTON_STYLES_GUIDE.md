# 🔘 Button Styles Guide

Complete button system for Trade Hustle Resume Builder matching your gritty, hustle-themed design.

---

## 🎨 Primary Action Buttons

### Hustle Button (Main CTA)
The signature Trade Hustle button with deep red background and hover glow effect.

```jsx
<button className="btn-hustle">
  Unlock The Hustle
</button>
```

**CSS Class**: `.btn-hustle`
- **Background**: Deep red (#8b0000)
- **Hover**: Bright red (#ff0000) with red glow
- **Text**: White, uppercase, bold
- **Size**: Medium padding (0.85rem x 2.5rem)
- **Shape**: Fully rounded (pill shape)
- **Effect**: Lifts up 2px on hover

**Use Cases**:
- Primary CTAs (Unlock Resume, Get Started)
- Download actions
- Hero section main button
- Conversion-focused interactions

---

## 🌟 Premium/Gold Buttons

### Gold CTA Button
Eye-catching gold button for premium or paid actions.

```jsx
<button className="btn-gold">
  Upgrade Now
</button>
```

**Inline Style** (until added to globals.css):
```jsx
<button className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:scale-110 transition-transform shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]">
  Upgrade Now
</button>
```

**Properties**:
- **Background**: Bright gold (#FFD700)
- **Text**: Black, bold
- **Hover**: Scales up to 110% with golden glow
- **Shape**: Rounded corners (8px)

**Use Cases**:
- Premium features
- Subscription upgrades
- Payment buttons
- Special offers

---

## 🎭 Secondary Action Buttons

### Gray Secondary Button
Neutral action button for secondary interactions.

```jsx
<button className="btn-secondary">
  Learn More
</button>
```

**Inline Style**:
```jsx
<button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
  Learn More
</button>
```

**Properties**:
- **Background**: Dark gray (#374151)
- **Text**: White
- **Hover**: Lighter gray (#4B5563)
- **Shape**: Rounded corners (8px)

**Use Cases**:
- Secondary actions
- Cancel buttons
- Alternative options
- Navigation links

---

### Electric Blue Button
Modern electric blue for tech/AI-focused actions.

```jsx
<button className="btn-electric">
  AI Generate
</button>
```

**Inline Style** (add to globals.css):
```jsx
<button className="px-6 py-3 bg-[#1673FF] text-white font-semibold rounded-lg hover:bg-[#4D9EFF] transition-all hover:shadow-[0_0_20px_rgba(22,115,255,0.6)] transform hover:-translate-y-1">
  AI Generate
</button>
```

**Properties**:
- **Background**: Electric blue (#1673FF)
- **Text**: White, semi-bold
- **Hover**: Lighter blue (#4D9EFF) with blue glow
- **Effect**: Lifts up 1px on hover

**Use Cases**:
- AI-powered features
- Smart editing tools
- Automated actions
- Technology features

---

## 🚨 Danger/Warning Buttons

### Red Danger Button
Deep red button for destructive actions.

```jsx
<button className="btn-danger">
  Delete Resume
</button>
```

**Inline Style**:
```jsx
<button className="px-4 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-red-800 transition-colors font-semibold">
  Delete Resume
</button>
```

**Properties**:
- **Background**: Dark red (#8B0000)
- **Text**: White, semi-bold
- **Hover**: Brighter red (#991B1B)
- **Shape**: Rounded corners (8px)

**Use Cases**:
- Delete actions
- Remove items
- Destructive operations
- Warning confirmations

---

## 🔗 Ghost/Outline Buttons

### Ghost Button
Transparent button with border, minimal style.

```jsx
<button className="btn-ghost">
  Cancel
</button>
```

**CSS to Add** (globals.css):
```css
.btn-ghost {
  display: inline-block;
  padding: 0.65rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  color: white;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
}
```

**Use Cases**:
- Cancel actions
- Dismissal buttons
- Less important actions
- Modal close buttons

---

## ✨ Icon Buttons

### Icon-Only Button
Small circular button for icons.

```jsx
<button className="btn-icon">
  <svg>...</svg>
</button>
```

**CSS to Add**:
```css
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}
.btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 215, 0, 0.5);
  transform: scale(1.1);
}
```

**Use Cases**:
- Close buttons
- Menu toggles
- Quick actions
- Tool buttons

---

## 🎨 Glass/Glassmorphic Buttons

### Glass Button
Modern glassmorphism effect button.

```jsx
<button className="btn-glass">
  Continue
</button>
```

**CSS to Add**:
```css
.btn-glass {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
.btn-glass:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}
```

**Use Cases**:
- Modern UI overlays
- Modal actions
- Card interactions
- Floating panels

---

## 🚀 Size Variations

Add these size modifiers to any button class:

### Small Button
```jsx
<button className="btn-hustle btn-sm">Small</button>
```

**CSS to Add**:
```css
.btn-sm {
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
}
```

### Large Button
```jsx
<button className="btn-hustle btn-lg">Large</button>
```

**CSS to Add**:
```css
.btn-lg {
  padding: 1rem 3rem;
  font-size: 1.125rem;
}
```

### Extra Large Button
```jsx
<button className="btn-hustle btn-xl">Extra Large</button>
```

**CSS to Add**:
```css
.btn-xl {
  padding: 1.25rem 4rem;
  font-size: 1.25rem;
  letter-spacing: 2px;
}
```

---

## 🎯 Button States

### Disabled State
```jsx
<button className="btn-hustle" disabled>
  Disabled
</button>
```

**CSS to Add**:
```css
button:disabled,
button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Loading State
```jsx
<button className="btn-hustle btn-loading">
  <span className="btn-spinner"></span>
  Processing...
</button>
```

**CSS to Add**:
```css
.btn-loading {
  position: relative;
  pointer-events: none;
}

.btn-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 🎨 Button Groups

### Horizontal Button Group
```jsx
<div className="btn-group">
  <button className="btn-secondary">Option 1</button>
  <button className="btn-secondary">Option 2</button>
  <button className="btn-secondary">Option 3</button>
</div>
```

**CSS to Add**:
```css
.btn-group {
  display: inline-flex;
  gap: 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.btn-group button {
  border-radius: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-group button:first-child {
  border-radius: 0.5rem 0 0 0.5rem;
}

.btn-group button:last-child {
  border-radius: 0 0.5rem 0.5rem 0;
  border-right: none;
}
```

---

## 🎭 Special Effect Buttons

### Gradient Animated Button
```jsx
<button className="btn-gradient-animated">
  Get Started
</button>
```

**CSS to Add**:
```css
.btn-gradient-animated {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  border-radius: 9999px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  background: linear-gradient(90deg, #8b0000, #ff0000, #8b0000);
  background-size: 200% 100%;
  transition: all 0.3s ease;
  animation: gradient-shift 3s ease infinite;
}

.btn-gradient-animated:hover {
  filter: drop-shadow(0 0 12px rgba(255, 0, 0, 0.9));
  transform: translateY(-2px);
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Pulsing Button
```jsx
<button className="btn-hustle btn-pulse">
  Limited Offer
</button>
```

**CSS to Add**:
```css
.btn-pulse {
  animation: pulse-scale 2s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Glowing Button
```jsx
<button className="btn-glow">
  Premium Feature
</button>
```

**CSS to Add**:
```css
.btn-glow {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  border-radius: 0.75rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #1673FF, #4D9EFF);
  box-shadow: 0 0 20px rgba(22, 115, 255, 0.5);
  animation: glow-pulse 2s ease-in-out infinite;
  transition: all 0.3s ease;
}

.btn-glow:hover {
  box-shadow: 0 0 30px rgba(22, 115, 255, 0.8);
  transform: translateY(-2px);
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(22, 115, 255, 0.5); }
  50% { box-shadow: 0 0 30px rgba(22, 115, 255, 0.7); }
}
```

---

## 📱 Responsive Button Patterns

### Mobile Full Width
```jsx
<button className="btn-hustle w-full md:w-auto">
  Sign Up
</button>
```

### Hide Text on Mobile
```jsx
<button className="btn-hustle">
  <span className="hidden sm:inline">Download</span>
  <svg className="sm:ml-2">...</svg>
</button>
```

### Stack Buttons on Mobile
```jsx
<div className="flex flex-col sm:flex-row gap-4">
  <button className="btn-hustle">Primary</button>
  <button className="btn-secondary">Secondary</button>
</div>
```

---

## 🎯 Accessibility Best Practices

### Proper ARIA Labels
```jsx
<button 
  className="btn-icon" 
  aria-label="Close dialog"
>
  <svg>...</svg>
</button>
```

### Focus States
All button classes include focus states:
```css
button:focus-visible {
  outline: 2px solid #FFD700;
  outline-offset: 2px;
}
```

### Keyboard Navigation
Ensure all buttons are keyboard accessible:
- Use semantic `<button>` elements
- Avoid `div` or `span` as buttons
- Test with Tab and Enter keys

---

## 🔥 Quick Reference Chart

| Button Class | Use Case | Color | Hover Effect |
|-------------|----------|-------|--------------|
| `.btn-hustle` | Primary CTA | Deep Red | Red glow + lift |
| `.btn-gold` | Premium | Gold | Scale + glow |
| `.btn-secondary` | Secondary | Gray | Darken |
| `.btn-electric` | AI/Tech | Electric Blue | Blue glow + lift |
| `.btn-danger` | Delete/Warn | Dark Red | Brighten |
| `.btn-ghost` | Minimal | Transparent | Fill white |
| `.btn-glass` | Modern | Glass | Border gold |
| `.btn-icon` | Icons | Transparent | Scale + border |

---

## 🚀 Implementation Steps

1. **Add missing CSS** to `frontend/src/app/globals.css`
2. **Import Button component** where needed
3. **Replace inline styles** with standard classes
4. **Test accessibility** with keyboard navigation
5. **Verify mobile responsiveness**

---

## 💡 Pro Tips

✅ **DO:**
- Use `.btn-hustle` for main CTAs
- Add loading states for async actions
- Test contrast ratios (WCAG AA minimum)
- Stack buttons vertically on mobile
- Include proper ARIA labels

❌ **DON'T:**
- Mix too many button styles on one page
- Use red buttons for positive actions
- Forget disabled states
- Use divs instead of buttons
- Ignore keyboard focus states

---

**Last Updated**: October 2025
**Design System Version**: 2.0
**Compatible With**: Next.js 14, Tailwind CSS 3.x
