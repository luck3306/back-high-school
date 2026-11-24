import { choice as c, outcome as o } from "../helpers.js";

const ARCS = [
  {
    id: "arts",
    title: "镜头之后",
    stages: [
      {
        title: "取景框外的人",
        chapters: [1, 2],
        text: "{npc.name}总在拍别人，却从不让人拍自己。那天放学前，{npc.pronoun}把相机塞到你手里，说想看看你眼里的校园。",
        breakthrough: "你拍下的第一张照片里，{npc.name}正站在镜头外偷偷看你。你们谁都没有说破。",
      },
      {
        title: "被删掉的照片",
        chapters: [3, 4],
        text: "摄影展前，{npc.name}删掉了一组拍得最好的照片。{npc.pronoun}说自己不配把那么私人的东西放到所有人面前，语气平静得像在说别人的事。",
        breakthrough: "你没有替{npc.name}做决定，只陪{neipc}把照片一张张重新看了一遍。最后留下哪一张，由{neipc}自己按下了确认键。".replaceAll("{neipc}", "{npc.pronoun}"),
      },
      {
        title: "最后一张底片",
        chapters: [5, 6],
        text: "毕业影展只剩最后一个空位。{npc.name}把一张未冲洗的底片交给你，说这张照片从来没有别人看过。冲洗出来以后，你发现画面里是高一开学那天的你。",
        breakthrough: "你们在影展入口站了很久。{npc.name}问能不能把那张照片留下，你说可以，但条件是从今以后也要允许自己出现在别人的照片里。",
      },
    ],
  },
  {
    id: "academic",
    title: "排名之外",
    stages: [
      {
        title: "第一名的空桌",
        chapters: [1, 2],
        text: "所有人都觉得{npc.name}不会失败。可月考结束后的空教室里，{npc.name}把满分卷子揉成一团，问你如果有一天不再是第一，还会不会有人记得{neipc}。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你没有立刻回答，只把那张卷子重新展开，和{npc.name}一起把最后一道题订正完。窗外天黑了，{npc.name}第一次没有急着回家。",
      },
      {
        title: "跌出红榜",
        chapters: [3, 4],
        text: "一次重要模拟考，{npc.name}跌出了红榜。老师和家长都在问原因，{npc.pronoun}却像没事人一样继续刷题。直到晚自习结束，你才发现{neipc}一直没翻过下一页。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你把{npc.name}带到操场，逼{neipc}说出真正害怕的事。最后{neipc}承认，自己不是怕考不好，是怕除了成绩以外，没有人会喜欢{neipc}。".replaceAll("{neipc}", "{npc.pronoun}"),
      },
      {
        title: "志愿表上的城市",
        chapters: [5, 6],
        text: "{npc.name}把志愿表推到你面前，上面写着一座离你很远的名校。{npc.pronoun}问你，如果{neipc}真的去了那里，你会不会觉得这三年只是短暂的同行。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你说同行不需要用距离证明。{npc.name}看了你很久，最后在第二志愿里填下了离你更近的学校。{npc.pronoun}说这不是牺牲，是想给未来多留一种可能。",
      },
    ],
  },
  {
    id: "sports",
    title: "终场之前",
    stages: [
      {
        title: "不肯下场的人",
        chapters: [1, 2],
        text: "训练结束后，{npc.name}还在反复练同一个动作。{npc.pronoun}的膝盖已经肿了，却坚持说没事。你站在场边，第一次觉得“再坚持一下”也可能是一种危险。",
        breakthrough: "你关掉球场最后一盏灯，把{npc.name}强行拉去医务室。{npc.pronoun}一路嘴硬，最后却在门口小声说，谢谢你没有让我继续逞强。",
      },
      {
        title: "错过的那场比赛",
        chapters: [3, 4],
        text: "关键比赛前，{npc.name}因为伤病被队医拦下。{npc.pronoun}坐在替补席最后一排，看着队友热身，手一直攥着护腕。你发现{neipc}并不是怕输，而是怕自己不再被需要。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你陪{npc.name}看完比赛，没有说任何“下次还有机会”之类的空话。散场后，{npc.pronoun}忽然问你，如果不能再上场，你还会不会来看训练。",
      },
      {
        title: "最后一场",
        chapters: [5, 6],
        text: "毕业前的最后一场比赛，{npc.name}把写着所有队友名字的护腕递给你。{npc.pronoun}说最后一节想和你一起上场，不管结果怎样，都想把这场比赛好好记住。",
        breakthrough: "终场哨响以后，{npc.name}没有去看比分，而是先找到你。你们在空下来的球场中央击掌，{npc.pronoun}说，这一次终于不是因为赢了才觉得值得。",
      },
    ],
  },
  {
    id: "leadership",
    title: "完美之外",
    stages: [
      {
        title: "所有人都满意的方案",
        chapters: [1, 2],
        text: "{npc.name}把学生会的工作安排得没有一处漏洞，所有人都说{neipc}可靠。只有你看见{neipc}在会议结束后一个人改到很晚，连晚饭都没有吃。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你没有问要不要帮忙，而是直接把两份盒饭放在桌上。{npc.name}愣了一下，第一次把没改完的文件推给了你。",
      },
      {
        title: "会议室的灯",
        chapters: [3, 4],
        text: "校庆前夜，{npc.name}在会议室崩溃了。{npc.pronoun}说自己不想再当那个永远没问题的人，可所有人都在等{neipc}给答案。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你替{npc.name}关掉手机，让{neipc}把这三年最累的事全部说完。第二天校庆照常开始，但{neipc}第一次在名单上写下了自己的分工之外的休息时间。".replaceAll("{neipc}", "{npc.pronoun}"),
      },
      {
        title: "最后一次卸任",
        chapters: [5, 6],
        text: "{npc.name}把学生会的钥匙交出去时，没有想象中轻松。{npc.pronoun}问你，如果以后不再被所有人需要，自己还剩下什么。你没有替{neipc}回答，只把那把钥匙和一张毕业典礼的座位票放在一起。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "毕业典礼结束后，{npc.name}第一次没有留下来收尾。{npc.pronoun}拉着你从后门离开，说自己终于知道，被一个人认真选择，比被所有人需要更重要。",
      },
    ],
  },
  {
    id: "music",
    title: "留下之前",
    stages: [
      {
        title: "排练室的门外",
        chapters: [1, 2],
        text: "你第一次听见{npc.name}弹完整的曲子，是在放学后的排练室。{npc.pronoun}发现你站在门口，没有停下，只在最后一个音落下后说，这首歌还没有名字。",
        breakthrough: "你给那首歌起了一个很普通的名字，{npc.name}却认真写在了谱纸最上方。{npc.pronoun}说，至少在这个学期结束前，它不会没有名字。",
      },
      {
        title: "又要转学了",
        chapters: [3, 4],
        text: "{npc.name}告诉你，家里可能又要搬家。{npc.pronoun}说得像在报天气，手里却一直转着吉他拨片。你说不出挽留的话，因为连{neipc}自己都不相信能留下。".replaceAll("{neipc}", "{npc.pronoun}"),
        breakthrough: "你没有承诺任何未来，只把排练室的钥匙塞进{npc.name}手里。{npc.pronoun}盯着钥匙看了很久，最后说会把它带到毕业。",
      },
      {
        title: "写给这里的歌",
        chapters: [5, 6],
        text: "毕业晚会前，{npc.name}写完了那首一直没有名字的歌。{npc.pronoun}让你第一个听，歌词里没有一个“再见”，却把你和这段校园生活写得清清楚楚。",
        breakthrough: "演出结束时，{npc.name}对着台下说，这首歌叫《留下》。{npc.pronoun}没有说为谁写的，但唱到最后一句时，只看着你。",
      },
    ],
  },
];

