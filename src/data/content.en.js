// English content bundle — mirror of content.js, same structure, only text translated.
// Components switch between bundles via useContent() based on the active language.
export const profile = {
  name: 'Chen Quanfeng',
  englishName: 'Kimi Chen',
  role: 'Content · Research · Data · AI',
  tagline: 'From 0 to 1 on content · Data-driven optimization · AI-powered execution',
  email: 'kimichen224@163.com',
  location: 'Hunan · Changsha',
  school: 'University of South China, Shanzhou College · Software Engineering',
  honors: [
    'CET-4 (College English Test Band 4)',
    'University First-Class Scholarship',
  ],
  bioLine:
    "Turning ideas into reality with code. I've worked on content operations, user research, and data-driven decisions — and now I want to build products that actually solve problems.",
  bio: [
    'Undergraduate student majoring in Information Management and Information Systems; solid product and data foundation, with a structured mindset for breaking down operational problems.',
    'Deep experience in content operations and user research — from building account systems 0-to-1, iterating strategy through data review, to turning research insights into actionable product plans.',
    'Fluent with AI tools across the full workflow — materials, copywriting, data analysis — having achieved an 81.7% efficiency gain on a single project.',
  ],
  social: [
    { platform: 'Douyin', handle: 'imik24', url: null, icon: 'douyin' },
    { platform: 'WeChat', handle: 'Butter2fly4blue', url: null, icon: 'wechat' },
    { platform: 'QQ', handle: '3188327792', url: null, icon: 'qq' },
    { platform: 'Email', handle: 'kimichen224@163.com', url: 'mailto:kimichen224@163.com', icon: 'mail' },
  ],
  stats: [
    { value: '3', unit: '', label: 'Independent Projects', desc: 'Shipped 0 to 1' },
    { value: '30K+', unit: '', label: 'Account Views', desc: 'Douyin organic traffic' },
    { value: '73', unit: '%', label: 'Pain Coverage', desc: 'P0 plan hits' },
    { value: '81.7', unit: '%', label: 'Efficiency Gain', desc: 'AI workflow' },
  ],
}

export const experiences = [
  {
    id: 'douyin-music',
    period: '2026-07 ~ Present',
    tag: 'Independent Operation',
    title: 'Douyin Music Vertical Account — Full 0-1 Operations',
    points: [
      'Targeted the niche music-sample-breakdown track to build a differentiated, professional content IP',
      'Built a standardized content framework: sample tracing + original comparison + creation breakdown',
      'Owned the full pipeline: topic planning, copywriting, and CapCut editing',
      'Reviewed and iterated weekly based on Douyin backend data; built a topic reservoir',
    ],
    metrics: [
      { value: '1000+', label: 'Likes on 5 videos' },
      { value: '30K', label: '7-day organic views' },
      { value: '20K', label: 'Top single-video views' },
      { value: '792', label: 'Weekly profile visits' },
      { value: '100+', label: 'Net new followers' },
    ],
    link: { url: 'https://v.douyin.com/sZVo34eBJDM/', label: 'Douyin Profile' },
  },
  {
    id: 'host',
    period: '2024-10 ~ Present',
    tag: 'Campus Experience',
    title: 'Hosting Team Member',
    points: [
      'Designed hosting scripts for the audience and controlled the live pace and atmosphere',
      'Planned and executed events like the New Year Gala; coordinated parts of the flow and staff',
      'Acted as the communication hub across teams — syncing progress and pre-empting event risks',
    ],
    highlight: 'Zero incidents across all events',
  },
]

