/**
 * FloatingNav — 药丸导航（基于 React Bits 的 PillNav）
 *
 * 行为（按需求「滚动时消失、不滚动时出现」）：
 *   - 居中悬浮在视口顶部，磨砂玻璃质感（pill 自带）
 *   - 3 个图标：作品集 / 经历 / 关于我
 *   - GSAP 驱动的 hover 圆形扩散动画
 *   - 仅桌面端（md+）显示
 *
 * 自动隐藏规则：
 *   - 页面顶部（scrollY < 80）：始终显示，方便从首页导航
 *   - 一旦开始滚动（任意方向）→ 立即滑出隐藏
 *   - 停止滚动约 1s 后 → 自动滑入显示
 *   - 切换 page 时：立即重置为显示
 *
 * 实现要点：
 *   - 用「滚动发生即隐藏 + 停止后防抖显示」，而非方向检测，
 *     彻底避免「向上滚又冒出来」的问题（之前 delta 方案的 bug）
 *   - translateY -200% 完全离开屏幕 + opacity 同步 0 → 1
 *   - pointer-events 跟随状态，隐藏时不可点击
 *   - transition 300ms ease-out 平滑过渡
 */
import { useEffect, useRef, useState } from 'react'
import PillNav from './ui/PillNav'
import './ui/PillNav.css'
import { Icon } from './ui/Icon'
import { usePage } from '../context/PageContext'

export default function FloatingNav() {
  const { page, navigate } = usePage()
  const [visible, setVisible] = useState(true)
  const hideTimer = useRef(null)

  // 弹窗打开时强制隐藏导航（监听 body[data-modal-open] 属性变化）
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.body.dataset.modalOpen === 'true') {
        setVisible(false)
        if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null }
      } else {
        // 弹窗关闭 → 立即恢复导航
        setVisible(true)
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-modal-open'] })
    return () => observer.disconnect()
  }, [])

  // 滚动即隐藏，停止滚动 ~1s 后显示
  useEffect(() => {
    const SHOW_DELAY = 2500

    const onScroll = () => {
      const curY = window.scrollY

      // 顶部始终显示（首页 / 回到顶部的瞬间）
      if (curY < 80) {
        setVisible(true)
        if (hideTimer.current) {
          clearTimeout(hideTimer.current)
          hideTimer.current = null
        }
        return
      }

      // 正在滚动 → 立即隐藏，并重置「停止后显示」的计时器
      setVisible(false)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setVisible(true), SHOW_DELAY)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  // 切换 page 时：强制显示
  useEffect(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    setVisible(true)
  }, [page])

  const items = [
    { label: '作品集', href: 'projects', icon: <Icon.Pen /> },
    { label: '经历', href: 'experience', icon: <Icon.Chart /> },
    { label: '关于我', href: 'strengths', icon: <Icon.People /> },
  ]

  return (
    <div
      className="fixed left-0 right-0 top-4 z-50 flex justify-center md:top-6"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-200%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <PillNav
        items={items}
        activeHref={page}
        onItemClick={(item) => navigate(item.href)}
        ease="power3.easeOut"
        baseColor="rgba(10, 10, 10, 0.9)"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#1d1d1f"
        className="pill-nav--frosted"
      />
    </div>
  )
}
