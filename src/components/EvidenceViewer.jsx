import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { RedCircle, RedUnderline, MarginNote } from './RedPen'
import { playPaperTap } from '../lib/audio'

/**
 * EvidenceViewer — 现场物证展台
 * 补齐案卷“宣称有证据但现场只有文字”的断层：
 * 1. comparison: 校园二手群「820+ 乱序消息流 vs 结构化发布模版」拟真对比
 * 2. affinity: 豆包调研「15 位受访者 200+ 原始便签三级聚类痛点板」
 * 3. gallery: 招聘平台走查「4 张真实 App 截图证据」+ 交互灯箱
 */

export default function EvidenceViewer({ evidence }) {
  if (!evidence) return null

  return (
    <section className="mt-14 border-t border-paper-line pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="eyebrow-mono flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
            {evidence.badge || '现场物证 / Evidence Artifacts'}
          </span>
          <h3 className="mt-2.5 font-serif text-[19px] font-bold tracking-tight text-ink md:text-[22px]">
            {evidence.title}
          </h3>
        </div>
        <span className="font-mono text-[11px] text-ink-mute">
          {evidence.type === 'comparison' && '脱敏整理复现'}
          {evidence.type === 'affinity' && '访谈摘录 · 主题编码'}
          {evidence.type === 'gallery' && '真实 App 走查截图'}
        </span>
      </div>
      <p className="mt-2.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft">
        {evidence.desc}
      </p>

      {/* 依类型分发物证组件 */}
      <div className="mt-7">
        {evidence.type === 'comparison' && <ComparisonEvidence data={evidence} />}
        {evidence.type === 'affinity' && <AffinityEvidence data={evidence} />}
        {evidence.type === 'gallery' && <GalleryEvidence data={evidence} />}
      </div>
    </section>
  )
}

