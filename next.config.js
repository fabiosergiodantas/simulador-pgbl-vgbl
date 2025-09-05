/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
