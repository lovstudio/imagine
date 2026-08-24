import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Clapperboard,
  Code2,
  Film,
  Image as ImageIcon,
  PenLine,
  Send,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  buildSkillsUrl,
  canSubmitCreationIntent,
  createBrief,
  isCreationSubmitShortcut,
  type CreationModeId,
} from "./brief.ts";
import { AgentModeTabs, type AgentModeTab } from "./AgentModeTabs.tsx";
import {
  CreationModePreview,
  type CreationCapabilitySelection,
} from "./CreationModePreview.tsx";

type CreationMode = {
  id: CreationModeId;
  labelZh: string;
  labelEn: string;
  descriptionZh: string;
  descriptionEn: string;
  placeholderZh: string;
  placeholderEn: string;
  Icon: LucideIcon;
};
const CREATION_MODES: CreationMode[] = [
  {
    id: "image",
    labelZh: "生成图片",
    labelEn: "Generate image",
    descriptionZh: "海报、配图、视觉概念",
    descriptionEn: "Posters, illustrations, visual concepts",
    placeholderZh: "例如：为一场夏夜读书会做一张温暖、克制的活动海报",
    placeholderEn:
      "e.g. Create a warm, restrained poster for a summer reading night",
    Icon: ImageIcon,
  },
  {
    id: "content",
    labelZh: "内容创作",
    labelEn: "Create content",
    descriptionZh: "研究、写作、长文与演示",
    descriptionEn: "Research, writing, long-form, and slides",
    placeholderZh: "例如：把这组访谈整理成一篇有观点、有证据的公众号文章",
    placeholderEn:
      "e.g. Turn these interviews into an evidence-led article with a clear point of view",
    Icon: PenLine,
  },
  {
    id: "video-edit",
    labelZh: "视频剪辑",
    labelEn: "Edit video",
    descriptionZh: "章节、字幕、包装与导出",
    descriptionEn: "Chapters, captions, overlays, and export",
    placeholderZh: "例如：按字幕语义给访谈视频分章节，并生成可编辑的章节条",
    placeholderEn:
      "e.g. Split an interview into semantic chapters and create editable overlays",
    Icon: Clapperboard,
  },
  {
    id: "video-generate",
    labelZh: "视频生成",
    labelEn: "Generate video",
    descriptionZh: "脚本、分镜与短片",
    descriptionEn: "Scripts, storyboards, and short videos",
    placeholderZh: "例如：把牛顿第一定律做成一条 60 秒、适合中学生的科普短片",
    placeholderEn:
      "e.g. Turn Newton's first law into a 60-second explainer for students",
    Icon: Film,
  },
  {
    id: "webpage",
    labelZh: "网页生成",
    labelEn: "Build webpage",
    descriptionZh: "落地页、产品页与 Web App",
    descriptionEn: "Landing pages, product sites, and web apps",
    placeholderZh: "例如：为一款独立开发者工具做一个可直接发布的产品落地页",
    placeholderEn:
      "e.g. Build a publish-ready landing page for an indie developer tool",
    Icon: Code2,
  },
];

const DEFAULT_CREATION_MODE_ID: CreationModeId = "image";
const CREATION_MODE_STORAGE_KEY = "lovcreator:creation-mode";

function isCreationModeId(value: string | null): value is CreationModeId {
  return CREATION_MODES.some((mode) => mode.id === value);
}

function rememberCreationMode(modeId: CreationModeId | null) {
  try {
    if (modeId) {
      window.localStorage.setItem(CREATION_MODE_STORAGE_KEY, modeId);
    } else {
      window.localStorage.removeItem(CREATION_MODE_STORAGE_KEY);
    }
  } catch {
    // State still works for this visit when storage is unavailable.
  }
}

function modeName(mode: CreationMode, zh: boolean) {
  return zh ? mode.labelZh : mode.labelEn;
}

