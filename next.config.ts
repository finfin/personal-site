import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withContentlayer } from 'next-contentlayer2';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
};

export default withNextIntl(withContentlayer(nextConfig));