/** 1. 消息流优化对比展台（校园二手交易群） */
function ComparisonEvidence({ data }) {
  const [activeTab, setActiveTab] = useState('split') // 'before' | 'after' | 'split'

  const handleTab = (t) => {
    setActiveTab(t)
    playPaperTap(0.6)
  }

  return (
    <div className="space-y-4">
      {/* 视图切换按钮 */}
      <div className="flex items-center gap-2 border-b border-paper-line pb-3">
        <span className="font-mono text-[11px] text-ink-mute mr-2">对比视角:</span>
        <button
          type="button"
          onClick={() => handleTab('split')}
          className={`px-3 py-1 font-mono text-[11px] transition-colors ${
            activeTab === 'split' ? 'bg-ink text-paper' : 'border border-paper-line text-ink-soft hover:text-ink'
          }`}
        >
          双轨同屏对比
        </button>
        <button
          type="button"
          onClick={() => handleTab('before')}
          className={`px-3 py-1 font-mono text-[11px] transition-colors ${
            activeTab === 'before' ? 'bg-ink text-paper' : 'border border-paper-line text-ink-soft hover:text-ink'
          }`}
        >
          优化前：碎片混沌
        </button>
        <button
          type="button"
          onClick={() => handleTab('after')}
          className={`px-3 py-1 font-mono text-[11px] transition-colors ${
            activeTab === 'after' ? 'bg-ink text-paper' : 'border border-paper-line text-ink-soft hover:text-ink'
          }`}
        >
          优化后：结构化模版
        </button>
      </div>

      <div className={`grid gap-6 ${activeTab === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* 优化前：随手发消息流 */}
        {(activeTab === 'split' || activeTab === 'before') && (
          <div className="border border-paper-line bg-paper-deep/30 p-5 sm:p-6">
            <div className="flex items-baseline justify-between border-b border-paper-line pb-3">
              <p className="font-mono text-[12px] font-semibold text-ink-mute">
                [优化前] 随手发 · 消息碎片流（日均 820+ 条）
              </p>
              <span className="font-mono text-[10px] text-red">平均找货 23 分钟</span>
            </div>

            <div className="mt-4 space-y-3 font-mono text-[12px]">
              {data.before.items.map((m, idx) => (
                <div key={idx} className="border-l-2 border-paper-line pl-3 py-1">
                  <div className="flex items-baseline justify-between text-ink-mute text-[10px]">
                    <span>{m.user}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="mt-1 text-ink-soft text-[12.5px] font-sans">{m.text}</p>
                  <p className="mt-1 text-red text-[10px]">✎ 痛点: {m.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-dashed border-paper-line pt-3">
              <p className="font-mono text-[11px] text-ink-mute leading-relaxed">
                诊断总结：{data.before.flaw}
              </p>
            </div>
          </div>
        )}

        {/* 优化后：结构化模版卡片 */}
        {(activeTab === 'split' || activeTab === 'after') && (
          <div className="border-2 border-ink/15 bg-white/80 p-5 sm:p-6 shadow-press">
            <div className="flex items-baseline justify-between border-b border-paper-line pb-3">
              <p className="font-serif text-[14px] font-bold text-ink">
                [优化后] 结构化发布模版 + 交易闭环卡
              </p>
              <span className="red-note text-[11px] font-semibold">{data.after.card.no}</span>
            </div>

            {/* 模拟结构化卡片 */}
            <div className="mt-4 space-y-2.5 font-mono text-[12px]">
              <div className="grid grid-cols-[80px_1fr] gap-2 py-1 border-b border-paper-line/70">
                <span className="text-ink-mute">物品名称:</span>
                <span className="font-semibold text-ink font-sans">{data.after.card.item}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 py-1 border-b border-paper-line/70">
                <span className="text-ink-mute">价格规范:</span>
                <span className="font-bold text-red">{data.after.card.price}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 py-1 border-b border-paper-line/70">
                <span className="text-ink-mute">成色详情:</span>
                <span className="text-ink-soft font-sans">{data.after.card.condition}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 py-1 border-b border-paper-line/70">
                <span className="text-ink-mute">自提地点:</span>
                <span className="text-ink-soft font-sans">{data.after.card.pickup}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 py-1.5 bg-paper-deep/60 px-2 mt-2">
                <span className="text-red font-semibold">流转状态:</span>
                <span className="text-ink font-semibold">{data.after.card.status}</span>
              </div>
            </div>

            {/* 核心收获 */}
            <div className="mt-5 border-t border-paper-line pt-4">
              <p className="font-mono text-[11px] font-medium text-ink-mute">实测收敛指标:</p>
              <ul className="mt-2 space-y-1.5">
                {data.after.gains.map((gain, gIdx) => (
                  <li key={gIdx} className="flex items-center gap-2 font-mono text-[11.5px] text-ink">
                    <span className="h-1.5 w-1.5 rounded-full bg-red shrink-0" />
                    {gain}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** 2. 调研编码便签板（豆包校园用户深度调研） */
function AffinityEvidence({ data }) {
  const [activeFilter, setActiveFilter] = useState('ALL')

  const handleFilter = (code) => {
    setActiveFilter(code)
    playPaperTap(0.6)
  }

  const filteredClusters =
    activeFilter === 'ALL'
      ? data.clusters
      : data.clusters.filter((c) => c.code === activeFilter)

  return (
    <div className="space-y-4">
      {/* 筛选按钮 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-paper-line pb-3">
        <span className="font-mono text-[11px] text-ink-mute mr-2">痛点集群:</span>
        <button
          type="button"
          onClick={() => handleFilter('ALL')}
          className={`px-3 py-1 font-mono text-[11px] transition-colors ${
            activeFilter === 'ALL' ? 'bg-ink text-paper' : 'border border-paper-line text-ink-soft hover:text-ink'
          }`}
        >
          全量聚类 (3 大集群)
        </button>
        {data.clusters.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => handleFilter(c.code)}
            className={`px-3 py-1 font-mono text-[11px] transition-colors ${
              activeFilter === c.code ? 'bg-red text-white' : 'border border-paper-line text-ink-soft hover:text-ink'
            }`}
          >
            {c.code} · {c.theme.split('·')[0].trim()}
          </button>
        ))}
      </div>

      {/* 便签卡片矩阵 */}
      <div className="grid gap-5 md:grid-cols-3">
        {filteredClusters.map((cluster) => (
          <article
            key={cluster.code}
            className="case-file flex flex-col justify-between p-5 bg-white/80 border-t-2 border-t-red"
          >
            <div>
              <div className="flex items-baseline justify-between gap-2 border-b border-paper-line pb-2.5">
                <span className="red-note text-[13px] font-bold">{cluster.code}</span>
                <span className="font-mono text-[10px] text-ink-mute">{cluster.stats}</span>
              </div>
              <h4 className="mt-3 font-serif text-[15px] font-bold text-ink leading-snug">
                {cluster.theme}
              </h4>

              {/* 原始便签样本 */}
              <div className="mt-4 space-y-2.5">
                {cluster.notes.map((note, nIdx) => (
                  <div
                    key={nIdx}
                    className="border-l border-red/40 bg-paper-deep/40 p-2.5 font-sans text-[12px] leading-relaxed text-ink-soft"
                  >
                    <span className="font-mono text-[10px] text-red block mb-0.5">
                      访谈录音逐字稿采样 #{nIdx + 1}:
                    </span>
                    {note}
                  </div>
                ))}
              </div>
            </div>

            {/* 改进落地方案 */}
            <div className="mt-5 border-t border-paper-line pt-3">
              <p className="font-mono text-[11px] font-medium text-red leading-relaxed">
                {cluster.action}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/** 3. 真实走查截图画廊（招聘平台产品研究） */
function GalleryEvidence({ data }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const openLightbox = (idx) => {
    setLightboxIndex(idx)
    playPaperTap(0.7)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    playPaperTap(0.5)
  }

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % data.images.length)
    playPaperTap(0.6)
  }

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + data.images.length) % data.images.length)
    playPaperTap(0.6)
  }

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.images.map((img, idx) => (
          <figure
            key={idx}
            className="case-file group cursor-pointer overflow-hidden p-3 transition-transform hover:-translate-y-1"
            onClick={() => openLightbox(idx)}
          >
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-paper-deep border border-paper-line">
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/15 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 font-mono text-[11px] text-paper bg-ink/80 px-2.5 py-1 transition-opacity">
                  点击查看原图 ↗
                </span>
              </div>
              <span className="absolute top-2 left-2 font-mono text-[10px] font-semibold bg-red text-paper px-1.5 py-0.5">
                {img.code}
              </span>
            </div>
            <figcaption className="mt-3">
              <p className="font-serif text-[13.5px] font-bold text-ink">{img.title}</p>
              <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-ink-mute">
                {img.desc}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* 灯箱放大部分 */}
      {lightboxIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm animate-fade-in"
            onClick={closeLightbox}
          >
            <div
              className="relative max-h-[92vh] max-w-2xl overflow-hidden border border-paper-line bg-paper p-6 shadow-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-baseline justify-between border-b border-paper-line pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="red-note text-[12px] font-bold">
                    {data.images[lightboxIndex].code}
                  </span>
                  <h4 className="font-serif text-[16px] font-bold text-ink">
                    {data.images[lightboxIndex].title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="font-mono text-[13px] text-ink-mute hover:text-red p-1 cursor-pointer"
                  aria-label="关闭灯箱"
                >
                  ✕ 关闭 (ESC)
                </button>
              </div>

              <div className="mt-4 flex max-h-[65vh] justify-center overflow-auto bg-paper-deep/60 p-2 border border-paper-line">
                <img
                  src={data.images[lightboxIndex].url}
                  alt={data.images[lightboxIndex].title}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-ink-soft font-sans">
                <span className="red-note mr-2">✎ 走查批注:</span>
                {data.images[lightboxIndex].desc}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-paper-line pt-3">
                <button
                  type="button"
                  onClick={prevLightbox}
                  className="font-mono text-[11px] text-ink-mute hover:text-red cursor-pointer"
                >
                  ← 上一张
                </button>
                <span className="font-mono text-[11px] text-ink-faint">
                  {lightboxIndex + 1} / {data.images.length}
                </span>
                <button
                  type="button"
                  onClick={nextLightbox}
                  className="font-mono text-[11px] text-ink-mute hover:text-red cursor-pointer"
                >
                  下一张 →
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
