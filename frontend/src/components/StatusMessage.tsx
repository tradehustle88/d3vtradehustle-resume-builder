'use client';

import { ReactNode } from 'react';

export type StatusType = 'loading' | 'success' | 'error' | 'warning' | 'info';

interface StatusMessageProps {
  type: StatusType;
  title: string;
  message?: string | ReactNode;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * StatusMessage Component
 * Displays user feedback for different states
 * Implements WCAG 2.1 AA with ARIA live regions
 */
export default function StatusMessage({
  type,
  title,
  message,
  icon,
  action,
  className = '',
}: StatusMessageProps) {
  // Default icons for each status type
  const defaultIcons: Record<StatusType, string> = {
    loading: '⏳',
    success: '✅',
    error: '⚠️',
    warning: '⚡',
    info: 'ℹ️',
  };

  // Color schemes for each type
  const colorSchemes: Record<StatusType, { icon: string; title: string; message: string }> = {
    loading: {
      icon: 'text-blue-400',
      title: 'text-yellow-300',
      message: 'text-gray-300',
    },
    success: {
      icon: 'text-green-400',
      title: 'text-green-400',
      message: 'text-gray-300',
    },
    error: {
      icon: 'text-red-400',
      title: 'text-red-400',
      message: 'text-gray-300',
    },
    warning: {
      icon: 'text-yellow-400',
      title: 'text-yellow-300',
      message: 'text-gray-300',
    },
    info: {
      icon: 'text-blue-400',
      title: 'text-blue-300',
      message: 'text-gray-300',
    },
  };

  const colors = colorSchemes[type];
  const displayIcon = icon || defaultIcons[type];

  // ARIA attributes based on status type
  const ariaRole = type === 'error' || type === 'warning' ? 'alert' : 'status';
  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  return (
    <div
      className={`space-y-6 ${className}`}
      role={ariaRole}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      {/* Icon */}
      {displayIcon && (
        <div 
          className={`text-6xl mb-4 ${colors.icon}`}
          role="img"
          aria-label={`${type} status icon`}
        >
          {type === 'loading' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400 mx-auto" />
          ) : (
            displayIcon
          )}
        </div>
      )}

      {/* Title */}
      <h2 
        className={`font-heading text-xl md:text-2xl font-bold ${colors.title}`}
        id={`status-title-${type}`}
      >
        {title}
      </h2>

      {/* Message */}
      {message && (
        <div 
          className={`font-body ${colors.message} leading-relaxed`}
          id={`status-message-${type}`}
        >
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>
      )}

      {/* Action Button/Link */}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
