import { useEffect, useState } from 'react'
import TopNav from './components/TopNav'
import Footer from './components/Footer'
import ProjectDetail from './components/ProjectDetail'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Notes from './pages/Notes'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import { initSmoothScroll, destroySmoothScroll, scrollToTop, getLenis } from './lib/smoothScroll'

/**
 * App — 稿纸作品集（个人网站结构）
 *
 * 路由：#/ 首页 · #/work 作品 · #/about 关于 · #/contact 联系
 *      #/project/<id> 案卷详情 · 其余 404
 *
 * 核心体验装置「红笔批注」：极淡稿纸格线铺底（固定层），
 * 关键内容被红笔画线 / 圈注 / 打勾；固定顶栏提供网站骨架。
 */

function parseHash() {
  const h = window.location.hash || '#/'
  const m = h.match(/^#\/project\/([a-z0-9-]+)/i)
  if (m) return { route: 'project', projectId: m[1] }
  const n = h.match(/^#\/notes\/(no-[a-z0-9]+)/i)
  if (n) return { route: 'notes', noteId: n[1] }
  if (h === '#/' || h === '#' || h === '' || h === '#/home') return { route: 'home' }
  if (h.startsWith('#/notes')) return { route: 'notes' }
  if (h.startsWith('#/work')) return { route: 'work' }
  if (h.startsWith('#/about')) return { route: 'about' }
  if (h.startsWith('#/contact')) return { route: 'contact' }
  return { route: 'not-found' }
}

export default function App() {
  const [loc, setLoc] = useState(parseHash)

  useEffect(() => {
    const onHash = () => setLoc(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // 平滑滚动打底（reduced-motion 下模块内自动跳过）
  useEffect(() => {
    initSmoothScroll()
    return () => destroySmoothScroll()
  }, [])

  // 切页回顶部；带手记子锚点时滚到对应一篇（等进场渲染完成）
  useEffect(() => {
    if (loc.noteId) {
      const t = setTimeout(() => {
        const el = document.getElementById(loc.noteId)
        const lenis = getLenis()
        if (el && lenis) lenis.scrollTo(el, { offset: -84 })
        else if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }
    scrollToTop(true)
  }, [loc.route, loc.projectId, loc.noteId])

  const pageKey =
    loc.route === 'project'
      ? `project-${loc.projectId}`
      : loc.noteId
        ? `notes-${loc.noteId}`
        : loc.route

  return (
    <ErrorBoundary>
      {/* 稿纸底纹 — 固定层：极淡方格 + 左缘装订红线 */}
      <div aria-hidden="true" className="manuscript pointer-events-none fixed inset-0 z-0" />

      <TopNav route={loc.route} />

      <div className="relative z-10 pt-14">
        <div key={pageKey} className="page-enter">
          {loc.route === 'home' && <Home />}
          {loc.route === 'notes' && <Notes />}
          {loc.route === 'work' && <Work />}
          {loc.route === 'about' && <About />}
          {loc.route === 'contact' && <Contact />}
          {loc.route === 'project' && <ProjectDetail projectId={loc.projectId} />}
          {loc.route === 'not-found' && <NotFound />}
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}
