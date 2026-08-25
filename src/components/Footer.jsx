/**
 * Footer — 极简版权信息
 *
 * 设计原则：融入页面底部、不抢戏但可读
 * - 底部加极淡的渐变「地面」，让版权行自然收在页面末尾，不再飘在背景上
 * - 文字用 ink-500，比之前的 ink-400 更易读，同时保持克制
 * - 文案随语言切换：中文「用热爱设计与构建」，英文保留英文版式
 */
import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { lang } = useLang()
  const isZh = lang === 'zh'
  return (
    <footer className="relative z-20">
      {/* 底部渐变地面：把 footer 轻轻「坐」进页面背景里 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.04] via-black/[0.02] to-transparent"
      />
      <div className="relative px-6 pb-20 pt-6 text-center text-[10px] font-medium tracking-[0.04em] text-ink-500 md:pb-5 md:text-[11px]">
        {isZh
          ? `© ${year} 陈权峰 · 用热爱设计与构建`
          : `© ${year} Kimi Chen · Designed & built with passion`}
      </div>
    </footer>
  )
}
