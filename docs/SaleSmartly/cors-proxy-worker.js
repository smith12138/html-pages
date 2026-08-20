// Cloudflare Worker — CORS Proxy for External / CS API
// 转发 method + 鉴权请求头 + body, 使浏览器可请求需要自定义头(如 X-CS-*)的接口。
//
// 部署步骤：
// 1. 登录 https://dash.cloudflare.com → Workers & Pages → Create
// 2. 点击 "Create Worker" → 粘贴此代码 → Deploy
// 3. 得到 URL 如 https://xxx.username.workers.dev
// 4. 在测试页的 "CORS Proxy" 输入框填入该 URL
//
// 用法: <worker>/?target=<URL编码后的完整目标URL>
// 说明: 代理是 https, 由它服务端请求 http 目标, 同时解决「混合内容」+「CORS」+「自定义头」。

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

// 转发到目标的请求头白名单(小写)。保留鉴权头; 丢弃 Host/Origin/Referer 等,
// 避免把浏览器 Origin(如 github.io) 带给目标而触发其 Origin 白名单校验。
const FORWARD_HEADERS = [
  'x-cs-app-id', 'x-cs-timestamp', 'x-cs-nonce', 'x-cs-signature',
  'content-type', 'authorization', 'external-sign',
];

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('target');
    if (!target) {
      return new Response(JSON.stringify({ code: 400, msg: 'Missing target parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    // 复制白名单内的请求头转发给目标
    const fwd = new Headers();
    for (const [k, v] of request.headers) {
      if (FORWARD_HEADERS.includes(k.toLowerCase())) fwd.set(k, v);
    }

    let body;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.arrayBuffer();
    }

    try {
      const resp = await fetch(decodeURIComponent(target), {
        method: request.method,
        headers: fwd,
        body,
      });
      const buf = await resp.arrayBuffer();
      return new Response(buf, {
        status: resp.status,
        headers: {
          'Content-Type': resp.headers.get('Content-Type') || 'application/json',
          ...CORS,
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ code: 500, msg: String(e && e.message || e) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }
  },
};
