# 陈权峰 Kimi · 产品运营作品集

> 产品运营方向求职中 · 内容增长 / 社群提效 / 用户调研 — 三组实战案卷，数字真实可查证

一张正在被红笔批注的稿纸：整站铺极淡的稿纸方格与左缘装订红线，
关键内容被朱红笔迹标注——数字被画上下划线、承诺被圈注、
结论被打上对勾。首页底部一行缓慢流动的真实用户原话，
是所有项目出发的地方。

## 核心体验装置 · 红笔批注

- **落笔**：关键数字进入视口时被红笔画上下划线（stagger 错峰）
- **圈注**：首屏核心主张、联系页「随时到岗」被手绘红圈圈出
- **查证**：数字旁的「✓ 真实数据」页边批注，链接到案卷证据
- **hover 再画**：案卷卡片标题悬停时红笔重新落笔，提起再画
- **引语缓流**：首页底部 90s 一轮的真实用户原声横流（reduced-motion 定格）

## 网站结构

- `#/` — 首页：定位、核心主张、四个真实数据、「此刻 Now」条、精选案卷
- `#/notes` — 手记：笔记体短文，事实可回溯到案卷
- `#/work` — 作品：三组案卷 + Vibe Coding 附卷
- `#/about` — 关于：简介、经历时间线、方法索引、工具
- `#/contact` — 联系：求职状态、邮箱、微信二维码
- `#/project/<id>` — 案卷详情（campus-trade / doubao-research / intern-radar）

「此刻 Now」与手记都是活内容：更新 `src/data/content.js` 里的 `now` / `notes` 即可。

## 技术栈

React 18 + Vite 5 + Tailwind CSS v3 + Lenis（GSAP ticker 驱动的平滑滚动）
零三方动画库 / 零 Canvas——红笔为纯 SVG `stroke-dashoffset` 描边动画。

## 快速启动

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 生产构建
npm run preview
```

## 可访问性与性能

- `prefers-reduced-motion`：红笔直接呈现终态、引语定格、Lenis 停用
- 键盘可用：导航与卡片均有朱红焦点态
- 移动端：导航四项收进一行；稿纸底纹降级为纯方格
- 图片懒加载（微信二维码）；主包 gzip < 20KB

## 部署

GitHub Pages（gh-pages 分支，见 `scripts/deploy-ghpages.sh`）。
