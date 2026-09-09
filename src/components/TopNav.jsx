import { RedUnderline } from './RedPen'
import { playPaperTap } from '../lib/audio'

const LINKS = [
  { route: 'home', hash: '#/', label: '首页' },
  { route: 'notes', hash: '#/notes', label: '手记' },
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
        <a
          href="#/"
          onClick={() => playPaperTap(0.6)}
          className="flex items-baseline gap-2.5"
          aria-label="回到首页"
        >
          <span className="font-serif text-[17px] font-bold tracking-tight text-ink">Kimi Chen</span>
          <span className="hidden font-mono text-[10px] tracking-[0.22em] text-ink-mute sm:inline">
            陈权峰
          </span>
        </a>
        <nav aria-label="主导航" className="flex items-center gap-2 sm:gap-6">
          {LINKS.map((l) => {
            const active = route === l.route || (l.route === 'work' && route === 'project')
            return (
              <a
                key={l.route}
                href={l.hash}
                onClick={() => playPaperTap(0.6)}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex items-center justify-center py-2.5 px-2 font-mono text-[13px] transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-red/50 ${
                  active ? 'text-red' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
                {active && <RedUnderline key={route} when delay={120} className="bottom-0.5" />}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
