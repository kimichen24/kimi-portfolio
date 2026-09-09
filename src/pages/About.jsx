import { useRef } from 'react'
import { profile, experiences, methods, tools } from '../data'
import { RedTick, MarginNote, RedUnderline } from '../components/RedPen'
import { useInkWipe } from '../lib/reveal'
import { playPaperTap } from '../lib/audio'

/**
 * About — 关于页
 * 简介（金句重音 + 叙事手记 + 档案卡）+ 经历时间线 + 方法索引 + 工具台。
 * 时间线用「稿纸装订」的视觉：左侧竖线 + 红色节点刻度。
 */
export default function About() {
  const ref = useRef(null)
  useInkWipe(ref)

  return (
    <main className="w-full pb-4">
      {/* ── 简介 ── */}
      <div ref={ref} className="container-codex pt-14 sm:pt-20">
        <div className="flex items-baseline justify-between border-b border-paper-line pb-4">
          <p className="eyebrow-mono flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
            关于 · About
          </p>
          <button
            type="button"
            onClick={() => {
              playPaperTap(0.7)
              window.print()
            }}
            className="font-mono text-[11px] text-ink-mute hover:text-red transition-colors flex items-center gap-1.5 border border-paper-line bg-white/60 px-3 py-1 cursor-pointer print:hidden"
            title="调起浏览器打印，导出极简纸质求职档案"
          >
            <span>打印纸质档案</span>
            <span className="text-[12px]">⎙</span>
          </button>
        </div>

        <h1
          data-ink-wipe
          className="ink-wipe mt-6 font-serif text-[clamp(2.4rem,6vw,3.8rem)] font-black tracking-tightest text-ink"
        >
          {profile.name}
        </h1>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
          {profile.englishName} · {profile.school} · {profile.location}
        </p>

        {/* 金句重音 — 宋体大字 + 红笔引线 */}
        <div className="mt-8 border-l-2 border-red pl-5 py-1.5 bg-paper-deep/30">
          <blockquote className="font-serif text-[clamp(1.15rem,2.8vw,1.45rem)] font-bold leading-relaxed text-ink">
            “混乱的东西是怎么变得有秩序的——这就是我着迷的唯一一件事。”
          </blockquote>
          <p className="mt-2 font-mono text-[11px] text-ink-mute">
            从音乐采样的祖谱溯源，到二手交易群的流转闭环，再到 15 场深度访谈的痛点提纯。
          </p>
        </div>

        {/* 核心双栏：左叙事手记，右规格参数表 */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12 items-start">
          {/* 左栏：三篇叙事手记 — 去卡片化，回归出版物纯正排印 */}
          <div className="space-y-8 pr-0 lg:pr-4">
            <article className="group">
              <div className="flex items-baseline justify-between border-b border-paper-line pb-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-red tracking-wider">
                    § 01
                  </span>
                  <h2 className="font-serif text-[15px] font-bold text-ink tracking-tight">
                    跨界热情
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  BACKGROUND · 背景转译
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-[2.05] text-ink-soft selection:bg-red/10 sm:text-[14.5px]">
                软件工程在读，但大部分热情花在了运营上——做过音乐采样解析账号（10.66 万自然播放）、管过校园二手群（转化率 12%→38%）、深入访谈过 15 个豆包在校用户。
              </p>
            </article>

            <article className="group">
              <div className="flex items-baseline justify-between border-b border-paper-line pb-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-red tracking-wider">
                    § 02
                  </span>
                  <h2 className="font-serif text-[15px] font-bold text-ink tracking-tight">
                    建立秩序
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  DRIVE · 核心驱动
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-[2.05] text-ink-soft selection:bg-red/10 sm:text-[14.5px]">
                一条采样怎么变成新歌，一个刷屏的群怎么变成顺畅的交易，一堆抱怨怎么变成三个能动手改的 P0。我喜欢在看似混沌的信息流里理出结构，再用数据验证每一个动作的真实价值。
              </p>
            </article>

            <article className="group">
              <div className="flex items-baseline justify-between border-b border-paper-line pb-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-red tracking-wider">
                    § 03
                  </span>
                  <h2 className="font-serif text-[15px] font-bold text-ink tracking-tight">
                    人机协同
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-mute">
                  PHILOSOPHY · 工作哲学
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-[2.05] text-ink-soft selection:bg-red/10 sm:text-[14.5px]">
                AI 是我的第二双手——初稿交给它跑，判断留给自己。省下来的时间用来做第二版、第三版迭代。这个网站本身就是「先做完，再做好」的产物。
              </p>
            </article>
          </div>

          {/* 右栏：规格参数与意向索引（极简排印规格表，去伪存真） */}
          <div className="border-t border-paper-line pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0 space-y-6">
            <div>
              <p className="eyebrow-mono">STATUS · 当前状态</p>
              <p className="mt-2 font-serif text-[15px] font-bold text-ink">实习求职中 · 随时到岗</p>
              <p className="mt-1 font-mono text-[11px] text-ink-mute">保证实习周期 · 具备持续投入韧性</p>
            </div>

            <div className="border-t border-paper-line pt-5">
              <p className="eyebrow-mono">DISCIPLINE · 目标方向</p>
              <p className="mt-2 font-serif text-[15px] font-bold text-ink">产品运营 / 增长与用户调研</p>
              <p className="mt-1 font-mono text-[11px] text-ink-mute">工科背景转译 · 懂代码与数据逻辑</p>
            </div>

            <div className="border-t border-paper-line pt-5">
              <p className="eyebrow-mono">BASE · 所在地</p>
              <p className="mt-2 font-serif text-[15px] font-bold text-ink">湖南 · 长沙</p>
              <p className="mt-1 font-mono text-[11px] text-ink-mute">支持随时异地驻场或远程协作</p>
            </div>

            <div className="border-t border-paper-line pt-5">
              <p className="eyebrow-mono">CREDENTIALS · 资质证明</p>
              <ul className="mt-2 space-y-1.5 font-mono text-[11px] text-ink-soft">
                {profile.honors.map((h) => (
                  <li key={h} className="flex items-center gap-1.5">
                    <span className="text-red">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-paper-line pt-6 print:hidden">
              <a
                href="#/contact"
                onClick={() => playPaperTap(0.6)}
                className="inline-flex items-center gap-2 font-mono text-[12px] font-medium text-ink transition-colors hover:text-red border-b border-ink/40 pb-0.5 hover:border-red"
              >
                <span>写封信聊聊</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
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
