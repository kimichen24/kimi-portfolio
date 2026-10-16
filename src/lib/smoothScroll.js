/**
 * smoothScroll.js — 全站平滑滚动打底
 *
 * 设计：Lenis 平滑滚动 + 单一原生 rAF 循环驱动
 *   - 一个 requestAnimationFrame 循环驱动 Lenis，不引入额外动画库
 *   - 尊重 prefers-reduced-motion：开启减弱动效时完全不启用平滑滚动
 *   - 单例：重复调用返回已存在的实例；页面切换用 scrollToTop 立即归位
 */
import Lenis from 'lenis'

/** 是否开启「减少动效」偏好 */
export function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

let lenis = null
let rafId = null

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null
  // 减弱动效偏好：交还给浏览器原生滚动，不做任何平滑处理
  if (prefersReduced()) return null
  if (lenis) return lenis

  lenis = new Lenis({
    duration: 1.1,
    // expo.out：减速缓动，越接近终点越从容
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  })

  // 单一循环：原生 rAF 驱动 Lenis（无第三方 ticker）
  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return lenis
}

export function destroySmoothScroll() {
  if (!lenis) return
  if (rafId !== null) cancelAnimationFrame(rafId)
  lenis.destroy()
  lenis = null
  rafId = null
}

export function getLenis() {
  return lenis
}

/** 页面切换时立即滚回顶部（优先用 Lenis 实例，避免与平滑滚动打架） */
export function scrollToTop(immediate = true) {
  if (lenis) {
    lenis.scrollTo(0, { immediate })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: immediate ? 'instant' : 'smooth' })
  }
}
