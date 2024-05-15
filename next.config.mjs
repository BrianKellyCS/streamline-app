/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  experimental: {
    fetchCache: 'force-no-store',
  },
  // Add other configuration options here as needed
};

export default nextConfig;