export const projects = [
  {
    id: 'intern-radar',
    tag: 'Product Research · Competitive Analysis',
    title: 'Recruitment Platform Product Research',
    summary:
      "Non-target / no-experience students struggle on Liepin, Zhaopin and Boss when job hunting — imprecise recommendations, no way to judge if they qualify, and no peer landing references. Built a four-layer 'Strategy / Experience / Business / Capability' framework from the target-user perspective, audited both platforms with 18 real App screenshots as evidence, and delivered P0 / P1 / P2 optimization plans with key-page wireframes.",
    headline: '18 real screenshots + 3 core pain points → a shippable plan',
    actions: [
      "Built a four-layer 'Strategy / Experience / Business / Capability' framework; systematically audited Liepin and Boss Zhipin, collecting 18 real App screenshots as evidence",
      "Cross-validated with public industry data (Zhaopin 210k samples, China Youth Daily) to identify 3 core pain points: mismatched recommendations, guesswork on qualification, missing peer references",
      "Delivered actionable plans per pain point (P0 precise intent matching / P1 self-check / P2 non-target community) with key-page wireframes",
    ],
    metrics: [
      { value: '18', label: 'Real App screenshots' },
      { value: '3', label: 'Core pain points' },
      { value: 'P0–P2', label: 'Optimization priority' },
    ],
    reportUrl: 'reports/intern-radar/report.html',
    cover: { tone: 'warm' },
    extras: [
      {
        title: 'Competitive Matrix',
        subtitle: 'Liepin vs Boss Zhipin',
        items: [
          { label: 'Target users', value: 'Liepin: in-school & new grads; Boss: full-industry full-time + interns' },
          { label: 'Filter dimensions', value: 'Both lack: newbie-friendly / non-target OK / accepts sophomores / remote' },
          { label: 'Recommendation logic', value: "Not aligned with users' weak background; pushes mismatched roles (pain 1)" },
          { label: 'Qualification aid', value: 'Neither platform has it → core of pain 2: after reading the JD, users still unsure if they qualify' },
          { label: 'Communication', value: 'Boss read-but-no-reply + PK anxiety; Liepin only apply/chat' },
          { label: 'Business model', value: 'Revenue from B-side → C-side weak experience structurally ignored' },
        ],
      },
      {
        title: 'User Persona · Xiao Wang',
        subtitle: 'Typical non-target / no-experience internship seeker',
        items: [
          { label: 'Basics', value: 'Non-target uni · junior→senior · Accounting · user-ops intern · tier-2 city · no internship' },
          { label: 'Core goals', value: '① Land 1 user-ops internship before graduation; ② figure out if they qualify for big firms' },
          { label: 'Pain 1 · Mismatch', value: 'Search "user-ops intern" → half results are sales / service / game-ops; confidence drops fast' },
          { label: 'Pain 2 · Guesswork', value: 'JD says "experience preferred" → unsure whether to apply, fear of silence' },
          { label: 'Pain 3 · No reference', value: "No idea how seniors landed similar roles; no one to ask; blind applying" },
          { label: 'Decision priority', value: '1. non-target/no-exp OK > 2. onsite/city > 3. salary/brand/learning' },
        ],
      },
    ],
  },
  {
    id: 'campus-trade',
    tag: 'Community Ops · Efficiency',
    title: 'Campus Second-hand Trading Community — Efficiency Optimization',
    summary:
      'Campus second-hand groups saw 200+ messages/day with messy info and low buyer-seller match efficiency, averaging a 5+ day deal cycle. Diagnosed core pains via 3-day full-chat encoding, designed a structured posting template + group-rule SOP, introduced a "confirmation post" mechanism, and built a key-node data-tracking system to quantify the impact.',
    headline: 'Group conversion 12%→38%, deal cycle cut by 81.7%',
    actions: [
      'Encoded 3 days of full chat (500+ msgs) to locate two core pains: information overload and low match efficiency',
      'Designed a structured posting template (required fields / format) + Group Rules 2.0 + daily timed-posting SOP',
      'Introduced a confirmation-post mechanism and built publish / ask / deal three-node tracking with weekly review',
    ],
    metrics: [
      { value: '12% → 38%', label: 'Conversion lift' },
      { value: '81.7%', label: 'Deal cycle cut' },
      { value: '3×', label: 'Group activity' },
    ],
    reportUrl: 'reports/campus-trade/report.html',
    cover: { tone: 'cool' },
    extras: [
      {
        title: 'Baseline Diagnosis · 3-day full chat',
        subtitle: 'Before optimization, 500+ msgs coded one by one',
        columns: ['Date', 'For Sale', 'Wanted', 'Deals', 'Spam', 'Total'],
        rows: [
          ['Mon', '247', '43', '18', '89', '820'],
          ['Tue', '231', '51', '22', '76', '795'],
          ['Wed', '268', '38', '15', '94', '856'],
        ],
        note: 'Of 820+ daily messages, only 18 deal confirmations landed; 86 spam reposts — locating the two core pains: info overload and low match efficiency.',
      },
      {
        title: 'User Interviews · 10 people',
        subtitle: '5 buyers / 5 sellers, only real time spent asked',
        items: [
          {
            label: 'Buyer search time',
            value: 'Avg 23 min; up to 45 min (hunted an hour for a textbook); 1 gave up after 10+ min and switched to Xianyu',
          },
          {
            label: 'Seller deal cycle',
            value: 'Avg 3 days; up to 5 days with 2 last-minute no-shows; fastest 1 day',
          },
          {
            label: 'Invalid inquiries',
            value: '"Listed 4 days, 5 came to ask, only 1 closed" — inquiry-to-deal just 20%',
          },
          {
            label: 'Common finding',
            value: 'Buyers retrieve by scrolling chat history; sellers wait — both lack structured info and proactive matching',
          },
        ],
      },
      {
        title: 'Effect Validation · Template vs Ad-hoc',
        subtitle: 'Core metrics after template launch',
        columns: ['Metric', 'Template', 'Ad-hoc', 'Change'],
        rows: [
          ['First reply', '12 min', '47 min', '-74.5%'],
          ['Avg deal time', '4.2 h', '23.0 h', '-81.7%'],
          ['Inquiry→deal', '38%', '12%', '+216.7%'],
          ['Avg inquiries', '8.4', '3.1', '+171.0%'],
          ['Info completeness', '4.6/5', '2.1/5', '+119.0%'],
        ],
        note: 'A/B on the same item: ad-hoc (blurry pic + one-liner) → 3 inquiries / 1 deal / 38s first reply; standardized template (clear pic + full info) → 11 inquiries / 2 deals / 7 min first reply.',
      },
    ],
  },
  {
    id: 'doubao-research',
    tag: 'User Research · Product Optimization',
    title: 'Doubao Campus User Research & Product Optimization',
    summary:
      "Doubao's user retention and feature-fit in campus scenarios were unclear; the product team lacked deep frontline student feedback. Designed and ran 15 in-depth interviews + 13 surveys, systematically encoded the feedback, compared Doubao vs Kimi vs DeepSeek on campus scenarios, and delivered P0-priority product optimization plans.",
    headline: '15 deep interviews + competitor teardown → 3 P0 fixes',
    actions: [
      'Designed a semi-structured interview guide; completed 15 campus user interviews (30-40 min each) + 13 surveys',
      'Three-level encoded 200+ raw feedback items, mapped the pain map, ranked by frequency / impact',
      'Ran same-scenario cross-evaluation of Kimi / DeepSeek / Doubao; delivered 3 P0-priority plans with prototype suggestions',
    ],
    metrics: [
      { value: '73%', label: 'Core pain coverage' },
      { value: '67%', label: 'Research cycle cut' },
      { value: 'P0', label: 'Plan priority' },
    ],
    reportUrl: 'reports/doubao-research/report.html',
    cover: { tone: 'deep' },
    extras: [
      {
        title: 'Interview Raw Data · 15-person pain clustering',
        subtitle: 'Three-level encoding converged to 3 core issues',
        items: [
          {
            label: 'Inaccurate search · 6/15',
            value:
              'Returns stale content without time labels (Python API stuck at 2021, competitor financials from 2022), broken relevance ranking (rare-disease guideline below popular-science), mistranslated terms ("discourse analysis" → speech analysis)',
          },
          {
            label: 'Too verbose · 5/15',
            value:
              'Long preamble before the conclusion (asking about "Spring River" background → life story then school of thought); key differences buried in 2000 chars; users want "conclusion first, then expand + follow-up"',
          },
          {
            label: 'Poor file recognition · 4/15',
            value:
              '30-page report → only first 5 pages extracted yet claims full summary; PDF-to-table serializes; 1-hour recording loses ~2/3 on transcription; vertical classical OCR <50%',
          },
        ],
        note: '15 interviewees across 15 majors; 9 undergrad / 6 grad; grades freshman to year-3 grad; gender 8:7.',
      },
      {
        title: 'Cross-product Evaluation · Same scenario, same material',
        subtitle: 'Doubao / Kimi / DeepSeek, 5-point blind test',
        columns: ['Scenario', 'Doubao', 'Kimi', 'DeepSeek'],
        rows: [
          ['Paper summary (12p)', '2.5', '4.5', '3.5'],
          ['Long-doc QA (45p)', '2.0', '4.0', '3.5'],
          ['Multi-file compare (3×20p)', '1.5', '4.5', '3.5'],
        ],
        footRow: ['Overall avg', '2.0', '4.3', '3.5'],
        note: "Doubao last on all three; weak in long-context use and unstable multi-file handling: 45-page report answered only first 10 pages, 3 clause PDFs recognized only 2 — the focus of P0 plans.",
      },
    ],
  },
]

