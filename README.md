# LovCreate

LovCreate 是 LovStudio 的独立内容创作实验室。当前公开版本把图片、内容、视频和网页方向的模糊想法整理成可执行、可复制的创作 Brief，并把用户带到已经发布的 LovStudio Skills。

它不会把未验证的媒体生成能力包装成已经可用的功能。

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

## 发布

生产站点：<https://create.lovstudio.ai>

推送 `v*` tag 后，GitHub Actions 会重新测试、构建并发布 `lovcreate-vX.Y.Z.zip`。
