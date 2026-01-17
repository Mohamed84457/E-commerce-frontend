/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "localhost", "myapi.com", "via.placeholder.com","192.168.1.2"], // 👈 allow backend image hosts
  },
};

export default nextConfig;
