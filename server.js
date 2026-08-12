const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const root = __dirname;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };

function send(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": contentType, "Cache-Control": "no-store" });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, "http://127.0.0.1");

  if (requestUrl.pathname === "/api/shutdown" && req.method === "POST") {
    send(res, 200, JSON.stringify({ stopped: true }));
    setTimeout(() => server.close(() => process.exit(0)), 150);
    return;
  }

  if (requestUrl.pathname === "/api/chart") {
    const symbol = (requestUrl.searchParams.get("symbol") || "").toUpperCase();
    const range = requestUrl.searchParams.get("range") || "1y";
    const interval = requestUrl.searchParams.get("interval") || "1d";
    if (!/^[A-Z.\-]{1,10}$/.test(symbol)) return send(res, 400, JSON.stringify({ error: "Invalid stock symbol." }));

    try {
      const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}&includePrePost=false`;
      const upstream = await fetch(quoteUrl, { headers: { "User-Agent": "QuickPaper/1.0" } });
      const payload = await upstream.text();
      if (!upstream.ok) return send(res, upstream.status, JSON.stringify({ error: "Live quote provider did not return data." }));
      send(res, 200, payload);
    } catch {
      send(res, 503, JSON.stringify({ error: "Unable to reach the live quote provider." }));
    }
    return;
  }

  const safePath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const file = path.resolve(root, `.${safePath}`);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, "Not found", "text/plain; charset=utf-8");
  send(res, 200, fs.readFileSync(file), types[path.extname(file)] || "application/octet-stream");
});

server.listen(4173, "127.0.0.1", () => console.log("QuickPaper running at http://127.0.0.1:4173"));
