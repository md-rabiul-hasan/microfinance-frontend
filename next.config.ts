// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',
      'microfinance-api', // Add other domains if needed
      '127.0.0.1' // For local IP access
    ]
  }
  // Other Next.js config options can go here
}

export default nextConfig
