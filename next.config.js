// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // … tes autres options Next.js …

  webpack(config) {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ]
    return config
  },
}

module.exports = nextConfig
