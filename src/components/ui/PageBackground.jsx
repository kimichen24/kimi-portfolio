import { motion } from 'framer-motion'

/**
 * PageBackground — 全站统一的纯黑背景（CSS only，#000）
 *
 *  - 纯黑底，无光晕 / 无颗粒 / 无渐变，整站极致克制、无额外视觉风格
 *  - 纯 CSS 实现，不依赖 WebGL / three.js → 首屏更稳、更快、零兼容风险
 *  - 背景由 .page-bg（index.css）提供，本组件只负责「首次进站」的一次从容淡入 + 微缩放归位
 *  - 切页时不再重播，由 App.jsx 的页面级 0.22s 快过渡接管，互不打架
 *  - 仅占背景层（position:absolute; inset:0; zIndex:-10），不干预任何排版
 */

// 仅首次进站点一次入场动画；之后切页保持静止
let introPlayed = false

export default function PageBackground() {
  const firstLoad = !introPlayed

  return (
    <motion.div
      className="page-bg"
      style={{ position: 'absolute', inset: 0, zIndex: -10 }}
      initial={firstLoad ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        introPlayed = true
      }}
    />
  )
}
