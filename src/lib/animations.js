/**
 * animations.js — 全站统一的 GSAP 动效系统
 *
 * 设计原则（对齐需求）：
 *  - 高级感：英文大标题「遮罩揭开 + 位移 + 压缩后归位」，卡片 stagger 依次进场
 *  - 节奏慢、缓动丝滑：统一用 expo.out / power4.out，时长 1.1~1.6s，无廉价弹跳
 *  - 性能：只动 transform / opacity / clip-path，结束 clearProps 让 CSS hover 接管
 *  - 无障碍：prefers-reduced-motion 下直接展示终态，不做任何位移/视差
 *
 * 用法（在每个页面组件内用 useGSAP 调用）：
 *   useGSAP(() => {
 *     if (prefersReduced()) { revealAll(scope); return }
 *     primeReveals(scope)
 *     buildScrollReveals(scope)
 *   }, { scope })
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// 移动端地址栏伸缩会反复触发 refresh，关掉以免抖动
ScrollTrigger.config({ ignoreMobileResize: true })

/** 是否开启「减少动效」偏好 */
export function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/* ============================================================
   初始隐藏态（在布局阶段同步写入，避免任何闪烁）
   ============================================================ */
const TITLE_FROM = {
  opacity: 0,
  clipPath: 'inset(0 0 0 100%)',
  yPercent: 38,
  scale: 1.06,
}

const TITLE_TO = {
  opacity: 1,
  clipPath: 'inset(0 0 0 0%)',
  yPercent: 0,
  scale: 1,
  duration: 1.4,
  ease: 'expo.out',
  clearProps: 'transform,opacity,clipPath',
}

export function primeReveals(scope) {
  if (!scope) return
  const q = (sel) => scope.querySelectorAll(sel)

  q('[data-reveal="title"]').forEach((el) => gsap.set(el, TITLE_FROM))
  q('[data-reveal="img"]').forEach((el) =>
    gsap.set(el, { opacity: 0, scale: 1.18, clipPath: 'inset(8% 8% 8% 8%)' }),
  )
  q('[data-reveal="fade"]').forEach((el) => gsap.set(el, { opacity: 0, y: 30 }))
  q('[data-reveal-item]').forEach((el) =>
    gsap.set(el, { opacity: 0, y: 28, scale: 0.97, filter: 'blur(6px)' }),
  )
}

/** reduced-motion 下：把所有揭示元素直接置为可见终态 */
export function revealAll(scope) {
  if (!scope) return
  scope
    .querySelectorAll('[data-reveal], [data-reveal-item]')
    .forEach((el) =>
      gsap.set(el, {
        clearProps: 'all',
        opacity: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
        filter: 'none',
        clipPath: 'none',
      }),
    )
}

/* ============================================================
   滚动揭示：每个 [data-reveal="title"] 触发后，同区块卡片依次 stagger
   ============================================================ */
export function buildScrollReveals(scope) {
  if (!scope) return

  const handled = new Set()

  // ── 1. 标题 → 卡片 stagger ──
  gsap.utils.toArray('[data-reveal="title"]', scope).forEach((title) => {
    const block = title.closest('[data-reveal-block]') || title.parentElement
    const items = block ? gsap.utils.toArray('[data-reveal-item]', block) : []
    items.forEach((i) => handled.add(i))

    const tl = gsap.timeline({
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
    })

    tl.to(title, TITLE_TO)

    if (items.length) {
      tl.to(
        items,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,filter,opacity',
        },
        '-=0.75',
      )
    }

    // 标题下方的分隔线 / 下划线（若有）
    const line = block ? block.querySelector('[data-reveal="underline"]') : null
    if (line) {
      tl.fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'expo.out', transformOrigin: 'left center' },
        '-=1.0',
      )
    }
  })

  // ── 2. 独立的 fade 元素（段落等）──
  gsap.utils.toArray('[data-reveal="fade"]', scope).forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      clearProps: 'transform,opacity',
    })
  })

  // ── 3. 图片揭示（Ken-Burns 式 clip + scale）──
  gsap.utils.toArray('[data-reveal="img"]', scope).forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      clearProps: 'transform,opacity,clipPath',
    })
  })

  // ── 4. 安全网：未被任何标题区块包含的孤儿 item，单独触发 ──
  gsap.utils.toArray('[data-reveal-item]', scope).forEach((el) => {
    if (handled.has(el)) return
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      clearProps: 'transform,filter,opacity',
    })
  })

  // ── 5. 轻微视差（仅标记元素，且仅在非减少动效时）──
  if (!prefersReduced()) {
    gsap.utils.toArray('[data-parallax]', scope).forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })
  }

  // 图片 / 字体加载后位置可能变化，统一刷新一次
  ScrollTrigger.refresh()
}

