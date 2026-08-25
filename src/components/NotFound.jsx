/**
 * NotFound — 404 兜底页
 *
 * 访问未注册的 hash 路径（如 #/xxx）时展示，替代原先的“静默回首页”。
 * 给出明确说明 + 返回首页按钮，避免访问者误以为网站出错。
 */
import { motion } from 'framer-motion'
import PageBackground from './ui/PageBackground'
import { usePage } from '../context/PageContext'
import { useUI } from '../data'

export default function NotFound() {
  const { navigate } = usePage()
  const ui = useUI()

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
      <PageBackground />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <span
          aria-hidden
          className="font-display text-[88px] font-semibold leading-none tracking-tight text-ink-900/[0.12] md:text-[132px]"
        >
          {ui.notFound.code}
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
          {ui.notFound.title}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
          {ui.notFound.desc}
        </p>
        <button
          type="button"
          onClick={() => navigate('home')}
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-ink-800 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          {ui.notFound.back}
        </button>
      </motion.div>
    </section>
  )
}
