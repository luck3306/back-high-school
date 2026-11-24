export const SAVE_KEYS = {
  run: "back_high_school_run_v3",
  archive: "back_high_school_archive_v2",
};

export const STAT_DEFS = [
  { id: "study", label: "学业", short: "学", color: "#4d6b55" },
  { id: "stamina", label: "体能", short: "体", color: "#b5683e" },
  { id: "mood", label: "心情", short: "心", color: "#54759b" },
];

export const CAST_SLOTS = [
  {
    id: "arts",
    archetype: "arts",
    archetypeLabel: "艺术型",
    gender: "female",
    genderLabel: "女",
    pronoun: "她",
    color: "#c96f59",
    identities: ["摄影社成员", "校刊美术编辑", "话剧社演员", "校园广播主持人", "校刊摄影记者"],
  },
  {
    id: "academic",
    archetype: "academic",
    archetypeLabel: "学业型",
    gender: "male",
    genderLabel: "男",
    pronoun: "他",
    color: "#587b9c",
    identities: ["年级第一", "竞赛社社长", "理科实验班学霸", "转学来的尖子生", "图书馆常驻学霸"],
  },
  {
    id: "sports",
    archetype: "sports",
    archetypeLabel: "体育型",
    gender: "male",
    genderLabel: "男",
    pronoun: "他",
    color: "#557e66",
    identities: ["篮球队长", "田径队主力", "游泳队队员", "体育委员", "羽毛球社王牌"],
  },
  {
    id: "leadership",
    archetype: "leadership",
    archetypeLabel: "组织型",
    gender: "female",
    genderLabel: "女",
    pronoun: "她",
    color: "#946b92",
    identities: ["学生会副会长", "班长", "辩论队队长", "广播站站长", "社团联合会负责人"],
  },
  {
    id: "music",
    archetype: "music",
    archetypeLabel: "音乐/游离型",
    gender: "male",
    genderLabel: "男",
    pronoun: "他",
    color: "#8b7748",
    identities: ["转学生乐队吉他手", "校园歌手", "乐队主唱", "作曲社成员", "排练室常客"],
  },
];

export const CAST_IDS = CAST_SLOTS.map((slot) => slot.id);

export const CAST_NAME_POOLS = {
  female: {
    surnames: ["林", "沈", "苏", "许", "江", "顾", "宋", "叶", "温", "程", "陆", "白", "夏", "乔", "唐", "秦", "楚", "谢", "孟", "余", "何", "钟", "罗", "韩"],
    given: ["夏", "棠", "宁", "栀", "遥", "知意", "予安", "清和", "星野", "雨眠", "晚晴", "听澜", "若溪", "南枝", "书言", "明栀", "初宜", "念安", "云舒", "清越", "未晞", "秋澄", "禾", "昭", "笙", "茵", "遥青", "迟月", "青禾", "见微"],
  },
  male: {
    surnames: ["周", "陈", "顾", "沈", "江", "贺", "许", "陆", "程", "宋", "秦", "林", "叶", "温", "白", "谢", "孟", "韩", "唐", "楚", "余", "何", "罗", "钟"],
    given: ["屿", "野", "言", "川", "砚", "行舟", "一川", "望舒", "清让", "予川", "知远", "时安", "北辰", "牧云", "见山", "松", "景行", "临川", "修远", "闻舟", "星回", "听白", "南川", "照", "谨言", "朝暮", "长风", "书屿", "柏舟", "明川"],
  },
};

export const NPC_PERSONALITIES = [
  { id: "warm", label: "温暖细腻", description: "总能先察觉到别人没有说出口的情绪。", firstImpression: "笑起来很轻，像会认真听完每一句话。" },
  { id: "aloof", label: "疏离寡言", description: "不擅长主动靠近，但记住的事情很多。", firstImpression: "站在人群边缘，目光却一直留在现场。" },
  { id: "proud", label: "骄傲好胜", description: "不愿意输，也不愿意让别人看见自己害怕。", firstImpression: "说话时抬着下巴，像已经替自己赢过一次。" },
  { id: "cheerful", label: "热烈外向", description: "习惯先开口，也容易让陌生的人放松下来。", firstImpression: "自我介绍还没结束，已经和后排的人聊熟了。" },
  { id: "rational", label: "冷静理性", description: "遇到突发状况时，反而比平时更清醒。", firstImpression: "没有多余表情，却把每件事都安排得刚刚好。" },
  { id: "sensitive", label: "敏感多思", description: "会反复回想一句话，也会提前准备最坏的结果。", firstImpression: "总是先看别人的表情，再决定自己说什么。" },
  { id: "rebellious", label: "散漫自由", description: "不喜欢被定义，越是被安排越容易走反方向。", firstImpression: "校服穿得松松垮垮，回答问题时却从不敷衍。" },
  { id: "guarded", label: "嘴硬心软", description: "嘴上说着不在意，行动却总比语言诚实。", firstImpression: "第一句话有点冲，第二句话却是在问你有没有带伞。" },
  { id: "humorous", label: "幽默机敏", description: "擅长在尴尬里找到出口，也很少让场子真正冷下来。", firstImpression: "三句话里有两句玩笑，剩下一句才是真的。" },
  { id: "cautious", label: "悲观谨慎", description: "习惯先想到失败，因此每一步都走得很认真。", firstImpression: "对新鲜事物保持距离，却在纸上列了完整的计划。" },
];

