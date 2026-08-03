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
import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PlaceholderImage from './ui/PlaceholderImage'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
}

const panel = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
}

export default function ProjectModal({ project, open, onClose }) {
  const handleClose = useCallback(() => onClose?.(), [onClose])

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
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-8 md:py-14"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* 遮罩 */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* 面板 */}
          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-black/10 bg-[#f6f7f9] p-6 shadow-2xl md:p-9"
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
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 text-ink-600 transition-colors hover:bg-black/10 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 md:right-5 md:top-5"
              aria-label="关闭"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3L12 12M12 3L3 12" />
              </svg>
            </button>

            {/* ── 顶部：封面 + 标题区（桌面双栏）── */}
            <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
              {/* 封面 */}
              <div className="aspect-[16/10] overflow-hidden rounded-2xl md:aspect-auto md:h-full">
                <PlaceholderImage tone={project.cover.tone} label={project.title} aspect="aspect-[16/10] md:aspect-auto md:h-full" />
              </div>

              {/* 标题区 */}
              <div className="flex flex-col justify-center">
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-700">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  {project.tag}
                </div>
                <h2 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-ink-900 md:text-2xl">
                  {project.title}
                </h2>
                <p className="text-[15px] leading-[1.65] text-ink-600">
                  {project.summary}
                </p>
              </div>
            </div>

            {/* ── 核心工作 ── */}
            <section className="mt-8 md:mt-10">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                核心工作
              </h3>
              <ul className="space-y-3 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                {project.actions.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] leading-[1.65] text-ink-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/70" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── 量化成果 ── */}
            <section className="mt-7 md:mt-9">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                关键成果
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col justify-center rounded-2xl border border-black/[0.06] bg-white p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
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
            </section>

            {/* ── 补充材料（仅当项目有 extras）── */}
            {project.extras && project.extras.length > 0 && (
              <section className="mt-8 md:mt-10">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                  补充材料
                </h3>
                <div className="space-y-5">
                  {project.extras.map((extra) => (
                    <div
                      key={extra.title}
                      className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
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
                              <tr className="border-b border-black/[0.08]">
                                {extra.columns.map((col, ci) => (
                                  <th
                                    key={col}
                                    scope="col"
                                    className={`pb-2 text-[11px] font-medium text-ink-400 ${
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
                                <tr key={ri} className="border-b border-black/[0.04] last:border-0">
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
                              <dt className="text-xs font-medium text-ink-400 md:whitespace-nowrap">
                                {item.label}
                              </dt>
                              <dd className="text-[13px] leading-[1.6] text-ink-700">{item.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* 脚注 — 补一句定性结论 */}
                      {extra.note && (
                        <p className="mt-3.5 border-t border-black/[0.05] pt-3 text-xs leading-[1.65] text-ink-500">
                          {extra.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── 完整报告预览 ── */}
            {project.reportUrl && (
              <section className="mt-8 md:mt-10">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="10" height="10" rx="2" />
                      <path d="M5 6.5h5M5 9h3" />
                    </svg>
                    完整报告预览
                  </h3>
                  <a
                    href={project.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:bg-black/[0.08] hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"
                    aria-label="在新标签页打开完整报告"
                  >
                    {isExternalReport ? '访问公开报告' : '新标签页打开'}
                    <svg width="12" height="12" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3.5H3.5V11.5H11.5V9M9 3.5H11.5V6M11.5 3.5L6.5 8.5" />
                    </svg>
                  </a>
                </div>
                <iframe
                  src={project.reportUrl}
                  title={`${project.title} 完整报告`}
                  loading="lazy"
                  className="h-[420px] w-full rounded-2xl border border-black/10 bg-black/[0.03] md:h-[500px]"
                />
              </section>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
