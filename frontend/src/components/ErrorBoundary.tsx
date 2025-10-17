'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 * Implements industry-standard error handling pattern
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send to error tracking service
    // trackError({ error, errorInfo, component: errorInfo.componentStack });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-black via-[#0A1B3A] to-black flex items-center justify-center p-6">
          <div className="brick-block p-8 max-w-2xl w-full text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Warning">⚠️</div>
            <h1 className="font-heading text-3xl font-bold text-red-400 mb-4">
              Something Went Wrong
            </h1>
            <p className="font-body text-gray-300 mb-6">
              We encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-white border-2 border-hustleBlue/15 p-4 rounded-lg shadow-sm">
                <summary className="cursor-pointer text-yellow-400 font-mono text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-gray-400 overflow-auto">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-hustle"
                aria-label="Try again"
              >
                Try Again
              </button>
              <a
                href="/"
                className="btn-hustle inline-block"
                aria-label="Go to homepage"
              >
                Go to Homepage
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              If this problem persists, please contact support at{' '}
              <a 
                href="mailto:support@tradehustle.com" 
                className="text-yellow-400 hover:text-yellow-300 underline"
              >
                support@tradehustle.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
