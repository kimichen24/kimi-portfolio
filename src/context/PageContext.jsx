/**
 * PageContext — 单页切换模式
 *
 * 全局维护当前页（home / experience / projects / strengths / contact）
 * 通过 navigate(target) 切换，配合 AnimatePresence 做过渡
 */
import { createContext, useContext, useState, useCallback } from 'react'

const PageContext = createContext(null)

export const PAGES = ['home', 'experience', 'projects', 'strengths', 'contact']

export function PageProvider({ children }) {
  const [page, setPage] = useState('home')

  const navigate = useCallback((target) => {
    if (PAGES.includes(target)) setPage(target)
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
