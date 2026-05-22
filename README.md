# Docs Hub

通过 GitHub Pages 托管的 HTML 文档中心，配合自动发布脚本实现一键部署。

**在线访问**：https://smith12138.github.io/html-pages/

## 目录结构

```
├── docs/                    HTML 文档
├── assets/                  静态资源（图片、图标）
├── scripts/                 工具脚本
│   ├── publish.mjs          自动发布（复制文件 → 更新索引 → git push → 配置 Pages）
│   └── verify.mjs           Playwright 验证（等待部署 → 逐页检查 → 截图留档）
├── index.html               首页（自动生成，勿手动编辑）
├── pages.json               文档分类配置
├── package.json
├── .env                     Token 等敏感配置（不入库）
└── .gitignore
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 `.env`

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_USER=smith12138
GITHUB_REPO=html-pages
```

### 3. 发布文档

```bash
# 添加文件并发布（自动归类：文件名含"流程/SOP"→ 需求文档，其余 → 反馈汇总）
node scripts/publish.mjs /path/to/文件.html

# 指定分类和标签
node scripts/publish.mjs /path/to/文件.html --cat=flow --tag=SOP --tag=客服

# 仅发布当前变更（无新文件）
npm run publish

# 发布 + Playwright 自动验证截图
npm run deploy
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run publish` | 发布所有变更到 GitHub Pages |
| `npm run verify` | Playwright 验证页面是否在线 + 截图 |
| `npm run deploy` | 发布 + 验证一条龙 |
| `npm run list` | 查看当前文档分类列表 |

### 添加文件示例

```bash
# 添加一个反馈报告
node scripts/publish.mjs ~/output/用户反馈_20260520.html --cat=feedback --tag=反馈

# 添加一个 SOP 流程
node scripts/publish.mjs ~/docs/退款处理流程.html --cat=requirement --tag=退款

# 新增分类后添加文件
node scripts/publish.mjs --add-cat=design:设计文档:UI设计与原型
node scripts/publish.mjs ~/Desktop/首页方案.html --cat=design
```

### 移除文件

删除 `docs/` 下对应的 HTML 文件后重新发布即可，脚本会自动清理 `pages.json`：

```bash
rm docs/旧文档.html
npm run publish
```

## 文档分类

| 分类 ID | 名称 | 说明 |
|---------|------|------|
| `requirement` | 需求文档 | 产品需求、问题分析、数据报告 |
| `flow` | 流程文档 | 业务流程、SOP、操作规范 |
| `feedback` | 反馈汇总 | 问题反馈、数据分析、汇总报告 |

## 技术栈

- **托管**：GitHub Pages
- **发布**：Node.js + GitHub API
- **验证**：Playwright（Chromium 无头浏览器截图）
