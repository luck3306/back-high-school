import {
  CATEGORY_DEFS,
  ENDING_LABELS,
  FAMILY_PROFILES,
  FINAL_INTENTS,
  GENDER_OPTIONS,
  IDENTITY_GROUPS,
  SEMESTERS,
  STAT_DEFS,
} from "./config.js";
import { ENDING_BY_ID, ENDINGS } from "./content/index.js";
import { gameAudio } from "./audio.js";
import {
  CLASS_SPLIT_CHOICES,
  advanceAfterOutcome,
  advanceCastIntroduction,
  advanceFromOutro,
  continueAfterClassSplit,
  currentCastIntroduction,
  genderedText,
  resolveClassSplit,
  createInitialState,
  createRunSeed,
  getChoiceAvailability,
  getCurrentEvent,
  getCurrentSemester,
  getFamily,
  getHighlights,
  getNpc,
  getTrait,
  getIdentityOption,
  rankNpcsByAffinity,
  renderText,
  resolveChoice,
  resolveEnding,
  rollRandomProfile,
  startSemesterEvents,
} from "./engine.js";
import {
  clearRun,
  getStorageMode,
  hasRun,
  loadArchive,
  loadRun,
  saveRun,
  unlockEnding,
} from "./storage.js";

const app = document.querySelector("#app");
let run = null;
let draft = null;
let toastTimer = null;

