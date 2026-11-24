import { choice as c, outcome as o, modifier as m } from "../helpers.js";

export const EVENTS = [
  {
    id: "family_arc_supportive_weight",
    category: "family",
    familyArc: true,
    families: ["supportive"],
    title: "从不责备的晚饭",
    chapters: [1, 2, 3],
    weight: 16,
    text: "月考失利后，家人做了一桌你喜欢的菜，谁都没有提成绩。越是这样，你越觉得那碗汤沉得端不起来。你忽然很想问：如果我一直不够好，你们还会这样吗？",
    choices: [
      c("ask_the_question", "把这句话问出来", [
        o("unconditional_answer", "家人放下筷子，认真看着你说，喜欢你不是因为成绩。你低头喝汤，眼泪差点掉进碗里。", { stats: { mood: 12 }, flags: ["family_trust", "opened_up"] }),
      ]),
      c("say_nothing", "把汤喝完，回房间继续复习", [
        o("quiet_support", "你学习到很晚。门缝下塞进来一张纸条：别太累，明天早上给你煎蛋。", { stats: { study: 5, mood: 6 } }),
      ]),
    ],
  },
  {
    id: "family_arc_supportive_comparison",
    category: "family",
    familyArc: true,
    families: ["supportive"],
    title: "亲戚饭桌上的比较",
    chapters: [4, 5, 6],
    weight: 16,
    text: "家庭聚会上，亲戚又开始比较各家孩子的排名和志愿。家人一直替你打圆场。你听着那些轻飘飘的评价，忽然不想再让所有人替你解释。",
    choices: [
      c("answer_for_yourself", "第一次当众说清自己的选择", [
        o("family_backup", "你说完后，桌子安静了一瞬。家人先开口支持你，语气不重，却让所有人不再追问。那一刻你才知道，支持也可以很有力量。", { stats: { mood: 12, study: 3 }, flags: ["family_pride", "own_path", "public_praise"] }),
      ]),
      c("leave_the_table", "起身离席，到楼下透气", [
        o("followed_outside", "家人很快跟了出来，没有逼你回去，只陪你站了一会儿。楼上的喧闹隔着一层玻璃，终于不再那么刺耳。", { stats: { mood: 7 }, flags: ["family_trust"] }),
      ]),
    ],
  },
  {
    id: "family_arc_strict_score",
    category: "family",
    familyArc: true,
    families: ["strict"],
    title: "冰箱上的成绩单",
    chapters: [1, 2, 3],
    weight: 16,
    text: "这次考试你退步了。回家时，成绩单已经被人从书包里拿出来，贴在冰箱上。家人坐在客厅等你，开口第一句就是：“你自己说，问题在哪里。”",
    choices: [
      c("own_the_mistake", "承认问题，但拒绝被全盘否定", [
        o("earned_respect", "你把每科失误说得很清楚，也说出自己真正需要的帮助。家人沉默很久，最后把成绩单从冰箱上取了下来。", { stats: { study: 10, mood: 9 }, flags: ["stood_up", "family_voice"] }, 65, [m({ minStudy: 50 }, 18)]),
        o("heated_argue", "话赶话又吵了起来。你摔门回房间，第二天桌上多了一本新的错题本。", { stats: { study: 4, mood: -5 }, flags: ["family_voice"] }, 35),
      ]),
      c("promise_to_fix", "先承诺下一次一定考回来", [
        o("pressure_loop", "家人没有再责备你。你回到房间，把那句承诺写进计划表，第一次觉得家里的期待像一根看不见的绳子。", { stats: { study: 8, mood: -4 } }),
      ]),
      c("ask_for_help", "请求家里别再只看名次", [
        o("hard_conversation", "谈话并不顺利，但你第一次把“我很难受”说完整。家人没有马上改变，却也没有再拿别人家的孩子举例。", { stats: { mood: 5, study: 2 }, flags: ["family_voice"] }),
      ]),
    ],
  },
  {
    id: "family_arc_strict_choice",
    category: "family",
    familyArc: true,
    families: ["strict"],
    title: "被改掉的志愿表",
    chapters: [4, 5, 6],
    weight: 16,
    text: "你发现志愿表上的第一志愿被改成了家人选定的学校。纸上是熟悉的字迹。你拿着那张表站在客厅，听见厨房里水龙头一直在响。",
    choices: [
      c("hold_your_ground", "要求把选择权还给你", [
        o("choice_returned", "你把三年的成绩、兴趣和理由全部摊开。争执持续到深夜，最后家人把笔放回你手里，说：“那你自己承担。”你接过了那支笔。", { stats: { mood: 11, study: 4 }, flags: ["own_path", "stood_up"] }, 60, [m({ minMood: 50 }, 20)]),
        o("cold_peace", "家人没有再改表格，但接下来几天几乎没有说话。你保住了选择，也第一次感到自由的重量。", { stats: { mood: -2, study: 4 }, flags: ["own_path"] }, 40),
      ]),
      c("let_them_decide", "签下被改过的版本", [
        o("borrowed_dream", "所有人看起来都松了一口气。只有你知道，那张表上写的未来并不完全属于自己。", { stats: { study: 6, mood: -6 }, flags: ["compromise_path"] }),
      ]),
    ],
  },
  {
    id: "family_arc_busy_dinner",
    category: "family",
    familyArc: true,
    families: ["busy"],
    title: "迟到的生日面",
    chapters: [1, 2, 3],
    weight: 16,
    text: "生日那天，家里临时加班，只发来一句“晚点回”。你一个人煮了面，吃了一半。快十一点时，门锁响了，家人拎着一块很小的蛋糕站在门口。",
    choices: [
      c("heat_another_bowl", "重新煮一碗面，和对方一起吃", [
        o("late_celebration", "你们在厨房里吃到快十二点。没有人解释太多，但第二天桌上多了你一直想要的那本书。", { stats: { mood: 10, stamina: 2 }, flags: ["family_trust"] }),
      ]),
      c("pretend_to_sleep", "关掉厨房的灯，回房间", [
        o("closed_door", "你听见门外轻轻放下蛋糕的声音。第二天早上，蛋糕还在，蜡烛没有拆封。", { stats: { mood: -3 } }),
      ]),
      c("tell_them_it_matters", "坦白说自己也希望被记得", [
        o("heard_busy_family", "家人站在门口听完，过了很久才说对不起。那晚你们没有补过生日，却把话说明白了。", { stats: { mood: 8 }, flags: ["family_voice", "opened_up"] }),
      ]),
    ],
  },
  {
    id: "family_arc_busy_graduation",
    category: "family",
    familyArc: true,
    families: ["busy"],
    title: "毕业典礼的空座位",
    chapters: [4, 5, 6],
    weight: 16,
    text: "毕业典礼开始前，家人发来消息说临时有事，可能赶不上。你看着礼堂里的空座位，告诉自己早就习惯了。主持人念到你的名字时，后排忽然响起掌声。",
    choices: [
      c("turn_around", "回头看看是谁来了", [
        o("running_in", "家人拎着外套站在最后一排，气还没喘匀。你差点在台上就笑出来。后来那张照片里，你们一个在台上，一个在后排，隔着整个礼堂。", { stats: { mood: 12 }, flags: ["family_pride", "family_trust"] }),
      ]),
      c("keep_facing_front", "继续面向台下，把名字说完", [
        o("own_applause", "你完整地说完了自己的名字。散场后看见手机上那条“刚赶到”，心里没有想象中难过。你已经开始学着不把全部期待放在别人身上。", { stats: { mood: 5, study: 2 }, flags: ["own_path"] }),
      ]),
    ],
  },
  {
    id: "family_arc_ordinary_trip",
    category: "family",
    familyArc: true,
    families: ["ordinary"],
    title: "不算宽裕的报名费",
    chapters: [1, 2, 3],
    weight: 16,
    text: "研学报名截止前一天，你听见家人在电话里计算这个月的开销。报名费不算天文数字，却刚好落在会让家里沉默的位置。你把报名表折起来，假装还没有决定。",
    choices: [
      c("say_you_want_to_go", "第一次明确说出自己想要什么", [
        o("made_it_work", "家人没有马上答应，但晚上和你一起算了很久。第二天，报名费被装进信封，上面写着“想去就去”。", { stats: { mood: 10 }, flags: ["family_voice", "family_trust"] }),
      ]),
      c("give_up_quietly", "把报名表收进抽屉", [
        o("small_sacrifice", "你没有说。几天后家人发现了那张表，沉默地补上了签名。你第一次知道，心疼一个人也会让人长大。", { stats: { mood: 2, study: 3 } }),
      ]),
      c("offer_to_earn_it", "和家里约定用自己的方式补上一部分", [
        o("shared_cost", "你帮邻居整理资料，也主动承担了更多家务。出发那天，家人把剩下的钱塞给你，说路上别省。", { stats: { stamina: 4, mood: 8 }, flags: ["own_path", "family_trust"] }),
      ]),
    ],
  },
  {
    id: "family_arc_ordinary_award",
    category: "family",
    familyArc: true,
    families: ["ordinary"],
    title: "压在玻璃板下的奖状",
    chapters: [4, 5, 6],
    weight: 16,
    text: "你帮家人找证件时，在书桌玻璃板下看见一张自己的旧奖状。那只是初中一次普通的进步奖，却被人压得平平整整。旁边还放着你随手写的便签。",
    choices: [
      c("ask_about_it", "拿着奖状问为什么留这么久", [
        o("quiet_pride", "家人有点不好意思，说那段时间你每天都很认真。你忽然明白，有些骄傲从来不会当面说。", { stats: { mood: 11 }, flags: ["family_trust", "family_pride"] }),
      ]),
      c("put_it_back", "把东西恢复原样，不再提", [
        o("secret_keepsake", "你把奖状放回去。那天学习时，你总能想起玻璃板下面那张已经有些褪色的纸。", { stats: { study: 5, mood: 4 } }),
      ]),
    ],
  },
];
