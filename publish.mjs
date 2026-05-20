#!/usr/bin/env node
/**
 * 自动发布脚本：管理 pages.json 分类 → 同步 index.html → git push → 配置 Pages
 *
 * 用法：
 *   node publish.mjs                                          # 发布当前所有文件
 *   node publish.mjs /path/to/file.html                       # 添加文件（自动归类）并发布
 *   node publish.mjs /path/to/file.html --cat=flow            # 添加文件到指定分类
 *   node publish.mjs /path/to/file.html --cat=flow --tag=SOP  # 添加文件 + 指定标签
 *   node publish.mjs --add-cat id:名称:描述                    # 添加新分类
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
const PAGES_JSON = resolve(REPO_DIR, "pages.json");
const INDEX_HTML = resolve(REPO_DIR, "index.html");

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { cwd: REPO_DIR, encoding: "utf-8", stdio: "pipe", ...opts });
}

// 解析命令行参数
const args = process.argv.slice(2);
const files = [];
let optCat = "";
const optTags = [];
let addCat = "";

for (const arg of args) {
  if (arg.startsWith("--cat=")) optCat = arg.slice(6);
  else if (arg.startsWith("--tag=")) optTags.push(arg.slice(6));
  else if (arg.startsWith("--add-cat=")) addCat = arg.slice(10);
  else files.push(arg);
}

// ── 加载 pages.json ──
let data = JSON.parse(readFileSync(PAGES_JSON, "utf-8"));

// ── 添加新分类 ──
if (addCat) {
  const [id, name, desc] = addCat.split(":");
  if (!id || !name) {
    console.error("格式: --add-cat=id:名称:描述");
    process.exit(1);
  }
  if (!data.categories.find((c) => c.id === id)) {
    data.categories.push({ id, name, icon: id, description: desc || "" });
    console.log(`新增分类: ${name} (${id})`);
  }
}

// ── 复制外部文件并注册到 pages.json ──
for (const f of files) {
  const src = resolve(f);
  if (!existsSync(src)) {
    console.error(`文件不存在: ${src}`);
    process.exit(1);
  }
  const fileName = basename(src);
  const dest = resolve(REPO_DIR, fileName);
  console.log(`复制: ${src} → ${dest}`);
  writeFileSync(dest, readFileSync(src));

  // 自动归类：文件名含 流程/SOP → flow，否则 requirement
  const autoCategory = /流程|SOP|sop/i.test(fileName) ? "flow" : "requirement";
  const category = optCat || autoCategory;
  const title = fileName.replace(/\.html$/, "").replace(/_\d{8}$/, "");
  const dateMatch = fileName.match(/(\d{4})(\d{2})(\d{2})/);
  const date = dateMatch
    ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
    : new Date().toISOString().slice(0, 10);

  // 去重：已有同名文件则更新
  const existing = data.pages.findIndex((p) => p.file === fileName);
  const entry = { file: fileName, title, category, date, tags: optTags.length ? optTags : [] };

  if (existing >= 0) {
    data.pages[existing] = { ...data.pages[existing], ...entry };
    console.log(`更新: ${fileName} → ${category}`);
  } else {
    data.pages.push(entry);
    console.log(`新增: ${fileName} → ${category}`);
  }
}

// ── 检查是否有未注册的 HTML 文件 ──
const htmlFiles = readdirSync(REPO_DIR).filter(
  (f) => f.endsWith(".html") && f !== "index.html"
);
for (const f of htmlFiles) {
  if (!data.pages.find((p) => p.file === f)) {
    const autoCategory = /流程|SOP|sop/i.test(f) ? "flow" : "requirement";
    const title = f.replace(/\.html$/, "").replace(/_\d{8}$/, "");
    data.pages.push({ file: f, title, category: autoCategory, date: new Date().toISOString().slice(0, 10), tags: [] });
    console.log(`自动注册: ${f} → ${autoCategory}`);
  }
}

// 清理已删除的文件
data.pages = data.pages.filter((p) => existsSync(resolve(REPO_DIR, p.file)));

// 保存 pages.json
writeFileSync(PAGES_JSON, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`pages.json 已更新，共 ${data.pages.length} 个页面`);

// ── 同步 index.html 中的 DATA ──
let indexContent = readFileSync(INDEX_HTML, "utf-8");
indexContent = indexContent.replace(
  /const DATA = .*?;/,
  `const DATA = ${JSON.stringify(data)};`
);
writeFileSync(INDEX_HTML, indexContent, "utf-8");
console.log("index.html 已同步");

// ── Git push ──
try {
  run("git remote get-url origin");
} catch {
  run(`git remote add origin https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git`);
}
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
} catch {
  console.log("首次推送，尝试 pull --rebase...");
  try {
    run("git pull origin main --rebase --allow-unrelated-histories");
  } catch { /* empty repo */ }
  run("git push -u origin main");
  console.log("推送成功");
}

// ── 配置 GitHub Pages ──
const apiBase = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;
const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const checkRes = await fetch(`${apiBase}/pages`, { headers });
if (checkRes.ok) {
  const info = await checkRes.json();
  console.log(`GitHub Pages: ${info.html_url}`);
} else {
  const res = await fetch(`${apiBase}/pages`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ build_type: "legacy", source: { branch: "main", path: "/" } }),
  });
  if (res.ok) console.log(`GitHub Pages 已启用: ${PAGES_URL}`);
  else console.error("启用 Pages 失败:", res.status, await res.text());
}

// ── 输出结果 ──
console.log("\n========================================");
console.log(`首页: ${PAGES_URL}/`);
for (const cat of data.categories) {
  const catPages = data.pages.filter((p) => p.category === cat.id);
  if (catPages.length === 0) continue;
  console.log(`\n【${cat.name}】`);
  for (const p of catPages) {
    console.log(`  ${p.title}`);
    console.log(`  ${PAGES_URL}/${encodeURIComponent(p.file)}`);
  }
}
console.log("========================================");
