import { Component } from 'react'

/**
 * ErrorBoundary — 页面级错误隔离
 *
 * 单页组件渲染 / 副作用抛错时，只显示该页降级内容，
 * 不拖垮全站（之前经历页一个组件崩就整站白屏）。
 *
 * 用法：在 App 中按页包裹 <PageComp />。
 * 注意：不捕获事件回调 / 异步（setTimeout、fetch）内的错误。
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] 页面渲染异常：', error, info)
  }

  handleRetry = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="red-note text-[12px] uppercase tracking-widewide">Error</p>
          <h1 className="font-serif text-3xl font-black tracking-tight text-ink md:text-4xl">
            这一页出了点问题
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
            内容加载时发生异常，其余页面仍可正常访问。你可以重试这一页，或返回首页。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="border border-paper-line bg-white/60 px-5 py-2 font-mono text-[12px] text-ink transition hover:border-red/40"
            >
              重新加载这一页
            </button>
            <a
              href="#/"
              className="border border-paper-line bg-white/60 px-5 py-2 font-mono text-[12px] text-ink transition hover:border-red/40"
            >
              返回首页
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
