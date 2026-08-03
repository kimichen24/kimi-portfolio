/**
 * GlassIcons — React Bits 开源组件
 * 3D 玻璃质感图标按钮：背后渐变方块倾斜，前面磨砂玻璃，hover 时图标往前推 + 倾斜加剧 + 显示标签
 * 颜色支持预设（blue/purple/red/indigo/orange/green）或自定义任意 CSS 颜色字符串
 */
const gradientMapping = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
}

const GlassIcons = ({ items, className }) => {
  const getBackgroundStyle = (color) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] }
    }
    return { background: color }
  }

  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => {
        // 优先级：onClick > href > 默认 button
        const Tag = item.onClick ? 'button' : item.href ? 'a' : 'button'
        return (
          <Tag
            key={index}
            className={`icon-btn ${item.customClass || ''}`}
            aria-label={item.label}
            type={Tag === 'button' ? 'button' : undefined}
            href={item.href}
            onClick={item.onClick}
          >
            <span className="icon-btn__back" style={getBackgroundStyle(item.color)}></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon" aria-hidden="true">
                {item.icon}
              </span>
            </span>
            <span className="icon-btn__label">{item.label}</span>
          </Tag>
        )
      })}
    </div>
  )
}

export default GlassIcons