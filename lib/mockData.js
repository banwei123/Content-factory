export const mockArticles = [
  {
    id: "a1",
    title: "AI 知识星球爆火背后的 5 个用户心理洞察",
    keyword: "AI 学习",
    read: 32800,
    likes: 968,
    watch: 412,
    engagement: 0.042,
    summary:
      "拆解头部知识星球的社群设计与转化漏斗，重点分析付费用户的核心诉求与内容节奏。",
  },
  {
    id: "a2",
    title: "ChatGPT 在职场的 12 个真实应用案例",
    keyword: "职场效率",
    read: 51200,
    likes: 1248,
    watch: 536,
    engagement: 0.035,
    summary:
      "围绕运营、HR、产品岗位，从提示语模板到 SOP 制定给出实战案例，互动热度高。",
  },
  {
    id: "a3",
    title: "视频号直播 GMV 三连涨，幕后运营策略拆解",
    keyword: "直播电商",
    read: 28900,
    likes: 842,
    watch: 305,
    engagement: 0.039,
    summary:
      "关注视频号直播从引流、脚本、互动到复盘的全链路打法，适合做参考的 A/B 测试案例。",
  },
  {
    id: "a4",
    title: "自媒体人如何 30 天搭建 AIGC 内容组合拳",
    keyword: "内容创作",
    read: 45800,
    likes: 1580,
    watch: 640,
    engagement: 0.048,
    summary:
      "拆分图文、短视频、社群三个场景，给出工具栈和排期模板，是点赞最高的长图文。",
  },
  {
    id: "a5",
    title: "国潮品牌快闪活动复盘：从选址到种草玩法",
    keyword: "品牌营销",
    read: 19800,
    likes: 602,
    watch: 248,
    engagement: 0.043,
    summary:
      "线下快闪活动结合线上小红书种草的组合策略，包含预算拆分，互动率表现亮眼。",
  },
  {
    id: "a6",
    title: "职场副业热：知识付费课程的冷启动打法",
    keyword: "副业",
    read: 36400,
    likes: 920,
    watch: 298,
    engagement: 0.033,
    summary:
      "聚焦职场人副业刚需，强调“试错成本低 + 结构化知识”卖点，适合衍生内容选题。",
  },
];

export const frequentWords = [
  { word: "AI 创作", weight: 28 },
  { word: "小红书", weight: 24 },
  { word: "副业", weight: 21 },
  { word: "增长", weight: 19 },
  { word: "转化", weight: 17 },
  { word: "直播", weight: 15 },
  { word: "社群", weight: 12 },
  { word: "排期", weight: 11 },
  { word: "洞察", weight: 9 },
  { word: "案例", weight: 8 },
];

export const topicInsights = [
  {
    id: "t1",
    title: "AI 工具 + 职场提效套餐",
    angle: "结合真实岗位痛点，输出“任务 → 提示词 → 结果”三段式模板",
    channel: "公众号 / 视频号 / 企业客户社群",
    recommendation: "适合作为周更专栏，持续累积搜索流量",
  },
  {
    id: "t2",
    title: "视频号直播破局手册",
    angle: "聚焦冷启动账号，从选品、脚本到直播间搭建的 7 步流程",
    channel: "公众号长文 + 小红书长图",
    recommendation: "搭配可下载清单，促进留资",
  },
  {
    id: "t3",
    title: "AIGC 内容矩阵排期表",
    angle: "输出 30 天内容排期及工具链组合拳，强调“省时 + 轻管理”",
    channel: "公众号 / 视频号 / Linkedin",
    recommendation: "适合转化成模板产品",
  },
  {
    id: "t4",
    title: "国潮快闪增长实验室",
    angle: "拆解线下体验 + 线上种草的闭环，用数据标出关键动作",
    channel: "小红书图文 + 公众号案例复盘",
    recommendation: "适用于品牌合作拓展",
  },
  {
    id: "t5",
    title: "知识付费副业指南",
    angle: "以“周末 6 小时副业”概念命题，强调可复制 SOP",
    channel: "公众号 / 知乎专栏",
    recommendation: "可引导进私域社群",
  },
];

export const creationTopics = topicInsights.map((insight, index) => ({
  ...insight,
  status: index === 0 ? "正在生成" : "待创作",
}));

export const unsplashMock = [
  {
    id: "img1",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    description: "Team brainstorming in modern office",
  },
  {
    id: "img2",
    url: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=900&q=80",
    description: "Live streaming studio setup",
  },
  {
    id: "img3",
    url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80",
    description: "Notebook with planning sketches",
  },
  {
    id: "img4",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    description: "Neon city pop-up store",
  },
];

export const managedArticles = [
  {
    id: "m1",
    title: "AI 工具箱 2.0：岗位级提效场景包",
    topic: "AI 工具 + 职场提效套餐",
    status: "待审核",
    channels: ["公众号"],
    createdAt: "2025-01-06 10:24",
    lastUpdated: "10 分钟前",
    contentPreview:
      "围绕产品、运营、市场三个角色，给出“任务 → 提示词 → 示例”结构。",
    history: [
      { time: "今天 10:24", label: "生成完成" },
      { time: "今天 10:25", label: "等待审核" },
    ],
    logs: [
      { id: "l1", channel: "小红书", status: "未发布", detail: "待触发" },
    ],
  },
  {
    id: "m2",
    title: "视频号直播冷启动作战手册",
    topic: "视频号直播破局手册",
    status: "草稿",
    channels: ["小红书", "公众号"],
    createdAt: "2025-01-05 09:11",
    lastUpdated: "昨天",
    contentPreview:
      "以“7 天冲刺计划”形式输出，从人设、脚本到成交转化。",
    history: [
      { time: "昨天 09:11", label: "AI 草稿保存" },
      { time: "昨天 09:40", label: "等待编辑补充" },
    ],
    logs: [
      {
        id: "l2",
        channel: "小红书",
        status: "失败",
        detail: "等待素材确认",
        time: "昨天 14:02",
      },
    ],
  },
  {
    id: "m3",
    title: "国潮快闪 X 小红书的闭环打法",
    topic: "国潮快闪增长实验室",
    status: "已发布",
    channels: ["小红书", "公众号"],
    createdAt: "2024-12-28 16:40",
    lastUpdated: "2024-12-28",
    contentPreview:
      "通过线下体验节点拆解以及线上种草节奏，展示三条标准动作路径。",
    history: [
      { time: "2024-12-28 15:10", label: "审核通过" },
      { time: "2024-12-28 16:40", label: "双渠道发布成功" },
    ],
    logs: [
      {
        id: "l3",
        channel: "小红书",
        status: "成功",
        detail: "链接：/xhs/20241228",
        time: "2024-12-28 16:41",
      },
      {
        id: "l4",
        channel: "公众号",
        status: "成功",
        detail: "消息 ID: wx_88921",
        time: "2024-12-28 16:45",
      },
    ],
  },
];