const RANDOM_NAMES = ["沈知遥", "顾晨", "林予安", "周行", "陆小满", "陈一川", "许知意", "江望"];
const STAT_BY_ID = Object.fromEntries(STAT_DEFS.map((stat) => [stat.id, stat]));
const CATEGORY_BY_ID = Object.fromEntries(CATEGORY_DEFS.map((category) => [category.id, category]));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pct(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function randomName() {
  return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
}

function newDraft() {
  const choices = { academic: "steady", interest: "study" };
  const profileSeed = createRunSeed();
  return {
    name: randomName(),
    gender: "unspecified",
    choices,
    profileSeed,
    profile: rollRandomProfile(profileSeed, choices),
    rerollsLeft: 1,
  };
}

function ensureDraft() {
  if (!draft) draft = newDraft();
  return draft;
}

function refreshDraftProfile() {
  draft.profile = rollRandomProfile(draft.profileSeed, draft.choices);
}

function showToast(message, tone = "normal") {
  clearTimeout(toastTimer);
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.dataset.tone = tone;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function persist() {
  if (!run) return;
  run.savedAt = new Date().toISOString();
  if (!saveRun(run)) showToast("存档写入失败，当前进度仅保留在页面中。", "warning");
}

function identityChips(identity) {
  return IDENTITY_GROUPS.map((group) => getIdentityOption(group.id, identity.choices[group.id])?.label)
    .filter(Boolean)
    .map((label) => `<span>${escapeHtml(label)}</span>`)
    .join("");
}

function renderStatBars(stats, compact = false) {
  return `
    <div class="stats-list ${compact ? "is-compact" : ""}">
      ${STAT_DEFS.map((stat) => `
        <div class="stat-row">
          <div class="stat-meta"><span>${stat.label}</span><strong>${stats[stat.id]}</strong></div>
          <div class="stat-track"><span style="--value:${pct(stats[stat.id])}%;--stat-color:${stat.color}"></span></div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderAffinity(affinity, cast) {
  return `
    <div class="affinity-list">
      ${cast.map((npc) => `
        <div class="affinity-row">
          <span class="npc-mark" style="--npc-color:${npc.color}">${npc.initials}</span>
          <div class="affinity-body">
            <div class="affinity-meta"><span>${npc.name}<small class="npc-gender">${npc.genderLabel}</small></span><strong>${affinity[npc.id]}</strong></div>
            <div class="affinity-track"><span style="--value:${pct(affinity[npc.id])}%;--npc-color:${npc.color}"></span></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStatusPanel() {
  const identity = run.identity;
  return `
    <aside class="status-panel">
      <div class="identity-summary">
        <span class="status-kicker">当前身份</span>
        <h2>${escapeHtml(identity.name)}</h2>
        <div class="identity-chips">${identityChips(identity)}</div>
      </div>
      <div class="status-section">
        <span class="status-kicker">状态</span>
        ${renderStatBars(run.stats, true)}
      </div>
      <div class="status-section">
        <span class="status-kicker">羁绊</span>
        ${renderAffinity(run.affinity, run.cast)}
      </div>
      <p class="hidden-note">隐藏特质将在毕业时揭晓</p>
    </aside>
  `;
}

function renderProgress() {
  return `
    <div class="semester-progress" aria-label="学期进度">
      ${SEMESTERS.map((semester, index) => {
        const stateClass = index < run.semesterIndex ? "is-done" : index === run.semesterIndex ? "is-current" : "";
        return `<span class="${stateClass}" title="${semester.label}">${index + 1}</span>`;
      }).join("")}
    </div>
  `;
}

function renderCastIntroduction() {
  const npc = currentCastIntroduction(run);
  if (!npc) return renderIntro();
  const index = run.castIntroIndex + 1;
  const intro = renderText(npc.introText, run, npc.id);
  return `
    <main class="cast-intro-screen">
      <header class="setup-header">
        <button class="wordmark-button" data-action="title">重回高中</button>
        <span class="eyebrow">核心人物初见 · ${index}/${run.cast.length}</span>
        <span class="cast-intro-count">${index}/${run.cast.length}</span>
      </header>
      <section class="cast-intro-card reveal">
        <div class="cast-portrait-mark" style="--npc-color:${npc.color}">${escapeHtml(npc.initials)}</div>
        <span class="eyebrow">${escapeHtml(npc.archetypeLabel)} · ${escapeHtml(npc.genderLabel)}生</span>
        <h1>${escapeHtml(npc.name)}</h1>
        <div class="cast-intro-badges">
          <span>${escapeHtml(npc.identity)}</span>
          <span>性格 · ${escapeHtml(npc.personalityLabel)}</span>
        </div>
        <p class="cast-first-impression">${escapeHtml(npc.firstImpression)}</p>
        <p class="prose large-prose">${escapeHtml(intro)}</p>
        <p class="cast-personality-note">${escapeHtml(npc.personalityDescription)}</p>
        <div class="scene-actions">
          <button class="primary-button" data-action="meet-next">${index === run.cast.length ? "走进高一" : "认识下一位"} <span>→</span></button>
        </div>
      </section>
    </main>
  `;
}

function renderClassSplitChoice() {
  const family = getFamily(run.identity.random.familyId);
  return renderGameShell(`
    <article class="scene-card chapter-card class-split-card reveal">
      <span class="eyebrow">高一下学期结束 · 分班意向</span>
      <h1>有些关系，会从下一张座位表开始改变。</h1>
      <p class="prose large-prose">学校将在下学期重新分班。老师让大家先提交个人意向。你无法控制最终结果，但可以决定自己以什么方式面对这次变化。</p>
      <p class="fine-print">家庭影响：${escapeHtml(family?.label || "普通日常")} · ${escapeHtml(family?.storyHint || "")}</p>
      <div class="choice-list">
        ${CLASS_SPLIT_CHOICES.map((option, index) => {
          const familyBonus = run.identity.random.familyId === "strict" ? 10 : 0;
          const chance = Math.round(Math.min(95, Math.max(10, option.chance * 100 + familyBonus)));
          return `<button class="choice-button" data-action="choose-split" data-choice-id="${option.id}">
            <span class="choice-number">${String(index + 1).padStart(2, "0")}</span>
            <span class="choice-copy"><strong>${escapeHtml(option.label)}</strong><small>${escapeHtml(option.description)} · 当前分班概率约 ${chance}%</small></span>
            <span class="choice-arrow">→</span>
          </button>`;
        }).join("")}
      </div>
    </article>
  `);
}

function renderClassSplitResult() {
  const result = run.classSplit;
  if (!result) return renderClassSplitChoice();
  const rows = run.cast.map((npc) => {
    const same = result.sameClassIds.includes(npc.id);
    return `<div class="split-result-row"><span class="npc-mark" style="--npc-color:${npc.color}">${escapeHtml(npc.initials)}</span><div><strong>${escapeHtml(npc.name)}</strong><small>${escapeHtml(npc.genderLabel)} · ${escapeHtml(npc.identity)}</small></div><span class="${same ? "is-same" : "is-different"}">${same ? "与你同班" : escapeHtml(result.assignments[npc.id])}</span></div>`;
  }).join("");
  return renderGameShell(`
    <article class="scene-card chapter-card split-result-card reveal">
      <span class="eyebrow">分班结果 · ${result.triggered ? "发生分班" : "保留原班"}</span>
      <h1>${result.triggered ? "新的座位表贴出来了。" : "熟悉的教室还在原地。"}</h1>
      <p class="prose large-prose">${result.triggered
        ? `你被分到了${escapeHtml(result.playerClass)}。有人仍坐在你附近，有人从此隔着两层楼。分班没有抹掉过去，但它会改变你们见面的方式。`
        : "学校最终保留了原班级。座位表重新排过，熟悉的人还在，只是从这一学期开始，每张桌子都像多了一点值得珍惜的理由。"}</p>
      <div class="split-result-list">${rows}</div>
      <div class="scene-actions"><button class="primary-button" data-action="continue-split">进入高二 <span>→</span></button></div>
    </article>
  `, "is-class-split");
}

function renderGameShell(content, className = "") {
  const semester = getCurrentSemester(run);
  return `
    <div class="game-screen ${className}">
      <header class="game-topbar">
        <button class="wordmark-button" data-action="title">重回高中</button>
        <div class="topbar-center">
          <span>${escapeHtml(semester?.label || "毕业结算")}</span>
          ${renderProgress()}
        </div>
        <button class="text-button" data-action="title">存档并返回</button>
      </header>
      <main class="play-layout">
        ${renderStatusPanel()}
        <section class="scene-column">${content}</section>
      </main>
    </div>
  `;
}

function renderIntro() {
  const semester = getCurrentSemester(run);
  const number = String(run.semesterIndex + 1).padStart(2, "0");
  return renderGameShell(`
    <article class="scene-card chapter-card reveal">
      <div class="chapter-index">${number}<span>/ 06</span></div>
      <div class="scene-heading">
        <span class="eyebrow">${escapeHtml(semester.label)} · ${escapeHtml(semester.season)}</span>
        <h1>${escapeHtml(semester.title)}</h1>
      </div>
      <p class="prose large-prose">${renderText(semester.text, run)}</p>
      <div class="scene-actions">
        <button class="primary-button" data-action="start-semester">走进这段日子 <span>→</span></button>
      </div>
    </article>
  `);
}

function eventKindLabel(event) {
  if (event.surprise) return "突发事件";
  if (event.crossCharacter) return "交叉关系";
  if (event.relationship) return "关系主线";
  return CATEGORY_BY_ID[event.category]?.label || "校园";
}

function renderEvent() {
  const event = getCurrentEvent(run);
  if (!event) return renderIntro();
  const semester = getCurrentSemester(run);
  const npc = event.npc ? getNpc(run, event.npc) : null;
  const eventTitle = renderText(genderedText(event.titleByGender, run.identity.gender, event.title), run, event.npc);
  const eventText = renderText(genderedText(event.textByGender, run.identity.gender, event.text), run, event.npc);
  const choiceHtml = event.choices.map((choice, index) => {
    const availability = getChoiceAvailability(run, choice);
    const choiceLabel = renderText(genderedText(choice.labelByGender, run.identity.gender, choice.label), run, event.npc);
    return `
      <button class="choice-button" data-action="choose" data-choice-id="${escapeHtml(choice.id)}" ${availability.available ? "" : "disabled"}>
        <span class="choice-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="choice-copy">
          <strong>${escapeHtml(choiceLabel)}</strong>
          ${availability.available ? "" : `<small>${escapeHtml(availability.reason)}</small>`}
        </span>
        <span class="choice-arrow">↗</span>
      </button>
    `;
  }).join("");
  return renderGameShell(`
    <article class="scene-card event-card ${event.surprise ? "surprise-card" : ""} reveal">
      <div class="event-meta">
        <span class="event-category">${escapeHtml(eventKindLabel(event))}${npc ? ` · ${escapeHtml(npc.name)}（${escapeHtml(npc.genderLabel)}）` : ""}</span>
        <span>${escapeHtml(semester.season)} · 事件 ${run.eventIndex + 1}/${run.eventQueue.length}</span>
      </div>
      <h1>${escapeHtml(eventTitle)}</h1>
      <p class="prose">${escapeHtml(eventText)}</p>
      <div class="choice-list">${choiceHtml}</div>
    </article>
  `);
}

function renderEffectSummary(summary) {
  const statParts = STAT_DEFS
    .map((stat) => ({ label: stat.label, value: summary?.stats?.[stat.id] || 0 }))
    .filter((item) => item.value !== 0);
  const affinityParts = run.cast
    .map((npc) => ({ label: npc.name, value: summary?.affinity?.[npc.id] || 0 }))
    .filter((item) => item.value !== 0);
  if (!statParts.length && !affinityParts.length) {
    return `<div class="effect-summary"><span class="effect-static">有些变化没有立刻写在数字上。</span></div>`;
  }
  return `
    <div class="effect-summary">
      ${statParts.map((item) => `<span class="${item.value > 0 ? "is-up" : "is-down"}">${item.label} ${item.value > 0 ? "+" : ""}${item.value}</span>`).join("")}
      ${affinityParts.map((item) => `<span class="${item.value > 0 ? "is-up" : "is-down"}">${item.label} ${item.value > 0 ? "+" : ""}${item.value}</span>`).join("")}
    </div>
  `;
}

function renderOutcome() {
  const result = run.currentOutcome;
  const category = result?.surprise ? "突发事件" : result?.crossCharacter ? "交叉关系" : result?.relationship ? "关系主线" : CATEGORY_BY_ID[result?.category]?.label || "结果";
  const title = renderText(result?.eventTitle || "结果", run, result?.npcId);
  const body = renderText(result?.text || "故事继续向前。", run, result?.npcId);
  return renderGameShell(`
    <article class="scene-card outcome-card reveal">
      <span class="eyebrow">${escapeHtml(category)} · 这一刻之后</span>
      <h1>${escapeHtml(title)}</h1>
      <p class="prose large-prose">${escapeHtml(body)}</p>
      ${renderEffectSummary(result?.summary)}
      <div class="scene-actions">
        <button class="primary-button" data-action="continue-outcome">继续 <span>→</span></button>
      </div>
    </article>
  `);
}

function renderOutro() {
  const semester = getCurrentSemester(run);
  const semesterHistory = run.history.filter((item) => item.semesterIndex === run.semesterIndex);
  return renderGameShell(`
    <article class="scene-card chapter-card reveal">
      <div class="chapter-index">${String(run.semesterIndex + 1).padStart(2, "0")}<span>/ 06</span></div>
      <div class="scene-heading">
        <span class="eyebrow">${escapeHtml(semester.label)} · 学期结束</span>
        <h1>${escapeHtml(semester.title)}</h1>
      </div>
      <p class="prose large-prose">${renderText(semester.outro, run)}</p>
      <div class="semester-recap">
        <span class="status-kicker">这一学期</span>
        ${semesterHistory.map((item) => `<div><span>${escapeHtml(item.eventTitle)}</span><strong>${escapeHtml(CATEGORY_BY_ID[item.category]?.label || "经历")}</strong></div>`).join("")}
      </div>
      <div class="scene-actions">
        <button class="primary-button" data-action="advance-outro">${run.semesterIndex === SEMESTERS.length - 1 ? "走向毕业" : "进入下一学期"} <span>→</span></button>
      </div>
    </article>
  `);
}


function renderFinal() {
  const top = rankNpcsByAffinity(run)[0];
  const highlights = getHighlights(run);
  const intentHtml = FINAL_INTENTS.map((intent, index) => `
    <button class="final-choice" data-action="final-intent" data-intent="${intent.id}">
      <span class="choice-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="choice-copy"><strong>${escapeHtml(intent.label)}</strong><small>${escapeHtml(intent.description)}</small></span>
      <span class="choice-arrow">→</span>
    </button>
  `).join("");
  return renderGameShell(`
    <article class="scene-card final-card reveal">
      <span class="eyebrow">毕业之前 · 最后一次选择</span>
      <h1>三年走到这里。</h1>
      <p class="prose large-prose">倒计时牌已经翻到最后一页。你站在教学楼的天台上，看见操场上有人在奔跑，有人举着相机，有人朝你挥手。过去三年不会给出标准答案，但你仍然可以做最后一次决定。</p>
      ${highlights.length ? `<div class="highlight-ribbon"><span>你的高光</span>${highlights.map((item) => `<strong>${escapeHtml(item)}</strong>`).join("")}</div>` : ""}
      <div class="top-relation">
        <span>此刻最在意的人</span>
        <strong style="color:${top.color}">${top.name} · ${run.affinity[top.id]}</strong>
        <small>${escapeHtml(top.description)}</small>
      </div>
      <div class="final-choice-list">${intentHtml}</div>
      <p class="fine-print">最终结局会受到家庭背景、五人的关系、分班结果、关键选择与概率影响。</p>
    </article>
  `, "is-final");
}

function showTitle() {
  run = null;
  const saved = loadRun();
  const archive = loadArchive();
  const unlocked = Object.keys(archive).length;
  app.innerHTML = `
    <main class="title-screen">
      <div class="title-grid" aria-hidden="true">
        <span>高一</span><span>高二</span><span>高三</span>
      </div>
      <div class="hero-copy reveal">
        <span class="eyebrow">三年 · 六学期 · ${ENDINGS.length} 种结局</span>
        <h1><span>重回</span><strong>高中</strong></h1>
        <p class="hero-lead">从高一开学那天重新出发。你会遇见谁，错过什么，又会在哪一个普通的下午，决定自己的未来？</p>
        <div class="title-actions">
          ${saved ? `<button class="primary-button" data-action="continue">继续这三年 <span>→</span></button>` : ""}
          <button class="${saved ? "secondary-button" : "primary-button"}" data-action="new-game">${saved ? "重新开始" : "开始新的三年"} <span>→</span></button>
          <button class="quiet-button" data-action="archive">结局图鉴 ${unlocked}/${ENDINGS.length}</button>
        </div>
      </div>
      <div class="title-note paper-card">
        <span class="paper-label">玩法</span>
        <p>家庭与五名核心同学随机生成。每学期经历常规剧情、关系主线、交叉关系和突发事件，姓名、身份、性格与分班结果都会改变故事。</p>
        <div class="title-facts">
          <span><strong>${unlocked}</strong> 已解锁结局</span>
          <span><strong>${getStorageMode() === "local" ? "自动" : "临时"}</strong> 存档模式</span>
        </div>
      </div>
      <footer class="title-footer"><span>文字驱动的校园人生模拟</span><span>2026 · 狂野工作室</span></footer>
    </main>
  `;
  gameAudio.setScene("title");
  document.title = "重回高中";
}

function showNewGame() {
  const current = ensureDraft();
  const family = getFamily(current.profile.familyId);
  app.innerHTML = `
    <main class="setup-screen">
      <header class="setup-header">
        <button class="wordmark-button" data-action="title">重回高中</button>
        <span class="eyebrow">建立你的高中身份</span>
        <button class="text-button" data-action="title">返回</button>
      </header>
      <div class="setup-layout">
        <section class="setup-main">
          <div class="setup-title reveal">
            <span class="eyebrow">身份生成 · 半选择半随机</span>
            <h1>你将以怎样的样子，重新走进高一？</h1>
          </div>
          <div class="name-row">
            <label class="name-field"><span>姓名</span><input id="player-name" maxlength="12" value="${escapeHtml(current.name)}" autocomplete="off" /></label>
            <div class="gender-field">
              <span>性别</span>
              <div class="segmented">
                ${GENDER_OPTIONS.map((option) => `<button class="${current.gender === option.id ? "is-active" : ""}" data-action="gender" data-gender="${option.id}">${option.label}</button>`).join("")}
              </div>
            </div>
          </div>
          ${IDENTITY_GROUPS.map((group) => `
            <section class="identity-group">
              <div class="group-heading"><h2>${group.label}</h2><p>${group.hint}</p></div>
              <div class="identity-options">
                ${group.options.map((option) => {
                  const selected = current.choices[group.id] === option.id;
                  return `<button class="identity-option ${selected ? "is-selected" : ""}" data-action="identity-option" data-group="${group.id}" data-option="${option.id}">
                    <span class="option-dot"></span>
                    <strong>${option.label}</strong>
                    <small>${option.description}</small>
                  </button>`;
                }).join("")}
              </div>
            </section>
          `).join("")}
          <div class="setup-actions">
            <button class="primary-button" data-action="start-run">确认身份，开始三年 <span>→</span></button>
          </div>
        </section>
        <aside class="profile-preview">
          <div class="preview-header">
            <span class="status-kicker">随机人生档案</span>
            <button class="mini-button" data-action="reroll" ${current.rerollsLeft ? "" : "disabled"}>重掷 ${current.rerollsLeft}/1</button>
          </div>
          <div class="family-card">
            <span class="paper-label">家庭</span>
            <h3>${escapeHtml(family?.label || "未知")}</h3>
            <p>${escapeHtml(family?.description || "")}</p>
            <small class="family-impact">${escapeHtml(family?.storyHint || "")}</small>
          </div>
          <div class="cast-roster-preview">
            <span class="status-kicker">本局核心同学</span>
            <div class="cast-roster-list">
              ${current.profile.cast.map((npc) => `<div><strong>${escapeHtml(npc.name)}</strong><span>${escapeHtml(npc.genderLabel)} · ${escapeHtml(npc.identity)}</span></div>`).join("")}
            </div>
            <p>开学时五个人会逐一出场，并展示性格与第一印象。</p>
          </div>
          <div class="sealed-card">
            <span class="sealed-mark">封</span>
            <div><strong>隐藏特质已生成</strong><p>它不会被直接展示，但会在关键时刻改变结果。</p></div>
          </div>
          <div>
            <span class="status-kicker">初始状态</span>
            ${renderStatBars(current.profile.stats)}
          </div>
          <div>
            <span class="status-kicker">初见羁绊</span>
            ${renderAffinity(current.profile.affinity, current.profile.cast)}
          </div>
          <p class="fine-print">你只选择学业起点与兴趣；家庭、五个核心人物、隐藏特质和初见关系全部随机生成。</p>
        </aside>
      </div>
    </main>
  `;
  gameAudio.setScene("daily");
  document.title = "建立身份 · 重回高中";
}

function showArchive() {
  const archive = loadArchive();
  const unlocked = Object.keys(archive).length;
  const categoryOrder = ["romance", "friendship", "growth", "ensemble", "spotlight"];
  app.innerHTML = `
    <main class="archive-screen">
      <header class="setup-header">
        <button class="wordmark-button" data-action="title">重回高中</button>
        <span class="eyebrow">结局图鉴 · ${unlocked}/${ENDINGS.length}</span>
        <button class="text-button" data-action="title">返回</button>
      </header>
      <section class="archive-hero">
        <span class="eyebrow">每一种青春都算数</span>
        <h1>你见过多少个结局？</h1>
        <p>未解锁的结局会保留线索。再次从高一出发，也许会遇见完全不同的人与事。</p>
      </section>
      <div class="archive-progress"><span style="--value:${(unlocked / ENDINGS.length) * 100}%"></span></div>
      <section class="archive-groups">
        ${categoryOrder.map((category) => `
          <div class="archive-group">
            <div class="archive-group-title"><h2>${ENDING_LABELS[category]}</h2><span>${ENDINGS.filter((item) => item.category === category && archive[item.id]).length}/${ENDINGS.filter((item) => item.category === category).length}</span></div>
            <div class="archive-grid">
              ${ENDINGS.filter((ending) => ending.category === category).map((ending) => {
                const isUnlocked = Boolean(archive[ending.id]);
                const savedText = archive[ending.id]?.text?.length ? archive[ending.id].text : ending.text;
                return `<article class="archive-card ${isUnlocked ? "is-unlocked" : "is-locked"}">
                  <div class="archive-card-top"><span>${isUnlocked ? "已解锁" : "未解锁"}</span><span>${isUnlocked ? escapeHtml(archive[ending.id].unlockedAt.slice(0, 10)) : "???"}</span></div>
                  <h3>${isUnlocked ? escapeHtml(ending.title) : "？？？"}</h3>
                  <p>${escapeHtml(ending.hint)}</p>
                  ${isUnlocked ? `<details><summary>阅读结局</summary>${savedText.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</details>` : ""}
                </article>`;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </section>
    </main>
  `;
  gameAudio.setScene("title");
  document.title = "结局图鉴 · 重回高中";
}

function showEnding(ending, reason) {
  const archive = loadArchive();
  const unlocked = Object.keys(archive).length;
  const trait = getTrait(run.identity.random.traitId);
  const family = getFamily(run.identity.random.familyId);
  const highlights = getHighlights(run);
  const subtitle = renderText(ending.subtitle, run);
  const renderedReason = renderText(reason || "", run);
  const castRows = run.cast.map((npc) => {
    const className = run.classSplit?.triggered ? run.classSplit.assignments[npc.id] : "1班";
    const sameClass = !run.classSplit?.triggered || run.classSplit.sameClassIds.includes(npc.id);
    return `<div class="ending-cast-row"><span class="npc-mark" style="--npc-color:${npc.color}">${escapeHtml(npc.initials)}</span><div><strong>${escapeHtml(npc.name)}</strong><small>${escapeHtml(npc.genderLabel)} · ${escapeHtml(npc.identity)} · ${escapeHtml(npc.personalityLabel)}</small></div><span class="${sameClass ? "is-same" : "is-different"}">${escapeHtml(className)} · 羁绊 ${run.affinity[npc.id]}</span></div>`;
  }).join("");
  app.innerHTML = `
    <main class="ending-screen">
      <div class="ending-stamp">${escapeHtml(ENDING_LABELS[ending.category] || "结局")}</div>
      <section class="ending-content reveal">
        <span class="eyebrow">${escapeHtml(subtitle)} · 结局 ${unlocked}/${ENDINGS.length}</span>
        <h1>${escapeHtml(ending.title)}</h1>
        <p class="ending-reason">${escapeHtml(renderedReason)}</p>
        <div class="ending-prose">${ending.text.map((paragraph) => `<p>${escapeHtml(renderText(paragraph, run))}</p>`).join("")}</div>
        ${highlights.length ? `<div class="ending-highlights"><span>三年高光</span><div>${highlights.map((item) => `<strong>${escapeHtml(item)}</strong>`).join("")}</div></div>` : ""}
        <div class="ending-identity">
          <div><span>家庭背景</span><strong>${escapeHtml(family?.label || "普通日常")}</strong><p>${escapeHtml(family?.description || "")}</p></div>
          <div><span>隐藏特质</span><strong>${escapeHtml(trait?.label || "未命名")}</strong><p>${escapeHtml(trait?.description || "")}</p></div>
          <div><span>分班结果</span><strong>${run.classSplit?.triggered ? "经历过分班" : "保留原班"}</strong><p>${run.classSplit?.triggered ? `你最终在${escapeHtml(run.classSplit.playerClass)}，和${run.classSplit.sameClassIds.length}名核心同学同班。` : "五个人始终在同一个班级里。"}</p></div>
        </div>
        <div class="ending-cast"><span class="status-kicker">五人的最后关系</span>${castRows}</div>
        <div class="ending-actions">
          <button class="primary-button" data-action="play-again">再走一次 <span>→</span></button>
          <button class="secondary-button" data-action="archive">查看图鉴</button>
          <button class="quiet-button" data-action="title">返回标题</button>
        </div>
      </section>
    </main>
  `;
  gameAudio.setScene("ending");
  document.title = `${ending.title} · 重回高中`;
}
function showGame() {
  if (!run) {
    run = loadRun();
    if (!run) return showTitle();
  }
  if (run.phase === "ending" && ENDING_BY_ID[run.endingId]) {
    return showEnding(ENDING_BY_ID[run.endingId], run.endingReason);
  }
  if (run.phase === "cast_intro") app.innerHTML = renderCastIntroduction();
  else if (run.phase === "intro") app.innerHTML = renderIntro();
  else if (run.phase === "event") app.innerHTML = renderEvent();
  else if (run.phase === "outcome") app.innerHTML = renderOutcome();
  else if (run.phase === "outro") app.innerHTML = renderOutro();
  else if (run.phase === "class_split_choice") app.innerHTML = renderClassSplitChoice();
  else if (run.phase === "class_split_result") app.innerHTML = renderClassSplitResult();
  else if (run.phase === "final") app.innerHTML = renderFinal();
  else showTitle();
  const activeEvent = run.phase === "event" ? getCurrentEvent(run) : null;
  gameAudio.setScene(activeEvent?.surprise ? "surprise" : activeEvent?.category === "romance" ? "romance" : run.phase === "class_split_result" ? "surprise" : "daily");
  window.scrollTo({ top: 0, behavior: "auto" });
}

function startRun() {
  const current = ensureDraft();
  const nameInput = document.querySelector("#player-name");
  if (nameInput) current.name = nameInput.value.trim();
  if (!current.name) {
    showToast("请先给主角起一个名字。", "warning");
    return;
  }
  try {
    run = createInitialState({
      name: current.name,
      gender: current.gender,
      choices: current.choices,
      seed: current.profileSeed,
    });
    persist();
    showGame();
  } catch (error) {
    showToast(error.message || "身份创建失败，请重试。", "warning");
  }
}

function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "new-game") {
    draft = newDraft();
    showNewGame();
    return;
  }
  if (action === "continue") {
    run = loadRun();
    if (!run) {
      showToast("没有找到可继续的存档。", "warning");
      return showTitle();
    }
    showGame();
    return;
  }
  if (action === "title") return showTitle();
  if (action === "archive") return showArchive();
  if (action === "play-again") {
    draft = newDraft();
    return showNewGame();
  }
  if (action === "gender") {
    draft.gender = button.dataset.gender;
    return showNewGame();
  }
  if (action === "identity-option") {
    draft.choices[button.dataset.group] = button.dataset.option;
    refreshDraftProfile();
    return showNewGame();
  }
  if (action === "reroll") {
    if (!draft.rerollsLeft) return showToast("本次身份只能重掷一次。", "warning");
    draft.profileSeed = createRunSeed();
    draft.profile = rollRandomProfile(draft.profileSeed, draft.choices);
    draft.rerollsLeft -= 1;
    return showNewGame();
  }
  if (action === "start-run") return startRun();

  try {
    if (action === "meet-next") {
      advanceCastIntroduction(run);
      persist();
      return showGame();
    }
    if (action === "choose-split") {
      resolveClassSplit(run, button.dataset.choiceId);
      persist();
      return showGame();
    }
    if (action === "continue-split") {
      continueAfterClassSplit(run);
      persist();
      return showGame();
    }
    if (action === "start-semester") {
      startSemesterEvents(run);
      persist();
      return showGame();
    }
    if (action === "choose") {
      resolveChoice(run, button.dataset.choiceId);
      persist();
      return showGame();
    }
    if (action === "continue-outcome") {
      advanceAfterOutcome(run);
      persist();
      return showGame();
    }
    if (action === "advance-outro") {
      advanceFromOutro(run);
      persist();
      return showGame();
    }
    if (action === "final-intent") {
      const ending = resolveEnding(run, button.dataset.intent);
      const snapshot = {
        subtitle: renderText(ending.subtitle, run),
        text: ending.text.map((paragraph) => renderText(paragraph, run)),
        cast: run.cast.map((npc) => ({ ...npc, affinity: run.affinity[npc.id], className: run.classSplit?.assignments?.[npc.id] || "1班" })),
        classSplit: run.classSplit,
      };
      unlockEnding(ending.id, snapshot);
      clearRun();
      return showEnding(ending, ending.reason);
    }
  } catch (error) {
    showToast(error.message || "这一步无法继续，请重试。", "warning");
  }
}

app.addEventListener("click", handleClick);
app.addEventListener("input", (event) => {
  if (event.target.id === "player-name" && draft) draft.name = event.target.value;
});

const audioToggle = document.querySelector("#audio-toggle");
function syncAudioButton() {
  if (!audioToggle) return;
  audioToggle.textContent = gameAudio.isMuted() ? "音乐：关" : "音乐：开";
  audioToggle.classList.toggle("is-muted", gameAudio.isMuted());
}
audioToggle?.addEventListener("click", () => {
  gameAudio.init();
  gameAudio.toggle();
  syncAudioButton();
});
document.addEventListener("pointerdown", () => gameAudio.init(), { once: true });
syncAudioButton();

showTitle();





