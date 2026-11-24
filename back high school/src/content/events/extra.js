import { choice as c, outcome as o, modifier as m } from "../helpers.js";

export const EVENTS = [
  {
    id: "extra_study_quiz_relay",
    category: "study",
    title: "课堂抢答赛",
    chapters: [1, 2, 3, 4],
    weight: 10,
    text: "数学老师临时把复习课改成抢答赛。你们被分成两组，黑板上的题一道比一道难。最后一题只剩十秒，所有人都看向还没有举手的你。",
    choices: [
      c("take_the_last_answer", "举手，把最后一个答案写上去", [
        o("class_upset", "你写下关键一步，教室里先安静了一秒，随后爆发出掌声。老师推了推眼镜，说这题可以作为标准答案。", { stats: { study: 10, mood: 8 }, affinity: { academic: 5, arts: 3, sports: 3 }, flags: ["exam_top", "public_praise"] }, 58, [m({ minStudy: 55 }, 24), m({ trait: "photographic" }, 8)]),
        o("near_miss", "答案差了一个符号，但全班已经因为你的勇气开始起哄。老师笑着说，至少这十秒没白紧张。", { stats: { study: 4, mood: 4 } }, 42),
      ]),
      c("pass_to_academic", "把机会交给{academic.name}", [
        o("team_answer", "{academic.name}写完答案，回头把粉笔递给你，让你补上结论。老师说这分算两个人的。", { stats: { study: 6, mood: 4 }, affinity: { academic: 7 } }),
      ]),
    ],
  },
  {
    id: "extra_study_mock_ranking",
    category: "study",
    title: "模拟考榜单",
    chapters: [3, 4, 5, 6],
    weight: 12,
    text: "年级榜贴出来时，走廊挤得水泄不通。你从人群最后往前看，先看见熟悉的名字，再看见一个从未出现在这个位置的自己。",
    choices: [
      c("look_closer", "挤到最前面确认名字", [
        o("black_horse", "你的名字真的进了前十。有人回头找你，有人拍你的肩。那一刻你忽然觉得，过去那些没人看见的夜晚都有了回声。", { stats: { study: 12, mood: 12 }, affinity: { academic: 4 }, flags: ["exam_top", "public_praise"] }, 55, [m({ minStudy: 62 }, 28)]),
        o("steady_climb", "名次比上次进步了二十多名。没有人大声祝贺，但你自己知道这一步有多重。", { stats: { study: 8, mood: 6 }, flags: ["public_praise"] }, 45),
      ]),
      c("walk_away", "不看榜，回教室继续做题", [
        o("quiet_grind", "你从人群外绕开。晚自习时班主任把成绩单放在你桌上，你才发现自己比想象中走得更远。", { stats: { study: 7, mood: 3 } }),
      ]),
    ],
  },
  {
    id: "extra_romance_fireworks",
    category: "romance",
    title: "校庆烟花下的三分钟",
    chapters: [2, 3, 4, 5],
    weight: 10,
    npc: "arts",
    text: "校庆结束时，操场上放起了烟花。{arts.name}举着相机站在人群外，忽然回头叫你。周围太吵，她靠近了一点，说想拍一张有你的照片。",
    choices: [
      c("stand_beside_her", "站到她身边，看向镜头", [
        o("photo_in_fireworks", "快门亮起时，她没有看镜头，而是在看你。照片后来被洗出来，背面写着“校庆，烟花，和你”。", { stats: { mood: 11 }, affinity: { arts: 12 }, flags: ["romance_arts", "romance_public"] }),
      ]),
      c("take_her_photo", "接过相机，先拍她", [
        o("her_smile", "{arts.name}在烟花下笑得没有防备。你把相机还给她时，她问要不要把这张设成屏保。", { stats: { mood: 8 }, affinity: { arts: 8 } }),
      ]),
    ],
  },
  {
    id: "extra_romance_infirmary",
    category: "romance",
    title: "医务室门口",
    chapters: [2, 3, 4, 5],
    weight: 10,
    npc: "sports",
    text: "{sports.name}训练时扭伤了脚，却坚持说自己能走。医务室门口，他扶着墙站了一会儿，额头全是汗。你第一次看见这个总跑在最前面的人露出一点无措。",
    choices: [
      c("carry_his_bag", "替他拿包，陪他慢慢走", [
        o("slow_steps", "你们走得很慢。{sports.name}一路嘴硬，快到楼下时却小声说，有你在好像没那么疼。", { stats: { mood: 9, stamina: 2 }, affinity: { sports: 11 }, flags: ["romance_sports"] }),
      ]),
      c("call_team", "叫队友来帮忙", [
        o("team_care", "几个人七手八脚把他扶回宿舍。{sports.name}嘴上嫌你们小题大做，晚上却在群里发了一句：今天谢谢。", { stats: { mood: 5 }, affinity: { sports: 6, academic: 2 } }),
      ]),
      c("push_him_to_rest", "要求他退出下一场比赛", [
        o("hard_care", "他沉默了很久，最后把护腕摘下来交给你保管。你说等伤好再还，他点头时没有逞强。", { stats: { mood: 4 }, affinity: { sports: 8 }, flags: ["opened_up"] }),
      ]),
    ],
  },
  {
    id: "extra_club_debate",
    category: "club",
    title: "辩论赛最后一轮",
    chapters: [2, 3, 4, 5],
    weight: 11,
    text: "校辩论赛决赛，你被临时推上结辩位。对方刚刚用一段极有煽动力的发言赢得掌声，计时器只剩四十秒。你手里只有一张写到一半的卡片。",
    choices: [
      c("drop_the_notes", "扔开卡片，直接回应对方", [
        o("comeback_win", "你没有背稿，而是把对方逻辑里最隐蔽的漏洞一层层拆开。最后一句话落下时，评委先鼓了掌。最佳辩手写的是你的名字。", { stats: { study: 9, mood: 13 }, affinity: { academic: 6, arts: 4 }, flags: ["contest_winner", "public_praise"] }, 60, [m({ minStudy: 58 }, 22), m({ minStudy: 60 }, 12)]),
        o("close_second", "你完成了结辩，但比赛还是以微弱差距输了。走下台时，队友却把队旗披在你肩上。", { stats: { mood: 5 }, affinity: { arts: 3, sports: 2 } }, 40),
      ]),
      c("use_the_notes", "按准备好的结构讲完", [
        o("solid_speech", "你的发言没有失误。评委说逻辑完整但缺少一点冒险，你笑着接受了这个评价。", { stats: { study: 6, mood: 5 }, affinity: { academic: 4 } }),
      ]),
    ],
  },
  {
    id: "extra_club_band",
    category: "club",
    title: "主唱失声以后",
    chapters: [2, 3, 4, 5],
    weight: 10,
    text: "校园音乐节开场前，主唱突然失声。台下已经坐满，负责人急得直掉眼泪。曲目单传到你手里，副歌部分只有你练过。",
    choices: [
      c("go_on_stage", "拿起话筒顶上", [
        o("stage_ovation", "第一句有些发抖，第二句开始全场跟唱。灯光落在你身上时，你第一次发现害怕也可以和兴奋同时存在。", { stats: { mood: 14, stamina: -3 }, affinity: { arts: 7, sports: 5 }, flags: ["stage_spotlight", "public_praise"] }, 60, [m({ minMood: 55 }, 19), m({ minMood: 45 }, 12)]),
        o("rough_song", "你唱得不算完美，但完整撑到了最后。散场时仍有人跑来说，今天最难忘的就是这一首。", { stats: { mood: 8 }, affinity: { arts: 4, sports: 4 }, flags: ["stage_spotlight"] }, 40),
      ]),
      c("save_the_show_other_way", "调整节目顺序，给主唱争取恢复时间", [
        o("quiet_save", "你没有上台，却把整场流程重新排好。演出顺利结束时，负责人抱住你说，救命恩人。", { stats: { mood: 7, study: 3 }, affinity: { arts: 5, academic: 3 }, flags: ["group_project"] }),
      ]),
    ],
  },
  {
    id: "extra_friend_secret_base",
    category: "friendship",
    title: "天台上的秘密基地",
    chapters: [1, 2, 3, 4, 5],
    weight: 9,
    text: "你们发现了一扇通往天台的小门。三个人把旧纸箱铺在地上，约定这里是只属于你们的秘密基地。班主任的脚步声从楼下传来时，所有人同时屏住呼吸。",
    choices: [
      c("bring_snacks", "第二天带零食过来", [
        o("secret_feast", "你们在天台分完一整袋薯片。风把包装纸吹得满地跑，笑声响得差点暴露位置。那天的夕阳像专门为你们留的。", { stats: { mood: 10 }, affinity: { arts: 5, academic: 4, sports: 5 }, flags: ["campus_legend"] }),
      ]),
      c("write_rules", "认真制定秘密基地规则", [
        o("three_rules", "你写下三条规则：不逃课、不留垃圾、不把对方一个人留在这里。最后一条被{sports.name}圈了两遍。", { stats: { mood: 7 }, affinity: { arts: 3, academic: 5, sports: 5 } }),
      ]),
    ],
  },
  {
    id: "extra_friend_transfer",
    category: "friendship",
    title: "转学传闻",
    chapters: [2, 3, 4, 5],
    weight: 10,
    text: "班主任无意中提到，班里可能有人要转学。消息传开后，所有人都开始猜。{arts.name}看起来若无其事，{academic.name}一整天没说话，{sports.name}则把篮球砸了两次篮筐。",
    choices: [
      c("ask_them_directly", "把三个人叫到一起问清楚", [
        o("stay_together", "转学的人最终不是你熟悉的任何一个。那晚你们还是在操场坐了很久，约定不管谁先离开，都要回来参加毕业照。", { stats: { mood: 7 }, affinity: { arts: 5, academic: 5, sports: 5 }, flags: ["promise_reunion"] }),
      ]),
      c("stay_with_arts", "先去找看起来最平静的{arts.name}", [
        o("arts_confession", "{arts.name}说自己没事，却在你转身时抓住你的袖子。她承认害怕被留下。你陪她把那天的课一节一节上完。", { stats: { mood: 8 }, affinity: { arts: 10 } }),
      ]),
      c("stay_with_academic", "去问一整天没说话的{academic.name}", [
        o("academic_answer", "{academic.name}说不是他，但他忽然问你：如果有一天真的要走，你会不会记得。你没有回答，只把他的笔记本拿过来，在扉页写下自己的名字。", { stats: { mood: 8 }, affinity: { academic: 10 } }),
      ]),
    ],
  },
  {
    id: "extra_family_trip_cost",
    category: "family",
    title: "研学旅行的费用",
    chapters: [1, 2, 3, 4],
    weight: 9,
    text: "班级要组织外地研学，费用不算低。你在报名表上停住，想到家里最近的开支，也想到朋友已经在讨论要坐哪一排。",
    choices: [
      c("ask_family", "回家坦白问家里的意见", [
        o("family_honesty", "家人没有立刻回答。第二天早饭时，他们把报名费放进你书包，说是提前存下的。你忽然不知道该说什么。", { stats: { mood: 7 }, flags: ["family_trust"] }),
      ]),
      c("find_a_way", "去问老师有没有勤工或减免名额", [
        o("teacher_help", "老师没有让你难堪，只把一份校内志愿服务名单递给你。你靠自己的劳动换到了部分费用。", { stats: { mood: 9, study: 2 }, flags: ["own_path"] }),
      ]),
      c("stay_home", "放弃这次旅行", [
        o("missed_trip", "朋友们出发那天，你在空教室里做题。回来以后，他们给你带了一块当地的小石头，放在笔袋里刚好合适。", { stats: { mood: -3, study: 3 }, affinity: { arts: 2, sports: 2 } }),
      ]),
    ],
  },
  {
    id: "extra_family_backstage",
    category: "family",
    title: "家长开放日",
    chapters: [2, 3, 4, 5],
    weight: 9,
    text: "家长开放日，你被安排展示自己的学习成果。教室后面坐着一排家长，家人的空位格外明显。你讲到一半，后门忽然被轻轻推开。",
    choices: [
      c("keep_going", "继续讲，当没看见", [
        o("late_arrival", "讲完后你才发现家人一直站在最后面。对方说路上堵车，但全程都听见了。你点点头，心里的那口气终于放下。", { stats: { mood: 9 }, affinity: { arts: 2, academic: 2 }, flags: ["family_trust"] }),
      ]),
      c("acknowledge_them", "停下来，向家人点头", [
        o("public_support", "你当着全班说了一句谢谢。老师带头鼓掌，家人有些不好意思地笑了。", { stats: { mood: 7 }, flags: ["family_pride", "public_praise"] }),
      ]),
      c("finish_without_looking", "讲完，不抬头看门口", [
        o("unseen_effort", "你完成了展示，但直到放学都没有和那个人说上话。书包里多了一瓶你喜欢的饮料，水珠已经干了。", { stats: { mood: 2 } }),
      ]),
    ],
  },
  {
    id: "extra_chance_anonymous_list",
    category: "chance",
    title: "一张匿名榜单",
    chapters: [2, 3, 4, 5],
    weight: 8,
    text: "班里忽然出现一张匿名榜单，把所有人按“最受欢迎”“最会学习”“最没有存在感”分类。你的名字被写在最后一栏。教室里有人笑，有人装作没看见。",
    choices: [
      c("tear_it_down", "把榜单撕掉，直接站到讲台上", [
        o("say_it_out_loud", "你说不喜欢这种拿别人取乐的方式。教室里安静下来，写榜单的人始终没有站出来，但第二天那张纸再也没有出现过。", { stats: { mood: 8 }, affinity: { arts: 4, academic: 4, sports: 5 }, flags: ["stood_up", "public_praise"] }),
      ]),
      c("ignore_it", "装作不在意，把书翻到下一页", [
        o("swallow_it", "你告诉自己这很幼稚，可那一整天都记得自己的名字被写在最后。放学时，{academic.name}在你桌上放了一张纸条：他们写的不算。", { stats: { mood: -4, study: 2 }, affinity: { academic: 4 } }),
      ]),
      c("make_a_new_one", "第二天贴一张写满每个人优点的榜单", [
        o("better_list", "你花了整晚观察每个人。新榜单贴出来后，全班围了很久，最后有人拿了笔，在旁边补上你的名字。", { stats: { mood: 10 }, affinity: { arts: 5, academic: 4, sports: 4 }, flags: ["campus_legend"] }),
      ]),
    ],
  },
  {
    id: "extra_chance_graduation_speech",
    category: "chance",
    title: "毕业典礼代表发言",
    chapters: [4, 5, 6],
    weight: 9,
    text: "年级组在征集毕业典礼学生发言。班主任把通知贴在墙上，没人主动报名。你站在那张纸前，想起三年前第一次走进校门时，连问路都不敢。",
    choices: [
      c("sign_your_name", "报名，代表大家发言", [
        o("graduation_voice", "毕业典礼那天，你讲起晚自习的灯光、操场上的风，还有没有说完的话。台下第一次没有任何人低头看手机。", { stats: { mood: 12, study: 3 }, affinity: { arts: 4, academic: 4, sports: 4 }, flags: ["public_praise", "stage_spotlight"] }, 63, [m({ minMood: 55 }, 18), m({ minMood: 45 }, 10)]),
        o("nervous_voice", "你紧张得漏掉了一段，但最后还是把最后一句说完了。台下仍有人为你鼓掌。", { stats: { mood: 6 }, flags: ["stood_up"] }, 37),
      ]),
      c("recommend_academic", "推荐{academic.name}代表发言", [
        o("academic_speech", "{academic.name}在台上念到一半，忽然加了一句没有写在稿子里的话：谢谢那个总在我旁边写题的人。礼堂里没人知道他说的是谁，你知道。", { stats: { mood: 8 }, affinity: { academic: 10 } }),
      ]),
    ],
  },
];

