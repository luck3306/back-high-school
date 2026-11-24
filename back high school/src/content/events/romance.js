import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "romance_umbrella",
    category: "romance",
    title: "只剩一把伞",
    chapters: [1, 2, 3, 4],
    weight: 12,
    npc: "arts",
    text: "放学时雨忽然大了起来。{arts.name}站在校门边，手里只有一把透明伞。她把伞往你这边偏了偏，笑着说自己反正要去公交站，淋一点没关系。",
    choices: [
      c("walk_together", "和她一起走进雨里", [
        o("shoulder_to_shoulder", "伞太小，你们的肩膀一路碰在一起。{arts.name}讲到一半忽然安静，雨声把没说完的话填得很满。", { stats: { mood: 8 }, affinity: { arts: 9 }, flags: ["romance_arts"] }),
      ]),
      c("give_her_umbrella", "把伞留给她，自己冲进雨里", [
        o("wet_sleeve", "你跑到车站时袖口全湿了。{arts.name}发来一条消息：伞明天还你。后面跟着一个很长的省略号。", { stats: { stamina: -3, mood: 3 }, affinity: { arts: 5 } }),
      ]),
      c("wait_for_rain", "邀请她一起等雨小", [
        o("after_school_hour", "你们在门卫室旁站了很久。雨没有变小，但校门口的人越来越少，{arts.name}说这是她这周最不赶时间的一刻。", { stats: { mood: 5 }, affinity: { arts: 4 } }),
      ]),
    ],
  },
  {
    id: "romance_radio_song",
    category: "romance",
    title: "广播站的点歌",
    chapters: [2, 3, 4, 5],
    weight: 10,
    npc: "arts",
    text: "午后广播站开放点歌。{arts.name}趴在窗边听了很久，转头问你：“如果有首歌唱给一个人，你会怎么写署名？”她的语气很轻，像只是随口一问。",
    choices: [
      c("request_her_song", "去点一首她提过的歌", [
        o("on_air", "傍晚的广播里，主持人念出“送给{arts.name}”。她从座位上抬起头，隔着两排桌子看你，笑得像偷到了光。", { stats: { mood: 9 }, affinity: { arts: 10 }, flags: ["romance_arts"] }),
      ]),
      c("say_anonymous", "说匿名最安全", [
        o("anonymous_note", "{arts.name}点点头，说匿名确实不会尴尬。你看见她把桌上的歌词纸折起来，塞进了笔袋。", { stats: { mood: -2 }, affinity: { arts: 2 } }),
      ]),
      c("write_for_everyone", "点一首全班都能听的歌", [
        o("whole_class", "广播响起时，全班跟着哼了两句。{arts.name}也笑了，只是没有再看你。", { stats: { mood: 5 }, affinity: { arts: 3, sports: 2 } }),
      ]),
    ],
  },
  {
    id: "romance_draft_paper",
    category: "romance",
    title: "草稿纸的背面",
    chapters: [2, 3, 4, 5],
    weight: 11,
    npc: "academic",
    text: "{academic.name}把一张草稿纸推给你。正面是两道解析几何，背面却画着一只很小的纸鹤。你抬头看他，他立刻说：“别误会，只是随手画的。”",
    choices: [
      c("keep_the_paper", "把纸叠好收进书里", [
        o("paper_crane", "你按折痕把纸鹤折了出来。{academic.name}看见了，没有阻止，只把耳朵转向窗外，像在认真听什么。", { stats: { mood: 7 }, affinity: { academic: 9 }, flags: ["romance_academic"] }),
      ]),
      c("tease_him", "当着他的面把纸鹤折好", [
        o("rare_smile", "{academic.name}盯着那只纸鹤看了几秒，终于笑了。那个笑很轻，却让你一整天都记得。", { stats: { mood: 9 }, affinity: { academic: 7 } }),
      ]),
      c("solve_the_problem", "只把两道题做完", [
        o("no_nonsense", "你把答案写完才把纸推回去。{academic.name}说了句“不错”，语气和平时一样，你却觉得少了点什么。", { stats: { study: 4 }, affinity: { academic: 1 } }),
      ]),
    ],
  },
  {
    id: "romance_rooftop_answer",
    category: "romance",
    title: "天台上的答案",
    chapters: [3, 4, 5, 6],
    weight: 10,
    npc: "academic",
    text: "{academic.name}约你放学后去天台。他手里拿着一本旧笔记，说是整理竞赛资料时翻到的。风把他的校服下摆吹起来，他问你：“你有没有想过，毕业以后我们还会不会联系？”",
    choices: [
      c("tell_truth", "告诉他，你希望会", [
        o("same_answer", "{academic.name}把笔记递给你，说：“那就别弄丢了。”你们都没有把话说得更明白，但答案已经留在风里。", { stats: { mood: 10 }, affinity: { academic: 11 }, flags: ["romance_academic", "rooftop_promise"] }),
      ], { npcMinAffinity: { npc: "academic", min: 35 } }),
      c("make_a_joke", "用玩笑把问题带过去", [
        o("unfinished_joke", "{academic.name}笑了一下，没有追问。下楼时，他走在你前面两级台阶，步子比平时慢。", { stats: { mood: 2 }, affinity: { academic: 3 } }),
      ]),
      c("talk_about_dreams", "先聊各自想去的城市", [
        o("different_cities", "你们说了很多以后，却避开了“我们”这个词。天台的灯亮起来时，{academic.name}把外套递给了你。", { stats: { mood: 6 }, affinity: { academic: 6 } }),
      ]),
    ],
  },
  {
    id: "romance_water_bottle",
    category: "romance",
    title: "最后一瓶水",
    chapters: [1, 2, 3, 4],
    weight: 10,
    npc: "sports",
    text: "篮球训练结束后，{sports.name}把最后一瓶水抛给你。他自己拧开龙头，仰头喝了几口自来水。你看见他额前的汗顺着下颌滴下来，却还笑着说“不渴”。",
    choices: [
      c("give_it_back", "把水递回给他", [
        o("shared_bottle", "{sports.name}愣了一下，还是接过去喝了一口。他说你这个人怎么这样，耳根却红得很明显。", { stats: { stamina: 3, mood: 7 }, affinity: { sports: 9 }, flags: ["romance_sports"] }),
      ]),
      c("sit_on_bleachers", "和他一起坐在看台边", [
        o("sunset_bleachers", "看台上的金属被夕阳晒得温热。{sports.name}把湿毛巾搭在肩上，和你聊了很久以后想去哪座城市。", { stats: { mood: 6, stamina: 2 }, affinity: { sports: 6 } }),
      ]),
      c("say_thanks", "道谢后回教室", [
        o("ordinary_goodbye", "{sports.name}在身后喊了一声“明天见”。你回头时，他已经把篮球投进筐里，像什么都没发生过。", { stats: { stamina: 2 }, affinity: { sports: 2 } }),
      ]),
    ],
  },
  {
    id: "romance_rehearsal",
    category: "romance",
    title: "排练到最后一盏灯",
    chapters: [2, 3, 4, 5],
    weight: 10,
    npc: "sports",
    text: "校庆节目排练被困在一个始终对不齐的节拍上。{sports.name}主动留下来陪你重来。操场的灯已经关了一半，他数拍子的声音在空荡荡的礼堂里格外清楚。",
    choices: [
      c("stay_for_encore", "再练最后一遍", [
        o("perfect_beat", "最后一遍终于对齐了。{sports.name}举起手要和你击掌，你握住了他的手，谁都没有立刻松开。", { stats: { stamina: -3, mood: 9 }, affinity: { sports: 10 }, flags: ["romance_sports"] }),
      ]),
      c("walk_him_home", "结束后陪他走一段路", [
        o("long_way_home", "你绕了远路。{sports.name}嘴上说你家明明在另一边，脚步却一直没有加快。", { stats: { mood: 6 }, affinity: { sports: 6 } }),
      ]),
      c("call_it_a_night", "说明天再练，先回去休息", [
        o("tomorrow_again", "{sports.name}把道具收好，说明天早自习前还能再合一次。你点头，却在回家路上一直想起那个没对上的拍子。", { stats: { stamina: 4, mood: 1 }, affinity: { sports: 2 } }),
      ]),
    ],
  },
];
