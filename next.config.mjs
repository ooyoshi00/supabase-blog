import nextMDX from '@next/mdx'

const withMDX = nextMDX()

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'okamune-home.supabase.co'
      }
    ]
  }
}

export default withMDX(nextConfig)
