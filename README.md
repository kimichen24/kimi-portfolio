# Kimi · 个人作品集官网

> 陈权峰 · 个人作品集 · 内容运营 / 用户调研 / 数据驱动 / AI 增效

一个参考苹果官网设计语言的个人作品集站点 — **高级、克制、大留白、有科技感**。
使用 **React 18 + Vite + Tailwind CSS v3** 构建，零运行时图标依赖，所有插画均为内联 SVG 占位。

---

## 🚀 快速启动

```bash
npm install
npm run dev
```

默认运行在 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
npm run preview
```

---

## 📁 项目结构

```
portfolio/
├── index.html                       # 入口 HTML
├── package.json                     # 依赖与脚本
├── vite.config.js                   # Vite 配置（端口 / 主机）
├── tailwind.config.js               # Tailwind 配置（字体 / 色板 / 动画）
├── postcss.config.js                # PostCSS 配置
├── public/
│   └── favicon.svg                  # 网站图标
└── src/
    ├── main.jsx                     # React 入口
    ├── App.jsx                      # 主应用 — 组合所有模块
    ├── index.css                    # 全局样式 + Tailwind 指令
    ├── data/
    │   └── content.js               # 集中管理所有文案与数据
    └── components/
        ├── NavBar.jsx               # 固定顶部导航 + 磨砂玻璃
        ├── Hero.jsx                 # 全屏首屏
        ├── Experience.jsx           # 个人经历 + 核心数据
        ├── Projects.jsx             # 精选项目 — 3 张大卡片
        ├── Strengths.jsx            # 核心能力 — 4 张卡片 2×2
        ├── Contact.jsx              # 整屏深色联系模块
        ├── Footer.jsx               # 底部版权
        └── ui/
            ├── RevealOnScroll.jsx   # 滚动渐入通用组件
            ├── PlaceholderImage.jsx # 占位图 + 头像占位
            └── Icon.jsx             # 内联 SVG 图标库
```

---

## 🧩 模块说明

| 模块 | 文件 | 功能 |
| --- | --- | --- |
| 导航栏 | `NavBar.jsx` | 固定顶部、滚动磨砂玻璃、锚点 active 状态 |
| 首屏 | `Hero.jsx` | 柔和动态渐变背景 + 颗粒纹理 + 居中大标题 |
| 个人经历 | `Experience.jsx` | 左右分栏：头像 + 4 项核心数据 / 简介 + 邮箱 |
| 精选项目 | `Projects.jsx` | 3 张大卡片，对应简历三个项目 |
| 核心能力 | `Strengths.jsx` | 4 张 2×2 卡片：内容 / 数据 / 调研 / AI |
| 联系模块 | `Contact.jsx` | 整屏深色，邮箱大字展示 |
| 页脚 | `Footer.jsx` | 版权信息 |

---

## 🖼 替换占位图 / 头像

所有图片占位都使用内联 SVG + 渐变色块，**不依赖任何在线 placeholder 服务**。

### 替换项目截图

`src/components/Projects.jsx` 中，把 `<PlaceholderImage tone={p.cover.tone} />` 替换为：

```jsx
<img
  src={`/assets/projects/${p.id}.png`}
  alt={p.title}
  className="aspect-[16/10] w-full rounded-2xl object-cover transition-transform duration-700 hover:scale-105"
/>
```

把真实图片放到 `public/assets/projects/` 目录下即可。

### 替换头像

`src/components/Experience.jsx` 中，把 `<AvatarPlaceholder name="K" />` 替换为：

```jsx
<img
  src="/assets/avatar.jpg"
  alt={profile.name}
  className="aspect-square w-full max-w-[280px] rounded-full object-cover ring-1 ring-ink-200/60 shadow-soft"
/>
```

---

## 🎨 设计系统

### 色板（`tailwind.config.js`）

| 名称 | 用途 |
| --- | --- |
| `ink-50 ~ 900` | 中性灰阶 — 文字 / 背景 / 分隔线 |
| `accent` (`#0071e3`) | 苹果蓝 — 强调色 / 主按钮 / 链接 |

### 字体

优先使用系统字体：
- macOS: SF Pro Display / SF Pro Text
- Windows: PingFang SC / Microsoft YaHei

### 容器

最大版心 `1700px`，通过 `max-w-container` 类使用。

### 关键样式类

| 类 | 作用 |
| --- | --- |
| `container-page` | 标准居中容器 |
| `glass-nav` / `glass-nav-scrolled` | 磨砂玻璃导航栏 |
| `btn-primary` / `btn-secondary` | 主 / 次按钮 |
| `card-apple` | 通用卡片（hover 上浮 + 阴影变化） |
| `aurora-bg` | 动态渐变背景（首屏使用） |
| `grain-overlay` | 颗粒纹理叠加（首屏使用） |
| `reveal` / `is-visible` | 滚动渐入（由 `RevealOnScroll` 自动管理） |

---

## 🔧 交互细节

- ✅ 平滑滚动 — `html { scroll-behavior: smooth }`
- ✅ 锚点跳转 — `<a href="#section">`
- ✅ 导航栏滚动磨砂玻璃 — `IntersectionObserver` + 滚动监听
- ✅ 锚点 active 高亮 — `IntersectionObserver`
- ✅ 卡片 hover 上浮 + 阴影增强 — Tailwind transition
- ✅ 卡片图片 hover 微缩放 — `hover-zoom` 工具类
- ✅ 滚动渐入 — `RevealOnScroll` 组件 + `IntersectionObserver`
- ✅ 动态渐变背景 — `gradient-shift` keyframes
- ✅ 装饰光晕缓慢漂浮 — `float-slow` keyframes
- ✅ 尊重 `prefers-reduced-motion` — 减少动效时禁用动画

---

## 📦 依赖

仅 3 个运行时 + 5 个开发依赖，**没有任何重型框架**：

**运行时**
- `react@18.3`
- `react-dom@18.3`

**开发**
- `vite@5`
- `@vitejs/plugin-react@4`
- `tailwindcss@3.4`
- `postcss@8`
- `autoprefixer@10`

零 Framer Motion、零 GSAP、零图标库 — 所有动画都用 CSS / 原生 API 实现，加载极快。

---

## 📝 替换文案

所有文案集中在 `src/data/content.js` 中：

```js
export const profile = {
  name: '陈权峰',
  englishName: 'Kimi',
  role: 'Content · Research · Data · AI',
  tagline: '从 0 到 1 做内容 · 用数据驱动优化 · 靠 AI 提效落地',
  email: 'kimichen224@163.com',
  // ... 修改这里即可同步到所有页面
}
```

项目数据在 `projects` 数组中，能力数据在 `strengths` 数组中。

---

## 📄 许可

本项目仅作为个人作品集使用。

Designed & Built with care · 用心设计 · 用代码呈现。