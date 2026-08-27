/** @type {import('tailwindcss').Config} */
// 「编码台」设计系统 — 纸面研究美学
// 三色语义：噪声=灰、信号=墨、批注=朱红。没有第四种颜色。
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // 字体系统：宋体（标题·人的判断）+ IBM Plex Mono（数据·机器的编码）
      fontFamily: {
        serif: [
          '"Noto Serif SC"',
          '"Songti SC"',
          '"STSong"',
          'SimSun',
          'serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
        sans: [
          '"Noto Sans SC"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
      colors: {
        // 纸与墨
        paper: {
          DEFAULT: '#faf8f3', // 暖白纸底
          deep: '#f3f0e7', // 沉纸（分区底）
          line: '#e4dfd2', // 折痕线
        },
        ink: {
          DEFAULT: '#1c1a17', // 墨黑（信号）
          soft: '#57524a', // 次级墨
          mute: '#9a948a', // 灰（噪声）
          faint: '#c4beb2', // 浅灰（尘）
        },
        red: {
          DEFAULT: '#c8401f', // 朱红批注
          soft: '#e8d5cd', // 朱红淡底
        },
      },
      maxWidth: {
        codex: '1080px', // 编码台版心（比 1700 收窄，编辑感）
      },
      letterSpacing: {
        tightest: '-0.04em',
        widewide: '0.32em',
      },
      boxShadow: {
        press: '0 1px 0 rgba(28,26,23,0.06)',
        sheet: '0 12px 40px rgba(28,26,23,0.08)',
      },
    },
  },
  plugins: [],
}
