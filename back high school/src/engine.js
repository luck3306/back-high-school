import {
  FAMILY_PROFILES,
  HIDDEN_TRAITS,
  CAST_IDS,
  CAST_NAME_POOLS,
  CAST_SLOTS,
  IDENTITY_GROUPS,
  NPC_PERSONALITIES,
  SEMESTERS,
  STAT_DEFS,
} from "./config.js";
import { ENDING_BY_ID, ENDINGS, EVENTS } from "./content/index.js";

const STAT_IDS = STAT_DEFS.map((stat) => stat.id);
const NPC_IDS = [...CAST_IDS];
const ALL_NPC_IDS = new Set(NPC_IDS);
const INTEREST_CATEGORY = { study: "study", sports: "club", arts: "romance" };

export const ENGINE_VERSION = 3;

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function normalizeSeed(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number >>> 0 : Date.now() >>> 0;
}

export function createRunSeed() {
  return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
}

export function randomAt(seed, cursor) {
  let z = (normalizeSeed(seed) + Math.imul(cursor + 1, 0x9e3779b9)) >>> 0;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
  z ^= z >>> 15;
  return { value: (z >>> 0) / 4294967296, cursor: cursor + 1 };
}

export function drawRandom(state) {
  const result = randomAt(state.seed, state.rngCursor || 0);
  state.rngCursor = result.cursor;
  return result.value;
}

