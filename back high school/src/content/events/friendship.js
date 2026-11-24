import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "friend_canteen_table",
    category: "friendship",
    title: "食堂里的那张桌子",
    chapters: [1, 2, 3, 4, 5],
    weight: 11,
    text: "中午的食堂挤满了人。你端着餐盘站了一会儿，{arts.name}在靠窗的位置挥手，{academic.name}在另一边给你留了空位，{sports.name}则从队伍末尾喊你过去。你只能选择一个方向。",
    choices: [
      c("sit_with_arts", "坐到{arts.name}旁边", [
        o("window_table", "{arts.name}把餐盘里的鸡块夹给你，讲了一整个午休的社团趣事。阳光从窗边斜进来，餐盘上的油光都显得很温暖。", { stats: { mood: 6 }, affinity: { arts: 7 } }),
      ]),
      c("sit_with_academic", "坐到{academic.name}对面", [
        o("quiet_lunch", "{academic.name}吃饭很慢。你们没有说太多话，但他把笔记本移开，给你腾出了放汤碗的位置。", { stats: { mood: 3, study: 3 }, affinity: { academic: 7 } }),
      ]),
      c("sit_with_sports", "去找{sports.name}", [
        o("noisy_table", "{sports.name}那一桌永远很吵。他给你让出座位，还不忘往你餐盘里塞了一盒酸奶。", { stats: { stamina: 3, mood: 6 }, affinity: { sports: 7 } }),
      ]),
    ],
  },
  {
    id: "friend_earphones",
    category: "friendship",
    title: "分你一只耳机",
    chapters: [1, 2, 3, 4, 5],
    weight: 8,
    text: "课间，你把耳机分给前来借充电线的人。对方索性坐下，说想听一首新歌。窗外有人打闹，教室里却像被一小段旋律单独隔开。",
    choices: [
      c("share_with_all", "干脆三个人一起听", [
        o("shared_earphones", "耳机线不够长，你们只好凑得很近。副歌响起时，不知道谁先跟着哼了起来。", { stats: { mood: 6 }, affinity: { arts: 3, academic: 3, sports: 3 } }),
      ]),
      c("keep_quiet", "把音量调小，继续写题", [
        o("quiet_company", "对方没有打扰你。一首歌放完，只把耳机轻轻放回你桌上。", { stats: { study: 3, mood: 2 }, affinity: { academic: 2 } }),
      ]),
    ],
  },
  {
    id: "friend_quarrel",
    category: "friendship",
    title: "他们吵起来了",
    chapters: [2, 3, 4, 5, 6],
    weight: 10,
    text: "{arts.name}和{sports.name}在走廊里吵了起来。一个说对方不把社团活动当回事，一个说每次都要迁就别人的安排。{academic.name}站在旁边，难得没有给出任何道理。",
    choices: [
      c("mediate", "把两个人分别拉到一边", [
        o("after_the_rain", "你先听{arts.name}说完，又去找{sports.name}。最后两个人在楼梯口别扭地道歉，谁都不肯先走。", { stats: { mood: 4 }, affinity: { arts: 5, sports: 5, academic: 3 }, flags: ["peacemaker"] }),
      ]),
      c("side_with_arts", "站在{arts.name}这边", [
        o("took_sides", "{sports.name}没有再争，转身回了教室。{arts.name}小声说谢谢，但你看见她后来一直盯着门口。", { stats: { mood: 1 }, affinity: { arts: 5, sports: -4 } }),
      ]),
      c("side_with_sports", "站在{sports.name}这边", [
        o("unfinished_game", "{arts.name}什么也没说就走了。下午训练时{sports.name}投篮很准，却一次都没有像平时那样庆祝。", { stats: { stamina: 2 }, affinity: { sports: 5, arts: -4 } }),
      ]),
    ],
  },
  {
    id: "friend_birthday",
    category: "friendship",
    title: "没有提前通知的生日",
    chapters: [2, 3, 4, 5, 6],
    weight: 8,
    text: "晚自习前，你才发现今天是{academic.name}的生日。他从不主动提这些，桌上也没有什么特别的。你摸了摸书包，只有一张还没写完的贺卡和半块巧克力。",
    choices: [
      c("give_what_you_have", "把巧克力和贺卡一起给他", [
        o("simple_gift", "{academic.name}看着那张没写完的贺卡，问你后面本来想写什么。你说还没想好。他把纸收进书里，说可以慢慢想。", { stats: { mood: 6 }, affinity: { academic: 8 } }),
      ]),
      c("gather_friends", "叫上大家一起唱生日歌", [
        o("small_celebration", "全班跟着拍手，{academic.name}明显不知道该看哪里。灯熄灭时，他在昏暗里对你说了句谢谢。", { stats: { mood: 7 }, affinity: { academic: 4, arts: 2, sports: 3 } }),
      ]),
      c("pretend_not_to_know", "假装没有发现", [
        o("quiet_cake", "放学时你看见{academic.name}一个人吃掉那块小蛋糕。你没有过去，只在第二天把贺卡补完放进了他的抽屉。", { stats: { mood: 1 }, affinity: { academic: 3 } }),
      ]),
    ],
  },
  {
    id: "friend_night_run",
    category: "friendship",
    title: "操场上的夜跑",
    chapters: [2, 3, 4, 5, 6],
    weight: 9,
    text: "压力像一团越缠越紧的线。{sports.name}说别想了，去跑两圈。操场的灯只开了一半，你们沿着最外侧的跑道慢慢起步。",
    choices: [
      c("run_with_him", "跟上他的速度", [
        o("breathing_together", "跑到第二圈时，你们只剩下呼吸声。{sports.name}放慢了速度，没有让你一个人落在后面。", { stats: { stamina: 8, mood: 6 }, affinity: { sports: 7 } }),
      ]),
      c("walk_and_talk", "改成散步，聊聊最近的事", [
        o("long_conversation", "你把憋了很久的话说出来。{sports.name}没有给建议，只说“你已经很努力了”。这句话比任何鼓励都轻。", { stats: { mood: 8, stamina: 2 }, affinity: { sports: 5 }, flags: ["opened_up"] }),
      ]),
      c("race_him", "提议比赛一圈", [
        o("sprint_finish", "你输得很彻底，却笑得喘不过气。{sports.name}在终点等你，伸手把你从草坪上拉起来。", { stats: { stamina: 5, mood: 8 }, affinity: { sports: 4 } }),
      ]),
    ],
  },
  {
    id: "friend_autograph",
    category: "friendship",
    title: "同学录的空白页",
    chapters: [5, 6],
    weight: 12,
    text: "毕业前，同学录传到你手里。{arts.name}写了很长一段，{academic.name}只写了一句，{sports.name}把整页画满了乱七八糟的小人。轮到你给别人写时，笔尖悬在纸上很久。",
    choices: [
      c("write_everything", "把想说的话都写下来", [
        o("long_goodbye", "你写了很久，几乎占满那一页。写完后才发现，真正舍不得的不是某一天，而是这些平常得不能被记住的下午。", { stats: { mood: 8 }, affinity: { arts: 3, academic: 3, sports: 3 }, flags: ["wrote_everything"] }),
      ]),
      c("write_one_sentence", "只留一句“以后常联系”", [
        o("short_goodbye", "你把同学录递回去时，对方盯着那句话看了几秒，说“好”。谁都知道，有些约定说出来就已经很重。", { stats: { mood: 4 }, affinity: { arts: 2, academic: 2, sports: 2 } }),
      ]),
      c("draw_a_little_thing", "画一个只有彼此看得懂的符号", [
        o("secret_symbol", "三个人都收到了不同的小图案。多年以后，你也许说不清它的含义，但会记得画下它时的心跳。", { stats: { mood: 7 }, affinity: { arts: 4, academic: 4, sports: 4 }, flags: ["secret_symbol"] }),
      ]),
    ],
  },
];
