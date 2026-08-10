import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import './SpaceTravel.css'
import { Icon } from './ui/Icon'
import PageBackground from './ui/PageBackground'
import { usePage } from '../context/PageContext'
import { profile } from '../data/content'
import { buildHeroOpening, prefersReduced, hasOpeningPlayed, markOpeningPlayed } from '../lib/animations'

/* ==========================================================================
   FadingVideo — 自定义 rAF 驱动 crossfade
   - 无 CSS transition，纯 requestAnimationFrame
   - 手动循环：检测到 duration - currentTime ≤ 0.55s 时淡出，ended 后 100ms 重置
   ========================================================================== */
function FadingVideo({ src, containerClassName, videoClassName, videoStyle }) {
  const videoRef = useRef(null)
  const rafRef = useRef(0)
  const fadingOutRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const FADE_MS = 500
    const FADE_OUT_LEAD = 0.55 // seconds before end

    const fadeTo = (target, duration) => {
      cancelAnimationFrame(rafRef.current)
      const start = performance.now()
      // 从当前实际 opacity 起步（即便上一次 fade 被中断）
      const initial = parseFloat(video.style.opacity || '0')
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
        video.style.opacity = String(initial + (target - initial) * eased)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const onLoaded = () => {
      video.style.opacity = '0'
      video.play().catch(() => {})
      fadeTo(1, FADE_MS)
    }

    const onTimeUpdate = () => {
      if (fadingOutRef.current) return
      const remaining = video.duration - video.currentTime
      if (remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true
        fadeTo(0, FADE_OUT_LEAD * 1000)
      }
    }

    const onEnded = () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        fadingOutRef.current = false
        video.play().catch(() => {})
        fadeTo(1, FADE_MS)
      }, 100)
    }

    video.addEventListener('loadeddata', onLoaded)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('loadeddata', onLoaded)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={videoClassName}
      style={{ opacity: 0, ...videoStyle }}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

/* ==========================================================================
   内联 SVG 图标
   ========================================================================== */
const IconArrowUpRight = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
)

const IconPlay = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <polygon points="6 4 20 12 6 20 6 4" />
  </svg>
)

const IconClock = (props) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const IconGlobe = (props) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18" />
    <path d="M12 3a14 14 0 0 0 0 18" />
  </svg>
)

const IconArrowRight = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
)

/* ==========================================================================
   Section 1 — Hero（视频背景 + 中文四宫格覆盖层）
   ========================================================================== */