export function pickWeighted(items, weightFor, randomValue) {
  if (!items.length) return null;
  const weighted = items.map((item) => ({
    item,
    weight: Math.max(0, Number(weightFor(item)) || 0),
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) return items[0];
  let threshold = Math.min(0.999999999, Math.max(0, randomValue)) * total;
  for (const entry of weighted) {
    threshold -= entry.weight;
    if (threshold < 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

function optionFor(groupId, optionId) {
  const group = IDENTITY_GROUPS.find((item) => item.id === groupId);
  return group?.options.find((item) => item.id === optionId) || null;
}

export function getIdentityOption(groupId, optionId) {
  return optionFor(groupId, optionId);
}

function addStats(target, source = {}) {
  for (const key of STAT_IDS) {
    target[key] = clamp((target[key] || 0) + (Number(source[key]) || 0));
  }
}

function addAffinity(target, source = {}) {
  for (const [npc, amount] of Object.entries(source)) {
    if (!ALL_NPC_IDS.has(npc)) continue;
    target[npc] = clamp((target[npc] || 0) + (Number(amount) || 0));
  }
}

function uniqueRandomName(gender, usedNames, draw) {
  const pool = CAST_NAME_POOLS[gender] || CAST_NAME_POOLS.female;
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const surname = pool.surnames[Math.floor(draw() * pool.surnames.length)];
    const given = pool.given[Math.floor(draw() * pool.given.length)];
    const name = surname + given;
    if (!usedNames.has(name)) {
      usedNames.add(name);
      return name;
    }
  }
  throw new Error("无法生成不重复的核心人物姓名");
}

export function generateCast(seed, cursor = 0) {
  const normalizedSeed = normalizeSeed(seed);
  let currentCursor = cursor;
  const draw = () => {
    const result = randomAt(normalizedSeed, currentCursor);
    currentCursor = result.cursor;
    return result.value;
  };
  const usedNames = new Set();
  const personalities = [...NPC_PERSONALITIES];
  const cast = CAST_SLOTS.map((slot) => {
    const name = uniqueRandomName(slot.gender, usedNames, draw);
    const identity = slot.identities[Math.floor(draw() * slot.identities.length)];
    const personality = personalities.splice(Math.floor(draw() * personalities.length), 1)[0];
    return {
      ...slot,
      name,
      identity,
      role: identity,
      initials: name.slice(-1),
      personalityId: personality.id,
      personalityLabel: personality.label,
      personalityDescription: personality.description,
      firstImpression: personality.firstImpression,
      introText: "第一次注意到" + name + "，是因为“" + identity + "”这个身份实在太显眼。" + personality.firstImpression + "后来你才发现，那只是对方最容易被看见的一面。",
    };
  });
  return { cast, nextCursor: currentCursor };
}
export function rollRandomProfile(seed, choices, cursor = 0) {
  const normalizedSeed = normalizeSeed(seed);
  let currentCursor = cursor;
  const draw = () => {
    const result = randomAt(normalizedSeed, currentCursor);
    currentCursor = result.cursor;
    return result.value;
  };

  const family = FAMILY_PROFILES[Math.floor(draw() * FAMILY_PROFILES.length)];
  const trait = HIDDEN_TRAITS[Math.floor(draw() * HIDDEN_TRAITS.length)];
  const castResult = generateCast(normalizedSeed, currentCursor);
  currentCursor = castResult.nextCursor;
  const cast = castResult.cast;
  const stats = { study: 35, stamina: 35, mood: 35 };
  const affinity = Object.fromEntries(CAST_IDS.map((npc) => [npc, 20 + Math.floor(draw() * 11)]));

  for (const group of IDENTITY_GROUPS) {
    const option = optionFor(group.id, choices[group.id]);
    if (!option) throw new Error("无效的身份选项：" + group.id + "/" + choices[group.id]);
    addStats(stats, option.stats);
    addAffinity(affinity, option.affinity);
  }
  addStats(stats, family.stats);
  addAffinity(affinity, family.affinity);

  if (trait.id === "sunny") stats.mood += 4;
  if (trait.id === "resilient") stats.stamina += 3;
  if (trait.id === "empathetic") addAffinity(affinity, Object.fromEntries(CAST_IDS.map((id) => [id, 2])));
  if (trait.id === "restless") stats.mood -= 2;
  for (const key of STAT_IDS) stats[key] = clamp(stats[key]);

  return {
    seed: normalizedSeed,
    nextCursor: currentCursor,
    familyId: family.id,
    traitId: trait.id,
    cast,
    stats,
    affinity,
  };
}
export function validateIdentity(choices) {
  for (const group of IDENTITY_GROUPS) {
    if (!optionFor(group.id, choices?.[group.id])) {
      throw new Error(`请选择${group.label}`);
    }
  }
  return true;
}

export function createInitialState({ name, gender = "unspecified", choices, seed = createRunSeed() }) {
  validateIdentity(choices);
  const normalizedSeed = normalizeSeed(seed);
  const profile = rollRandomProfile(normalizedSeed, choices);
  return {
    schemaVersion: ENGINE_VERSION,
    seed: normalizedSeed,
    rngCursor: profile.nextCursor,
    createdAt: new Date().toISOString(),
    status: "playing",
    phase: "cast_intro",
    castIntroIndex: 0,
    metNpcs: [],
    cast: profile.cast,
    classGroup: "1班",
    classSplit: null,
    semesterIndex: 0,
    eventQueue: [],
    eventIndex: 0,
    usedEventIds: [],
    currentOutcome: null,
    finalIntent: null,
    endingId: null,
    endingReason: null,
    completedAt: null,
    identity: {
      name: String(name || "无名同学").trim().slice(0, 12) || "无名同学",
      gender,
      choices: { ...choices },
      random: {
        familyId: profile.familyId,
        traitId: profile.traitId,
      },
    },
    stats: { ...profile.stats },
    affinity: { ...profile.affinity },
    flags: [`interest_${choices.interest}`, `family_${profile.familyId}`],
    history: [],
  };
}

export function conditionMet(condition, state) {
  if (!condition) return true;
  const choices = state.identity.choices;
  if (condition.family && state.identity.random.familyId !== condition.family) return false;
  if (condition.interest && choices.interest !== condition.interest) return false;
  if (condition.academic && choices.academic !== condition.academic) return false;
  if (condition.trait && state.identity.random.traitId !== condition.trait) return false;
  if (condition.minStudy != null && state.stats.study < condition.minStudy) return false;
  if (condition.minStamina != null && state.stats.stamina < condition.minStamina) return false;
  if (condition.minMood != null && state.stats.mood < condition.minMood) return false;
  if (condition.maxMood != null && state.stats.mood > condition.maxMood) return false;
  if (condition.minAffinity) {
    for (const [npc, minimum] of Object.entries(condition.minAffinity)) {
      if ((state.affinity[npc] || 0) < minimum) return false;
    }
  }
  if (condition.npcMinAffinity) {
    const { npc, min } = condition.npcMinAffinity;
    if ((state.affinity[npc] || 0) < min) return false;
  }
  if (condition.flags && !condition.flags.every((flag) => state.flags.includes(flag))) return false;
  if (condition.anyFlag && !condition.anyFlag.some((flag) => state.flags.includes(flag))) return false;
  if (condition.notFlags && condition.notFlags.some((flag) => state.flags.includes(flag))) return false;
  return true;
}

export function describeRequirement(condition, state) {
  if (!condition) return "";
  if (condition.npcMinAffinity) {
    const npc = getNpc(state, condition.npcMinAffinity.npc);
    return `需要与${npc?.name || "对方"}的羁绊达到 ${condition.npcMinAffinity.min}`;
  }
  if (condition.family) {
    const label = FAMILY_PROFILES.find((item) => item.id === condition.family)?.label;
    return label ? `需要家庭背景：${label}` : "当前家庭背景不可选";
  }
  if (condition.interest) {
    const label = optionFor("interest", condition.interest)?.label;
    return label ? `需要兴趣：${label}` : "当前身份不可选";
  }
  if (condition.academic) {
    const label = optionFor("academic", condition.academic)?.label;
    return label ? `需要学业起点：${label}` : "当前身份不可选";
  }
  if (condition.minStudy != null) return `需要学业不低于 ${condition.minStudy}`;
  return "当前条件不足";
}

export function getChoiceAvailability(state, choice) {
  return {
    available: conditionMet(choice.requires, state),
    reason: conditionMet(choice.requires, state) ? "" : describeRequirement(choice.requires, state),
  };
}

function eventWeight(event, state) {
  let weight = event.weight || 1;
  if (INTEREST_CATEGORY[state.identity.choices.interest] === event.category) weight += 2;
  if (event.npc && (state.affinity[event.npc] || 0) >= 42) weight += 2;
  if (event.families?.includes(state.identity.random.familyId)) weight += 7;
  if (event.surprise) weight += 3;
  return weight;
}

function getEligibleEvents(state, excludedIds = new Set(), excludedCategories = [], kind = "regular") {
  const categories = Array.isArray(excludedCategories)
    ? excludedCategories
    : excludedCategories ? [excludedCategories] : [];
  const splitTriggered = Boolean(state.classSplit?.triggered);
  return EVENTS.filter((event) => {
    if (excludedIds.has(event.id)) return false;
    if (kind === "surprise" && !event.surprise) return false;
    if (kind === "cross" && !event.crossCharacter) return false;
    if (kind === "relationship" && !event.relationship) return false;
    if (kind === "regular" && (event.surprise || event.crossCharacter || event.relationship)) return false;
    if (categories.includes(event.category)) return false;
    if (event.playerGenders?.length && state.identity.gender !== "unspecified" && !event.playerGenders.includes(state.identity.gender)) return false;
    if (event.families?.length && !event.families.includes(state.identity.random.familyId)) return false;
    if (event.classState === "split" && !splitTriggered) return false;
    if (event.classState === "same" && splitTriggered) return false;
    return event.chapters?.includes(state.semesterIndex + 1);
  });
}

export function selectSemesterEvents(state) {
  const used = new Set([...state.usedEventIds, ...(state.eventQueue || [])]);
  const selected = [];
  const categories = [];
  const familyId = state.identity.random.familyId;

  if ([0, 4].includes(state.semesterIndex)) {
    const familyPool = getEligibleEvents(state, used, [], "regular")
      .filter((event) => event.familyArc && event.families?.includes(familyId));
    if (familyPool.length) {
      const familyEvent = pickWeighted(familyPool, (event) => eventWeight(event, state), drawRandom(state));
      selected.push(familyEvent);
      used.add(familyEvent.id);
      categories.push(familyEvent.category);
    }
  }

  if ([0, 3].includes(state.semesterIndex) && selected.length < 2) {
    const genderPool = getEligibleEvents(state, used, [], "regular").filter((event) =>
      event.playerGenders?.includes(state.identity.gender)
    );
    if (genderPool.length) {
      const genderEvent = pickWeighted(genderPool, (event) => eventWeight(event, state), drawRandom(state));
      selected.push(genderEvent);
      used.add(genderEvent.id);
      categories.push(genderEvent.category);
    }
  }

  while (selected.length < 2) {
    let pool = getEligibleEvents(state, used, categories, "regular");
    if (!pool.length) pool = getEligibleEvents(state, used, [], "regular");
    if (!pool.length) throw new Error("第 " + (state.semesterIndex + 1) + " 学期常规事件不足");
    const event = pickWeighted(pool, (item) => eventWeight(item, state), drawRandom(state));
    selected.push(event);
    used.add(event.id);
    categories.push(event.category);
  }

  const topNpcIds = new Set(rankNpcsByAffinity(state).slice(0, 3).map((npc) => npc.id));
  let relationshipPool = getEligibleEvents(state, used, [], "relationship");
  const focusedRelationshipPool = relationshipPool.filter((event) => topNpcIds.has(event.npc));
  if (focusedRelationshipPool.length) relationshipPool = focusedRelationshipPool;
  if (!relationshipPool.length) throw new Error("第 " + (state.semesterIndex + 1) + " 学期关系主线不足");
  const relationship = pickWeighted(relationshipPool, (item) => eventWeight(item, state), drawRandom(state));
  selected.push(relationship);
  used.add(relationship.id);

  const crossPool = getEligibleEvents(state, used, [], "cross");
  if (crossPool.length) {
    const cross = pickWeighted(crossPool, (item) => eventWeight(item, state), drawRandom(state));
    selected.push(cross);
    used.add(cross.id);
  }

  const surprisePool = getEligibleEvents(state, used, [], "surprise");
  if (!surprisePool.length) throw new Error("第 " + (state.semesterIndex + 1) + " 学期突发事件不足");
  const surprise = pickWeighted(surprisePool, (item) => eventWeight(item, state), drawRandom(state));
  selected.push(surprise);
  return selected.map((event) => event.id);
}

export function startSemesterEvents(state) {
  if (state.phase !== "intro") return state;
  state.eventQueue = selectSemesterEvents(state);
  state.usedEventIds.push(...state.eventQueue);
  state.eventIndex = 0;
  state.phase = "event";
  state.currentOutcome = null;
  return state;
}

export function getCurrentEvent(state) {
  const eventId = state.eventQueue[state.eventIndex];
  return EVENTS.find((event) => event.id === eventId) || null;
}

export function getCurrentSemester(state) {
  return SEMESTERS[state.semesterIndex] || null;
}

export function outcomeWeight(outcomeRule, state) {
  let weight = Math.max(0, outcomeRule.weight ?? 100);
  for (const modifier of outcomeRule.modifiers || []) {
    if (conditionMet(modifier.when, state)) weight += modifier.weight;
  }
  return Math.max(0.01, weight);
}

function applyTraitModifiers(state, effects) {
  const trait = state.identity.random.traitId;
  const stats = { ...(effects.stats || {}) };
  const affinity = { ...(effects.affinity || {}) };
  if (trait === "photographic" && (stats.study || 0) > 0) stats.study += 2;
  if (trait === "resilient" && (stats.stamina || 0) < 0) stats.stamina = Math.min(0, stats.stamina + 2);
  if (trait === "sunny" && (stats.mood || 0) < 0) stats.mood = Math.min(0, stats.mood + 2);
  if (trait === "calm" && (stats.mood || 0) < 0) stats.mood = Math.min(0, stats.mood + 1);
  if (trait === "empathetic") {
    for (const key of Object.keys(affinity)) {
      if (affinity[key] > 0) affinity[key] += 2;
    }
  }
  return { stats, affinity };
}

function applyEffects(state, effects = {}) {
  const before = {
    stats: { ...state.stats },
    affinity: { ...state.affinity },
    flags: [...state.flags],
  };
  const adjusted = applyTraitModifiers(state, effects);
  addStats(state.stats, adjusted.stats);
  addAffinity(state.affinity, adjusted.affinity);
  for (const flag of effects.flags || []) {
    if (!state.flags.includes(flag)) state.flags.push(flag);
  }
  if (effects.clearFlags?.length) {
    state.flags = state.flags.filter((flag) => !effects.clearFlags.includes(flag));
  }
  return {
    stats: Object.fromEntries(STAT_IDS.map((key) => [key, state.stats[key] - before.stats[key]])),
    affinity: Object.fromEntries(NPC_IDS.map((key) => [key, state.affinity[key] - before.affinity[key]])),
    flagsAdded: state.flags.filter((flag) => !before.flags.includes(flag)),
    flagsRemoved: before.flags.filter((flag) => !state.flags.includes(flag)),
  };
}

export function resolveChoice(state, choiceId) {
  if (state.phase !== "event") throw new Error("当前不在事件选择阶段");
  const event = getCurrentEvent(state);
  if (!event) throw new Error("当前事件不存在");
  const choice = event.choices.find((item) => item.id === choiceId);
  if (!choice) throw new Error("选择不存在");
  if (!conditionMet(choice.requires, state)) throw new Error(describeRequirement(choice.requires, state));
  const selectedOutcome = pickWeighted(
    choice.outcomes,
    (rule) => outcomeWeight(rule, state),
    drawRandom(state),
  );
  const summary = applyEffects(state, selectedOutcome.effects);

  const outcomeText = genderedText(selectedOutcome.textByGender, state.identity.gender, selectedOutcome.text);
  state.history.push({
    semesterIndex: state.semesterIndex,
    eventId: event.id,
    eventTitle: event.title,
    category: event.category,
    npcId: event.npc || null,
    surprise: Boolean(event.surprise),
    crossCharacter: Boolean(event.crossCharacter),
    relationship: Boolean(event.relationship),
    choiceId: choice.id,
    outcomeId: selectedOutcome.id,
    outcomeText,
  });
  state.currentOutcome = {
    eventId: event.id,
    eventTitle: event.title,
    category: event.category,
    npcId: event.npc || null,
    surprise: Boolean(event.surprise),
    crossCharacter: Boolean(event.crossCharacter),
    relationship: Boolean(event.relationship),
    choiceId: choice.id,
    outcomeId: selectedOutcome.id,
    text: outcomeText,
    summary,
  };
  state.phase = "outcome";
  return { event, choice, outcome: selectedOutcome, summary };
}

export function advanceAfterOutcome(state) {
  if (state.phase !== "outcome") return state;
  if (state.eventIndex + 1 < state.eventQueue.length) {
    state.eventIndex += 1;
    state.phase = "event";
    state.currentOutcome = null;
  } else {
    state.phase = "outro";
    state.currentOutcome = null;
  }
  return state;
}

export const CLASS_SPLIT_CHOICES = [
  { id: "stay", label: "争取留在原班", description: "主动找老师沟通，希望能和熟悉的人继续同班。", chance: 0.35 },
  { id: "natural", label: "顺其自然", description: "接受学校安排，不额外争取。", chance: 0.55 },
  { id: "change", label: "主动申请换个环境", description: "想认识新的人，也想看看不同的班级生活。", chance: 0.8 },
];

export function currentCastIntroduction(state) {
  if (state.phase !== "cast_intro") return null;
  return state.cast[state.castIntroIndex] || null;
}

export function advanceCastIntroduction(state) {
  if (state.phase !== "cast_intro") return state;
  const npc = state.cast[state.castIntroIndex];
  if (npc && !state.metNpcs.includes(npc.id)) state.metNpcs.push(npc.id);
  state.castIntroIndex += 1;
  if (state.castIntroIndex >= state.cast.length) state.phase = "intro";
  return state;
}

export function resolveClassSplit(state, choiceId) {
  if (state.phase !== "class_split_choice") throw new Error("当前不在分班选择阶段");
  const option = CLASS_SPLIT_CHOICES.find((item) => item.id === choiceId);
  if (!option) throw new Error("分班选择不存在");
  const familyBonus = state.identity.random.familyId === "strict" ? 0.1 : 0;
  const chance = Math.max(0.1, Math.min(0.95, option.chance + familyBonus));
  const triggered = drawRandom(state) < chance;
  const classes = ["1班", "2班", "3班"];
  const playerClass = classes[Math.floor(drawRandom(state) * classes.length)];
  const assignments = {};
  const shuffled = [...CAST_IDS];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(drawRandom(state) * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  const sameClassCount = triggered ? 1 + Math.floor(drawRandom(state) * 2) : shuffled.length;
  const sameClassIds = shuffled.slice(0, sameClassCount);
  const differentClassIds = shuffled.slice(sameClassCount);
  for (const id of shuffled) assignments[id] = triggered ? "其他班" : playerClass;
  for (const id of sameClassIds) assignments[id] = playerClass;
  for (const id of differentClassIds) {
    const otherClasses = classes.filter((item) => item !== playerClass);
    assignments[id] = otherClasses[Math.floor(drawRandom(state) * otherClasses.length)];
  }
  state.classSplit = {
    triggered,
    chance,
    choiceId,
    playerClass,
    assignments,
    sameClassIds,
    differentClassIds,
  };
  state.classGroup = triggered ? playerClass : "1班";
  state.phase = "class_split_result";
  return state.classSplit;
}

export function continueAfterClassSplit(state) {
  if (state.phase !== "class_split_result") return state;
  state.semesterIndex = 2;
  state.eventQueue = [];
  state.eventIndex = 0;
  state.phase = "intro";
  return state;
}

export function advanceFromOutro(state) {
  if (state.phase !== "outro") return state;
  if (state.semesterIndex === 1 && !state.classSplit) {
    state.phase = "class_split_choice";
    return state;
  }
  if (state.semesterIndex >= SEMESTERS.length - 1) {
    state.phase = "final";
  } else {
    state.semesterIndex += 1;
    state.eventQueue = [];
    state.eventIndex = 0;
    state.phase = "intro";
  }
  return state;
}

export function rankNpcsByAffinity(state) {
  return [...state.cast].sort((a, b) => (state.affinity[b.id] || 0) - (state.affinity[a.id] || 0));
}

function bestNpc(state) {
  const npc = rankNpcsByAffinity(state)[0];
  return npc ? { id: npc.id, value: state.affinity[npc.id] || 0 } : null;
}

function dominantStat(state) {
  return [...STAT_DEFS].sort((a, b) => {
    const diff = (state.stats[b.id] || 0) - (state.stats[a.id] || 0);
    if (diff !== 0) return diff;
    const preferred = INTEREST_CATEGORY[state.identity.choices.interest];
    const map = { study: "study", sports: "stamina", arts: "mood" };
    if (map[preferred] === a.id) return -1;
    if (map[preferred] === b.id) return 1;
    return 0;
  })[0].id;
}

function growthEnding(state) {
  const stat = dominantStat(state);
  if (stat === "study") return "growth_study";
  if (stat === "stamina") return "growth_sports";
  return "growth_arts";
}

function friendshipEnding(npcId) {
  return npcId ? `friend_${npcId}` : "ensemble_letter";
}

function balancedFriends(state) {
  const values = NPC_IDS.map((npc) => state.affinity[npc] || 0);
  return Math.max(...values) - Math.min(...values) <= 14;
}
const HIGHLIGHT_FLAGS = [
  { flag: "exam_top", label: "月考登顶" },
  { flag: "contest_winner", label: "竞赛逆袭" },
  { flag: "stage_spotlight", label: "舞台中心" },
  { flag: "sports_hero", label: "终场翻盘" },
  { flag: "public_praise", label: "全校瞩目" },
  { flag: "campus_legend", label: "校园传奇" },
  { flag: "romance_public", label: "被公开祝福的心动" },
];

export function getHighlights(state) {
  return HIGHLIGHT_FLAGS.filter((item) => state.flags.includes(item.flag)).map((item) => item.label);
}

function spotlightEnding(state, intentId) {
  if (intentId === "confess") return null;
  const allStrong = STAT_IDS.every((key) => state.stats[key] >= 68);
  if (allStrong && state.flags.includes("campus_legend")) return "spotlight_legend";
  if (state.stats.study >= 82 && state.flags.some((flag) => ["exam_top", "contest_winner"].includes(flag))) return "spotlight_top_student";
  if (state.stats.stamina >= 82 && state.flags.some((flag) => ["sports_hero", "team_goal"].includes(flag))) return "spotlight_champion";
  if (state.stats.mood >= 82 && state.flags.some((flag) => ["stage_spotlight", "public_praise"].includes(flag))) return "spotlight_stage";
  return null;
}
export function resolveEnding(state, intentId) {
  if (state.phase !== "final") throw new Error("当前还不能结算结局");
  const top = bestNpc(state);
  let endingId = "ensemble_letter";
  let reason = "";
  const spotlight = spotlightEnding(state, intentId);

  if (spotlight) {
    endingId = spotlight;
    reason = "你那三年最亮的一次证明，没有被毕业带走。";
  } else if (intentId === "confess") {
    const calmBonus = state.identity.random.traitId === "calm" ? 0.08 : 0;
    const restlessPenalty = state.identity.random.traitId === "restless" ? 0.05 : 0;
    const chance = Math.min(0.94, Math.max(0.36, 0.52 + (top.value - 45) * 0.01 + calmBonus - restlessPenalty));
    const hasRomanceSignal = state.flags.includes(`romance_${top.id}`);
    const eligible = top.value >= 45 && (hasRomanceSignal || top.value >= 62);
    if (eligible && drawRandom(state) <= chance) {
      endingId = `romance_${top.id}`;
      reason = `你把最想说出口的话，留给了${getNpc(state, top.id)?.name || "那个人"}。`;
    } else if (top.value >= 48) {
      endingId = friendshipEnding(top.id);
      reason = "那句话最终没有变成告白，但你们都没有失去彼此。";
    } else {
      endingId = "ensemble_letter";
      reason = "有些心意没能在毕业前抵达，但它仍然属于这三年。";
    }
  } else if (intentId === "together") {
    const sharedFlags = ["club_pride", "team_goal", "group_project"].filter((flag) => state.flags.includes(flag));
    if (sharedFlags.length && top.value >= 45) {
      endingId = friendshipEnding(top.id);
      reason = "你们把最后一段时间交给了同一件事，也把彼此留在了结果里。";
    } else if (sharedFlags.length) {
      endingId = "ensemble_club";
      reason = "社团的灯最后熄灭，但你们共同完成的东西留了下来。";
    } else if (top.value >= 55) {
      endingId = friendshipEnding(top.id);
      reason = "即使没有共同的比赛，你们也已经成为彼此可靠的队友。";
    } else {
      endingId = "ensemble_letter";
      reason = "毕业把大家带向不同方向，有些约定停留在了原地。";
    }
  } else if (intentId === "future") {
    endingId = growthEnding(state);
    reason = "你没有急着给谁答案，而是先走向了自己想去的方向。";
  } else {
    throw new Error("最终选择不存在");
  }

  if (endingId.startsWith("ensemble_") && state.classSplit?.triggered && state.flags.includes("promise_reunion")) {
    endingId = "ensemble_reunion";
    reason = "分班没有把你们真正分开，毕业前五个人又重新坐在了一起。";
  } else if (endingId.startsWith("ensemble_") && state.classSplit?.triggered && state.flags.includes("new_class_bond")) {
    endingId = "ensemble_newclass";
    reason = "你既没有丢掉原来的朋友，也真正走进了新的班级。";
  } else if (intentId !== "future" && balancedFriends(state) && state.stats.mood >= 58 && !endingId.startsWith("romance_") && !endingId.startsWith("spotlight_")) {
    endingId = "ensemble_class";
    reason = "你们没有成为某个人的唯一，却一起把普通的日子过成了值得记住的青春。";
  }

  state.finalIntent = intentId;
  state.endingId = endingId;
  state.endingReason = reason;
  state.phase = "ending";
  state.status = "completed";
  state.completedAt = new Date().toISOString();
  return { ...ENDING_BY_ID[endingId], reason };
}

export function genderedText(value, gender, fallback = "") {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return fallback;
  return value[gender] || value.unspecified || fallback;
}

export function renderText(text, state, contextNpcId = null) {
  let output = String(text || "").replaceAll("{name}", state.identity.name);
  for (const npc of state.cast || []) {
    output = output
      .replaceAll(`{${npc.id}.name}`, npc.name)
      .replaceAll(`{${npc.id}.pronoun}`, npc.pronoun)
      .replaceAll(`{${npc.id}.identity}`, npc.identity)
      .replaceAll(`{${npc.id}.gender}`, npc.genderLabel)
      .replaceAll(`{${npc.id}.personality}`, npc.personalityLabel);
  }
  const contextNpc = getNpc(state, contextNpcId);
  if (contextNpc) {
    output = output
      .replaceAll("{npc.name}", contextNpc.name)
      .replaceAll("{npc.pronoun}", contextNpc.pronoun)
      .replaceAll("{npc.identity}", contextNpc.identity)
      .replaceAll("{npc.gender}", contextNpc.genderLabel)
      .replaceAll("{npc.personality}", contextNpc.personalityLabel);
  }
  return output;
}

export function getNpc(state, npcId) {
  return state?.cast?.find((npc) => npc.id === npcId) || null;
}

export function getEnding(endingId) {
  return ENDING_BY_ID[endingId] || null;
}

export function getFamily(familyId) {
  return FAMILY_PROFILES.find((family) => family.id === familyId) || null;
}

export function getTrait(traitId) {
  return HIDDEN_TRAITS.find((trait) => trait.id === traitId) || null;
}

export function getEndingRank(state) {
  const ordered = [
    ...ENDINGS.filter((ending) => ending.category === "romance"),
    ...ENDINGS.filter((ending) => ending.category === "friendship"),
    ...ENDINGS.filter((ending) => ending.category === "growth"),
    ...ENDINGS.filter((ending) => ending.category === "ensemble"),
    ...ENDINGS.filter((ending) => ending.category === "spotlight"),
  ];
  return ordered.findIndex((ending) => ending.id === state.endingId);
}

export function validateContent() {
  const errors = [];
  const warnings = [];
  const eventIds = new Set();
  const categoryCount = {};
  const endingIds = new Set();
  const endingCategories = {};
  let regularCount = 0;
  let surpriseCount = 0;
  let familyArcCount = 0;
  let relationshipCount = 0;
  let crossCount = 0;

  for (const event of EVENTS) {
    if (eventIds.has(event.id)) errors.push(`重复事件 ID：${event.id}`);
    eventIds.add(event.id);
    categoryCount[event.category] = (categoryCount[event.category] || 0) + 1;
    if (event.surprise) surpriseCount += 1;
    if (event.crossCharacter) crossCount += 1;
    if (event.relationship) relationshipCount += 1;
    if (!event.surprise && !event.crossCharacter && !event.relationship) regularCount += 1;
    if (event.familyArc) familyArcCount += 1;
    if (event.familyArc && !event.families?.length) errors.push(`家庭专属事件 ${event.id} 缺少家庭限制`);
    if (!event.title || !event.text) errors.push(`事件 ${event.id} 缺少标题或正文`);
    if (!Array.isArray(event.chapters) || !event.chapters.length) errors.push(`事件 ${event.id} 缺少章节范围`);
    if (event.chapters?.some((chapter) => chapter < 1 || chapter > 6)) errors.push(`事件 ${event.id} 章节越界`);
    if (!Array.isArray(event.choices) || event.choices.length < 3) errors.push(`事件 ${event.id} 至少需要三个选择`);
    const choiceIds = new Set();
    for (const choice of event.choices || []) {
      if (choiceIds.has(choice.id)) errors.push(`事件 ${event.id} 存在重复选择 ID：${choice.id}`);
      choiceIds.add(choice.id);
      if (!choice.outcomes?.length) errors.push(`选择 ${event.id}/${choice.id} 没有结果`);
      for (const rule of choice.outcomes || []) {
        if (!rule.text) errors.push(`结果 ${event.id}/${choice.id}/${rule.id} 缺少正文`);
        if ((rule.weight ?? 100) <= 0) errors.push(`结果 ${event.id}/${choice.id}/${rule.id} 权重无效`);
      }
    }
  }

  for (let chapter = 1; chapter <= 6; chapter += 1) {
    const regular = EVENTS.filter((event) => !event.surprise && !event.crossCharacter && !event.relationship && event.chapters?.includes(chapter)).length;
    const surprise = EVENTS.filter((event) => event.surprise && event.chapters?.includes(chapter)).length;
    const relationship = EVENTS.filter((event) => event.relationship && event.chapters?.includes(chapter)).length;
    const cross = EVENTS.filter((event) => event.crossCharacter && event.chapters?.includes(chapter)).length;
    if (regular < 2) errors.push(`第 ${chapter} 学期常规事件不足 2 个`);
    if (surprise < 1) errors.push(`第 ${chapter} 学期缺少突发事件`);
    if (relationship < 1) errors.push(`第 ${chapter} 学期缺少关系主线`);
    if (cross < 1) errors.push(`第 ${chapter} 学期缺少交叉关系事件`);
  }

  for (const family of FAMILY_PROFILES) {
    const earlyArc = EVENTS.some((event) => event.familyArc && event.families?.includes(family.id) && event.chapters?.some((chapter) => chapter <= 3));
    const lateArc = EVENTS.some((event) => event.familyArc && event.families?.includes(family.id) && event.chapters?.some((chapter) => chapter >= 4));
    if (!earlyArc || !lateArc) errors.push(`家庭背景 ${family.label} 缺少完整专属剧情`);
  }

  for (const category of ["study", "romance", "club", "friendship", "family", "chance"]) {
    if ((categoryCount[category] || 0) < 8) warnings.push(`分类 ${category} 事件少于 8 个`);
  }

  for (const ending of ENDINGS) {
    if (endingIds.has(ending.id)) errors.push(`重复结局 ID：${ending.id}`);
    endingIds.add(ending.id);
    endingCategories[ending.category] = (endingCategories[ending.category] || 0) + 1;
    if (!ending.title || !ending.hint || !ending.text?.length) errors.push(`结局 ${ending.id} 内容不完整`);
  }
  for (const category of ["romance", "friendship", "growth", "ensemble", "spotlight"]) {
    if ((endingCategories[category] || 0) < 1) errors.push(`结局分类 ${category} 缺失`);
  }

  return {
    errors,
    warnings,
    stats: {
      events: EVENTS.length,
      regularEvents: regularCount,
      surpriseEvents: surpriseCount,
      relationshipEvents: relationshipCount,
      crossEvents: crossCount,
      familyArcEvents: familyArcCount,
      endings: ENDINGS.length,
      categories: categoryCount,
      endingCategories,
    },
  };
}
