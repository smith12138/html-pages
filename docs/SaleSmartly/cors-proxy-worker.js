// Cloudflare Worker — CORS Proxy for External API
// 部署步骤：
// 1. 登录 https://dash.cloudflare.com → Workers & Pages → Create
// 2. 点击 "Create Worker" → 粘贴此代码 → Deploy
// 3. 得到 URL 如 https://xxx.username.workers.dev
// 4. 在测试页的 "CORS Proxy" 输入框填入该 URL

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('target');
    if (!target) {
      return new Response(JSON.stringify({ code: 400, msg: 'Missing target parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      const resp = await fetch(decodeURIComponent(target));
      const body = await resp.text();
      return new Response(body, {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ code: 500, msg: e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};
