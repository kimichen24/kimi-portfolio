import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Strengths from './components/Strengths'
import SpaceTravel from './components/SpaceTravel'
import Contact from './components/Contact'
import FloatingNav from './components/FloatingNav'
import Footer from './components/Footer'
import { PageProvider, usePage } from './context/PageContext'

// 页面映射
const PAGE_MAP = {
  home: SpaceTravel,
  experience: Experience,
  projects: Projects,
  strengths: Strengths,
  contact: Contact,
}

/**
 * PageRenderer — 渲染当前页 + AnimatePresence 过渡
 * 切换页面时自动 scroll 到顶部
 */
function PageRenderer() {
  const { page } = usePage()
  const PageComp = PAGE_MAP[page] || SpaceTravel

  // 切换页面时 scroll 顶部（不依赖 framer-motion 的位置）
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [page])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <PageComp />
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * PillNavGate — 药丸导航全站显示
 *
 * 所有页面（包括 Home）都显示药丸导航
 * 当前页对应 pill 高亮（is-active）
 */
function PillNavGate() {
  return <FloatingNav />
}

/**
 * App — 单页作品集（单页切换模式 + 允许页内滚动）
 */
export default function App() {
  return (
    <PageProvider>
      {/* 单页切换区域 — 正常文档流，页面内容可以滚动
          各页背景由页面组件内的 .page-bg 提供（暗调、按页不同质化） */}
      <main className="relative z-0 min-h-screen">
        <PageRenderer />
      </main>

      {/* 药丸导航 — 全站显示（fixed，滚动时跟随），保留毛玻璃 */}
      <PillNavGate />

      {/* 底部 Footer — 跟随内容流 */}
      <Footer />
    </PageProvider>
  )
}