// GlassIcons 数据 — 3 个简洁图标：作品集 / 经历 / 关于我
// 极简变体：背板透明，只留图标 + 轻微玻璃前面
function SpaceTravelHero() {
  const { navigate } = usePage()
  const scope = useRef(null)

  useGSAP(
    () => {
      const curtain = scope.current?.querySelector('[data-hero="curtain"]')

      // 已播放过开场（例如从项目/经历页切回首页）→ 直接隐藏幕布，不重复加载页，导航保持可见
      if (hasOpeningPlayed()) {
        if (curtain) curtain.style.display = 'none'
        document.body.removeAttribute('data-loading')
        return
      }

      // 首次进入网站：Apple 风格开场 + 加载期间隐藏导航栏
      document.body.setAttribute('data-loading', 'true')
      if (prefersReduced()) {
        // 减弱动效模式：直接移除覆盖层，不播放动画
        if (curtain) { curtain.style.display = 'none' }
        document.body.removeAttribute('data-loading')
        markOpeningPlayed()
        return
      }
      buildHeroOpening(scope.current)

      // 安全网：若开场被打断（中途离开首页），确保导航栏恢复
      return () => {
        document.body.removeAttribute('data-loading')
      }
    },
    { scope },
  )

  return (
    <section ref={scope} className="relative h-screen w-full overflow-hidden">
      {/* 首页背景 — 全站统一的柔白底 + 纯黑弯曲带 */}
      <PageBackground />

      {/* ═══ 加载覆盖层（黑白映衬 · 极简风格） ═══ */}
      <div
        data-hero="curtain"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center"
        style={{
          background:
            'radial-gradient(ellipse at 50% 32%, #f4f5f7 0%, transparent 62%), linear-gradient(180deg, #f3f4f6 0%, #e6e8eb 100%)',
        }}
      >
        {/* 字母标 — 大 K，极低透明度，营造空间感 */}
        <span
          data-hero="mark"
          className="font-display text-[72px] font-extralight leading-none tracking-[0.08em] text-ink-900/20 sm:text-[96px] lg:text-[120px]"
        >
          K
        </span>

        {/* 名字 — 紧凑 tracking */}
        <span
          data-hero="name"
          className="mt-5 font-display text-[11px] font-medium uppercase tracking-[0.5em] text-ink-500 sm:text-xs sm:tracking-[0.55em]"
        >
          陈权峰 · Kimi Chen
        </span>

        {/* 极细加载线 — 底部居中，Apple 风格 */}
        <div
          data-hero="loader"
          className="absolute bottom-16 left-1/2 h-[1px] w-32 -translate-x-1/2 overflow-hidden sm:bottom-20 sm:w-40"
        >
          <div
            className="h-full w-full origin-left"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)',
            }}
          />
        </div>
      </div>

      {/* 中心文案可读性衬底 — 克制柔化，避免纯黑弯曲带穿过标题时对比不足
          Apple HIG：玻璃质感只用于浮层；这里用极淡的实心径向渐变保证可读性 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 48%, rgba(236,238,241,0.92) 0%, rgba(236,238,241,0.55) 45%, rgba(236,238,241,0) 72%)',
        }}
      />

      {/* 极淡颗粒层 — 柔白底去"塑料感"，增加纸质感 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15] opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═══ Apple HIG 风格主视觉 — 一个视口一个焦点 ═══ */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6">
        {/* Eyebrow：角色定位 */}
        <span
          data-hero="sub"
          className="mb-6 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-500 sm:mb-8 sm:text-xs sm:tracking-[0.32em]"
        >
          {profile.role}
        </span>

        {/* 主标题 — 超大字号、紧凑行距、视觉焦点 */}
        <h1
          data-hero="title"
          className="max-w-5xl text-center font-display text-[clamp(2.6rem,10vw,7rem)] font-semibold leading-[0.98] tracking-tight text-ink-900"
        >
          Fake it till
          <br className="hidden sm:block" /> you make it
          <span className="text-ink-900/50">.</span>
        </h1>

        {/* 副标题 — 呼吸充足、可读 */}
        <p
          data-hero="sub"
          className="mt-8 max-w-md text-center text-[15px] leading-[1.75] text-ink-600 sm:mt-10 sm:max-w-lg sm:text-base"
        >
          {profile.tagline}
        </p>

        {/* CTA 组 — 主按钮 + 文字链，比例圆角、柔和阴影 */}
        <div data-hero="sub" className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:gap-5">
          <button
            type="button"
            onClick={() => navigate('projects')}
            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-black hover:shadow-[0_8px_28px_rgba(0,0,0,0.22)] active:scale-[0.98]"
          >
            查看作品
            <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => navigate('contact')}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 transition-colors duration-300 hover:text-ink-600"
          >
            联系我
            <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* 底部署名 + 滚动指示 — 居中、极简 */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-10 sm:pb-12">
        <span
          data-hero="sub"
          className="text-[11px] font-medium tracking-[0.18em] text-ink-600 sm:text-xs"
        >
          陈权峰 · Kimi Chen
        </span>
        <span
          data-hero="sub"
          className="mt-1 text-[10px] tracking-[0.12em] text-ink-500 sm:text-[11px]"
        >
          {profile.location}
        </span>

        <div data-hero="sub" className="mt-7 flex flex-col items-center gap-2">
          <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink-400">
            Scroll
          </span>
          <div className="relative h-10 w-px overflow-hidden bg-ink-900/15">
            <div className="h-3 w-full bg-ink-900/55 animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   SpaceTravel — 主组件
   ========================================================================== */
export default function SpaceTravel() {
  // 抑制 Framer Motion 在 dev 模式下无害的 list key 警告
  useEffect(() => {
    if (import.meta.env.DEV) {
      const origError = console.error
      console.error = (...args) => {
        const msg = String(args[0] || '')
        if (
          msg.includes('Each child in a list should have a unique "key" prop') ||
          msg.includes('unique "key"')
        )
          return
        origError.apply(console, args)
      }
      return () => {
        console.error = origError
      }
    }
  }, [])

  return (
    <div id="home" className="w-full">
      <SpaceTravelHero />
    </div>
  )
}