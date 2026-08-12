/**
 * 内联 SVG 图标库 — 苹果 SF Symbols 风格
 * 特点：24x24 标准、stroke-width 1.6 精致描边、几何感、留白合理
 * 灵感：Apple SF Symbols 的 outline 变体
 */

const baseProps = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Icon = {
  /**
   * 作品集 — 叠层卡片 (square.stack.3d.up.fill → outline 变体)
   * 3 个圆角矩形错位堆叠，象征多项目聚合
   */
  Pen: (props) => (
    <svg {...baseProps} {...props}>
      {/* 底层卡片（最暗） */}
      <rect x="3" y="7" width="14" height="12" rx="2.2" opacity="0.35" />
      {/* 中层卡片（半透明） */}
      <rect x="5" y="5" width="14" height="12" rx="2.2" opacity="0.6" />
      {/* 顶层卡片（实色，焦点） */}
      <rect x="7" y="3" width="14" height="12" rx="2.2" />
      {/* 顶层卡片内的小标记 — 暗示内容 */}
      <path d="M10.5 8h7" opacity="0.55" />
      <path d="M10.5 11h5" opacity="0.55" />
    </svg>
  ),

  /**
   * 经历 — 公文包 (briefcase)
   * 顶部把手 + 主体 + 锁扣线，苹果 SF Symbols 经典 icon
   */
  Chart: (props) => (
    <svg {...baseProps} {...props}>
      {/* 把手 */}
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      {/* 主体 */}
      <rect x="3" y="7" width="18" height="13" rx="2.4" />
      {/* 锁扣线（中间分隔） */}
      <path d="M3 12h18" />
      {/* 锁扣点 */}
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  ),

  /**
   * 关于我 — 圆形头像 (person.crop.circle)
   * 比双人头像更现代简洁，SF Symbols 风格
   */
  People: (props) => (
    <svg {...baseProps} {...props}>
      {/* 外圈 */}
      <circle cx="12" cy="12" r="9" />
      {/* 头像（头 + 肩部剪影） */}
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5" />
    </svg>
  ),

  /**
   * 首页 — 房子 (house)
   * 药丸导航「首页」项，移动端汉堡菜单可由此返回首页
   */
  Home: (props) => (
    <svg {...baseProps} {...props}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  ),

  /**
   * 火花 / AI — 四角发光 (sparkles)
   * Strengths 卡片用
   */
  Spark: (props) => (
    <svg {...baseProps} {...props}>
      {/* 大星 */}
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      {/* 小星（左上） */}
      <path d="M19 16l0.7 1.8L21.5 18.5l-1.8 0.7L19 21l-0.7-1.8L16.5 18.5l1.8-0.7L19 16z" />
    </svg>
  ),

  ArrowRight: (props) => (
    <svg {...baseProps} {...props} width={props.width ?? 16} height={props.height ?? 16}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  ),

  Mail: (props) => (
    <svg {...baseProps} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2.4" />
      <path d="M2.5 7l9.5 6.5L21.5 7" />
    </svg>
  ),
}