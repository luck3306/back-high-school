import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "chance_card",
    category: "chance",
    title: "捡到校园卡",
    chapters: [1, 2, 3, 4, 5],
    weight: 8,
    text: "楼梯口躺着一张校园卡，照片上的人笑得很拘谨。卡套背面贴着一张写着电话号码的小纸条，已经被踩得有些模糊。",
    choices: [
      c("return_it", "按纸条上的号码联系失主", [
        o("returned_card", "失主是隔壁班的人，非要请你喝一瓶汽水。你推辞不过，最后两个人站在小卖部门口聊了半天。", { stats: { mood: 5 } }),
      ]),
      c("hand_to_security", "交给门卫室", [
        o("lost_and_found", "门卫在本子上认真记下时间。你走出几步，听见广播开始寻找失主，忽然觉得这件事做得不错。", { stats: { mood: 3 } }),
      ]),
    ],
  },
  {
    id: "chance_blackboard",
    category: "chance",
    title: "黑板报评比的最后一天",
    chapters: [1, 2, 3, 4, 5],
    weight: 8,
    text: "黑板报评比还剩最后一点内容。负责的同学临时请假，粉笔散在讲台上。窗外已经亮起路灯，教室却还没有人离开。",
    choices: [
      c("finish_it", "留下来把最后一块写完", [
        o("chalk_dust", "你画到手指全是粉笔灰。第二天评比拿了第三名，没有奖杯，但全班在黑板前站了很久。", { stats: { mood: 5, stamina: -2 }, affinity: { arts: 3, sports: 2 }, flags: ["group_project"] }),
      ]),
      c("leave_it", "觉得少一块也没关系", [
        o("blank_corner", "第二天检查时，那个空白角落被老师圈了出来。没有人责怪你，但你记住了那个缺口。", { stats: { mood: -2 } }),
      ]),
    ],
  },
  {
    id: "chance_rain",
    category: "chance",
    title: "暴雨停课",
    chapters: [1, 2, 3, 4, 5],
    weight: 7,
    text: "暴雨让学校临时停课。大家挤在走廊里等家长来接，水面已经漫过操场边沿。你手机快没电了，朋友问你还要不要一起等。",
    choices: [
      c("wait_together", "和朋友们一起等", [
        o("rain_shelter", "你们在走廊上打牌，输了的人去接雨水。雨声很大，笑声更大。直到很久以后，你还记得那天没有上完的课。", { stats: { mood: 8 }, affinity: { arts: 3, academic: 2, sports: 3 } }),
      ]),
      c("brave_the_rain", "顶着雨先回家", [
        o("soaked_home", "你到家时全身湿透，却比平时早了一个小时。洗完澡后看见群里还在说笑，忽然有点想念那截走廊。", { stats: { stamina: -4, study: 2 } }),
      ]),
    ],
  },
  {
    id: "chance_cat",
    category: "chance",
    title: "操场边的猫",
    chapters: [1, 2, 3, 4],
    weight: 7,
    text: "一只橘猫总在操场边晒太阳。今天它蹲在跑道中央，不肯让路。体育老师吹了两次哨，全场都在笑。",
    choices: [
      c("move_it", "轻轻把它抱到树荫下", [
        o("cat_friend", "猫在你怀里挣扎了两下，最后安静下来。后来很长一段时间，它都会在同一个位置等你。", { stats: { mood: 7 } }),
      ]),
      c("run_around", "绕开它继续跑", [
        o("cat_watch", "你跑过时，它抬头看了你一眼。那天的八百米成绩不算好，但你第一次发现自己可以笑着跑完。", { stats: { stamina: 5, mood: 2 } }),
      ]),
    ],
  },
  {
    id: "chance_letter",
    category: "chance",
    title: "没有署名的信",
    chapters: [2, 3, 4, 5, 6],
    weight: 7,
    text: "课桌里多了一封没有署名的信。信封上只画了一颗很小的星星。你环顾教室，每个人看起来都很正常。",
    choices: [
      c("open_it", "拆开看看", [
        o("kind_words", "信里没有告白，只写着“谢谢你上次没有笑我”。你不知道那是谁，却把那句话记了很久。", { stats: { mood: 8 }, flags: ["anonymous_kindness"] }),
      ]),
      c("leave_it", "放回去，不去猜是谁", [
        o("unknown_star", "你把信放回抽屉。直到毕业整理书本时，它才再次掉出来。那时你已经不记得当天教室里的样子，却记得自己当时没有拆开。", { stats: { mood: 2 } }),
      ]),
    ],
  },
  {
    id: "chance_countdown",
    category: "chance",
    title: "倒计时牌上的数字",
    chapters: [5, 6],
    weight: 9,
    text: "最后一个月的某个傍晚，倒计时牌上的数字被风吹得翻了一页。你站在教室后面，看着还剩不到三位数的日期，突然不知道该高兴还是难过。",
    choices: [
      c("write_a_wish", "在便利贴上写下一个愿望", [
        o("wish_on_wall", "你把便利贴贴在倒计时牌旁边。没有写名字，也没有写分数，只写了一句“希望以后想起这一年，不会只记得考试”。", { stats: { mood: 8 }, flags: ["graduation_wish"] }),
      ]),
      c("keep_studying", "回到座位，做完最后一道题", [
        o("last_problem", "你解完题时，教室里只剩你一个人。窗外的天已经黑了，倒计时牌还亮着。你关灯离开，脚步比想象中平静。", { stats: { study: 5, mood: 3 } }),
      ]),
      c("take_a_photo", "用手机拍下这一刻", [
        o("frozen_light", "照片有些糊，反光里能看见你自己的脸。后来换了手机，这张照片却一直被留在相册最前面。", { stats: { mood: 6 } }),
      ]),
    ],
  },
];
