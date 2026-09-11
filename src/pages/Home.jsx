import { useState, useRef, useEffect } from 'react'
import { profile, projects, quotes, now, samplingNotes } from '../data'
import { RedCircle, RedUnderline, MarginNote } from '../components/RedPen'
import QuoteTicker from '../components/QuoteTicker'
import { useCountUp } from '../lib/reveal'
import { playPaperTap } from '../lib/audio'

/** 数据点 — 横排注脚 + 悬浮/轻触调卷预览（Micro-inspection with Mobile Touch） */
function Stat({ stat, delay, index }) {
  const { value, label, desc, dimension, caseTag, previewTitle, previewSnippet, targetUrl, targetLabel } = stat
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
      {dimension && (
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-mute/75 block mb-1">
          {dimension}
        </span>
      )}
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
      <p className="mt-3 font-mono text-[10.5px] tracking-normal text-ink-faint group-hover:text-ink-mute transition-colors">
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
 * 基于「作品集讲故事」Landing Page 方法论重构：
 * Node 01: 首屏 · 价值主张 + 定位与名字 + 主行动召唤
 * Node 02: 证明 · 4 个能力模型微故事与引语缓流
 * Node 03: 作品 · 精选案卷（成果优先 Result-First，趁热打铁）
 * Node 04: 特质 · 采样笔记与「此刻」状态（审美与独特个人印记）
 * Node 05: 收尾 · 对话与联络行动召唤（Let's Connect）
 */
export default function Home() {
  const scrollToProjects = (e) => {
    e.preventDefault()
    playPaperTap(0.5)
    const el = document.getElementById('selected-work')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="w-full">
      {/* ── Node 01: Hero 首屏与价值主张 ── */}
      <section className="relative flex min-h-[calc(100svh-3.5rem)] w-full flex-col justify-between">
        <div className="container-codex flex flex-1 flex-col justify-center py-14 sm:py-18">
          <p className="eyebrow-mono flex items-center gap-2.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
            Personal Portfolio · Est. 2026 · {profile.location}
          </p>

          {/* 名字与自我身份 */}
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="font-serif text-[clamp(2.8rem,7.5vw,5.5rem)] font-black leading-[1.05] tracking-tightest text-ink">
              Kimi Chen
            </h1>
            <span className="font-serif text-[clamp(1.4rem,3vw,2.2rem)] font-bold text-ink-mute tracking-tight">
              {profile.name}
            </span>
          </div>

          {/* 核心价值主张（Value Proposition）— 3 秒看懂能力与输出 */}
          <p className="mt-5 font-serif text-[clamp(1.2rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-tight text-ink max-w-3xl">
            {profile.valueProposition}
          </p>

          {/* 具象与温度表达（保留红笔圈注精髓） */}
          <p className="mt-3.5 max-w-2xl font-serif text-[clamp(1.02rem,2.2vw,1.25rem)] leading-[1.85] text-ink-soft">
            写点东西，做点运营，认真
            <RedCircle delay={1500} className="font-semibold text-ink">
              听用户说话
            </RedCircle>
            。
          </p>

          {/* 行动入口（CTA） */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#selected-work"
              onClick={scrollToProjects}
              className="bg-ink px-7 py-3 font-mono text-[13px] text-paper transition-colors duration-300 hover:bg-red inline-flex items-center gap-2"
            >
              <span>查看精选作品 ↓</span>
            </a>
            <a
              href="#/about"
              onClick={() => playPaperTap(0.6)}
              className="border border-ink/20 px-7 py-3 font-mono text-[13px] text-ink transition-colors duration-300 hover:border-red hover:text-red"
            >
              关于我与手记 →
            </a>
            <a
              href="#/contact"
              onClick={() => playPaperTap(0.6)}
              className="px-4 py-3 font-mono text-[13px] text-ink-mute transition-colors duration-300 hover:text-red hidden sm:inline-block"
            >
              联系交流 ↗
            </a>
          </div>

          {/* ── Node 02: 数据墙与能力证明（微故事钩子） ── */}
          <div className="mt-14 border-t border-paper-line pt-7 sm:mt-18">
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-5">
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

      {/* ── Node 03: 精选作品 · Selected Work（趁热打铁，成果优先） ── */}
      <section id="selected-work" className="w-full border-t border-paper-line py-20 sm:py-24 bg-paper/40 scroll-mt-14">
        <div className="container-codex">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-paper-line pb-6">
            <div>
              <p className="eyebrow-mono flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
                精选案卷 · Selected Dossiers
              </p>
              <h2 className="mt-3 font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-black tracking-tightest text-ink">
                三份代表作
              </h2>
              <p className="mt-2 text-[13.5px] text-ink-soft">
                以结果先行的编辑式案卷呈现：先看核心业务产出，再看过程验证与原始物证。
              </p>
            </div>
            <a
              href="#/work"
              onClick={() => playPaperTap(0.6)}
              className="shrink-0 font-mono text-[12px] text-ink-soft transition-colors hover:text-red"
            >
              全部作品库 ({projects.length}) →
            </a>
          </div>

          {/* 成果优先（Result-First）案卷卡片网格 */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => (
              <a
                key={p.id}
                href={`#/project/${p.id}`}
                onClick={() => playPaperTap(0.7)}
                className="case-file group flex flex-col justify-between p-6 sm:p-7 border border-paper-line bg-paper hover:border-red/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div>
                  {/* 顶栏：序号 + 标签 */}
                  <div className="flex items-center justify-between border-b border-paper-line/70 pb-3">
                    <span className="font-mono text-[11px] font-bold text-red tracking-wider">
                      § 0{i + 1}
                    </span>
                    <span className="font-mono text-[10.5px] text-ink-mute tracking-wide">
                      {p.tag}
                    </span>
                  </div>

                  {/* 核心成果钩子（Result-First Hook）— 第一眼抓住读者 */}
                  <div className="mt-4 inline-block">
                    <p className="font-serif text-[14.5px] font-bold leading-snug text-red group-hover:text-red transition-colors">
                      {p.headline}
                    </p>
                  </div>

                  {/* 项目标题 */}
                  <h3 className="mt-2 font-serif text-[18px] sm:text-[19px] font-black leading-snug tracking-tight text-ink group-hover:text-red transition-colors">
                    {p.title}
                  </h3>

                  {/* 简短过程与做法 */}
                  <p className="mt-3 line-clamp-3 text-[13px] leading-[1.8] text-ink-soft">
                    {p.summary}
                  </p>
                </div>

                {/* 卡片底栏：关键指标 + 显性 CTA */}
                <div className="mt-7 pt-4 border-t border-dashed border-paper-line flex items-center justify-between">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {p.metrics.slice(0, 2).map((m) => (
                      <span key={m.label} className="font-mono text-[11px] text-ink">
                        <b className="font-semibold text-ink">{m.value}</b>
                        <span className="ml-1 text-[10px] text-ink-mute">{m.label}</span>
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[11px] font-medium text-red flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>查证案卷</span>
                    <span className="text-[12px]">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Node 04: 个人特质与生活呼吸（采样笔记 + 此刻状态） ── */}
      <section className="w-full border-t border-paper-line py-20 sm:py-24">
        <div className="container-codex">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow-mono">个人特质 · Sampling Notes</p>
              <h2 className="mt-3 font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-black tracking-tightest text-ink">
                采样笔记：一首歌的祖谱
              </h2>
            </div>
            <a
              href="https://v.douyin.com/sZVo34eBJDM/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-[12px] text-ink-soft transition-colors hover:text-red"
            >
              访问抖音音乐账号 (10.66w+) ↗
            </a>
          </div>
          <p className="mt-4 max-w-xl text-[13.5px] leading-[1.9] text-ink-soft">
            做采样解析账号攒下的私人笔记：你听到的那首歌，往往还有一首更老的歌。音乐里的逆向溯源，和业务里的根因分析是同一种直觉。
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

          {/* 此刻 · Now — 保持站点的即时生命力 */}
          <div className="mt-14 border border-paper-line bg-paper-deep/30 p-6 sm:p-8">
            <p className="eyebrow-mono mb-4">此刻 · Now Status</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {now.map((n) => (
                <div key={n.label} className="border-t border-paper-line/70 pt-3 sm:border-t-0 sm:border-l sm:pl-4 first:border-0 first:pl-0">
                  <span className="red-note text-[11px] block">{n.label}</span>
                  <span className="mt-1 text-[13.5px] leading-relaxed text-ink font-serif block">
                    {n.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Node 05: 收尾行动召唤 · Let's Connect ── */}
      <section className="w-full border-t border-paper-line bg-paper-deep/20 py-20 sm:py-24">
        <div className="container-codex max-w-3xl text-center">
          <p className="eyebrow-mono inline-block">CONNECT · 探讨与联络</p>
          <h2 className="mt-4 font-serif text-[clamp(1.7rem,3.8vw,2.6rem)] font-black tracking-tight text-ink">
            想聊聊产品增长、用户研究，<br className="hidden sm:inline" />或者只是一首老歌的采样？
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-[14px] leading-relaxed text-ink-soft">
            正在寻找产品运营 / 增长方向的实习机会。保证充沛实习周期与稳定投入，随时可以到岗。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:kimichen224@163.com"
              onClick={() => playPaperTap(0.6)}
              className="bg-ink px-7 py-3 font-mono text-[13px] text-paper transition-colors duration-300 hover:bg-red inline-flex items-center gap-2"
            >
              <span>发封邮件 kimichen224@163.com</span>
              <span>↗</span>
            </a>
            <a
              href="#/contact"
              onClick={() => playPaperTap(0.6)}
              className="border border-ink/25 bg-paper px-7 py-3 font-mono text-[13px] text-ink transition-colors duration-300 hover:border-red hover:text-red inline-flex items-center gap-2"
            >
              <span>查看微信与完整联系方式 →</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
