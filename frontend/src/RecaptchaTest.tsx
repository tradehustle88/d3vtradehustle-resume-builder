"use client";

import { useEffect } from "react";
import { localVerifyRecaptcha } from "@/lib/api";

export default function RecaptchaTest() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY!, { action: "submit" })
          .then(async (token: string) => {
            console.log("Got reCAPTCHA token:", token);

            try {
              // Use our centralized API client
              const data = await localVerifyRecaptcha(token);
              console.log("Verification result:", data);
            } catch (error: any) {
              console.error("reCAPTCHA verification error:", error.message);
            }
          })
          .catch((err: any) => {
            console.error("reCAPTCHA error:", err);
          });
      });
    } else {
      console.warn("grecaptcha not yet available");
    }
  }, []);

  return (
    <div>
      <h2>reCAPTCHA Test</h2>
      <p>Check the console for verification results.</p>
    </div>
  );
}
