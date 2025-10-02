/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Enable for production static builds
  trailingSlash: true,  // Add trailing slashes for better static hosting compatibility
  images: {
    unoptimized: true,  // Keep this for Firebase compatibility
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
