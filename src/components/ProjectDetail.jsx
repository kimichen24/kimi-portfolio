/**
 * ProjectDetail — 案卷详情（#/project/<id>）
 * 纸质文档版式：安静读完一份卷宗。
 * 报告以「新标签页打开」呈现（不再内嵌 iframe：修复交互被
 * Lenis 样式禁用的 bug，同时避免重型 iframe 拖累加载）。
 */
import { useEffect, useState } from 'react'
import { projects } from '../data'
import HandBars from './HandChart'
import EvidenceViewer from './EvidenceViewer'
import DossierReader from './DossierReader'
import { FlowSteps, AnalysisGrid } from './CaseBlocks'
import { playPaperSlide, playPaperTap } from '../lib/audio'

export default function ProjectDetail({ projectId }) {
  const [readerOpen, setReaderOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const project = projects.find((p) => p.id === projectId)

  // 无效 id → 回作品列表
  useEffect(() => {
    if (projectId && !project) window.location.hash = '#/work'
  }, [projectId, project])

  // 计算案卷阅读进度百分比（红墨水浸润标尺）
  // 性能：只有整数百分比变化时才 setState——避免 Lenis 平滑滚动下
  // 每帧触发整个案卷页（含物证展台）的重渲染。1% 步进 + CSS 75ms
  // 过渡，视觉上与逐帧更新无差别。
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - window.innerHeight
      const p = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0
      setScrollProgress((prev) => {
        const next = Math.round(p)
        return prev === next ? prev : next
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [projectId])

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="font-mono text-[12px] text-ink-mute">加载案卷…</p>
      </main>
    )
  }

  const i = projects.findIndex((p) => p.id === projectId)

  return (
    <main className="relative min-h-screen w-full">
      {/* 案卷深度阅读标尺 — 顶栏墨水浸润进度条 */}
      <div
        className="fixed left-0 top-14 z-40 h-[2px] w-full bg-paper-line/30 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-red transition-[width] duration-75 ease-out shadow-[0_0_8px_rgba(200,30,30,0.35)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 桌面端浮动微型进度指示标（滚过卷首后轻柔显现） */}
      {scrollProgress > 3 && (
        <aside
          className="fixed right-6 top-[62px] z-30 hidden md:flex items-center gap-1.5 border border-paper-line bg-paper/85 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-widest text-ink-mute backdrop-blur-sm pointer-events-none select-none"
          aria-label={`案卷阅读进度 ${Math.round(scrollProgress)}%`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
          <span>进度 {Math.round(scrollProgress)}%</span>
        </aside>
      )}

      <div className="mx-auto w-full max-w-codex px-6 pb-16 pt-6 sm:px-10 sm:pt-10 lg:px-14">
        {/* 返回 */}
        <a
          href="#/work"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widewide text-ink-mute transition-colors hover:text-red"
        >
          <span className="inline-block h-px w-6 bg-ink-faint transition-colors group-hover:bg-red" />
          返回作品
        </a>

        {/* 卷首 */}
        <header className="mt-12 border-b border-paper-line pb-10 md:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <span className="red-note text-[13px] font-semibold">
              案卷 {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] tracking-wide text-ink-mute">{project.tag}</span>
          </div>
          <h1 className="mt-5 max-w-3xl font-serif text-[clamp(1.7rem,4.4vw,3rem)] font-black leading-tight tracking-tightest text-ink">
            {project.title}
          </h1>
          <p className="mt-4 max-w-3xl font-serif text-[16px] font-semibold leading-relaxed text-red md:text-[18px]">
            {project.headline}
          </p>
          <p className="mt-5 max-w-3xl text-[14px] leading-[1.9] text-ink-soft md:text-[15px]">
            {project.summary}
          </p>
          {project.metricsNote && (
            <div className="mt-6 border-t border-paper-line pt-5">
              <p className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] text-ink">
                {project.metrics.map((m) => <span key={m.label}><b>{m.value}</b> {m.label}</span>)}
              </p>
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-mute">{project.metricsNote}</p>
            </div>
          )}
        </header>

        {project.goal && (
          <section className="mt-12">
            <h2 className="eyebrow-mono">目标 / Goal</h2>
            <p className="mt-5 max-w-3xl text-[14px] leading-[1.9] text-ink-soft md:text-[15px]">{project.goal}</p>
          </section>
        )}

        {/* 量化成果 */}
        <section className="mt-12">
          <h2 className="eyebrow-mono">关键结果 / Results</h2>
          <div className={`mt-5 grid grid-cols-1 gap-px border border-paper-line bg-paper-line ${project.results ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
            {(project.results || project.metrics).map((m) => (
              <div key={m.label} className="bg-white/70 p-6">
                <p className="font-mono text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-none text-ink">
                  {m.value}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widewide text-ink-mute">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 核心工作 */}
        <section className="mt-12">
          <h2 className="eyebrow-mono">{project.goal ? '我的工作 / My Work' : '核心工作 / Approach'}</h2>
          <ol className="mt-5 space-y-4">
            {project.actions.map((a, ai) => (
              <li key={ai} className="flex gap-4 border-l border-paper-line pl-5">
                <span className="red-note -ml-[25px] mt-2 h-[3px] w-4 shrink-0" />
                <p className="text-[14px] leading-[1.9] text-ink-soft md:text-[15px]">{a}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 研究框架 — 从原始信息到决策支持的链路（可选字段） */}
        {project.researchFlow && (
          <section className="mt-12">
            <h2 className="eyebrow-mono">{project.goal ? '方法 / Method' : '研究框架 / Research Framework'}</h2>
            <FlowSteps steps={project.researchFlow} />
          </section>
        )}

        {/* 分析框架 — 竞品研究的切入角度（可选字段） */}
        {project.analysisFramework && (
          <section className="mt-12">
            <h2 className="eyebrow-mono">分析框架 / Analysis Framework</h2>
            <AnalysisGrid items={project.analysisFramework} />
          </section>
        )}

        {/* 复盘反思 — 做完之后的回头看：面试官最爱问的部分 */}
        {project.reflections && project.reflections.length > 0 && (
          <section className="mt-12">
            <h2 className="eyebrow-mono">复盘 / Retrospective</h2>
            <ul className="mt-5 space-y-4 max-w-3xl">
              {project.reflections.map((r, ri) => (
                <li key={ri} className="flex gap-4 border-l-2 border-red/50 bg-paper-deep/20 pl-5 py-2">
                  <p className="text-[14px] leading-[1.9] text-ink-soft md:text-[15px]">{r}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 补充材料 */}
        {project.extras && project.extras.length > 0 && (
          <section className="mt-12">
            <h2 className="eyebrow-mono">补充材料 / Evidence</h2>
            <div className="mt-5 space-y-10">
              {project.extras.map((extra) => (
                <article key={extra.title} className="border-t border-paper-line pt-8">
                  <h3 className="font-serif text-[17px] font-bold tracking-tight text-ink md:text-[19px]">
                    {extra.title}
                  </h3>
                  {extra.subtitle && (
                    <p className="mt-1 font-mono text-[11px] tracking-wide text-ink-mute">
                      {extra.subtitle}
                    </p>
                  )}

                  {extra.chart && <HandBars chart={extra.chart} />}

                  {extra.columns ? (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full min-w-[420px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-ink/20">
                            {extra.columns.map((col) => (
                              <th
                                key={col}
                                scope="col"
                                className="pb-2 pr-4 font-mono text-[10px] font-medium uppercase tracking-widewide text-ink-mute last:text-right"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {extra.rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-paper-line">
                              {row.map((cell, ci) => (
                                <td
                                  key={ci}
                                  className={`py-2.5 pr-4 font-mono text-[12px] ${
                                    ci === 0 ? 'text-ink-soft' : 'text-right tabular-nums text-ink'
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
                            <tr className="border-t border-ink/20">
                              {extra.footRow.map((cell, ci) => (
                                <td
                                  key={ci}
                                  className={`py-2.5 pr-4 font-mono text-[12px] font-semibold ${
                                    ci === 0 ? 'text-ink-soft' : 'text-right tabular-nums text-red'
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
                    <dl className="mt-5 space-y-4">
                      {extra.items.map((item) => (
                        <div
                          key={item.label}
                          className="grid gap-1.5 md:grid-cols-[minmax(120px,max-content)_1fr] md:gap-6"
                        >
                          <dt className="font-mono text-[12px] font-medium text-red">
                            {item.label}
                          </dt>
                          <dd className="text-[13px] leading-[1.8] text-ink-soft md:text-[14px]">
                            {item.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {extra.note && (
                    <p className="mt-5 border-l-2 border-red/60 pl-4 font-mono text-[11px] leading-[1.9] text-ink-mute">
                      {extra.note}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 现场物证展台 */}
        {project.evidence && <EvidenceViewer evidence={project.evidence} />}

        {project.limitations && (
          <section className="mt-14 border-t border-paper-line pt-10">
            <h2 className="eyebrow-mono">限制 / Limitations</h2>
            <ul className="mt-5 max-w-3xl space-y-4">
              {project.limitations.map((limitation) => (
                <li key={limitation} className="border-l-2 border-red/50 bg-paper-deep/20 py-2 pl-5 text-[14px] leading-[1.9] text-ink-soft md:text-[15px]">{limitation}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 在线演示 — 可交互的分析系统 / 作品直达（可选字段） */}
        {project.demoUrl && (
          <section className="mt-14 border-t border-paper-line pt-10">
            <h2 className="eyebrow-mono">在线演示 / Live Demo</h2>
            <div className="mt-5">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playPaperTap(0.8)}
                className="group inline-flex items-center gap-3 bg-ink px-8 py-4 font-mono text-[13px] text-paper transition-colors duration-300 hover:bg-red"
              >
                <span className="font-semibold tracking-wide">{project.demoLabel || 'Open Live Demo'}</span>
                <span className="transition-transform group-hover:translate-x-0.5">↗</span>
              </a>
              <p className="mt-3 max-w-2xl font-mono text-[11px] leading-relaxed text-ink-mute">
                {project.demoDescription || '静态分析站点 · 可交互查看产品列表、指标矩阵与竞品对比'}
              </p>
            </div>
          </section>
        )}

        {/* 完整报告 */}
        {project.reportUrl && (
          <section className="mt-14 border-t border-paper-line pt-10">
            <h2 className="eyebrow-mono">完整报告 / Full Report</h2>
            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  playPaperSlide(0.8)
                  setReaderOpen(true)
                }}
                className="group flex-1 flex items-center justify-between gap-4 border-2 border-ink/20 bg-white/80 p-6 transition-all hover:border-red hover:shadow-sheet md:p-8 text-left cursor-pointer"
              >
                <div>
                  <p className="font-serif text-[16px] font-bold text-ink md:text-[18px]">
                    {project.title} · 完整调研报告
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-ink-mute">
                    站内沉浸式抽屉阅读 · 无缝浏览指标矩阵与完整推导
                  </p>
                </div>
                <span className="red-note shrink-0 font-mono text-[13px] font-semibold">
                  <span className="link-annotate">展开卷宗 →</span>
                </span>
              </button>

              <a
                href={project.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border border-paper-line bg-paper-deep/50 px-5 py-6 font-mono text-[12px] text-ink-mute hover:text-red hover:border-red/40 transition-colors"
                title="在独立新标签页打开"
              >
                <span>独立标签页 ↗</span>
              </a>
            </div>
          </section>
        )}

        {/* 连续阅读心流：上一份 / 下一份案卷 */}
        <section className="mt-14 border-t border-paper-line pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {i > 0 ? (
              <a
                href={`#/project/${projects[i - 1].id}`}
                onClick={() => playPaperTap(0.6)}
                className="group flex flex-col"
              >
                <span className="font-mono text-[10px] uppercase tracking-widewide text-ink-mute">
                  ← 上一份案卷 ({String(i).padStart(2, '0')})
                </span>
                <span className="font-serif text-[14px] font-bold text-ink group-hover:text-red transition-colors mt-0.5">
                  {projects[i - 1].title}
                </span>
              </a>
            ) : (
              <div />
            )}

            {i < projects.length - 1 && (
              <a
                href={`#/project/${projects[i + 1].id}`}
                onClick={() => playPaperTap(0.6)}
                className="group flex flex-col text-right ml-auto"
              >
                <span className="font-mono text-[10px] uppercase tracking-widewide text-ink-mute">
                  下一份案卷 ({String(i + 2).padStart(2, '0')}) →
                </span>
                <span className="font-serif text-[14px] font-bold text-ink group-hover:text-red transition-colors mt-0.5">
                  {projects[i + 1].title}
                </span>
              </a>
            )}
          </div>
        </section>

        {/* 卷尾联络 */}
        <footer className="mt-14 border-t border-paper-line pt-8">
          <p className="font-mono text-[11px] text-ink-mute">
            想聊这份案卷？
            <a href="#/contact" className="link-annotate ml-2 text-red">
              直接写信 →
            </a>
          </p>
        </footer>

        {/* 站内沉浸式案卷报告抽屉 */}
        <DossierReader
          project={project}
          isOpen={readerOpen}
          onClose={() => setReaderOpen(false)}
        />
      </div>
    </main>
  )
}
