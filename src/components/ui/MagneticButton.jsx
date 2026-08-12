import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * MagneticButton — 磁吸按钮：鼠标靠近时按钮朝光标方向轻微位移，离开归位
 * 用于主要 CTA（作品「查看详情」、联系页邮箱等），强化「可点」的苹果式反馈。
 * - 支持 as="a" 渲染为链接（如 mailto），其余属性（href/onClick/aria）透传
 * - reduced-motion：不启用磁吸，原样渲染
 * - whileTap 提供按压缩放反馈（与磁吸位移由 framer 统一合成 transform）
 */
export default function MagneticButton({
  children,
  className = '',
  as = 'button',
  strength = 0.35,
  ...props
}) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  const reduce =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const MotionTag = motion[as] || motion.button

  return (
    <MotionTag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      style={{ x: sx, y: sy }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
