/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Static export for Firebase Hosting
  trailingSlash: true,  // Add trailing slashes for better static hosting compatibility
  images: {
    unoptimized: true,  // Keep this for Firebase compatibility
    formats: ['image/webp', 'image/avif'],  // Modern image formats for better compression
  },
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',  // Remove console.logs in production
  },
  
  // Webpack configuration for client-side builds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Comprehensive fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
      };
      
      // Provide process polyfill for client-side
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );
    }
    return config;
  },
  
  // ===== SECURITY HEADERS (Content Security Policy) =====
  // Prevents XSS, clickjacking, and other attacks
  // Note: Static export doesn't support headers() - configure in Firebase hosting
  // For testing: Use Next.js dev server or add to firebase.json headers
  /*
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
              "connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://*.cloudfunctions.net https://www.google-analytics.com",
              "media-src 'self' blob:",
              "frame-src 'self' https://*.firebaseapp.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  */
}

module.exports = withBundleAnalyzer(nextConfig)
