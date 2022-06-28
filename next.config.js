/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org", "rb.gy"],
  },
  async rewrites() {
    return [
      {
        source: "/utils/:path*",
        destination: "https://api.themoviedb.org/3/:path*",
      },
    ];
  },
};
