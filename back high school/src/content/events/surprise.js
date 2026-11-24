import { choice as c, outcome as o, modifier as m } from "../helpers.js";

export const EVENTS = [
  {
    id: "surprise_exam_leak",
    category: "study",
    surprise: true,
    title: "模拟考泄题风波",
    chapters: [1, 2, 3, 4, 5],
    weight: 12,
    text: "期中模拟考前，校内突然传出泄题消息。有人私下拿到了所谓“标准答案”，走廊里的气氛变得诡异。教导主任开始逐个班级调查，而你的桌洞里也被人塞进一份复印纸。",
    choices: [
      c("hand_it_in", "当场把复印纸交给老师", [
        o("clear_name", "你主动说明来源。调查最终找到了传播答案的人，年级会上点名表扬了你的处理方式。你的名字第一次以“值得信任”的方式被所有人听见。", { stats: { study: 8, mood: 12 }, flags: ["public_praise", "stood_up"] }),
      ]),
      c("destroy_it", "撕掉纸张，靠自己考", [
        o("hard_but_clean", "你考得并不轻松，但每一分都属于自己。成绩出来时，{academic.name}看了你很久，说这才像你。", { stats: { study: 7, mood: 6 }, affinity: { academic: 6 }, flags: ["exam_top"] }, 60),
      ]),
      c("read_it_secretly", "先看一眼再说", [
        o("guilty_score", "你看见了几道原题，考试时却一直不敢抬头。分数比平时高，老师表扬你时，你只觉得脸发烫。", { stats: { study: 4, mood: -8 } }),
      ]),
    ],
  },
  {
    id: "surprise_contest_final",
    category: "study",
    surprise: true,
    title: "竞赛决赛最后三十秒",
    chapters: [3, 4, 5, 6],
    weight: 12,
    text: "竞赛决赛最后一题只剩三十秒。你们队的解法卡在一个关键步骤，{academic.name}的笔停在半空。台下全是观众，计时器的数字一格一格往下跳。",
    choices: [
      c("trust_the_insight", "把刚才想到的思路写上去", [
        o("contest_champion", "你补上的那一步让整道题豁然开朗。宣布名次时，你们队拿到第一。{academic.name}把奖杯先递给了你，自己退到人群后面笑。", { stats: { study: 13, mood: 12 }, affinity: { academic: 10, arts: 4, sports: 4 }, flags: ["contest_winner", "public_praise"] }, 55, [m({ minStudy: 65 }, 25), m({ trait: "calm" }, 10)]),
        o("miss_by_one", "你们以一名之差输掉比赛。赛后{academic.name}说，最后那一步虽然不是答案，但他会一直记得你举起笔的样子。", { stats: { study: 7, mood: 3 }, affinity: { academic: 6 } }, 45),
      ]),
      c("let_academic_decide", "把最后三十秒交给他", [
        o("trusted_team", "{academic.name}写下了另一种解法，你们拿到二等奖。他没有居功，只问你下次还来不来。", { stats: { study: 8, mood: 6 }, affinity: { academic: 8 }, flags: ["contest_team"] }),
      ]),
    ],
  },
  {
    id: "surprise_sports_final",
    category: "club",
    surprise: true,
    title: "校运会最后一棒",
    chapters: [1, 2, 3, 4, 5],
    weight: 12,
    text: "校运会 4×100 米接力，最后一棒原本属于{sports.name}。他在检录前脚踝复发，队医说不能跑。全班的目光落在你身上，接力棒被塞进手里，掌心的汗让木棒变得发滑。",
    choices: [
      c("run_the_last_leg", "站上最后一棒的位置", [
        o("come_from_behind", "你接棒时落后半个直道。最后二十米，你几乎听不见任何声音，只知道前面那个背影正在变近。冲线那一刻，全班冲进了跑道。", { stats: { stamina: 14, mood: 15 }, affinity: { sports: 12, arts: 5, academic: 4 }, flags: ["sports_hero", "public_praise", "campus_legend"] }, 52, [m({ minStamina: 60 }, 28), m({ trait: "resilient" }, 12)]),
        o("finish_anyway", "你没有追上第一名，但守住了班级名次。{sports.name}在终点抱住你，说这已经是他的冠军。", { stats: { stamina: 7, mood: 8 }, affinity: { sports: 9 }, flags: ["team_goal"] }, 48),
      ]),
      c("give_baton_to_substitute", "把机会交给替补队员", [
        o("team_decision", "替补队员跑出了个人最好成绩。你坐在看台上和{sports.name}一起喊到嗓子哑，最终班级拿到第三。", { stats: { mood: 6 }, affinity: { sports: 4, arts: 2, academic: 2 }, flags: ["team_goal"] }),
      ]),
    ],
  },
  {
    id: "surprise_stage_blackout",
    category: "club",
    surprise: true,
    title: "舞台突然断电",
    chapters: [2, 3, 4, 5],
    weight: 12,
    text: "校庆汇演进行到一半，舞台灯光和音响同时熄灭。台下开始骚动，主持人也被困在侧幕。黑暗里，有人小声哭了起来。你手里握着刚才彩排时用过的话筒，不知道它还有没有声音。",
    choices: [
      c("sing_without_music", "清唱第一句，把大家带回台上", [
        o("whole_hall_sings", "你的声音从黑暗里亮起来。第二句时，台上的人跟上，第三句时，台下也开始了合唱。灯重新亮起的一刻，整个礼堂都在鼓掌。", { stats: { mood: 15 }, affinity: { arts: 8, sports: 5, academic: 3 }, flags: ["stage_spotlight", "public_praise", "campus_legend"] }, 57, [m({ minMood: 58 }, 22), m({ interest: "arts" }, 10)]),
        o("calm_crowd", "你走到台前，和大家聊起排练时的糗事。灯亮起来时，骚动已经变成笑声。主持人说这是今晚最意外也最成功的串场。", { stats: { mood: 9 }, affinity: { arts: 5, sports: 4 }, flags: ["public_praise"] }, 43),
      ]),
      c("find_the_teacher", "摸黑去找负责人", [
        o("backstage_hero", "你在侧幕找到负责人，协助恢复备用电源。演出重新开始后，没有人知道你在黑暗里跑了多少趟。", { stats: { stamina: 4, mood: 7, study: 2 }, flags: ["group_project"] }),
      ]),
    ],
  },
  {
    id: "surprise_photo_rumor",
    category: "romance",
    surprise: true,
    npc: "arts",
    title: "被传开的照片",
    chapters: [2, 3, 4, 5],
    weight: 11,
    text: "{arts.name}在操场给你拍的一张照片被人发进了年级群。照片里你们靠得很近，配文却写成了另一个版本。消息越传越快，{arts.name}下午没有来上课。",
    choices: [
      c("stand_up_for_her", "在年级群里公开回应，去找她", [
        o("public_protection", "你把原图和经过说明清楚，也第一次当众说，不希望任何人拿她取乐。群里安静下来。你在天台找到{arts.name}时，她红着眼睛问你为什么这么刚。", { stats: { mood: 11 }, affinity: { arts: 14 }, flags: ["romance_arts", "romance_public", "stood_up"] }),
      ]),
      c("find_her_first", "先找到{arts.name}，再决定怎么办", [
        o("private_trust", "{arts.name}把相机抱在怀里，说想把那条消息删掉。你陪她去找老师处理。事情没有闹大，但她一路都把伞往你这边偏。", { stats: { mood: 7 }, affinity: { arts: 10 }, flags: ["romance_arts"] }),
      ]),
      c("ignore_the_rumor", "等热度过去", [
        o("rumor_stays", "几天后群里不再讨论，但{arts.name}也恢复了那种对谁都礼貌的距离。你看着她的背影，第一次后悔自己什么都没做。", { stats: { mood: -4 }, affinity: { arts: -6 } }),
      ]),
    ],
  },
  {
    id: "surprise_academic_breakdown",
    category: "friendship",
    surprise: true,
    npc: "academic",
    title: "{academic.name}没有考第一",
    chapters: [3, 4, 5, 6],
    weight: 11,
    text: "月考放榜，{academic.name}第一次跌出年级前三。所有人都在看他，老师也把他叫去办公室。晚自习结束后，你发现他一个人坐在空教室里，面前的卷子一个字都没改。",
    choices: [
      c("sit_beside_him", "什么都不问，坐到旁边", [
        o("not_a_score", "过了很久，{academic.name}忽然说，他怕自己除了成绩什么都不是。你告诉他，至少你认识的{academic.name}不是。他没有回答，只把卷子推过来，请你一起看错题。", { stats: { mood: 9, study: 5 }, affinity: { academic: 14 }, flags: ["academic_trust", "opened_up"] }),
      ]),
      c("force_him_to_rest", "拉他去操场走一圈", [
        o("night_walk", "你们绕操场走了很多圈。{academic.name}第一次讲起家里的期待和他害怕的东西。回去时，他把那张卷子留在了课桌里。", { stats: { stamina: 4, mood: 8 }, affinity: { academic: 10 }, flags: ["opened_up"] }),
      ]),
      c("help_with_the_paper", "直接帮他分析错题", [
        o("steady_support", "你陪他把每一道错题拆开。{academic.name}恢复得很快，第二天又把头埋回题海。你知道他没有真的放下，但至少这次不是一个人。", { stats: { study: 8 }, affinity: { academic: 7 } }),
      ]),
    ],
  },
  {
    id: "surprise_sports_injury",
    category: "friendship",
    surprise: true,
    npc: "sports",
    title: "{sports.name}的伤",
    chapters: [2, 3, 4, 5],
    weight: 11,
    text: "{sports.name}在训练中落地不稳，膝盖受伤。医生说要休息至少一个月。他却还在问下周的比赛怎么办。你第一次发现，那个总说“没事”的人也会因为不能上场而沉默。",
    choices: [
      c("stay_with_him", "每天陪他做康复训练", [
        o("rehab_promise", "一个月后，{sports.name}重新站上球场。复出的第一球没有进，他回头先找你。你举起手，他跑过来和你击掌，像赢了决赛。", { stats: { stamina: 6, mood: 10 }, affinity: { sports: 13 }, flags: ["team_goal"] }),
      ]),
      c("take_his_place", "替他守住球队的位置", [
        o("hold_the_team", "你接下训练和组织比赛的任务。{sports.name}坐在场边看着，伤好那天把队长袖标套到了你手臂上，说先借你戴一年。", { stats: { stamina: 10, mood: 9 }, affinity: { sports: 11 }, flags: ["team_goal", "public_praise"] }),
      ]),
      c("tell_him_to_rest", "明确告诉他，不要拿未来冒险", [
        o("hard_truth", "{sports.name}生气了，三天没和你说话。第四天他还是回到医务室，嘴里嘀咕着“只有你会这么管我”。", { stats: { mood: 4 }, affinity: { sports: 7 } }),
      ]),
    ],
  },
  {
    id: "surprise_family_relocation",
    category: "family",
    surprise: true,
    title: "家里要搬去外地",
    chapters: [2, 3, 4, 5],
    weight: 11,
    text: "晚饭时，家人说工作调动手续已经办得差不多，可能要把你一起转去外地。碗里的饭还没吃完，你脑子里已经闪过这所学校里所有人的脸。",
    choices: [
      c("ask_to_stay", "提出留在本校，把三年读完", [
        o("stay_for_high_school", "你和家人谈了很久，最终约定由亲戚照看、每周通话。你留在原来的班级，也第一次为自己的生活做出这么大的决定。", { stats: { mood: 7, study: 4 }, flags: ["own_path", "family_voice"] }),
      ]),
      c("accept_the_move", "接受转学，和家人一起走", [
        o("new_city", "你保留了这个学校的联系方式，也答应朋友会回来。离开那天，三个人都来送你。车开动后，你才发现校服口袋里塞满他们写的纸条。", { stats: { mood: 5 }, affinity: { arts: 4, academic: 4, sports: 4 }, flags: ["promise_reunion"] }),
      ]),
      c("ask_for_a_semester", "争取先留下一个学期", [
        o("one_more_semester", "家人同意你先读完这个学期。你开始比以前更认真地过每一天，连平常觉得无聊的课间都变得珍贵。", { stats: { study: 5, mood: 8 }, affinity: { arts: 3, academic: 3, sports: 3 } }),
      ]),
    ],
  },
  {
    id: "surprise_family_money",
    category: "family",
    surprise: true,
    title: "突然被取消的补习班",
    chapters: [3, 4, 5, 6],
    weight: 10,
    text: "你无意中听见家人打电话，才知道家里最近遇到资金问题，原本续费的补习班只能停掉。家人看到你站在门口，第一反应却是解释“不会影响你学习”。",
    choices: [
      c("say_you_understand", "坦白说已经听见了，并一起想办法", [
        o("share_the_weight", "你和家人一起重新排了学习计划，也主动减少不必要的开销。家人沉默了很久，最后说，你真的长大了。", { stats: { mood: 9, study: 5 }, flags: ["family_trust", "opened_up"] }),
      ]),
      c("promise_to_self_study", "把补习停掉，靠自己补短板", [
        o("self_made_study", "你开始用免费的网课和学校答疑补漏洞。成绩没有立刻飙升，却在一次次小测里稳步往上。", { stats: { study: 10, stamina: -3 }, flags: ["own_path"] }, 62, [m({ minStudy: 52 }, 16)]),
        o("hard_period", "自学并不顺利，你有几次想放弃。但每次看见家人加班回来，你还是把书重新翻开。", { stats: { study: 4, mood: -2 } }, 38),
      ]),
      c("hide_your_worry", "装作什么都不知道", [
        o("kept_it_in", "你继续像以前一样上课、考试。家里的压力没有消失，却因为没人说破，一直悬在每个人头顶。", { stats: { mood: -5, study: 3 } }),
      ]),
    ],
  },
  {
    id: "surprise_broadcast_confession",
    category: "romance",
    surprise: true,
    title: "广播里的匿名告白",
    chapters: [4, 5, 6],
    weight: 10,
    text: "午休广播突然播放了一首你熟悉的歌，主持人说，这是一位同学点给“每天坐窗边的那个人”的。全班开始起哄，三个人的目光几乎同时落到你身上。",
    choices: [
      c("answer_on_air", "去广播站点一首歌回应", [
        o("public_heart", "你没有写名字，只点了一首三个人都听过的歌。回到教室时，{arts.name}低头笑，{academic.name}假装写题，{sports.name}把校服外套盖在了头上。那天的午休，没有人睡着。", { stats: { mood: 12 }, affinity: { arts: 6, academic: 5, sports: 6 }, flags: ["romance_public", "public_praise"] }),
      ]),
      c("find_the_sender", "放学后去找广播站问点歌人", [
        o("private_answer", "点歌的人没有留下姓名，只留了一张写着“毕业前会告诉你”的纸条。你把纸条收进书里，心跳了一整个下午。", { stats: { mood: 9 }, affinity: { arts: 3, academic: 3, sports: 3 } }),
      ]),
      c("pretend_it_is_not_you", "低头继续吃饭", [
        o("missed_signal", "起哄很快过去，午休恢复安静。你却在之后很久都在想，如果当时抬头，会不会看到不一样的答案。", { stats: { mood: 2 } }),
      ]),
    ],
  },
  {
    id: "surprise_class_video",
    category: "friendship",
    surprise: true,
    title: "班级视频突然火了",
    chapters: [5, 6],
    weight: 10,
    text: "校庆时随手拍的班级短片被上传到网上，一夜之间播放量过了十万。评论里有人夸你们真实，也有人说拍得粗糙。班主任问，要不要趁毕业前再拍一部正式的。",
    choices: [
      c("direct_the_final_film", "接下导演和剪辑", [
        o("our_three_years", "你花了两个星期采访全班。成片在毕业典礼播放时，连平时最闹的人都安静了。片尾字幕里，所有人的名字排成一整面墙。", { stats: { mood: 14, study: 3 }, affinity: { arts: 6, academic: 5, sports: 6 }, flags: ["campus_legend", "public_praise", "stage_spotlight"] }, 60, [m({ interest: "arts" }, 20), m({ minStudy: 62 }, 10)]),
        o("rushed_edit", "时间太紧，成片不够完整。但片尾那句“谢谢一起走过”出现时，全班还是鼓掌鼓了很久。", { stats: { mood: 8 }, affinity: { arts: 3, academic: 3, sports: 3 } }, 40),
      ]),
      c("keep_the_original", "保留最粗糙的版本", [
        o("real_youth", "你们没有重拍。视频里晃动的镜头、跑调的歌和突然入镜的老师，反而成了最像青春的部分。", { stats: { mood: 10 }, affinity: { arts: 4, academic: 4, sports: 4 }, flags: ["campus_legend"] }),
      ]),
    ],
  },
  {
    id: "surprise_graduation_rain",
    category: "chance",
    surprise: true,
    title: "毕业彩排的暴雨",
    chapters: [5, 6],
    weight: 10,
    text: "毕业典礼彩排进行到一半，暴雨突然砸下来。音响短路，红毯被水冲得卷起。老师和学生都挤在走廊里，谁都以为典礼要取消。",
    choices: [
      c("move_it_inside", "组织大家把典礼搬进礼堂", [
        o("storm_ceremony", "你拿着名单跑遍整栋楼，协调班级顺序和设备。第二天典礼顺利举行，校长在台上说，这场雨让所有人看见了你们解决问题的能力。", { stats: { study: 4, stamina: 8, mood: 12 }, affinity: { arts: 5, academic: 5, sports: 5 }, flags: ["campus_legend", "public_praise", "group_project"] }, 58, [m({ minStamina: 50 }, 16)]),
        o("small_delay", "典礼晚开始半小时，但没有人缺席。散场时，大家一起把湿透的红毯卷起来。", { stats: { mood: 8 }, affinity: { arts: 3, academic: 3, sports: 3 }, flags: ["group_project"] }, 42),
      ]),
      c("run_into_the_rain", "冲进雨里，把这一刻拍下来", [
        o("rain_photo", "你们在空操场上淋得浑身湿透。{arts.name}用塑料袋护住相机，{academic.name}举着歪掉的伞，{sports.name}在积水里跳得最高。那张照片后来被放大，挂在了毕业典礼入口。", { stats: { mood: 13, stamina: -2 }, affinity: { arts: 7, academic: 5, sports: 7 }, flags: ["campus_legend", "romance_public"] }),
      ]),
    ],
  },
];

