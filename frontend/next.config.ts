import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: {
		turbopack: {}, // keep dev server happy, avoids root warnings
	},
};

export default nextConfig;
