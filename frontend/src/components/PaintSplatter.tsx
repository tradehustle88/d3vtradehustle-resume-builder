"use client";

import React from 'react';
import '../styles/paint-splatters.css';

interface PaintSplatterProps {
  type: 'blue' | 'yellow' | 'red' | 'multicolor' | 'multicolor-2' | 'drops' | 'drops-2' | 'spray-1' | 'spray-2';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  animation?: 'float' | 'pulse' | 'fade-in' | 'hover' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

export default function PaintSplatter({
  type,
  size = 'md',
  position,
  animation = 'none',
  className = '',
  style = {}
}: PaintSplatterProps) {
  const baseClasses = ['paint-splatter'];
  
  // Add type-specific class
  if (type === 'drops' || type === 'drops-2') {
    baseClasses.push(`paint-${type}`);
  } else if (type === 'spray-1' || type === 'spray-2') {
    baseClasses.push(`spray-paint-${type.split('-')[1]}`);
  } else {
    baseClasses.push(`paint-splatter-${type}`);
  }
  
  // Add size class
  baseClasses.push(`paint-splatter-${size}`);
  
  // Add position class
  if (position) {
    baseClasses.push(`paint-${position}`);
  }
  
  // Add animation class
  if (animation !== 'none') {
    baseClasses.push(`paint-splatter-${animation}`);
  }
  
  const finalClassName = [...baseClasses, className].join(' ');
  
  return (
    <div 
      className={finalClassName}
      style={style}
      aria-hidden="true"
    />
  );
}

// Preset configurations for common use cases
export const PaintPresets = {
  // Hero section background splatters
  heroBackground: [
    { type: 'multicolor' as const, size: 'xl' as const, position: 'top-right' as const, animation: 'float' as const },
    { type: 'blue' as const, size: 'lg' as const, position: 'bottom-left' as const, animation: 'pulse' as const },
    { type: 'drops' as const, size: 'md' as const, position: 'center' as const, animation: 'fade-in' as const }
  ],
  
  // Form section accents
  formAccents: [
    { type: 'yellow' as const, size: 'sm' as const, position: 'top-left' as const, animation: 'float' as const },
    { type: 'red' as const, size: 'md' as const, position: 'bottom-right' as const, animation: 'hover' as const }
  ],
  
  // Resume preview decorations
  resumeDecorations: [
    { type: 'spray-1' as const, size: 'lg' as const, position: 'top-right' as const, animation: 'pulse' as const },
    { type: 'drops-2' as const, size: 'sm' as const, position: 'bottom-left' as const, animation: 'float' as const }
  ],
  
  // Payment success celebration
  successCelebration: [
    { type: 'multicolor-2' as const, size: 'xl' as const, position: 'center' as const, animation: 'fade-in' as const },
    { type: 'spray-2' as const, size: 'lg' as const, position: 'top-left' as const, animation: 'pulse' as const },
    { type: 'drops' as const, size: 'md' as const, position: 'bottom-right' as const, animation: 'float' as const }
  ]
};

// Component for rendering preset configurations
interface PaintPresetProps {
  preset: keyof typeof PaintPresets;
  containerClassName?: string;
}

export function PaintPreset({ preset, containerClassName = '' }: PaintPresetProps) {
  const splatters = PaintPresets[preset];
  
  return (
    <div className={`relative ${containerClassName}`}>
      {splatters.map((splatter, index) => (
        <PaintSplatter
          key={index}
          {...splatter}
        />
      ))}
    </div>
  );
}
