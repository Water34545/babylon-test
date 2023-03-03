/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEFAULT_CHAIN_ID: 5,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
