/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/os-from-scratch' : '',
  assetPrefix: isProd ? '/os-from-scratch/' : '',
  trailingSlash: true,
};

export default nextConfig;
