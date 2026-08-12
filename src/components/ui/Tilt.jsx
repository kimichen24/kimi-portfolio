import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Tilt — 指针跟随的轻微 3D 倾斜（克制版，默认最大 ±6°）
 * 用于作品卡等需要「拿在手里」质感的卡片。
 * - reduced-motion：完全不启用，原样渲染子元素
 * - transformPerspective + preserve-3d 制造景深，不影响内部 hover 缩放
 */
export default function Tilt({
  children,
  className = '',
  max = 6,
  perspective = 900,
  ...props
}) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 18 })
  const sry = useSpring(ry, { stiffness: 200, damping: 18 })

  const reduce =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: perspective,
        transformStyle: 'preserve-3d',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
