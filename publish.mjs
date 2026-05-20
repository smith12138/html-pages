#!/usr/bin/env node
/**
 * 自动发布脚本：扫描本地 HTML 文件 → git add/commit/push → 配置 GitHub Pages
 *
 * 用法：
 *   node publish.mjs                    # 发布所有 HTML 文件
 *   node publish.mjs path/to/file.html  # 只添加指定文件后发布
 */
import { execSync } from "child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { basename, resolve } from "path";
import "dotenv/config";

const { GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO } = process.env;
if (!GITHUB_TOKEN || !GITHUB_USER || !GITHUB_REPO) {
  console.error("请在 .env 中配置 GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO");
  process.exit(1);
}

const REPO_DIR = resolve(import.meta.dirname);
const PAGES_URL = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}`;

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { cwd: REPO_DIR, encoding: "utf-8", stdio: "pipe", ...opts });
}

// ── 1. 如果指定了外部文件，先复制进来 ──
const extraFiles = process.argv.slice(2);
for (const f of extraFiles) {
  const src = resolve(f);
  if (!existsSync(src)) {
    console.error(`文件不存在: ${src}`);
    process.exit(1);
  }
  const dest = resolve(REPO_DIR, basename(src));
  console.log(`复制: ${src} → ${dest}`);
  const content = readFileSync(src);
  writeFileSync(dest, content);
}

// ── 2. 自动更新 index.html 中的页面列表 ──
const htmlFiles = readdirSync(REPO_DIR)
  .filter((f) => f.endsWith(".html") && f !== "index.html")
  .sort();

const pagesJs = htmlFiles
  .map((f) => {
    const name = f.replace(/\.html$/, "");
    return `            { name: '${name}', file: '${f}' },`;
  })
  .join("\n");

const indexPath = resolve(REPO_DIR, "index.html");
let indexContent = readFileSync(indexPath, "utf-8");
indexContent = indexContent.replace(
  /const pages = \[[\s\S]*?\];/,
  `const pages = [\n${pagesJs}\n        ];`
);
writeFileSync(indexPath, indexContent, "utf-8");
console.log(`index.html 已更新，共 ${htmlFiles.length} 个页面`);

// ── 3. Git add / commit / push ──
try {
  run("git remote get-url origin");
} catch {
  run(`git remote add origin https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git`);
}

// 配置 git 使用 token 认证
const remoteUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git`;
run(`git remote set-url origin ${remoteUrl}`);

run("git add -A");

try {
  const status = run("git status --porcelain");
  if (!status.trim()) {
    console.log("没有变更需要提交");
  } else {
    const timestamp = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    run(`git commit -m "publish: ${timestamp}"`);
  }
} catch (e) {
  console.log("提交跳过:", e.message);
}

try {
  run("git push -u origin main");
  console.log("推送成功");
} catch (e) {
  // 首次推送如果远程有内容，尝试 pull 再 push
  console.log("首次推送，尝试 pull --rebase...");
  try {
    run("git pull origin main --rebase --allow-unrelated-histories");
  } catch { /* 空仓库无需 pull */ }
  run("git push -u origin main");
  console.log("推送成功");
}

// ── 4. 配置 GitHub Pages（仅首次需要）──
const apiBase = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;
const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function enablePages() {
  // 检查 Pages 是否已启用
  const checkRes = await fetch(`${apiBase}/pages`, { headers });
  if (checkRes.ok) {
    const info = await checkRes.json();
    console.log(`GitHub Pages 已启用: ${info.html_url}`);
    return;
  }

  // 启用 Pages（从 main 分支根目录）
  const res = await fetch(`${apiBase}/pages`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      build_type: "legacy",
      source: { branch: "main", path: "/" },
    }),
  });

  if (res.ok) {
    console.log(`GitHub Pages 已启用: ${PAGES_URL}`);
  } else {
    const err = await res.text();
    console.error("启用 Pages 失败:", res.status, err);
  }
}

await enablePages();

// ── 5. 输出访问地址 ──
console.log("\n========================================");
console.log(`首页: ${PAGES_URL}/`);
htmlFiles.forEach((f) => {
  console.log(`  ${PAGES_URL}/${encodeURIComponent(f)}`);
});
console.log("========================================");
console.log("(Pages 首次部署可能需要 1-2 分钟生效)");
