import assert from "node:assert/strict";
import test from "node:test";
import {
  CREATION_MODES,
  buildSkillsUrl,
  createBrief,
  normalizeIntent,
} from "../src/brief.ts";

test("five creation modes remain independently addressable", () => {
  assert.deepEqual(
    CREATION_MODES.map((mode) => mode.id),
    ["image", "content", "video-edit", "video-generate", "webpage"]
  );
});

test("brief normalizes input and includes executable checks", () => {
  const brief = createBrief("content", "  把访谈   整理成文章  ");
  assert.match(brief, /创作类型：内容创作/);
  assert.match(brief, /目标：把访谈 整理成文章/);
  assert.match(brief, /执行重点/);
  assert.match(brief, /验收标准/);
  assert.match(brief, /最终方向、事实与审美判断由创作者确认/);
});

test("empty intent is rejected instead of producing a fake result", () => {
  assert.throws(() => createBrief("image", "   "), /请先写下一句话目标/);
});

test("skills handoff carries only the selected mode and normalized intent", () => {
  const url = new URL(buildSkillsUrl("video-generate", "  60 秒   科普短片  "));
  assert.equal(url.origin, "https://lovstudio.ai");
  assert.equal(url.pathname, "/skills");
  assert.equal(url.searchParams.get("category"), "Video Creation");
  assert.equal(url.searchParams.get("query"), "视频生成");
  assert.equal(url.searchParams.get("intent"), "60 秒 科普短片");
  assert.equal(url.searchParams.get("from"), "imagine");
  assert.equal(url.hash, "#skill-catalog");
});

test("intent is capped at the visible form limit", () => {
  assert.equal(normalizeIntent("a".repeat(900)).length, 800);
});
