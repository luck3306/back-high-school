import { choice as c, outcome as o, modifier as m } from "../helpers.js";

export const EVENTS = [
  {
    id: "club_fair",
    category: "club",
    title: "社团招新",
    chapters: [1, 2, 3],
    weight: 11,
    text: "操场边摆满了社团摊位。摄影社的相片在风里晃，竞赛社的桌上堆满模型，篮球队则直接把篮筐搬到摊位旁。午休结束前，你必须在一张表上写下名字。",
    choices: [
      c("join_arts", "加入摄影社", [
        o("viewfinder", "{arts.name}把相机递给你，教你如何让逆光里的人变得清楚。你按下第一次快门时，她站在取景框外笑。", { stats: { mood: 8 }, affinity: { arts: 7 }, flags: ["club_arts"] }),
      ]),
      c("join_science", "加入竞赛社", [
        o("whiteboard", "竞赛社的白板上写着一道没有人做完的题。{academic.name}把笔递给你，说：“从你会的开始。”", { stats: { study: 7 }, affinity: { academic: 7 }, flags: ["club_science"] }),
      ]),
      c("join_sports", "加入篮球队", [
        o("first_practice", "第一次训练结束，你累得说不出话。{sports.name}把球塞给你，让你投最后一次。球在篮筐上转了两圈，落进网里。", { stats: { stamina: 9, mood: 4 }, affinity: { sports: 7 }, flags: ["club_sports"] }),
      ]),
    ],
  },
  {
    id: "club_poster",
    category: "club",
    title: "文艺汇演海报",
    chapters: [1, 2, 3, 4, 5],
    weight: 9,
    npc: "arts",
    text: "文艺汇演前一天，海报上的标题被雨水打湿，只剩下一片模糊的蓝色。{arts.name}抱着一卷纸站在美术教室门口，问你能不能陪她重画一张。",
    choices: [
      c("help_redraw", "留下来一起重画", [
        o("paint_together", "你们画到保安来催关门。{arts.name}在角落画了一只很小的纸飞机，说这是给帮忙的人的署名。", { stats: { mood: 5, stamina: -3 }, affinity: { arts: 8 }, flags: ["club_arts"] }),
      ]),
      c("find_more_helpers", "叫{sports.name}和{academic.name}一起来", [
        o("team_poster", "四个人把美术教室弄得一团糟，也在关门前完成了海报。第二天海报拿了最佳设计奖，署名却是高一（7）班。", { stats: { mood: 7 }, affinity: { arts: 4, academic: 3, sports: 4 }, flags: ["group_project"] }),
      ]),
      c("use_printed_copy", "建议直接打印一张新的", [
        o("clean_copy", "新的海报很整洁，却没有手写的那股劲。{arts.name}说也挺好，把旧纸折起来留给了你。", { stats: { mood: 2 }, affinity: { arts: 2 } }),
      ]),
    ],
  },
  {
    id: "club_robot",
    category: "club",
    title: "机器人社的临时维修",
    chapters: [2, 3, 4, 5],
    weight: 9,
    npc: "academic",
    text: "竞赛社的机器人在展示前突然不动了。{academic.name}蹲在地上检查线路，额头上全是汗。距离开放日只剩二十分钟，围过来的人越来越多。",
    choices: [
      c("hand_him_tools", "安静地把工具递给他", [
        o("fixed_in_time", "你在他需要之前把螺丝刀放到了手边。机器人重新亮起时，{academic.name}抬头看了你一眼，像在确认你一直都在。", { stats: { study: 4, mood: 6 }, affinity: { academic: 8 }, flags: ["club_science"] }),
      ]),
      c("ask_for_help", "去叫老师和其他社员", [
        o("crowded_fix", "人多起来以后，问题反而更快解决了。{academic.name}没有居功，只在名单上把你也写进了协助栏。", { stats: { mood: 4 }, affinity: { academic: 4 }, flags: ["group_project"] }),
      ]),
      c("watch_from_back", "不添乱，站在后面看", [
        o("held_breath", "{academic.name}最终自己修好了。围观的人鼓掌时，他下意识看向你这边。你点了点头，他也点了一下。", { stats: { mood: 2 }, affinity: { academic: 3 } }),
      ]),
    ],
  },
  {
    id: "club_basketball",
    category: "club",
    title: "校队预选赛",
    chapters: [1, 2, 3, 4],
    weight: 10,
    npc: "sports",
    text: "篮球预选赛前一天，队里有人扭伤了脚。{sports.name}把备用球衣递给你，说只要跑得动，就有机会上场。看台上已经坐满了来加油的同学。",
    choices: [
      c("play_anyway", "换上球衣上场", [
        o("game_winner", "最后一分钟，你把球传给空位的{sports.name}。他投进以后第一个冲过来抱住你，观众席的欢呼几乎把屋顶掀开。", { stats: { stamina: 7, mood: 9 }, affinity: { sports: 10 }, flags: ["club_sports", "team_goal"] }, 60, [m({ minStamina: 55 }, 20)]),
        o("close_loss", "你们还是输了，但教练说这是这个赛季最好的一场。{sports.name}和你并排坐在场边，久久没有起身。", { stats: { stamina: -4, mood: 2 }, affinity: { sports: 6 }, flags: ["team_goal"] }, 40),
      ]),
      c("cheer_from_bench", "留在场边帮队伍记录数据", [
        o("sixth_man", "你记住了每个队员的习惯。中场休息时，{sports.name}按你的提醒调整了防守位置，回头冲你比了个拇指。", { stats: { mood: 5, study: 2 }, affinity: { sports: 6 }, flags: ["team_goal"] }),
      ]),
    ],
  },
  {
    id: "club_budget",
    category: "club",
    title: "被砍掉的经费",
    chapters: [2, 3, 4, 5, 6],
    weight: 8,
    text: "社团经费被临时削减，原本计划好的活动几乎办不成。社员们争论着要不要取消，你手里拿着那张预算表，发现还有几项可以重新分配。",
    choices: [
      c("make_a_plan", "重新做一份预算方案", [
        o("approved", "你熬夜算完每一项支出。第二天老师看完方案，说“这个可以试试”。活动保留下来，大家都松了一口气。", { stats: { study: 5, stamina: -4, mood: 7 }, flags: ["club_pride", "group_project"] }, 65, [m({ minStudy: 55 }, 15)]),
        o("cut_activity", "方案通过了，但活动规模缩小了一半。你有些遗憾，不过社员们说能办就好。", { stats: { mood: 1 }, flags: ["club_pride"] }, 35),
      ]),
      c("self_fund", "提议大家一起凑钱", [
        o("small_donation", "每个人拿出的钱都不多，却真的把缺的部分补上了。活动结束时，负责人在道具背面写下了所有名字。", { stats: { mood: 6 }, affinity: { arts: 3, sports: 3, academic: 2 }, flags: ["club_pride"] }),
      ]),
    ],
  },
  {
    id: "club_open_day",
    category: "club",
    title: "开放日的讲解员",
    chapters: [3, 4, 5, 6],
    weight: 8,
    text: "校园开放日缺一名讲解员。老师问谁能代表社团，向家长和初中生介绍这一年的成果。你看着准备好的稿子，忽然想起自己第一次站在这间教室门口的样子。",
    choices: [
      c("volunteer", "主动举手", [
        o("find_your_voice", "你讲到一半时不再看稿。参观结束后，有位初中生问你高中是什么样子，你认真想了很久才回答。", { stats: { mood: 8, study: 3 }, flags: ["club_pride", "stood_up"] }, 65, [m({ minMood: 45 }, 15)]),
        o("nervous_start", "刚开始有些结巴，后来慢慢稳住了。老师没有打断你，结束时还带头鼓掌。", { stats: { mood: 5 }, flags: ["club_pride"] }, 35),
      ]),
      c("recommend_someone", "推荐更擅长表达的社员", [
        o("behind_the_scene", "你把资料整理得很完整，站在台下帮对方补充了好几次。开放日结束后，大家说这次展示很顺利。", { stats: { mood: 3 }, affinity: { arts: 3, academic: 3, sports: 2 }, flags: ["group_project"] }),
      ]),
    ],
  },
];
