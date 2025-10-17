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
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-WV2HHYYKCL', {
            page_path: url,
        });
    }
};

/**
 * Track custom events
 * @param eventName - The name of the event
 * @param params - Event parameters
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

/**
 * Track when user downloads the resume kit
 * @param method - Download method (e.g., 'Trade Hustle Resume Kit', 'Direct Link')
 */
export const trackResumeDownload = (method: string = 'Trade Hustle Resume Kit') => {
    trackEvent('resume_download', {
        method: method,
        event_category: 'engagement',
        event_label: 'Resume Kit Download',
    });
};

/**
 * Track when user successfully unlocks resume
 * @param email - User email (optional, for conversion tracking)
 */
export const trackResumeUnlock = (email?: string) => {
    trackEvent('resume_unlock', {
        event_category: 'conversion',
        event_label: 'Resume Unlocked',
        value: 1,
    });
};

/**
 * Track template interactions
 */
export const trackTemplateView = (templateId: string, trade: string) => {
    trackEvent('template_card_viewed', {
        template_id: templateId,
        trade: trade,
        event_category: 'engagement',
    });
};

export const trackTemplateModalOpen = (templateId: string, trade: string) => {
    trackEvent('template_modal_opened', {
        template_id: templateId,
        trade: trade,
        event_category: 'engagement',
    });
};

export const trackTemplateUseClick = (templateId: string, trade: string, authenticated: boolean) => {
    trackEvent('template_use_clicked', {
        template_id: templateId,
        trade: trade,
        authenticated: authenticated,
        event_category: 'conversion',
        event_label: authenticated ? 'Authenticated User' : 'Guest User',
    });
};

export const trackTemplateDownload = (templateId: string, trade: string) => {
    trackEvent('template_download_clicked', {
        template_id: templateId,
        trade: trade,
        event_category: 'conversion',
    });
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
