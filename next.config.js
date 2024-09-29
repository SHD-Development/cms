/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig