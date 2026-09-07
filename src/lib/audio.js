/**
 * audio.js — 纸张拟物微声效（Web Audio API 纯物理合成）
 *
 * 零音频文件依赖（0KB 体积损耗）：
 * 利用粉红噪声/白噪声生成器 + 带通滤波器（Bandpass Filter）+ 指数衰减增益
 * 物理合成纸张轻抚翻动声（Paper Tap / Slide），给探索者极其细腻的拟物心流。
 * 默认静音（Respect User），在页脚提供开/关微章，状态持久化到 localStorage。
 */

let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

const STORAGE_KEY = 'kimi_paper_audio_enabled'

export function isAudioEnabled() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function setAudioEnabled(enabled) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
  if (enabled) {
    playPaperTap(0.7)
  }
}

/**
 * 纸张轻触音（Paper Tap）— 用于切换标签、展开抽屉、点击案卷
 * 约 38ms，轻柔的低频纸张摩挲声
 */
export function playPaperTap(volumeScale = 0.5) {
  if (!isAudioEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const duration = 0.038

    // 1. 生成微小随机白噪声缓冲
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // 2. 带通滤波器：模拟纸张纤维的温和中低频共振
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(460, now)
    filter.Q.setValueAtTime(1.8, now)

    // 3. 增益包络：瞬间击打，急速指数衰减
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.22 * volumeScale, now + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  } catch (e) {
    // 静默降级
  }
}

/**
 * 纸张抽拉/翻页音（Paper Slide）— 用于打开案卷抽屉、大块切换
 * 约 90ms，柔和的漫反射纸面划过声
 */
export function playPaperSlide(volumeScale = 0.5) {
  if (!isAudioEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const duration = 0.09

    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(380, now)
    filter.frequency.linearRampToValueAtTime(540, now + duration * 0.6)
    filter.frequency.linearRampToValueAtTime(320, now + duration)
    filter.Q.setValueAtTime(1.2, now)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.18 * volumeScale, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(now)
    noise.stop(now + duration)
  } catch (e) {
    // 静默降级
  }
}
