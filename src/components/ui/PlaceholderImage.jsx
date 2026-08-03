/**
 * 项目封面占位图 — 纯玻璃风格
 *
 * 设计原则：
 * - 统一的极淡灰玻璃底色，不区分色调（纯透明感）
 * - 图标线条保留微弱色彩倾向作为唯一辨识（极淡）
 * - 多层光晕：径向主光斑 + 顶部高光线 + 底部渐隐
 * - 整体效果像一块干净的毛玻璃板，图标浮在上面
 *
 * 后续替换：把 <PlaceholderImage /> 替换为 <img src="/assets/your.png" /> 即可
 */
const palette = {
  warm: {
    from: 'rgba(255,255,255,0.13)',
    via: 'rgba(255,255,255,0.08)',
    to: 'rgba(255,255,255,0.10)',
    accent: 'rgba(255,180,140,0.18)',
    accent2: 'rgba(255,140,100,0.10)',
    stroke: 'rgba(255,180,160,0.65)',
    iconGlow: 'rgba(255,140,120,0.25)',
  },
  cool: {
    from: 'rgba(255,255,255,0.13)',
    via: 'rgba(255,255,255,0.08)',
    to: 'rgba(255,255,255,0.10)',
    accent: 'rgba(120,220,180,0.16)',
    accent2: 'rgba(80,200,150,0.09)',
    stroke: 'rgba(120,220,180,0.60)',
    iconGlow: 'rgba(80,200,150,0.22)',
  },
  deep: {
    from: 'rgba(255,255,255,0.13)',
    via: 'rgba(255,255,255,0.08)',
    to: 'rgba(255,255,255,0.10)',
    accent: 'rgba(147,154,255,0.16)',
    accent2: 'rgba(130,145,255,0.09)',
    stroke: 'rgba(160,170,255,0.58)',
    iconGlow: 'rgba(130,145,255,0.20)',
  },
}

function Glyph({ tone }) {
  const c = palette[tone]?.stroke ?? palette.warm.stroke
  const g = palette[tone]?.iconGlow ?? palette.warm.iconGlow

  if (tone === 'warm') {
    // 招聘平台产品研究：雷达 / 扫描 / 目标匹配
    return (
      <g>
        {/* 柔光底层 */}
        <circle cx="100" cy="90" r="46" fill={g} stroke="none" opacity="0.45" />
        {/* 主线条 */}
        <g fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="100" cy="90" r="46" />
          <circle cx="100" cy="90" r="32" opacity="0.55" />
          <circle cx="100" cy="90" r="18" opacity="0.35" />
          {/* 扫描线 */}
          <path d="M100 90 L132 58" opacity="0.9" />
          {/* 扫描扇面 */}
          <path d="M132 58 A46 46 0 0 1 146 90" opacity="0.35" />
          {/* 探测点 */}
          <circle cx="128" cy="68" r="3" fill={c} stroke="none" opacity="0.95" />
          <circle cx="118" cy="118" r="2.5" fill={c} stroke="none" opacity="0.7" />
        </g>
      </g>
    )
  }

  if (tone === 'cool') {
    // 校园二手交易社群：对话 + 交换
    return (
      <g>
        {/* 柔光底层 */}
        <path
          d="M54 66 H102 Q112 66 112 76 V98 Q112 108 102 108 H84 L72 122 L66 108 H54 Q44 108 44 98 V76 Q44 66 54 66 Z"
          fill={g}
          stroke="none"
          opacity="0.5"
        />
        {/* 主线条 */}
        <g fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          {/* 左侧气泡 */}
          <path d="M54 66 H102 Q112 66 112 76 V98 Q112 108 102 108 H84 L72 122 L66 108 H54 Q44 108 44 98 V76 Q44 66 54 66 Z" />
          {/* 右侧气泡 */}
          <path d="M98 86 H146 Q156 86 156 96 V118 Q156 128 146 128 H134 L128 142 L116 128 H98 Q88 128 88 118 V96 Q88 86 98 86 Z" />
          {/* 交换箭头 */}
          <path d="M82 132 L118 132" opacity="0.7" />
          <path d="M110 128 L118 132 L110 136" opacity="0.7" />
          <path d="M90 136 L82 132 L90 128" opacity="0.7" />
        </g>
      </g>
    )
  }

  // deep — 豆包校园用户调研：文档 + 访谈 + 放大镜
  return (
    <g>
      {/* 柔光底层 */}
      <path
        d="M62 46 H138 Q158 46 158 66 V130 Q158 150 138 150 H62 Q42 150 42 130 V66 Q42 46 62 46 Z"
        fill={g}
        stroke="none"
        opacity="0.45"
      />
      {/* 主线条 */}
      <g fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M62 46 H138 Q158 46 158 66 V130 Q158 150 138 150 H62 Q42 150 42 130 V66 Q42 46 62 46 Z" />
        {/* 折角 */}
        <path d="M138 46 V66 L158 86" />
        {/* 文档文字 */}
        <path d="M58 84 H120" opacity="0.5" />
        <path d="M58 104 H104" opacity="0.35" />
        <path d="M58 124 H88" opacity="0.28" />
        {/* 访谈气泡 */}
        <path d="M130 104 H150 Q156 104 156 110 V122 Q156 128 150 128 H144 L138 136 L134 128 H130 Q124 128 124 122 V110 Q124 104 130 104 Z" />
        {/* 放大镜 */}
        <circle cx="142" cy="116" r="6" />
        <path d="M147 121 L152 126" />
      </g>
    </g>
  )
}

export default function PlaceholderImage({ tone = 'warm', label = '项目截图', aspect = 'aspect-[16/10]', rounded = true }) {
  const c = palette[tone] ?? palette.warm
  return (
    <div
      className={`project-cover relative w-full ${aspect} overflow-hidden ${rounded ? 'rounded-2xl' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${c.from} 0%, ${c.via} 50%, ${c.to} 100%)`,
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
      }}
    >
      {/* 主光斑 */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 30% 35%, ${c.accent}, transparent 65%)` }}
      />
      {/* 次光斑（右下角，增加层次）*/}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 75% 75%, ${c.accent2}, transparent 55%)` }}
      />

      {/* 顶部高光线 — 苹果式玻璃反光感 */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
      />

      {/* 图标 */}
      <svg
        viewBox="0 0 200 180"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 m-auto h-[55%] w-[55%]"
        role="img"
        aria-label={label}
      >
        <Glyph tone={tone} />
      </svg>

      {/* 底部渐隐 — 纯玻璃过渡 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
        }}
      />
    </div>
  )
}

/**
 * AvatarPlaceholder — 圆形字母头像（暗色苹果风渐变描边）
 * 用于「个人经历」页左侧头像。
 */
export function AvatarPlaceholder({ name = 'K', size = 168 }) {
  return (
    <div
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        padding: 2,
        background:
          'linear-gradient(135deg, rgba(255,107,107,0.6), rgba(129,140,248,0.5), rgba(52,211,153,0.5))',
      }}
    >
      <div
        className="grid h-full w-full place-items-center rounded-full"
        style={{
          background: 'linear-gradient(135deg, #18181c 0%, #0b0b0d 100%)',
        }}
      >
        <span
          className="font-semibold text-white/90"
          style={{ fontFamily: "'Instrument Serif', serif", fontSize: size * 0.42, lineHeight: 1 }}
        >
          {name}
        </span>
      </div>
    </div>
  )
}
