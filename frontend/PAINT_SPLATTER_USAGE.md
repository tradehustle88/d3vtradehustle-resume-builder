# Paint Splatter Usage Guide 🎨

## Quick Start

### 1. Import the Component
```tsx
import PaintSplatter, { PaintPreset } from '@/components/PaintSplatter';
```

### 2. Basic Usage
```tsx
// Simple paint splatter
<PaintSplatter type="blue" size="lg" position="top-right" animation="float" />

// Using presets for common layouts
<PaintPreset preset="heroBackground" />
```

### 3. Import CSS (if needed separately)
```css
@import '../styles/paint-splatters.css';
```

## Available Assets

### Paint Splatters
- `blue` - Clean blue splatter with droplets
- `yellow` - Bold diagonal yellow splash
- `red` - Dynamic red paint splash
- `multicolor` - Vibrant multi-color explosion
- `multicolor-2` - Secondary multi-color burst

### Paint Effects  
- `drops` - Scattered droplet pattern
- `drops-2` - Additional droplet variations
- `spray-1` - Graffiti-style spray effect
- `spray-2` - Alternative spray pattern

## Component Props

### PaintSplatter Props
```typescript
interface PaintSplatterProps {
  type: 'blue' | 'yellow' | 'red' | 'multicolor' | 'multicolor-2' | 'drops' | 'drops-2' | 'spray-1' | 'spray-2';
  size?: 'sm' | 'md' | 'lg' | 'xl';  // 80px, 120px, 200px, 300px
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  animation?: 'float' | 'pulse' | 'fade-in' | 'hover' | 'none';
  className?: string;
  style?: React.CSSProperties;
}
```

## Usage Examples

### Hero Section Background
```tsx
function HeroSection() {
  return (
    <div className="relative min-h-screen">
      {/* Content */}
      <div className="relative z-10">
        <h1>Trade Hustle Resume Builder</h1>
      </div>
      
      {/* Paint splatter background */}
      <PaintPreset preset="heroBackground" />
    </div>
  );
}
```

### Form with Accent Splatters
```tsx
function ResumeForm() {
  return (
    <div className="relative p-8">
      {/* Form content */}
      <form>
        {/* form fields */}
      </form>
      
      {/* Decorative splatters */}
      <PaintSplatter 
        type="yellow" 
        size="sm" 
        position="top-left" 
        animation="float" 
      />
      <PaintSplatter 
        type="red" 
        size="md" 
        position="bottom-right" 
        animation="hover" 
      />
    </div>
  );
}
```

### Custom Positioned Splatter
```tsx
<PaintSplatter 
  type="multicolor"
  size="xl"
  animation="pulse"
  style={{
    top: '25%',
    right: '15%',
    transform: 'rotate(45deg)'
  }}
/>
```

### Success Animation
```tsx
function PaymentSuccess() {
  return (
    <div className="relative">
      <h2>Payment Successful! 🎉</h2>
      <PaintPreset preset="successCelebration" />
    </div>
  );
}
```

## Available Presets

### `heroBackground`
Large multicolor explosion with floating blue splatter and centered drops

### `formAccents`  
Subtle yellow and red accents for form sections

### `resumeDecorations`
Spray paint and drops for resume preview areas

### `successCelebration`
Celebratory burst of colors for success states

## CSS Classes

### Direct CSS Usage (without React)
```html
<!-- Basic splatter -->
<div class="paint-splatter paint-splatter-blue paint-splatter-lg paint-top-right paint-splatter-float"></div>

<!-- Brick wall background -->
<div class="brick-wall-bg min-h-screen"></div>
```

### Custom Styling
```css
/* Override opacity */
.my-custom-splatter {
  opacity: 0.9 !important;
}

/* Add custom animation delay */
.paint-splatter-delayed {
  animation-delay: 1s;
}
```

## Performance Tips

1. **Lazy Loading**: Paint splatters are background images - they'll load efficiently
2. **Size Optimization**: Use appropriate sizes (sm/md for accents, lg/xl for backgrounds)
3. **Animation Control**: Use `animation="none"` for static decorations
4. **Z-Index**: Splatters default to `z-index: -1` to stay behind content

## Brand Colors

The paint splatters use authentic colors that can be adjusted with CSS filters:
- **Hustle Red**: `filter: hue-rotate(0deg) saturate(1.2) brightness(1.1)`
- **Hustle Yellow**: `filter: hue-rotate(45deg) saturate(1.3) brightness(1.2)`  
- **Hustle Blue**: `filter: hue-rotate(220deg) saturate(1.1) brightness(0.9)`

## File Locations

```
frontend/
├── public/assets/
│   ├── paint-splatters/          # All paint splatter PNGs
│   └── brick-wall-texture.webp   # Brick background
├── src/
│   ├── components/PaintSplatter.tsx  # React component
│   └── styles/paint-splatters.css    # CSS utilities
```