/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/draft',
          destination: '/',
          permanent: false,
        },
      ]
    }
    return []
  },
}

export default nextConfig
