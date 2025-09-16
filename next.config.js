/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  webpack(config) {
    config.devtool = 'source-map';
    return config;
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: { unoptimized: true },
};

module.exports = nextConfig;
