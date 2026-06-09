// SaleSmartly 聊天主界面原型 - Figma Plugin Code
// 使用方法：在 Figma 中 Plugins → Development → New Plugin → Run once
// 将此代码粘贴到 code.ts 中运行

async function main() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  // ===== 主 Frame =====
  const page = figma.createFrame();
  page.name = "Chat 聊天主界面";
  page.resize(1440, 900);
  page.fills = [{ type: "SOLID", color: rgb(248, 250, 252) }];

  // ===== 左侧导航栏 (64px) =====
  const nav = createRect(page, 0, 0, 64, 900, rgb(26, 16, 60), "左侧导航");

  // Logo
  const logo = createRect(page, 16, 16, 32, 32, rgb(124, 58, 237), "Logo");
  logo.cornerRadius = 8;
  const logoText = createText(page, 24, 24, "S", 14, rgb(255, 255, 255), "Bold");

  // Nav icons
  const navItems = [
    { y: 72, label: "聊天", active: true },
    { y: 116, label: "客户", active: false },
    { y: 160, label: "营销", active: false },
    { y: 204, label: "自动化", active: false },
    { y: 248, label: "报告", active: false },
    { y: 292, label: "集成", active: false },
    { y: 336, label: "团队", active: false },
    { y: 380, label: "设置", active: false },
  ];
  for (const item of navItems) {
    const bg = createRect(page, 12, item.y, 40, 40, item.active ? rgba(255, 255, 255, 0.15) : rgba(0, 0, 0, 0), `nav-${item.label}`);
    bg.cornerRadius = 8;
    const label = createText(page, 14, item.y + 44, item.label, 9, item.active ? rgb(196, 181, 253) : rgb(139, 139, 158), "Regular");
    label.textAlignHorizontal = "CENTER";
    label.resize(36, 12);
  }

  // ===== 会话列表区 (320px) =====
  const sessionPanel = createRect(page, 64, 0, 320, 900, rgb(255, 255, 255), "会话列表面板");
  // 右边框线
  const sessionBorder = createRect(page, 383, 0, 1, 900, rgb(226, 232, 240), "会话列表边框");

  // 搜索框
  const searchBox = createRect(page, 80, 16, 288, 40, rgb(241, 245, 249), "搜索框");
  searchBox.cornerRadius = 10;
  searchBox.strokes = [{ type: "SOLID", color: rgb(226, 232, 240) }];
  searchBox.strokeWeight = 1;
  const searchText = createText(page, 100, 28, "🔍  搜索会话...", 13, rgb(148, 163, 184), "Regular");

  // 视图标签
  const views = ["我的", "AI成员", "待分配", "全部", "团队"];
  let vx = 80;
  for (let i = 0; i < views.length; i++) {
    const isActive = i === 0;
    const vw = views[i].length * 14 + 16;
    const viewTab = createRect(page, vx, 68, vw, 28, isActive ? rgb(124, 58, 237) : rgba(0, 0, 0, 0), `tab-${views[i]}`);
    viewTab.cornerRadius = 6;
    createText(page, vx + 8, 76, views[i], 12, isActive ? rgb(255, 255, 255) : rgb(100, 116, 139), isActive ? "Semi Bold" : "Regular");
    vx += vw + 6;
  }

  // 筛选条件
  const filters = ["未读", "未回", "单聊", "群组", "免打扰"];
  let fx = 80;
  for (let i = 0; i < filters.length; i++) {
    const isActive = i === 0;
    const fw = filters[i].length * 12 + 16;
    const chip = createRect(page, fx, 106, fw, 24, isActive ? rgb(237, 233, 254) : rgb(241, 245, 249), `filter-${filters[i]}`);
    chip.cornerRadius = 12;
    createText(page, fx + 8, 112, filters[i], 11, isActive ? rgb(124, 58, 237) : rgb(100, 116, 139), isActive ? "Semi Bold" : "Regular");
    fx += fw + 6;
  }

  // 会话卡片
  const sessions = [
    { name: "John Davis", msg: "Hi, I want to ask about the shipping...", time: "2分钟前", unread: 3, channel: "WhatsApp", color: rgb(37, 211, 102), initials: "JD", bgColor: rgb(219, 234, 254) },
    { name: "李思远", msg: "好的，我已经收到了物流信息...", time: "15分钟前", unread: 0, channel: "Telegram", color: rgb(0, 136, 204), initials: "LS", bgColor: rgb(252, 231, 243) },
    { name: "Maria K.", msg: "Can you send me the tracking number?", time: "1小时前", unread: 0, channel: "Facebook", color: rgb(24, 119, 242), initials: "MK", bgColor: rgb(209, 250, 229) },
    { name: "Ahmed H.", msg: "🤖 AI 正在处理...", time: "2小时前", unread: 0, channel: "Instagram", color: rgb(228, 64, 95), initials: "AH", bgColor: rgb(254, 243, 199) },
    { name: "Sarah L.", msg: "Thank you for your help!", time: "3小时前", unread: 0, channel: "WhatsApp", color: rgb(37, 211, 102), initials: "SL", bgColor: rgb(237, 233, 254) },
    { name: "王大明", msg: "请问这个产品有其他颜色吗？", time: "5小时前", unread: 1, channel: "LiveChat", color: rgb(124, 58, 237), initials: "WD", bgColor: rgb(254, 226, 226) },
  ];

  let sy = 142;
  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i];
    const isSelected = i === 0;

    // 背景
    const cardBg = createRect(page, 64, sy, 320, 80, isSelected ? rgb(245, 243, 255) : rgb(255, 255, 255), `session-${s.name}`);
    if (isSelected) {
      const indicator = createRect(page, 64, sy, 3, 80, rgb(124, 58, 237), "选中指示器");
    }

    // 头像
    const avatar = createEllipse(page, 84, sy + 18, 44, 44, s.bgColor, `avatar-${s.name}`);
    const initText = createText(page, 93, sy + 32, s.initials, 13, rgb(71, 85, 105), "Bold");

    // 渠道小图标
    const chIcon = createRect(page, 116, sy + 14, 16, 16, s.color, `channel-${s.name}`);
    chIcon.cornerRadius = 4;

    // 名称 & 时间
    createText(page, 140, sy + 22, s.name, 14, rgb(30, 41, 59), "Semi Bold");
    const timeText = createText(page, 320, sy + 22, s.time, 11, rgb(148, 163, 184), "Regular");
    timeText.textAlignHorizontal = "RIGHT";
    timeText.resize(48, 14);

    // 消息摘要
    createText(page, 140, sy + 44, s.msg.length > 28 ? s.msg.slice(0, 28) + "..." : s.msg, 12, rgb(100, 116, 139), "Regular");

    // 未读角标
    if (s.unread > 0) {
      const badge = createEllipse(page, 350, sy + 40, 22, 22, rgb(239, 68, 68), `badge-${s.name}`);
      createText(page, 356, sy + 44, String(s.unread), 11, rgb(255, 255, 255), "Bold");
    }

    sy += 80;
  }

  // ===== 消息区域 =====
  const msgPanel = createRect(page, 384, 0, 680, 900, rgb(255, 255, 255), "消息区域");
  const msgBorder = createRect(page, 1063, 0, 1, 900, rgb(226, 232, 240), "消息区域右边框");

  // 消息区顶栏
  const msgHeader = createRect(page, 384, 0, 680, 64, rgb(255, 255, 255), "消息顶栏");
  const msgHeaderBorder = createRect(page, 384, 63, 680, 1, rgb(226, 232, 240), "消息顶栏边框");
  createText(page, 408, 16, "John Davis", 17, rgb(30, 41, 59), "Bold");
  createText(page, 408, 40, "WhatsApp · 在线 · 最后活跃 2分钟前", 12, rgb(148, 163, 184), "Regular");

  // 顶栏右侧操作按钮
  const pinBtn = createRect(page, 996, 18, 32, 32, rgb(241, 245, 249), "置顶按钮");
  pinBtn.cornerRadius = 8;
  const moreBtn = createRect(page, 1034, 18, 32, 32, rgb(241, 245, 249), "更多按钮");
  moreBtn.cornerRadius = 8;

  // === 消息气泡 ===
  // 客户消息1
  const custMsg1 = createRect(page, 408, 88, 360, 52, rgb(241, 245, 249), "客户消息1");
  custMsg1.cornerRadius = 12;
  createText(page, 424, 100, "Hi, I want to ask about the shipping", 13, rgb(51, 65, 85), "Regular");
  createText(page, 424, 118, "time for order #SS20260601", 13, rgb(51, 65, 85), "Regular");

  // 翻译条
  const tranBar = createRect(page, 408, 148, 340, 32, rgb(237, 233, 254), "翻译条");
  tranBar.cornerRadius = 8;
  tranBar.strokes = [{ type: "SOLID", color: rgb(221, 214, 254) }];
  tranBar.strokeWeight = 1;
  createText(page, 424, 158, "🌐 你好，我想问一下订单 #SS20260601 的物流时间", 11, rgb(124, 58, 237), "Regular");

  // 客服回复
  const agentMsg1 = createRect(page, 660, 196, 380, 56, rgb(124, 58, 237), "客服回复1");
  agentMsg1.cornerRadius = 12;
  createText(page, 676, 208, "您好！订单 #SS20260601 已发货，", 13, rgb(255, 255, 255), "Regular");
  createText(page, 676, 228, "预计3-5个工作日到达 ✅", 13, rgb(255, 255, 255), "Regular");
  createText(page, 1010, 258, "✓✓ 已读 10:33", 10, rgb(148, 163, 184), "Regular");

  // AI 建议回复
  const aiSuggest = createRect(page, 408, 280, 520, 48, rgb(240, 253, 244), "AI建议");
  aiSuggest.cornerRadius = 10;
  aiSuggest.strokes = [{ type: "SOLID", color: rgb(187, 247, 208) }];
  aiSuggest.strokeWeight = 1;
  aiSuggest.dashPattern = [6, 4];
  createText(page, 424, 292, "🤖 AI 建议回复：", 12, rgb(5, 150, 105), "Semi Bold");
  createText(page, 424, 310, "Would you like me to provide the tracking number for your order?", 12, rgb(6, 95, 70), "Regular");

  // 客户消息2
  const custMsg2 = createRect(page, 408, 344, 240, 40, rgb(241, 245, 249), "客户消息2");
  custMsg2.cornerRadius = 12;
  createText(page, 424, 356, "Yes please, thank you! 😊", 13, rgb(51, 65, 85), "Regular");

  // === 输入区域 ===
  const inputArea = createRect(page, 384, 780, 680, 120, rgb(255, 255, 255), "输入区域");
  const inputBorder = createRect(page, 384, 780, 680, 1, rgb(226, 232, 240), "输入区上边框");

  // 工具栏
  const tools = ["😊", "📎", "📷", "⚡", "🤖", "🌐"];
  let tx = 408;
  for (const t of tools) {
    createText(page, tx, 798, t, 16, rgb(148, 163, 184), "Regular");
    tx += 36;
  }

  // 输入框
  const inputBox = createRect(page, 408, 820, 580, 56, rgb(248, 250, 252), "输入框");
  inputBox.cornerRadius = 10;
  inputBox.strokes = [{ type: "SOLID", color: rgb(226, 232, 240) }];
  inputBox.strokeWeight = 1;
  createText(page, 424, 842, "输入消息...  按 / 触发话术库", 13, rgb(148, 163, 184), "Regular");

  // 发送按钮
  const sendBtn = createRect(page, 1000, 826, 56, 44, rgb(124, 58, 237), "发送按钮");
  sendBtn.cornerRadius = 10;
  createText(page, 1012, 842, "发送", 14, rgb(255, 255, 255), "Semi Bold");

  // ===== 右侧客户信息面板 (376px) =====
  const infoPanel = createRect(page, 1064, 0, 376, 900, rgb(250, 251, 252), "客户信息面板");

  // 客户头像 & 基本信息
  const bigAvatar = createEllipse(page, 1212, 32, 64, 64, rgb(219, 234, 254), "大头像");
  createText(page, 1230, 52, "JD", 20, rgb(37, 99, 235), "Bold");
  const nameText = createText(page, 1170, 112, "John Davis", 18, rgb(30, 41, 59), "Bold");
  nameText.textAlignHorizontal = "CENTER";
  nameText.resize(148, 22);
  const emailText = createText(page, 1156, 138, "john.davis@gmail.com", 13, rgb(100, 116, 139), "Regular");
  emailText.textAlignHorizontal = "CENTER";
  emailText.resize(176, 16);
  const phoneText = createText(page, 1168, 158, "+1 (555) 123-4567", 13, rgb(100, 116, 139), "Regular");
  phoneText.textAlignHorizontal = "CENTER";
  phoneText.resize(152, 16);

  // 标签
  const tags = [
    { label: "VIP", color: rgb(219, 234, 254), textColor: rgb(37, 99, 235) },
    { label: "高意向", color: rgb(254, 243, 199), textColor: rgb(180, 83, 9) },
    { label: "美国", color: rgb(209, 250, 229), textColor: rgb(5, 150, 105) },
  ];
  let tagX = 1140;
  for (const tag of tags) {
    const tw = tag.label.length * 12 + 16;
    const tagRect = createRect(page, tagX, 184, tw, 24, tag.color, `tag-${tag.label}`);
    tagRect.cornerRadius = 12;
    createText(page, tagX + 8, 190, tag.label, 11, tag.textColor, "Semi Bold");
    tagX += tw + 8;
  }

  // 分割线
  createRect(page, 1088, 220, 328, 1, rgb(226, 232, 240), "分割线1");

  // 客户信息字段
  createText(page, 1088, 236, "客户信息", 14, rgb(30, 41, 59), "Semi Bold");
  const fields = [
    { label: "渠道来源", value: "WhatsApp" },
    { label: "创建时间", value: "2026-05-15" },
    { label: "总会话数", value: "12" },
    { label: "总订单数", value: "3 ($456.00)" },
    { label: "客户等级", value: "VIP" },
  ];
  let fy = 262;
  for (const f of fields) {
    createText(page, 1088, fy, f.label, 12, rgb(148, 163, 184), "Regular");
    const valText = createText(page, 1380, fy, f.value, 12, rgb(71, 85, 105), "Medium");
    valText.textAlignHorizontal = "RIGHT";
    valText.resize(100, 14);
    fy += 24;
  }

  // 分割线
  createRect(page, 1088, fy + 8, 328, 1, rgb(226, 232, 240), "分割线2");

  // 最近订单
  createText(page, 1088, fy + 24, "最近订单", 14, rgb(30, 41, 59), "Semi Bold");
  const orderCard = createRect(page, 1088, fy + 48, 328, 60, rgb(255, 255, 255), "订单卡片");
  orderCard.cornerRadius = 8;
  orderCard.strokes = [{ type: "SOLID", color: rgb(226, 232, 240) }];
  orderCard.strokeWeight = 1;
  createText(page, 1100, fy + 62, "#SS20260601", 12, rgb(30, 41, 59), "Semi Bold");
  const statusTag = createRect(page, 1348, fy + 56, 52, 20, rgb(209, 250, 229), "订单状态");
  statusTag.cornerRadius = 10;
  createText(page, 1354, fy + 62, "已发货", 10, rgb(5, 150, 105), "Semi Bold");
  createText(page, 1100, fy + 84, "Wireless Earbuds × 2", 11, rgb(100, 116, 139), "Regular");
  createText(page, 1368, fy + 84, "$89.00", 11, rgb(71, 85, 105), "Medium");

  // 分割线
  createRect(page, 1088, fy + 120, 328, 1, rgb(226, 232, 240), "分割线3");

  // 历史会话
  createText(page, 1088, fy + 136, "历史会话", 14, rgb(30, 41, 59), "Semi Bold");
  const historyItems = [
    "2026-05-28 · 物流查询 · 已解决",
    "2026-05-15 · 首次咨询 · 已转化",
    "2026-04-22 · 退换货 · 已处理",
  ];
  let hy = fy + 160;
  for (const h of historyItems) {
    const hCard = createRect(page, 1088, hy, 328, 36, rgb(255, 255, 255), "历史会话");
    hCard.cornerRadius = 6;
    hCard.strokes = [{ type: "SOLID", color: rgb(226, 232, 240) }];
    hCard.strokeWeight = 1;
    createText(page, 1100, hy + 12, h, 11, rgb(100, 116, 139), "Regular");
    hy += 42;
  }

  // 定位到创建的 frame
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin("✅ 聊天主界面原型已生成！");
}

