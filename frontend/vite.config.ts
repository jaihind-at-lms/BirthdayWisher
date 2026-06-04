import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  let outDir = 'dist'

  if (command === 'build' && /(dev|qa|stage)/.test(mode)) {
    outDir = `dist-${mode}`
  }

  const port = env.VITE_PORT ? parseInt(env.VITE_PORT, 10) : 3000
  const base = env.VITE_ROUTER_BASE_PATH ?? '/'

  return {
    plugins: [react(), svgr()],
    base,
    resolve: {
      alias: {
        '@project': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: 'localhost',
      port,
    },
    build: {
      outDir,
      chunkSizeWarningLimit: 500,
    },
  }
})
