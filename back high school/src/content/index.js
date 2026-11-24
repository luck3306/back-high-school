import { EVENTS as STUDY_EVENTS } from "./events/study.js";
import { EVENTS as ROMANCE_EVENTS } from "./events/romance.js";
import { EVENTS as CLUB_EVENTS } from "./events/club.js";
import { EVENTS as FRIENDSHIP_EVENTS } from "./events/friendship.js";
import { EVENTS as FAMILY_EVENTS } from "./events/family.js";
import { EVENTS as CHANCE_EVENTS } from "./events/chance.js";
import { EVENTS as EXTRA_EVENTS } from "./events/extra.js";
import { EVENTS as FAMILY_ARC_EVENTS } from "./events/family-arc.js";
import { EVENTS as SURPRISE_EVENTS } from "./events/surprise.js";
import { EVENTS as RELATIONSHIP_EVENTS } from "./events/relationship.js";
import { EVENTS as CROSS_EVENTS } from "./events/cross-character.js";
import { EVENTS as ROMANCE_EXTRA_EVENTS } from "./events/romance-extra.js";
import { EVENTS as GENDER_EVENTS } from "./events/gender-specific.js";
import { EVENTS as CLASS_SPLIT_EVENTS } from "./events/class-split.js";
import { ENDINGS, ENDING_BY_ID } from "./endings.js";
import { choice as c, outcome as o } from "./helpers.js";

export { ENDINGS, ENDING_BY_ID };

const FALLBACK_CHOICES = {
  study: {
    label: "先退出这场比较，按自己的节奏来",
    text: "你没有继续追赶别人的进度，而是把今天剩下的时间交给自己。成绩没有立刻改变，但你重新找回了一点掌控感。",
    stats: { study: 3, mood: 2 },
  },
  romance: {
    label: "把还没说出口的话先收回来",
    text: "你没有把答案说出口。对方也没有追问，只是把那一小段沉默留给了你。有些心意没有消失，只是暂时停在原地。",
    stats: { mood: -1 },
  },
  club: {
    label: "这次不参与，回教室做自己的事",
    text: "你退出了热闹的人群，回到教室完成自己的计划。错过了一次活动，却保住了属于自己的节奏。",
    stats: { study: 3, mood: 1 },
  },
  friendship: {
    label: "不替任何人做决定，先离开现场",
    text: "你没有站队，也没有继续追问。后来大家各自冷静下来，事情没有立刻解决，但至少没有因为一句话变得更糟。",
    stats: { mood: 1 },
  },
  family: {
    label: "结束这场对话，回房间冷静",
    text: "你暂时离开了饭桌。门关上以后，客厅里很久没有声音。你知道这件事没有结束，只是今天已经无法继续。",
    stats: { mood: -2, stamina: 1 },
  },
  chance: {
    label: "不介入这件事，继续往前走",
    text: "你没有停下。后来偶尔想起那天，仍会猜如果当时转身会发生什么，但生活很快又把新的选择推到了面前。",
    stats: { mood: 1 },
  },
};

function ensureThreeChoices(event) {
  if (event.choices.length >= 3) return event;
  const fallback = FALLBACK_CHOICES[event.category] || FALLBACK_CHOICES.chance;
  return {
    ...event,
    choices: [
      ...event.choices,
      c(
        `withdraw_${event.id}`,
        fallback.label,
        [o("withdraw", fallback.text, { stats: fallback.stats })],
      ),
    ],
  };
}

const RAW_EVENTS = [
  ...STUDY_EVENTS,
  ...ROMANCE_EVENTS,
  ...CLUB_EVENTS,
  ...FRIENDSHIP_EVENTS,
  ...FAMILY_EVENTS,
  ...CHANCE_EVENTS,
  ...EXTRA_EVENTS,
  ...FAMILY_ARC_EVENTS,
  ...SURPRISE_EVENTS,
  ...RELATIONSHIP_EVENTS,
  ...CROSS_EVENTS,
  ...ROMANCE_EXTRA_EVENTS,
  ...GENDER_EVENTS,
  ...CLASS_SPLIT_EVENTS,
];

export const EVENTS = RAW_EVENTS.map(ensureThreeChoices);
