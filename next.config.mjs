/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  ...(isStaticExport ? { basePath: '/os-from-scratch', assetPrefix: '/os-from-scratch/' } : {}),
  trailingSlash: true,
};

export default nextConfig;
