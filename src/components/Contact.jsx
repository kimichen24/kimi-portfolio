import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import BackButton from './BackButton'
import MagneticButton from './ui/MagneticButton'
import { primeReveals, buildScrollReveals, prefersReduced } from '../lib/animations'
import PageBackground from './ui/PageBackground'
import { useContent, useUI } from '../data'

/* 社交图标（与「关于我」页一致） */
const SocialGlyph = ({ platform }) => {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' }
  switch (platform) {
    case 'douyin':
      return (
        <svg {...p}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.85a8.27 8.27 0 0 0 4.76 1.5V6.74a4.84 4.84 0 0 1-1-.05z" />
        </svg>
      )
    case 'wechat':
      return (
        <svg {...p}>
          <path d="M8.69 2C4.33 2 .75 5.19.75 9.15c0 2.22 1.1 4.2 2.82 5.54l-.68 2.07 2.41-1.22a8.7 8.7 0 0 0 3.39.68c4.36 0 7.94-3.19 7.94-7.15S12.99 2 8.69 2zm-1.92 9.06c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3.84 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM21.75 14.85c0-3.26-3.08-5.91-6.87-5.91-.43 0-.85.03-1.26.09.23.78.36 1.6.36 2.46 0 4.72-4.19 8.55-9.36 8.55-.38 0-.76-.02-1.13-.07C5.64 22.94 8.47 25 11.81 25c1.18 0 2.3-.26 3.3-.73l2.34 1.19-.66-2.01c1.62-1.23 2.96-3.17 2.96-5.6zm-4.58-.82c-.45 0-.82-.37-.82-.82s.37-.82.82-.82.82.37.82.82-.37.82-.82.82zm3.26 0c-.45 0-.82-.37-.82-.82s.37-.82.82-.82.82.37.82.82-.37.82-.82.82z" />
        </svg>
      )
    case 'qq':
      return (
        <svg {...p}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.19c-.21.65-.86 1.12-1.56 1.12-.18 0-.36-.03-.53-.09-.44-.15-.79-.49-.95-.93-.16-.44-.13-.92.09-1.34.22-.42.6-.73 1.05-.87.45-.14.93-.07 1.34.18.41.25.7.64.81 1.11.11.47.04.96-.25 1.4v.42zm-1.56-4.63c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-6.16 4.63c-.29-.44-.36-.93-.25-1.4.11-.47.4-.86.81-1.11.41-.25.89-.32 1.34-.18.45.14.83.45 1.05.87.22.42.25.9.09 1.34-.16.44-.51.78-.95.93-.17.06-.35.09-.53.09-.7 0-1.35-.47-1.56-1.12v-.42zM8.92 10.55c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM12 17.5c-2.5 0-4.71-1.24-6.09-3.13A8.52 8.52 0 0 1 12 16.5c2.31 0 4.41-.88 6.01-2.31C16.63 16.22 14.44 17.5 12 17.5z" />
        </svg>
      )
    default:
      return null
  }
}

/**
 * 底部联系模块 — 整屏柔白底，大字号极淡水印 + 邮箱复制 + 社交图标组
 */
export default function Contact() {
  const { profile } = useContent()
  const ui = useUI()
  const scope = useRef(null)
  const [copied, setCopied] = useState(false)
  const [copiedSocial, setCopiedSocial] = useState(null)

  useGSAP(
    () => {
      if (prefersReduced()) return
      primeReveals(scope.current)
      buildScrollReveals(scope.current)
    },
    { scope },
  )

  // 复制到剪贴板（带降级方案），并短暂显示「已复制」
  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch (_) {
        /* 忽略：环境不支持复制 */
      }
      document.body.removeChild(ta)
    }
    if (key === 'email') {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } else {
      setCopiedSocial(key)
      setTimeout(() => setCopiedSocial(null), 1800)
    }
  }

  // 仅取有图标的社交账号（微信 / QQ / 抖音），邮箱单独作为主 CTA
  const socials = profile.social.filter((s) => ['wechat', 'qq', 'douyin'].includes(s.icon))

  return (
    <section
      id="contact"
      ref={scope}
      className="relative flex min-h-screen w-full overflow-hidden flex-col items-start justify-center px-6 pt-32 pb-20 text-left text-ink-900 md:pt-36 md:pb-24"
    >
      <BackButton />

      {/* 联系页背景 — 全站统一的纯黑背景 */}
      <PageBackground />

      {/* 大字号极淡水印 — 强化「联系」语义，克制不抢戏 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center md:flex"
      >
        <span className="select-none whitespace-nowrap font-display text-[15vw] font-bold leading-none tracking-tightest text-ink-900/[0.05]">
          {ui.contact.letsTalk}
        </span>
      </div>

      <div
        data-reveal-block
        className="relative z-10 flex max-w-3xl flex-col items-start"
      >
        <span className="eyebrow mb-4 inline-block">{ui.contact.eyebrow}</span>

        <h2
          data-reveal="title"
          className="h-display text-4xl font-bold tracking-tight text-ink-900 md:text-5xl lg:text-6xl"
        >
          {ui.contact.title}
        </h2>

        <p
          data-reveal-item
          className="mt-4 max-w-lg text-left text-[14px] leading-relaxed text-ink-500 md:text-base"
        >
          {ui.contact.desc}
        </p>

        {/* 邮箱 — 大号显示，点击复制（同时唤起邮件客户端） */}
        <div data-reveal-item>
        <MagneticButton
          as="a"
          href={`mailto:${profile.email}`}
          onClick={() => copyText(profile.email, 'email')}
          aria-label={`复制邮箱 ${profile.email}`}
          className="group relative mt-14 inline-flex items-center gap-3 rounded-full border border-black/[0.10] bg-black/[0.04] px-8 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-black/20 hover:bg-black/[0.08]"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink-500 transition-colors duration-300 group-hover:text-ink-900"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
          <span className="font-display text-lg font-medium tracking-tight md:text-xl">
            {profile.email}
          </span>

          {/* 「已复制」微提示 */}
          <span
            className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-full bg-black/[0.08] px-3 py-1 text-[11px] font-medium text-ink-900 transition-all duration-300 ${
              copied ? 'opacity-100 translate-y-0' : 'opacity-0'
            }`}
          >
            {ui.contact.copied}
          </span>
        </MagneticButton>
        </div>

        {/* 社交图标组 — 点击复制对应账号（进入视口依次轻弹入） */}
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {socials.map((s) => (
            <motion.button
              key={s.platform}
              type="button"
              onClick={() => copyText(s.handle, s.platform)}
              aria-label={`复制${s.platform}账号 ${s.handle}`}
              variants={{
                hidden: { opacity: 0, y: 14, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group/s relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.10] bg-black/[0.04] text-ink-500 transition-all duration-300 hover:border-black/20 hover:bg-black/[0.08] hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            >
              <SocialGlyph platform={s.icon} />

              {/* 「已复制」微提示 */}
              <span
                className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-full bg-black/[0.08] px-2.5 py-1 text-[10px] font-medium text-ink-900 transition-all duration-300 ${
                  copiedSocial === s.platform ? 'translate-y-0 opacity-100' : 'opacity-0'
                }`}
              >
                {ui.contact.copied}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* 元信息 — 去掉 Status，只保留身份与方向 */}
        <div
          data-reveal-item
          className="mt-16 flex items-center gap-3 text-left"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {profile.name}
          </span>
          <span className="h-3 w-px bg-black/20" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {profile.role}
          </span>
        </div>
      </div>
    </section>
  )
}
