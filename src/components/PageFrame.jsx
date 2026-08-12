/**
 * PageFrame — 全站「编辑式印刷」签名层（浅色 Apple 风版）
 *
 * 设计语言：把整站统一成「一本装订好的刊物」
 *   - 顶部 1px 滚动进度发丝线（浅灰轨道 + 黑色填充）
 *   - 距边缘极淡内框 + 四角套准标记
 *   - 右下角页码索引「0X / 05 · 标签」
 *   - 内页左上角品牌锚「KIMI · 陈权峰」（仅桌面端，点回首页）
 */
import { motion, useScroll, useSpring } from 'framer-motion'
import { usePage } from '../context/PageContext'
import { useUI } from '../data'

const PAGE_NUM = {
  home: '01',
  projects: '02',
  experience: '03',
  strengths: '04',
  contact: '05',
}

export default function PageFrame() {
  const { page, navigate } = usePage()
  const ui = useUI()
  const meta = { num: PAGE_NUM[page] || '01', label: ui.page[page] || ui.page.home }

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {/* 顶部滚动进度发丝线 */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-black/[0.06]">
        <motion.div className="h-full origin-left bg-ink-900" style={{ scaleX: progress }} />
      </div>

      {/* 编辑式内框 + 四角套准标记 */}
      <div className="absolute inset-3 border border-black/[0.08] sm:inset-4">
        <span className="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-black/20" />
        <span className="absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-black/20" />
        <span className="absolute -bottom-px -left-px h-2.5 w-2.5 border-l border-b border-black/20" />
        <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-r border-b border-black/20" />
      </div>

      {/* 右下角页码索引 — 编辑式装订感 */}
      <div className="absolute bottom-5 right-5 text-right sm:bottom-7 sm:right-7">
        <div className="font-display text-[13px] tracking-[0.2em] text-ink-400">
          {meta.num} <span className="text-ink-300">/ 05</span>
        </div>
        <div className="mt-0.5 text-[10px] tracking-[0.3em] text-ink-400">{meta.label}</div>
      </div>
    </div>
  )
}
