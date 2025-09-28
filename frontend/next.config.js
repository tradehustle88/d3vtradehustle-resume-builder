/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Static export for Firebase Hosting - API routes handled by Firebase Functions
  trailingSlash: true,  // Add trailing slashes for better static hosting compatibility
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
