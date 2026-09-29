/**
 * CaseBlocks — 案卷模板的可复用内容块（数据驱动，纯展示）
 *
 * 与 RedPen 同风格：一个文件多个命名导出。
 * ProjectDetail 按 project 字段存在与否条件渲染——
 * 老案卷没有这些字段，自动不渲染，互不影响。
 *
 * FlowSteps    — 研究/工作流程链（researchFlow: string[]）
 * AnalysisGrid — 分析框架卡片组（analysisFramework: {title, desc}[]）
 */

/** 流程链 — 纵排（移动端）/ 横排（桌面），红箭头连接 */
export function FlowSteps({ steps }) {
  return (
    <ol className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex items-baseline gap-2.5 border border-paper-line bg-white/70 px-4 py-2.5 shadow-press">
            <span className="font-mono text-[10px] font-bold text-red">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-serif text-[13.5px] font-bold tracking-tight text-ink">
              {s}
            </span>
          </span>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="font-mono text-[13px] text-red rotate-90 sm:rotate-0 ml-4 sm:ml-0">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}

/** 分析框架 — 2×2 纸片卡片，序号 + 标题 + 一句方法说明 */
export function AnalysisGrid({ items }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <div key={it.title} className="case-file p-5 sm:p-6">
          <div className="flex items-baseline justify-between border-b border-paper-line/70 pb-2.5">
            <span className="font-mono text-[11px] font-bold text-red tracking-wider">
              § {String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-3 font-serif text-[15.5px] font-bold tracking-tight text-ink">
            {it.title}
          </h3>
          <p className="mt-2 text-[12.5px] leading-[1.8] text-ink-soft">{it.desc}</p>
        </div>
      ))}
    </div>
  )
}
