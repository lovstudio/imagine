# Imagine

Imagine 是 LovStudio 的独立创作工作台。它完整承接官网原有的图片、内容、视频与网页创作入口：选择场景和能力卡片，写下一句话目标，再生成可复制的创作 Brief 并进入已发布的 LovStudio Skills。

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

## 发布

生产站点：<https://create.lovstudio.ai>

源代码：<https://github.com/lovstudio/imagine>

推送 `v*` tag 后，GitHub Actions 会重新测试、构建并发布 `imagine-vX.Y.Z.zip`。
