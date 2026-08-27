import { profile } from '../data'
import { RedCircle } from '../components/RedPen'

/** 直达卡 — 平台名 / 账号 / 一句去向说明 */
function VisitCard({ platform, handle, url, desc, external }) {
  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-[17px] font-bold tracking-tight text-ink">{platform}</p>
        <span className="red-note text-[12px] font-semibold">
          {external ? '直达 ↗' : '写信 →'}
        </span>
      </div>
      <p className="mt-1.5 break-all font-mono text-[12px] text-ink-soft">{handle}</p>
      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-mute">{desc}</p>
    </>
  )
  const cls =
    'case-file group block p-6 transition-colors duration-300'
  if (!url) {
    return (
      <div className={cls}>
        {inner}
      </div>
    )
  }
  return (
    <a
      href={url}
      target={external ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={cls}
    >
      {inner}
    </a>
  )
}

/**
 * Contact — 联系页
 * 朋友式的「欢迎来信」：不催、不卖、不面试腔。
 * 求职状态只在首页「此刻」条里安静地存在一行。
 */
export default function Contact() {
  const byPlatform = Object.fromEntries(profile.social.map((s) => [s.platform, s]))
  const douyin = byPlatform['抖音']
  const github = byPlatform['GitHub']
  const wechat = byPlatform['微信']

  return (
    <main className="w-full pb-4">
      <div className="container-codex pt-14 sm:pt-20">
        <p className="eyebrow-mono">联系 · Contact</p>
        <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3.4rem)] font-black tracking-tightest text-ink">
          写封信。
        </h1>
        <p className="mt-5 max-w-xl text-[14px] leading-[1.9] text-ink-soft sm:text-[15px]">
          聊哪份案卷、聊某首采样、或者单纯打个招呼——都欢迎。下面的邮箱长期有效。
        </p>

        {/* 大邮箱 — 最直接的入口 */}
        <a
          href={`mailto:${profile.email}`}
          className="link-annotate mt-12 inline-block font-serif text-[clamp(1.35rem,4vw,2.4rem)] font-bold tracking-tight text-ink"
        >
          {profile.email}
        </a>

        {/* 直达卡：抖音 / GitHub */}
        <div className="mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
          {douyin && (
            <VisitCard
              platform="抖音 · 采样解析"
              handle={douyin.handle}
              url={douyin.url}
              external
              desc="每周更新的采样溯源视频——首页那些「祖谱」的产地。"
            />
          )}
          {github && (
            <VisitCard
              platform="GitHub"
              handle={github.handle}
              url={github.url}
              external
              desc="实习透镜等小玩意的源码，和一些未来的实验。"
            />
          )}
        </div>

        {/* 微信 — 保留文字 + 二维码 */}
        {wechat && (
          <div className="mt-10 flex max-w-3xl flex-wrap items-center gap-6 border-t border-paper-line pt-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widewide text-ink-mute">
                {wechat.platform}
              </p>
              <p className="mt-1.5 break-all font-mono text-[12px] text-ink">{wechat.handle}</p>
              <p className="mt-3 text-[12.5px] text-ink-mute">加好友请注明来意，会通过。</p>
            </div>
            {wechat.qr && (
              <img
                src={wechat.qr}
                alt={`${wechat.platform}二维码`}
                width={96}
                height={96}
                loading="lazy"
                className="border border-paper-line bg-white p-1"
              />
            )}
          </div>
        )}

        {/* 结尾 — 一枚安静的红圈 */}
        <p className="mt-16 border-t border-paper-line pt-6">
          <RedCircle delay={700}>
            <span className="font-mono text-[11px] tracking-wide text-ink-soft">
              回信不快，但一定回。
            </span>
          </RedCircle>
        </p>
      </div>
    </main>
  )
}
