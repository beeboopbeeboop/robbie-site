import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/robbie-site' : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    root: rootDir,
  },
}

export default nextConfig
