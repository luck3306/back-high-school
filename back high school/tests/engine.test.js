import test from "node:test";
import assert from "node:assert/strict";
import { CAST_IDS } from "../src/config.js";
import {
  advanceAfterOutcome,
  advanceCastIntroduction,
  advanceFromOutro,
  continueAfterClassSplit,
  createInitialState,
  genderedText,
  getChoiceAvailability,
  getCurrentEvent,
  randomAt,
  renderText,
  resolveChoice,
  resolveClassSplit,
  resolveEnding,
  rollRandomProfile,
  startSemesterEvents,
  validateContent,
} from "../src/engine.js";
import { ENDINGS, EVENTS } from "../src/content/index.js";
import { clearArchive, clearRun, loadArchive, loadRun, saveRun, unlockEnding } from "../src/storage.js";

const CHOICES = { academic: "steady", interest: "study" };

function makeState(seed = 12345, overrides = {}) {
  return Object.assign(createInitialState({ name: "测试同学", gender: "female", choices: CHOICES, seed }), overrides);
}

function makeFinal({ affinity = {}, stats = {}, flags = [], classSplit = null } = {}) {
  return makeState(24680, {
    phase: "final",
    affinity: Object.fromEntries(CAST_IDS.map((id) => [id, affinity[id] ?? 20])),
    stats: { study: 45, stamina: 45, mood: 45, ...stats },
    flags: ["interest_study", ...flags],
    classSplit,
  });
}

function enterGame(state) {
  let guard = 0;
  while (state.phase === "cast_intro" && guard < 20) {
    advanceCastIntroduction(state);
    guard += 1;
  }
  assert.equal(state.phase, "intro");
  assert.equal(state.metNpcs.length, 5);
}

function completeRun(seed, splitChoice = "natural", gender = "female") {
  const state = createInitialState({ name: "自动同学", gender, choices: CHOICES, seed });
  enterGame(state);
  let steps = 0;
  while (state.phase !== "final" && steps < 240) {
    steps += 1;
    if (state.phase === "intro") {
      startSemesterEvents(state);
    } else if (state.phase === "event") {
      const event = getCurrentEvent(state);
      const choice = event.choices.find((item) => getChoiceAvailability(state, item).available);
      assert.ok(choice, `${event.id} 没有可用选择`);
      resolveChoice(state, choice.id);
    } else if (state.phase === "outcome") {
      advanceAfterOutcome(state);
    } else if (state.phase === "outro") {
      advanceFromOutro(state);
    } else if (state.phase === "class_split_choice") {
      resolveClassSplit(state, splitChoice);
    } else if (state.phase === "class_split_result") {
      continueAfterClassSplit(state);
    } else {
      assert.fail(`意外阶段：${state.phase}`);
    }
  }
  assert.equal(state.phase, "final");
  return state;
}

test("剧情数据包含 115 个事件和 22 个结局，所有事件至少三个选择", () => {
  const report = validateContent();
  assert.deepEqual(report.errors, []);
  assert.equal(report.stats.events, 115);
  assert.equal(report.stats.endings, 22);
  assert.equal(report.stats.relationshipEvents, 15);
  assert.equal(report.stats.crossEvents, 10);
  assert.equal(report.stats.surpriseEvents, 12);
  assert.equal(report.stats.familyArcEvents, 8);
  assert.deepEqual(report.stats.endingCategories, { romance: 5, friendship: 5, growth: 3, ensemble: 5, spotlight: 4 });
  for (const event of EVENTS) assert.ok(event.choices.length >= 3, `${event.id} 选择不足三个`);
});

test("随机数在同一 seed 与游标下可复现", () => {
  const a = Array.from({ length: 12 }, (_, cursor) => randomAt(9988, cursor).value);
  const b = Array.from({ length: 12 }, (_, cursor) => randomAt(9988, cursor).value);
  const c = Array.from({ length: 12 }, (_, cursor) => randomAt(9989, cursor).value);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
});

