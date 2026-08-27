import { profile } from '../data'
import { RedCircle } from '../components/RedPen'

/**
 * Contact — 联系页
 * 求职状态 + 大邮箱 + 线索（含微信二维码）。
 * 状态徽章用红圈注「随时到岗」——批注系统在关键承诺上的落笔。
 */
export default function Contact() {
  return (
    <main className="w-full pb-4">
      <div className="container-codex pt-14 sm:pt-20">
        <p className="eyebrow-mono">联系 · Contact</p>
        <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3.4rem)] font-black tracking-tightest text-ink">
          建立连接。
        </h1>
        <p className="mt-5 max-w-xl text-[14px] leading-[1.9] text-ink-soft sm:text-[15px]">
          正在找产品运营方向的实习 / 校招机会。
          如果你在招人，或者想聊聊哪份案卷——直接写信，通常当天回。
        </p>

        {/* 求职状态 — 红笔圈注的承诺 */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="border border-paper-line bg-white/60 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-ink-soft">
            {profile.location}
          </span>
          <span className="border border-paper-line bg-white/60 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-ink-soft">
            可远程 / 可异地
          </span>
          <RedCircle delay={900}>
            <span className="border border-red/30 bg-red-soft/40 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wide text-red">
              随时到岗
            </span>
          </RedCircle>
        </div>

        {/* 大邮箱 */}
        <a
          href={`mailto:${profile.email}`}
          className="link-annotate mt-12 inline-block font-serif text-[clamp(1.35rem,4vw,2.4rem)] font-bold tracking-tight text-ink"
        >
          {profile.email}
        </a>

        {/* 线索网格 */}
        <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {profile.social.map((s) =>
            s.url ? (
              <a
                key={s.platform}
                href={s.url}
                target={s.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group"
              >
                <p className="font-mono text-[11px] uppercase tracking-widewide text-ink-mute transition-colors group-hover:text-red">
                  {s.platform}
                </p>
                <p className="mt-1.5 break-all font-mono text-[12px] text-ink transition-colors group-hover:text-red">
                  {s.handle}
                </p>
              </a>
            ) : (
              <div key={s.platform}>
                <p className="font-mono text-[11px] uppercase tracking-widewide text-ink-mute">
                  {s.platform}
                </p>
                <p className="mt-1.5 break-all font-mono text-[12px] text-ink">{s.handle}</p>
                {s.qr && (
                  <img
                    src={s.qr}
                    alt={`${s.platform}二维码`}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="mt-3 border border-paper-line bg-white p-1"
                  />
                )}
              </div>
            ),
          )}
        </div>

        {/* 结尾批注 */}
        <p className="mt-16 border-t border-paper-line pt-6 font-mono text-[11px] leading-relaxed text-ink-mute">
          案卷在「作品」页，手记在「手记」页——欢迎随便翻，也欢迎写信聊聊。
        </p>
      </div>
    </main>
  )
}
