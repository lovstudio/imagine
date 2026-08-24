import {
  ArrowUpRight,
  Clapperboard,
  Code2,
  FileText,
  ImageIcon,
  Scissors,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CreationModeId } from "./brief.ts";
import { getCreationTarget } from "./brief.ts";
import { buildSkillDetailUrl } from "./navigation.ts";

const TOOL_COPY: Record<
  string,
  {
    titleZh: string;
    titleEn: string;
    descriptionZh: string;
    descriptionEn: string;
  }
> = {
  risoPortrait: {
    titleZh: "Riso 人像工坊",
    titleEn: "Riso Portrait Studio",
    descriptionZh:
      "上传照片，调配双色油墨、网点与错版效果，生成可下载的孔版印刷风格人像",
    descriptionEn:
      "Turn a photo into a downloadable two-color Risograph portrait with halftone texture and registration offset",
  },
  shougongchuanStyle: {
    titleZh: "手工川风格复刻",
    titleEn: "Shougongchuan Style Remix",
    descriptionZh: "上传一张照片，自动用手工川的线稿画风重绘头像",
    descriptionEn:
      "Upload a photo and redraw it in Shougongchuan's hand-drawn line-art style",
  },
  imageCollage: {
    titleZh: "自动拼图器",
    titleEn: "Auto Image Collage",
    descriptionZh:
      "上传多张图片，自动分析比例并生成适合 PPT、文章和 Markdown 的拼图",
    descriptionEn:
      "Compose multiple images into an export-ready figure for slides, articles, and Markdown",
  },
  prompt: {
    titleZh: "AI 图片 Prompt 生成器",
    titleEn: "AI Image Prompt Generator",
    descriptionZh: "生成祝福图 prompt，复制到 Nano Banana Pro 运行",
    descriptionEn: "Generate greeting-card prompts ready for Nano Banana Pro",
  },
  markdownPptx: {
    titleZh: "Markdown PPTX 生成器",
    titleEn: "Markdown PPTX Generator",
    descriptionZh: "用 Markdown 编排幻灯片主内容、备注、图片、附件与链接",
    descriptionEn:
      "Create slides, notes, images, files, and links from Markdown",
  },
  photoArticleLayout: {
    titleZh: "图文混排编辑器",
    titleEn: "Photo Article Layout",
    descriptionZh: "标题与图片交替排版，并导出为图片",
    descriptionEn: "Alternate headings and images, then export as one image",
  },
  translator: {
    titleZh: "爱上翻译",
    titleEn: "Love Translate",
    descriptionZh: "多语言同时输出，支持直译、口语、书面风格与语音播放",
    descriptionEn:
      "Multi-language output with literal, spoken, written, and voice modes",
  },
  sharer: {
    titleZh: "内容分享器",
    titleEn: "Content Sharer",
    descriptionZh: "将文本内容转为可分享的 URL，支持外部 Agent 直接读取",
    descriptionEn:
      "Convert text into a shareable URL that external agents can read",
  },
  siteExporter: {
    titleZh: "网站导出器",
    titleEn: "Site Exporter",
    descriptionZh: "输入网址，列出页面路径并导出为 Markdown 压缩包",
    descriptionEn:
      "List a site's page paths and export them as a Markdown archive",
  },
};

type CreationModePreviewProps = {
  modeId: CreationModeId;
  zh: boolean;
  catalogHref: string;
  selectedEntryId?: string;
  onSelectEntry: (entry: CreationCapabilitySelection) => void;
};

type PreviewArtwork =
  | "riso"
  | "shougongchuan"
  | "collage"
  | "image-prompt"
  | "deck"
  | "article"
  | "translator"
  | "share"
  | "video-chapter"
  | "video-catalog"
  | "storyboard"
  | "video-remix"
  | "video-generate"
  | "app-generator"
  | "warm-academic"
  | "neo-brutalism"
  | "site-exporter";

type PreviewEntry = {
  id: string;
  kind: "tool" | "skill" | "catalog" | "style" | "template";
  href?: string;
  artwork: PreviewArtwork;
  i18nKey?: string;
  titleZh?: string;
  titleEn?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  external?: boolean;
};

export type CreationCapabilitySelection = {
  id: string;
  modeId: CreationModeId;
  kind: PreviewEntry["kind"];
  label: string;
  description: string;
};

type ModeCopy = {
  Icon: LucideIcon;
  titleZh: string;
  titleEn: string;
  countZh: string;
  countEn: string;
};

