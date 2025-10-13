'use client';

import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: string | ReactNode;
  iconLabel?: string;
  title: string;
  description: string;
  iconColor?: string;
  className?: string;
}

/**
 * FeatureCard Component
 * Displays a feature with icon, title, and description
 * Used in "What's Included" section
 */
export default function FeatureCard({
  icon,
  iconLabel,
  title,
  description,
  iconColor = 'text-yellow-400',
  className = '',
}: FeatureCardProps) {
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      {/* Icon */}
      <span 
        className={`text-2xl flex-shrink-0 ${iconColor}`}
        role={typeof icon === 'string' ? 'img' : undefined}
        aria-label={iconLabel || `${title} icon`}
      >
        {icon}
      </span>

      {/* Content */}
      <div>
        <h4 className="font-heading font-bold text-white mb-1 text-base md:text-lg">
          {title}
        </h4>
        <p className="font-body text-gray-300 text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </li>
  );
}