/* ============================================================
   「关于我」页专属编排 — 各区块独立触发、随滚动逐段出现
   - Profile / Tools：首屏区块，独立触发、进入视口即进场
   - Skills 区：标题 + 6 张技能卡 组成一组，滚到 Skills 区块即整组铺开
   - Contact 区：徽标 + 3 张联系卡 独立成组，滚到联系方式区块即出现
   两组并行独立 → 联系方式不再等技能卡级联结束，也绝不抢跑；
   滚动到哪段哪段就完成，符合「顺滑、随滚动出现」的诉求。
   ============================================================ */
export function buildStrengthsReveals(scope) {
  if (!scope) return

  const pickBlock = (titleSel) => {
    const title = scope.querySelector(titleSel)
    const block = title?.closest('[data-reveal-block]')
    const items = block ? gsap.utils.toArray('[data-reveal-item]', block) : []
    return { title, block, items }
  }

  // ── Profile / Tools：独立触发，进入视口即进场 ──
  const topReveal = (el) => {
    if (!el) return
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      clearProps: 'transform,filter,opacity',
    })
  }
  topReveal(scope.querySelector('[data-st="profile"]'))
  topReveal(scope.querySelector('[data-st="tools"]'))

  // ── Skills 区：与「联系我」徽标完全一致 —— 标题纯淡入上浮（无遮罩），卡片紧凑 stagger ──
  const { title: skillsTitle, block: skillsBlock, items: skillCards } = pickBlock(
    '[data-st="skills-title"]',
  )
  if (skillsBlock) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: skillsBlock, start: 'top 85%', once: true },
    })
    // 标题：与联系我徽标同参数（opacity + y，绝不用 clip-path 遮罩）
    if (skillsTitle) {
      tl.fromTo(
        skillsTitle,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' },
      )
    }
    // 6 张技能卡紧接标题依次进场（与联系我卡片同参数）
    if (skillCards.length) {
      tl.to(
        skillCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'transform,filter,opacity',
        },
        skillsTitle ? '-=0.35' : 0,
      )
    }
  }

  // ── Contact 区：徽标 + 3 张联系卡，独立触发，滚到联系方式即出现 ──
  const contactBlock = scope.querySelector('[data-st="contact-block"]')
  const contactBadge = scope.querySelector('[data-st="contact-badge"]')
  const contactCards = contactBlock
    ? gsap.utils.toArray('[data-reveal-item]', contactBlock)
    : []

  if (contactBlock) {
    const ctl = gsap.timeline({
      scrollTrigger: { trigger: contactBlock, start: 'top 85%', once: true },
    })
    // 徽标淡入上浮（与 buildScrollReveals 的 fade 同感）
    if (contactBadge) {
      ctl.fromTo(
        contactBadge,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'transform,opacity' },
      )
    }
    // 3 张联系卡紧接徽标依次进场
    if (contactCards.length) {
      ctl.to(
        contactCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'transform,filter,opacity',
        },
        contactBadge ? '-=0.35' : 0,
      )
    }
  }

  ScrollTrigger.refresh()
}

