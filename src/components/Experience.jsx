import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { experiences } from '../data/content'
import BackButton from './BackButton'
import PageBackground from './ui/PageBackground'
import { primeReveals, buildScrollReveals, prefersReduced } from '../lib/animations'

/**
 * 经历模块 — 时间线排版
 * 宽屏：左右分栏（左时间 / 右内容，中间竖线分隔）
 * 移动端：上下排列（时间在上，内容在下）
 */
export default function Experience() {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (prefersReduced()) return
      primeReveals(scope.current)
      buildScrollReveals(scope.current)
    },
    { scope },
  )

  return (
    <section
      id="experience"
      ref={scope}
      className="relative flex min-h-screen w-full flex-col pt-28 pb-20 md:pt-36 md:pb-24"
    >
      <BackButton />

      {/* 经历页背景 — 全站统一的柔白底 + 纯黑弯曲带 */}
      <PageBackground />

      <div className="container-page">
        {/* ════ 顶部标题（左对齐，跟随时间线内容） ════ */}
          <div
            data-reveal-block
            className="mb-20 md:mb-28"
          >
          <span className="eyebrow mb-3 inline-block">Experience · 实践轨迹</span>
          <h1
            data-reveal="title"
            className="h-display text-4xl font-bold tracking-tight text-ink-900 md:text-5xl lg:text-6xl"
          >
            经历
          </h1>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-ink-500 md:text-[15px]">
            两段核心经历——自媒体独立运营 + 校园主持，从 0 到 1 积累了内容、用户和现场经验。
          </p>
        </div>

        {/* ════ 时间线主体 ════ */}
        <div className="mx-auto max-w-4xl">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              data-reveal-item
              className="relative grid grid-cols-1 gap-3 pb-16 last:pb-0 lg:grid-cols-[220px_1fr] lg:gap-12 lg:pb-24"
            >
              {/* ── 左侧：年份大字号极淡 + 时间（宽屏右对齐） ── */}
              <div className="lg:pr-10 lg:text-right">
                <div className="font-display text-[44px] font-semibold leading-none tracking-tight text-ink-900 md:text-[56px]">
                  {exp.period.split('-')[0]}
                </div>
                <div className="mt-2 text-[13px] font-medium tracking-wide text-ink-500">
                  {exp.period}
                </div>
                {exp.tag && (
                  <div className="mt-1.5 text-xs text-ink-400">{exp.tag}</div>
                )}
              </div>

              {/* ── 右侧：主体内容（竖线分隔 + 节点） ── */}
              <div className="relative lg:border-l lg:border-black/10 lg:pl-10">
                {/* 时间线节点 — 落在竖线上，克制的小圆点 */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-[#eceef1] bg-ink-900/40 lg:block"
                />
                {/* 岗位名称 — 加粗深色 */}
                <h2 className="text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">
                  {exp.title}
                </h2>

                {/* 描述 — 圆点列表，短句拆分，常规字重 */}
                <ul className="mt-4 space-y-3">
                  {exp.points.map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-[15px] leading-relaxed text-ink-600 md:text-base"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                {/* 量化数据 — 干净白卡，宽度细微差异化弱化模板感 */}
                {exp.metrics && (
                  <div className="mt-7 flex flex-wrap gap-3 sm:gap-4">
                    {exp.metrics.map((m, i) => (
                      <div
                        key={m.label}
                        className={`card-apple relative overflow-hidden rounded-2xl p-5 ${i % 3 === 0 ? 'min-w-[150px] flex-[1.35]' : 'min-w-[120px] flex-1'}`}
                      >
                        {/* 极细顶部强调线（克制、点到为止） */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
                        />
                        <div className="font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-[1.7rem]">
                          {m.value}
                        </div>
                        <div className="mt-1 text-xs leading-snug text-ink-500">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 文字强调（无量化数据的条目） */}
                {exp.highlight && (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-2 text-sm text-ink-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                    {exp.highlight}
                  </div>
                )}
                {/* 外链按钮 */}
                {exp.link && (
                  <a
                    href={exp.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-ink-700 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30"
                  >
                    {exp.link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
