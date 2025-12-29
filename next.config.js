/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
const buildId = process.env.NEXT_PUBLIC_BUILD_ID;
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => buildId,
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateEtags: true,

  webpack(config) {
    config.devtool = "source-map";
    return config;
  },
  onDemandEntries: {
    // Prevent dev server from caching aggressively
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // optimizeCss: true,
    staleTimes: {
      static: 60 * 60 * 24, // 24 hours
      dynamic: 60, // 1 minute
    },
    authInterrupts: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:3500/uploads/:path*",
      },
    ];
  },
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:all*(js|css|svg|jpg|png|ico|woff2?)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = nextConfig;
// module.exports = withBundleAnalyzer(nextConfig);
