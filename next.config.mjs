/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/privacy', destination: '/privacy.html' },
      { source: '/terms', destination: '/terms.html' },
      { source: '/terms-and-conditions', destination: '/terms.html' },
      { source: '/manager-v2', destination: '/manager-v2/index.html' },
      { source: '/super-v2', destination: '/super-v2/index.html' },
    ];
  },
};

export default nextConfig;

