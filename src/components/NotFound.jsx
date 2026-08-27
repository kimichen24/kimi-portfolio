/**
 * NotFound — 404 兜底页（稿纸风：这一页还没落笔）
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="red-note text-[12px] uppercase tracking-widewide">Page Not Found</p>
      <h1 className="mt-5 font-serif text-[clamp(2.2rem,6vw,4rem)] font-black tracking-tightest text-ink">
        404 · 未落笔
      </h1>
      <p className="mt-4 max-w-sm text-[14px] leading-[1.9] text-ink-soft">
        这一页还没有被写上。回到首页，从那里继续。
      </p>
      <a href="#/" className="mt-9 font-mono text-[12px] uppercase tracking-widewide text-red">
        <span className="link-annotate">返回首页 →</span>
      </a>
    </main>
  )
}
