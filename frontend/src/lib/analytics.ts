// Google Analytics tracking utilities for Trade Hustle Resume Builder

// TypeScript declaration for gtag
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

/**
 * Track a pageview
 * @param url - The page URL to track
 */
export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-WV2HHYYKCL', {
            page_path: url,
        });
    }
};

/**
 * Track when user downloads the resume kit
 * @param method - Download method (e.g., 'Trade Hustle Resume Kit', 'Direct Link')
 */
export const trackResumeDownload = (method: string = 'Trade Hustle Resume Kit') => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'resume_download', {
            method: method,
            event_category: 'engagement',
            event_label: 'Resume Kit Download',
        });
    }
};

/**
 * Track when user successfully unlocks resume
 * @param email - User email (optional, for conversion tracking)
 */
export const trackResumeUnlock = (email?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'resume_unlock', {
            event_category: 'conversion',
            event_label: 'Resume Unlocked',
            value: 1,
        });
    }
};

/**
 * Track user signup/authentication
 * @param method - Auth method ('email', 'google', etc.)
 */
export const trackSignup = (method: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'sign_up', {
            method: method,
            event_category: 'engagement',
        });
    }
};

/**
 * Track user login
 * @param method - Auth method ('email', 'google', etc.)
 */
export const trackLogin = (method: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login', {
            method: method,
            event_category: 'engagement',
        });
    }
};

/**
 * Track when user views the API demo/testing page
 */
export const trackApiDemo = () => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'view_api_demo', {
            event_category: 'engagement',
            event_label: 'API Testing Dashboard',
        });
    }
};

/**
 * Track custom trade-specific events
 * @param eventName - The custom event name
 * @param params - Additional event parameters
 */
export const trackCustomEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
            event_category: 'custom',
            ...params,
        });
    }
};

/**
 * Track errors for debugging
 * @param description - Error description
 * @param fatal - Whether the error is fatal
 */
export const trackError = (description: string, fatal: boolean = false) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
            description: description,
            fatal: fatal,
        });
    }
};
