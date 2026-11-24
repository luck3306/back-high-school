import { ENDING_BY_ID } from "./content/index.js";
import { SAVE_KEYS } from "./config.js";

const memory = new Map();

function storage() {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // 微信或隐私模式下可能禁用 localStorage，回退到内存存储。
  }
  return {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
  };
}

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function saveRun(state) {
  try {
    storage().setItem(SAVE_KEYS.run, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadRun() {
  const state = parseJson(storage().getItem(SAVE_KEYS.run), null);
  if (!state || state.schemaVersion !== 3 || !state.identity || !state.stats) return null;
  return state;
}

export function hasRun() {
  return Boolean(loadRun());
}

export function clearRun() {
  try {
    storage().removeItem(SAVE_KEYS.run);
  } catch {
    // 忽略存储清理失败，不影响当前内存中的结局展示。
  }
}

export function loadArchive() {
  const archive = parseJson(storage().getItem(SAVE_KEYS.archive), {});
  return archive && typeof archive === "object" ? archive : {};
}

export function unlockEnding(endingId, snapshot = null) {
  const archive = loadArchive();
  if (!ENDING_BY_ID[endingId]) return archive;
  if (!archive[endingId]) {
    archive[endingId] = {
      endingId,
      title: ENDING_BY_ID[endingId].title,
      subtitle: snapshot?.subtitle || "",
      text: snapshot?.text || [],
      cast: snapshot?.cast || [],
      classSplit: snapshot?.classSplit || null,
      unlockedAt: new Date().toISOString(),
    };
    try {
      storage().setItem(SAVE_KEYS.archive, JSON.stringify(archive));
    } catch {
      // 图鉴写入失败时，本次游玩仍可正常展示结局。
    }
  }
  return archive;
}

export function clearArchive() {
  try {
    storage().removeItem(SAVE_KEYS.archive);
  } catch {
    // 测试环境无需处理。
  }
}

export function getStorageMode() {
  try {
    if (typeof localStorage !== "undefined") {
      const probe = "__back_high_school_probe__";
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
      return "local";
    }
  } catch {
    // fall through
  }
  return "memory";
}


