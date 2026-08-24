import type { LucideIcon } from "lucide-react";

export type AgentModeTab<T extends string = string> = {
  id: T;
  label: string;
  Icon: LucideIcon;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AgentModeTabs<T extends string>({
  items,
  selectedId,
  onSelect,
  ariaLabel,
  className,
  testIdPrefix,
}: {
  items: readonly AgentModeTab<T>[];
  selectedId?: T | null;
  onSelect: (item: AgentModeTab<T>) => void;
  ariaLabel: string;
  className?: string;
  testIdPrefix?: string;
}) {
  return (
    <div
      className={classes(
        "flex max-w-full justify-start gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden",
        className
      )}
      role="group"
      aria-label={ariaLabel}
      data-slot="agent-mode-tabs"
    >
      {items.map((item) => {
        const selected = item.id === selectedId;
        const Icon = item.Icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            aria-pressed={selected}
            data-testid={
              testIdPrefix ? `${testIdPrefix}-${item.id}` : undefined
            }
            className={classes(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selected
                ? "border-primary/35 bg-primary/10 font-medium text-primary"
                : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
