import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 4175;
const debugPort = 9335;
const profileDir = mkdtempSync(join(tmpdir(), "back-high-school-edge-"));
const artifacts = join(root, "test-artifacts");
mkdirSync(artifacts, { recursive: true });

const wait = (ms) => new Promise((resolveWait) => setTimeout(resolveWait, ms));

async function waitForHttp(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // retry
    }
    await wait(200);
  }
  throw new Error(`等待服务超时：${url}`);
}

const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: "ignore",
  windowsHide: true,
});

let browser;
let socket;
let messageId = 0;
const pending = new Map();
const errors = [];

try {
  await waitForHttp(`http://127.0.0.1:${port}/`);
  browser = spawn(edge, [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--disable-gpu",
    `http://127.0.0.1:${port}/`,
  ], { stdio: "ignore", windowsHide: true });

  await waitForHttp(`http://127.0.0.1:${debugPort}/json/version`);
  let tab;
  for (let attempt = 0; attempt < 70; attempt += 1) {
    const tabs = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
    tab = tabs.find((item) => item.type === "page" && item.url.includes(`127.0.0.1:${port}`));
    if (tab) break;
    await wait(200);
  }
  if (!tab) throw new Error("未找到游戏页面标签");

  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve: resolveMessage, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolveMessage(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") {
      errors.push(message.params.exceptionDetails?.text || "未知页面异常");
    }
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      errors.push(message.params.entry.text);
    }
  });

  const send = (method, params = {}) => new Promise((resolveMessage, reject) => {
    const id = ++messageId;
    pending.set(id, { resolve: resolveMessage, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "页面执行异常");
    return result.result?.value;
  };

  const screenshot = async (name) => {
    const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    writeFileSync(join(artifacts, name), Buffer.from(result.data, "base64"));
  };

  const assertNoOverflow = async (label) => {
    const metrics = await evaluate(`({
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      viewportHeight: window.innerHeight,
      bodyTextLength: document.body.innerText.length
    })`);
    if (metrics.scrollWidth > metrics.innerWidth + 1 || metrics.bodyWidth > metrics.innerWidth + 1) {
      throw new Error(`${label} 出现横向溢出：${JSON.stringify(metrics)}`);
    }
    if (metrics.bodyTextLength < 20) throw new Error(`${label} 内容为空`);
  };
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 960, deviceScaleFactor: 1, mobile: false });
  await wait(800);
  await evaluate("localStorage.clear(); location.reload(); true");
  await wait(1000);
  await screenshot("01-title-desktop.png");
  await assertNoOverflow("标题页");
  const audioBefore = await evaluate("document.querySelector('#audio-toggle')?.textContent || ''");
  await evaluate("document.querySelector('#audio-toggle').click(); true");
  await wait(80);
  const audioAfter = await evaluate("document.querySelector('#audio-toggle')?.textContent || ''");
  if (!audioBefore || audioBefore === audioAfter) throw new Error("音乐开关没有切换状态");
  await evaluate("document.querySelector('#audio-toggle').click(); true");

  await evaluate("document.querySelector('[data-action=\"new-game\"]').click(); true");
  await wait(250);
  await evaluate(`
    document.querySelector('#player-name').value = '沈知遥';
    document.querySelector('#player-name').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-group="interest"][data-option="arts"]').click();
    document.querySelector('[data-action="reroll"]').click();
    true
  `);
  await wait(250);
  await screenshot("02-identity-desktop.png");
  await assertNoOverflow("身份页");

  await evaluate("document.querySelector('[data-action=\"start-run\"]').click(); true");
  await wait(250);
  const castIntroVisible = await evaluate("Boolean(document.querySelector('.cast-intro-card'))");
  if (!castIntroVisible) throw new Error("开始游戏后没有进入五人初见");
  await screenshot("03-cast-intro-desktop.png");
  const castNames = await evaluate("document.querySelectorAll('.cast-intro-card').length");
  for (let index = 0; index < 5; index += 1) {
    await evaluate("document.querySelector('[data-action=\"meet-next\"]').click(); true");
    await wait(30);
  }
  const introVisible = await evaluate("Boolean(document.querySelector('.chapter-card'))");
  if (!introVisible) throw new Error("五人初见结束后没有进入章节页");

  await evaluate("document.querySelector('[data-action=\"start-semester\"]').click(); true");
  await wait(250);
  const eventVisible = await evaluate("Boolean(document.querySelector('.event-card .choice-button'))");
  if (!eventVisible) throw new Error("没有进入随机事件页");
  const eventMeta = await evaluate("document.querySelector('.event-meta')?.innerText || ''");
  if (!eventMeta.includes("事件 1/5")) throw new Error(`首学期事件数量不是 5：${eventMeta}`);

  await evaluate("location.reload(); true");
  await wait(700);
  const hasContinue = await evaluate("Boolean(document.querySelector('[data-action=\"continue\"]'))");
  if (!hasContinue) throw new Error("刷新后未出现继续游戏入口");
  await evaluate("document.querySelector('[data-action=\"continue\"]').click(); true");
  await wait(250);
  const resumed = await evaluate("Boolean(document.querySelector('.event-card'))");
  if (!resumed) throw new Error("继续存档后没有恢复到随机事件");
  await send("Emulation.setDeviceMetricsOverride", { width: 430, height: 932, deviceScaleFactor: 1, mobile: true });
  await wait(250);
  await screenshot("04-event-mobile.png");
  await assertNoOverflow("事件页移动端");

  const completed = await evaluate(`
    (async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let steps = 0;
      while (steps < 140) {
        steps += 1;
        const meet = document.querySelector('[data-action="meet-next"]');
        if (meet) { meet.click(); await sleep(20); continue; }
        const start = document.querySelector('[data-action="start-semester"]');
        if (start) { start.click(); await sleep(20); continue; }
        const splitChoice = document.querySelector('[data-action="choose-split"]');
        if (splitChoice) { splitChoice.click(); await sleep(20); continue; }
        const splitContinue = document.querySelector('[data-action="continue-split"]');
        if (splitContinue) { splitContinue.click(); await sleep(20); continue; }
        const choice = [...document.querySelectorAll('button.choice-button')].find((button) => !button.disabled);
        if (choice) { choice.click(); await sleep(20); continue; }
        const nextOutcome = document.querySelector('[data-action="continue-outcome"]');
        if (nextOutcome) { nextOutcome.click(); await sleep(20); continue; }
        const outro = document.querySelector('[data-action="advance-outro"]');
        if (outro) { outro.click(); await sleep(20); continue; }
        const final = document.querySelector('[data-action="final-intent"][data-intent="future"]');
        if (final) { final.click(); await sleep(60); return { ending: document.querySelector('.ending-content h1')?.textContent, steps }; }
        const ending = document.querySelector('.ending-content h1');
        if (ending) return { ending: ending.textContent, steps };
        await sleep(20);
      }
      throw new Error('自动游玩超过步数限制｜' + document.body.innerText.slice(0, 260) + '｜' + (document.querySelector('#toast')?.textContent || '无提示'));
    })()
  `);
  if (!completed?.ending) throw new Error("自动游玩未到达结局");
  const endingIdentity = await evaluate("document.querySelector('.ending-identity')?.innerText || ''");
  if (!endingIdentity.includes("分班结果") || !endingIdentity.includes("家庭背景")) throw new Error("结局页没有展示分班结果或家庭背景");
  const endingCastCount = await evaluate("document.querySelectorAll('.ending-cast-row').length");
  if (endingCastCount !== 5) throw new Error(`结局页核心人物数量异常：${endingCastCount}`);
  await wait(250);
  await screenshot("05-ending-mobile.png");
  await assertNoOverflow("结局页移动端");

  await evaluate("document.querySelector('[data-action=\"archive\"]').click(); true");
  await wait(250);
  const archiveCount = await evaluate("document.querySelectorAll('.archive-card').length");
  if (archiveCount !== 22) throw new Error(`图鉴卡片数量异常：${archiveCount}`);
  await screenshot("06-archive-mobile.png");
  await assertNoOverflow("图鉴移动端");

  const unlocked = await evaluate("document.querySelectorAll('.archive-card.is-unlocked').length");
  if (unlocked !== 1) throw new Error(`预期解锁 1 个结局，实际 ${unlocked}`);
  if (errors.length) throw new Error(`浏览器控制台错误：${errors.join(" | ")}`);

  console.log(JSON.stringify({
    ok: true,
    castNames,
    ending: completed.ending,
    steps: completed.steps,
    archiveCount,
    unlocked,
    screenshots: [
      "test-artifacts/01-title-desktop.png",
      "test-artifacts/02-identity-desktop.png",
      "test-artifacts/03-cast-intro-desktop.png",
      "test-artifacts/04-event-mobile.png",
      "test-artifacts/05-ending-mobile.png",
      "test-artifacts/06-archive-mobile.png",
    ],
  }, null, 2));
} finally {
  try { socket?.close(); } catch {}
  try { browser?.kill(); } catch {}
  try { server.kill(); } catch {}
}