/* ============================================================
   开场动画只播放一次（进入网站时）。从其他页切回首页不再重播加载页。
   - 仅在动画真正播完（onComplete）时才置位，兼容 StrictMode 双调用
   ============================================================ */
let openingPlayed = false
export function hasOpeningPlayed() {
  return openingPlayed
}
export function markOpeningPlayed() {
  openingPlayed = true
}

/* ============================================================
   首屏 Opening（Apple 极简风格）
   深色渐变底 → 字母标淡入 + 加载线流动 → 整体 opacity 溶解淡出
   → logo / 标题 / 副文案依次进场
   ============================================================ */
export function buildHeroOpening(scope) {
  if (!scope) return

  const curtain = scope.querySelector('[data-hero="curtain"]')
  const mark = scope.querySelector('[data-hero="mark"]')
  const nameEl = scope.querySelector('[data-hero="name"]')
  const loader = scope.querySelector('[data-hero="loader"]')
  const logo = scope.querySelector('[data-hero="logo"]')
  const title = scope.querySelector('[data-hero="title"]')
  const sub = gsap.utils.toArray('[data-hero="sub"]', scope)
  const underline = scope.querySelector('[data-hero="underline"]')
  // 首次进站：下划线从 0 起步（在加载幕布后，避免闪现）
  if (underline) gsap.set(underline, { width: 0 })

  const tl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: () => {
      // 加载完成 → 移除覆盖层，释放导航栏，并标记开场已播放（仅一次）
      if (curtain) {
        curtain.style.pointerEvents = 'none'
        curtain.style.display = 'none'
      }
      document.body.removeAttribute('data-loading')
      openingPlayed = true
    },
  })

  // ── 阶段 1：字母标 + 名字淡入（0~0.6s）──
  if (mark) tl.from(mark, { opacity: 0, y: 20, duration: 1.0, ease: 'power2.out' }, 0)
  if (nameEl) tl.from(nameEl, { opacity: 0, y: 12, duration: 0.9, ease: 'power2.out' }, 0.15)

  // ── 阶段 2：极细加载线 — 从左到右 "流光" 掠过（0.4~1.0s）──
  if (loader) {
    const bar = loader.firstElementChild
    if (bar) {
      tl.set(bar, { scaleX: 0 }, 0.35)
      tl.to(bar, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.5)
    }
  }

  // ── 阶段 3：整体 opacity 溶解淡出（非 scaleY 硬下拉！）──
  // Apple 风格：整个覆盖层均匀消融，像雾散开
  if (curtain) {
    tl.to(
      curtain,
      { opacity: 0, duration: 0.9, ease: 'power2.inOut' },
      1.05,
    )
  }

  // ── 阶段 4：内容进场（幕布半透明时开始，无缝衔接）──
  // 左上 logo
  if (logo) tl.from(logo, { y: -20, opacity: 0, duration: 0.85 }, 1.15)

  // 主标题：遮罩揭开（左→右 wipe）+ 轻微压缩归位
  if (title) {
    tl.fromTo(
      title,
      { yPercent: 50, clipPath: 'inset(0 0 0 100%)', scale: 1.06, opacity: 0 },
      { yPercent: 0, clipPath: 'inset(0 0 0 0%)', scale: 1, opacity: 1, duration: 1.35 },
      1.25,
    )
  }

  // 副文案：模糊上浮、依次进场
  if (sub.length) {
    tl.from(
      sub,
      { y: 30, opacity: 0, filter: 'blur(10px)', duration: 1.0, stagger: 0.16 },
      '-=0.9',
    )
  }

  // ── 收尾：标题下方动态下划线，从 0 展开到 100%（180px 上限）──
  if (underline) {
    tl.to(underline, { width: '180px', duration: 0.9, ease: 'power3.out' }, 2.35)
  }

  return tl
}
