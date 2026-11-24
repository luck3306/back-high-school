import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "class_split_seat_map",
    category: "friendship",
    classState: "split",
    title: "新班级的座位表",
    chapters: [3, 4],
    weight: 14,
    text: "分班后的第一张座位表贴出来，你被安排在靠窗的最后一排。教室里全是新面孔，走廊另一头却有人在等你下课。你忽然不知道应该先努力融入这里，还是先跑去找原来的朋友。",
    choices: [
      c("make_new_friends", "先和新同桌认识", [
        o("new_desk_mate", "新同桌借给你一支笔，又顺手把课表推过来。午休时你收到旧朋友的消息，才想起自己还没有告诉他们新班级的位置。", { stats: { mood: 6 }, flags: ["new_class_bond"] }),
      ]),
      c("find_old_friends", "下课后先去原来的楼层", [
        o("old_floor", "你跑过两层楼梯，发现他们也正往你这边走。几个人在走廊中间撞到一起，笑得像分班从来没有发生过。", { stats: { stamina: -2, mood: 9 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 } }),
      ]),
      c("eat_alone", "午休一个人待着", [
        o("alone_lunch", "你坐在新班级最后一排吃完午饭。没有人赶你走，也没有人主动过来。手机里旧朋友的群聊亮了一整天。", { stats: { mood: -3, study: 2 } }),
      ]),
    ],
  },
  {
    id: "class_split_corridor",
    category: "romance",
    classState: "split",
    title: "走廊里的三分钟",
    chapters: [3, 4, 5],
    weight: 14,
    text: "课间只有十分钟，两个班级之间隔着两层楼。你每天能见到某个人的时间，只剩下走廊拐角的那三分钟。今天对方来晚了，上课铃已经响过。",
    choices: [
      c("wait_for_them", "在楼梯口多等一会儿", [
        o("worth_waiting", "对方跑得气喘吁吁，手里还攥着从自己班带出来的糖。你们只来得及说一句“明天见”，但那一整天都变得不一样。", { stats: { mood: 8 }, affinity: { arts: 4, academic: 4, sports: 4, leadership: 4, music: 4 }, flags: ["cross_class_romance"] }),
      ]),
      c("leave_a_note", "把想说的话写在便签上", [
        o("passed_note", "你把便签贴在对方班级门口。下一节课结束时，你的课本里多了一张回信，上面画着一个小小的钟表。", { stats: { mood: 6 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 }, flags: ["cross_class_romance"] }),
      ]),
      c("go_back_to_class", "先回自己的教室", [
        o("missed_three_minutes", "你回到座位时，走廊尽头才出现熟悉的身影。对方没有追过来，只在下午发了一条消息：今天没见到你。", { stats: { mood: -2, study: 2 } }),
      ]),
    ],
  },
  {
    id: "class_split_misunderstanding",
    category: "chance",
    classState: "split",
    title: "新班级里的误会",
    chapters: [3, 4, 5, 6],
    weight: 13,
    text: "新班级里有人误以为你向老师打小报告。几节课下来，原本就不熟的同学们开始刻意避开你。你知道解释未必有用，但如果不说话，事情会越来越像真的。",
    choices: [
      c("speak_up", "在班会上把经过说清楚", [
        o("cleared_again", "你把时间线和聊天记录摆出来，误会终于解开。那天放学后，几个新同学主动来找你一起走。", { stats: { mood: 8 }, affinity: { leadership: 4 }, flags: ["stood_up", "new_class_bond"] }),
      ]),
      c("ask_old_friend", "找原来的朋友帮忙说明", [
        o("friend_proof", "旧班的人特意来替你作证。新同学有些尴尬，但至少不再用那种眼神看你。你第一次觉得，分班并没有把真正的关系切断。", { stats: { mood: 5 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 }, flags: ["new_class_bond"] }),
      ]),
      c("ignore_it", "不解释，等时间过去", [
        o("slow_loneliness", "误会没有继续扩大，但也没有消失。你在这个班级里越来越安静，只有放学后才会恢复成原来的自己。", { stats: { mood: -5, study: 3 } }),
      ]),
    ],
  },
  {
    id: "class_split_sports_day",
    category: "club",
    classState: "split",
    title: "跨班运动会",
    chapters: [4, 5, 6],
    weight: 13,
    text: "运动会把你和原来的朋友分到了不同队伍。接力赛检录时，你们在跑道两侧同时看见对方。以前并肩的人，现在成了必须要赢过的对手。",
    choices: [
      c("compete_hard", "认真比，不让对方", [
        o("true_rivals", "比赛很激烈。结束后你们坐在草地上喘气，谁都没有先恭喜谁，最后却一起笑了。对方说，这样才对。", { stats: { stamina: 8, mood: 8 }, affinity: { sports: 5, leadership: 4 }, flags: ["team_goal"] }),
      ]),
      c("run_for_friendship", "把接力棒交给更需要机会的新同学", [
        o("passed_baton", "你没有站上最后一棒，却帮新班级完成了比赛。旧朋友在终点等你，问是不是故意让的。你说不是，只是这次想站在另一群人身边。", { stats: { mood: 7 }, affinity: { sports: 2, leadership: 5 }, flags: ["new_class_bond", "peacemaker"] }),
      ]),
      c("refuse_to_compete", "找理由退出比赛", [
        o("stood_aside", "你坐在看台上看完了整场。两个班都以为你只是身体不舒服，只有你知道自己不想在两种关系里选输赢。", { stats: { mood: -3, stamina: 3 } }),
      ]),
    ],
  },
  {
    id: "class_same_duty",
    category: "friendship",
    classState: "same",
    title: "同一个值日组",
    chapters: [3, 4, 5],
    weight: 14,
    text: "新学期没有分班，你又和熟悉的人分到了同一个值日组。放学后教室里只剩你们几个，黑板擦不干净，垃圾袋也破了，大家却因为一点小事笑到停不下来。",
    choices: [
      c("finish_together", "一起把教室收拾完", [
        o("same_class_team", "你们最后一个关灯离开。走廊里空荡荡的，有人提议去买奶茶，所有人都没有反对。", { stats: { stamina: 3, mood: 8 }, affinity: { arts: 4, academic: 4, sports: 4, leadership: 4, music: 4 }, flags: ["group_project"] }),
      ]),
      c("slack_off", "把活推给最认真的人", [
        o("pushed_work", "对方嘴上抱怨，还是把最后一点做完了。第二天你发现自己的桌洞里多了一张写着“下次轮到你了”的纸条。", { stats: { mood: 2 }, affinity: { leadership: 4, academic: 2 } }),
      ]),
      c("order_takeout", "点吃的犒劳所有人", [
        o("late_snack", "保安来催关门前，你们把外卖吃完了。味道一般，但所有人都说这是本学期最好吃的一顿。", { stats: { mood: 7 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 } }),
      ]),
    ],
  },
  {
    id: "class_same_hidden_note",
    category: "romance",
    classState: "same",
    title: "桌洞里的小纸条",
    chapters: [3, 4, 5],
    weight: 13,
    text: "没有分班以后，教室里的座位成了最容易被看见的地方。某个早自习，你从桌洞里摸到一张折成方块的纸，上面只有一句话：今天放学能不能晚一点走。",
    choices: [
      c("wait_after_school", "留下来等那个人", [
        o("empty_classroom", "放学后教室慢慢空下来。那个人一直坐在窗边，直到最后才走过来，说其实没什么事，只是不想又错过一天。", { stats: { mood: 9 }, affinity: { arts: 4, academic: 4, sports: 4, leadership: 4, music: 4 }, flags: ["romance_public"] }),
      ]),
      c("write_back", "写一句“可以”放回去", [
        o("note_answer", "你没有问是谁，只把回复夹进同一本书里。第二天纸条被收走了，下午的课桌上多了一瓶你喜欢的饮料。", { stats: { mood: 6 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 } }),
      ]),
      c("ignore_it", "把纸条压进书里", [
        o("ignored_note", "那天放学你按时离开。很久以后整理书本时，那张纸又掉出来，边角已经压得发软。", { stats: { mood: 1 } }),
      ]),
    ],
  },
  {
    id: "class_same_competition",
    category: "club",
    classState: "same",
    title: "同一个班的荣誉",
    chapters: [4, 5, 6],
    weight: 13,
    text: "没有分班，所以这次校级比赛里，你和所有熟悉的人都在同一支队伍。赢了是共同的荣誉，输了也无处躲避。比赛前，大家第一次认真讨论起谁该站最后的位置。",
    choices: [
      c("take_the_pressure", "主动承担最难的环节", [
        o("shared_glory", "你完成了最难的环节。宣布名次时，全班同时站起来。那些熟悉的脸上全是毫不掩饰的骄傲。", { stats: { study: 5, mood: 10 }, affinity: { arts: 3, academic: 3, sports: 5, leadership: 4, music: 3 }, flags: ["team_goal", "public_praise"] }),
      ]),
      c("let_someone_else", "把机会交给准备得更充分的人", [
        o("trusted_team", "结果仍然不错。你站在台下为对方鼓掌时，忽然觉得荣誉并不是只能由一个人接住。", { stats: { mood: 6 }, affinity: { arts: 2, academic: 4, sports: 3, leadership: 5, music: 2 }, flags: ["team_goal"] }),
      ]),
      c("withdraw", "觉得压力太大，退出比赛", [
        o("withdrew", "队伍临时调整了名单。没有人怪你，但之后每次听见比赛消息，你都会想如果当时没有退。", { stats: { mood: -3, stamina: 2 } }),
      ]),
    ],
  },
  {
    id: "class_same_last_photo",
    category: "chance",
    classState: "same",
    title: "原班最后一张合照",
    chapters: [5, 6],
    weight: 14,
    text: "毕业前，你们回到高一开学时的教室拍合照。没有分班，所以座位和当年几乎一样，只是墙上多了倒计时，大家的校服也旧了一圈。摄影师让大家站到原来的位置。",
    choices: [
      c("return_to_first_seat", "站回第一次坐的位置", [
        o("first_seat_photo", "快门按下时，你想起三年前第一次走进这间教室。身边的人换了表情，却没有换。照片洗出来以后，你把那张放在了最前面。", { stats: { mood: 12 }, affinity: { arts: 4, academic: 4, sports: 4, leadership: 4, music: 4 }, flags: ["campus_legend", "promise_reunion"] }),
      ]),
      c("change_positions", "和大家换到彼此身边", [
        o("swapped_photo", "摄影师重新排了好几次，没人愿意按原位置站。最后大家索性挤成一团，照片看起来有点乱，却比任何标准合照都真实。", { stats: { mood: 9 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 }, flags: ["campus_legend"] }),
      ]),
      c("take_the_photo", "主动拿起相机替大家拍", [
        o("took_the_photo", "你站在镜头后面，看见所有人同时朝你挥手。按下快门以后，你也跑进了下一张照片里。", { stats: { mood: 8 }, affinity: { arts: 5, academic: 2, sports: 2, leadership: 3, music: 3 }, flags: ["campus_legend"] }),
      ]),
    ],
  },
];
