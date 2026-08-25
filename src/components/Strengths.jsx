import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import BackButton from './BackButton'
import PageBackground from './ui/PageBackground'
import { primeReveals, buildStrengthsReveals, prefersReduced } from '../lib/animations'
import { useContent, useUI } from '../data'

/* ── 软件工具图标（内联 SVG） ── */
const ToolIcons = {
  ai: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  excel: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <rect x="3" y="3" width="18" height="18" rx="3" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/>
      <path d="M7 8h10M7 12h10M7 16h6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="14" y="14" width="4" height="4" rx="1" fill={c} opacity="0.35"/>
    </svg>
  ),
  sql: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <ellipse cx="12" cy="6" rx="8" ry="3" fill={c} opacity="0.18" stroke={c} strokeWidth="1.5"/>
      <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="none" stroke={c} strokeWidth="1.5"/>
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" fill="none" stroke={c} strokeWidth="1.5" opacity="0.55"/>
    </svg>
  ),
  figma: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <path d="M12 3a3 3 0 0 0 0 6h3a3 3 0 0 1 0 6h-3a3 3 0 0 1 0-6V3z" fill={c} opacity="0.85"/>
      <path d="M12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill={c} opacity="0.45"/>
      <circle cx="12" cy="12" r="1.5" fill={c}/>
    </svg>
  ),
  modao: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <rect x="3" y="4" width="9" height="7" rx="2" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/>
      <rect x="12" y="13" width="9" height="7" rx="2" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/>
      <path d="M7.5 11v2c0 1.2 1.5 1.2 1.5 2.5v0.5" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <circle cx="7.5" cy="11" r="1.7" fill={c}/>
    </svg>
  ),
  canva: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <path d="M12 3l2.3 6.3L20.5 9.6l-4.9 3.9 1.7 6.5L12 16.3 6.7 20l1.7-6.5L3.5 9.6l6.2-.3L12 3z" fill={c} opacity="0.82"/>
    </svg>
  ),
  jianying: (c) => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill={c}>
      <rect x="3" y="6" width="18" height="12" rx="3" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/>
      <path d="M10.5 10v4l4-2-4-2z" fill={c} opacity="0.88"/>
    </svg>
  ),
}

/* ── 技能图标映射 ── */
const SkillIcon = ({ type, color }) => {
  const s = { width: 40, height: 40, viewBox: '0 0 48 48' }
  switch (type) {
    case 'pen':
      return <svg {...s}><rect x="10" y="14" width="28" height="22" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/><path d="M18 22h12M18 28h8" stroke={color} strokeWidth="2" strokeLinecap="round"/></svg>
    case 'chart':
      return <svg {...s}><rect x="12" y="10" width="24" height="28" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/><path d="M18 30V20M24 30V16M30 30V24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>
    case 'people':
      return <svg {...s}><circle cx="24" cy="18" r="7" fill={color} opacity="0.2" stroke={color} strokeWidth="2"/><path d="M13 38c0-5 4.5-9 11-9s11 4 11 9" stroke={color} strokeWidth="2" strokeLinecap="round" fill={color} opacity="0.08"/></svg>
    case 'spark':
      return <svg {...s}><path d="M24 8l3 8h8l-6.5 5 2.5 8-7-5.5L17 29l2.5-8L13 16h8l3-8z" fill={color} opacity="0.85"/><path d="M36 20l1.5 4H42l-3.5 2.5L39.5 31 36 28.5 32.5 31l1.5-4.5L30.5 24h4.5L36 20z" fill={color} opacity="0.4"/></svg>
    case 'product':
      return <svg {...s}><circle cx="24" cy="24" r="14" fill={color} opacity="0.12" stroke={color} strokeWidth="2"/><circle cx="24" cy="24" r="7" fill={color} opacity="0.26" stroke={color} strokeWidth="2"/><circle cx="24" cy="24" r="2.5" fill={color}/></svg>
    case 'project':
      return <svg {...s}><rect x="8" y="12" width="9" height="24" rx="2.5" fill={color} opacity="0.16" stroke={color} strokeWidth="2"/><rect x="19.5" y="16" width="9" height="20" rx="2.5" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/><rect x="31" y="10" width="9" height="26" rx="2.5" fill={color} opacity="0.12" stroke={color} strokeWidth="2"/></svg>
    default:
      return null
  }
}

