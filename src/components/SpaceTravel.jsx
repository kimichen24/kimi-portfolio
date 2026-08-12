import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import './SpaceTravel.css'
import { Icon } from './ui/Icon'
import { usePage } from '../context/PageContext'
import { useContent, useUI } from '../data'
import { buildHeroOpening, prefersReduced, hasOpeningPlayed, markOpeningPlayed, primeReveals, buildScrollReveals } from '../lib/animations'

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

/* Hero 可点文字的文案与解码字符集 */
const HERO_SLOGANS = [
  'Fake it till you make it.',
  '好内容，是改出来的。',
  '先做完，再做好。',
  '让数据替你说话。',
]
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*@'

/* ==========================================================================
   Section 1 — Hero（视频背景 + 中文四宫格覆盖层）
   ========================================================================== */

// GlassIcons 数据 — 3 个简洁图标：作品集 / 经历 / 关于我
// 极简变体：背板透明，只留图标 + 轻微玻璃前面
function SpaceTravelHero() {
  const { navigate } = usePage()
  const { profile } = useContent()
  const ui = useUI()
  const scope = useRef(null)
  const heroContentRef = useRef(null)

  // ── Hero 文字点击反馈：KIMI 解码 + slogan 轮播 + 全局按压 ──
  const [kimiText, setKimiText] = useState('KIMI')
  const [sloganIdx, setSloganIdx] = useState(0)
  const [sloganBlurring, setSloganBlurring] = useState(false)
  const kimiTimer = useRef(null)
  const sloganTimer = useRef(null)

  const runDecode = () => {
    if (prefersReduced()) return
    const target = 'KIMI'
    let frame = 0
    const total = 14
    if (kimiTimer.current) clearInterval(kimiTimer.current)
    kimiTimer.current = setInterval(() => {
      frame += 1
      const reveal = Math.floor((frame / total) * target.length)
      let out = ''
      for (let i = 0; i < target.length; i++) {
        out +=
          i < reveal
            ? target[i]
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setKimiText(out)
      if (frame >= total) {
        clearInterval(kimiTimer.current)
        kimiTimer.current = null
        setKimiText(target)
      }
    }, 28)
  }

  const cycleSlogan = () => {
    const next = (sloganIdx + 1) % HERO_SLOGANS.length
    if (prefersReduced()) {
      setSloganIdx(next)
      return
    }
    setSloganBlurring(true)
    if (sloganTimer.current) clearTimeout(sloganTimer.current)
    sloganTimer.current = setTimeout(() => {
      setSloganIdx(next)
      setSloganBlurring(false)
      sloganTimer.current = null
    }, 170)
  }

  // 滚动叙事钩子：开场后淡入、向下滚动即隐藏
  const [cueShown, setCueShown] = useState(false)
  const [cueHidden, setCueHidden] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setCueShown(true), 1300)
    const onScroll = () => setCueHidden(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
      if (kimiTimer.current) clearInterval(kimiTimer.current)
      if (sloganTimer.current) clearTimeout(sloganTimer.current)
    }
  }, [])

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

  // hero 滚动视差 + 模糊聚焦（苹果风，与 Lenis 平滑滚动同步）
  useGSAP(
    () => {
      const el = heroContentRef.current
      if (!el || prefersReduced()) return
      const title = el.querySelector('[data-hero="title"]')
      // 内容随滚动轻微下飘 + 淡出（视差滞后感）
      gsap.to(el, {
        yPercent: 16,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      // 标题单独做模糊聚焦：离场时失焦，苹果式 dissolve
      if (title) {
        gsap.to(title, {
          filter: 'blur(14px)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    },
    { scope },
  )

  return (
      <section ref={scope} className="relative h-screen w-full overflow-hidden bg-white">
      {/* 首页背景 — 纯白 */}

      {/* ═══ 加载覆盖层（浅 Apple 风 · 极简风格） ═══ */}
      <div
        data-hero="curtain"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center"
        style={{
          background:
            'radial-gradient(ellipse at 50% 32%, #ffffff 0%, transparent 62%), linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
        }}
      >
        {/* 字母标 — 大 K，极低透明度，营造空间感 */}
        <span
          data-hero="mark"
          className="font-display text-[72px] font-extralight leading-none tracking-[0.08em] text-ink-900/10 sm:text-[96px] lg:text-[120px]"
        >
          K
        </span>

        {/* 名字 — 紧凑 tracking */}
        <span
          data-hero="name"
          className="mt-5 font-display text-[11px] font-medium uppercase tracking-[0.5em] text-ink-500 sm:text-xs sm:tracking-[0.55em]"
        >
          {profile.name} · {profile.englishName}
        </span>

        {/* 极细加载线 — 底部居中，Apple 风格 */}
        <div
          data-hero="loader"
          className="absolute bottom-16 left-1/2 h-[1px] w-32 -translate-x-1/2 overflow-hidden sm:bottom-20 sm:w-40"
        >
          <div
            className="h-full w-full origin-left"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.35), transparent)',
            }}
          />
        </div>
      </div>

      {/* ═══ 极简 typographic hero — 纯黑底 + 巨大字标，左对齐编辑式排版 ═══ */}
      <div
        ref={heroContentRef}
        className="absolute inset-0 z-30 flex flex-col items-start justify-center px-6 will-change-transform sm:px-12 lg:px-20"
      >
        {/* 编辑式眉标 — 一句话点明站点属性 */}
        <span
          data-hero="sub"
          className="mb-5 text-[11px] font-medium uppercase tracking-[0.4em] text-ink-500 sm:mb-6"
        >
          {ui.hero.eyebrow}
        </span>

        {/* 上方文案 — 用户指定的 slogan，可点击轮播 */}
        <span
          data-hero="sub"
          className="mb-7 block text-[15px] font-normal tracking-wide text-ink-400 sm:mb-9 sm:text-lg"
        >
          <button
            type="button"
            onClick={cycleSlogan}
            aria-label="点击切换一句我的信条"
            className="block cursor-pointer select-none rounded text-left outline-none transition-[transform,filter] duration-200 ease-out active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-black/20"
            style={{ filter: sloganBlurring ? 'blur(6px)' : 'blur(0px)' }}
          >
            {HERO_SLOGANS[sloganIdx]}
          </button>
        </span>

        {/* 主焦点 — KIMI 四字英文 wordmark（纯文字、巨大字标），可点击解码 */}
        <div className="hero-kimi-float">
          <h1
            data-hero="title"
            className="text-left font-display text-[clamp(4.5rem,22vw,16rem)] font-semibold leading-none tracking-tight text-ink-900"
          >
            <button
              type="button"
              onClick={runDecode}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  runDecode()
                }
              }}
              aria-label="KIMI — 点击解码"
              className="inline-block cursor-pointer select-none rounded-xl px-2 -mx-2 text-left outline-none transition-transform duration-200 ease-out active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-black/20"
            >
              {kimiText}
            </button>
          </h1>
        </div>

        {/* 副标题 — 呼吸充足、可读 */}
        <p
          data-hero="sub"
          className="mt-8 max-w-md text-left text-[15px] leading-[1.75] text-ink-600 sm:mt-10 sm:max-w-lg sm:text-base"
        >
          {profile.tagline}
        </p>

        {/* CTA 组 — 主按钮（浅底深字，hover 翻蓝）+ 文字链 */}
        <div data-hero="sub" className="mt-10 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:gap-5">
          <button
            type="button"
            onClick={() => navigate('projects')}
            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-300 hover:bg-ink-800 active:scale-[0.98]"
          >
            {ui.hero.cta1}
            <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => navigate('contact')}
            className="group inline-flex items-center gap-1.5 rounded-full border border-black/[0.10] bg-black/[0.03] px-6 py-3.5 text-sm font-medium text-ink-900 transition-all duration-300 hover:border-black/[0.18] hover:bg-black/[0.06] active:scale-[0.98]"
          >
            {ui.hero.cta2}
            <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* 底部署名 + 滚动指示 — 左对齐、极简 */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-start pl-6 pb-10 sm:pl-12 sm:pb-12">
        <span
          data-hero="sub"
          className="text-[11px] font-medium tracking-[0.18em] text-ink-600 sm:text-xs"
        >
          {profile.name} · {profile.englishName}
        </span>
        <span
          data-hero="sub"
          className="mt-1 text-[10px] tracking-[0.12em] text-ink-500 sm:text-[11px]"
        >
          {profile.location}
        </span>
      </div>

      {/* 滚动叙事钩子 — 开场后淡入，点击进入作品；向下滚动即隐藏 */}
      <button
        type="button"
        onClick={() => navigate('projects')}
        aria-label={ui.hero.scroll}
        className="scroll-cue fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-4 py-2 transition-opacity duration-700"
        style={{
          opacity: cueShown && !cueHidden ? 1 : 0,
          pointerEvents: cueShown && !cueHidden ? 'auto' : 'none',
        }}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink-500">
          {ui.hero.scroll}
        </span>
        <svg
          className="scroll-bounce"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

    </section>
  )
}

