#!/usr/bin/env node
/**
 * 自动发布脚本（多项目版）
 *
 * 用法：
 *   node scripts/publish.mjs                                                      # 发布当前变更
 *   node scripts/publish.mjs /path/to/file.html --project=AI客服                   # 添加文件到项目
 *   node scripts/publish.mjs /path/to/file.html --project=AI客服 --cat=flow        # 指定分类
 *   node scripts/publish.mjs /path/to/file.html --project=AI客服 --tag=SOP         # 指定标签
 *   node scripts/publish.mjs --add-project id:名称:描述:颜色                       # 新建项目
 *   node scripts/publish.mjs --add-cat id:名称:颜色:背景色                         # 新建分类
 */
import { execSync } from "child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { basename, resolve, join } from "path";
import "dotenv/config";

const { GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO } = process.env;
if (!GITHUB_TOKEN || !GITHUB_USER || !GITHUB_REPO) {
  console.error("请在 .env 中配置 GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO");
  process.exit(1);
}

const ROOT_DIR = resolve(import.meta.dirname, "..");
const DOCS_DIR = resolve(ROOT_DIR, "docs");
const PAGES_JSON = resolve(ROOT_DIR, "pages.json");
const INDEX_HTML = resolve(ROOT_DIR, "index.html");
const PAGES_URL = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}`;
const FAVICON_LINK = `<link rel="icon" type="image/svg+xml" href="/html-pages/assets/favicon.svg">`;

function run(cmd, opts = {}) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { cwd: ROOT_DIR, encoding: "utf-8", stdio: "pipe", ...opts });
}

// ── 解析参数 ──
const args = process.argv.slice(2);
const files = [];
let optProject = "";
let optCat = "";
const optTags = [];
let addProject = "";
let addCat = "";

for (const arg of args) {
  if (arg.startsWith("--project=")) optProject = arg.slice(10);
  else if (arg.startsWith("--cat=")) optCat = arg.slice(6);
  else if (arg.startsWith("--tag=")) optTags.push(arg.slice(6));
  else if (arg.startsWith("--add-project=")) addProject = arg.slice(14);
  else if (arg.startsWith("--add-cat=")) addCat = arg.slice(10);
  else files.push(arg);
}

// ── 加载数据 ──
let data = JSON.parse(readFileSync(PAGES_JSON, "utf-8"));

// ── 新建分类 ──
if (addCat) {
  const [id, name, color, bg] = addCat.split(":");
  if (!id || !name) { console.error("格式: --add-cat=id:名称:颜色:背景色"); process.exit(1); }
  if (!data.categories.find(c => c.id === id)) {
    data.categories.push({ id, name, icon: id, color: color || "#999", bg: bg || "#f5f5f5" });
    console.log(`新增分类: ${name}`);
  }
}

// ── 新建项目 ──
if (addProject) {
  const [id, name, desc, color] = addProject.split(":");
  if (!id || !name) { console.error("格式: --add-project=id:名称:描述:颜色"); process.exit(1); }
  if (!data.projects.find(p => p.id === id)) {
    data.projects.push({ id, name, description: desc || "", color: color || "#6366f1", pages: [] });
    mkdirSync(resolve(DOCS_DIR, name), { recursive: true });
    console.log(`新增项目: ${name}`);
  }
}

// ── 添加文件 ──
if (files.length > 0 && !optProject) {
  console.error("添加文件时必须指定项目: --project=项目名称");
  process.exit(1);
}

for (const f of files) {
  const src = resolve(f);
  if (!existsSync(src)) { console.error(`文件不存在: ${src}`); process.exit(1); }

  const proj = data.projects.find(p => p.name === optProject || p.id === optProject);
  if (!proj) { console.error(`项目不存在: ${optProject}`); process.exit(1); }

  const fileName = basename(src);
  const projDir = resolve(DOCS_DIR, proj.name);
  mkdirSync(projDir, { recursive: true });
  const dest = resolve(projDir, fileName);

  console.log(`复制: ${src} → ${dest}`);
  let content = readFileSync(src, "utf-8");

  // 自动注入 favicon
  if (!content.includes("favicon")) {
    content = content.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n${FAVICON_LINK}`);
  }
  writeFileSync(dest, content, "utf-8");

  const filePath = `docs/${proj.name}/${fileName}`;
  const autoCategory = /流程|SOP|sop/i.test(fileName) ? "flow" : (/报告|汇总|反馈/i.test(fileName) ? "feedback" : "requirement");
  const category = optCat || autoCategory;
  const title = fileName.replace(/\.html$/, "").replace(/_\d{8}$/, "");
  const dateMatch = fileName.match(/(\d{4})(\d{2})(\d{2})/);
  const date = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : new Date().toISOString().slice(0, 10);

  const existing = proj.pages.findIndex(p => p.file === filePath);
  const entry = { file: filePath, title, category, date, tags: optTags.length ? optTags : [] };

  if (existing >= 0) {
    proj.pages[existing] = { ...proj.pages[existing], ...entry };
    console.log(`更新: ${filePath} → [${proj.name}] ${category}`);
  } else {
    proj.pages.push(entry);
    console.log(`新增: ${filePath} → [${proj.name}] ${category}`);
  }
}

