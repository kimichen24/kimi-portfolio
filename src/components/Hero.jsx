import { useEffect, useRef } from 'react'

/**
 * AccretionDiskCanvas — 电影级黑洞吸积盘
 * 参考 Interstellar Gargantua 视觉
 */
function AccretionDiskCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = window.innerWidth
    let H = window.innerHeight
    let rafId = 0

    const parallax = {
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
      bind: (e) => {
        parallax.tx = (e.clientX / W - 0.5) * 2
        parallax.ty = (e.clientY / H - 0.5) * 2
      },
    }
    window.addEventListener('mousemove', parallax.bind, { passive: true })

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: 0.15 + Math.random() * 0.45,
      tw: Math.random() * Math.PI * 2,
    }))

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
    }
    resize()
    window.addEventListener('resize', resize)

    const noise = document.createElement('canvas')
    noise.width = 256
    noise.height = 256
    {
      const nctx = noise.getContext('2d')
      const img = nctx.createImageData(256, 256)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 18
        img.data[i] = v
        img.data[i + 1] = v
        img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      nctx.putImageData(img, 0, 0)
    }

    function drawScene(time) {
      const cx = W * dpr * 0.5
      const cy = H * dpr * 0.5
      const baseR = Math.min(W, H) * dpr * 0.085
      const ox = parallax.x * 22 * dpr
      const oy = parallax.y * 22 * dpr

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const gHalo = ctx.createRadialGradient(cx + ox, cy + oy, baseR * 1.4, cx + ox, cy + oy, baseR * 9)
      gHalo.addColorStop(0, 'rgba(255, 200, 130, 0.32)')
      gHalo.addColorStop(0.18, 'rgba(255, 175, 90, 0.18)')
      gHalo.addColorStop(0.45, 'rgba(190, 110, 50, 0.07)')
      gHalo.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gHalo
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(cx + ox, cy + oy)
      ctx.globalCompositeOperation = 'lighter'

      ctx.strokeStyle = 'rgba(255, 200, 130, 0.55)'
      ctx.lineWidth = baseR * 0.18
      ctx.beginPath()
      ctx.arc(0, 0, baseR * 1.85, Math.PI * 0.18, Math.PI * 0.82, false)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 230, 170, 0.45)'
      ctx.lineWidth = baseR * 0.06
      ctx.beginPath()
      ctx.arc(0, 0, baseR * 1.85, Math.PI * 0.22, Math.PI * 0.78, false)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 200, 130, 0.55)'
      ctx.lineWidth = baseR * 0.18
      ctx.beginPath()
      ctx.arc(0, 0, baseR * 1.85, Math.PI * 1.18, Math.PI * 1.82, false)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 230, 170, 0.45)'
      ctx.lineWidth = baseR * 0.06
      ctx.beginPath()
      ctx.arc(0, 0, baseR * 1.85, Math.PI * 1.22, Math.PI * 1.78, false)
      ctx.stroke()

      ctx.restore()

      ctx.save()
      ctx.translate(cx + ox, cy + oy)
      ctx.scale(1, 0.16)

      const diskW = baseR * 6.5
      const diskH = baseR * 6.5
      const gDisk = ctx.createLinearGradient(-diskW, 0, diskW, 0)
      gDisk.addColorStop(0.0, 'rgba(140, 80, 30, 0.10)')
      gDisk.addColorStop(0.25, 'rgba(220, 140, 60, 0.45)')
      gDisk.addColorStop(0.45, 'rgba(255, 200, 110, 0.85)')
      gDisk.addColorStop(0.5, 'rgba(255, 225, 160, 0.95)')
      gDisk.addColorStop(0.55, 'rgba(255, 215, 150, 0.90)')
      gDisk.addColorStop(0.7, 'rgba(255, 195, 100, 0.75)')
      gDisk.addColorStop(0.85, 'rgba(230, 140, 50, 0.40)')
      gDisk.addColorStop(1.0, 'rgba(160, 80, 30, 0.10)')

      const gDiskR = ctx.createRadialGradient(0, 0, baseR * 1.1, 0, 0, diskW)
      gDiskR.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gDiskR.addColorStop(0.05, 'rgba(255, 220, 150, 0.95)')
      gDiskR.addColorStop(0.12, 'rgba(255, 200, 110, 0.85)')
      gDiskR.addColorStop(0.30, 'rgba(230, 150, 60, 0.40)')
      gDiskR.addColorStop(0.60, 'rgba(150, 80, 30, 0.12)')
      gDiskR.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = gDiskR
      ctx.beginPath()
      ctx.ellipse(0, 0, diskW, diskH, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = gDisk
      ctx.beginPath()
      ctx.ellipse(0, 0, diskW, diskH, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      const gIn = ctx.createRadialGradient(cx + ox, cy + oy, baseR * 0.95, cx + ox, cy + oy, baseR * 1.55)
      gIn.addColorStop(0, 'rgba(0, 0, 0, 1)')
      gIn.addColorStop(0.55, 'rgba(255, 200, 110, 0.35)')
      gIn.addColorStop(1, 'rgba(255, 200, 110, 0)')
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = gIn
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000000'
      ctx.beginPath()
      ctx.arc(cx + ox, cy + oy, baseR, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalCompositeOperation = 'lighter'
      const gRing = ctx.createLinearGradient(cx + ox - baseR * 1.1, 0, cx + ox + baseR * 1.1, 0)
      gRing.addColorStop(0, 'rgba(200, 130, 50, 0.45)')
      gRing.addColorStop(0.5, 'rgba(255, 230, 170, 1)')
      gRing.addColorStop(1, 'rgba(255, 210, 130, 0.55)')
      ctx.strokeStyle = gRing
      ctx.lineWidth = baseR * 0.085
      ctx.beginPath()
      ctx.arc(cx + ox, cy + oy, baseR * 1.04, 0, Math.PI * 2)
      ctx.stroke()

      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const tw = 0.6 + 0.4 * Math.sin(time * 0.0008 + s.tw)
        const sx = (s.x * W - parallax.x * 30) * dpr
        const sy = (s.y * H - parallax.y * 30) * dpr
        const dx = sx - (cx + ox)
        const dy = sy - (cy + oy)
        if (Math.hypot(dx, dy) < baseR * 1.6) continue

        ctx.fillStyle = `rgba(255, 240, 220, ${(s.a * tw).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(sx, sy, s.r * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'overlay'
      ctx.globalAlpha = 0.06
      const pat = ctx.createPattern(noise, 'repeat')
      ctx.fillStyle = pat
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    let last = performance.now()
    const tick = (now) => {
      parallax.x += (parallax.tx - parallax.x) * 0.04
      parallax.y += (parallax.ty - parallax.y) * 0.04
      drawScene(now)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', parallax.bind)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  )
}

// Hero 内嵌 nav 项（顺序与模块对应）
const HERO_NAV = [
  { label: '首页', href: '#home' },
  { label: '个人经历', href: '#experience' },
  { label: '精选项目', href: '#projects' },
  { label: '个人优势', href: '#strengths' },
  { label: '联系我', href: '#contact' },
]

/**
 * Hero — Personal Hub 全屏首屏
 * 布局：参考四宫格海报（左上 logo / 右上 nav / 中央画面 / 左下 slogan / 右下 tagline）
 */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden bg-black text-white"
    >
      {/* 黑洞 Canvas — 全屏铺底 */}
      <AccretionDiskCanvas />

      {/* 暗色蒙层 — 让文字可读（中央透明，四周略深） */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-black/45 via-transparent to-black/40"
      />

      {/* ========== 顶部栏：左上 logo + 右上 nav ========== */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-6 md:p-10 lg:p-12">
        {/* 左上 — Logo：陈权峰 / Kimi */}
        <a
          href="#home"
          className="group inline-flex items-baseline gap-3 animate-fade-in"
          style={{ animationDelay: '0.15s', opacity: 0 }}
        >
          <span className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-[1.7rem]">
            陈权峰
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/55 sm:text-xs md:text-sm">
            Kimi
          </span>
        </a>

        {/* 右上 — 桌面端 nav */}
        <div
          className="hidden items-center gap-7 animate-fade-in md:flex"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          {HERO_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-white/80 transition-colors duration-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#projects"
            className="ml-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-black transition-transform duration-300 hover:scale-105"
          >
            探索作品
          </a>
        </div>

        {/* 移动端 — 简化为单个 CTA */}
        <a
          href="#projects"
          className="rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-black transition-transform duration-300 hover:scale-105 animate-fade-in md:hidden"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          探索作品
        </a>
      </div>

      {/* ========== 底部栏：左下 slogan + 右下 tagline ========== */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-start justify-end gap-10 p-6 pb-16 md:flex-row md:items-end md:justify-between md:gap-12 md:p-10 md:pb-14 lg:p-12 lg:pb-16">
        {/* 左下 — Slogan + 副标题 + CTA */}
        <div className="max-w-2xl animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <h1
            className="font-display text-[clamp(1.8rem,4.2vw,3.8rem)] font-medium leading-[1.05] tracking-tightest text-white"
          >
            Fake it till you make it.
          </h1>

          <p
            className="mt-5 max-w-md text-[13px] leading-relaxed text-white/65 md:text-sm"
          >
            数字创作者 · 产品运营官 · AI 工作流实践者
            <br className="hidden md:block" />
            在内容、用户、数据与 AI 的交汇处，把想法做成可被感知的产品。
          </p>

          <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-transform duration-300 hover:scale-105 md:text-sm"
            >
              探索作品
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.04] px-5 py-2.5 text-[13px] font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.08] md:text-sm"
            >
              建立连接
            </a>
          </div>
        </div>

        {/* 右下 — tagline（右对齐） */}
        <div
          className="hidden animate-fade-in text-right md:block"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
            Content · Research
          </div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
            Data · AI
          </div>
        </div>

        {/* 移动端 — tagline 横向 */}
        <div
          className="animate-fade-in text-[10px] font-medium uppercase tracking-[0.28em] text-white/45 md:hidden"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          Content · Research · Data · AI
        </div>
      </div>

      {/* 底部中央 — 滚动提示 */}
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 animate-fade-in md:bottom-6">
        <div className="flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.32em] text-white/40">
          <span>Scroll</span>
          <span className="h-6 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}