/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig