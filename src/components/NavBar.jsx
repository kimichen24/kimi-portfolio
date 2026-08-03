import { useEffect, useState } from 'react'
import { navItems } from '../data/content'

/**
 * 顶部固定导航栏 — 滚动时增加磨砂玻璃效果
 * 锚点跳转通过原生 scroll-behavior: smooth 实现
 */
export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 简单的 active 锚点检测
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav-scrolled' : 'glass-nav'
      }`}
    >
      <nav className="container-page flex h-14 items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2 text-ink-800"
          aria-label="返回首页"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#003a73] text-xs font-semibold text-white shadow-soft">
            K
          </span>
          <span className="text-sm font-medium tracking-tight">陈权峰</span>
        </a>

        {/* 导航项 — 居中布局 */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`relative px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                    isActive ? 'text-ink-800' : 'text-ink-500 hover:text-ink-800'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-1/2 -bottom-0.5 h-0.5 -translate-x-1/2 rounded-full bg-ink-800 transition-all duration-300 ${
                      isActive ? 'w-4 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        {/* 右侧 CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-ink-800 px-4 py-2 text-[13px] font-medium text-white transition-all duration-300 hover:bg-ink-700 active:scale-[0.98]"
        >
          联系我
        </a>
      </nav>
    </header>
  )
}