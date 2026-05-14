/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "https://nail-salon-gilt.vercel.app/api/:path*",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        // this will match `/english(default)/something` being requested
        source: "/admin",
        destination: "https://nail-salon-gilt.vercel.app/admin/overview",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