// ===== 工具函数 =====
function rgb(r: number, g: number, b: number): RGB {
  return { r: r / 255, g: g / 255, b: b / 255 };
}

function rgba(r: number, g: number, b: number, a: number): RGBA {
  return { r: r / 255, g: g / 255, b: b / 255, a };
}

function createRect(parent: FrameNode, x: number, y: number, w: number, h: number, color: RGB | RGBA, name: string): RectangleNode {
  const rect = figma.createRectangle();
  rect.name = name;
  rect.x = x;
  rect.y = y;
  rect.resize(w, h);
  if ("a" in color) {
    rect.fills = [{ type: "SOLID", color: { r: color.r, g: color.g, b: color.b }, opacity: color.a }];
  } else {
    rect.fills = [{ type: "SOLID", color }];
  }
  parent.appendChild(rect);
  return rect;
}

function createEllipse(parent: FrameNode, x: number, y: number, w: number, h: number, color: RGB, name: string): EllipseNode {
  const ellipse = figma.createEllipse();
  ellipse.name = name;
  ellipse.x = x;
  ellipse.y = y;
  ellipse.resize(w, h);
  ellipse.fills = [{ type: "SOLID", color }];
  parent.appendChild(ellipse);
  return ellipse;
}

function createText(parent: FrameNode, x: number, y: number, content: string, size: number, color: RGB, style: string): TextNode {
  const text = figma.createText();
  text.name = content.slice(0, 20);
  text.x = x;
  text.y = y;
  text.fontName = { family: "Inter", style };
  text.fontSize = size;
  text.characters = content;
  text.fills = [{ type: "SOLID", color }];
  parent.appendChild(text);
  return text;
}

main();
