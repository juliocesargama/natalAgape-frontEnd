import { fileURLToPath, URL } from 'node:url'

import { build, defineConfig, loadEnv, Rollup } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {

 const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL}`;


  return {
    server: {
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      rollupOptions: {
        external: [
          'jwt-decode',
        ]
    }
    },
  }
})




