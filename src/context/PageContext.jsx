/**
 * PageContext — 单页切换模式（带 URL 深链 #/page）
 *
 * 全局维护当前页（home / experience / projects / strengths / contact / project）
 * 通过 navigate(target) 切换，配合 AnimatePresence 做过渡。
 * 项目详情为独立页：navigate('project', id) → #/project/<id>
 *
 * 深链：
 *   - 初始化时从 location.hash 读取（如 #/projects → projects，#/project/intern-radar → project + id），刷新保持当前页
 *   - navigate 用 history.pushState 写入 #/page（不触发整页刷新，前进/后退可用）
 *   - 监听 hashchange，支持浏览器前进/后退与外部分享链接直达
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const PageContext = createContext(null)

export const PAGES = ['home', 'experience', 'projects', 'strengths', 'contact', 'project']

function parseHash() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '')
  if (raw.startsWith('project/')) {
    const id = raw.slice('project/'.length)
    if (id) return { page: 'project', projectId: id }
  }
  // 空.hash → 首页；已注册页名 → 对应页；其余未知路径 → 404 兜底页（不再静默回首页）
  const page = PAGES.includes(raw) ? raw : raw ? 'not-found' : 'home'
  return { page, projectId: null }
}

export function PageProvider({ children }) {
  const [state, setState] = useState(() => parseHash())

  const navigate = useCallback((target, projectId = null) => {
    if (!PAGES.includes(target)) return
    const next =
      target === 'project' && projectId ? `#/project/${projectId}` : `#/${target}`
    if (window.location.hash !== next) {
      window.history.pushState(null, '', next)
    }
    setState({ page: target, projectId })
  }, [])

  // 浏览器前进/后退、手动改 hash、外部链接直达
  useEffect(() => {
    const onHashChange = () => setState(parseHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <PageContext.Provider
      value={{ page: state.page, projectId: state.projectId, navigate }}
    >
      {children}
    </PageContext.Provider>
  )
}

export function usePage() {
  const ctx = useContext(PageContext)
  if (!ctx) throw new Error('usePage must be used within PageProvider')
  return ctx
}
