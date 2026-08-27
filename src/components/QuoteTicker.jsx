/**
 * QuoteTicker — 引语缓流
 * 首屏底部一行：真实项目里的用户原话，极慢地横向漂移。
 * 灰色等宽小字 + 朱红间隔点，是「噪声」概念最克制的存留：
 * 不再铺满全屏，只在纸页下缘留一条呼吸的痕迹。
 */
export default function QuoteTicker({ quotes }) {
  const line = quotes.map((q) => q.text).join('　·　')
  return (
    <div
      className="relative overflow-hidden border-t border-paper-line py-3.5"
      aria-hidden="true"
    >
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
      {/* 边缘渐隐 — 让引语像从纸页两侧渗出又消散 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-paper to-transparent" />
    </div>
  )
}