/* ── 单张技能卡（两个分组复用） ── */
function SkillCard({ skill }) {
  return (
    <div
      data-reveal-item
      className="card-apple group flex gap-4 p-7 transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: skill.color + '14' }}
      >
        <SkillIcon type={skill.icon} color={skill.color} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-semibold tracking-tight text-ink-900 sm:text-[17px]">
          {skill.title}
        </h3>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-500">
          {skill.titleEn}
        </p>
        <p className="mt-2.5 text-[13px] leading-[1.65] text-ink-600">
          {skill.desc}
        </p>
      </div>
    </div>
  )
}

/* ── 社交图标 ── */
const SocialIcon = ({ platform }) => {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' }
  switch (platform) {
    case 'douyin':
      return <svg {...p}><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.85a8.27 8.27 0 0 0 4.76 1.5V6.74a4.84 4.84 0 0 1-1-.05z"/></svg>
    case 'wechat':
      return <svg {...p}><path d="M8.69 2C4.33 2 .75 5.19.75 9.15c0 2.22 1.1 4.2 2.82 5.54l-.68 2.07 2.41-1.22a8.7 8.7 0 0 0 3.39.68c4.36 0 7.94-3.19 7.94-7.15S12.99 2 8.69 2zm-1.92 9.06c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3.84 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM21.75 14.85c0-3.26-3.08-5.91-6.87-5.91-.43 0-.85.03-1.26.09.23.78.36 1.6.36 2.46 0 4.72-4.19 8.55-9.36 8.55-.38 0-.76-.02-1.13-.07C5.64 22.94 8.47 25 11.81 25c1.18 0 2.3-.26 3.3-.73l2.34 1.19-.66-2.01c1.62-1.23 2.96-3.17 2.96-5.6zm-4.58-.82c-.45 0-.82-.37-.82-.82s.37-.82.82-.82.82.37.82.82-.37.82-.82.82zm3.26 0c-.45 0-.82-.37-.82-.82s.37-.82.82-.82.82.37.82.82-.37.82-.82.82z"/></svg>
    case 'qq':
      return <svg {...p}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 13.19c-.21.65-.86 1.12-1.56 1.12-.18 0-.36-.03-.53-.09-.44-.15-.79-.49-.95-.93-.16-.44-.13-.92.09-1.34.22-.42.6-.73 1.05-.87.45-.14.93-.07 1.34.18.41.25.7.64.81 1.11.11.47.04.96-.25 1.4v.42zm-1.56-4.63c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-6.16 4.63c-.29-.44-.36-.93-.25-1.4.11-.47.4-.86.81-1.11.41-.25.89-.32 1.34-.18.45.14.83.45 1.05.87.22.42.25.9.09 1.34-.16.44-.51.78-.95.93-.17.06-.35.09-.53.09-.7 0-1.35-.47-1.56-1.12v-.42zM8.92 10.55c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM12 17.5c-2.5 0-4.71-1.24-6.09-3.13A8.52 8.52 0 0 1 12 16.5c2.31 0 4.41-.88 6.01-2.31C16.63 16.22 14.44 17.5 12 17.5z"/></svg>
    case 'mail':
      return <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2.4" /><path d="M2.5 7l9.5 6.5L21.5 7" /></svg>
    default:
      return null
  }
}

/* ==========================================================================
   可复用组件
   ========================================================================== */

/** 区块标题 — "标题 & English" 格式，滚动强进场（遮罩揭开 + 压缩归位） */
function SectionHeading({ children, eyebrow, className = '' }) {
  return (
    <div className={`mb-10 ${className}`}>
      {eyebrow && (
        <div className="mb-3 font-display text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
          {eyebrow}
        </div>
      )}
      <h2
        data-reveal="title"
        className="font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl"
      >
        {children}
      </h2>
    </div>
  )
}

