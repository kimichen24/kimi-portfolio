import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import PlaceholderImage from './ui/PlaceholderImage'
import BackButton from './BackButton'
import PageBackground from './ui/PageBackground'
import { usePage } from '../context/PageContext'
import Tilt from './ui/Tilt'
import MagneticButton from './ui/MagneticButton'
import CountUp from './ui/CountUp'
import { primeReveals, buildScrollReveals, prefersReduced } from '../lib/animations'
import { useContent, useUI } from '../data'

/**
 * 项目模块 — 一页一个 · 横向滑动浏览 · 苹果产品展示卡风格
 *
 * - 轮播：scroll-snap 横向滑动，每屏一个项目（手机滑动 / 桌面箭头 + 圆点 + ←→ 键）
 * - 卡片：苹果展示卡 — 顶部色调标识线、封面 hero 化、大字号层次、数据药丸、微交互
 * - 点击「查看详情」进入独立项目详情页（#/project/<id>）
 */
export default function Projects() {
  const { projects, vibeProjects } = useContent()
  const ui = useUI()
  const { navigate } = usePage()
  const [index, setIndex] = useState(0)
  const [filter, setFilter] = useState('all') // 'all' | 'project' | 'experiment'
  const scrollRef = useRef(null)
  const scope = useRef(null)

  // 分类筛选：全部 / 项目（产品研究）/ 实验（Vibe Coding）
  const showProjects = filter === 'all' || filter === 'project'
  const showVibe = filter === 'all' || filter === 'experiment'
  const projCls = showProjects ? '' : 'hidden'
  const vibeCls = showVibe ? '' : 'hidden'

  useGSAP(
    () => {
      if (prefersReduced()) return
      primeReveals(scope.current)
      buildScrollReveals(scope.current)
    },
    { scope },
  )

  const openProject = useCallback((p) => navigate('project', p.id), [navigate])

  // 跳转到第 i 屏（边界保护）
  const goTo = useCallback((i) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, i))
    const el = scrollRef.current
    if (el) el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
    setIndex(clamped)
  }, [])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // 滚动时同步当前索引（节流到每帧一次）
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth)
        setIndex(idx)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // 键盘 ← →
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  return (
    <section
      id="projects"
      ref={scope}
      className="flex min-h-screen w-full flex-col pt-32 pb-20 md:pt-36 md:pb-24"
    >
      <BackButton />

      {/* 项目页背景 — 全站统一的纯黑背景 */}
      <PageBackground />

      <div className="container-page">
        {/* 标题 — 左对齐，不居中模板 */}
        <div
          data-reveal-block
          className="mb-8 md:mb-12"
        >
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 max-w-[48px] bg-ink-300" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
              Projects
            </span>
          </div>
          <h2
            data-reveal="title"
            className="h-display text-3xl tracking-tightest md:text-4xl lg:text-5xl"
          >
            {ui.projects.title}
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-500 md:text-sm">
            {ui.projects.desc}
          </p>
        </div>

        {/* 分类筛选 tab — 全部 / 项目 / 实验（滑动下划线） */}
        <div
          className="relative mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="项目分类筛选"
        >
          {[
            { key: 'all', label: ui.projects.filterAll },
            { key: 'project', label: ui.projects.filterProject },
            { key: 'experiment', label: ui.projects.filterExperiment },
          ].map((t) => {
            const active = filter === t.key
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(t.key)}
                className={`relative rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                  active
                    ? 'border-black/20 text-white'
                    : 'border-black/10 bg-black/[0.03] text-ink-600 hover:border-black/20 hover:text-ink-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="proj-filter-active"
                    className="absolute inset-0 -z-10 rounded-full bg-ink-900"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {t.label}
              </button>
            )
          })}
        </div>

        {/* 轮播区域 */}
        <div
          className={`relative ${projCls}`}
          role="region"
          aria-label="项目轮播，使用左右方向键浏览"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {/* 左箭头（桌面）*/}
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label={ui.projects.prev}
            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.10] bg-black/[0.04] text-ink-600 backdrop-blur-md transition-all duration-300 hover:bg-black/[0.08] hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-25 md:flex"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5 L7 10 L12 15" />
            </svg>
          </button>

          {/* 右箭头（桌面）*/}
          <button
            type="button"
            onClick={next}
            disabled={index === projects.length - 1}
            aria-label={ui.projects.next}
            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/[0.10] bg-black/[0.04] text-ink-600 backdrop-blur-md transition-all duration-300 hover:bg-black/[0.08] hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-25 md:flex"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5 L13 10 L8 15" />
            </svg>
          </button>

          {/* 滑动轨道 */}
          <div
            ref={scrollRef}
            className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          >
            {projects.map((p, idx) => (
              <motion.div
                key={p.id}
                className="w-full shrink-0 snap-center px-3 py-2 md:px-14"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* ── 苹果展示卡（纯玻璃，去掉彩色发光 / 顶线 / 色条） ── */}
                <Tilt className="h-full" max={5}>
                <article
                  className="card-apple-xl group relative mx-auto flex w-full max-w-[1020px] flex-col overflow-hidden md:h-[540px] md:flex-row"
                >

                    {/* ── 封面区（hero 视觉） ── */}
                    <div
                      data-reveal="img"
                      className="relative shrink-0 overflow-hidden md:h-full md:w-[48%]"
                    >
                      {/* 视差层 — 随滚动轻微位移，制造景深（独立于 hover 缩放层） */}
                      <div data-parallax className="h-full w-full">
                        <div className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
                          <PlaceholderImage
                            tone={p.cover.tone}
                            label={p.title}
                            aspect="aspect-[16/10] md:aspect-auto md:h-full"
                            rounded={false}
                          />
                        </div>
                      </div>
                      {/* 编辑式序号 — 左上角超大极淡，强化「第几个」的排版秩序 */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute left-5 top-5 z-10 font-display text-[60px] font-semibold leading-none tracking-tighter text-ink-900/10 md:text-[84px]"
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {/* 封面底部项目名 caption — hover 浮现，翻杂志感 */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-3 bg-gradient-to-t from-black/60 via-black/15 to-transparent px-6 pb-5 pt-12 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="text-[13px] font-medium tracking-wide text-white/90">
                          {p.title}
                        </span>
                      </div>
                      {/* 封面右侧柔边过渡（融入浅色卡片） */}
                      <div
                        className="absolute inset-y-0 right-0 hidden w-10 md:block"
                        style={{
                          background: 'linear-gradient(to right, transparent, rgba(245,245,247,0.75))',
                        }}
                      />
                    </div>

                    {/* ── 内容区 ── */}
                    <div className="relative z-10 flex flex-1 flex-col justify-between p-8 md:p-12 lg:p-14">
                      {/* 上半：文字信息 */}
                      <div>
                        {/* 分类标签 */}
                        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-black/[0.10] bg-black/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink-500">
                          {p.tag}
                        </span>

                        {/* 标题 — 大字号，视觉焦点 */}
                        <h3 className="h-display text-ink-900 mt-3 text-2xl leading-tight tracking-tight md:text-3xl lg:text-4xl">
                          {p.title}
                        </h3>

                        {/* 一句话结论 — 扫一眼即懂价值 */}
                        {p.headline && (
                          <p className="mt-2 text-[15px] font-semibold leading-snug text-ink-900 md:text-base">
                            {p.headline}
                          </p>
                        )}

                        {/* 描述 — 轻量副文本 */}
                        <p className="mt-3 line-clamp-2 text-sm leading-[1.6] text-ink-500 md:line-clamp-3 md:text-base md:text-ink-600">
                          {p.summary}
                        </p>
                      </div>

                      {/* 下半：数据 + 操作 */}
                      <div className="mt-7 md:mt-9">
                        {/* 数据指标行 — 药丸式 */}
                        <div className="flex items-center gap-3">
                          {p.metrics.slice(0, 3).map((m) => (
                            <div key={m.label} className="metric-pill">
                              <CountUp
                                value={m.value}
                                className="text-lg font-semibold leading-none tracking-tight text-ink-900 md:text-xl"
                              />
                              <span className="text-[9px] font-medium uppercase tracking-wider text-ink-500">
                                {m.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* CTA 按钮 — 浅底卡片上的深底按钮，强对比 */}
                        <MagneticButton
                          onClick={() => openProject(p)}
                          className="group/btn mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                        >
                          {ui.projects.detail}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                          >
                            <path d="M3 7H11M8 4L11 7L8 10" />
                          </svg>
                        </MagneticButton>
                      </div>
                    </div>
                  </article>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 计数器 + 极细进度条导航（克制、有呼吸感） */}
        <div className={`mt-10 flex items-center gap-5 ${projCls}`}>
          <div className="shrink-0 text-xs font-medium tabular-nums tracking-[0.2em] text-ink-500">
            {String(index + 1).padStart(2, '0')}
            <span className="mx-1.5 text-ink-400">/</span>
            {String(projects.length).padStart(2, '0')}
          </div>
          <div
            className="relative h-px flex-1 max-w-[260px] bg-black/10"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={projects.length}
            aria-valuenow={index + 1}
            aria-label={ui.projects.progress}
          >
            <div
              className="absolute left-0 top-0 h-full bg-ink-900/70 transition-[width] duration-500 ease-out"
              style={{ width: `${((index + 1) / projects.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ════════ Vibe Coding 实验场 — 轻量网页作品，直接内嵌线上版 ════════ */}
      <div className={`container-page mt-24 md:mt-32 ${vibeCls}`}>
        <div data-reveal-block>
          {/* 标题 — 与作品集同款左对齐排版 */}
          <div className="mb-8 md:mb-12">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px flex-1 max-w-[48px] bg-ink-300" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
              Vibe Coding
            </span>
          </div>
          <h2
            data-reveal="title"
            className="h-display text-3xl tracking-tightest md:text-4xl lg:text-5xl"
          >
            Vibe Coding
          </h2>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-500 md:text-sm">
            {ui.projects.vibeDesc}
          </p>
        </div>

        {/* 项目列表：左信息卡 + 右内嵌预览 */}
        <div className="space-y-8">
          {vibeProjects.map((v) => (
            <div
              key={v.id}
              data-reveal-item
              className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_1fr]"
            >
              {/* 左：项目信息卡 */}
              <div className="card-apple flex flex-col p-7">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-black/[0.10] bg-black/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-ink-500">
                  {v.tag}
                </span>
                <h3 className="h-display text-2xl leading-tight tracking-tight text-ink-900 md:text-3xl">
                  {v.title}
                </h3>
                <p className="mt-1 text-[12px] font-medium tracking-wide text-ink-500">
                  {v.titleEn}
                </p>
                {v.headline && (
                  <p className="mt-2 text-[14px] font-semibold leading-snug text-ink-900">
                    {v.headline}
                  </p>
                )}
                <p className="mt-3 text-sm leading-[1.6] text-ink-500 md:text-ink-600">
                  {v.summary}
                </p>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  {ui.projects.openSite}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  >
                    <path d="M3 7H11M8 4L11 7L8 10" />
                  </svg>
                </a>
              </div>

              {/* 右：iframe 内嵌线上版预览 */}
              <div className="card-apple overflow-hidden p-0">
                <div className="relative h-[400px] w-full md:h-[560px]">
                  <iframe
                    src={v.url}
                    title={`${v.title} · 在线预览`}
                    className="h-full w-full border-0 bg-ink-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
