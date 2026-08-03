/**
 * PillNav — React Bits 开源组件（适配版）
 *
 * 适配点（相对原版）：
 * - 移除 react-router-dom 依赖（项目未使用）
 * - 用 <button> 替代 <a>：彻底避免 href 相对路径触发浏览器导航
 *   （原版用 <a href="projects"> + preventDefault，但 React 合成事件
 *   异步派发时浏览器可能已开始预解析 href，导致整页 reload、state 重置）
 * - 新增 onItemClick prop：点击 pill 时回调（替代默认 href 跳转）
 * - 新增 icon 字段：每个 pill 支持 React 图标元素
 * - 缺失 logo 时跳过 logo 渲染
 *
 * 视觉特效：GSAP 驱动的 hover 圆形扩散 + 文字层叠切换
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './PillNav.css'

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#ffffff',
  pillColor = '#0a0a0a',
  hoveredPillTextColor = '#0a0a0a',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
  onItemClick,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const logoImgRef = useRef(null)
  const logoTweenRef = useRef(null)
  const hamburgerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navItemsRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        const R = (w * w) / 4 / (2 * h) + h / 2
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = pill.querySelector('.pill-label')
        const white = pill.querySelector('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: h + 12, opacity: 0 })

        const index = circleRefs.current.indexOf(circle)
        if (index === -1) return

        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' },
          0
        )

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' },
            0
          )
        }

        tlRefs.current[index] = tl
      })
    }

    layout()

    const onResize = () => layout()
    window.addEventListener('resize', onResize)

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {})
    }

    const menu = mobileMenuRef.current
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 })
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current
      const navItems = navItemsRef.current

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 })
        gsap.to(logoEl, { scale: 1, duration: 0.6, ease })
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' })
        gsap.to(navItems, { width: 'auto', duration: 0.6, ease })
      }
    }

    return () => window.removeEventListener('resize', onResize)
  }, [items, ease, initialLoadAnimation])

  const handleEnter = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLeave = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLogoEnter = () => {
    const img = logoImgRef.current
    if (!img) return
    logoTweenRef.current?.kill()
    gsap.set(img, { rotate: 0 })
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)

    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line')
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease })
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease })
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease })
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease })
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' })
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          }
        )
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' })
          },
        })
      }
    }

    onMobileMenuClick?.()
  }

  // 处理 pill 点击 — 用 button 元素后无需 preventDefault
  const handlePillClick = (item, i) => {
    if (onItemClick) onItemClick(item, i)
  }

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
  }

  return (
    <div className="pill-nav-container">
      <nav
        className={`pill-nav ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {/* Logo — 可选，没有则不渲染 */}
        {logo && (
          <button
            type="button"
            className="pill-logo"
            aria-label={logoAlt || 'Home'}
            onMouseEnter={handleLogoEnter}
            ref={(el) => {
              logoRef.current = el
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} />
          </button>
        )}

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href || item.label || `item-${i}`} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  onClick={() => handlePillClick(item, i)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el
                    }}
                  />
                  {item.icon && (
                    <span className="pill-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div
        className="mobile-menu-popover mobile-only"
        ref={mobileMenuRef}
        style={cssVars}
      >
        <ul className="mobile-menu-list">
          {items.map((item, i) => (
            <li key={item.href || item.label || `mobile-item-${i}`}>
              <button
                type="button"
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                aria-label={item.ariaLabel || item.label}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  if (onItemClick) onItemClick(item, i)
                }}
              >
                {item.icon && (
                  <span className="mobile-menu-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PillNav