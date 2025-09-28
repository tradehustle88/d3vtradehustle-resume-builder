// src/lib/recaptcha.ts
// reCAPTCHA utility functions for Trade Hustle Resume Builder

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Execute reCAPTCHA and get a token for the specified action
 * @param action - The action to execute (e.g., "signup", "login", "unlock")
 * @returns Promise resolving to the reCAPTCHA token
 */
export async function getRecaptchaToken(action: string = "signup"): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }

    window.grecaptcha.ready(() => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        reject(new Error("reCAPTCHA site key not configured"));
        return;
      }

      window.grecaptcha
        .execute(siteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}

/**
 * Load reCAPTCHA script dynamically if not already loaded
 * @param siteKey - The reCAPTCHA site key
 */
export function loadRecaptchaScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    if (document.querySelector('script[src*="recaptcha"]')) {
      // Wait for it to load
      const checkLoaded = () => {
        if (window.grecaptcha) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA script"));
    
    document.head.appendChild(script);
  });
}