const MODE_COPY: Record<CreationModeId, ModeCopy> = {
  image: {
    Icon: ImageIcon,
    titleZh: "图片风格与工具",
    titleEn: "Image styles and tools",
    countZh: "点卡片用于 Agent，点箭头直接打开",
    countEn: "Select for Agent, or use the arrow to open",
  },
  content: {
    Icon: FileText,
    titleZh: "内容工具",
    titleEn: "Content tools",
    countZh: "点卡片用于 Agent，点箭头直接打开",
    countEn: "Select for Agent, or use the arrow to open",
  },
  "video-edit": {
    Icon: Scissors,
    titleZh: "视频剪辑能力",
    titleEn: "Video editing capabilities",
    countZh: "点卡片用于 Agent，点箭头直接打开",
    countEn: "Select for Agent, or use the arrow to open",
  },
  "video-generate": {
    Icon: Clapperboard,
    titleZh: "视频生成能力",
    titleEn: "Video generation capabilities",
    countZh: "点卡片用于 Agent，点箭头直接打开",
    countEn: "Select for Agent, or use the arrow to open",
  },
  webpage: {
    Icon: Code2,
    titleZh: "网页工具与风格",
    titleEn: "Web tools and styles",
    countZh: "点卡片用于 Agent，点箭头直接打开",
    countEn: "Select for Agent, or use the arrow to open",
  },
};