function makeChoice(id, label, text, effects, flags = []) {
  return c(id, label, [o(id + "_result", text, { stats: effects.stats || {}, affinity: effects.affinity, flags })]);
}

export const EVENTS = ARCS.flatMap((arc) => arc.stages.map((stage, index) => ({
  id: "relationship_" + arc.id + "_" + (index + 1),
  category: "relationship",
  relationship: true,
  npc: arc.id,
  title: stage.title,
  chapters: stage.chapters,
  weight: 18,
  text: stage.text,
  choices: [
    makeChoice("stay", "留下来，陪" + "{npc.name}" + "把事情做完", stage.breakthrough, { stats: { mood: 5 }, affinity: { [arc.id]: 11 } }, ["bond_deep_" + arc.id]),
    makeChoice("honest", "把两个人都没说出口的问题摊开谈", "你没有替" + "{npc.name}" + "做决定，也没有把担心藏起来。那场谈话不轻松，但你们终于站在了同一个问题面前。", { stats: { study: 4, mood: 3 }, affinity: { [arc.id]: 7 } }, ["honest_" + arc.id]),
    makeChoice("space", "把选择交还给" + "{npc.name}" + "，先退后一步", "你没有继续追问，只告诉" + "{npc.name}" + "需要的时候可以来找你。后来的某一天，{npc.pronoun}真的来了。", { stats: { mood: 3, study: 3 }, affinity: { [arc.id]: 4 } }, ["respected_" + arc.id]),
  ],
})));
