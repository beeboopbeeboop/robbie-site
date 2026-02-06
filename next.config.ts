import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/robbie-site',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: '/robbie-site',
  },
  turbopack: {
    root: rootDir,
  },
}

export default nextConfig
