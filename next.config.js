/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = {
  images: {
    domains: ['https://rnzvaehakmgsnhtqonhu.supabase.co','looko-frontend-three.vercel.app'],
  },
};
