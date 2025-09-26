/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Enable static export for Firebase hosting
  trailingSlash: true,  // Add trailing slashes for better static hosting compatibility
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
