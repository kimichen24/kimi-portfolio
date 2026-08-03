/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // 苹果风的字体系统
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'Arial',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        // SpaceTravel 使用的字体
        heading: ['"Instrument Serif"', 'serif'],
        body: ['Barlow', 'sans-serif'],
      },
      // SpaceTravel — bare rounded → pill
      borderRadius: {
        DEFAULT: '9999px',
      },
      // 苹果风的色板 — 克制的黑白灰 + 一个克制的蓝色强调
      colors: {
        ink: {
          50: '#fafafa',
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#d2d2d7',
          400: '#a1a1a6',
          500: '#86868b',
          600: '#6e6e73',
          700: '#424245',
          800: '#1d1d1f',
          900: '#000000',
        },
        accent: {
          DEFAULT: '#0284c7',
          hover: '#0ea5e9',
          soft: '#e0f2fe',
        },
      },
      // 最大版心宽度
      maxWidth: {
        container: '1700px',
      },
      // 自定义动画
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 1.2s ease-out forwards',
        'gradient-shift': 'gradient-shift 16s ease infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      // 苹果风的精致阴影
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        card: '0 1px 3px rgba(0,0,0,0.04), 0 20px 40px rgba(0,0,0,0.08)',
        cardHover: '0 4px 12px rgba(0,0,0,0.06), 0 30px 60px rgba(0,0,0,0.12)',
        glow: '0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,113,227,0.08)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}