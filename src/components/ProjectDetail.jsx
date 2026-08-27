/**
 * ProjectDetail — 案卷详情（#/project/<id>）
 * 纸质文档版式：安静读完一份卷宗。
 * 报告以「新标签页打开」呈现（不再内嵌 iframe：修复交互被
 * Lenis 样式禁用的 bug，同时避免重型 iframe 拖累加载）。
 */
import { useEffect } from 'react'
import { projects } from '../data'

export default function ProjectDetail({ projectId }) {
  const project = projects.find((p) => p.id === projectId)

  // 无效 id → 回作品列表
  useEffect(() => {
    if (projectId && !project) window.location.hash = '#/work'
  }, [projectId, project])

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
          <div className="flex items-baseline justify-between gap-4">
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
        </header>

        {/* 量化成果 */}
        <section className="mt-12">
          <h2 className="eyebrow-mono">关键结果 / Results</h2>
          <div className="mt-5 grid grid-cols-1 gap-px border border-paper-line bg-paper-line sm:grid-cols-3">
            {project.metrics.map((m) => (
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
          <h2 className="eyebrow-mono">核心工作 / Approach</h2>
          <ol className="mt-5 space-y-4">
            {project.actions.map((a, ai) => (
              <li key={ai} className="flex gap-4 border-l border-paper-line pl-5">
                <span className="red-note -ml-[25px] mt-2 h-[3px] w-4 shrink-0" />
                <p className="text-[14px] leading-[1.9] text-ink-soft md:text-[15px]">{a}</p>
              </li>
            ))}
          </ol>
        </section>

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

        {/* 完整报告 */}
        {project.reportUrl && (
          <section className="mt-12">
            <h2 className="eyebrow-mono">完整报告 / Full Report</h2>
            <a
              href={project.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 flex items-center justify-between gap-4 border border-paper-line bg-white/60 p-6 transition-colors hover:border-red/40 md:p-8"
            >
              <div>
                <p className="font-serif text-[16px] font-bold text-ink md:text-[18px]">
                  {project.title} · 完整调研报告
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-mute">
                  HTML · 新标签页打开 · 含原始数据
                </p>
              </div>
              <span className="red-note shrink-0 text-[13px] font-semibold">
                <span className="link-annotate">打开 ↗</span>
              </span>
            </a>
          </section>
        )}

        {/* 卷尾联络 */}
        <footer className="mt-16 border-t border-paper-line pt-8">
          <p className="font-mono text-[11px] text-ink-mute">
            想聊这份案卷？
            <a href="#/contact" className="link-annotate ml-2 text-red">
              直接写信 →
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
