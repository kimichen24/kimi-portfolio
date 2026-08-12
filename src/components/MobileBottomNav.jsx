import { motion } from 'framer-motion'
import { Icon } from './ui/Icon'
import { usePage } from '../context/PageContext'
import { useUI } from '../data'

/**
 * MobileBottomNav — 移动端底部标签栏（iOS 风，仅 md 以下显示）
 * 补齐移动端导航缺口：桌面药丸导航在移动端隐藏，这里提供常驻的 5 页切换。
 * 同时补全桌面药丸缺失的「联系」入口（5 页皆可直达）。
 * 激活项用 framer-motion layoutId 做滑动高亮，与桌面药丸视觉呼应。
 */
const TABS = [
  { key: 'home', Icon: Icon.Home },
  { key: 'projects', Icon: Icon.Pen },
  { key: 'experience', Icon: Icon.Chart },
  { key: 'strengths', Icon: Icon.People },
  { key: 'contact', Icon: Icon.Mail },
]

export default function MobileBottomNav() {
  const { page, navigate } = usePage()
  const ui = useUI()

  const labelFor = (key) => {
    switch (key) {
      case 'home':
        return ui.nav.home
      case 'projects':
        return ui.nav.projects
      case 'experience':
        return ui.nav.experience
      case 'strengths':
        return ui.nav.strengths
      case 'contact':
        return ui.contact?.title || '联系'
      default:
        return ''
    }
  }

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-black/10 bg-white/80 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl backdrop-saturate-180 md:hidden"
    >
      {TABS.map((t) => {
        const active = page === t.key
        const TabIcon = t.Icon
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => navigate(t.key)}
            aria-current={active ? 'page' : undefined}
            className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition-colors"
          >
            {active && (
              <motion.span
                layoutId="mobile-nav-active"
                className="absolute inset-0 rounded-xl bg-black/[0.06]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative z-10 ${active ? 'text-ink-900' : 'text-ink-500'}`}>
              <TabIcon width={22} height={22} />
            </span>
            <span className={`relative z-10 ${active ? 'text-ink-900' : 'text-ink-500'}`}>
              {labelFor(t.key)}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
