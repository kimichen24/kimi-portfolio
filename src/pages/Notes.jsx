import { useRef } from 'react'
import { notes } from '../data'
import { RedUnderline, MarginNote } from '../components/RedPen'
import { useInkWipe } from '../lib/reveal'

/**
 * Notes — 手记页
 * 笔记体短文，一页一篇纵排；每篇有一句「划线句」被红笔画过，
 * 脚注回溯到对应案卷——手记与作品互为索引。
 */
export default function Notes() {
  const ref = useRef(null)
  useInkWipe(ref)

  return (
    <main className="w-full pb-4">
      <div ref={ref} className="container-codex pt-14 sm:pt-20">
        <p className="eyebrow-mono">手记 · Notes</p>
        <h1
          data-ink-wipe
          className="ink-wipe mt-4 font-serif text-[clamp(2rem,5vw,3.4rem)] font-black tracking-tightest text-ink"
        >
          先做完，再写下来。
        </h1>
        <p className="mt-5 max-w-xl text-[14px] leading-[1.9] text-ink-soft sm:text-[15px]">
          做完一件事之后，把过程中最值得留的那一课记下来。
          <span className="text-ink">数字都能回溯到作品页的案卷。</span>
        </p>
      </div>

      <div className="container-codex mt-14 md:mt-20">
        {notes.map((n, i) => (
          <article
            key={n.id}
            id={n.id}
            className={`scroll-mt-24 ${i > 0 ? 'mt-16 border-t border-paper-line pt-14 md:mt-20 md:pt-20' : ''}`}
          >
            {/* 篇头 */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="red-note text-[12px] font-semibold">{n.no}</span>
              <span className="font-mono text-[11px] tracking-wide text-ink-mute">{n.tag}</span>
            </div>
            <h2 className="mt-3 font-serif text-[clamp(1.3rem,3.2vw,1.9rem)] font-black tracking-tight text-ink">
              {n.title}
            </h2>

            {/* 正文 — 笔记体 */}
            <div className="mt-6 max-w-2xl space-y-5">
              {n.paragraphs.map((p, j) => (
                <p key={j} className="text-[14px] leading-[2.05] text-ink-soft sm:text-[15px]">
                  {p}
                </p>
              ))}
            </div>

            {/* 划线句 — 红笔在本篇留下的批注 */}
            <p className="mt-8 max-w-2xl">
              <span className="relative inline-block bg-paper-deep/70 px-1.5 py-1 font-serif text-[15px] font-bold leading-relaxed tracking-tight text-ink sm:text-[16px]">
                {n.highlight}
                <RedUnderline delay={350} className="-bottom-[1px] h-[7px]" />
              </span>
            </p>

            {/* 脚注 — 回溯到案卷 */}
            <p className="mt-8">
              <MarginNote>{n.footnote}</MarginNote>
            </p>
          </article>
        ))}

        {/* 尾注 */}
        <p className="mt-20 border-t border-paper-line pt-7 font-mono text-[11px] leading-relaxed text-ink-mute">
          手记不定期更新——多半是某个项目做完的当晚。
        </p>
      </div>
    </main>
  )
}
