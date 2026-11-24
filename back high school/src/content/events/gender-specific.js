import { choice as c, outcome as o } from "../helpers.js";

export const EVENTS = [
  {
    id: "gender_male_no_cry",
    category: "friendship",
    playerGenders: ["male"],
    title: "输了也不能哭",
    chapters: [1, 2, 3, 4, 5],
    weight: 13,
    text: "比赛输掉以后，{sports.name}把毛巾盖在脸上，{academic.name}站在旁边假装收球。有人经过时说“男生输一场有什么好难受的”，两个人谁都没有反驳。你知道他们只是习惯了把难过藏起来。",
    choices: [
      c("sit_with_them", "坐下来，陪他们把这场失利说完", [
        o("allowed_to_be_sad", "你告诉他们，输了会难过并不丢人。{sports.name}终于把毛巾拿下来，{academic.name}也坐到了看台边。那晚没有人催你们振作。", { stats: { mood: 8 }, affinity: { sports: 9, academic: 6 }, flags: ["opened_up"] }),
      ]),
      c("challenge_the_comment", "追问那个人为什么男生不能难过", [
        o("hard_question", "对方被问得说不出话。{sports.name}笑了一下，说算了，但你看见{pronoun}一直攥着的拳头慢慢松开了。", { stats: { mood: 6 }, affinity: { sports: 7, academic: 4 }, flags: ["stood_up"] }),
      ]),
      c("say_nothing", "把水放在他们旁边，安静离开", [
        o("quiet_water", "你没有说大道理，只留下三瓶水。第二天训练时，{sports.name}把一瓶没开封的还给你，说昨天那瓶先替你喝了。", { stats: { stamina: 3, mood: 2 }, affinity: { sports: 4 } }),
      ]),
    ],
  },
  {
    id: "gender_male_confession_pressure",
    category: "romance",
    playerGenders: ["male"],
    title: "被起哄的告白",
    chapters: [3, 4, 5, 6],
    weight: 13,
    text: "班里有人发现你最近总看向{arts.name}，起哄声越来越大。有人把你们的名字写在黑板上，还有人催你“是男生就赶紧表白”。{arts.name}站在门口，脸色看不清。",
    choices: [
      c("public_confession", "顺着起哄当众说出来", [
        o("public_romance", "你说了，但没有像大家期待的那样喊得很响。你只是认真看着{arts.name}，说喜欢不是被推着表演。{arts.pronoun}沉默了几秒，然后点了头。", { stats: { mood: 10 }, affinity: { arts: 12 }, flags: ["romance_arts", "romance_public"] }),
      ]),
      c("stop_the_teasing", "先让所有人停止起哄", [
        o("respectful_love", "你说喜欢不是拿来起哄的。教室慢慢安静下来。放学后{arts.name}在楼下等你，说刚才的你比任何告白都更让人心动。", { stats: { mood: 8 }, affinity: { arts: 9 }, flags: ["romance_arts"] }),
      ]),
      c("deny_it", "当场否认", [
        o("denied_feelings", "起哄很快结束。{arts.name}也笑了笑，像什么都没发生。只是那天以后，你们之间多了一段谁都没有先提起的安静。", { stats: { mood: -3 }, affinity: { arts: -3 } }),
      ]),
    ],
  },
  {
    id: "gender_female_too_sensible",
    category: "family",
    playerGenders: ["female"],
    title: "懂事一点",
    chapters: [1, 2, 3, 4, 5],
    weight: 13,
    text: "家里临时有事，所有人默认你会推掉社团活动、照顾弟弟妹妹、把自己的安排往后放。{leadership.name}发来消息问你怎么还没到，你盯着输入框很久，没有按下发送。",
    choices: [
      c("say_no", "第一次明确说今天不能留下", [
        o("said_no", "电话那头沉默了一会儿，最终没有责备你。你赶到活动室时，{leadership.name}只说了一句“来了就好”。那天你第一次觉得，拒绝也可以不是自私。", { stats: { mood: 9 }, affinity: { leadership: 8 }, flags: ["own_path", "family_voice"] }),
      ]),
      c("stay_home", "留下处理家里的事", [
        o("stayed_home", "你把活动交给了别人，家里的事情顺利解决。晚上{leadership.name}发来活动照片，角落留了一个空座位。", { stats: { mood: 2 }, affinity: { leadership: 2 } }),
      ]),
      c("ask_for_help", "把压力告诉{leadership.name}和家人", [
        o("asked_for_share", "你没有一个人扛。家人重新分了任务，{leadership.name}也帮你调整了安排。事情仍然麻烦，但不再只压在你一个人身上。", { stats: { mood: 7 }, affinity: { leadership: 7 }, flags: ["opened_up", "family_trust"] }),
      ]),
    ],
  },
  {
    id: "gender_female_rumor",
    category: "romance",
    playerGenders: ["female"],
    title: "被讨论的喜欢",
    chapters: [3, 4, 5, 6],
    weight: 13,
    text: "你最近和{music.name}走得近，年级群里开始出现一些带着恶意揣测的消息。有人说女生太主动会掉价，有人说你肯定在倒追。{music.name}问你要不要解释。",
    choices: [
      c("speak_up", "公开说喜欢谁不需要别人批准", [
        o("own_voice", "你没有承认或否认任何关系，只说自己不接受被这样讨论。群里安静下来。{music.name}看着你，像第一次真正认识你。", { stats: { mood: 9 }, affinity: { music: 11 }, flags: ["romance_music", "stood_up", "romance_public"] }),
      ]),
      c("ignore_it", "不回应，继续做自己的事", [
        o("ignored_rumor", "话题很快被新的事情盖过去。{music.name}没有再提，只在排练结束后把一首新歌先弹给你听。", { stats: { mood: 3 }, affinity: { music: 4 } }),
      ]),
      c("distance_yourself", "暂时和{music.name}保持距离", [
        o("created_distance", "你开始避开放学后的排练室。{music.name}察觉到了，却没有追问，只把写给你的那段旋律从新歌里删掉了。", { stats: { mood: -4 }, affinity: { music: -2 } }),
      ]),
    ],
  },
];
