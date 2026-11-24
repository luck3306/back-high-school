import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "cross_study_or_match",
    category: "friendship",
    crossCharacter: true,
    title: "晚自习与决赛",
    chapters: [1, 2],
    weight: 12,
    text: "{academic.name}约你晚自习做最后一套压轴卷，{sports.name}却把决赛门票塞到你手里。两个人都没有逼你选，可两张纸同时放在桌上，教室里的空气还是安静了下来。",
    choices: [
      c("choose_study", "留下来陪{academic.name}做题", [
        o("study_chosen", "你放弃了比赛。晚上{sports.name}发来一张空看台的照片，只写了句“赢了”。你回了一个恭喜，心里却有一点说不出的遗憾。", { stats: { study: 7, mood: -2 }, affinity: { academic: 9, sports: -2 }, flags: ["study_first"] }),
      ]),
      c("choose_match", "去现场看{sports.name}比赛", [
        o("match_chosen", "你赶到时正好看见{sports.name}投进最后一球。回去后{academic.name}还在教室，桌上留着一套做完的卷子和一句“明天补”。", { stats: { stamina: 4, study: 2, mood: 7 }, affinity: { sports: 9, academic: 3 }, flags: ["team_first"] }),
      ]),
      c("try_both", "先去比赛，再赶回晚自习", [
        o("both_tired", "你两边都赶到了，也两边都没能完全投入。结束时{academic.name}和{sports.name}同时问你累不累，你第一次觉得自己被两种不同方式在意着。", { stats: { stamina: -5, mood: 8 }, affinity: { academic: 4, sports: 4 } }),
      ]),
    ],
  },
  {
    id: "cross_poster_or_rehearsal",
    category: "club",
    crossCharacter: true,
    title: "海报与排练表",
    chapters: [1, 2, 3],
    weight: 12,
    text: "{leadership.name}把活动流程排得满满当当，{arts.name}却坚持要留出一段完全空白的拍摄时间。两个人在活动室里各说各的道理，最后同时看向你。",
    choices: [
      c("support_arts", "支持{arts.name}保留创作时间", [
        o("creative_time", "活动节奏慢了一点，却留下了整场最好的照片。{leadership.name}看完成片后没有争辩，只在总结里写了“需要为意外留白”。", { stats: { mood: 6 }, affinity: { arts: 9, leadership: 4 }, flags: ["group_project"] }),
      ]),
      c("support_leader", "支持{leadership.name}按计划执行", [
        o("tight_schedule", "活动准时结束，所有人都松了一口气。{arts.name}没有抱怨，只把没拍完的镜头留到了下一次。", { stats: { study: 3, mood: 3 }, affinity: { leadership: 9, arts: 2 } }),
      ]),
      c("make_a_new_plan", "把两套方案重新合并", [
        o("better_plan", "你把流程拆成可调整的几段，既保住了拍摄时间，也没有耽误后面的环节。两个人第一次意见一致：这次算你赢。", { stats: { study: 5, mood: 7 }, affinity: { arts: 5, leadership: 5 }, flags: ["peacemaker", "group_project"] }),
      ]),
    ],
  },
  {
    id: "cross_rehearsal_or_contest",
    category: "club",
    crossCharacter: true,
    title: "同一天的比赛与排练",
    chapters: [2, 3, 4],
    weight: 11,
    text: "竞赛和乐队排练撞在同一天。{academic.name}说这次比赛关系到保送，{music.name}说那场演出可能是乐队最后一次上台。你只能帮一个人。",
    choices: [
      c("help_academic", "陪{academic.name}去竞赛", [
        o("contest_day", "比赛拿了奖，{academic.name}在回程车上第一次靠着你睡着。晚上你看见{music.name}发的演出视频，主唱临时改了歌词。", { stats: { study: 8, mood: 2 }, affinity: { academic: 9, music: -3 }, flags: ["contest_team"] }),
      ]),
      c("help_music", "去支持{music.name}的演出", [
        o("music_day", "演出结束时{music.name}在台上找了你很久。后来你才知道，竞赛那天{academic.name}发挥失常，却什么都没对你说。", { stats: { mood: 9, study: -2 }, affinity: { music: 10, academic: -2 }, flags: ["stage_spotlight"] }),
      ]),
      c("ask_for_help", "请其他人分别帮他们", [
        o("shared_support", "你没能亲自到场，却把两边的人都安排妥当。晚上三个人在群里吵吵闹闹地复盘，谁都没有真的怪你。", { stats: { mood: 6, study: 2 }, affinity: { academic: 3, music: 4 }, flags: ["peacemaker"] }),
      ]),
    ],
  },
  {
    id: "cross_team_or_band",
    category: "friendship",
    crossCharacter: true,
    title: "球馆和排练室",
    chapters: [2, 3, 4],
    weight: 11,
    text: "{sports.name}和{music.name}为了同一个场地吵了起来。一个说训练早就排好，一个说演出只剩这一周能排练。两个人都不肯退，你站在门口，手里拿着两把钥匙。",
    choices: [
      c("give_to_sports", "把场地先给球队", [
        o("team_wins", "球队完成了训练。{music.name}带着乐队去了天台排练，唱到一半忽然下起雨。你上楼时，看见他们全都浑身湿透，却还在笑。", { stats: { stamina: 5, mood: 3 }, affinity: { sports: 8, music: 3 } }),
      ]),
      c("give_to_music", "把场地先给乐队", [
        o("band_wins", "演出排练顺利完成。{sports.name}在操场边加练到很晚，第二天队里有人抱怨，你才知道他替你扛了责任。", { stats: { mood: 6, stamina: -2 }, affinity: { music: 9, sports: 4 } }),
      ]),
      c("split_the_place", "把场地和时间拆开使用", [
        o("shared_space", "你把时间切成两半，两边都觉得不够，却也都勉强完成了任务。最后两拨人一起坐在看台吃夜宵，才发现对方并没有那么难相处。", { stats: { mood: 7, study: 2 }, affinity: { sports: 4, music: 4 }, flags: ["peacemaker"] }),
      ]),
    ],
  },
  {
    id: "cross_creation",
    category: "romance",
    crossCharacter: true,
    title: "词与画面",
    chapters: [3, 4, 5],
    weight: 10,
    text: "{arts.name}想为校刊拍一组照片，{music.name}写了一段没有词的旋律。两个人同时找到你，希望你能决定这组作品该不该把他们的名字放在一起。",
    choices: [
      c("put_names_together", "把两个人的名字并列", [
        o("joint_work", "作品发表后成了全校讨论度最高的一页。{arts.name}和{music.name}站在一起接受采访，你在旁边看着，忽然觉得他们像两个终于找到同频的人。", { stats: { mood: 8 }, affinity: { arts: 5, music: 5 }, flags: ["campus_legend"] }),
      ]),
      c("keep_them_apart", "各自署名，避免误会", [
        o("separate_credit", "作品仍然完成了，只是少了那种完整的冲击感。两个人都说没关系，你却在他们离开后听见{arts.name}轻轻叹了一口气。", { stats: { mood: 2, study: 2 }, affinity: { arts: 2, music: 2 } }),
      ]),
      c("let_them_decide", "把决定交还给他们", [
        o("their_choice", "你退出美术教室，把门轻轻带上。后来那张作品只署了两个人的姓，没有队名，也没有解释。", { stats: { mood: 5 }, affinity: { arts: 4, music: 4 } }),
      ]),
    ],
  },
  {
    id: "cross_debate_rank",
    category: "study",
    crossCharacter: true,
    title: "辩论场上的名单",
    chapters: [3, 4, 5],
    weight: 10,
    text: "辩论赛和年级排名同时公布。{leadership.name}拿到了最佳辩手，{academic.name}却因为缺赛跌出前三。走廊里所有人都在讨论谁更值得被表扬。",
    choices: [
      c("celebrate_leader", "先恭喜{leadership.name}", [
        o("leader_celebrated", "你把花递给{leadership.name}，对方却先问{academic.name}怎么样。那天晚上，两个人第一次坐下来聊了很久。", { stats: { mood: 5 }, affinity: { leadership: 8, academic: 3 } }),
      ]),
      c("stay_with_academic", "去陪失落的{academic.name}", [
        o("academic_supported", "你没有去看颁奖。{academic.name}说你没必要这样，却把那张辩论赛照片留在了书里。", { stats: { mood: 4, study: 5 }, affinity: { academic: 9, leadership: -1 } }),
      ]),
      c("bring_them_together", "把两个人约到同一条走廊", [
        o("two_excellences", "你让他们互相看完对方最在意的东西。最后两个人没有握手，也没有道歉，只约定下一次同时在名单上出现。", { stats: { study: 4, mood: 6 }, affinity: { academic: 5, leadership: 5 }, flags: ["peacemaker"] }),
      ]),
    ],
  },
  {
    id: "cross_class_competition",
    category: "friendship",
    crossCharacter: true,
    title: "班级对抗赛",
    chapters: [4, 5, 6],
    weight: 10,
    text: "分班后的班级对抗赛把{sports.name}和{leadership.name}放到了两边。一个想赢，一个更在意规则。比赛开始前，他们分别来找你，问你会站在哪一边。",
    choices: [
      c("stand_with_sports", "去看{sports.name}的比赛", [
        o("sports_side", "你站在场边为{sports.name}加油。比赛结束后，{leadership.name}带着自己班的人从另一边离场，只回头看了你一眼。", { stats: { stamina: 5, mood: 5 }, affinity: { sports: 9, leadership: -2 } }),
      ]),
      c("stand_with_leader", "去帮{leadership.name}维持秩序", [
        o("leader_side", "你没有参加加油，只在混乱时站出来维持秩序。{sports.name}赢了比赛，却赛后问你为什么站在对面。", { stats: { mood: 4, study: 3 }, affinity: { leadership: 9, sports: -1 } }),
      ]),
      c("make_a_draw", "让双方都接受一场平局", [
        o("both_sides", "比赛最后握手言和。没有人真正满意，但当天晚上两班一起在操场吃了庆功蛋糕。{leadership.name}和{sports.name}谁也不承认这是你促成的。", { stats: { mood: 7 }, affinity: { sports: 5, leadership: 5 }, flags: ["peacemaker", "campus_legend"] }),
      ]),
    ],
  },
  {
    id: "cross_rumor_two",
    category: "chance",
    crossCharacter: true,
    title: "两张被拼在一起的照片",
    chapters: [4, 5, 6],
    weight: 9,
    text: "校园论坛上出现一张把{arts.name}和{music.name}拼在一起的照片，配文说他们关系不一般。照片是假的，讨论却越来越真。两个人一个想解释，一个想彻底不理。",
    choices: [
      c("clear_it_up", "公开说明照片是伪造的", [
        o("rumor_stopped", "你带着原图和论坛截图去找老师，澄清贴很快发出。{arts.name}说你太冲动，{music.name}却说，至少这次有人替他们说话了。", { stats: { mood: 7 }, affinity: { arts: 5, music: 6 }, flags: ["stood_up", "peacemaker"] }),
      ]),
      c("ignore_it", "建议两个人等热度过去", [
        o("rumor_faded", "帖子几天后沉下去，但两个人之间确实多了一点说不清的尴尬。你偶尔会想，如果当时做了别的选择，会不会更好。", { stats: { mood: -2, study: 2 }, affinity: { arts: 1, music: 1 } }),
      ]),
      c("find_the_uploader", "自己查是谁发的", [
        o("found_uploader", "你顺着一串线索找到了发帖的人，却选择没有公开姓名，只让对方删帖道歉。{music.name}说你比看上去更狠，{arts.name}笑得停不下来。", { stats: { study: 4, mood: 8 }, affinity: { arts: 6, music: 5 }, flags: ["campus_legend"] }),
      ]),
    ],
  },
  {
    id: "cross_five_people",
    category: "friendship",
    crossCharacter: true,
    title: "五个人的群聊",
    chapters: [5, 6],
    weight: 10,
    text: "毕业前，五个人的群聊突然安静了。有人准备离开，有人忙着考试，有人删掉了以前发过的玩笑。你知道如果没人先开口，这个群可能真的会停在那一天。",
    choices: [
      c("call_a_meeting", "把五个人约回天台", [
        o("rooftop_reunion", "没有人准备煽情，大家只是带着零食坐成一圈。聊到天黑时，{leadership.name}说以后群名不许改，{sports.name}说谁退群谁请客。你忽然知道，这段关系还没结束。", { stats: { mood: 12 }, affinity: { arts: 4, academic: 4, sports: 4, leadership: 4, music: 4 }, flags: ["campus_legend", "promise_reunion"] }),
      ]),
      c("send_old_photo", "把高一开学的合照发进群里", [
        o("old_photo", "照片里的每个人都穿着不合身的校服。沉默了几分钟后，{music.name}先发了一串省略号，接着所有人都开始翻旧照片。", { stats: { mood: 9 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 } }),
      ]),
      c("say_nothing", "把手机放下，等别人先开口", [
        o("silent_group", "群聊一直安静到毕业。你偶尔想起那天，却不知道该从哪里重新开始。", { stats: { mood: -3 } }),
      ]),
    ],
  },
  {
    id: "cross_graduation_group_choice",
    category: "relationship",
    crossCharacter: true,
    title: "毕业旅行的最后一个名额",
    chapters: [5, 6],
    weight: 12,
    text: "毕业旅行只剩最后一个名额。{leadership.name}在统计名单，{sports.name}和{music.name}都以为你已经答应和他们一组，{arts.name}和{academic.name}则还在等你确认。五个人的群聊第一次出现了没人愿意先说话的三分钟。",
    choices: [
      c("choose_one_group", "公开选择一个小组", [
        o("chosen_group", "你说出了自己的选择，也向其他人逐个解释。有人失望，但没有人真的离开。出发那天，五个人的座位仍然在同一节车厢。", { stats: { mood: 8 }, affinity: { arts: 3, academic: 3, sports: 3, leadership: 3, music: 3 }, flags: ["promise_reunion"] }),
      ]),
      c("drop_the_trip", "主动退出，让他们不用为难", [
        o("gave_up_trip", "你没有去毕业旅行。后来群里发来很多照片，每个人都给你留了一个空位，却没有人真的能替你坐在那里。", { stats: { mood: -4, study: 3 } }),
      ]),
      c("make_a_new_plan", "重新做一份五个人都能参加的行程", [
        o("five_people_trip", "你熬夜重排路线，把预算和座位全部重新算了一遍。最后五个人挤在同一间青旅房间里打牌到天亮，像毕业还没有真正到来。", { stats: { study: 4, mood: 12 }, affinity: { arts: 4, academic: 4, sports: 4, leadership: 4, music: 4 }, flags: ["campus_legend", "promise_reunion"] }),
      ]),
    ],
  },
];