export const strengths = [
  {
    id: 'content',
    title: 'Content & Campaign',
    titleEn: '',
    desc: 'From 0 to 1 on vertical content IPs; build standardized SOPs for topics, scripts, editing, and distribution; iterate the content model continuously via backend data for sustainable organic growth.',
    icon: 'pen',
    color: '#FF6B6B',
  },
  {
    id: 'data',
    title: 'Data & Growth',
    titleEn: '',
    desc: 'Drive decisions with metrics and attribution; independently handle data cleaning, funnel breakdown, and A/B design; locate key variables and quantify real operational impact.',
    icon: 'chart',
    color: '#4ECDC4',
  },
  {
    id: 'research',
    title: 'User Research',
    titleEn: '',
    desc: 'Skilled in in-depth interviews, surveys, and usability testing to gather first-hand feedback; encode and cluster to extract user pains; turn qualitative insight into actionable product optimizations.',
    icon: 'people',
    color: '#45B7D1',
  },
  {
    id: 'product',
    title: 'Product Thinking',
    titleEn: '',
    desc: 'Balance business goals against user experience; break down requirements, prioritize, and prototype; deliver clear, executable product plans.',
    icon: 'product',
    color: '#A78BFA',
  },
  {
    id: 'project',
    title: 'Project Management',
    titleEn: '',
    desc: 'Multi-thread project coordination; milestone breakdown, risk pre-emption, and regular review keep delivery on track within controlled scope.',
    icon: 'project',
    color: '#FBBF24',
  },
  {
    id: 'ai',
    title: 'AI Workflow',
    titleEn: '',
    desc: 'Embed AI tools into content production, data processing, and visual design; build human-AI workflows that keep human judgment at key nodes for both efficiency and quality.',
    icon: 'spark',
    color: '#96CEB4',
  },
]

