/**
 * FloatingNav — 药丸导航（基于 React Bits 的 PillNav）
 *
 * 行为（按需求「滚动时消失、不滚动时出现」）：
 *   - 居中悬浮在视口顶部，磨砂玻璃质感（pill 自带）
 *   - 3 个图标：作品集 / 经历 / 关于我
 *   - GSAP 驱动的 hover 圆形扩散动画
 *   - 仅桌面端（md+）显示
 *
 * 自动隐藏规则：
 *   - 页面顶部（scrollY < 80）：始终显示，方便从首页导航
 *   - 一旦开始滚动（任意方向）→ 立即滑出隐藏
 *   - 停止滚动约 1s 后 → 自动滑入显示
 *   - 切换 page 时：立即重置为显示
 *
 * 实现要点：
 *   - 用「滚动发生即隐藏 + 停止后防抖显示」，而非方向检测，
 *     彻底避免「向上滚又冒出来」的问题（之前 delta 方案的 bug）
 *   - translateY -200% 完全离开屏幕 + opacity 同步 0 → 1
 *   - pointer-events 跟随状态，隐藏时不可点击
 *   - transition 300ms ease-out 平滑过渡
 */
import { useEffect, useRef, useState } from 'react'
import PillNav from './ui/PillNav'
import './ui/PillNav.css'
import { Icon } from './ui/Icon'
import { usePage } from '../context/PageContext'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { useUI } from '../data'

export default function FloatingNav() {
  const { page, navigate } = usePage()
  const { lang, toggleLang } = useLang()
  const { theme, toggleTheme } = useTheme()
  const ui = useUI()
  const [visible, setVisible] = useState(true)
  const hideTimer = useRef(null)

  // 弹窗打开时强制隐藏导航（监听 body[data-modal-open] 属性变化）
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.dataset.modalOpen === 'true') {
        setVisible(false)
        if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null }
      } else {
        // 弹窗关闭 → 立即恢复导航
        setVisible(true)
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-modal-open'] })
    return () => observer.disconnect()
  }, [])

  // 滚动即隐藏，停止滚动 ~1s 后显示
  useEffect(() => {
    const SHOW_DELAY = 2500

    const onScroll = () => {
      const curY = window.scrollY

      // 顶部始终显示（首页 / 回到顶部的瞬间）
      if (curY < 80) {
        setVisible(true)
        if (hideTimer.current) {
          clearTimeout(hideTimer.current)
          hideTimer.current = null
        }
        return
      }

      // 正在滚动 → 立即隐藏，并重置「停止后显示」的计时器
      setVisible(false)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setVisible(true), SHOW_DELAY)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  // 切换 page 时：强制显示
  useEffect(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    setVisible(true)
  }, [page])

  const items = [
    { label: ui.nav.home, href: 'home', icon: <Icon.Home /> },
    { label: ui.nav.projects, href: 'projects', icon: <Icon.Pen /> },
    { label: ui.nav.experience, href: 'experience', icon: <Icon.Chart /> },
    { label: ui.nav.strengths, href: 'strengths', icon: <Icon.People /> },
  ]

  // 切换按钮视觉状态与导航同步（滚动隐藏时一起淡出）
  const toggleStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(6px)',
    transition: 'opacity 300ms ease-out, transform 300ms ease-out',
    pointerEvents: visible ? 'auto' : 'none',
  }

  return (
    <>
      {/* 药丸导航 — 桌面端（md+）显示；移动端交由底部标签栏 MobileBottomNav */}
      <div
        className="fixed left-0 right-0 top-4 z-50 hidden justify-center md:top-6 md:flex"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-200%)',
          opacity: visible ? 1 : 0,
          transition: 'transform 300ms ease-out, opacity 300ms ease-out',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <PillNav
          items={items}
          activeHref={page}
          onItemClick={(item) => navigate(item.href)}
          ease="power3.easeOut"
          baseColor={theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)'}
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#1d1d1f"
          className="pill-nav--frosted"
        />
      </div>

      {/* 中英切换 + 深浅切换 — 统一右上角（移动端避开底部标签栏） */}
      <div
        className="fixed right-4 top-4 z-50 flex items-center gap-2 md:right-6 md:top-6"
        style={toggleStyle}
      >
        <button
          type="button"
          onClick={toggleLang}
          aria-label="切换语言 / Switch language"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 transition-all hover:bg-ink-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <GlobeMini />
          {lang === 'zh' ? 'EN' : '中'}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/80 text-ink-700 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 transition-all hover:bg-ink-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label={theme === 'dark' ? '切换到浅色 / Light mode' : '切换到深色 / Dark mode'}
        >
          {theme === 'dark' ? <SunMini /> : <MoonMini />}
        </button>
      </div>
    </>
  )
}

/* 极简地球图标 — 用于导航项与语言切换（占位，保持视觉一致） */
function GlobeMini() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

/* 月亮 — 表示可切到深色 */
function MoonMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

/* 太阳 — 表示可切到浅色 */
function SunMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
