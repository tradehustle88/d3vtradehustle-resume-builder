/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export',  // This conflicts with API routes. Choose either static export or server-side rendering.
  trailingSlash: true,  // Add trailing slashes for better static hosting compatibility
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
