/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure the app works correctly on GitHub Pages sub-path
  basePath: '/SkillPillot-AI',
  trailingSlash: true,
}

export default nextConfig