// ── 自动扫描未注册文件 ──
for (const proj of data.projects) {
  const projDir = resolve(DOCS_DIR, proj.name);
  if (!existsSync(projDir)) continue;
  const htmlFiles = readdirSync(projDir).filter(f => f.endsWith(".html"));
  for (const f of htmlFiles) {
    const filePath = `docs/${proj.name}/${f}`;
    if (!proj.pages.find(p => p.file === filePath)) {
      const autoCategory = /流程|SOP|sop/i.test(f) ? "flow" : (/报告|汇总|反馈/i.test(f) ? "feedback" : "requirement");
      const title = f.replace(/\.html$/, "").replace(/_\d{8}$/, "");
      proj.pages.push({ file: filePath, title, category: autoCategory, date: new Date().toISOString().slice(0, 10), tags: [] });
      console.log(`自动注册: ${filePath} → [${proj.name}]`);
    }
  }
  // 清理已删除文件
  proj.pages = proj.pages.filter(p => existsSync(resolve(ROOT_DIR, p.file)));
}

// ── 保存 pages.json ──
const totalPages = data.projects.reduce((s, p) => s + p.pages.length, 0);
writeFileSync(PAGES_JSON, JSON.stringify(data, null, 2) + "\n", "utf-8");
console.log(`pages.json 已更新，${data.projects.length} 个项目，${totalPages} 篇文档`);

// ── 同步 index.html ──
let indexContent = readFileSync(INDEX_HTML, "utf-8");
indexContent = indexContent.replace(/const DATA = .*?;/, `const DATA = ${JSON.stringify(data)};`);
writeFileSync(INDEX_HTML, indexContent, "utf-8");
console.log("index.html 已同步");

// ── Git push ──
try { run("git remote get-url origin"); } catch { run(`git remote add origin https://github.com/${GITHUB_USER}/${GITHUB_REPO}.git`); }
run(`git remote set-url origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git`);
run("git add -A");

try {
  const status = run("git status --porcelain");
  if (!status.trim()) { console.log("没有变更需要提交"); }
  else {
    const ts = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
    run(`git commit -m "publish: ${ts}"`);
  }
} catch (e) { console.log("提交跳过:", e.message); }

try { run("git push -u origin main"); console.log("推送成功"); }
catch {
  console.log("尝试 pull --rebase...");
  try { run("git pull origin main --rebase --allow-unrelated-histories"); } catch {}
  run("git push -u origin main");
  console.log("推送成功");
}

// ── GitHub Pages ──
const apiBase = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;
const headers = { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
const checkRes = await fetch(`${apiBase}/pages`, { headers });
if (checkRes.ok) { const info = await checkRes.json(); console.log(`GitHub Pages: ${info.html_url}`); }
else {
  const res = await fetch(`${apiBase}/pages`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ build_type: "legacy", source: { branch: "main", path: "/" } }) });
  if (res.ok) console.log(`GitHub Pages 已启用: ${PAGES_URL}`);
  else console.error("启用 Pages 失败:", res.status, await res.text());
}

// ── 输出 ──
console.log("\n========================================");
console.log(`首页: ${PAGES_URL}/`);
for (const proj of data.projects) {
  if (proj.pages.length === 0) continue;
  console.log(`\n📁 ${proj.name} (${PAGES_URL}/?project=${proj.id})`);
  for (const p of proj.pages) {
    const cat = data.categories.find(c => c.id === p.category);
    console.log(`  [${cat?.name || p.category}] ${p.title}`);
  }
}
console.log("========================================");
