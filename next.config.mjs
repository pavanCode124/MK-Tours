/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'supa.tripzocrm.cloud', pathname: '/storage/v1/object/public/media/**' },
    ],
  },
};

export default nextConfig;
