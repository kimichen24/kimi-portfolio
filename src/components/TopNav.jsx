import { RedUnderline } from './RedPen'

const LINKS = [
  { route: 'home', hash: '#/', label: '首页' },
  { route: 'work', hash: '#/work', label: '作品' },
  { route: 'about', hash: '#/about', label: '关于' },
  { route: 'contact', hash: '#/contact', label: '联系' },
]

/**
 * TopNav — 固定顶栏（个人网站骨架）
 * 纸底毛玻璃；当前页红字 + 红笔下划线（切页时重画一次）。
 * 案卷详情页归入「作品」的高亮范围。
 */
export default function TopNav({ route }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-paper-line bg-paper/85 backdrop-blur-md">
      <div className="container-codex flex h-14 items-center justify-between">
        <a href="#/" className="flex items-baseline gap-2.5" aria-label="回到首页">
          <span className="font-serif text-[17px] font-bold tracking-tight text-ink">
            陈权峰
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute sm:inline">
            Kimi Chen
          </span>
        </a>
        <nav aria-label="主导航" className="flex items-center gap-5 sm:gap-8">
          {LINKS.map((l) => {
            const active = route === l.route || (l.route === 'work' && route === 'project')
            return (
              <a
                key={l.route}
                href={l.hash}
                aria-current={active ? 'page' : undefined}
                className={`relative font-mono text-[13px] transition-colors duration-300 ${
                  active ? 'text-red' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
                {active && <RedUnderline key={route} when delay={120} className="-bottom-[7px]" />}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