export function CreatorWorkspace({ zh }: { zh: boolean }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLElement>(null);
  const [activeModeId, setActiveModeId] = useState<CreationModeId | null>(
    DEFAULT_CREATION_MODE_ID
  );
  const [selectedCapability, setSelectedCapability] =
    useState<CreationCapabilitySelection | null>(null);
  const [intent, setIntent] = useState("");
  const [brief, setBrief] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const activeMode =
    CREATION_MODES.find((mode) => mode.id === activeModeId) ?? null;

  useEffect(() => {
    try {
      const storedModeId = window.localStorage.getItem(
        CREATION_MODE_STORAGE_KEY
      );
      if (isCreationModeId(storedModeId)) {
        setActiveModeId(storedModeId);
      } else if (storedModeId) {
        window.localStorage.removeItem(CREATION_MODE_STORAGE_KEY);
      }
    } catch {
      // Keep the default selection when storage is unavailable.
    }
  }, []);

  const submit = () => {
    if (!canSubmitCreationIntent(intent)) {
      textareaRef.current?.focus();
      return;
    }

    const modeId = activeMode?.id ?? DEFAULT_CREATION_MODE_ID;
    setBrief(createBrief(modeId, intent));
    setCopyStatus("");
    window.requestAnimationFrame(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (isCreationSubmitShortcut(event)) {
      event.preventDefault();
      submit();
    }
  };

  const selectMode = (mode: CreationMode) => {
    setActiveModeId(mode.id);
    rememberCreationMode(mode.id);
    setSelectedCapability(null);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const selectCapability = (entry: CreationCapabilitySelection) => {
    setSelectedCapability(entry);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const clearCreationContext = () => {
    setActiveModeId(null);
    rememberCreationMode(null);
    setSelectedCapability(null);
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyStatus(zh ? "已复制" : "Copied");
    } catch {
      setCopyStatus(
        zh
          ? "复制失败，请手动选择文字。"
          : "Copy failed. Select the text manually."
      );
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <section
        id="home-creation"
        aria-labelledby="home-creation-title"
        data-testid="home-creation-hero"
        className="relative isolate scroll-mt-20 border-b border-border px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.14),transparent_34%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.28] [background-image:radial-gradient(hsl(var(--foreground)/0.16)_0.7px,transparent_0.7px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_76%)]"
        />
        <div
          aria-hidden
          className="absolute -left-32 top-36 -z-10 h-80 w-80 rounded-full bg-[#e8b45f]/10 blur-3xl"
        />

        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
              {zh ? "从这里开始" : "START HERE"}
            </p>
            <h1
              id="home-creation-title"
              className="mt-4 text-balance font-serif text-[2.35rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl"
            >
              {zh ? "有个想法？做出来看看。" : "Have an idea? Make it real."}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {zh
                ? "不用先选工具，也不用把需求想得很完整。写下你想要的结果，从一句话开始。"
                : "You do not need to pick a tool or arrive with a perfect brief. Write down the result you want and start with one sentence."}
            </p>
          </header>

          <div className="mx-auto mt-7 max-w-4xl md:mt-9">
            <form
              onSubmit={handleSubmit}
              data-testid="creation-form"
              className="relative rounded-[1.75rem] border border-foreground/15 bg-card/95 p-2 shadow-[0_28px_90px_-42px_rgba(58,41,28,0.55)] backdrop-blur transition-[border-color,box-shadow] duration-200 has-[textarea:focus-visible]:border-primary/60 has-[textarea:focus-visible]:ring-4 has-[textarea:focus-visible]:ring-primary/10 sm:p-3"
            >
              <textarea
                ref={textareaRef}
                id="creation-intent"
                value={intent}
                onChange={(event) => setIntent(event.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={
                  zh ? "写下你想做的东西" : "Write down what you want to make"
                }
                placeholder={
                  selectedCapability
                    ? zh
                      ? `想用「${selectedCapability.label}」做什么？`
                      : `What would you like to make with ${selectedCapability.label}?`
                    : activeMode
                    ? zh
                      ? activeMode.placeholderZh
                      : activeMode.placeholderEn
                    : zh
                    ? "比如：把这组访谈整理成一篇适合发公众号的文章"
                    : "For example: turn these interviews into an article ready to publish"
                }
                rows={4}
                maxLength={800}
                className="min-h-32 w-full resize-none rounded-[1.25rem] bg-transparent px-4 pb-16 pt-2 text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground/65 sm:min-h-36 sm:px-5 sm:pb-16 sm:pt-3 sm:text-lg"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:inset-x-4">
                {activeMode && (
                  <div
                    data-testid="creation-context"
                    aria-live="polite"
                    className="flex min-w-0 items-center gap-2 rounded-full bg-muted/70 px-3 py-2 text-xs font-medium text-foreground"
                  >
                    <activeMode.Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">
                      {`${modeName(activeMode, zh)}${
                        selectedCapability
                          ? ` / ${selectedCapability.label}`
                          : ""
                      }`}
                    </span>
                    <button
                      type="button"
                      onClick={clearCreationContext}
                      aria-label={zh ? "清除创作方式" : "Clear creation mode"}
                      title={zh ? "清除创作方式" : "Clear creation mode"}
                      data-testid="creation-context-clear"
                      className="-mr-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
                <div className="ml-auto flex items-center gap-3">
                  <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                    {zh ? "⌘ / Ctrl + Enter" : "⌘ / Ctrl + Enter"}
                  </span>
                  <button
                    type="submit"
                    disabled={!canSubmitCreationIntent(intent)}
                    data-testid="creation-submit"
                    className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-3 text-sm font-semibold text-background transition-all hover:bg-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35 sm:px-5"
                  >
                    <span className="sm:hidden">{zh ? "开始做" : "Start"}</span>
                    <span className="hidden sm:inline">
                      {zh ? "开始做" : "Start making"}
                    </span>
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>

            <AgentModeTabs
              items={CREATION_MODES.map(
                (mode): AgentModeTab<CreationModeId> => ({
                  id: mode.id,
                  label: modeName(mode, zh),
                  Icon: mode.Icon,
                })
              )}
              selectedId={activeModeId}
              onSelect={(item) => {
                const mode = CREATION_MODES.find(({ id }) => id === item.id);
                if (mode) selectMode(mode);
              }}
              ariaLabel={zh ? "选择创作场景" : "Choose a creation mode"}
              className="mt-5"
              testIdPrefix="creation-mode"
            />

            {activeMode && (
              <CreationModePreview
                modeId={activeMode.id}
                zh={zh}
                catalogHref={buildSkillsUrl(activeMode.id, intent)}
                selectedEntryId={selectedCapability?.id}
                onSelectEntry={selectCapability}
              />
            )}
          </div>
        </div>
      </section>

      {brief && (
        <section
          ref={outputRef}
          id="creator-brief-output"
          data-testid="creator-brief-output"
          aria-live="polite"
          className="scroll-mt-8 border-b border-border bg-[#eee9df] px-4 py-16 text-[#25221f] sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-primary">
              YOUR CREATION BRIEF
            </p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="max-w-2xl text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl">
                {zh ? "下一步已经清楚了。" : "The next step is clear."}
              </h2>
              <button
                type="button"
                onClick={copyBrief}
                className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-[#25221f]/25 px-5 text-sm font-semibold transition-colors hover:bg-[#25221f] hover:text-[#f8f3e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {zh ? "复制 Brief" : "Copy brief"}
              </button>
            </div>
            <pre className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-[#1b1816] p-5 font-mono text-xs leading-7 text-[#f8f3e9] sm:p-7 sm:text-sm">
              {brief}
            </pre>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={buildSkillsUrl(
                  activeMode?.id ?? DEFAULT_CREATION_MODE_ID,
                  intent
                )}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#25221f] px-5 text-sm font-semibold text-[#f8f3e9] transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {zh ? "查看匹配的 Skills" : "See matching Skills"}
              </a>
              <span className="text-xs text-[#25221f]/60" role="status">
                {copyStatus}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
