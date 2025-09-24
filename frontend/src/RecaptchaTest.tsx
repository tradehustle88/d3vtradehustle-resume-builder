"use client";

import { useEffect } from "react";

export default function RecaptchaTest() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY!, { action: "submit" })
          .then(async (token: string) => {
            console.log("Got reCAPTCHA token:", token);

            // Send token to backend for verification
            const res = await fetch("/api/verify-recaptcha", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });

            const data = await res.json();
            console.log("Verification result:", data);
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
