import { choice as c, outcome as o } from "../helpers.js";

const EVENTS_DATA = [
  {
    slot: "arts", id: "arts_darkroom", title: "暗房里的最后一盏红灯", chapters: [2, 3, 4, 5],
    male: "暗房里只剩红光。{arts.name}把刚显影的照片夹起来，照片里是你趴在课桌上睡着的样子。{arts.pronoun}说本来想删掉，后来又觉得这个瞬间很像你会记住的高中。",
    female: "暗房里只剩红光。{arts.name}让你靠近一点看底片，肩膀几乎挨在一起。{arts.pronoun}说你身上总有一种让人想把镜头停下来的感觉，说完又立刻补了一句“只是构图”。",
    choices: [
      c("ask_to_keep", "问能不能把这张照片留下", [o("keep_photo", "{arts.name}没有回答，只把照片翻到背面写了一行日期。走出暗房时，{arts.pronoun}把照片放进你的校服口袋。", { stats: { mood: 9 }, affinity: { arts: 11 }, flags: ["romance_arts"] })]),
      c("take_their_photo", "反过来给{arts.name}拍一张", [o("their_turn", "你举起相机。{arts.name}起初躲了一下，后来还是站定。快门按下时，{arts.pronoun}看的是镜头后面的你。", { stats: { mood: 7 }, affinity: { arts: 8 }, flags: ["romance_arts"] })]),
      c("leave_it_undeveloped", "让这张照片停在底片里", [o("undeveloped", "你们没有把照片洗出来。那张底片被{arts.name}收进相机包，像一个只有你们知道的秘密。", { stats: { mood: 3 }, affinity: { arts: 4 } })]),
    ],
  },
  {
    slot: "arts", id: "arts_film_night", title: "旧礼堂的最后一场电影", chapters: [4, 5, 6],
    male: "旧礼堂放映机坏了，只剩一束忽明忽暗的光。{arts.name}拉你留下来修机器，说想看完那部没有结局的老电影。黑暗里，{arts.pronoun}的手背碰到了你。",
    female: "{arts.name}约你去旧礼堂看最后一场电影。幕布亮起来时，{arts.pronoun}把爆米花放在你们中间，却一直没有伸手。银幕上的对白很轻，你们谁都没有看字幕。",
    choices: [
      c("hold_hands", "在黑暗里握住{arts.name}的手", [o("held_hand", "{arts.name}僵了一下，随后慢慢回握。电影结束时灯亮了，你们却没有立刻松开。", { stats: { mood: 11 }, affinity: { arts: 12 }, flags: ["romance_arts", "romance_public"] })]),
      c("ask_about_film", "问{arts.name}喜欢什么结局", [o("their_ending", "{arts.name}说喜欢没有拍完的结局，因为可以自己想象。你问那现在呢，{arts.pronoun}看了你一眼，说也许已经不用想象了。", { stats: { mood: 8 }, affinity: { arts: 8 }, flags: ["romance_arts"] })]),
      c("leave_before_ending", "提前离开，把结局留到以后", [o("left_before_end", "你走出礼堂时，电影还没有结束。第二天{arts.name}把结局讲给你听，却漏掉了最后两句对白。", { stats: { mood: 3 }, affinity: { arts: 3 } })]),
    ],
  },
  {
    slot: "academic", id: "academic_secret_page", title: "错题本里的那一页", chapters: [2, 3, 4],
    male: "你借来{academic.name}的错题本，翻到中间时发现一页没有题目，只写着几行被划掉的字。最下面一行还看得清：如果毕业以后还能一起做题就好了。",
    female: "{academic.name}把错题本递给你时，特意说不要翻最后一页。你当然翻到了。那里没有压轴题，只有一句写得很轻的“想和她去同一座城市”。",
    choices: [
      c("write_back", "在下面写一句回应", [o("answer_written", "你写完之后把本子还回去。第二天{academic.name}没有提那行字，却在你桌上放了一支新笔，旁边压着一道已经做好的题。", { stats: { study: 4, mood: 10 }, affinity: { academic: 11 }, flags: ["romance_academic"] })]),
      c("ask_in_person", "当面问那一页是什么意思", [o("asked_directly", "{academic.name}沉默了很久，说答案写在你之后的那道题里。你看过去，发现那是一道没有标准答案的开放题。", { stats: { mood: 8 }, affinity: { academic: 8 }, flags: ["romance_academic"] })]),
      c("pretend_not_seen", "假装没有翻到最后一页", [o("pretend", "你把那页压回原处。{academic.name}接过本子时看了你一眼，像在判断你到底有没有看见。", { stats: { mood: 1 }, affinity: { academic: 2 } })]),
    ],
  },
  {
    slot: "academic", id: "academic_same_city", title: "同一座城市的志愿", chapters: [5, 6],
    male: "{academic.name}把两张志愿草表铺在桌上，一张是你想去的城市，一张是{academic.pronoun}原本的选择。{academic.pronoun}说可以改，但你听得出那里面没有多少轻松。",
    female: "{academic.name}问你能不能陪{academic.pronoun}去看一所学校。你到了以后才发现，那所学校离你填的第一志愿只有两站地铁。{academic.pronoun}装作只是顺路。",
    choices: [
      c("choose_for_yourself", "让{academic.name}不要为自己改志愿", [o("own_choice", "{academic.name}盯着你看了很久，最后把两张草表分开。{academic.pronoun}说，那至少答应我一件事，毕业以后不要把我删掉。", { stats: { study: 5, mood: 7 }, affinity: { academic: 9 }, flags: ["romance_academic", "own_path"] })]),
      c("promise_to_visit", "答应无论去哪都会去找{academic.name}", [o("visit_promise", "{academic.name}把其中一张草表折成很小的纸片放进你书里。后来你在很多个自习课上，都能摸到它。", { stats: { mood: 9 }, affinity: { academic: 10 }, flags: ["romance_academic", "rooftop_promise"] })]),
      c("leave_it_to_time", "说等成绩出来再谈", [o("wait_for_score", "你们把草表重新收进文件袋。没人知道最后会去哪里，但那天走出教室时，{academic.name}替你背了一会儿书包。", { stats: { study: 3, mood: 4 }, affinity: { academic: 5 } })]),
    ],
  },
  {
    slot: "sports", id: "sports_medal", title: "奖牌背面", chapters: [2, 3, 4],
    male: "{sports.name}把刚拿到的奖牌塞给你，说背面已经刻了名字。你翻过来，发现刻的不是比赛项目，而是你的名字。",
    female: "比赛结束后，{sports.name}把奖牌挂到你脖子上，说这是借你戴一天。你翻到背面，看见上面有一道很浅的刻痕，像是反复描过你的名字。",
    choices: [
      c("wear_it", "把奖牌戴到最后", [o("wore_medal", "{sports.name}看见你一直没摘，笑得比拿冠军还开心。晚上你发消息问要不要还，{sports.pronoun}说先放你那里。", { stats: { mood: 10, stamina: 3 }, affinity: { sports: 11 }, flags: ["romance_sports"] })]),
      c("ask_meaning", "问为什么刻自己的名字", [o("medal_meaning", "{sports.name}说比赛的时候想到你在看台，就觉得不能输。{sports.pronoun}说完立刻去练投篮，耳根却一直红着。", { stats: { mood: 8 }, affinity: { sports: 8 }, flags: ["romance_sports"] })]),
      c("give_it_back", "把奖牌还给{sports.name}", [o("returned_medal", "{sports.name}接过奖牌，沉默了一会儿，说下次再赢一块给你。你问为什么，{sports.pronoun}说这样就有理由再送一次。", { stats: { mood: 5 }, affinity: { sports: 4 } })]),
    ],
  },
  {
    slot: "sports", id: "sports_bike_ride", title: "单车后座", chapters: [3, 4, 5],
    male: "训练结束后，{sports.name}让你坐{sports.pronoun}的车回家。夜风很大，{sports.pronoun}骑得比平时慢，嘴里却一直说是因为车胎没气。",
    female: "晚自习结束后，{sports.name}推着单车在校门口等你。{sports.pronoun}说自己顺路，可你们回家的方向明明相反。夜风把你的头发吹乱了，{sports.pronoun}忽然说别动。",
    choices: [
      c("hold_on", "抓住{sports.name}的衣角", [o("held_shirt", "{sports.name}明显骑得更慢了。到楼下时，{sports.pronoun}没有立刻走，只说了一句明天也等你。", { stats: { mood: 10 }, affinity: { sports: 10 }, flags: ["romance_sports"] })]),
      c("take_turns", "换你来载{sports.name}", [o("took_turns", "你骑得歪歪扭扭，{sports.name}在后面笑得停不下来。最后两个人推着车走完了剩下两条街。", { stats: { stamina: 4, mood: 8 }, affinity: { sports: 7 }, flags: ["romance_sports"] })]),
      c("walk_together", "下车，一起推着走", [o("walked_bike", "你们推着单车走得很慢。{sports.name}把外套披到你肩上，说风大。到分开的路口时，两个人都没有先说再见。", { stats: { mood: 7 }, affinity: { sports: 5 } })]),
    ],
  },
  {
    slot: "leadership", id: "leadership_after_meeting", title: "会议结束以后", chapters: [2, 3, 4],
    male: "学生会会议结束后，{leadership.name}发现你还在门口等。{leadership.pronoun}说不用陪，却把最后一份文件交给了你，自己终于空着手走出教学楼。",
    female: "{leadership.name}开完会已经很晚。你递过去一瓶水，{leadership.pronoun}愣了一下，说已经很久没有人问过她累不累。那晚你们没有回教室，坐在台阶上把一袋面包分完了。",
    choices: [
      c("walk_her_home", "送{leadership.name}回家", [o("walked_home", "路灯把两个人的影子拉得很长。{leadership.name}第一次没有聊工作，只讲了自己小时候想当什么样的人。", { stats: { mood: 10 }, affinity: { leadership: 11 }, flags: ["romance_leadership"] })]),
      c("help_finish", "陪{leadership.name}把最后一点事做完", [o("finished_work", "你们把会议室收拾干净。锁门时{leadership.name}忽然说，原来有人一起收尾是这种感觉。{leadership.pronoun}把备用钥匙给了你一把。", { stats: { study: 4, mood: 8 }, affinity: { leadership: 8 }, flags: ["romance_leadership"] })]),
      c("tell_her_to_rest", "坚持让{leadership.name}先回去休息", [o("forced_rest", "{leadership.name}嘴上说你管得太多，第二天却把一张写着“谢谢”的便签贴在你的书里。", { stats: { mood: 5 }, affinity: { leadership: 5 } })]),
    ],
  },
  {
    slot: "leadership", id: "leadership_speech_draft", title: "没有念出口的演讲稿", chapters: [4, 5, 6],
    male: "{leadership.name}把毕业演讲稿先给你看。稿子里全是感谢和总结，最后一段却被折了起来。你问那里写了什么，{leadership.pronoun}说还没想好要不要让某个人听见。",
    female: "{leadership.name}让你帮她改毕业演讲稿。稿子里有一段写到“第一次有人把我当成普通人”，她问你这样写会不会太明显。",
    choices: [
      c("open_the_last_part", "打开最后一段", [o("speech_truth", "那一页只写着一句话：如果毕业以后还能继续叫你名字，我会很幸运。{leadership.name}没有抢回去，只问你写得算不算太直接。", { stats: { mood: 10 }, affinity: { leadership: 11 }, flags: ["romance_leadership", "romance_public"] })]),
      c("keep_it_for_you", "说这段话不用念给所有人听", [o("private_speech", "你替{leadership.name}把最后一段折好。毕业典礼上，{leadership.pronoun}果然跳过了那里，却在散场后单独念给你听。", { stats: { mood: 9 }, affinity: { leadership: 10 }, flags: ["romance_leadership"] })]),
      c("help_edit", "只帮她改语言，不追问内容", [o("edited_speech", "你把稿子改得更自然。{leadership.name}看完后说，只有你知道这一段真正想说什么。", { stats: { study: 4, mood: 6 }, affinity: { leadership: 6 } })]),
    ],
  },
  {
    slot: "music", id: "music_rooftop_song", title: "天台的原创曲", chapters: [2, 3, 4],
    male: "{music.name}把你带上天台，说写了一首只有你能听的歌。风把谱纸吹得乱响，{music.pronoun}唱到一半忘了词，索性顺着你的名字即兴编了一句。",
    female: "{music.name}在天台弹了一首没有名字的歌。你听出副歌里藏着你的名字，{music.pronoun}却坚持说是你听错了。风停下来时，{music.pronoun}问你好不好听。",
    choices: [
      c("name_the_song", "给这首歌起名字", [o("song_named", "你写下“靠近一点”。{music.name}看了很久，把那张谱纸折好放进口袋，说以后每次唱都会想到今天。", { stats: { mood: 10 }, affinity: { music: 11 }, flags: ["romance_music"] })]),
      c("ask_for_another", "让{music.name}再唱一遍", [o("sing_again", "{music.name}又唱了一遍，这次没有看谱，只看着你。最后一句落下时，两个人都忘了说很好听。", { stats: { mood: 9 }, affinity: { music: 8 }, flags: ["romance_music"] })]),
      c("record_it", "用手机录下来", [o("recorded_song", "录音里混进了风声和你很轻的呼吸。{music.name}说不要删，以后在别的地方也能听见今天。", { stats: { mood: 7 }, affinity: { music: 5 } })]),
    ],
  },
  {
    slot: "music", id: "music_station", title: "车站前的三分钟", chapters: [4, 5, 6],
    male: "{music.name}的转学手续可能很快办下来。{music.pronoun}约你在车站见面，说只是顺路。列车进站的提示响了三遍，你们谁都没有先提离开。",
    female: "你赶到车站时，{music.name}正背着吉他站在检票口外。{music.pronoun}说自己可能真的要走了，问你能不能在三分钟里说一句会让人记住的话。",
    choices: [
      c("ask_him_to_stay", "让{music.name}留下来", [o("asked_stay", "{music.name}看着你，很久以后才说，第一次有人让{music.pronoun}觉得离开不是唯一的选项。{music.pronoun}最终没有上那班车。", { stats: { mood: 11 }, affinity: { music: 13 }, flags: ["romance_music", "own_path"] })]),
      c("promise_to_meet", "约定以后在别的城市见面", [o("meet_again", "{music.name}把一张写着地址的车票背面递给你。列车开走以后，你在原地站了很久，才发现背面还有一句“别忘了我”。", { stats: { mood: 8 }, affinity: { music: 9 }, flags: ["romance_music", "promise_reunion"] })]),
      c("let_him_go", "什么都不说，让{music.name}自己做决定", [o("let_go", "{music.name}没有等到那句话，最后把吉他背带调整了一下，走进了检票口。你没有追，但回家后听了一整晚那首没有名字的歌。", { stats: { mood: -2, study: 3 }, affinity: { music: 2 } })]),
    ],
  },
];

export const EVENTS = EVENTS_DATA.map((event) => ({
  id: "romance_extra_" + event.id,
  category: "romance",
  npc: event.slot,
  title: event.title,
  chapters: event.chapters,
  weight: 16,
  text: event.female,
  textByGender: { male: event.male, female: event.female, unspecified: event.female },
  choices: event.choices,
}));
