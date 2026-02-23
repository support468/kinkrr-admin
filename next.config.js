/** @type {import('next').NextConfig} */

const nextConfig = {
  // react 18 about strict mode https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
  // enable for testing purpose
  compress: true,
  // react 18 about strict mode https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
  reactStrictMode: false,
  distDir: 'dist/.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. in development we need to run yarn lint
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 300,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `**.${process.env.DOMAIN}`
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com'
      }
    ],
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp']
  },
  rewrites() {
    return [
      {
        // default landing page is login page
        source: '/',
        destination: '/auth/login'
      }
    ];
  },
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker', 'rc-notification', 'rc-tooltip', 'rc-tree', 'rc-table'],
  optimizeFonts: true,
  poweredByHeader: false,
  swcMinify: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_ENDPOINT: process.env.API_SERVER_ENDPOINT || process.env.API_ENDPOINT
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_ENDPOINT: process.env.API_ENDPOINT,
    SITE_URL: process.env.SITE_URL,
    MAX_SIZE_IMAGE: process.env.MAX_SIZE_IMAGE,
    MAX_SIZE_FILE: process.env.MAX_SIZE_FILE,
    MAX_SIZE_TEASER: process.env.MAX_SIZE_TEASER,
    MAX_SIZE_VIDEO: process.env.MAX_SIZE_VIDEO,
    BUILD_VERSION: process.env.BUILD_VERSION,
    PAYPAY_PAYOUT_URL: process.env.PAYPAY_PAYOUT_URL || 'https://www.paypal.com/cgi-bin/webscr',
    HASH_PW_CLIENT: process.env.HASH_PW_CLIENT
  }
};

module.exports = nextConfig;
