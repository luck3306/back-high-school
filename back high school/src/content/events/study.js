import { choice as c, outcome as o, modifier as m } from "../helpers.js";

export const EVENTS = [
  {
    id: "study_month_exam",
    category: "study",
    title: "月考前的走廊",
    chapters: [1, 2, 3],
    weight: 12,
    text: "第一次月考前一晚，{academic.name}把一本写满批注的错题本放在你桌角。他说自己只是顺路，但扉页上分明写着你的名字。走廊尽头的灯一盏盏熄灭，你还有两道函数题没有想明白。",
    choices: [
      c("accept_notes", "接过错题本，和{academic.name}一起复习", [
        o("review_together", "你们把错题拆到最后一盏灯熄灭。{academic.name}没有催你，只在你算对时轻轻敲了敲桌面。你第一次觉得，被看见并不等于被比较。", { stats: { study: 6, mood: 4 }, affinity: { academic: 6 }, flags: ["study_notes"] }),
      ], { npcMinAffinity: { npc: "academic", min: 22 } }),
      c("trust_yourself", "合上本子，按自己的节奏重做", [
        o("breakthrough", "你把那道题重新写了一遍，答案终于和标准过程对上。没有谁替你完成，但那一刻的安静很踏实。", { stats: { study: 9, mood: 3 } }, 55, [m({ minStudy: 52 }, 25)]),
        o("late_night", "你在草稿纸上绕了很久，最后还是留下一个问号。第二天老师讲评时，你把那一步记得格外清楚。", { stats: { study: 3, stamina: -4, mood: -3 } }, 45, [m({ maxMood: 38 }, 18)]),
      ]),
    ],
  },
  {
    id: "study_subject_gap",
    category: "study",
    title: "那张不及格的卷子",
    chapters: [1, 2, 3, 4],
    weight: 11,
    text: "物理卷子发下来时，分数比你想的还低。前排有人倒吸一口气，老师却只是把粉笔放回盒子里，说“现在发现总比六月发现好”。你把卷子折成四折，不想让任何人看见。",
    choices: [
      c("ask_teacher", "放学后去办公室找老师", [
        o("small_steps", "老师没有安慰你太久，只把三道最基础的题重新讲了一遍。你发现不会并不可怕，可怕的是把它藏起来。", { stats: { study: 7, mood: 3 }, flags: ["asked_for_help"] }),
      ]),
      c("hide_it", "把卷子塞进书包最底层", [
        o("quiet_pressure", "你没有告诉任何人。那张卷子像一块小石头，安静地压在书包里，也压在每一次翻开物理书的时候。", { stats: { mood: -5, study: 2 } }),
      ]),
      c("ask_arts", "找{arts.name}借她的笔记", [
        o("colorful_notes", "{arts.name}的笔记边缘画满了小太阳。她说物理和拍照一样，先要对焦，再按下快门。你被这个比喻逗笑了。", { stats: { study: 5, mood: 5 }, affinity: { arts: 5 } }),
      ]),
    ],
  },
  {
    id: "study_blackout",
    category: "study",
    title: "晚自习停电",
    chapters: [2, 3, 4, 5],
    weight: 9,
    text: "整栋教学楼忽然暗下来。有人欢呼，有人打开手机灯。老师还没回来，黑板上留着半道没讲完的立体几何题。黑暗让每个人说话的声音都近了一点。",
    choices: [
      c("lead_review", "站到黑板前，带大家过一遍错题", [
        o("unexpected_teacher", "你举着手机灯讲得磕磕绊绊，却把思路讲清楚了。灯亮起来时，班里有人给你鼓掌。", { stats: { study: 6, mood: 7 }, affinity: { academic: 4, sports: 2 }, flags: ["stood_up"] }, 62, [m({ minMood: 50 }, 20), m({ minStudy: 55 }, 12)]),
        o("blank_mind", "刚写下一个字，脑子就空了。你尴尬地退回座位，但{academic.name}接过话头，没有让你一个人停在那里。", { stats: { mood: -3, study: 2 }, affinity: { academic: 4 } }, 38, [m({ maxMood: 42 }, 15)]),
      ], { minMood: 45 }),
      c("share_phone_light", "把手机灯借给同桌", [
        o("small_kindness", "同桌借着你的光抄完了笔记，小声说了句谢谢。黑暗里没有人看见你的表情。", { stats: { mood: 5 }, affinity: { arts: 2, sports: 2 } }),
      ]),
    ],
  },
  {
    id: "study_contest_slot",
    category: "study",
    title: "竞赛名额",
    chapters: [2, 3, 4, 5],
    weight: 9,
    text: "竞赛班多出一个名额。{academic.name}说老师让他再找一个人试试，但周六的培训会占掉整个下午。你想起自己还有一张没有补完的物理卷，也想起篮球场上的约。",
    choices: [
      c("take_the_slot", "报名，去试试看", [
        o("make_the_cut", "第一轮测试比想象中顺利。你从教室出来时，{academic.name}已经在门口等了一会儿，手里拿着两罐汽水。", { stats: { study: 9, stamina: -4, mood: 4 }, affinity: { academic: 7 }, flags: ["contest_team"] }, 65, [m({ minStudy: 58 }, 20)]),
        o("learn_from_failure", "你在第二轮被淘汰，但认识了自己真正薄弱的地方。{academic.name}没有说可惜，只把培训资料留给了你。", { stats: { study: 4, mood: -3 }, affinity: { academic: 5 } }, 35),
      ]),
      c("keep_my_weekend", "把下午留给球场和朋友", [
        o("another_route", "周六的球场很热闹。你投丢了很多球，却在跑动里把一整周的闷气都甩了出去。", { stats: { stamina: 7, mood: 6 }, affinity: { sports: 5 } }),
      ]),
    ],
  },
  {
    id: "study_lost_notes",
    category: "study",
    title: "失踪的错题本",
    chapters: [2, 3, 4, 5],
    weight: 8,
    text: "你找不到那本记了半年的错题本。桌上、抽屉、讲台都翻过了。{academic.name}说他最后一次见到它，是在你上周去医院时，{arts.name}帮你收过东西。",
    choices: [
      c("ask_arts", "先去问问{arts.name}", [
        o("found_in_camera_bag", "错题本被夹在她的相机包里。她一脸抱歉，说那天急着去拍照，顺手塞错了地方。", { stats: { mood: 2 }, affinity: { arts: 4 } }),
      ]),
      c("search_alone", "不声张，自己重新整理", [
        o("rebuild_notes", "你花了两晚重新抄写错题。过程很慢，却让你把这些题真正又过了一遍。", { stats: { study: 7, stamina: -5, mood: -2 } }),
      ]),
      c("trust_academic", "请{academic.name}陪你一起找", [
        o("quiet_search", "你们在空教室里翻了一小时。最后{academic.name}在窗台的书堆里找到它，只说了一句：“以后别乱放。”", { stats: { mood: 4 }, affinity: { academic: 6 } }),
      ]),
    ],
  },
  {
    id: "study_recommendation",
    category: "study",
    title: "保送传闻",
    chapters: [4, 5, 6],
    weight: 9,
    text: "年级里忽然传开保送名额的消息。走廊上每个人都像在讨论别人的未来。{academic.name}从办公室出来，脸色比平时更平静。你问他发生了什么，他说“没什么”，却没有立刻走开。",
    choices: [
      c("stay_with_him", "陪他在窗边站一会儿", [
        o("shared_silence", "你们谁都没有继续追问。风把走廊里的纸屑吹来吹去。过了一会儿，他说谢谢，你也没问他为什么。", { stats: { mood: 5 }, affinity: { academic: 9 }, flags: ["academic_trust"] }),
      ]),
      c("ask_directly", "直接问他是否拿到了名额", [
        o("honest_answer", "他看了你很久，才说名额不是他的。你意识到自己问得太快，但也因此看见了他不习惯示弱的一面。", { stats: { mood: -2, study: 2 }, affinity: { academic: 4 } }),
      ]),
      c("focus_on_yourself", "回到座位，继续自己的复习", [
        o("own_pace", "你没有参与传闻。晚自习结束时，你完成了当天的最后一套卷子。别人的路再快，也不能替你走完自己的。", { stats: { study: 6, mood: 2 } }),
      ]),
    ],
  },
];
