import { useRef } from 'react'
import { useInViewOnce } from './RedPen'

/**
 * HandBars — 红笔手绘条形图
 * 案卷里的关键对比不再只是表格里的一行字：
 * 歪歪扭扭的红条按值高下立见，断崖一眼可读。
 * 抖动用 sin 哈希确定性生成（同 props 恒定同图）。
 */

const j = (i, s) => Math.sin(i * 127.1 + s * 311.7) * 1.6

function barD(x, w, top, bottom, i) {
  const x0 = x + j(i, 1)
  const x1 = x + w + j(i, 2)
  const y0 = top + j(i, 3)
  const y1 = bottom + j(i, 4)
  const midX0 = x + w * 0.45 + j(i, 5)
  const midX1 = x + w * 0.55 + j(i, 6)
  const midY = (top + bottom) / 2
  return [
    `M${x0.toFixed(1)} ${y0.toFixed(1)}`,
    `Q${midX0.toFixed(1)} ${(y0 + j(i, 7)).toFixed(1)} ${(x1 + j(i, 8) * 0.5).toFixed(1)} ${(y0 + j(i, 9) * 0.5).toFixed(1)}`,
    `Q${(x1 + j(i, 10)).toFixed(1)} ${midY.toFixed(1)} ${(x1 + j(i, 11) * 0.5).toFixed(1)} ${(y1 + j(i, 12) * 0.5).toFixed(1)}`,
    `Q${midX1.toFixed(1)} ${(y1 + j(i, 13)).toFixed(1)} ${(x0 + j(i, 14) * 0.5).toFixed(1)} ${(y1 + j(i, 15) * 0.5).toFixed(1)}`,
    `Q${(x0 + j(i, 16)).toFixed(1)} ${midY.toFixed(1)} ${(x0 + j(i, 17) * 0.5).toFixed(1)} ${(y0 + j(i, 18) * 0.5).toFixed(1)}`,
    'Z',
  ].join(' ')
}

/** 基准线：一条微微起伏的手绘横线 */
function baseD(x0, x1, y, i) {
  return `M${x0} ${y + j(i, 1)} Q ${(x0 + x1) / 2} ${y + j(i, 2) * 2} ${x1} ${y + j(i, 3)}`
}

export default function HandBars({ chart }) {
  const ref = useRef(null)
  const drawn = useInViewOnce(ref, 0.4)
  const { items, caption } = chart

  // 画布几何
  const W = Math.max(360, items.length * 150)
  const H = 190
  const baseY = 150
  const topPad = 34
  const maxV = Math.max(...items.map((it) => it.value))
  const barW = 64
  const colW = W / items.length

  return (
    <figure ref={ref} className="mt-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={`h-auto w-full ${drawn ? 'is-drawn' : ''}`}
        role="img"
        aria-label={caption}
      >
        {items.map((it, i) => {
          const h = Math.max(8, (it.value / maxV) * (baseY - topPad))
          const x = colW * i + (colW - barW) / 2
          const top = baseY - h
          return (
            <g key={it.label}>
              {/* 条（红笔描边） */}
              <path
                className="redpen-path"
                pathLength="1"
                d={barD(x, barW, top, baseY, i)}
                style={{ transitionDuration: '700ms', transitionDelay: `${i * 160}ms` }}
              />
              {/* 值 */}
              <text
                x={colW * i + colW / 2}
                y={top - 10}
                textAnchor="middle"
                className="fill-red font-mono"
                fontSize="17"
                fontWeight="600"
              >
                {it.display}
              </text>
              {/* 轴标签 */}
              <text
                x={colW * i + colW / 2}
                y={baseY + 24}
                textAnchor="middle"
                className="fill-ink-mute font-mono"
                fontSize="11"
              >
                {it.label}
              </text>
            </g>
          )
        })}
        {/* 基准线 */}
        <path
          className="redpen-path"
          pathLength="1"
          d={baseD(20, W - 20, baseY, 99)}
          style={{ transitionDuration: '600ms', transitionDelay: '80ms' }}
        />
      </svg>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
