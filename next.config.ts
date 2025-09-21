import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: 'standalone',

  // ESLint configuration - ignore during builds for production
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration - ignore during builds for production
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack configuration for memory optimization (1.9GB server)
  webpack: (config, { isServer }) => {
    // Optimize memory usage during build for low-memory systems
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000, // 20KB minimum chunk size
        maxSize: 128000, // 128KB maximum chunk size (reduced for low memory)
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 128000, // 128KB chunks
            minChunks: 1,
          },
          antd: {
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            name: 'antd',
            chunks: 'all',
            priority: 20,
            maxSize: 128000,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 128000,
          },
        },
      },
    };

    // Reduce memory usage during build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Memory optimization settings
  experimental: {
    // Reduce memory usage during build
    optimizePackageImports: ['antd', 'dayjs', 'react-toastify', '@ant-design/icons', 'react-icons'],
    // Enable memory-efficient build
    memoryBasedWorkersCount: true,
    // Optimize CSS
    optimizeCss: true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
