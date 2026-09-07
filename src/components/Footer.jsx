import { useState } from 'react'
import { profile } from '../data'
import { isAudioEnabled, setAudioEnabled } from '../lib/audio'

/** Footer — 全站页脚（轻、一行，含纸声微开关） */
export default function Footer() {
  const [audioOn, setAudioOn] = useState(isAudioEnabled)

  const toggleAudio = () => {
    const next = !audioOn
    setAudioEnabled(next)
    setAudioOn(next)
  }

  return (
    <footer className="w-full border-t border-paper-line">
      <div className="container-codex flex flex-col gap-2.5 py-7 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-wide text-ink-mute">
          © 2026 {profile.name} · {profile.englishName} · 每一个数字都来自真实项目
        </p>
        <button
          type="button"
          onClick={toggleAudio}
          className="group flex items-center gap-2 font-mono text-[10px] text-ink-mute transition-colors hover:text-red cursor-pointer"
          title={audioOn ? '点击关闭纸声拟物反馈' : '点击开启纸张翻阅与轻触拟物微声效'}
        >
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
              audioOn ? 'bg-red animate-pulse' : 'bg-ink-faint'
            }`}
          />
          <span>纸声拟物 {audioOn ? '[已开启 ♫]' : '[静音 ♫]'}</span>
        </button>
      </div>
    </footer>
  )
}
