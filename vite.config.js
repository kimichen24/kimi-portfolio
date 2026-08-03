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
    // 提升长效缓存命中率、缩小主包、加快二次访问。
    // 注意：three 已通过 PageBackground 的 React.lazy 动态导入，
    // 会自动形成独立异步 chunk（不进首屏关键路径）。
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', '@gsap/react'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})