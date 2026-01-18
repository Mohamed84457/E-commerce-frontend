/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    domains: [
      "127.0.0.1",
      "localhost",
      "myapi.com",
      "via.placeholder.com",
      "192.168.1.2",
      "https://dmtecommerce.vercel.app/",
    ], // 👈 allow backend image hosts
  },
};

export default nextConfig;
