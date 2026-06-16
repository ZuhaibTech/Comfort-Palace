/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path((?!api|uploads|assets|_next).+\\.(?:jpg|jpeg|png|svg|ico|gif|webp))',
        destination: '/images/:path',
      },
    ];
  },
};

export default nextConfig;
