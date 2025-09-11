/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: { unoptimized: true },
};

module.exports = nextConfig;
