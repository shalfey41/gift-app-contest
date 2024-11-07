/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['grammy'],
    instrumentationHook: true,
  },
};

export default nextConfig;
