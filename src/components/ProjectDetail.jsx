/**
 * ProjectDetail — 独立项目详情页（整页，非弹窗）
 *
 * 点击项目卡片后 navigate('project', id) 进入本页（#/project/<id>）。
 * 整页全宽渲染项目内容，报告预览 iframe 占满内容区且高度充足，
 * 访问者可在一个页面内舒服读完所有信息（含完整报告），无需弹窗或跳转。
 *
 * 顶部「返回」按钮回到 projects 页；无效 id 自动回跳。
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PlaceholderImage from './ui/PlaceholderImage'
import PageBackground from './ui/PageBackground'
import { useContent, useUI } from '../data'
import { usePage } from '../context/PageContext'

export default function ProjectDetail() {
  const { projectId, navigate } = usePage()
  const { projects } = useContent()
  const ui = useUI()
  const project = projects.find((p) => p.id === projectId)

  const reportRef = useRef(null)
  const [reportSrc, setReportSrc] = useState(null)
  const [reportLoaded, setReportLoaded] = useState(false)

  // 无效 id → 回 projects
  useEffect(() => {
    if (!project) navigate('projects')
  }, [project, navigate])

  // 进入即加载报告（整页，不依赖滚动懒加载）
  useEffect(() => {
    if (project?.reportUrl) {
      setReportSrc(project.reportUrl)
    }
    return () => {
      setReportSrc(null)
      setReportLoaded(false)
    }
  }, [project])

  if (!project) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-ink-900" />
      </section>
    )
  }

  const isExternalReport = project.reportUrl?.startsWith('http')

  return (
    <section
      id="project-detail"
      className="flex min-h-screen w-full flex-col pt-28 pb-20 md:pt-32 md:pb-24"
    >
      <PageBackground />

      <div className="container-page">
        {/* 返回 projects */}
        <button
          type="button"
          onClick={() => navigate('projects')}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all hover:bg-ink-100 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          {ui.backToProjects}
        </button>

        {/* ── 顶部：封面 + 标题区（桌面双栏）── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8"
        >
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
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-10"
        >
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
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 md:mt-9"
        >
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
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 md:mt-10"
          >
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

        {/* ── 完整报告预览（整页全宽，大高度，访问者舒服读完）── */}
        {project.reportUrl && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 md:mt-10"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="2.5" width="10" height="10" rx="2" />
                  <path d="M5 6.5h5M5 9h3" />
                </svg>
                {ui.modal.report}
              </h3>
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
            <div
              ref={reportRef}
              className="relative overflow-hidden rounded-2xl border border-black/10 bg-ink-100"
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
                className="h-[80vh] min-h-[560px] w-full border-0 bg-ink-100"
              />
            </div>
          </motion.section>
        )}
      </div>
    </section>
  )
}