/* ── 可翻转的联系卡片：点击绕 Y 轴丝滑翻转 + 轻微放大「弹出」，露出二维码 ── */
function FlipContactCard({ platform, platformLabel, handle, qr, accent }) {
  const ui = useUI()
  const [flipped, setFlipped] = useState(false)
  return (
    <div data-reveal-item className="[perspective:1400px]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? `${ui.strengths.flipBack} ${platformLabel}` : `${ui.strengths.flipFront} ${platformLabel}`}
        className="flip-inner group relative block h-[172px] w-full cursor-pointer rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.16),0_16px_36px_-16px_rgba(0,0,0,0.30)]"
        style={{
          transform: flipped ? 'rotateY(180deg) scale(1.04)' : 'rotateY(0deg) scale(1)',
        }}
      >
        {/* 正面：图标 + 账号 */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[14px] border border-black/[0.10] bg-black/[0.04] p-7 text-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] transition-colors duration-300 group-hover:border-black/20">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ color: accent, backgroundColor: accent + '14' }}
          >
            <SocialIcon platform={platform} />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            {platformLabel}
          </span>
          <span className="text-[14px] font-medium text-ink-700">{handle}</span>
          <span className="mt-1 text-[11px] text-ink-500">{ui.strengths.flipFront}</span>
        </span>

        {/* 背面：二维码 */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-[14px] border border-black/[0.10] bg-black/[0.04] p-5 text-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] [-webkit-transform:rotateY(180deg)] group-hover:border-black/20">
          <img
            src={qr}
            alt={platform === 'wechat' ? '扫码添加 Kimi 的微信' : '扫码添加 Kimi 的 QQ'}
            decoding="async"
            className="h-[92px] w-[92px] rounded-lg object-contain ring-1 ring-black/10"
          />
          <span className="text-[12px] text-ink-500">{ui.strengths.flipBack} {platformLabel}</span>
        </span>
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   关于我页面 — 苹果级重制版
   布局：Profile Hero → 软件工具 → 技能卡片 → 联系双卡
   ═══════════════════════════════════════════════════════════════ */

export default function Strengths() {
  const { profile, strengths, softwareTools } = useContent()
  const ui = useUI()
  const scope = useRef(null)

  useGSAP(
    () => {
      if (prefersReduced()) return
      primeReveals(scope.current)
      buildStrengthsReveals(scope.current)
    },
    { scope },
  )

  return (
    <section
      id="strengths"
      ref={scope}
      className="relative w-full pb-20 pt-32 md:pb-24 md:pt-36"
    >
      <BackButton />

      {/* 关于我页背景 — 全站统一的纯黑背景 */}
      <PageBackground />

      {/* 页级标签 — 轻量，不做居中大标题仪式 */}
      <div className="container-page mb-8 md:mb-12">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-500" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {ui.strengths.about}
          </span>
          <span className="h-px flex-1 bg-ink-300" />
        </div>
      </div>

      {/* ══════════ Profile Hero — 干净白卡 ══════════ */}
      <div data-reveal-block className="container-page">
        <div data-reveal-item data-st="profile">
          <div className="card-apple overflow-hidden rounded-[26px]">
            <div className="flex flex-col gap-8 sm:flex-row sm:gap-10 lg:gap-14 p-8 sm:p-10 lg:p-14">
              {/* ── 左侧头像（KIMI 四字英文 wordmark 取代 3D 头像） ── */}
              <div className="relative mx-auto shrink-0 sm:mx-0">
                <div className="group relative flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-[22px] bg-ink-100 sm:h-[240px] sm:w-[240px]">
                  <span className="font-display text-[64px] font-semibold leading-none tracking-tight text-ink-900 drop-shadow-[0_2px_24px_rgba(0,0,0,0.08)] sm:text-[78px]">
                    KIMI
                  </span>
                  <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-black/10 transition-all duration-500 group-hover:ring-black/25" />
                </div>

                {/* 状态标签 + GitHub — 头像下方 */}
                <div className="mt-4 flex flex-col items-center gap-2.5 sm:items-start">
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/20 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-black/50" />
                    </span>
                    <span className="text-xs font-medium tracking-wide text-ink-600">{ui.strengths.openTo}</span>
                  </div>

                  <a
                    href="https://github.com/kimichen24"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ui.strengths.githubAria}
                    className="group/github inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-ink-700 transition-all duration-300 hover:border-black/20 hover:bg-black/[0.06] hover:text-ink-900"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    <span>@kimichen24</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 transition-all duration-300 group-hover/github:translate-x-0.5 group-hover/github:-translate-y-0.5 group-hover/github:opacity-80" aria-hidden="true">
                      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* ── 右侧信息（玻璃底上，清晰可读） ── */}
              <div className="flex-1 min-w-0 text-center sm:text-left pt-2 sm:pt-4">
                {/* 中文名 */}
                <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                  {profile.name}
                </h1>

                {/* 英文名 */}
                <p className="mt-1.5 font-display text-base font-medium tracking-wide text-ink-700 sm:text-lg lg:text-xl">
                  {profile.englishName}
                </p>

                {/* 分隔线 */}
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

                {/* 信息网格：学校 | 所在地 | 荣誉 */}
                <div className="mt-5 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
                  {/* 学校 */}
                  <div className="flex items-center gap-2">
                    <svg className="h-[16px] w-[16px] shrink-0 text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                    <span className="text-[14px] leading-relaxed text-ink-700">{profile.school}</span>
                  </div>

                  {/* 所在地 */}
                  <div className="flex items-center gap-2">
                    <svg className="h-[16px] w-[16px] shrink-0 text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-[14px] leading-relaxed text-ink-700">{profile.location}</span>
                  </div>

                  {/* 荣誉 — 跨两列 */}
                  <div className="col-span-1 sm:col-span-2 flex flex-wrap items-center gap-2 mt-1">
                    {profile.honors.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-black/[0.04] px-3 py-1 text-xs font-medium text-ink-700"
                        >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="9" r="6" />
                          <path d="M9 14l-2 7 5-3 5 3-2-7" />
                        </svg>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 自我介绍 */}
                <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.6] text-ink-700 sm:text-[15px]">
                  {profile.bioLine}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ 工具栈 — 干净标签条 ══════════ */}
      <div data-reveal-block className="container-page mt-20 md:mt-28">
        <div className="mb-6 flex items-center justify-start gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {ui.strengths.tools}
          </span>
          <span className="h-px flex-1 max-w-[28px] bg-black/15" />
        </div>

        {/* 药丸标签条 — icon + name，极轻量（进入视口 stagger 弹入） */}
        <motion.div
          className="flex flex-wrap gap-2.5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
        >
          {softwareTools.map((tool) => {
            const IconRender = ToolIcons[tool.icon]
            return (
              <motion.span
                key={tool.name}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.10] bg-black/[0.04] px-3.5 py-2 transition-colors duration-200 hover:border-black/20 hover:bg-black/[0.08]"
              >
                <span className="flex h-5 w-5 items-center justify-center" style={{ color: tool.color }}>
                  {IconRender ? IconRender(tool.color) : null}
                </span>
                <span className="whitespace-nowrap text-[13px] font-medium text-ink-700">
                  {tool.name}
                </span>
              </motion.span>
            )
          })}
        </motion.div>
      </div>

      {/* ══════════ 核心能力 — 干净白卡网格 ══════════ */}
      <div data-reveal-block className="container-page mt-24 md:mt-32">
        <div
          data-st="skills-title"
          className="mb-10 flex items-center justify-start gap-4"
        >
          <span className="h-px w-12 bg-black/15" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {ui.strengths.skills}
          </span>
          <span className="h-px w-12 bg-black/15" />
        </div>

        {/* 分组一：核心能力（前 3 张） */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {ui.strengths.core}
          </span>
          <span className="h-px flex-1 max-w-[40px] bg-black/15" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.slice(0, 3).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {/* 分组二：产品 · 协同（后 3 张） */}
        <div className="mb-4 mt-10 flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {ui.strengths.build}
          </span>
          <span className="h-px flex-1 max-w-[40px] bg-black/15" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.slice(3).map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>

      {/* ══════════ 联系方式 — 三张图标卡片 ══════════ */}
      <div data-reveal-block data-st="contact-block" className="container-page mt-24 md:mt-32">
        {/* 小标题 */}
        <div data-reveal="fade" data-st="contact-badge" className="mb-8">
          <span className="inline-flex items-center rounded-full border border-black/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
            {ui.strengths.contact}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* ── 微信（点击翻转露出二维码） ── */}
          <FlipContactCard
            platform="wechat"
            platformLabel="WeChat"
            handle={profile.social.find((s) => s.platform === '微信')?.handle}
            qr="images/wechat-qr.jpg"
            accent="#ffffff"
          />

          {/* ── 邮箱（点击发信） ── */}
          <div data-reveal-item>
            <a
              href={`mailto:${profile.email}`}
              aria-label={`发送邮件至 ${profile.email}`}
              className="group relative flex h-[172px] w-full flex-col items-center justify-center gap-3 rounded-[14px] border border-black/[0.10] bg-black/[0.04] p-7 text-center transition-colors duration-300 hover:border-black/20 hover:bg-black/[0.08]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-ink-900"
                style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
              >
                <SocialIcon platform="mail" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">Email</span>
              <span className="text-[14px] font-medium text-ink-700">{profile.email}</span>
              <span className="mt-1 text-[11px] text-ink-500">{ui.strengths.emailHint}</span>
            </a>
          </div>

          {/* ── QQ（点击翻转露出二维码） ── */}
          <FlipContactCard
            platform="qq"
            platformLabel="QQ"
            handle={profile.social.find((s) => s.platform === 'QQ')?.handle}
            qr="images/qq-qr.jpg"
            accent="#ffffff"
          />
        </div>
      </div>
    </section>
  )
}
