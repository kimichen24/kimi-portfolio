import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'

// three / ColorBends 体积较大（~150KB gzip），改为异步加载：
// 背景本就在外层 motion.div 做 1.1s 淡入，canvas 稍后到位完全无感，
// 从而把 three 移出首屏关键 JS 路径，显著改善 TTI / LCP。
const ColorBends = lazy(() => import('./ColorBends'))

/**
 * PageBackground — 全站统一的「柔和白底 + 纯黑弯曲带」背景
 *
 * 完全复用 React Bits 原版 ColorBends（frag shader 与组件逻辑逐行一致，未改动）。
 * 仅做两处「反相」配置以匹配需求：柔白底 + 纯黑弯曲带：
 *   - 颜色 colors 用全黑 ['#000000'×3]：着色器在 transparent 模式下 rgb=0、alpha=cover，
 *     即「黑带 + 透明区透出容器柔白底」，与原版彩带同形、仅黑白反相。
 *   - 容器 .color-bends-container 背景设为柔白 #eceef1（原版 CSS 无背景，由宿主页提供）。
 *
 * 黑白「互相映衬」的关键：
 *   - noise=0 → 弯曲带是真正的纯黑（默认 0.15 会在纯黑上叠灰斑、削弱对比），
 *     柔白底与纯黑带形成最直接的黑白鲜明对比。
 *   - 其余用原版默认参数（frequency=1 / bandWidth=6 / scale=1 / warpStrength=1 /
 *     mouseInfluence=1 / parallax=0.5 / speed=0.2 / intensity=1.5 / iterations=1），
 *     保证弯曲带形态与原版截图一致、干净简洁。
 *
 * 「过渡呈现」：外层 motion.div 在【首次进站】时做一次从容的淡入 + 微缩放归位
 * （1.1s 缓动），营造简洁而有层次感的加载过渡；切页时不再重播，
 * 由 App.jsx 的页面级 0.22s 快过渡接管，互不打架。
 * 仅占背景层（position:absolute; inset:0; zIndex:-10），不干预任何排版。
 */

// 仅首次进站点一次入场动画；之后切页保持静止，避免与页面级过渡叠加变 sluggish
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
    >
      <Suspense fallback={null}>
        <ColorBends
          className="page-bg__canvas"
          style={{ position: 'absolute', inset: 0 }}
          colors={['#000000', '#000000', '#000000']}
          rotation={90}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0}
          parallax={0.5}
          iterations={1}
          intensity={1.5}
          bandWidth={6}
          transparent
        />
      </Suspense>
    </motion.div>
  )
}
