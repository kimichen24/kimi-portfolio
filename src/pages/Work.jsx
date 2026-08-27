import { useRef } from 'react'
import { projects, vibeProjects } from '../data'
import { RedUnderline, MarginNote } from '../components/RedPen'
import { useInkWipe } from '../lib/reveal'

/**
 * Work — 作品页
 * 三组案卷（全宽列表）+ 附卷（Vibe Coding）。
 * 每份案卷：编号、标题（hover 红笔画线）、结论、证据入口。
 */
export default function Work() {
  const ref = useRef(null)
  useInkWipe(ref)

  return (
    <main className="w-full pb-4">
      <div ref={ref} className="container-codex pt-14 sm:pt-20">
        <p className="eyebrow-mono">作品 · Work</p>
        <h1
          data-ink-wipe
          className="ink-wipe mt-4 font-serif text-[clamp(2rem,5vw,3.4rem)] font-black tracking-tightest text-ink"
        >
          三组案卷
        </h1>
        <p className="mt-5 max-w-xl text-[14px] leading-[1.9] text-ink-soft sm:text-[15px]">
          每份案卷都是一段完整的「输入 → 编码 → 输出」：原始素材、分析方法、可验证的结果。
          <span className="text-ink">点开任一份查证。</span>
        </p>
      </div>

      {/* 案卷列表 */}
      <div className="container-codex mt-12 space-y-5 md:mt-16 md:space-y-6">
        {projects.map((p, i) => (
          <a key={p.id} href={`#/project/${p.id}`} className="case-file group block p-7 md:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="red-note text-[13px] font-semibold">
                案卷 {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[11px] tracking-wide text-ink-mute">{p.tag}</span>
            </div>
            <h2 className="relative mt-4 w-fit font-serif text-[22px] font-bold leading-snug tracking-tight text-ink md:text-[26px]">
              {p.title}
              <RedUnderline className="-bottom-[5px]" />
            </h2>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-red md:text-[15px]">
              {p.headline}
            </p>
            <p className="mt-3 max-w-3xl text-[13.5px] leading-[1.85] text-ink-soft md:text-[14px]">
              {p.summary}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-paper-line pt-5">
              {p.metrics.map((m) => (
                <span key={m.label} className="font-mono text-[12px] text-ink">
                  <b className="font-semibold">{m.value}</b>
                  <span className="ml-1.5 text-ink-mute">{m.label}</span>
                </span>
              ))}
              <span className="ml-auto font-mono text-[11px] text-red opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                展开案卷 →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* 附卷 · Vibe Coding */}
      <div className="container-codex mt-16 md:mt-24">
        <p className="eyebrow-mono">附卷 · Vibe Coding</p>
        {vibeProjects.map((v) => (
          <a
            key={v.id}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="case-file group mt-5 block p-7 md:p-9"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="relative w-fit font-serif text-[20px] font-bold tracking-tight text-ink md:text-[23px]">
                {v.title}
                <RedUnderline className="-bottom-[5px]" />
              </h2>
              <span className="font-mono text-[11px] text-ink-mute">{v.tag}</span>
            </div>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-red">{v.headline}</p>
            <p className="mt-3 max-w-3xl text-[13.5px] leading-[1.85] text-ink-soft md:text-[14px]">
              {v.summary}
            </p>
            <div className="mt-6 flex items-center gap-6 border-t border-paper-line pt-5">
              <MarginNote>单文件 · 零依赖 · 可离线运行</MarginNote>
              <span className="ml-auto font-mono text-[11px] text-red opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                访问线上版 ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
