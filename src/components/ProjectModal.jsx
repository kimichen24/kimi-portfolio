/**
 * ProjectModal — 项目详情弹窗
 *
 * 点击项目卡片后打开，展示完整项目信息：
 * - 封面图 + 标题区（桌面双栏）
 * - 核心工作（卡片式列表）
 * - 量化成果（横向指标）
 * - 补充材料（如该项目有 extras）
 * - 完整报告预览（iframe）
 *
 * 交互：点击遮罩 / 按 ESC / 点关闭按钮 → 关闭
 * 动画：framer-motion AnimatePresence 过渡
 */
import { useEffect, useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlaceholderImage from './ui/PlaceholderImage'
import { useUI } from '../data'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
}

const panel = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    // 有重量的回弹（Apple 弹窗感）
    transition: { type: 'spring', stiffness: 280, damping: 26, delay: 0.04 },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.97,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}

// 面板弹起后，内部内容依次 stagger 进场（标题 → 核心工作 → 指标 → 补充 → 报告）
const contentContainer = {
  hidden: {},
  visible: { transition: { delayChildren: 0.14, staggerChildren: 0.05 } },
}
const contentItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function ProjectModal({ project, open, onClose }) {
  const ui = useUI()
  const handleClose = useCallback(() => onClose?.(), [onClose])

  // 报告 iframe 懒加载：仅当用户滚动到该区块时才加载（避免弹窗一开就拉取重型报告）
  const scrollRef = useRef(null)
  const reportRef = useRef(null)
  const [reportSrc, setReportSrc] = useState(null)
  const [reportExpanded, setReportExpanded] = useState(false)
  const [reportLoaded, setReportLoaded] = useState(false)
  useEffect(() => {
    if (!open || !project?.reportUrl) return
    setReportSrc(null)
    setReportLoaded(false)
    setReportExpanded(false)
    const root = scrollRef.current
    const target = reportRef.current
    if (!root || !target) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReportSrc(project.reportUrl)
          io.disconnect()
        }
      },
      { root, rootMargin: '200px 0px' }
    )
    io.observe(target)
    return () => io.disconnect()
  }, [open, project])

  // ESC 关闭 + body 标记（供 FloatingNav 检测隐藏）
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.body.dataset.modalOpen = 'true'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      delete document.body.dataset.modalOpen
    }
  }, [open, handleClose])

  if (!project) return null

  const isExternalReport = project.reportUrl?.startsWith('http')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={scrollRef}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-8 md:py-14"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* 遮罩 */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* 面板 */}
          <motion.div
            className={`relative z-10 w-full rounded-[2rem] border border-black/10 bg-white p-6 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-9 ${
              reportExpanded ? 'max-w-4xl' : 'max-w-2xl'
            }`}
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
          >
            {/* 关闭按钮 */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-ink-100 text-ink-500 transition-colors hover:bg-ink-200 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 md:right-5 md:top-5"
              aria-label={ui.modal.close}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3L12 12M12 3L3 12" />
              </svg>
            </button>

            {/* ── 顶部：封面 + 标题区（桌面双栏）── */}
            <motion.div variants={contentContainer}>
            <motion.div variants={contentItem} className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
              {/* 封面 */}
              <div className="aspect-[16/10] overflow-hidden rounded-2xl md:aspect-auto md:h-full">
                <PlaceholderImage tone={project.cover.tone} label={project.title} aspect="aspect-[16/10] md:aspect-auto md:h-full" />
              </div>

              {/* 标题区 */}
              <div className="flex flex-col justify-center">
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-600">
                  <span className="h-1 w-1 rounded-full bg-black/40" />
                  {project.tag}
                </div>
                <h2 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-ink-900 md:text-2xl">
                  {project.title}
                </h2>
                <p className="text-[15px] leading-[1.65] text-ink-600">
                  {project.summary}
                </p>
              </div>
            </motion.div>

            {/* ── 核心工作 ── */}
            <motion.section variants={contentItem} className="mt-8 md:mt-10">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                {ui.modal.coreWork}
              </h3>
              <ul className="space-y-3 rounded-2xl border border-black/[0.10] bg-ink-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                {project.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.65] text-ink-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black/40" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* ── 量化成果 ── */}
            <motion.section variants={contentItem} className="mt-7 md:mt-9">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                {ui.modal.keyResults}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col justify-center rounded-2xl border border-black/[0.10] bg-ink-100 p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                  >
                    <span className="text-lg font-semibold tracking-tight text-ink-900 md:text-xl">
                      {m.value}
                    </span>
                    <span className="mt-1 text-[11px] leading-tight text-ink-500">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── 补充材料（仅当项目有 extras）── */}
            {project.extras && project.extras.length > 0 && (
              <motion.section variants={contentItem} className="mt-8 md:mt-10">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                  {ui.modal.extras}
                </h3>
                <div className="space-y-5">
                  {project.extras.map((extra) => (
                    <div
                      key={extra.title}
                      className="rounded-2xl border border-black/[0.10] bg-ink-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                    >
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-ink-900">{extra.title}</h4>
                        {extra.subtitle && (
                          <p className="mt-0.5 text-xs text-ink-500">{extra.subtitle}</p>
                        )}
                      </div>
                      {/* 表格型：对比 / 时序数据 */}
                      {extra.columns ? (
                        <div className="-mx-1 overflow-x-auto px-1">
                          <table className="w-full min-w-[400px] border-collapse text-left">
                            <thead>
                              <tr className="border-b border-black/[0.10]">
                                {extra.columns.map((col, ci) => (
                                  <th
                                    key={col}
                                    scope="col"
                                    className={`pb-2 text-[11px] font-medium text-ink-500 ${
                                      ci === 0 ? 'pr-3' : 'pl-3 text-right'
                                    }`}
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {extra.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-black/[0.06] last:border-0">
                                  {row.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`py-2 text-[13px] leading-[1.5] ${
                                        ci === 0
                                          ? 'pr-3 text-ink-700'
                                          : 'pl-3 text-right tabular-nums text-ink-900'
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                            {extra.footRow && (
                              <tfoot>
                                <tr className="border-t border-black/[0.10]">
                                  {extra.footRow.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`pt-2.5 text-[13px] font-medium leading-[1.5] ${
                                        ci === 0
                                          ? 'pr-3 text-ink-600'
                                          : 'pl-3 text-right tabular-nums text-ink-900'
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      ) : (
                        /* 列表型：定性要点 */
                        <dl className="space-y-2.5">
                          {extra.items.map((item) => (
                            <div
                              key={item.label}
                              className="grid gap-1 md:grid-cols-[minmax(92px,max-content)_1fr] md:gap-4"
                            >
                              <dt className="text-xs font-medium text-ink-500 md:whitespace-nowrap">
                                {item.label}
                              </dt>
                              <dd className="text-[13px] leading-[1.6] text-ink-700">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* 脚注 — 补一句定性结论 */}
                      {extra.note && (
                        <p className="mt-3.5 border-t border-black/[0.08] pt-3 text-xs leading-[1.65] text-ink-500">
                          {extra.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── 完整报告预览 ── */}
            {project.reportUrl && (
              <motion.section variants={contentItem} className="mt-8 md:mt-10">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="10" height="10" rx="2" />
                      <path d="M5 6.5h5M5 9h3" />
                    </svg>
                    {ui.modal.report}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReportExpanded((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:bg-black/[0.08] hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                      aria-label={reportExpanded ? ui.modal.reportCollapse : ui.modal.reportExpand}
                      aria-pressed={reportExpanded}
                    >
                      {reportExpanded ? ui.modal.reportCollapse : ui.modal.reportExpand}
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300">
                        {reportExpanded ? (
                          <path d="M4.5 10.5L10.5 4.5M10.5 4.5H6M10.5 4.5V9" />
                        ) : (
                          <path d="M10.5 4.5L4.5 10.5M4.5 10.5H9M4.5 10.5V6" />
                        )}
                      </svg>
                    </button>
                    <a
                      href={project.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:bg-black/[0.08] hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                      aria-label={ui.modal.reportAria}
                    >
                      {isExternalReport ? ui.modal.openExternal : ui.modal.openNew}
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3.5H3.5V11.5H11.5V9M9 3.5H11.5V6M11.5 3.5L6.5 8.5" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div
                  ref={reportRef}
                  className={`relative overflow-hidden rounded-2xl border border-black/10 bg-ink-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    reportExpanded ? 'h-[78vh] min-h-[520px]' : 'h-[520px] md:h-[640px]'
                  }`}
                >
                  {reportSrc && !reportLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ink-100 text-ink-500">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-ink-900" />
                      <span className="text-xs">{ui.modal.reportLoading}</span>
                    </div>
                  )}
                  <iframe
                    src={reportSrc || undefined}
                    title={`${project.title} 完整报告`}
                    onLoad={() => setReportLoaded(true)}
                    className="h-full w-full border-0 bg-ink-100"
                  />
                </div>
              </motion.section>
            )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