export const CAST_BY_ID = Object.fromEntries(CAST_SLOTS.map((slot) => [slot.id, slot]));

export const GENDER_OPTIONS = [
  { id: "male", label: "男" },
  { id: "female", label: "女" },
  { id: "unspecified", label: "不指定" },
];

export const IDENTITY_GROUPS = [
  {
    id: "academic",
    label: "学业起点",
    hint: "决定你第一次走进教室时，手里握着什么底牌。",
    options: [
      {
        id: "steady",
        label: "稳扎稳打",
        description: "各科基础扎实，擅长把每一天过成同一种节奏。",
        stats: { study: 16, mood: 3 },
      },
      {
        id: "uneven",
        label: "明显偏科",
        description: "喜欢的方向很亮眼，薄弱科目却总在拉后腿。",
        stats: { study: 5, stamina: 4, mood: 6 },
      },
      {
        id: "behind",
        label: "暂时落后",
        description: "基础不算好，但上升空间与不服气都很大。",
        stats: { stamina: 7, mood: 9 },
      },
    ],
  },
  {
    id: "interest",
    label: "兴趣方向",
    hint: "它不会决定你是谁，却会影响你一次次走向哪里。",
    options: [
      {
        id: "study",
        label: "书桌与排名",
        description: "你喜欢把难题拆开，直到它们变成可以理解的答案。",
        stats: { study: 12, mood: 4 },
        affinity: { academic: 5 },
      },
      {
        id: "sports",
        label: "球场与风",
        description: "你相信身体先于语言抵达终点，也相信并肩比输赢重要。",
        stats: { stamina: 15, mood: 3 },
        affinity: { sports: 5 },
      },
      {
        id: "arts",
        label: "文字与舞台",
        description: "你想把那些来不及说出口的东西，留在纸上或灯下。",
        stats: { mood: 12, study: 3 },
        affinity: { arts: 5 },
      },
    ],
  },
];

export const FAMILY_PROFILES = [
  {
    id: "supportive",
    label: "温暖支持",
    description: "家里不催你成为谁，只问你今天累不累。",
    storyHint: "鼓励型家庭事件更常出现，也更容易触发被理解的剧情。",
    stats: { mood: 11 },
    affinity: { arts: 1, academic: 1, sports: 1, leadership: 1, music: 1 },
  },
  {
    id: "strict",
    label: "严格期待",
    description: "成绩单被贴在冰箱上，沉默比责备更有分量。",
    storyHint: "学业压力与志愿冲突更容易出现，也会放大逆袭后的爽感。",
    stats: { study: 10, mood: -6 },
  },
  {
    id: "busy",
    label: "各自忙碌",
    description: "晚饭常常自己解决，你也因此很早学会照顾自己。",
    storyHint: "独处、自我照顾与突然被惦记的剧情更常出现。",
    stats: { stamina: 6, mood: -3 },
  },
  {
    id: "ordinary",
    label: "普通日常",
    description: "没有戏剧性的争吵，也没有被写进作文的和解。",
    storyHint: "比较、预算与沉默关心会成为更常见的家庭冲突。",
    stats: { mood: 4, stamina: 2 },
  },
];

export const HIDDEN_TRAITS = [
  {
    id: "photographic",
    label: "过目不忘",
    description: "重要与不重要的事，都会在脑海里停很久。",
  },
  {
    id: "empathetic",
    label: "共情力强",
    description: "你总能比别人早半步察觉气氛里的裂缝。",
  },
  {
    id: "calm",
    label: "临场镇定",
    description: "越是被注视，你反而越能听见自己的声音。",
  },
  {
    id: "restless",
    label: "容易紧张",
    description: "你会在事情发生前，把所有坏结果都排练一遍。",
  },
  {
    id: "resilient",
    label: "不服输",
    description: "被击倒以后，你先想到的是下一次起跑。",
  },
  {
    id: "sunny",
    label: "乐天派",
    description: "坏天气也会有，但你总能记得带伞。",
  },
];

