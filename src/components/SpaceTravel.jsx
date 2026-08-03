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
      {/* 设计语言：柔白层次底 + 深色字母标 + 极细黑色进度线 + opacity 溶解淡出
          与全站「柔白底 + 纯黑弯曲带」同源，淡出时黑白对比自然过渡到正文页面 */}
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

      {/* 极细基线参考线 — 极克制，强化排版秩序感（编辑式网格） */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[12]">
        <div className="absolute top-0 bottom-0 left-[10%] w-px bg-black/[0.035]" />
        <div className="absolute top-0 bottom-0 right-[10%] w-px bg-black/[0.035]" />
      </div>

      {/* 文案可读性衬底 — 定向柔化，替代逐字发光（发光在浅底上会读成"脏阴影"） */}
      {/* 只在左下主张区 / 左上 logo 区做极淡的雾化，右侧与中部完全留给弯曲带 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: [
            'radial-gradient(118% 76% at 4% 106%, rgba(236,238,241,0.97) 0%, rgba(236,238,241,0.70) 32%, rgba(236,238,241,0) 68%)',
            'radial-gradient(42% 40% at 2% -4%, rgba(236,238,241,0.92) 0%, rgba(236,238,241,0) 74%)',
          ].join(', '),
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

      {/* 顶部栏：左上 logo（药丸导航由 App.jsx 全局提供） */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-start justify-start p-6 pt-20 md:p-10 md:pt-12 lg:p-12 lg:pt-14">
        <button
          type="button"
          onClick={() => navigate('home')}
          data-hero="logo"
          className="group inline-flex items-baseline gap-3 transition-[gap] duration-300 ease-out hover:gap-3.5"
        >
          <span className="text-xl font-semibold tracking-tight text-ink-900 transition-transform duration-300 ease-out group-hover:-translate-y-px sm:text-2xl md:text-[1.7rem]">
            陈权峰
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-ink-500 transition-all duration-300 ease-out group-hover:translate-y-px group-hover:text-ink-700 sm:text-xs md:text-sm">
            Kimi
          </span>
        </button>
      </div>

      {/* 底部栏：左下 slogan + 右下 tagline */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-start justify-end gap-10 p-6 pb-16 md:flex-row md:items-end md:justify-between md:gap-12 md:p-10 md:pb-14 lg:p-12 lg:pb-16">
        {/* 左下 — Slogan + 副标题 */}
        <div className="max-w-2xl">
          {/* 细标 — 发丝线 + 方向定位 */}
          <div data-hero="sub" className="mb-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-ink-900/20 sm:w-10" />
            <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-ink-500 sm:text-[11px]">
              {profile.role}
            </span>
          </div>

          <h1
            data-hero="title"
            className="font-display text-[clamp(2rem,4.6vw,4rem)] font-medium leading-[1.02] tracking-tightest text-ink-900"
          >
            Fake it till you make it<span className="text-ink-900">.</span>
          </h1>

          {/* 动态下划线 — 开场动画收尾：从 0 展开到 100% */}
          <div
            data-hero="underline"
            className="mt-5 h-px w-full max-w-[180px] origin-left rounded-full bg-ink-900/40"
          />

          <p
            data-hero="sub"
            className="mt-6 max-w-md text-[13px] leading-[1.85] text-ink-600 md:text-sm"
          >
            构建产品 · 探索技术 · 分享思考
            <br className="hidden md:block" />
            用代码把想法变成现实，一个项目一个脚印。
          </p>
        </div>

        {/* 右下 — 定位信息（md+ 才出现，给左侧主张留足呼吸） */}
        <div
          data-hero="sub"
          className="hidden shrink-0 flex-col items-end gap-1.5 text-right md:flex"
        >
          <span className="text-[9px] font-medium uppercase tracking-[0.42em] text-ink-400/70">
            Based in
          </span>
          <span className="text-[13px] font-medium text-ink-800">{profile.location}</span>
          <span className="text-[12px] text-ink-500">{profile.school}</span>
        </div>
      </div>

      {/* 底部居中滚动指示 — 经典作品集符号，给首屏一个"向下"的暗示 */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-ink-400/60">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-ink-900/10">
          <div className="h-3 w-full bg-ink-900/45 animate-scroll-line" />
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