/**
 * PageContext — 单页切换模式（带 URL 深链 #/page）
 *
 * 全局维护当前页（home / experience / projects / strengths / contact）
 * 通过 navigate(target) 切换，配合 AnimatePresence 做过渡。
 *
 * 深链：
 *   - 初始化时从 location.hash 读取（如 #/projects → projects），刷新保持当前页
 *   - navigate 用 history.pushState 写入 #/page（不触发整页刷新，前进/后退可用）
 *   - 监听 hashchange，支持浏览器前进/后退与外部分享链接直达
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const PageContext = createContext(null)

export const PAGES = ['home', 'experience', 'projects', 'strengths', 'contact']

function readHashPage() {
  const h = (window.location.hash || '').replace(/^#\/?/, '')
  return PAGES.includes(h) ? h : 'home'
}

export function PageProvider({ children }) {
  const [page, setPage] = useState(() => readHashPage())

  const navigate = useCallback((target) => {
    if (!PAGES.includes(target)) return
    const next = `#/${target}`
    if (window.location.hash !== next) {
      window.history.pushState(null, '', next)
    }
    setPage(target)
  }, [])

  // 浏览器前进/后退、手动改 hash、外部链接直达
  useEffect(() => {
    const onHashChange = () => setPage(readHashPage())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <PageContext.Provider value={{ page, setPage, navigate }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePage() {
  const ctx = useContext(PageContext)
  if (!ctx) throw new Error('usePage must be used within PageProvider')
  return ctx
}
