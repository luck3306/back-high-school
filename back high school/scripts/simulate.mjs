import {
  advanceAfterOutcome,
  advanceCastIntroduction,
  advanceFromOutro,
  continueAfterClassSplit,
  createInitialState,
  getChoiceAvailability,
  getCurrentEvent,
  randomAt,
  resolveChoice,
  resolveClassSplit,
  resolveEnding,
  startSemesterEvents,
} from "../src/engine.js";

const RUNS = 10_000;
const intents = ["confess", "together", "future"];
const choices = { academic: "steady", interest: "study" };
const endings = {};
const splitChoices = ["stay", "natural", "change"];
let splitRuns = 0;
let failures = 0;
const startedAt = performance.now();

for (let runIndex = 0; runIndex < RUNS; runIndex += 1) {
  const seed = 10_000 + runIndex;
  try {
    const state = createInitialState({ name: "模拟同学", choices, seed });
    let steps = 0;
    while (state.phase !== "final" && state.phase !== "ending" && steps < 220) {
      steps += 1;
      if (state.phase === "cast_intro") {
        advanceCastIntroduction(state);
      } else if (state.phase === "intro") {
        startSemesterEvents(state);
      } else if (state.phase === "event") {
        const event = getCurrentEvent(state);
        const available = event.choices.filter((choice) => getChoiceAvailability(state, choice).available);
        if (!available.length) throw new Error(`事件 ${event.id} 无可用选择`);
        const random = randomAt(seed, 900_000 + steps).value;
        resolveChoice(state, available[Math.floor(random * available.length)].id);
      } else if (state.phase === "outcome") {
        advanceAfterOutcome(state);
      } else if (state.phase === "outro") {
        advanceFromOutro(state);
      } else if (state.phase === "class_split_choice") {
        resolveClassSplit(state, splitChoices[runIndex % splitChoices.length]);
      } else if (state.phase === "class_split_result") {
        continueAfterClassSplit(state);
      } else {
        throw new Error(`未知阶段 ${state.phase}`);
      }
    }
    if (state.phase !== "final") throw new Error("未抵达毕业阶段");
    if (state.classSplit?.triggered) splitRuns += 1;
    const ending = resolveEnding(state, intents[runIndex % intents.length]);
    endings[ending.id] = (endings[ending.id] || 0) + 1;
  } catch (error) {
    failures += 1;
    if (failures <= 5) console.error(`模拟 ${runIndex} 失败：${error.message}`);
  }
}

const elapsed = Math.round(performance.now() - startedAt);
console.log(`完成 ${RUNS} 次自动游玩，用时 ${elapsed} ms。`);
console.log(`分班触发：${splitRuns}/${RUNS}`);
console.log(`结局分布：${JSON.stringify(endings, null, 2)}`);
if (failures) {
  console.error(`失败 ${failures} 次。`);
  process.exitCode = 1;
} else {
  console.log("全部周目均可正常完成。");
}
