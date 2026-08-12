/**
 * BackButton — 非首页左上角的"返回首页"按钮
 *
 * 磨砂玻璃质感，点击调用 navigate('home')
 * 仅桌面端（md+）显示
 */
import { motion } from 'framer-motion'
import { usePage } from '../context/PageContext'
import { useUI } from '../data'

export default function BackButton() {
  const { navigate } = usePage()
  const ui = useUI()

  return (
    <motion.button
      type="button"
      onClick={() => navigate('home')}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-4 top-4 z-50 hidden items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl backdrop-saturate-150 transition-all hover:bg-ink-100 hover:text-ink-900 md:left-6 md:top-6 md:flex"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      {ui.back}
    </motion.button>
  )
}