/* ==========================================================================
   SelectedWorkTeaser — 首页滚动承接段
   hero 视差淡出后，精选作品淡入；点击任意一项直接进入作品集，
   形成「hero → 作品」的滚动叙事衔接
   ========================================================================== */
function SelectedWorkTeaser() {
  const { navigate } = usePage()
  const { projects } = useContent()
  const ui = useUI()
  const scope = useRef(null)

  useGSAP(
    () => {
      if (prefersReduced()) return
      primeReveals(scope.current)
      buildScrollReveals(scope.current)
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      className="relative w-full bg-white px-6 py-24 sm:px-12 sm:py-28 lg:px-20"
    >
      <div className="mx-auto max-w-[980px]">
        <span data-reveal-item className="eyebrow mb-3 inline-block">
          {ui.home.works}
        </span>
        <h2
          data-reveal="title"
          className="h-display text-3xl tracking-tightest text-ink-900 md:text-4xl lg:text-5xl"
        >
          {ui.projects.title}
        </h2>

        <div className="mt-10 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate('projects')}
              data-reveal-item
              className="group flex w-full items-center gap-4 py-5 text-left transition-colors hover:bg-black/[0.02]"
            >
              <span className="flex-1">
                <span className="block text-lg font-medium text-ink-900 transition-transform duration-300 group-hover:translate-x-1 md:text-xl">
                  {p.title}
                </span>
                {p.headline && (
                  <span className="mt-1 block text-sm text-ink-500">{p.headline}</span>
                )}
              </span>
              <svg
                className="shrink-0 text-ink-400 transition-transform duration-300 group-hover:translate-x-1"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('projects')}
          data-reveal-item
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-ink-800 active:scale-[0.98]"
        >
          {ui.home.viewAll}
          <svg
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
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
      <SelectedWorkTeaser />
    </div>
  )
}