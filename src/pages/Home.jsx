import { useRef } from 'react'
import { profile, projects, quotes } from '../data'
import { RedCircle, RedUnderline, MarginNote } from '../components/RedPen'
import QuoteTicker from '../components/QuoteTicker'
import { useCountUp } from '../lib/reveal'

/** 数据格 — 红笔重点：数字 + 落笔下划线 + 查证批注 */
function Stat({ value, label, desc, delay }) {
  const ref = useRef(null)
  useCountUp(ref, value)
  return (
    <div className="relative">
      <div
        ref={ref}
        className="font-mono text-[clamp(1.5rem,3.4vw,2.3rem)] font-semibold leading-none text-red"
      >
        {value}
      </div>
      <RedUnderline delay={delay} className="-bottom-2.5 h-[7px]" />
      <p className="mt-3.5 font-mono text-[10px] uppercase tracking-widewide text-ink-mute">
        {label}
        <span className="mt-0.5 block normal-case tracking-normal text-ink-faint">{desc}</span>
      </p>
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
            产品运营 · 求职中 · 长沙 · 可即刻到岗
          </p>

          <h1 className="mt-7 font-serif text-[clamp(3.6rem,11vw,8rem)] font-black leading-[1.02] tracking-tightest text-ink">
            {profile.name}
          </h1>

          <p className="mt-6 max-w-2xl font-serif text-[clamp(1.02rem,2.4vw,1.45rem)] leading-[1.9] text-ink-soft">
            把内容做出来，把社群管起来，
            <RedCircle delay={1500} className="font-semibold text-ink">
              把用户声音变成产品动作
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
              联系我
            </a>
          </div>

          {/* 数据速览 — 红笔批注的重点 */}
          <div className="mt-16 sm:mt-20">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-10">
              {profile.stats.map((s, i) => (
                <Stat key={s.label} value={s.value} label={s.label} desc={s.desc} delay={i * 150} />
              ))}
            </div>
            <p className="mt-7">
              <MarginNote>数字均来自真实项目，点开案卷即可查证</MarginNote>
            </p>
          </div>
        </div>

        {/* 引语缓流 — 真实用户原话，纸页下缘的一行呼吸 */}
        <QuoteTicker quotes={quotes} />
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
