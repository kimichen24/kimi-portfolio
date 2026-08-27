import { useState } from 'react'

/**
 * QuoteTicker — 引语缓流（可交互）
 * 收起态：一行缓慢横流的真实原声；hover 暂停，点击展开。
 * 展开态：全部原声的静态清单——原话、出处、它当时意味着什么。
 * 从「背景音乐」变成可以驻足翻阅的东西。
 */
export default function QuoteTicker({ quotes }) {
  const [open, setOpen] = useState(false)
  const line = quotes.map((q) => q.text).join('　·　')

  if (open) {
    return (
      <div className="border-t border-paper-line">
        <div className="container-codex py-7">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow-mono">原声 · Voices</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-[11px] text-ink-mute transition-colors hover:text-red"
            >
              收起 ↓
            </button>
          </div>
          <ul className="mt-5 grid gap-x-10 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
            {quotes.map((q) => (
              <li key={q.text} className="flex flex-col">
                <p className="font-serif text-[14px] leading-[1.85] text-ink">「{q.text}」</p>
                <p className="mt-2 font-mono text-[11px] text-ink-mute">{q.source}</p>
                <p className="mt-1 font-mono text-[11px] text-red">{q.context}</p>
              </li>
            ))}
          </ul>
          <p className="mt-7">
            <span className="red-note text-[10px]">
              全部取自真实项目的原始素材——每一条都对应作品页的一份案卷
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="quote-wrap relative cursor-pointer border-t border-paper-line py-3.5 transition-colors hover:bg-paper-deep/40"
      role="button"
      tabIndex={0}
      aria-label="展开全部用户原声"
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen(true)
        }
      }}
    >
      <div className="overflow-hidden" aria-hidden="true">
        <div className="quote-track flex w-max">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="shrink-0 whitespace-nowrap font-mono text-[11px] tracking-wide text-ink-mute"
            >
              {line}　·　
            </span>
          ))}
        </div>
      </div>
      {/* 边缘渐隐 + 展开提示 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-gradient-to-l from-paper via-paper/80 to-transparent pr-3">
        <span className="font-mono text-[10px] text-ink-faint">展开 ↕</span>
      </div>
    </div>
  )
}