export const SEMESTERS = [
  {
    id: "g1s1",
    index: 0,
    grade: 1,
    term: 1,
    label: "高一 · 上学期",
    season: "初秋",
    title: "后门边的新座位",
    text: "开学第一天，风扇在头顶转得很慢。你握着刚领到的校服，在校门口迟疑了三秒，才跟随人流走进高一（7）班。黑板上还留着上一届的倒计时，值日生忘了擦干净。这里没有人知道你的过去，三年也还没有被写成任何结果。",
    outro: "第一次月考结束，走廊里全是重新排列过的名字。你开始明白，高中并不是一段会自动变好的时间，它需要你亲手走进去。",
  },
  {
    id: "g1s2",
    index: 1,
    grade: 1,
    term: 2,
    label: "高一 · 下学期",
    season: "盛夏",
    title: "第一张成绩单",
    text: "窗外的香樟树长得比上学期更高。班主任把成绩单发下来时，纸张被风扇吹得哗哗响。有人把排名折进课本，有人假装不在意，你也在心里给未来画了一条模糊的线。",
    outro: "高一的最后一天，操场晒得发白。你们约好暑假后再见，却没人知道下一次分班会带走谁。",
  },
  {
    id: "g2s1",
    index: 2,
    grade: 2,
    term: 1,
    label: "高二 · 上学期",
    season: "深秋",
    title: "分班以后",
    text: "新的班级名单贴在公告栏上，你从上往下看，在几个熟悉的名字旁边停住。课程表变厚了，老师开始频繁提到“方向”和“以后”。你忽然发现，选择不是某一天才发生的事，它早就藏在每一次坐到哪一排里。",
    outro: "社团招新和竞赛报名挤在同一个星期。你必须开始决定，要把有限的时间交给谁。",
  },
  {
    id: "g2s2",
    index: 3,
    grade: 2,
    term: 2,
    label: "高二 · 下学期",
    season: "梅雨",
    title: "雨下个不停",
    text: "雨水把教学楼和操场连成一整片灰色。晚自习结束时，走廊里堆满湿漉漉的伞。你开始习惯把疲惫藏进一句“还行”，也开始注意到，有些人会在你抬头之前，先把目光移开。",
    outro: "高二结束前的最后一次年级大会，电子屏上第一次打出了距高考还有一年的字样。",
  },
  {
    id: "g3s1",
    index: 4,
    grade: 3,
    term: 1,
    label: "高三 · 上学期",
    season: "寒冬",
    title: "倒计时开始",
    text: "教室后面的倒计时牌每天少一格。窗外天还没亮，走廊里已经有背单词的声音。你学会在错题和模拟卷之间分配呼吸，也学会把很多话压缩成一句“等考完再说”。",
    outro: "冬天的最后一场模拟考结束后，教室里罕见地没有人立刻离开。你们安静坐着，像在等待某个不确定的春天。",
  },
  {
    id: "g3s2",
    index: 5,
    grade: 3,
    term: 2,
    label: "高三 · 下学期",
    season: "初夏",
    title: "六月以前",
    text: "黑板上的日期被擦得发亮。你开始整理三年的试卷，也整理那些没有说出口的话。有人已经在计划离开，有人仍想把最后一段路走得慢一点。毕业很近，未来也一样近。",
    outro: "拍毕业照那天，阳光刺眼。摄影师喊了三次数，所有人都在笑。你却在快门落下前，忽然想起三年前第一次走进校门的自己。",
  },
];

export const CATEGORY_DEFS = [
  { id: "study", label: "学业" },
  { id: "romance", label: "心动" },
  { id: "club", label: "社团" },
  { id: "friendship", label: "友情" },
  { id: "family", label: "家庭" },
  { id: "chance", label: "校园" },
  { id: "relationship", label: "羁绊" },
];

export const ENDING_LABELS = {
  romance: "恋爱结局",
  friendship: "友情结局",
  growth: "成长结局",
  ensemble: "群像结局",
  spotlight: "高光结局",
};

export const FINAL_INTENTS = [
  {
    id: "confess",
    label: "向最在意的人表明心意",
    description: "把那些藏了三年的句子，放到毕业之前。",
  },
  {
    id: "together",
    label: "为共同目标再拼一次",
    description: "最后一次并肩，把名字一起写进结果里。",
  },
  {
    id: "future",
    label: "走向自己的未来",
    description: "不急着回应任何人，先回答你想成为谁。",
  },
];




