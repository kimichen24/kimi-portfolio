/**
 * LanguageContext — 中英切换
 *
 * 全局维护当前语言（'zh' | 'en'）
 * - localStorage 持久化（key: kimi-lang）
 * - 同步 <html lang> 属性
 * - 暴露 lang / setLang / toggleLang
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('kimi-lang') || 'zh'
    }
    return 'zh'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.localStorage) window.localStorage.setItem('kimi-lang', lang)
      document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
    }
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'))
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
