import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/account/settings',
        destination: '/app/profile',
        permanent: true,
      },
    ]
  },
};

export default withNextIntl(nextConfig);