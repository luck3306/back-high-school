import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT) || 4173;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = http.createServer((request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const decoded = decodeURIComponent(url.pathname);
    const requested = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
    const filePath = normalize(join(root, requested));
    if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 · 这一页没有写进高中三年里。");
      return;
    }
    response.writeHead(200, {
      "Content-Type": mime[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`服务器错误：${error.message}`);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`《重回高中》已启动：http://127.0.0.1:${port}`);
  console.log("按 Ctrl+C 停止。");
});
