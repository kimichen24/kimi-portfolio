import { useRef } from 'react'
import { profile, experiences, methods, tools } from '../data'
import { RedTick, MarginNote, RedUnderline } from '../components/RedPen'
import { useInkWipe } from '../lib/reveal'

/**
 * About — 关于页
 * 简介 + 经历时间线 + 方法索引 + 工具与荣誉。
 * 时间线用「稿纸装订」的视觉：左侧竖线 + 红色节点刻度。
 */
export default function About() {
  const ref = useRef(null)
  useInkWipe(ref)

  return (
    <main className="w-full pb-4">
      {/* ── 简介 ── */}
      <div ref={ref} className="container-codex pt-14 sm:pt-20">
        <p className="eyebrow-mono">关于 · About</p>
        <h1
          data-ink-wipe
          className="ink-wipe mt-4 font-serif text-[clamp(2rem,5vw,3.4rem)] font-black tracking-tightest text-ink"
        >
          {profile.name}
        </h1>
        <p className="mt-3 font-mono text-[11px] tracking-wide text-ink-mute">
          {profile.englishName} · {profile.school} · {profile.location}
        </p>
        <div className="mt-8 max-w-2xl space-y-4">
          {profile.bio.map((p, i) => (
            <p key={i} className="text-[14px] leading-[1.95] text-ink-soft sm:text-[15px]">
              {p}
            </p>
          ))}
        </div>
        <p className="mt-6">
          <MarginNote>{profile.honors.join(' · ')}</MarginNote>
        </p>
      </div>

      {/* ── 经历时间线 ── */}
      <section className="container-codex mt-16 md:mt-24">
        <p className="eyebrow-mono">经历 · Experience</p>
        <div className="mt-10 space-y-14">
          {experiences.map((exp) => (
            <article key={exp.id} className="relative border-l border-paper-line pl-7 md:pl-10">
              {/* 节点 — 红色刻度 */}
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border-2 border-red bg-paper"
              />
              <p className="font-mono text-[11px] tracking-wide text-red">
                {exp.period} · {exp.tag}
              </p>
              <h2 className="mt-2.5 font-serif text-[19px] font-bold tracking-tight text-ink md:text-[22px]">
                {exp.title}
              </h2>
              <ul className="mt-5 max-w-2xl space-y-2.5">
                {exp.points.map((pt, i) => (
                  <li key={i} className="flex gap-3.5">
                    <RedTick />
                    <span className="text-[13.5px] leading-[1.8] text-ink-soft md:text-[14px]">
                      {pt}
                    </span>
                  </li>
                ))}
              </ul>
              {exp.metrics && (
                <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2">
                  {exp.metrics.map((m) => (
                    <span key={m.label} className="font-mono text-[12px] text-ink">
                      <b className="font-semibold">{m.value}</b>
                      <span className="ml-1.5 text-ink-mute">{m.label}</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                {exp.link && (
                  <a
                    href={exp.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-ink-soft transition-colors hover:text-red"
                  >
                    <span className="link-annotate">{exp.link.label} ↗</span>
                  </a>
                )}
                {exp.highlight && <MarginNote>{exp.highlight}</MarginNote>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 方法索引 ── */}
      <section className="container-codex mt-20 md:mt-28">
        <p className="eyebrow-mono">方法 · Method</p>
        <p className="mt-4 max-w-xl text-[14px] leading-[1.9] text-ink-soft sm:text-[15px]">
          做事方式的六个词条。<span className="text-ink">每一件后面都跟着它的证据。</span>
        </p>
        <div className="mt-10">
          {methods.map((m) => (
            <div key={m.no} className="index-row">
              <span className="red-note pt-1 text-[13px] font-semibold md:text-[15px]">
                {m.no}
              </span>
              <div>
                <h3 className="relative w-fit font-serif text-[18px] font-bold tracking-tight text-ink md:text-[21px]">
                  {m.title}
                  <RedUnderline />
                  <span className="ml-3 font-mono text-[11px] font-normal uppercase tracking-widewide text-ink-faint">
                    {m.titleEn}
                  </span>
                </h3>
                <p className="mt-2.5 max-w-2xl text-[13px] leading-[1.8] text-ink-soft md:text-[14px]">
                  {m.desc}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-wide text-red">{m.proof}</p>
              </div>
            </div>
          ))}
          <div className="h-px w-full bg-paper-line" />
        </div>

        {/* 工具行 */}
        <div className="mt-12 flex flex-wrap items-baseline gap-x-3 gap-y-2.5">
          <span className="eyebrow-mono mr-2">工具台 /</span>
          {tools.map((t) => (
            <span
              key={t}
              className="border border-paper-line px-2.5 py-1 font-mono text-[11px] text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}
