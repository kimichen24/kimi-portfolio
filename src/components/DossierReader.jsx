import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { playPaperSlide, playPaperTap } from '../lib/audio'
import { getLenis } from '../lib/smoothScroll'

/**
 * DossierReader — 站内沉浸式案卷阅读抽屉
 * 消灭外链跳出，保持全站世界观：
 * 1. 使用 createPortal 挂载到 body，避开 transform/stacking context 影响
 * 2. 停用 Lenis 主滚动引擎，并在内部启用原生独立滚动
 * 3. 顶栏提供卷宗编号、新标签页打开备用链接、ESC/关闭按钮
 */

export default function DossierReader({ project, isOpen, onClose }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      playPaperSlide(0.8)
      setLoading(true)
      const lenis = getLenis()
      if (lenis) lenis.stop()
      document.body.style.overflow = 'hidden'
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleClose()
        }
      }
      window.addEventListener('keydown', onKeyDown)
      return () => {
        const lenis = getLenis()
        if (lenis) lenis.start()
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [isOpen])

  if (!isOpen || !project || !project.reportUrl) return null

  const handleClose = () => {
    playPaperTap(0.5)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/75 backdrop-blur-sm transition-opacity animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="案卷完整报告阅读器"
    >
      {/* 阅读器主容器 — 纸面风格抽屉 */}
      <div
        className="relative mx-auto flex h-full w-full max-w-5xl flex-col bg-paper shadow-sheet md:my-3 md:h-[calc(100vh-1.5rem)] md:border md:border-paper-line"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* 抽屉顶栏 */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-paper-line bg-paper/95 px-5 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="red-note text-[12px] font-bold shrink-0">
              案卷档案 · 完整报告
            </span>
            <span className="hidden h-3 w-px bg-paper-line sm:inline-block" />
            <span className="truncate font-serif text-[14px] font-bold text-ink sm:text-[15px]">
              {project.title}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-[12px]">
            {/* 外部新标签页备选 */}
            <a
              href={project.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1 text-ink-mute transition-colors hover:text-red sm:inline-flex"
              title="在独立新标签页打开原始报告"
            >
              <span>新标签页打开</span>
              <span className="text-[10px]">↗</span>
            </a>

            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 border border-paper-line bg-white/60 px-3 py-1 text-ink-soft transition-colors hover:border-red hover:text-red"
            >
              <span>收起卷宗</span>
              <span className="font-sans text-[11px] text-ink-faint">✕</span>
            </button>
          </div>
        </header>

        {/* 报告内容承载区 */}
        <div className="relative flex-1 overflow-hidden bg-white">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-paper/90 backdrop-blur-sm">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red border-t-transparent" />
              <p className="mt-3 font-mono text-[11px] text-ink-mute">
                正在展开案卷报告…
              </p>
            </div>
          )}

          <iframe
            src={project.reportUrl}
            title={`${project.title} 完整调研报告`}
            className="h-full w-full border-none"
            onLoad={(e) => {
              setLoading(false)
              try {
                if (e.target && e.target.contentWindow) {
                  e.target.contentWindow.scrollTo(0, 0)
                }
              } catch (err) {
                // 静默处理跨源
              }
            }}
            data-lenis-prevent
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
