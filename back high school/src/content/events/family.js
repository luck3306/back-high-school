import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "family_parent_meeting",
    category: "family",
    title: "家长会之后",
    chapters: [1, 2, 3],
    weight: 10,
    text: "家长会结束后，家人和老师聊了很久。你站在楼梯拐角，看见对方的背影比平时更小。回家的路上，家人一直没有提成绩。",
    choices: [
      c("break_silence", "主动说说最近的学习", [
        o("honest_talk", "你讲了自己的担心，也讲了想尝试的方向。对方沉默了一会儿，说“先把饭吃完”。那一刻你知道，有些理解不需要马上说出口。", { stats: { mood: 7 }, flags: ["family_trust"] }),
      ]),
      c("stay_quiet", "安静地走完回家的路", [
        o("unspoken_care", "到家时，桌上多了一碗热汤。没有人再提家长会，但你把碗喝得很干净。", { stats: { mood: 3, stamina: 3 } }),
      ]),
      c("defend_a_friend", "先替朋友解释最近的反常", [
        o("care_for_others", "家人听完后说，会关心别人是好事，但不要把自己弄丢。你点点头，忽然觉得被教育也没有那么难受。", { stats: { mood: 4 }, affinity: { arts: 2, sports: 2 } }),
      ]),
    ],
  },
  {
    id: "family_dinner",
    category: "family",
    title: "晚饭桌上的问题",
    chapters: [1, 2, 3, 4],
    weight: 9,
    text: "晚饭时，家人问起你以后想学什么。你说还没想好，对方便从专业前景讲到邻居家的孩子。饭菜还热着，但你忽然不太想动筷子。",
    choices: [
      c("say_what_you_feel", "说出自己真正感兴趣的方向", [
        o("heard_at_last", "你说得很慢，甚至没有说服自己。家人没有立刻赞成，却关掉了电视，认真听完了你的话。", { stats: { mood: 7 }, flags: ["family_voice"] }),
      ]),
      c("eat_and_listen", "先听完，再默默吃饭", [
        o("swallowed_words", "你记住了很多建议，也把自己的想法往后放了放。晚饭结束后，你一个人在阳台上站了很久。", { stats: { mood: -4, study: 2 } }),
      ]),
      c("ask_them", "反问对方年轻时的选择", [
        o("their_story", "家人愣了一下，讲起自己没去成的远方。你第一次意识到，大人也曾是不知道该怎么办的高中生。", { stats: { mood: 6 }, flags: ["family_history"] }),
      ]),
    ],
  },
  {
    id: "family_weekend_class",
    category: "family",
    title: "周末补习班",
    chapters: [1, 2, 3, 4],
    weight: 9,
    text: "家人替你报了一个周末补习班。课程表排得很满，原本答应朋友的球赛和社团活动都被挤掉了。报名单放在桌上，还没有签字。",
    choices: [
      c("go_anyway", "按照安排去上课", [
        o("steady_progress", "补习班的老师讲得很清楚，你确实补上了几处漏洞。只是周六下午的球场声从窗外传进来，你总会走神。", { stats: { study: 8, mood: -4, stamina: -2 } }),
      ]),
      c("negotiate", "和家人商量只上一半", [
        o("middle_way", "你把担心和计划都写了下来。最后家人同意先试一个月，再看效果。你第一次感到，沟通比硬撑更有用。", { stats: { study: 4, mood: 5 }, flags: ["family_voice"] }, 65),
        o("failed_talk", "谈话变成了争执。最终你还是去了补习班，但心里留下了一点说不清的隔阂。", { stats: { study: 3, mood: -6 } }, 35),
      ]),
      c("skip_once", "偷偷翘掉一次，去参加社团活动", [
        o("stolen_afternoon", "你在球场和礼堂之间跑了一整个下午。回家时有些心虚，但那些笑声真实得让人舍不得后悔。", { stats: { stamina: 5, mood: 8 }, affinity: { arts: 3, sports: 3 }, flags: ["small_rebellion"] }),
      ]),
    ],
  },
  {
    id: "family_phone_call",
    category: "family",
    title: "宿舍楼下的一通电话",
    chapters: [2, 3, 4, 5],
    weight: 8,
    text: "晚自习结束后，手机上有三个未接来电。你回拨过去，家人先问的是“吃饭没有”，然后才提到最近一次考试。走廊很安静，信号时断时续。",
    choices: [
      c("tell_the_truth", "承认最近状态不太好", [
        o("not_alone", "电话那头沉默了几秒，随后说“知道了，别硬撑”。你靠着墙站了一会儿，忽然觉得走廊没有那么长。", { stats: { mood: 8 }, flags: ["family_trust", "opened_up"] }),
      ]),
      c("say_everything_is_fine", "说一切都好", [
        o("polite_reassurance", "你把所有疲惫都说成“还行”。挂断电话后，屏幕暗下去，你看见自己模糊的倒影。", { stats: { mood: -3, study: 2 } }),
      ]),
      c("ask_about_home", "问问家里最近怎么样", [
        o("other_side", "家人讲了很久家里的琐事。那些细小的事情让你忽然意识到，你的高中并不是世界的全部。", { stats: { mood: 5, stamina: 2 } }),
      ]),
    ],
  },
  {
    id: "family_choice_dispute",
    category: "family",
    title: "志愿表上的分歧",
    chapters: [4, 5, 6],
    weight: 9,
    text: "志愿表终于发下来。你想填的学校和家人希望你去的方向不一样。纸上的空格很小，却像装得下未来所有可能。你们坐在客厅里，谁都没有先动笔。",
    choices: [
      c("insist", "坚持自己的选择", [
        o("own_choice", "你把自己的理由一条条讲清楚。家人没有马上同意，但把笔推到了你面前，说“写完给我们看”。", { stats: { mood: 8, study: 2 }, flags: ["own_path"] }, 65),
        o("hard_words", "争执以一句“随你”结束。你填下了想去的学校，却一整晚没有睡好。", { stats: { mood: -5 }, flags: ["own_path"] }, 35),
      ]),
      c("compromise", "先写下双方都能接受的方案", [
        o("balance", "你没有完全放弃，也没有完全妥协。那份表格像一个暂时的答案，提醒你路还没有走完。", { stats: { study: 4, mood: 4 }, flags: ["compromise_path"] }),
      ]),
      c("ask_for_more_time", "把表格先收起来，说明天再谈", [
        o("one_more_night", "那一晚你查了很多资料，最后在纸上写下三个想去的地方。第二天早饭时，你把纸递给了家人。", { stats: { mood: 3, study: 3 } }),
      ]),
    ],
  },
  {
    id: "family_album",
    category: "family",
    title: "旧相册",
    chapters: [3, 4, 5, 6],
    weight: 7,
    text: "整理柜子时，你翻到一本旧相册。照片里的家人穿着和你差不多的校服，站在一栋已经拆掉的教学楼前。背面写着一个地名和一个日期，字迹很年轻。",
    choices: [
      c("ask_for_the_story", "拿着相册去问那段故事", [
        o("same_age", "家人讲了很久。你第一次听见那些没有考上、没有去成、后来又阴差阳错走到的路。原来没有谁的一生是按计划发生的。", { stats: { mood: 7 }, flags: ["family_history", "family_trust"] }),
      ]),
      c("keep_it_quiet", "把相册放回原处", [
        o("hidden_photo", "你把相册放回去，却在很久以后还会想起那张照片。青春看起来那么像，命运却从不重复。", { stats: { mood: 3 } }),
      ]),
    ],
  },
];
