import { useRef } from 'react'
import { useInViewOnce } from './RedPen'

/**
 * SelfPortrait — 一条线的自画像（红笔）
 * 页面加载时，红笔把自己一笔一笔画出来：
 * 先脸，再后脑与颈，然后耳、眉、眼。
 * 它是「有人住在这张稿纸上」的证据。
 */
export default function SelfPortrait({ className = '' }) {
  const ref = useRef(null)
  const drawn = useInViewOnce(ref, 0.25)

  // 每条线：path + 落笔时长 + 相对延迟（ms）
  const strokes = [
    {
      // 脸的轮廓：额 → 鼻 → 唇 → 下巴 → 颌 → 颈
      d: 'M112 18 C 88 20, 70 38, 65 62 C 63 72, 66 79, 63 84 C 60 89, 51 92, 49 98 C 48 101, 53 102, 56 103 C 53 106, 52 109, 55 111 C 52 114, 52 118, 56 120 C 53 124, 54 129, 60 132 C 69 139, 74 146, 71 154 C 69 161, 61 166, 54 170 C 49 173, 46 179, 47 189 C 48 199, 53 207, 56 219 C 57 227, 56 235, 57 244',
      dur: 1500,
      delay: 200,
    },
    {
      // 后脑与后颈
      d: 'M112 18 C 138 22, 156 44, 154 74 C 153 96, 144 112, 130 122 C 124 127, 121 133, 120 142 C 123 158, 129 168, 139 176 C 149 184, 153 194, 153 206 L 153 244',
      dur: 1200,
      delay: 900,
    },
    {
      // 耳
      d: 'M101 104 C 109 100, 113 107, 109 116 C 106 122, 100 122, 98 116',
      dur: 500,
      delay: 1700,
    },
    {
      // 眉
      d: 'M68 73 Q 75 69, 81 72',
      dur: 350,
      delay: 1900,
    },
    {
      // 眼（闭目——安静地被画下来）
      d: 'M70 84 Q 76 87, 82 84',
      dur: 350,
      delay: 2050,
    },
  ]

  return (
    <figure ref={ref} className={className} aria-label="红笔自画像">
      <svg
        viewBox="0 0 200 250"
        className={`h-auto w-full ${drawn ? 'is-drawn' : ''}`}
        role="img"
        aria-hidden="true"
      >
        {strokes.map((s, i) => (
          <path
            key={i}
            className="redpen-path"
            pathLength="1"
            d={s.d}
            style={{
              transitionDuration: `${s.dur}ms`,
              transitionDelay: `${s.delay}ms`,
            }}
          />
        ))}
      </svg>
      <figcaption className="mt-3 text-center font-mono text-[10px] tracking-widewide text-ink-faint">
        self-portrait · one line
      </figcaption>
    </figure>
  )
}
