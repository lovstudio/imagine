export type CreationModeId =
  | "image"
  | "content"
  | "video-edit"
  | "video-generate"
  | "webpage"

export type CreationMode = {
  id: CreationModeId
  number: string
  label: string
  labelEn: string
  description: string
  placeholder: string
  query: string
  category?: string
  steps: readonly string[]
  acceptance: readonly string[]
}

export const CREATION_MODES: readonly CreationMode[] = [
  {
    id: "image",
    number: "01",
    label: "图片创作",
    labelEn: "IMAGE",
    description: "海报、配图、封面与视觉概念",
    placeholder: "例如：为一场夏夜读书会做一张温暖、克制的活动海报",
    query: "图片创作",
    steps: ["明确画面的使用场景与核心信息", "确定构图、色彩、质感和参考方向", "先出可比较的方案，再选择一个方向细化"],
    acceptance: ["缩略图尺寸下仍能看清核心信息", "视觉风格与使用场景一致", "文字、尺寸与导出格式可直接使用"],
  },
  {
    id: "content",
    number: "02",
    label: "内容创作",
    labelEn: "CONTENT",
    description: "研究、写作、长文与演示",
    placeholder: "例如：把这组访谈整理成一篇有观点、有证据的公众号文章",
    query: "内容创作",
    category: "Content Creation",
    steps: ["定义读者、发布渠道和读完后的行动", "梳理主张、证据与叙事顺序", "先完成结构，再逐段补充材料和语言"],
    acceptance: ["开头能让目标读者理解为何值得继续", "关键判断有来源或例子支撑", "标题、结构与篇幅适合发布渠道"],
  },
  {
    id: "video-edit",
    number: "03",
    label: "视频剪辑",
    labelEn: "EDIT",
    description: "章节、字幕、包装与导出",
    placeholder: "例如：按字幕语义给访谈视频分章节，并生成可编辑的章节条",
    query: "视频剪辑",
    category: "Video Creation",
    steps: ["确认原始素材、目标时长和发布画幅", "按语义与节奏建立章节和取舍清单", "完成字幕、包装、声音与多端导出"],
    acceptance: ["前几秒能说明主题并建立观看预期", "字幕准确且不会遮挡关键画面", "成片时长、画幅与编码符合发布平台"],
  },
  {
    id: "video-generate",
    number: "04",
    label: "视频生成",
    labelEn: "GENERATE",
    description: "脚本、分镜与生成短片",
    placeholder: "例如：把牛顿第一定律做成一条 60 秒、适合中学生的科普短片",
    query: "视频生成",
    category: "Video Creation",
    steps: ["先锁定受众、时长、画幅与单一核心信息", "把脚本拆成可独立生成的镜头和声音线", "逐镜头验证角色、场景和运动的一致性"],
    acceptance: ["每个镜头都服务于核心信息", "人物、物体与视觉风格前后一致", "旁白、字幕与镜头节奏能够对齐"],
  },
  {
    id: "webpage",
    number: "05",
    label: "网页创作",
    labelEn: "WEB",
    description: "落地页、产品页与 Web App",
    placeholder: "例如：为一款独立开发者工具做一个可以直接发布的产品落地页",
    query: "网页生成",
    category: "Dev",
    steps: ["定义页面唯一目标与访客最关心的问题", "用内容层级组织首屏、证据和行动入口", "实现响应式、可访问性、性能与上线检查"],
    acceptance: ["访客在首屏能理解产品价值和下一步", "键盘与移动端都能完成核心操作", "真实链接、表单和发布环境已经验证"],
  },
] as const

export function getCreationMode(modeId: string): CreationMode {
  return CREATION_MODES.find((mode) => mode.id === modeId) ?? CREATION_MODES[0]
}

export function normalizeIntent(intent: string): string {
  return intent.replace(/\s+/g, " ").trim().slice(0, 800)
}

export function createBrief(modeId: string, rawIntent: string): string {
  const mode = getCreationMode(modeId)
  const intent = normalizeIntent(rawIntent)
  if (!intent) throw new Error("请先写下一句话目标。")

  return [
    "LovCreate / 创作 Brief",
    "",
    `创作类型：${mode.label}`,
    `目标：${intent}`,
    "",
    "执行重点",
    ...mode.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "验收标准",
    ...mode.acceptance.map((item) => `- ${item}`),
    "",
    "边界：工具负责减少模糊和重复；最终方向、事实与审美判断由创作者确认。",
  ].join("\n")
}

export function buildSkillsUrl(modeId: string, rawIntent: string): string {
  const mode = getCreationMode(modeId)
  const url = new URL("https://lovstudio.ai/skills")
  url.searchParams.set("query", mode.query)
  if (mode.category) url.searchParams.set("category", mode.category)
  const intent = normalizeIntent(rawIntent)
  if (intent) url.searchParams.set("intent", intent)
  url.searchParams.set("from", "lovcreate")
  url.hash = "skill-catalog"
  return url.toString()
}
