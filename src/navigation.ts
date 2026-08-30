import type { SkillNavigationContext } from "./brief.ts";

export function buildSkillDetailUrl(
  skillId: string,
  context: SkillNavigationContext
) {
  const url = new URL(`/skills/${skillId}`, "https://lovstudio.ai");
  if (context.category) url.searchParams.set("category", context.category);
  if (context.query) url.searchParams.set("query", context.query);
  if (context.intent) url.searchParams.set("intent", context.intent);
  url.searchParams.set("from", context.from ?? "imagine");
  return url.toString();
}