test("每局生成不重复的五个姓名、身份和性格", () => {
  const a = rollRandomProfile(777, CHOICES);
  const b = rollRandomProfile(777, CHOICES);
  const c = rollRandomProfile(778, CHOICES);
  assert.deepEqual(a.cast, b.cast);
  assert.notDeepEqual(a.cast, c.cast);
  assert.equal(a.cast.length, 5);
  assert.equal(new Set(a.cast.map((npc) => npc.name)).size, 5);
  assert.equal(new Set(a.cast.map((npc) => npc.personalityId)).size, 5);
  assert.equal(new Set(a.cast.map((npc) => npc.identity)).size, 5);
  assert.deepEqual(a.cast.map((npc) => npc.id), CAST_IDS);
});

test("每学期包含两段常规、一段关系主线、一段交叉关系和一次突发事件", () => {
  const state = makeState();
  enterGame(state);
  const selected = new Set();
  for (let semester = 1; semester <= 6; semester += 1) {
    state.phase = "intro";
    state.eventQueue = [];
    state.eventIndex = 0;
    state.semesterIndex = semester - 1;
    startSemesterEvents(state);
    assert.equal(state.eventQueue.length, 5);
    assert.equal(new Set(state.eventQueue).size, 5);
    const eventObjects = state.eventQueue.map((id) => EVENTS.find((event) => event.id === id));
    assert.equal(eventObjects.filter((event) => event.relationship).length, 1);
    assert.equal(eventObjects.filter((event) => event.crossCharacter).length, 1);
    assert.equal(eventObjects.filter((event) => event.surprise).length, 1);
    assert.equal(eventObjects.filter((event) => !event.relationship && !event.crossCharacter && !event.surprise).length, 2);
    for (const event of eventObjects) {
      assert.ok(!selected.has(event.id), `事件重复：${event.id}`);
      selected.add(event.id);
      assert.ok(event.chapters.includes(semester));
    }
  }
});

test("完整周目包含五人初见、30 个事件、概率分班与最终结局", () => {
  const state = completeRun(4321, "change");
  assert.equal(state.history.length, 30);
  assert.equal(new Set(state.history.map((item) => item.eventId)).size, 30);
  assert.equal(state.history.filter((item) => item.eventId.startsWith("gender_female_")).length, 2);
  assert.ok(state.classSplit);
  if (state.classSplit.triggered) {
    assert.ok(state.classSplit.sameClassIds.length >= 1 && state.classSplit.sameClassIds.length <= 2);
    assert.ok(state.classSplit.differentClassIds.length >= 3);
  }
  const ending = resolveEnding(state, "future");
  assert.ok(ENDINGS.some((item) => item.id === ending.id));
});

test("分班概率会产生不同结果，触发时保证同班和跨班人数", () => {
  const outcomes = new Set();
  for (const splitChoice of ["stay", "natural", "change"]) {
    for (let seed = 1; seed <= 40; seed += 1) {
      const state = makeState(seed, { phase: "class_split_choice", semesterIndex: 1 });
      const result = resolveClassSplit(state, splitChoice);
      outcomes.add(result.triggered);
      assert.ok(result.chance >= 0.1 && result.chance <= 0.95);
      assert.ok(result.playerClass);
      assert.equal(Object.keys(result.assignments).length, 5);
      if (result.triggered) {
        assert.ok(result.sameClassIds.length >= 1 && result.sameClassIds.length <= 2);
        assert.ok(result.differentClassIds.length >= 3);
        for (const id of result.sameClassIds) assert.equal(result.assignments[id], result.playerClass);
      } else {
        assert.equal(result.sameClassIds.length, 5);
        assert.equal(result.differentClassIds.length, 0);
      }
    }
  }
  assert.deepEqual(outcomes, new Set([true, false]));
});

