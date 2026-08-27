import { useEffect, useRef, useState } from 'react'

/**
 * RedPen — 红笔批注系统（核心体验装置）
 *
 * 整站是一张正在被批注的稿纸：关键数字被画上下划线，
 * 关键词被圈注，交互时标题被红笔画过。
 * 笔画用 SVG stroke-dashoffset 做「落笔」动画——
 * 起笔快、收笔稳（cubic-bezier(.5,.05,.2,1)），
 * vector-effect 保证笔画粗细不被拉伸变形。
 *
 * 触发逻辑：
 *  - 进入视口一次后自动画出（reduced-motion 直接终态）
 *  - 祖先带 .group 的元素 hover 时强制画出（提起再落笔的反馈）
 */

/** 进入视口一次即置真（reduced-motion 直接终态）— 导出给自画像/手绘图复用 */
export function useInViewOnce(ref, threshold = 0.5) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return inView
}

/**
 * RedUnderline — 手绘红笔下划线
 * 绝对定位铺满父级（父级需 relative），画在文字下方。
 */
export function RedUnderline({ when, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInViewOnce(ref, 0.4)
  const drawn = when !== undefined ? when : inView
  return (
    <svg
      ref={ref}
      className={`redpen pointer-events-none absolute -bottom-[3px] left-0 h-[6px] w-full ${drawn ? 'is-drawn' : ''} ${className}`}
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 4.2 Q 28 1, 54 3.6 T 98.5 2.8"
        pathLength="1"
        style={{ transitionDelay: `${delay}ms` }}
      />
    </svg>
  )
}

/**
 * RedCircle — 手绘红笔圈注
 * 包住一个词，进入视口后画一个不闭合的手绘椭圆。
 */
export function RedCircle({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const drawn = useInViewOnce(ref, 0.5)
  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className={`redpen pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+20px)] ${drawn ? 'is-drawn' : ''}`}
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M52 4 C 24 2, 4 9, 5 22 C 6 36, 32 42, 58 39 C 82 36, 97 29, 95 18 C 93 7, 70 1, 38 5"
          pathLength="1"
          style={{ transitionDelay: `${delay}ms` }}
        />
      </svg>
    </span>
  )
}

/**
 * MarginNote — 页边红批注（小勾 + 等宽小字）
 * 用在数字旁：「✓ 真实数据」式的查证提示。
 */
export function MarginNote({ children, className = '' }) {
  return (
    <span className={`red-note inline-flex items-center gap-1.5 text-[10px] ${className}`}>
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
        <path
          d="M1.5 6.5 L4.5 9.5 L10.5 2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </span>
  )
}

/** 列表小红刻度 — 经历要点 / 批注符号 */
export function RedTick({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-[9px] inline-block h-[3px] w-3 shrink-0 bg-red ${className}`}
    />
  )
}
