import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SpaceTravel from './components/SpaceTravel'
import FloatingNav from './components/FloatingNav'
import MobileBottomNav from './components/MobileBottomNav'
import Footer from './components/Footer'
import PageFrame from './components/PageFrame'
import ErrorBoundary from './components/ErrorBoundary'
import NotFound from './components/NotFound'
import { PageProvider, usePage } from './context/PageContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { initSmoothScroll, destroySmoothScroll, scrollToTop } from './lib/smoothScroll'

// 路由级代码分割：首页作为落地页保持即时渲染，其余 4 页懒加载，
// 缩窄首屏关键 JS 体积，非首屏页面随导航按需拉取。
const Experience = lazy(() => import('./components/Experience'))
const Projects = lazy(() => import('./components/Projects'))
const Strengths = lazy(() => import('./components/Strengths'))
const Contact = lazy(() => import('./components/Contact'))
const ProjectDetail = lazy(() => import('./components/ProjectDetail'))

// 页面映射（not-found 为兜底页，体积小直接打包）
const PAGE_MAP = {
  home: SpaceTravel,
  experience: Experience,
  projects: Projects,
  strengths: Strengths,
  contact: Contact,
  project: ProjectDetail,
  'not-found': NotFound,
}

/**
 * PageRenderer — 渲染当前页 + AnimatePresence 过渡
 * 切换页面时自动 scroll 到顶部
 */
function PageRenderer() {
  const { page, projectId } = usePage()
  const PageComp = PAGE_MAP[page] || SpaceTravel

  // 切换页面时 scroll 顶部（用 Lenis 实例归位，避免与平滑滚动打架）
  useEffect(() => {
    scrollToTop(true)
  }, [page])

  // 可访问性：切页后将焦点移到新页根节点，键盘 / 读屏用户不会“卡”在旧页。
  // AnimatePresence mode="wait" 会在旧页退出动画结束后才挂载新页，
  // 故用 rAF 轮询直到新页根节点出现再聚焦（最多约 1s）。
  useEffect(() => {
    let raf
    let tries = 0
    const tryFocus = () => {
      const el = document.getElementById(`page-${page}`)
      if (el) {
        el.focus({ preventScroll: true })
      } else if (tries++ < 60) {
        raf = requestAnimationFrame(tryFocus)
      }
    }
    raf = requestAnimationFrame(tryFocus)
    return () => cancelAnimationFrame(raf)
  }, [page])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={projectId ? `${page}-${projectId}` : page}
        id={`page-${page}`}
        tabIndex={-1}
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full focus:outline-none"
      >
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <PageComp />
          </Suspense>
        </ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  )
}

// 懒加载占位 — 轻量骨架屏（标题条 + 内容卡轮廓），让等待看起来“有布局”而不是白屏
function PageFallback() {
  return (
    <div className="container-page min-h-screen pt-36" aria-hidden>
      <div className="animate-pulse">
        <div className="mb-4 h-2.5 w-24 rounded-full bg-ink-900/10" />
        <div className="mb-12 h-10 w-64 max-w-full rounded-xl bg-ink-900/10" />
        <div className="space-y-4">
          <div className="h-32 rounded-2xl bg-ink-900/[0.05]" />
          <div className="h-32 rounded-2xl bg-ink-900/[0.05]" />
        </div>
      </div>
    </div>
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
  // 全站平滑滚动打底（苹果丝滑感核心杠杆）；减弱动效时模块内部自动跳过
  useEffect(() => {
    initSmoothScroll()
    return () => destroySmoothScroll()
  }, [])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <PageProvider>
        {/* 单页切换区域 — 正常文档流，页面内容可以滚动
            各页背景由页面组件内的 .page-bg 提供（暗调、按页不同质化） */}
        <main className="relative z-0 min-h-screen pb-24 md:pb-0">
          <PageRenderer />
        </main>

        {/* 药丸导航 — 全站显示（fixed，滚动时跟随），保留毛玻璃 */}
        <PillNavGate />

        {/* 移动端底部标签栏 — 仅 md 以下显示，补齐移动端导航缺口 */}
        <MobileBottomNav />

        {/* 全站编辑式签名层 — 内框 / 套准标记 / 滚动进度 / 页码索引 */}
        <PageFrame />

        {/* 底部 Footer — 跟随内容流 */}
        <Footer />
        </PageProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}