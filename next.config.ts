import createNextIntlPlugin from 'next-intl/plugin';

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: 'standalone',

  // ESLint configuration - ignore during builds for production
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
