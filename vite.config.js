import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config — React + 端口 + 主机配置
export default defineConfig({
  // 相对路径：站点挂在任意子路径（如 /kimi-portfolio/）下资源也能正确加载
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    open: false,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    // 把体积大、变动少的第三方库拆成独立 vendor chunk，
    // 提升长效缓存命中率、缩小主包、加速二次访问。
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
})