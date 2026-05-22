# Docs Hub

通过 GitHub Pages 托管的多项目 HTML 文档中心，配合自动发布脚本实现一键部署。

**在线访问**：https://smith12138.github.io/html-pages/

## 目录结构

```
├── docs/                        HTML 文档（按项目分目录）
│   └── AI客服/
│       ├── AI客服问题汇总报告_20260516.html
│       └── 智能客服SOP流程.html
├── assets/                      静态资源（按项目分目录）
│   ├── AI客服/
│   │   └── 智能客服流程图.jpg
│   └── favicon.svg
├── scripts/                     工具脚本
│   ├── publish.mjs              自动发布
│   └── verify.mjs               Playwright 验证
├── index.html                   首页（自动生成，勿手动编辑）
├── pages.json                   多项目文档配置
├── package.json
├── .env                         Token 等敏感配置（不入库）
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
# 添加文件到指定项目（必须指定 --project）
node scripts/publish.mjs /path/to/文件.html --project=AI客服

# 指定分类和标签
node scripts/publish.mjs /path/to/文件.html --project=AI客服 --cat=flow --tag=SOP

# 仅发布当前变更
npm run publish
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run publish` | 发布所有变更到 GitHub Pages |
| `npm run verify` | Playwright 验证页面是否在线 + 截图 |
| `npm run deploy` | 发布 + 验证一条龙 |
| `npm run list` | 查看当前文档列表 |

### 项目管理

```bash
# 新建项目
node scripts/publish.mjs --add-project=payment:支付系统:支付相关文档:#10b981

# 新建分类
node scripts/publish.mjs --add-cat=design:设计文档:#3b82f6:#eff6ff

# 添加文件到新项目
node scripts/publish.mjs ~/docs/支付对接方案.html --project=支付系统 --cat=requirement
```

### 移除文件

删除 `docs/项目名/` 下对应的 HTML 文件后重新发布：

```bash
rm "docs/AI客服/旧文档.html"
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
- **验证**：Playwright
