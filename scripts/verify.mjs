#!/usr/bin/env node
/**
 * Playwright 验证脚本：检查 GitHub Pages 是否部署成功，截图留档
 *
 * 用法：node scripts/verify.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "fs";
import { resolve } from "path";
import "dotenv/config";

const { GITHUB_USER, GITHUB_REPO } = process.env;
const ROOT_DIR = resolve(import.meta.dirname, "..");
const PAGES_URL = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}`;
const SCREENSHOT_DIR = resolve(ROOT_DIR, "screenshots");
mkdirSync(SCREENSHOT_DIR, { recursive: true });

// 从 pages.json 读取页面列表
const data = JSON.parse(readFileSync(resolve(ROOT_DIR, "pages.json"), "utf-8"));
const pages = data.pages;

const MAX_RETRIES = 5;
const RETRY_DELAY = 15000; // 15s

async function waitForDeployment(page) {
  for (let i = 1; i <= MAX_RETRIES; i++) {
    console.log(`检查部署状态 (${i}/${MAX_RETRIES})...`);
    const res = await page.goto(PAGES_URL, { waitUntil: "domcontentloaded" });
    if (res && res.status() === 200) {
      const text = await page.textContent("body");
      if (!text.includes("404") && !text.includes("There isn't a GitHub Pages site here")) {
        console.log("部署已生效！");
        return true;
      }
    }
    if (i < MAX_RETRIES) {
      console.log(`未就绪，${RETRY_DELAY / 1000}s 后重试...`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
    }
  }
  return false;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const deployed = await waitForDeployment(page);
  if (!deployed) {
    console.error("Pages 尚未部署完成，请稍后手动检查:", PAGES_URL);
    await browser.close();
    process.exit(1);
  }

  // 截图首页
  await page.goto(PAGES_URL, { waitUntil: "networkidle" });
  const indexShot = resolve(SCREENSHOT_DIR, "index.png");
  await page.screenshot({ path: indexShot, fullPage: true });
  console.log(`截图: ${indexShot}`);

  // 逐个验证子页面
  let allOk = true;
  for (const p of pages) {
    const url = `${PAGES_URL}/${encodeURIComponent(p.file).replace(/%2F/g, "/")}`;
    console.log(`验证: ${url}`);
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      const ok = res && res.status() === 200;
      console.log(`  状态: ${ok ? "OK" : "FAIL " + res?.status()}`);
      if (!ok) allOk = false;

      const shotName = p.title + ".png";
      const shotPath = resolve(SCREENSHOT_DIR, shotName);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`  截图: ${shotPath}`);
    } catch (e) {
      console.error(`  错误: ${e.message}`);
      allOk = false;
    }
  }

  await browser.close();

  if (allOk) {
    console.log("\n所有页面验证通过！");
  } else {
    console.error("\n部分页面验证失败，请检查上方日志");
    process.exit(1);
  }
})();