export function CreationModePreview({
  modeId,
  zh,
  catalogHref,
  selectedEntryId,
  onSelectEntry,
}: CreationModePreviewProps) {
  const copy = MODE_COPY[modeId];
  const Icon = copy.Icon;
  const entries = getPreviewEntries(modeId, catalogHref);

  return (
    <section
      key={modeId}
      data-testid={`creation-preview-${modeId}`}
      aria-label={zh ? copy.titleZh : copy.titleEn}
      className="mt-5 animate-in fade-in slide-in-from-bottom-1 duration-200"
    >
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground sm:text-base">
              {zh ? copy.titleZh : copy.titleEn}
            </h2>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
            {zh ? copy.countZh : copy.countEn}
          </p>
        </div>
        <a
          href={catalogHref}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {zh ? "查看相关能力" : "View related"}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div
        data-testid={`creation-preview-grid-${modeId}`}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {entries.map((entry) => {
          const localizedTool = entry.i18nKey
            ? TOOL_COPY[entry.i18nKey]
            : undefined;
          const title = localizedTool
            ? zh
              ? localizedTool.titleZh
              : localizedTool.titleEn
            : zh
            ? entry.titleZh
            : entry.titleEn;
          const description = localizedTool
            ? zh
              ? localizedTool.descriptionZh
              : localizedTool.descriptionEn
            : zh
            ? entry.descriptionZh
            : entry.descriptionEn;
          const selected = entry.id === selectedEntryId;
          const selection: CreationCapabilitySelection = {
            id: entry.id,
            modeId,
            kind: entry.kind,
            label: title ?? entry.id,
            description: description ?? "",
          };

          return (
            <article
              key={entry.id}
              data-testid={`creation-preview-card-${entry.id}`}
              data-preview-kind={entry.kind}
              data-selected={selected ? "true" : "false"}
              className={`group relative min-w-0 overflow-hidden rounded-2xl border bg-card text-left shadow-[0_16px_42px_-38px_rgba(58,41,28,0.8)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-34px_rgba(190,76,45,0.5)] ${
                selected
                  ? "border-primary ring-2 ring-primary/15"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectEntry(selection)}
                aria-pressed={selected}
                aria-label={
                  zh ? `选中 ${title}，用于 Agent` : `Select ${title} for Agent`
                }
                data-testid={`creation-preview-select-${entry.id}`}
                className="absolute inset-0 z-10 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="sr-only">
                  {zh
                    ? `选中 ${title}，用于 Agent`
                    : `Select ${title} for Agent`}
                </span>
              </button>
              <div className="pointer-events-none relative">
                <div className="aspect-[4/3] overflow-hidden border-b border-border bg-muted/40">
                  <PreviewCardArtwork artwork={entry.artwork} zh={zh} />
                </div>
                <div className="p-3 sm:p-3.5">
                  <div className="flex items-center gap-2">
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground sm:text-[15px]">
                      {title}
                    </h3>
                    {entry.href && (
                      <a
                        href={entry.href}
                        target={entry.external ? "_blank" : undefined}
                        rel={entry.external ? "noreferrer" : undefined}
                        aria-label={zh ? `打开 ${title}` : `Open ${title}`}
                        title={zh ? `打开 ${title}` : `Open ${title}`}
                        data-testid={`creation-preview-open-${entry.id}`}
                        className="pointer-events-auto relative z-20 -mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[background-color,color,transform] hover:-translate-y-0.5 hover:bg-primary/[0.08] hover:text-primary active:translate-y-0 active:scale-95 focus-visible:bg-primary/[0.08] focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                      >
                        <ArrowUpRight
                          className="h-3.5 w-3.5"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                  <p className="mt-1 min-h-8 line-clamp-2 text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getPreviewEntries(
  modeId: CreationModeId,
  catalogHref: string
): PreviewEntry[] {
  const detailHref = (skillId: string) =>
    buildSkillDetailUrl(skillId, getCreationTarget(modeId, ""));

  if (modeId === "image") {
    return [
      {
        id: "riso-portrait",
        kind: "tool",
        href: "https://lovstudio.ai/tools/riso-portrait",
        artwork: "riso",
        i18nKey: "risoPortrait",
      },
      {
        id: "shougongchuan-style",
        kind: "tool",
        href: "https://lovstudio.ai/tools/shougongchuan-style",
        artwork: "shougongchuan",
        i18nKey: "shougongchuanStyle",
      },
      {
        id: "image-collage",
        kind: "tool",
        href: "https://lovstudio.ai/tools/image-collage",
        artwork: "collage",
        i18nKey: "imageCollage",
      },
      {
        id: "ai-image-prompt",
        kind: "tool",
        href: "https://lovstudio.ai/tools/ai-image-prompt",
        artwork: "image-prompt",
        i18nKey: "prompt",
      },
    ];
  }

  if (modeId === "content") {
    return [
      {
        id: "markdown-pptx",
        kind: "tool",
        href: "https://lovstudio.ai/tools/markdown-pptx",
        artwork: "deck",
        i18nKey: "markdownPptx",
      },
      {
        id: "photo-article-layout",
        kind: "tool",
        href: "https://lovstudio.ai/tools/photo-article-layout",
        artwork: "article",
        i18nKey: "photoArticleLayout",
      },
      {
        id: "translator",
        kind: "tool",
        href: "https://lovstudio.ai/tools/translator",
        artwork: "translator",
        i18nKey: "translator",
      },
      {
        id: "content-sharer",
        kind: "tool",
        href: "https://lovstudio.ai/tools/content-sharer",
        artwork: "share",
        i18nKey: "sharer",
      },
    ];
  }

  if (modeId === "video-edit") {
    return [
      {
        id: "video-chapter",
        kind: "skill",
        href: "https://github.com/lovstudio/video-chapter-skill",
        artwork: "video-chapter",
        titleZh: "视频章节",
        titleEn: "Video chapters",
        descriptionZh: "按字幕语义规划章节，并生成可编辑的章节条。",
        descriptionEn:
          "Plan chapters from subtitle meaning and render editable chapter bars.",
        external: true,
      },
      {
        id: "video-edit-catalog",
        kind: "catalog",
        href: catalogHref,
        artwork: "video-catalog",
        titleZh: "匹配剪辑能力",
        titleEn: "Match editing capabilities",
        descriptionZh: "根据你的素材和交付目标查找合适的剪辑能力。",
        descriptionEn:
          "Find editing capabilities for your footage and delivery goal.",
      },
    ];
  }

  if (modeId === "video-generate") {
    return [
      {
        id: "video-remix",
        kind: "template",
        artwork: "video-remix",
        titleZh: "视频复刻",
        titleEn: "Video remake",
        descriptionZh:
          "提供参考视频，拆解镜头、节奏与画面风格，生成可执行的复刻方案。",
        descriptionEn:
          "Use a reference video to map its shots, pacing, and visual language into a workable remake plan.",
      },
      {
        id: "storyboard-image-creator",
        kind: "skill",
        href: detailHref("image-creator"),
        artwork: "storyboard",
        titleZh: "分镜画面生成",
        titleEn: "Storyboard frames",
        descriptionZh: "先生成统一风格的关键画面，再进入视频制作。",
        descriptionEn:
          "Create consistent key frames before assembling the video.",
      },
      {
        id: "video-generate-catalog",
        kind: "catalog",
        href: catalogHref,
        artwork: "video-generate",
        titleZh: "匹配视频生成能力",
        titleEn: "Match video generation",
        descriptionZh: "根据脚本、时长和画面要求查找合适能力。",
        descriptionEn:
          "Find capabilities based on script, duration, and visual needs.",
      },
    ];
  }

  return [
    {
      id: "app-generator",
      kind: "skill",
      href: detailHref("app-generator"),
      artwork: "app-generator",
      titleZh: "App 生成器",
      titleEn: "App generator",
      descriptionZh: "从需求开始生成可运行、可继续迭代的 Web App。",
      descriptionEn:
        "Turn a brief into a working web app that is ready to iterate.",
    },
    {
      id: "warm-academic",
      kind: "style",
      href: "https://lovstudio.ai/tools/design-style-gallery/warm-academic",
      artwork: "warm-academic",
      titleZh: "暖学术风格",
      titleEn: "Warm Academic",
      descriptionZh: "克制、温暖，适合知识产品与个人品牌。",
      descriptionEn:
        "Restrained and warm for knowledge products and personal brands.",
    },
    {
      id: "neo-brutalism",
      kind: "style",
      href: "https://lovstudio.ai/tools/design-style-gallery/neo-brutalism",
      artwork: "neo-brutalism",
      titleZh: "新粗野主义",
      titleEn: "Neo-Brutalism",
      descriptionZh: "高对比、硬边框，适合强调行动的产品页面。",
      descriptionEn:
        "High contrast and hard edges for action-focused product pages.",
    },
    {
      id: "site-exporter",
      kind: "tool",
      href: "https://lovstudio.ai/tools/site-exporter",
      artwork: "site-exporter",
      i18nKey: "siteExporter",
    },
  ];
}

function PreviewCardArtwork({
  artwork,
  zh,
}: {
  artwork: PreviewArtwork;
  zh: boolean;
}) {
  if (artwork === "riso") {
    return (
      <div
        data-testid="riso-preview-artwork"
        className="relative h-full overflow-hidden bg-[#f1e5cb]"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 [background-image:radial-gradient(#263a3a_0.7px,transparent_0.8px)] [background-size:5px_5px]"
        />
        <div className="absolute -right-[4%] top-[4%] h-[82%] w-[66%] rounded-[48%_52%_45%_55%] bg-[#067d87] opacity-90 mix-blend-multiply" />
        <div className="absolute right-[8%] top-[12%] h-[82%] w-[66%] translate-x-1.5 rounded-[48%_52%_45%_55%] bg-[#ee4f35] opacity-85 mix-blend-multiply" />
        <div className="absolute left-[10%] top-[15%] h-[56%] w-[45%] rounded-[52%_48%_46%_54%] border-[3px] border-[#182a2d] bg-[#f1e5cb]" />
        <div className="absolute left-[19%] top-[34%] h-2.5 w-2.5 rounded-full bg-[#182a2d]" />
        <div className="absolute left-[36%] top-[34%] h-2.5 w-2.5 rounded-full bg-[#182a2d]" />
        <div className="absolute left-[22%] top-[53%] h-5 w-[22%] rounded-b-full border-b-2 border-[#182a2d]" />
        <div className="absolute bottom-[10%] left-[8%] border-2 border-[#182a2d] bg-[#f3bc2a] px-2 py-1 font-mono text-[8px] font-bold tracking-[0.14em] text-[#182a2d] shadow-[2px_2px_0_#182a2d]">
          RISO / 02 INKS
        </div>
      </div>
    );
  }

  if (artwork === "shougongchuan") {
    return (
      <div className="relative h-full bg-[#e8b29b]">
        <img
          src="https://lovstudio.ai/remix/shougongchuan-style.png"
          alt={
            zh
              ? "手工川橙色线稿头像风格示例"
              : "Shougongchuan orange line-art avatar style"
          }
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  if (artwork === "collage") {
    return (
      <div className="grid h-full grid-cols-3 grid-rows-2 gap-1.5 bg-[#ece7dc] p-3">
        <div className="col-span-2 bg-[#c85d43]" />
        <div className="bg-[#344e4a]" />
        <div className="bg-[#e2b65d]" />
        <div className="col-span-2 relative overflow-hidden bg-[#d9c8b4]">
          <span className="absolute bottom-2 left-2 font-serif text-sm font-semibold text-[#2f2b26]">
            03 / 06
          </span>
        </div>
      </div>
    );
  }

  if (artwork === "image-prompt") {
    return (
      <div className="flex h-full flex-col justify-between bg-[#252b2a] p-4 text-[#f5ead7]">
        <Sparkles className="h-5 w-5 text-[#e4a34f]" />
        <div>
          <p className="font-mono text-[8px] tracking-[0.14em] text-[#d57154]">
            SUBJECT + LIGHT + STYLE
          </p>
          <p className="mt-1 font-serif text-lg leading-none">
            {zh ? "一句话，变成画面。" : "Words into images."}
          </p>
        </div>
      </div>
    );
  }

  if (artwork === "deck") {
    return (
      <div className="relative h-full overflow-hidden bg-[#ddd6c9] p-4">
        <div className="absolute left-5 top-4 h-[72%] w-[72%] -rotate-3 border border-[#9c8e7e] bg-[#fcfaf5] p-3 shadow-[5px_6px_0_rgba(55,45,35,0.12)]">
          <span className="font-mono text-[7px] text-[#bd543a]">SLIDE 01</span>
          <p className="mt-3 font-serif text-base font-semibold leading-tight text-[#282521]">
            Markdown
            <br />
            to Deck
          </p>
          <span className="mt-4 block h-1 w-12 bg-[#bd543a]" />
        </div>
      </div>
    );
  }

  if (artwork === "article") {
    return (
      <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-2 bg-[#eee8dc] p-3">
        <div className="bg-[#bc6048]" />
        <div className="flex flex-col bg-[#fffdf7] p-2">
          <span className="font-serif text-sm font-semibold text-[#2c2925]">
            {zh ? "图文排版" : "Story"}
          </span>
          <span className="mt-2 h-1 w-full bg-[#d2c9bc]" />
          <span className="mt-1 h-1 w-[86%] bg-[#d2c9bc]" />
          <span className="mt-1 h-1 w-[62%] bg-[#d2c9bc]" />
          <span className="mt-auto font-mono text-[7px] text-[#a2523f]">
            PNG / EXPORT
          </span>
        </div>
      </div>
    );
  }

  if (artwork === "translator") {
    return (
      <div className="flex h-full items-center justify-center gap-3 bg-[#e7e1d6] p-4">
        <span className="font-serif text-4xl text-[#b65038]">文</span>
        <span className="font-mono text-xs text-[#7a746b]">→</span>
        <span className="font-serif text-4xl text-[#294c49]">A</span>
      </div>
    );
  }

  if (artwork === "share") {
    return (
      <div className="flex h-full items-center justify-center bg-[#2b3f3d] p-4">
        <div className="w-full rounded-lg border border-[#f3e7d2]/30 bg-[#f3e7d2] p-3">
          <span className="block h-1.5 w-[64%] bg-[#d1694d]" />
          <span className="mt-2 block h-1 w-full bg-[#c8bbaa]" />
          <span className="mt-1 block h-1 w-[78%] bg-[#c8bbaa]" />
          <span className="mt-3 block font-mono text-[7px] text-[#355653]">
            lovstudio.ai/p/•••
          </span>
        </div>
      </div>
    );
  }

  if (artwork === "video-chapter") {
    return (
      <div className="relative h-full overflow-hidden bg-[#252422] p-3">
        <div className="aspect-video border border-white/15 bg-[#55453d]">
          <div className="flex h-full items-center justify-center bg-[#9f5544]">
            <Clapperboard className="h-8 w-8 text-[#f3ddbd]" />
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="flex gap-1">
            <span className="h-2 w-[31%] bg-[#d66649]" />
            <span className="h-2 w-[22%] bg-[#e3b465]" />
            <span className="h-2 flex-1 bg-white/20" />
          </div>
          <span className="mt-1 block font-mono text-[7px] text-white/50">
            CHAPTER 01 · 00:42
          </span>
        </div>
      </div>
    );
  }

  if (artwork === "video-catalog") {
    return (
      <div className="grid h-full grid-cols-3 gap-1 bg-[#ddd6ca] p-3">
        {["#b85a43", "#3c5551", "#d4a856"].map((color, index) => (
          <div key={color} className="relative" style={{ background: color }}>
            <span className="absolute bottom-1 left-1 font-mono text-[7px] text-white/80">
              0{index + 1}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (artwork === "storyboard") {
    return (
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-1.5 bg-[#ede6d8] p-3">
        {["#d26c4e", "#385753", "#d7ad5b", "#7d685b"].map((color, index) => (
          <div key={color} className="relative" style={{ background: color }}>
            <span className="absolute left-1 top-1 font-mono text-[6px] text-white/80">
              SHOT 0{index + 1}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (artwork === "video-remix") {
    return (
      <div className="relative flex h-full items-center gap-2 overflow-hidden bg-[#202b32] p-3">
        <div className="relative h-[72%] flex-1 overflow-hidden border border-[#e8d6b7]/35 bg-[#c05d48]">
          <span className="absolute left-1.5 top-1.5 font-mono text-[6px] tracking-[0.12em] text-[#f7ead4]/85">
            REFERENCE
          </span>
          <span className="absolute inset-x-[38%] top-[36%] h-5 w-5 rounded-full border border-[#f7ead4]/80 bg-[#203d43]/80" />
        </div>
        <span className="font-mono text-[10px] text-[#e8d6b7]">→</span>
        <div className="grid h-[72%] flex-1 grid-cols-2 gap-1 border border-[#e8d6b7]/35 bg-[#e9dfcf] p-1">
          {["#3f625f", "#d7a852", "#a45c48", "#65756e"].map((color, index) => (
            <span
              key={color}
              className="relative"
              style={{ background: color }}
            >
              <span className="absolute bottom-0.5 left-0.5 font-mono text-[5px] text-white/80">
                0{index + 1}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (artwork === "video-generate") {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#263d3b]">
        <div className="h-[66%] w-[74%] border border-[#f0dfc2]/50 bg-[#c86549]">
          <div className="flex h-full items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f4e1bd] bg-[#263d3b] text-[#f4e1bd]">
              ▶
            </span>
          </div>
        </div>
        <span className="absolute bottom-2 right-3 font-mono text-[7px] text-[#f0dfc2]/70">
          00:00—00:08
        </span>
      </div>
    );
  }

  if (artwork === "app-generator") {
    return (
      <div className="h-full bg-[#ded8ce] p-3">
        <div className="h-full overflow-hidden rounded-md border border-[#9e968a] bg-[#faf7f0]">
          <div className="flex h-5 items-center gap-1 border-b border-[#ccc4b9] px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c85b42]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a550]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#41615c]" />
          </div>
          <div className="p-3">
            <span className="font-mono text-[7px] text-[#b45038]">
              NEW PROJECT
            </span>
            <p className="mt-2 font-serif text-base font-semibold text-[#292621]">
              Web App
            </p>
            <span className="mt-3 block h-4 w-16 rounded-full bg-[#355651]" />
          </div>
        </div>
      </div>
    );
  }

  if (artwork === "warm-academic") {
    return (
      <div className="flex h-full flex-col justify-between bg-[#f9f9f7] p-4">
        <p className="font-serif text-2xl font-semibold text-[#181818]">
          Study<span className="text-[#cc785c]">.</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="h-5 w-5 bg-[#cc785c]" />
          <span className="h-5 w-5 border border-[#cc785c]" />
          <span className="ml-auto font-serif text-[8px] italic text-[#6b6b6b]">
            est. 2024
          </span>
        </div>
      </div>
    );
  }

  if (artwork === "neo-brutalism") {
    return (
      <div className="flex h-full items-center justify-center gap-3 bg-[#ffe500] p-4">
        <span className="-rotate-2 border-[3px] border-black bg-white px-3 py-2 text-xs font-black text-black shadow-[4px_4px_0_#000]">
          CLICK
        </span>
        <span className="h-10 w-10 border-[3px] border-black bg-[#ff5c8d] shadow-[3px_3px_0_#000]" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-[#dcd6ca] p-4">
      <div className="w-full rounded-md border border-[#a49b8d] bg-[#f7f3eb] p-3 shadow-[5px_6px_0_rgba(66,52,39,0.12)]">
        <Code2 className="h-4 w-4 text-[#b9553d]" />
        <span className="mt-3 block h-1.5 w-full bg-[#cfc6b8]" />
        <span className="mt-1.5 block h-1.5 w-[76%] bg-[#cfc6b8]" />
        <span className="mt-3 block font-mono text-[7px] text-[#345450]">
          EXPORT / MARKDOWN
        </span>
      </div>
    </div>
  );
}
