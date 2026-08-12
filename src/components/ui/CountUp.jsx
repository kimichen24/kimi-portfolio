import { useEffect, useRef, useState } from 'react'

/**
 * CountUp — 数字进入视口时从 0 滚动到真实值
 * 兼容站点 metrics 的多样格式：纯数字 / 带单位（73%、3万+、1000+）/ 带 ×（3×）
 * 非数字开头的值（如 P0–P2）直接静态显示，不报错。
 * - reduced-motion：直接显示终值，不做动画
 */
function parseValue(str) {
  if (typeof str !== 'string') return null
  const m = str.match(/^([^\d-]*)(-?[\d.]+)(.*)$/)
  if (!m) return null
  const num = parseFloat(m[2])
  if (Number.isNaN(num)) return null
  const decimals = (m[2].split('.')[1] || '').length
  return { prefix: m[1], num, suffix: m[3], decimals }
}

export default function CountUp({ value, duration = 1.4, className = '' }) {
  const ref = useRef(null)
  const started = useRef(false)
  const parsed = parseValue(value)

  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}0${parsed.suffix}` : value,
  )

  useEffect(() => {
    if (!parsed) {
      setDisplay(value)
      return
    }
    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(value)
      return
    }

    const { prefix, num, suffix, decimals } = parsed
    const node = ref.current
    if (!node) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now) => {
              const t = Math.min(1, (now - start) / (duration * 1000))
              const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
              setDisplay(`${prefix}${(num * eased).toFixed(decimals)}${suffix}`)
              if (t < 1) requestAnimationFrame(tick)
              else setDisplay(`${prefix}${num.toFixed(decimals)}${suffix}`)
            }
            requestAnimationFrame(tick)
            io.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [value, duration, parsed])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