test("男女主使用不同文本，动态姓名和身份会正确替换", () => {
  const male = makeState(999, { identity: { ...makeState(999).identity, gender: "male" } });
  const female = makeState(999, { identity: { ...makeState(999).identity, gender: "female" } });
  const event = EVENTS.find((item) => item.id === "romance_extra_arts_darkroom");
  assert.notEqual(genderedText(event.textByGender, "male"), genderedText(event.textByGender, "female"));
  const rendered = renderText("{arts.name}是{arts.identity}，{arts.pronoun}的性格是{arts.personality}。{npc.name}", male, "arts");
  assert.ok(!rendered.includes("{"));
  assert.ok(rendered.includes(male.cast.find((npc) => npc.id === "arts").name));
  assert.ok(rendered.includes(male.cast.find((npc) => npc.id === "arts").identity));
});

test("22 个结局全部可以到达", () => {
  const reached = new Set();
  for (const npc of CAST_IDS) {
    for (let seed = 1; seed < 100; seed += 1) {
      const state = makeFinal({
        affinity: { [npc]: 90, ...Object.fromEntries(CAST_IDS.filter((id) => id !== npc).map((id) => [id, 10])) },
        flags: [`romance_${npc}`],
      });
      state.seed = seed;
      const ending = resolveEnding(state, "confess");
      if (ending.id === `romance_${npc}`) {
        reached.add(ending.id);
        break;
      }
    }
    reached.add(resolveEnding(makeFinal({ affinity: { [npc]: 90 } }), "together").id);
  }
  for (const [stat, endingId] of [["study", "growth_study"], ["stamina", "growth_sports"], ["mood", "growth_arts"]]) {
    reached.add(resolveEnding(makeFinal({ stats: { [stat]: 90 } }), "future").id);
  }
  reached.add(resolveEnding(makeFinal({ affinity: Object.fromEntries(CAST_IDS.map((id) => [id, 50])), stats: { mood: 70 } }), "together").id);
  reached.add(resolveEnding(makeFinal({ affinity: { arts: 20, academic: 42, sports: 10, leadership: 20, music: 15 }, stats: { mood: 70 }, flags: ["club_pride"] }), "together").id);
  reached.add(resolveEnding(makeFinal({ affinity: { arts: 20, academic: 40, sports: 10, leadership: 20, music: 15 }, stats: { mood: 20 } }), "together").id);
  const splitBase = { triggered: true, sameClassIds: ["arts", "academic"], differentClassIds: ["sports", "leadership", "music"], assignments: { arts: "1班", academic: "1班", sports: "2班", leadership: "3班", music: "2班" }, playerClass: "1班" };
  reached.add(resolveEnding(makeFinal({ affinity: Object.fromEntries(CAST_IDS.map((id) => [id, 50])), stats: { mood: 70 }, flags: ["promise_reunion"], classSplit: splitBase }), "together").id);
  reached.add(resolveEnding(makeFinal({ affinity: Object.fromEntries(CAST_IDS.map((id) => [id, 50])), stats: { mood: 70 }, flags: ["new_class_bond"], classSplit: splitBase }), "together").id);
  for (const config of [
    { stats: { study: 90, stamina: 45, mood: 45 }, flags: ["contest_winner"] },
    { stats: { study: 45, stamina: 90, mood: 45 }, flags: ["sports_hero"] },
    { stats: { study: 45, stamina: 45, mood: 90 }, flags: ["stage_spotlight"] },
    { stats: { study: 80, stamina: 80, mood: 80 }, flags: ["campus_legend"] },
  ]) reached.add(resolveEnding(makeFinal(config), "future").id);
  assert.deepEqual([...reached].sort(), ENDINGS.map((ending) => ending.id).sort());
});

test("本地存档与结局图鉴可以写入并读回", () => {
  clearRun();
  clearArchive();
  const state = makeState();
  assert.equal(saveRun(state), true);
  const loaded = loadRun();
  assert.equal(loaded.seed, state.seed);
  assert.equal(loaded.cast.length, 5);
  unlockEnding("growth_study", { subtitle: "测试", text: ["结局正文"], cast: state.cast });
  assert.ok(loadArchive().growth_study);
  clearRun();
  clearArchive();
});
