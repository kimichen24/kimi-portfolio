import { useEffect } from 'react'

/**
 * useInkWipe — 章节标题的墨线揭示
 * 进入视口时给 [data-ink-wipe] 加 .is-in（clip 擦除，非淡入上移）。
 * reduced-motion 下 CSS 直接展示终态。
 */
export function useInkWipe(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll('[data-ink-wipe]')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.4 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref])
}

/**
 * useCountUp — 进入视口时数字滚动（mono 红批注的仪式感）
 * reduced-motion 或解析失败时直接展示终值。
 */
export function useCountUp(ref, target, duration = 900) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.textContent = target
      return
    }
    const num = parseFloat(target)
    if (Number.isNaN(num)) {
      el.textContent = target
      return
    }
    const suffix = String(target).replace(/[\d.]+/, '')
    // 保留原始小数位数（10.66万 → 两位小数），结束时写回原值
    const decimals = (String(num).split('.')[1] || '').length
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = (num * eased).toFixed(decimals) + suffix
          if (p < 1) {
            requestAnimationFrame(tick)
          } else {
            el.textContent = target
          }
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, target, duration])
}
