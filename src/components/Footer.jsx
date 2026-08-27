import { profile } from '../data'

/** Footer — 全站页脚（轻、一行） */
export default function Footer() {
  return (
    <footer className="w-full border-t border-paper-line">
      <div className="container-codex flex flex-col gap-1.5 py-7 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-wide text-ink-mute">
          © 2026 {profile.name} · {profile.englishName}
        </p>
        <p className="font-mono text-[10px] tracking-wide text-ink-mute">
          每一个数字都来自真实项目 · 保留批注权
        </p>
      </div>
    </footer>
  )
}