export const softwareTools = [
  {
    name: 'Excel / Pivot Tables',
    desc: 'Functions, pivot tables, metric systems, and weekly operational review — turning messy data into decision dashboards.',
    icon: 'excel',
    color: '#217346',
  },
  {
    name: 'SQL Analysis',
    desc: 'User-behavior extraction, funnel & retention queries, campaign attribution — supporting data-driven operations.',
    icon: 'sql',
    color: '#1E88E5',
  },
  {
    name: 'Modao',
    desc: 'Quick interactive prototypes; clarify page flow for review and requirement alignment.',
    icon: 'modao',
    color: '#22D3A6',
  },
  {
    name: 'Canva',
    desc: 'Posters, covers, campaign materials, and layouts — supporting daily visual output.',
    icon: 'canva',
    color: '#00C4CC',
  },
  {
    name: 'CapCut',
    desc: 'Short-video script breakdown, editing, and captioning — turning topics into distributable clips for steady content supply.',
    icon: 'jianying',
    color: '#1FD85A',
  },
  {
    name: 'AI Tools (ChatGPT / Claude)',
    desc: 'Use AI for draft copy, initial data reading, and competitor organizing — automating repetitive work to free time for judgment and strategy.',
    icon: 'ai',
    color: '#10A37F',
  },
]

export const vibeProjects = [
  {
    id: 'intern-lens',
    title: 'Intern Lens',
    titleEn: '',
    tag: 'Vibe Coding · Single-file Web App',
    summary:
      'An internship-opportunity analysis console for non-target / lower-grade students: structures recruitment copy scattered across groups, official accounts, and websites into comparable dimensions — "friendliness / deadline / how to apply" — and quantifies with a "Friendliness Index" to help you judge "which one to apply to" in the shortest time. Single-file HTML/CSS/JS, zero dependencies, runs offline.',
    headline: 'Turn scattered job posts into one comparable "friendliness index"',
    url: 'https://kimichen24.github.io/intern-lens/',
  },
]

export const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'strengths', label: 'About', href: '#strengths' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]
