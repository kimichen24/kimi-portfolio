import { useState, useRef, useEffect } from 'react'
import { profile, projects, quotes, now, samplingNotes } from '../data'
import { RedCircle, RedUnderline, MarginNote } from '../components/RedPen'
import QuoteTicker from '../components/QuoteTicker'
import { useCountUp } from '../lib/reveal'
import { playPaperTap } from '../lib/audio'

/** 数据点 — 横排注脚 + 悬浮/轻触调卷预览（Micro-inspection with Mobile Touch） */
function Stat({ stat, delay, index }) {
  const { value, label, desc, caseTag, previewTitle, previewSnippet, targetUrl, targetLabel } = stat
  const ref = useRef(null)
  const containerRef = useRef(null)
  useCountUp(ref, value)
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef(null)

  const handleOpen = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setIsOpen(true)
    playPaperTap(0.25)
  }

  const handleClose = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  // 移动端触屏轻触切换
  const handleToggle = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return
    setIsOpen((prev) => {
      const next = !prev
      if (next) playPaperTap(0.25)
      return next
    })
  }

  // 移动端点击卡片外部收起
  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [isOpen])

  // 后两项在桌面端右对齐，避免宽屏右溢出
  const isRightAligned = index >= 2

  return (
    <div
      ref={containerRef}
      className="relative group inline-block focus:outline-none focus-visible:ring-1 focus-visible:ring-red/50 rounded-sm"
      tabIndex={0}
      role="button"
      aria-expanded={isOpen}
      aria-label={`${value} ${label}: ${desc}，点击或按回车查看查证详情`}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle(e)
        } else if (e.key === 'Escape' && isOpen) {
          e.preventDefault()
          setIsOpen(false)
        }
      }}
    >
      <div className="flex items-baseline gap-1.5 cursor-pointer transition-transform duration-200 group-hover:-translate-y-0.5 select-none">
        <span
          ref={ref}
          className="font-mono text-[clamp(1.2rem,2.6vw,1.6rem)] font-semibold leading-none text-red group-hover:text-red transition-colors"
        >
          {value}
        </span>
        <span className="font-mono text-[11px] text-ink-mute group-hover:text-ink transition-colors">
          {label}
        </span>
        {/* 移动端常态微弱透出 ↗ 提示可点，桌面端悬停显现 */}
        <span className="font-mono text-[10px] text-red opacity-40 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
          ↗
        </span>
      </div>
      <RedUnderline delay={delay} className="-bottom-2 h-[6px]" />
      <p className="mt-3 font-mono text-[10px] tracking-normal text-ink-faint group-hover:text-ink-mute transition-colors">
        {desc}
      </p>

      {/* 悬浮/轻触调卷预览卡片 (Specimen / Dossier Micro-inspection) */}
      {previewTitle && isOpen && (
        <div
          className={`absolute bottom-full mb-3.5 z-40 w-[calc(100vw-3rem)] max-w-xs sm:max-w-sm border border-ink/20 bg-paper/95 p-4 shadow-press backdrop-blur-md animate-in fade-in slide-in-from-bottom-1 duration-200 ${
            isRightAligned ? 'right-0 sm:right-0 sm:left-auto' : 'left-0'
          }`}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 卡片顶栏：案卷编号/标签 + 移动端关闭叉 */}
          <div className="flex items-center justify-between border-b border-paper-line pb-2">
            <span className="red-note text-[10.5px] font-mono font-bold tracking-wide">
              {caseTag || '物证回溯'}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-ink-mute uppercase tracking-wider hidden sm:inline">
                INSPECTION · 调卷核验
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-ink-mute hover:text-red p-0.5 text-[13px] leading-none transition-colors sm:hidden"
                aria-label="关闭预览"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 标题与核心证据摘录 */}
          <h4 className="mt-2.5 font-serif text-[13px] font-bold tracking-tight text-ink leading-snug">
            {previewTitle}
          </h4>
          <p className="mt-1.5 text-[12px] leading-[1.7] text-ink-soft">
            {previewSnippet}
          </p>

          {/* 直达案卷链接 */}
          {targetUrl && (
            <a
              href={targetUrl}
              onClick={() => playPaperTap(0.5)}
              className="mt-3 flex items-center justify-between border-t border-dashed border-paper-line pt-2.5 font-mono text-[11px] font-medium text-red hover:underline group/link"
            >
              <span>{targetLabel || '翻开案卷查证 →'}</span>
              <span className="text-[12px] transition-transform group-hover/link:translate-x-0.5">→</span>
            </a>
          )}

          {/* 装饰性折纸小角标 */}
          <div
            className={`absolute -bottom-1.5 h-3 w-3 rotate-45 border-b border-r border-ink/20 bg-paper hidden sm:block ${
              isRightAligned ? 'right-8' : 'left-8'
            }`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

/**
 * Home — 首页
 * 个人网站的「门厅」：名字、定位、核心主张（红笔圈注）、
 * 四个真实数据（落笔下划线 + 查证批注）、精选案卷、引语缓流。
 */
export default function Home() {
  return (
    <main className="w-full">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100svh-3.5rem)] w-full flex-col">
        <div className="container-codex flex flex-1 flex-col justify-center py-16 sm:py-20">
          <p className="eyebrow-mono flex items-center gap-2.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
            Personal Site · Est. 2026
          </p>

          <h1 className="mt-7 font-serif text-[clamp(3.2rem,9vw,7rem)] font-black leading-[1.02] tracking-tightest text-ink">
            Kimi Chen
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.32em] text-ink-mute">
            {profile.name} · {profile.location}
          </p>

          <p className="mt-7 max-w-2xl font-serif text-[clamp(1.05rem,2.5vw,1.5rem)] leading-[1.9] text-ink-soft">
            写点东西，做点运营，认真
            <RedCircle delay={1500} className="font-semibold text-ink">
              听用户说话
            </RedCircle>
            。
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#/work"
              className="bg-ink px-7 py-3 font-mono text-[13px] text-paper transition-colors duration-300 hover:bg-red"
            >
              查看作品 →
            </a>
            <a
              href="#/contact"
              className="border border-ink/20 px-7 py-3 font-mono text-[13px] text-ink transition-colors duration-300 hover:border-red hover:text-red"
            >
              写封信
            </a>
          </div>

          {/* 数字速览 — 降为注脚级横排：个人站气质优先，数字为证 */}
          <div className="mt-16 border-t border-paper-line pt-7 sm:mt-20">
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
              {profile.stats.map((s, i) => (
                <Stat key={s.label} stat={s} delay={i * 150} index={i} />
              ))}
            </div>
            <p className="mt-6">
              <MarginNote>每个数字背后，都有一份可以翻开的案卷（悬浮或轻触调卷查证）</MarginNote>
            </p>
          </div>
        </div>

        {/* 引语缓流 — 真实用户原话，纸页下缘的一行呼吸 */}
        <QuoteTicker quotes={quotes} />
      </section>

      {/* ── 此刻 · Now — 让站点保持呼吸的三行 ── */}
      <section className="w-full border-b border-paper-line bg-paper-deep/40">
        <div className="container-codex grid gap-x-10 gap-y-4 py-8 sm:grid-cols-[auto_1fr_1fr_1fr] sm:items-baseline">
          <p className="eyebrow-mono sm:pt-0.5">此刻 · Now</p>
          {now.map((n) => (
            <p key={n.label} className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="red-note shrink-0 text-[11px]">{n.label}</span>
              <span className="text-[13px] leading-relaxed text-ink-soft">{n.value}</span>
            </p>
          ))}
        </div>
      </section>

      {/* ── 采样笔记 — 只有我能写的内容 ── */}
      <section className="w-full py-20 sm:py-24">
        <div className="container-codex">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow-mono">采样笔记 · Sampling Notes</p>
              <h2 className="mt-3 font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-black tracking-tightest text-ink">
                一首歌的祖谱
              </h2>
            </div>
            <a
              href="https://v.douyin.com/sZVo34eBJDM/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 font-mono text-[12px] text-ink-soft transition-colors hover:text-red sm:block"
            >
              采样解析账号 ↗
            </a>
          </div>
          <p className="mt-4 max-w-xl text-[13.5px] leading-[1.9] text-ink-soft">
            做采样解析账号攒下的私人笔记：你听到的那首歌，往往还有一首更老的歌。
          </p>

          <div className="mt-9">
            {samplingNotes.map((s) => (
              <div
                key={s.track}
                className="grid gap-1.5 border-t border-paper-line py-6 md:grid-cols-[minmax(220px,340px)_1fr] md:gap-8"
              >
                <div>
                  <p className="font-serif text-[16px] font-bold tracking-tight text-ink md:text-[17px]">
                    {s.track}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-ink-mute">
                    {s.chain}
                  </p>
                  {s.root && (
                    <p className="font-mono text-[11px] leading-relaxed text-ink-faint">{s.root}</p>
                  )}
                </div>
                <p className="self-center text-[13.5px] leading-[1.85] text-ink-soft">
                  <span className="red-note mr-2">✎</span>
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 精选作品 ── */}
      <section className="w-full border-t border-paper-line py-20 sm:py-24">
        <div className="container-codex">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow-mono">精选作品 · Selected Work</p>
              <h2 className="mt-3 font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-black tracking-tightest text-ink">
                三组案卷
              </h2>
            </div>
            <a
              href="#/work"
              className="hidden shrink-0 font-mono text-[12px] text-ink-soft transition-colors hover:text-red sm:block"
            >
              全部作品 →
            </a>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {projects.map((p, i) => (
              <a
                key={p.id}
                href={`#/project/${p.id}`}
                className="case-file group flex flex-col p-6 md:p-7"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="red-note text-[12px] font-semibold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] tracking-wide text-ink-mute">{p.tag}</span>
                </div>
                <h3 className="relative mt-4 w-fit font-serif text-[18px] font-bold leading-snug tracking-tight text-ink">
                  {p.title}
                  <RedUnderline />
                </h3>
                <p className="mt-2.5 text-[12.5px] font-medium leading-relaxed text-red">
                  {p.headline}
                </p>
                <p className="mt-3 line-clamp-3 text-[13px] leading-[1.8] text-ink-soft">
                  {p.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-paper-line pt-4">
                  {p.metrics.slice(0, 2).map((m) => (
                    <span key={m.label} className="font-mono text-[11px] text-ink">
                      <b className="font-semibold">{m.value}</b>
                      <span className="ml-1 text-ink-mute">{m.label}</span>
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          <a
            href="#/work"
            className="mt-8 inline-block font-mono text-[12px] text-ink-soft transition-colors hover:text-red sm:hidden"
          >
            全部作品 →
          </a>
        </div>
      </section>
    </main>
  )
}
