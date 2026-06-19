# Figma v1 1:1 UI 还原（逐页评估试点）

## 背景
`figma/v1.fig`（Figma 文件 `xYbCxso5gB8AjouH9Gun2T`）是基于 `DESIGN.md` 生成的设计图。
现有代码已对齐 DESIGN.md（commit `c562c25`），token 层面与 Figma 一致（详见 `docs/v1-figma-gap-analysis.md`），
但逐页的视觉细节（间距/尺寸/圆角/阴影/层级/元素配比）未必与 Figma 像素级一致。本任务把已实现页面推向 Figma 1:1。

## 目标
- 逐页对比「现状截图 vs Figma 截图」，列出差异，判断每条差异是否影响现有逻辑/功能。
- 用户与我共同评估通过的页面 → 作为试点页，做 1:1 样式还原。
- 仅改视觉（CSS + 组件样式相关 props），**不动 copy 文案、不动 domain/store/路由逻辑**。
- 还原后逐页 `npm run dev` 截图比对 Figma 验收。

## 范围
### 可还原（已实现路由）
首页 / 记录互动 / 账户明细(自己·联结·能量) / 设置(完善版) / 话题列表 / 话题详情 / 实验列表 /
回到自己 / 我被触发了 / 草稿自检 / 想检查信号 / 收到很多内容 / 自我关怀停顿 / 记录详情

### 不在范围内（Figma 有但无路由 → 新功能，单独立项，仅记录）
见 `docs/figma-no-route-screens.md`

### 不还原
3 个 Animated SVG 帧 + 2 个动效变体帧（静态 PNG 无意义）。

## 处理规则（来自用户）
- 与现有逻辑/功能不同 → 记录，不改。
- 无逻辑影响的纯样式差异 → 直接改样式。
- 文案差异 → 不改（属逻辑层）。

## 试点策略
先评估**首页**（`2:452`）：
1. 抓现状截图 + Figma 截图，逐区段列差异表。
2. 每条差异标注「是否影响逻辑」。
3. 用户共同评估通过后，按差异表改 CSS，dev 截图比对收敛。
4. 首页通过 → 复用评估模板推进其余页。

## 验证
- `npm run typecheck`
- `npm test`
- `npm run dev` + 截图与 Figma 像素比对（视觉验收）

## 资产
- Figma 屏幕图：`figma/screens/*.png`（已 .gitignore）
- 差异记录：`docs/v1-figma-gap-analysis.md`、`docs/figma-no-route-screens.md`
- 现有 token：`src/styles/tokens.css`
