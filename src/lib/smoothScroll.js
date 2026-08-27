/**
 * smoothScroll.js — 全站平滑滚动打底（苹果风丝滑感的核心杠杆）
 *
 * 设计：Lenis 平滑滚动 + GSAP ticker 单一 rAF 循环驱动（业界验证的苹果式方案）
 *   - 不用两个互相打架的动画循环（卡顿头号原因）
 *   - Lenis 的 scroll 事件同步 ScrollTrigger.update，scrub 动画与平滑滚动严丝合缝
 *   - 尊重 prefers-reduced-motion：开启减弱动效时完全不启用平滑滚动
 *   - 单例：重复调用返回已存在的实例；页面切换用 scrollToTop 立即归位
 */
import Lenis from 'lenis'
import { gsap } from 'gsap'

/** 是否开启「减少动效」偏好 */
export function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

let lenis = null
let rafCallback = null

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

  // 单一循环：GSAP ticker 驱动 Lenis（一个 rAF，不打架）
  rafCallback = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(rafCallback)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroySmoothScroll() {
  if (!lenis) return
  if (rafCallback) gsap.ticker.remove(rafCallback)
  lenis.destroy()
  lenis = null
  rafCallback = null
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
