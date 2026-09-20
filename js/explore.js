/* =========================================================
 * 贝加尔湖畔 · 平面探索系统（WASD 自由移动）
 * 俯视角瓦片地图：玩家移动 / NPC 交互 / 出口过关
 * =======================================================*/

const TILE = 32;

// 瓦片图例：solid = 是否阻挡
const LEGEND = {
  '#': { solid: true,  type: 'wall' },
  '.': { solid: false, type: 'floor' },
  ',': { solid: false, type: 'ground' },
  'B': { solid: true,  type: 'shelf' },
  'C': { solid: true,  type: 'crate' },
  'T': { solid: true,  type: 'table' },
  'P': { solid: true,  type: 'piano' },
  'L': { solid: true,  type: 'lamp' },
  'S': { solid: true,  type: 'sandbag' },
  '=': { solid: true,  type: 'rail' },
  'R': { solid: false, type: 'platform' },
  'G': { solid: false, type: 'deco' },
  'F': { solid: true,  type: 'fire' },
  'V': { solid: true,  type: 'flag' },
  '+': { solid: false, type: 'exitdoor' },
};

// ===== 探索地图库 =====
const ExploreMaps = {

  // ---- 第一章 · 干部俱乐部仓库（白天） ----
  club_warehouse_day: {
    name: '干部俱乐部 · 仓库',
    outdoor: false,
    padChar: '.',
    palette: {
      floor: ['#42372c', '#38302a'],
      floorLine: '#352c26',
      wall: ['#5a4a3a', '#443828'],
      wood: '#6a5238',
    },
    tiles: [
      '################################',
      '#..............................#',
      '#..CC..BB.....CC.......BB..CC..#',
      '#..CC..BB.....CC.......BB..CC..#',
      '#..............................#',
      '#......BB.....TT.....BB........#',
      '#......BB.....TT.....BB........#',
      '#..............................#',
      '#..............................#',
      '#..CC......................CC..#',
      '#..CC.......P..............CC..#',
      '#..............................#',
      '#......BB..............BB......#',
      '#......BB..............BB......#',
      '#..............................#',
      '#..............................#',
      '#..CC..BB..........BB......CC..#',
      '#..CC..BB..........BB......CC..#',
      '#..............................#',
      '#.............................+#',
      '################################',
    ],
    spawn: [2, 18],
    exit: { x: 30, y: 19 },
    pickName: '申请表',
    pickVerb: '收集',
    pickups: [
      { x: 14, y: 9, icon: '📄', name: '申请表·压在琴谱下' },
      { x: 24, y: 7, icon: '📄', name: '申请表·货架夹层' },
      { x: 16, y: 3, icon: '📄', name: '申请表·军官脚边（小心）' },
    ],
    interacts: [
      {
        x: 14, y: 10, icon: '🎹', name: '钢琴', verb: '试弹', required: false,
        lines: [
          { speaker: '安娜（内心）', text: '（趁没人注意，掀开琴盖试了几个音——还好，没有走音。）' },
          { speaker: '安娜（内心）', text: '（周五的会场，就用它了。到那时，这架琴要替我们说出所有说不出的话。）' },
        ],
      },
    ],
    npcs: [
      {
        id: 'efim', char: 'efim', name: '叶菲姆', avatar: '🔧', color: '#7aa86a',
        x: 13, y: 8, required: true, quest: 'q_invite_efim',
        gatePickups: true,
        gateLines: [
          { speaker: '叶菲姆', text: '姐，你脸色不对——手里的事还没忙完吧？三份申请表一张都还没见到呢。' },
          { speaker: '安娜（内心）', text: '（老安德烈说：一张压在钢琴琴谱下，一张夹在东边货架里，还有一张在楼上那位"长官"脚边——先去拿齐。）' },
        ],
        dialogue: [
          { speaker: '叶菲姆', text: '姐，今天来的这么早啊，要不要喝杯咖啡？' },
          { speaker: '安娜', text: '谢谢你，不过我不困。倒是你两眼发黑，昨天晚上又和哪个姑娘幽会去啦？我给你的申请表，你仔细看过了吗？' },
          { speaker: '叶菲姆', text: '我没有……那个组织嘛，我再考虑考虑。姐，你难道是这个组织的领导，怎么老跟我做宣传工作？' },
          { speaker: '安娜', text: '叶菲姆啊，我顶多就是个做宣传工作的。不过借你吉言啦！' },
          { speaker: '安娜', text: '不过呢，我们今晚有一个组织内的聚会，不知道你能否来参加。你才16岁，总不会是NKVD的人吧。' },
          { choice: {
              text: '如何邀请叶菲姆？',
              options: [
                { label: '热情地鼓励他', next: 'ch1_03_a', flag: 'efim_attitude=positive' },
                { label: '冷静地讲道理', next: 'ch1_03_b', flag: 'efim_attitude=neutral' },
                { label: '不勉强他', next: 'ch1_03_c', flag: 'efim_attitude=low' },
              ],
          } },
        ],
      },
      {
        id: 'andrei', char: 'andrei', name: '老安德烈', avatar: '👴', color: '#8a7a5a',
        x: 5, y: 4, required: false,
        dialogue: [
          { speaker: '老安德烈', text: '安娜，今天的账目交给叶菲姆那小子就行。你呀，去把钢琴的事惦记着。' },
          { speaker: '老安德烈', text: '对了，昨晚收了三份入会申请表，我随手搁的——一张压在钢琴琴谱下面，一张夹在东边货架里，还有一张……唉，记性坏了，好像落在楼上那位"长官"脚边了。' },
          { speaker: '老安德烈', text: '这地方鱼龙混杂，说话小心。墙……有时候是长着耳朵的。' },
        ],
      },
      {
        id: 'valentina', char: 'valentina', name: '瓦伦蒂娜', avatar: '💫', color: '#7a9ac0',
        x: 24, y: 14, required: false,
        dialogue: [
          { speaker: '瓦伦蒂娜', text: '罗森塔尔娃同志，早上好！我在帮忙布置周五的会场呢。' },
          { speaker: '瓦伦蒂娜', text: '听说你要在大会上演奏？真好……我真羡慕会乐器的人。' },
        ],
      },
      {
        id: 'officer', name: 'NKVD军官', avatar: '👮', color: '#5a5a6a',
        x: 17, y: 2, required: false, hostile: true,
        dialogue: [
          { speaker: 'NKVD军官', text: '嗝——哪来的小姑娘？没看见老子在……在休息吗？' },
          { speaker: 'NKVD军官', text: '哼，识相点。这仓库里的东西，都是主席团的财产……都是我的财产……' },
          { speaker: '安娜（内心）', text: '（就是这种人，毁掉了这片土地。走开吧，不值得理会。）' },
        ],
      },
    ],
  },

  // ---- 第二章 · 地下会场筹备 ----
  bunker_prepare: {
    name: '地下五十米 · 会场',
    outdoor: false,
    padChar: '.',
    palette: {
      floor: ['#2e2a38', '#282434'],
      floorLine: '#252230',
      wall: ['#3e3848', '#302a3a'],
      wood: '#4a4058',
    },
    tiles: [
      '################################',
      '#..PP......................V...#',
      '#..PP......................V...#',
      '#..............................#',
      '#..TT...TT...TT...TT...TT......#',
      '#..............................#',
      '#..............................#',
      '#..TT...TT...TT...TT...TT......#',
      '#..............................#',
      '#..............................#',
      '#..TT...TT...TT...TT...TT......#',
      '#..............................#',
      '#..............................#',
      '#..TT...TT...TT...TT...TT......#',
      '#..............................#',
      '#.CC.......................CC..#',
      '#..............................#',
      '#..........F...................#',
      '#........TTTT..................#',
      '#.............................+#',
      '################################',
    ],
    spawn: [15, 18],
    exit: { x: 30, y: 19 },
    intName: '信号灯',
    intVerb: '点亮',
    interacts: [
      {
        x: 6, y: 3, lamp: true, verb: '点亮', name: '西北角信号灯',
        lines: [{ speaker: '安娜（内心）', text: '（火柴划亮，灯芯"噗"地接住了光。西北角，第一盏。）' }],
      },
      {
        x: 25, y: 3, lamp: true, verb: '点亮', name: '东北角信号灯',
        lines: [{ speaker: '安娜（内心）', text: '（灯焰先是颤抖，随后稳稳地立住——东北角，第二盏。代表们的座位被照出一片暖色。）' }],
      },
      {
        x: 6, y: 15, lamp: true, verb: '点亮', name: '西南角信号灯',
        lines: [{ speaker: '安娜（内心）', text: '（这盏老油灯的底座上，不知谁刻了一颗小小的五角星。西南角，第三盏。）' }],
      },
      {
        x: 25, y: 15, lamp: true, verb: '点亮', name: '东南角信号灯',
        lines: [{ speaker: '安娜（内心）', text: '（最后一盏亮起。从高处看，它们像落在地上的四颗星——会场，就绪。）' }],
      },
    ],
    npcs: [
      {
        id: 'andrei', char: 'andrei', name: '老安德烈', avatar: '👴', color: '#8a7a5a',
        x: 15, y: 16, required: true,
        dialogue: [
          { speaker: '老安德烈', text: '安娜！长椅要再检查一遍，代表们马上就到了。' },
          { speaker: '老安德烈', text: '还有个麻烦——电路员被大雪堵在路上了。会场四角的信号灯，得麻烦你去点亮。灯亮着，代表们才认得路。' },
          { speaker: '老安德烈', text: '今晚的大会，将决定我们是从一盘散沙，变成一块铁。三十年了……我等这一天等了三十年。' },
          { speaker: '安娜', text: '老安德烈，钢琴已经调好了。只要大会需要，《国际歌》随时可以响起。' },
        ],
      },
      {
        id: 'valentina', char: 'valentina', name: '瓦伦蒂娜', avatar: '💫', color: '#7a9ac0',
        x: 9, y: 9, required: true,
        dialogue: [
          { speaker: '瓦伦蒂娜', text: '各位同志晚上好，欢迎参加——咳咳，不对不对，声音太颤了……' },
          { speaker: '瓦伦蒂娜', text: '罗森塔尔娃同志！我主持开场白练了十遍还是紧张，你说，要是我在台上忘词了怎么办？' },
          { speaker: '安娜', text: '那就微笑。大家看到你的笑容，就会记得你说过什么。' },
        ],
      },
      {
        id: 'lyupasha', char: 'lyupasha', name: '柳帕莎', avatar: '🌹', color: '#c07a8a',
        x: 25, y: 4, required: false,
        dialogue: [
          { speaker: '柳帕莎', text: '安娜，亲爱的，帮我看着点入口。今晚有位……特别的客人要来。' },
          { speaker: '柳帕莎', text: '我在亚戈达的办公室里看到过一份名单。有些事，越是靠近火焰的人越要先学会不被烧伤。' },
        ],
      },
      {
        id: 'popov', name: '老波波夫', avatar: '🧓', color: '#9a8a6a',
        x: 5, y: 15, required: false,
        dialogue: [
          { speaker: '老波波夫', text: '我1922年入的党。列宁同志还在的时候……唉，那时候什么都难，但什么都亮堂。' },
          { speaker: '老波波夫', text: '小姑娘，今晚你弹的琴，是替我们这些老家伙，把没说完的话说完啊。' },
        ],
      },
    ],
  },

  // ---- 第三章 · 广播塔下集结（雪夜） ----
  radio_staging: {
    name: '上乌金斯克郊外 · 集结点',
    outdoor: true,
    padChar: ',',
    palette: {
      floor: ['#39445e', '#39445e'],
      ground: ['#4a5878', '#41507a'],
      wall: ['#2a3450', '#222c46'],
      wood: '#4a4058',
    },
    tiles: [
      '################################',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,G,,,,,,,,,L,,,,,,,,G,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,SSSS,,,,,,,,,,,,,,,,,SSSS,,,,',
      ',,SSSS,,,,,,F,,,,,,,,,SSSS,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,G,,,,,,,,,,,L,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,SSSSSS,,,,,,,,,,,SSSSSS,,,,,',
      ',,SSSSSS,,,,,,,,,,,SSSSSS,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,G,,,,,,,,,,,,,,,,,G,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,L,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,+',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      '################################',
    ],
    spawn: [2, 2],
    exit: { x: 30, y: 18 },
    intName: '机枪阵地',
    intVerb: '检查',
    patrols: [
      {
        path: [[10, 8], [22, 8], [22, 13], [10, 13]],
        loop: true, speed: 55, vision: 105, name: 'NKVD哨兵',
      },
    ],
    interacts: [
      {
        x: 4, y: 6, icon: '🔫', verb: '检查', name: '西北机枪阵地',
        lines: [
          { speaker: null, text: '（沙袋垒得结实，弹链已经上膛。你压低身形，借着雪光核对射界——合格。）' },
        ],
      },
      {
        x: 22, y: 6, icon: '🔫', verb: '检查', name: '东北机枪阵地',
        lines: [
          { speaker: null, text: '（枪管的油布裹得妥帖，射手就位后只需剪断绳索。合格。）' },
        ],
      },
      {
        x: 18, y: 14, icon: '🔫', verb: '检查', name: '南侧机枪阵地',
        lines: [
          { speaker: null, text: '（这是封锁南面来路的关键一挺。你贴着沙袋爬过去，指尖摸到冰冷的枪身——击针完好，合格。）' },
        ],
      },
    ],
    npcs: [
      {
        id: 'efim', char: 'efim', name: '叶菲姆', avatar: '🔧', color: '#7aa86a',
        x: 12, y: 7, required: true,
        dialogue: [
          { speaker: '叶菲姆', text: '政委同志！机枪组已经就位，就在那排沙袋后面。' },
          { speaker: '叶菲姆', text: '不过要小心——林子那头还有个 NKVD 哨兵在巡逻，眼睛毒得很，被他照见就得退回重来。三个机枪阵地，趁他背过身的时候逐一确认。' },
          { speaker: '叶菲姆', text: '三年前你把我从俱乐部里"拐"出来的时候，我可没想到会有今天。今晚过后，全俄国都会听到我们的声音！' },
          { speaker: '萨布林', text: '不是我的声音，叶菲姆。是我们的声音。' },
        ],
      },
      {
        id: 'anna', char: 'anna', name: '安娜', avatar: '🎹', color: '#b08ac0',
        x: 21, y: 10, required: false,
        dialogue: [
          { speaker: '安娜', text: '宣传单都分下去了。塔里的工人组织也联系好了——他们等这一天，等了太久。' },
          { speaker: '安娜', text: '瓦列里，今晚广播的时候……替我念一段《海燕之歌》吧。让高尔基的声音，也从电波里飞出来。' },
        ],
      },
      {
        id: 'andrei', char: 'andrei', name: '老安德烈', avatar: '👴', color: '#8a7a5a',
        x: 5, y: 15, required: false,
        dialogue: [
          { speaker: '老安德烈', text: '孩子，我打过察里津，也打过华沙。今夜这种安静，是暴风雨把它含在嘴里的安静。' },
          { speaker: '老安德烈', text: '去吧。老家伙们的遗愿，就托付给你们的嗓门了。' },
        ],
      },
    ],
  },

  // ---- 第四章 · 伊尔库茨克前线 ----
  irkutsk_front: {
    name: '伊尔库茨克城郊 · 前进阵地',
    outdoor: true,
    padChar: ',',
    palette: {
      ground: ['#5a4a44', '#524440'],
      wall: ['#3e3430', '#322a26'],
      wood: '#5a4a3a',
    },
    tiles: [
      '################################',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,C,,,,,,,,,G,,,,,,,,,,C,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,SSSSS,,,,,,,,,,,,,,,,,SSSSS,,',
      ',,SSSSS,,,,,,TT,,,,,F,,SSSSS,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,G,,,,C,,,,,,,,C,,,,,,,,G,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,SSSS,,,,,,,,,,,SSSS,,,,,,,,,,',
      ',,SSSS,,,,,,,,,,,SSSS,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,C,,,,,,,,,,,,,,,C,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,SSSSSS,,,,,,G,,,,SSSSSS,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,+',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      '################################',
    ],
    spawn: [2, 18],
    exit: { x: 29, y: 17 },
    ammoMode: true,
    pickName: '弹药箱',
    pickVerb: '收集',
    intName: '机枪阵地',
    intVerb: '补给',
    pickups: [
      { x: 9, y: 8, icon: '📦', name: '弹药箱·补给堆旁', carry: 1 },
      { x: 18, y: 9, icon: '📦', name: '弹药箱·沙袋后', carry: 1 },
      { x: 24, y: 14, icon: '📦', name: '弹药箱·焦土上', carry: 1 },
    ],
    interacts: [
      {
        x: 4, y: 6, icon: '🔫', verb: '补给', name: '西北机枪阵地', need: 'ammo',
        lines: [{ speaker: null, text: '（你把弹链一节节压进受弹机，拉动枪栓——"咔哒"。钢铁苏醒了。）' }],
      },
      {
        x: 24, y: 6, icon: '🔫', verb: '补给', name: '东北机枪阵地', need: 'ammo',
        lines: [{ speaker: null, text: '（弹药箱的木盖被冻住了，你用手肘磕开，把弹链送进枪膛。好了，最后一箱也到位。）' }],
      },
      {
        x: 22, y: 15, icon: '🔫', verb: '补给', name: '前哨机枪阵地', need: 'ammo',
        lines: [{ speaker: null, text: '（这是离城墙最近的一挺。装填完毕，射手朝你比了个大拇指。）' }],
      },
    ],
    npcs: [
      {
        id: 'sablin', char: 'sablin', name: '萨布林', avatar: '⭐', color: '#c8a850',
        x: 15, y: 5, required: true,
        dialogue: [
          { speaker: '萨布林', text: '同志们！伊尔库茨克就在眼前——亚戈达那帮蛀虫最后的老巢！' },
          { speaker: '萨布林', text: '安娜，进攻前最后一件差事：后勤的弹药箱散了三处，找齐它们，给三处机枪阵地都补上弹。没有弹链的机枪，只是铁管子。' },
          { speaker: '萨布林', text: '城里的工人已经罢工，炮兵营宣布起义。我们现在要做的，就是推开门，把这个腐朽的"苏联"送进坟墓！' },
          { speaker: '萨布林', text: '前进，为了贝加尔湖，为了所有的亡灵，为了那面真正干净的旗！' },
        ],
      },
      {
        id: 'lyupasha', char: 'lyupasha', name: '柳帕莎', avatar: '🌹', color: '#c07a8a',
        x: 6, y: 8, required: false,
        dialogue: [
          { speaker: '柳帕莎', text: '城防图在这。西段城墙有个塌口，是去年地震留下的，亚戈达一直没修——他舍不得钱。' },
          { speaker: '柳帕莎', text: '还有，NKVD有个整编制打算阵前倒戈。他们知道打下去，第一个上绞架的就是自己。' },
        ],
      },
      {
        id: 'braun', char: 'braun', name: '布劳恩', avatar: '🌍', color: '#7a8a9a',
        x: 24, y: 8, required: false,
        dialogue: [
          { speaker: '布劳恩', text: '安娜同志，等伊尔库茨克解放，我就能公开活动了。外交承认的事，中国同志那边会有大动作。' },
          { speaker: '布劳恩', text: '我在德国见过法西斯怎么上台，也见过人们怎么在绝望里互相踩踏。所以我知道——希望是种武器。' },
        ],
      },
    ],
  },

  // ---- 第五章 · 西伯利亚铁路小站（雪夜 · 中国线） ----
  train_station: {
    name: '西伯利亚铁路 · 会让站',
    outdoor: true,
    padChar: ',',
    palette: {
      ground: ['#3e4a66', '#374460'],
      wall: ['#2a3450', '#222c46'],
      wood: '#4a4058',
    },
    tiles: [
      '################################',
      ',,,,,,,,,L,,,,,,,,,L,,,,,,,,,,,',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      '================================',
      ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRLRRRRRRRRRRRRRRRRRLRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRBBBBRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRBBBBRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRCCRRRRRRRRRRRRRRRRCCRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR+',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      '################################',
    ],
    spawn: [4, 6],
    exit: { x: 30, y: 17 },
    timer: 100,
    onTimeout: '⏰ 列车误点了……准时奖励已错过，但接应的活还得干完！',
    intName: '车厢',
    intVerb: '检查',
    interacts: [
      {
        x: 6, y: 9, icon: '📻', verb: '检查', name: '一号车厢·电台',
        lines: [{ speaker: null, text: '（电台完好，封条未动。押运员低声说：装好它，谎言就再也盖不住这片土地。）' }],
      },
      {
        x: 14, y: 13, icon: '💊', verb: '检查', name: '二号车厢·药品',
        lines: [{ speaker: null, text: '（药品箱码得整整齐齐：磺胺、奎宁、纱布——够前线的手术室撑过整个冬天。）' }],
      },
      {
        x: 26, y: 13, icon: '🚩', verb: '检查', name: '三号车厢·东方的货物',
        lines: [{ speaker: null, text: '（掀开帆布：一面崭新的红旗，还有西北捎来的一包茶叶。茶香混着雪味，像家。）' }],
      },
    ],
    npcs: [
      {
        id: 'braun', char: 'braun', name: '布劳恩', avatar: '🌍', color: '#7a8a9a',
        x: 8, y: 9, required: true,
        dialogue: [
          { speaker: '布劳恩', text: '罗曼诺娃同志！列车还有二十分钟进站。车上有西北来的同志——还有药品、电台，和一份重要的消息。' },
          { speaker: '布劳恩', text: '趁停车窗口，快去把三节车厢的货都点验一遍——司机只肯等我们这么久，一分钟都别耽误！' },
          { speaker: '布劳恩', text: '中国正在变天。西北的那支队伍，已经把红旗插到了黄河边上。新世界的地图，要重新画了。' },
        ],
      },
      {
        id: 'chen', name: '陈同志', avatar: '🐉', color: '#a85a4a',
        x: 20, y: 11, required: false,
        dialogue: [
          { speaker: '陈同志', text: '从兰州到满洲里，我们走了四十天。一路上的雪，跟这里的雪，是一个颜色的。' },
          { speaker: '陈同志', text: '同志，你听过那首歌吗？"东方红，太阳升——" 我们的太阳升起来了，你们的，还会远吗？' },
          { speaker: '柳帕莎', text: '不远了。贝加尔湖的冰下，已经有火在烧。' },
        ],
      },
      {
        id: 'bethune', name: '白医生', avatar: '⚕️', color: '#9aaaaa',
        x: 26, y: 14, required: false,
        dialogue: [
          { speaker: '白医生', text: '医疗队随车带了三百公斤磺胺。听布劳恩说，伊尔库茨克的巷战伤员很多？' },
          { speaker: '白医生', text: '我在马德里学会了这件事：手术台离前线越近，活下来的人就越多。需要我的地方，请直说。' },
        ],
      },
    ],
  },

  // ---- 第六章 · 红军指挥部 ----
  hq_command: {
    name: '红军总指挥部',
    outdoor: false,
    padChar: '.',
    palette: {
      floor: ['#3e3830', '#38322a'],
      floorLine: '#353028',
      wall: ['#4a4640', '#3a362e'],
      wood: '#5a5044',
    },
    tiles: [
      '################################',
      '#.....V........CC.......V......#',
      '#.....V........CC.......V......#',
      '#..............................#',
      '#....BBB...............BBB.....#',
      '#..............................#',
      '#..............................#',
      '#..BBB....TTTTTTTT.....BBB.....#',
      '#.........TTTTTTTT.............#',
      '#.........TTTTTTTT.............#',
      '#..............................#',
      '#..............................#',
      '#..BBB..................BBB....#',
      '#..............................#',
      '#....L...........L........L....#',
      '#..............................#',
      '#..CC....TTT............TT.....#',
      '#..............................#',
      '#.............................+#',
      '#..............................#',
      '################################',
    ],
    spawn: [15, 18],
    exit: { x: 30, y: 18 },
    intName: '指挥环节',
    intVerb: '完成',
    interacts: [
      {
        x: 6, y: 7, icon: '📻', verb: '收听', name: '电台·前线战报', seq: 1,
        hintBusy: '（先收听电台的前线战报，才有下一步。）',
        lines: [
          { speaker: null, text: '（"……第一集团军已渡河，先头部队距城十六公里……"静电杂音里，前线的声音一个字一个字地敲在心上。）' },
          { speaker: null, text: '（你把三份战报的要点抄在纸上。态势：清楚了。）' },
        ],
      },
      {
        x: 18, y: 9, icon: '🗺️', verb: '确认', name: '战略地图', seq: 2,
        hintBusy: '（战况不明，图上钉不住一枚图钉——先去收听电台战报。）',
        lines: [
          { speaker: null, text: '（你依着战报，把代表红军的小旗一面面推上地图。木刺扎进软木的声音，像行军的鼓点。）' },
          { speaker: null, text: '（三面合围，网口收拢。态势图：完成。）' },
        ],
      },
      {
        x: 22, y: 12, icon: '☎️', verb: '联系', name: '野战电话', seq: 3,
        hintBusy: '（各纵队还没接到统一口径——按规矩来：先电台，再地图，最后电话。）',
        lines: [
          { speaker: null, text: '（摇柄转动，话筒里涌来接线员的电流声。你一字一顿："总攻时刻，照计划执行。"）' },
          { speaker: null, text: '（听筒那头，三个纵队先后回了同一个词："明白。"）' },
        ],
      },
    ],
    npcs: [
      {
        id: 'pechuro', char: 'pechuro', name: '佩楚罗', avatar: '📚', color: '#a08ac0',
        x: 15, y: 6, required: true,
        dialogue: [
          { speaker: '佩楚罗', text: '萨布林同志，政府的命令已经签署：战争总动员。从今天起，整个俄罗斯的命运，就在这张桌子上。' },
          { speaker: '佩楚罗', text: '参谋部有规矩：先收听电台的前线战报，再确认战略地图，最后用野战电话向各纵队下令。一步都不能乱。' },
          { speaker: '佩楚罗', text: '我在劳改营里熬了十年，就是为了能看到今天——亲手把侵略者赶出去的这一天。' },
        ],
      },
      {
        id: 'ulanovskaya', char: 'ulanovskaya', name: '玛雅', avatar: '📊', color: '#7ab0a8',
        x: 8, y: 12, required: false,
        dialogue: [
          { speaker: '玛雅', text: '军工产能翻了三倍。乌拉尔的新厂投产后，坦克每月能出厂两百辆。' },
          { speaker: '玛雅', text: '但是萨布林，记住：面包要留给工人，也要留给士兵的妈妈。这是你教我的。' },
        ],
      },
      {
        id: 'braun', char: 'braun', name: '布劳恩', avatar: '🌍', color: '#7a8a9a',
        x: 21, y: 12, required: false,
        dialogue: [
          { speaker: '布劳恩', text: '外交上，中国已经正式承认我们。美国的默许也拿到了——他们乐见德国人流血。' },
          { speaker: '布劳恩', text: '全世界都在看着东方。这一次，历史的火车头，握在我们手里。' },
        ],
      },
    ],
  },
};

// ===== 探索引擎 =====
/* =========================================================
 * 像素小人系统 · PixelActor
 * 16×22 逻辑像素 @2x：纯整数像素绘制（真·像素画）
 * 四方向 + 行走帧 + 待机呼吸，配色与立绘系统统一
 * =======================================================*/
const PixelActor = {
  W: 16, H: 22, S: 2,
  cv: null, c: null,
  OUT: '#1f1826',
  SHOE: '#262030',

  ensure() {
    if (!this.cv) {
      this.cv = document.createElement('canvas');
      this.cv.width = this.W;
      this.cv.height = this.H;
      this.c = this.cv.getContext('2d');
    }
    this.c.clearRect(0, 0, this.W, this.H);
    return this.c;
  },

  px(x, y, w, h, col) {
    if (w <= 0 || h <= 0) return;
    this.c.fillStyle = col;
    this.c.fillRect(x, y, w, h);
  },

  disk(cx, cy, r, col) {
    for (let dy = -r; dy <= r; dy++) {
      const hw = Math.floor(Math.sqrt(r * r - dy * dy));
      this.px(cx - hw, cy + dy, hw * 2 + 1, 1, col);
    }
  },

  // —— 立绘配置 → 小人配置（美术统一） ——
  cfgFor(id) {
    const def = {
      hair: '#5a4636', hairDk: '#43331f', skin: '#eec9a4',
      len: 'short', outfit: 'plain', c1: '#6a7488', c2: '#525a6a',
      trim: null, beard: null, mustache: null, glasses: false, blush: false,
      cap: false, capBand: '#7a1e28', helmet: false,
    };
    let P = null;
    try { P = Engine.getPortraitConfig(id); } catch (e) { P = null; }
    if (P && !P.silhouette) {
      def.hair = P.hair.color;
      def.hairDk = P.hair.shade;
      def.skin = P.skin;
      def.len = P.acc && P.acc.cap ? 'cap' : ({ long: 'long', bob: 'bob', balding: 'bald' }[P.hair.style] || 'short');
      def.outfit = P.outfit.type === 'blouse' ? 'dress' : P.outfit.type;
      def.c1 = P.outfit.color;
      def.c2 = P.outfit.shade;
      def.trim = P.outfit.scarf || P.outfit.trim || P.outfit.bow || P.outfit.collarColor || null;
      def.beard = P.beard === 'full' ? P.beardColor : null;
      def.mustache = P.beard === 'mustache' ? P.beardColor : null;
      def.glasses = !!(P.acc && P.acc.glasses);
      def.blush = (P.blush || 0) > 0.35;
      def.cap = !!(P.acc && P.acc.cap);
      def.capBand = (P.acc && P.acc.capBand) || '#7a1e28';
    } else if (id === 'german_soldier') {
      def.helmet = true;
      def.outfit = 'uniform'; def.c1 = '#5a6248'; def.c2 = '#464c36';
    } else if (id === 'japanese_soldier') {
      def.cap = true; def.capBand = '#8a7a3a';
      def.outfit = 'uniform'; def.c1 = '#6a5a44'; def.c2 = '#52452f';
    } else if (id === 'ss_officer') {
      def.cap = true; def.capBand = '#20242c';
      def.outfit = 'nkvd'; def.c1 = '#2c2c34'; def.c2 = '#20202a';
    } else {
      // 未知角色 → NKVD 哨兵装束
      def.cap = true;
      def.outfit = 'nkvd'; def.c1 = '#2a3560'; def.c2 = '#1f2848';
    }
    return def;
  },

  // —— 主入口：(x,y) 为脚底中心 ——
  draw(ctx, id, x, y, dir, frame, t) {
    const cfg = this.cfgFor(id);
    this.paint(cfg, dir === 'left' ? 'right' : dir, frame, t);
    // 地面阴影
    ctx.fillStyle = 'rgba(0,0,0,0.32)';
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 9, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    const dw = this.W * this.S, dh = this.H * this.S;
    const dx = Math.round(x - dw / 2);
    const dy = Math.round(y - dh + 1);
    const prev = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    if (dir === 'left') {
      ctx.save();
      ctx.translate(dx + dw, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(this.cv, 0, 0, dw, dh);
      ctx.restore();
    } else {
      ctx.drawImage(this.cv, dx, dy, dw, dh);
    }
    ctx.imageSmoothingEnabled = prev;
  },

  // —— 帧绘制 ——
  paint(cfg, dir, frame, t) {
    this.ensure();
    const OUT = this.OUT, SHOE = this.SHOE;
    const step = frame === 1 ? 1 : frame === 3 ? -1 : 0;
    const bob = frame === 2 ? 1 : (frame === 0 ? (((t / 520) | 0) % 2) : 0);
    const yb = -bob;
    const side = dir === 'right';
    const up = dir === 'up';
    const O = cfg.outfit;
    const lLift = step === 1 ? 2 : 0;
    const rLift = step === -1 ? 2 : 0;

    /* ===== 背发（长发/鲍勃头先铺底） ===== */
    if (cfg.len === 'long' || cfg.len === 'bob') {
      const L = cfg.len === 'long' ? 17 : 12;
      if (!side) {
        this.px(0, 4, 2, L - 3, cfg.hair);
        this.px(14, 4, 2, L - 3, cfg.hair);
        this.px(0, 6, 1, L - 6, cfg.hairDk);
        this.px(15, 6, 1, L - 6, cfg.hairDk);
        this.px(0, L, 1, 1, cfg.hairDk);
        this.px(15, L, 1, 1, cfg.hairDk);
      } else {
        this.px(0, 3, 3, L - 2, cfg.hair);
        this.px(0, 5, 1, L - 4, cfg.hairDk);
        this.px(1, L, 2, 1, cfg.hairDk);
      }
    }

    /* ===== 腿与鞋 ===== */
    if (O === 'dress') {
      this.px(6, 19 + lLift, 1, 2 - lLift, cfg.skin);
      this.px(9, 19 + rLift, 1, 2 - rLift, cfg.skin);
      this.px(6, 21 - lLift, 1, 1, SHOE);
      this.px(9, 21 - rLift, 1, 1, SHOE);
    } else if (O === 'coat') {
      this.px(5, 21 - lLift, 2, 1, SHOE);
      this.px(9, 21 - rLift, 2, 1, SHOE);
    } else {
      const pants = O === 'uniform' || O === 'nkvd' ? '#2c2c3c' : '#3a3342';
      this.px(5, 18 + lLift, 2, 3 - lLift, pants);
      this.px(9, 18 + rLift, 2, 3 - rLift, pants);
      this.px(4, 21 - lLift, 3, 1, SHOE);
      this.px(9, 21 - rLift, 3, 1, SHOE);
    }

    /* ===== 躯干（描边 + 平涂 + 硬边阴影） ===== */
    const bodyH = O === 'coat' ? 8 : 6;
    if (!side) {
      this.px(2, 11 + yb, 12, O === 'coat' ? 10 : 8, OUT);
      if (O === 'dress') this.px(3, 16 + yb, 10, 4, OUT);
      this.px(4, 12 + yb, 8, bodyH, cfg.c1);
      if (O === 'dress') {
        this.px(4, 16 + yb, 8, 3, cfg.c1);
        this.px(4, 19 + yb, 2, 1, cfg.c1);
        this.px(7, 19 + yb, 2, 1, cfg.c1);
        this.px(10, 19 + yb, 2, 1, cfg.c1);
      }
      this.px(9, 12 + yb, 2, O === 'dress' ? 7 : bodyH, cfg.c2);
      // 手臂
      this.px(2, 13 + yb, 2, 4, cfg.c1);
      this.px(12, 13 + yb, 2, 4, cfg.c1);
      this.px(12, 13 + yb, 1, 4, cfg.c2);
      this.px(2, 17 + yb, 2, 1, cfg.skin);
      this.px(12, 17 + yb, 2, 1, cfg.skin);
    } else {
      this.px(4, 11 + yb, 8, O === 'coat' ? 10 : 8, OUT);
      this.px(5, 12 + yb, 6, bodyH, cfg.c1);
      this.px(9, 12 + yb, 2, bodyH, cfg.c2);
      this.px(6, 13 + yb, 2, 4, cfg.c1);
      this.px(6, 17 + yb, 2, 1, cfg.skin);
    }

    /* ===== 服装细节（正面） ===== */
    if (!side && !up) {
      if (O === 'sweater' && cfg.trim) {
        this.px(5, 12 + yb, 6, 1, cfg.trim);
        this.px(6, 13 + yb, 2, 2, cfg.trim);
        this.px(5, 15 + yb, 1, 1, cfg.c2);
        this.px(8, 16 + yb, 1, 1, cfg.c2);
        this.px(11, 14 + yb, 1, 1, cfg.c2);
      } else if (O === 'uniform') {
        this.px(4, 16 + yb, 8, 1, '#1e2438');
        this.px(7, 14 + yb, 1, 1, '#e8c860');
        this.px(7, 15 + yb, 1, 1, '#e8c860');
        this.px(5, 13 + yb, 1, 1, '#d84040');
      } else if (O === 'nkvd') {
        this.px(7, 12 + yb, 1, 5, '#a83232');
        this.px(4, 16 + yb, 8, 1, '#1a1e2e');
        this.px(8, 14 + yb, 1, 1, '#d8b45a');
        this.px(8, 15 + yb, 1, 1, '#d8b45a');
      } else if (O === 'suit') {
        this.px(7, 12 + yb, 2, 2, '#e8e4da');
        this.px(7, 14 + yb, 1, 2, cfg.trim && cfg.trim !== '#f2eee4' && cfg.trim !== '#e87890' ? cfg.trim : '#33547a');
        this.px(5, 13 + yb, 1, 4, cfg.c2);
        this.px(10, 13 + yb, 1, 4, cfg.c2);
      } else if (O === 'work') {
        this.px(6, 12 + yb, 4, 1, '#d8cfc0');
        this.px(6, 13 + yb, 1, 4, cfg.c2);
        this.px(9, 13 + yb, 1, 4, cfg.c2);
      } else if (O === 'coat') {
        this.px(7, 12 + yb, 2, 2, '#6a2a2a');
        this.px(5, 13 + yb, 1, 6, cfg.c2);
        this.px(10, 13 + yb, 1, 6, cfg.c2);
      }
    } else if (side) {
      if (O === 'uniform' || O === 'nkvd') this.px(7, 15 + yb, 1, 1, '#e8c860');
      if (O === 'sweater' && cfg.trim) this.px(6, 12 + yb, 4, 1, cfg.trim);
    }

    /* ===== 头部 ===== */
    this.disk(8, 7 + yb, 6, OUT);
    this.disk(8, 7 + yb, 5, cfg.skin);

    if (up) {
      // 背面
      if (cfg.cap) {
        this.px(2, 1 + yb, 13, 3, '#2c3450');
        this.px(2, 4 + yb, 13, 1, cfg.capBand);
        this.px(1, 5 + yb, 14, 1, '#151a2c');
      } else if (cfg.helmet) {
        this.px(3, 1 + yb, 11, 3, '#4a5240');
        this.px(2, 4 + yb, 13, 1, '#3a4232');
      } else if (cfg.len === 'bald') {
        this.px(3, 4 + yb, 2, 3, cfg.hair);
        this.px(11, 4 + yb, 2, 3, cfg.hair);
      } else {
        this.disk(8, 7 + yb, 5, cfg.hair);
        this.px(3, 10 + yb, 11, 3, cfg.hair);
        this.px(5, 3 + yb, 4, 1, 'rgba(255,255,255,0.3)');
      }
      return;
    }

    if (side) {
      // 侧面（右）
      if (cfg.cap) {
        this.px(3, 1 + yb, 9, 3, '#2c3450');
        this.px(3, 4 + yb, 9, 1, cfg.capBand);
        this.px(6, 4 + yb, 1, 1, '#e8c860');
        this.px(8, 5 + yb, 7, 1, '#151a2c');
      } else if (cfg.helmet) {
        this.px(3, 1 + yb, 11, 3, '#4a5240');
        this.px(2, 4 + yb, 13, 1, '#3a4232');
        this.px(2, 5 + yb, 1, 2, '#3a4232');
        this.px(13, 5 + yb, 1, 2, '#3a4232');
      } else if (cfg.len === 'bald') {
        this.px(3, 3 + yb, 3, 3, cfg.hair);
      } else {
        this.px(2, 2 + yb, 5, 10, cfg.hair);
        this.px(2, 1 + yb, 12, 3, cfg.hair);
        this.px(12, 4 + yb, 2, cfg.len === 'long' ? 12 : cfg.len === 'bob' ? 7 : 4, cfg.hair);
        this.px(4, 2 + yb, 3, 1, 'rgba(255,255,255,0.3)');
      }
      // 面部
      this.px(10, 8 + yb, 2, 2, '#241d2c');
      this.px(10, 8 + yb, 1, 1, '#ffffff');
      this.px(14, 8 + yb, 1, 1, cfg.skin);
      if (cfg.blush) this.px(12, 10 + yb, 1, 1, '#e8a0a8');
      if (cfg.glasses) {
        this.px(9, 7 + yb, 4, 1, '#2a2630');
        this.px(9, 10 + yb, 4, 1, '#2a2630');
      }
      if (cfg.beard) this.px(8, 9 + yb, 6, 3, cfg.beard);
      else if (cfg.mustache) this.px(9, 9 + yb, 4, 1, cfg.mustache);
      return;
    }

    // 正面（down）
    if (cfg.cap) {
      this.px(3, 1 + yb, 11, 3, '#2c3450');
      this.px(3, 4 + yb, 11, 1, cfg.capBand);
      this.px(8, 4 + yb, 1, 1, '#e8c860');
      this.px(2, 5 + yb, 13, 1, '#151a2c');
      this.px(3, 6 + yb, 1, 2, cfg.hairDk);
      this.px(12, 6 + yb, 1, 2, cfg.hairDk);
    } else if (cfg.helmet) {
      this.px(3, 1 + yb, 11, 3, '#4a5240');
      this.px(2, 4 + yb, 13, 1, '#3a4232');
      this.px(2, 5 + yb, 1, 2, '#3a4232');
      this.px(13, 5 + yb, 1, 2, '#3a4232');
    } else if (cfg.len === 'bald') {
      this.px(3, 4 + yb, 2, 3, cfg.hair);
      this.px(11, 4 + yb, 2, 3, cfg.hair);
      this.px(6, 3 + yb, 3, 1, 'rgba(255,255,255,0.3)');
    } else {
      this.px(2, 1 + yb, 13, 5, cfg.hair);
      // 锯齿刘海
      this.px(3, 6 + yb, 2, 2, cfg.hair);
      this.px(5, 6 + yb, 2, 1, cfg.hair);
      this.px(7, 6 + yb, 2, 2, cfg.hair);
      this.px(9, 6 + yb, 2, 1, cfg.hair);
      this.px(11, 6 + yb, 2, 2, cfg.hair);
      this.px(13, 6 + yb, 1, 1, cfg.hair);
      // 侧发
      const lock = cfg.len === 'long' ? 11 : cfg.len === 'bob' ? 6 : 3;
      this.px(2, 5 + yb, 1, lock, cfg.hair);
      this.px(13, 5 + yb, 1, lock, cfg.hair);
      this.px(5, 2 + yb, 4, 1, 'rgba(255,255,255,0.3)');
    }
    // 面部
    this.px(5, 8 + yb, 2, 2, '#241d2c');
    this.px(9, 8 + yb, 2, 2, '#241d2c');
    this.px(5, 8 + yb, 1, 1, '#ffffff');
    this.px(9, 8 + yb, 1, 1, '#ffffff');
    if (cfg.blush) {
      this.px(3, 10 + yb, 1, 1, '#e8a0a8');
      this.px(12, 10 + yb, 1, 1, '#e8a0a8');
    }
    if (cfg.glasses) {
      this.px(4, 7 + yb, 4, 1, '#2a2630');
      this.px(8, 7 + yb, 4, 1, '#2a2630');
      this.px(4, 10 + yb, 4, 1, '#2a2630');
      this.px(8, 10 + yb, 4, 1, '#2a2630');
    }
    if (cfg.beard) {
      this.px(4, 9 + yb, 9, 3, cfg.beard);
    } else if (cfg.mustache) {
      this.px(6, 9 + yb, 5, 1, cfg.mustache);
    }
  },
};

const Explore = {
  active: false,
  map: null,
  mapId: null,
  grid: null,       // 二维瓦片字符
  cols: 0,
  rows: 0,
  solid: null,      // 二维布尔
  player: null,
  npcs: [],
  talkedRequired: [],
  exitOpen: false,
  exitWarned: 0,
  dialogueActive: false,
  dialogueQueue: [],
  currentItem: null,
  currentNpc: null,
  currentInteract: null,
  waitingChoice: false,
  onExit: null,
  node: null,
  hintTimer: 7000,
  speed: 150,
  // 任务化机制
  pickups: [],        // 拾取物（申请表/弹药箱）
  interacts: [],       // 可调查物件（油灯/阵地/车厢/电台）
  patrols: [],        // 巡逻哨兵（视锥检测）
  spawnPx: null,      // 出生点像素坐标（被哨兵发现后送回）
  carried: 0,          // 携带物（弹药）
  spottedCount: 0,     // 被发现次数
  timeLimit: 0,        // 限时（秒）
  timeLeft: 0,
  timedOut: false,
  gatedTalk: false,    // 门槛提示对话中

  start(node, onExit) {
    this.node = node;
    this.onExit = onExit;
    const def = ExploreMaps[node.map];
    if (!def) { console.error('ExploreMap not found:', node.map); return; }
    this.map = def;
    this.mapId = node.map;

    // 解析地图
    this.rows = def.tiles.length;
    this.cols = Math.max(...def.tiles.map(r => r.length));
    this.grid = [];
    this.solid = [];
    for (let y = 0; y < this.rows; y++) {
      const row = (def.tiles[y] || '').padEnd(this.cols, def.padChar || '.').slice(0, this.cols);
      this.grid.push(row.split(''));
      this.solid.push(row.split('').map(ch => (LEGEND[ch] || { solid: true }).solid));
    }

    // 玩家（像素坐标，位于瓦片中心）
    const sp = node.spawn || def.spawn || [2, 2];
    this.player = {
      x: sp[0] * TILE + TILE / 2,
      y: sp[1] * TILE + TILE / 2,
      dir: 'down', frame: 0, frameTimer: 0, moving: false,
    };

    // NPC（快照，避免污染原数据）
    this.npcs = (def.npcs || []).map(n => ({
      ...n,
      x: n.x * TILE + TILE / 2,
      y: n.y * TILE + TILE / 2,
      talked: false,
    }));

    // 拾取物 / 可调查物件 / 巡逻哨兵（快照）
    this.pickups = (def.pickups || []).map(p => ({
      ...p, px: p.x * TILE + TILE / 2, py: p.y * TILE + TILE / 2, taken: false,
    }));
    this.interacts = (def.interacts || []).map(i => ({
      ...i, px: i.x * TILE + TILE / 2, py: i.y * TILE + TILE / 2, done: false,
    }));
    this.patrols = (def.patrols || []).map(p => {
      const [x0, y0] = p.path[0];
      return {
        ...p,
        px: x0 * TILE + TILE / 2, py: y0 * TILE + TILE / 2,
        wpi: 1, angle: 0, frame: 0, frameTimer: 0, moving: true,
      };
    });

    this.spawnPx = { x: this.player.x, y: this.player.y };
    this.carried = 0;
    this.spottedCount = 0;
    this.gatedTalk = false;
    this.timeLimit = def.timer || 0;
    this.timeLeft = def.timer || 0;
    this.timedOut = false;

    this.talkedRequired = [];
    this.exitOpen = false;
    this.dialogueActive = false;
    this.waitingChoice = false;
    this.hintTimer = 7000;

    if (node.quests) node.quests.forEach(q => StoryEngine.addQuest(q));

    this.active = true;
    Engine.gameMode = 'explore';
    UI.toast(`🗺️ ${def.name}`, 2500);
    if (def.timer) {
      UI.toast(`⏰ 限时 ${def.timer} 秒！`, 2500);
    } else if ((def.pickups || []).length + (def.interacts || []).length + (def.patrols || []).length > 0) {
      this.showHint('WASD 移动 · 靠近发光物按空格交互');
    } else {
      this.showHint('WASD / 方向键 移动 · 空格 交谈');
    }
  },

  stop() {
    this.active = false;
    this.dialogueActive = false;
    this.waitingChoice = false;
    UI.hideDialog();
    UI.hideChoices();
    this.hideHint();
  },

  // ===== 每帧更新 =====
  update(dt) {
    if (!this.active) return;
    // 菜单/面板打开时暂停移动
    const menuOpen = !document.getElementById('main-menu').classList.contains('hidden');
    const questOpen = !document.getElementById('quest-panel').classList.contains('hidden');
    const partyOpen = !document.getElementById('party-panel').classList.contains('hidden');
    if (menuOpen || questOpen || partyOpen) return;

    this.hintTimer -= dt * 1000;
    if (this.hintTimer < 0 && this.hintTimer > -99999) {
      this.hideHint();
      this.hintTimer = -999999;
    }

    if (this.dialogueActive) {
      this.player.moving = false;
      return;
    }

    // WASD / 方向键移动
    let dx = 0, dy = 0;
    if (Input.isDown('w') || Input.isDown('W') || Input.isDown('ArrowUp')) dy = -1;
    if (Input.isDown('s') || Input.isDown('S') || Input.isDown('ArrowDown')) dy = 1;
    if (Input.isDown('a') || Input.isDown('A') || Input.isDown('ArrowLeft')) dx = -1;
    if (Input.isDown('d') || Input.isDown('D') || Input.isDown('ArrowRight')) dx = 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy);
      const mx = (dx / len) * this.speed * dt;
      const my = (dy / len) * this.speed * dt;
      // 朝向：水平优先（对角时更像俯视角 RPG）
      if (Math.abs(dx) >= Math.abs(dy)) {
        this.player.dir = dx > 0 ? 'right' : 'left';
      } else {
        this.player.dir = dy > 0 ? 'down' : 'up';
      }
      this.tryMove(mx, 0);
      this.tryMove(0, my);
      this.player.moving = true;
      this.player.frameTimer += dt;
      if (this.player.frameTimer > 0.14) {
        this.player.frameTimer = 0;
        this.player.frame = (this.player.frame + 1) % 4;
      }
    } else {
      this.player.moving = false;
      this.player.frame = 0;
    }

    // 巡逻哨兵：移动 + 视锥检测
    if (this.patrols.length) this.updatePatrols(dt);

    // 限时
    if (this.timeLimit > 0 && !this.timedOut && !this.exitOpen) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.timedOut = true;
        if (this.map.onTimeout) UI.toast(this.map.onTimeout, 3000);
      }
    }

    // 出口检测
    const ex = this.map.exit;
    const ptx = Math.floor(this.player.x / TILE);
    const pty = Math.floor(this.player.y / TILE);
    if (ptx === ex.x && pty === ex.y) {
      this.doExit();
    }

    // 底部提示：最近 NPC
    this.updateNearHint();
  },

  tryMove(mx, my) {
    const p = this.player;
    const nx = p.x + mx;
    const ny = p.y + my;
    // 玩家 hitbox：宽 18 高 12（脚部）
    const hw = 9, hh = 6;
    if (!this.collides(nx, p.y, hw, hh) && !this.npcBlocks(nx, p.y)) p.x = nx;
    if (!this.collides(p.x, ny, hw, hh) && !this.npcBlocks(p.x, ny)) p.y = ny;
  },

  collides(px, py, hw, hh) {
    const x0 = Math.floor((px - hw) / TILE);
    const x1 = Math.floor((px + hw) / TILE);
    const y0 = Math.floor((py - hh) / TILE);
    const y1 = Math.floor((py + hh) / TILE);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (tx < 0 || ty < 0 || tx >= this.cols || ty >= this.rows) return true;
        if (this.solid[ty][tx]) return true;
      }
    }
    return false;
  },

  npcBlocks(px, py) {
    for (const n of this.npcs) {
      if (Math.abs(px - n.x) < 18 && Math.abs(py - n.y) < 16) return true;
    }
    return false;
  },

  nearestNpc() {
    let best = null, bestD = 52 * 52;
    for (const n of this.npcs) {
      const d = (this.player.x - n.x) ** 2 + (this.player.y - n.y) ** 2;
      if (d < bestD) { bestD = d; best = n; }
    }
    return best;
  },

  // ===== 巡逻哨兵 =====
  updatePatrols(dt) {
    for (const p of this.patrols) {
      const [tx, ty] = p.path[p.wpi];
      const tpx = tx * TILE + TILE / 2, tpy = ty * TILE + TILE / 2;
      const dx = tpx - p.px, dy = tpy - p.py;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) {
        // 到达 waypoint：循环或往返
        if (p.loop) p.wpi = (p.wpi + 1) % p.path.length;
        else {
          if (p.wpi + p.dir >= p.path.length || p.wpi + p.dir < 0) p.dir = -p.dir;
          p.wpi += p.dir;
        }
      } else {
        const sp = p.speed || 55;
        p.px += (dx / dist) * sp * dt;
        p.py += (dy / dist) * sp * dt;
        p.angle = Math.atan2(dy, dx);
        p.frameTimer += dt;
        if (p.frameTimer > 0.16) { p.frameTimer = 0; p.frame = (p.frame + 1) % 4; }
      }
      // 视锥检测：距离 + 前方扇形
      const pdx = this.player.x - p.px, pdy = this.player.y - p.py;
      const pd = Math.hypot(pdx, pdy);
      if (pd < (p.vision || 100)) {
        let diff = Math.abs(Math.atan2(pdy, pdx) - p.angle);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < 0.95) this.spottedBy(p);
      }
    }
  },

  spottedBy(p) {
    // 触发冷却，避免连续触发
    const now = performance.now();
    if (!this._spotCd) this._spotCd = 0;
    if (now - this._spotCd < 1500) return;
    this._spotCd = now;

    this.spottedCount++;
    Game.state.resources.morale = Math.max(0, (Game.state.resources.morale || 0) - 5);
    UI.toast(`⚠ 被${p.name || '哨兵'}发现！撤回出发点（士气 -5）`, 2800);
    this.player.x = this.spawnPx.x;
    this.player.y = this.spawnPx.y;
    // 红色警告闪烁
    const flash = document.getElementById('danger-flash');
    if (flash) {
      flash.classList.remove('on');
      void flash.offsetWidth;
      flash.classList.add('on');
    }
    for (let i = 0; i < 14; i++) {
      Engine.spawnParticle(
        this.player.x, this.player.y,
        (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150,
        '#d05050', 3, 0.7
      );
    }
  },

  // ===== 拾取物 / 可调查物件 =====
  nearestPickup() {
    let best = null, bestD = 42 * 42;
    for (const p of this.pickups) {
      if (p.taken) continue;
      const d = (this.player.x - p.px) ** 2 + (this.player.y - p.py) ** 2;
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  },

  nearestInteract() {
    let best = null, bestD = 48 * 48;
    for (const it of this.interacts) {
      if (it.done && it.once !== false) continue;
      const d = (this.player.x - it.px) ** 2 + (this.player.y - it.py) ** 2;
      if (d < bestD) { bestD = d; best = it; }
    }
    return best;
  },

  takePickup(pk) {
    pk.taken = true;
    if (pk.carry) this.carried += pk.carry;
    UI.toast(`✦ 获得：${pk.name}`, 1800);
    for (let i = 0; i < 10; i++) {
      Engine.spawnParticle(
        pk.px, pk.py,
        (Math.random() - 0.5) * 100, -Math.random() * 90,
        '#e8c860', 2.5, 0.7
      );
    }
    this.checkExitOpen();
  },

  useInteract(it) {
    // 顺序谜题：前序未完成
    if (it.seq !== undefined) {
      const pre = this.interacts.filter(o => o.seq !== undefined && o.seq < it.seq);
      if (pre.some(o => !o.done)) {
        UI.toast(it.hintBusy || '现在还顾不上这个……', 1700);
        return;
      }
    }
    // 需要携带弹药
    if (it.need === 'ammo' && this.carried < 1) {
      UI.toast('⚠ 手上没有弹药——先去找弹药箱', 2000);
      return;
    }
    this.currentInteract = it;
    this.currentNpc = null;
    this.dialogueQueue = (it.lines || []).slice();
    this.dialogueActive = true;
    this.player.moving = false;
    if (!this.dialogueQueue.length) this.dialogueQueue.push({ speaker: null, text: it.name + '……' });
    this.stepDialogue();
  },

  updateNearHint() {
    if (this.dialogueActive) return;
    const n = this.nearestNpc();
    if (n) {
      this.showHint(`空格 · 与${n.required && !n.talked ? '★' : ''}${n.name}交谈`);
      return;
    }
    const it = this.nearestInteract();
    if (it) {
      const verb = it.verb || '调查';
      this.showHint(`空格 · ${verb}${it.name}`);
      return;
    }
    const pk = this.nearestPickup();
    if (pk) {
      this.showHint(`空格 · 拾取${pk.name}`);
      return;
    }
    if (this.exitOpen) {
      this.showHint(`目标完成 → 前往出口（右下发光处）`);
    } else {
      this.hideHint();
    }
  },

  // ===== 交互与对话 =====
  tryInteract() {
    if (this.dialogueActive) return;
    const n = this.nearestNpc();
    if (n) { this.talkTo(n); return; }
    const it = this.nearestInteract();
    if (it) { this.useInteract(it); return; }
    const pk = this.nearestPickup();
    if (pk) { this.takePickup(pk); }
  },

  talkTo(npc) {
    this.currentNpc = npc;
    this.currentInteract = null;
    // 任务门槛：要求的拾取物未集齐 → 提示对话（不计入交谈完成）
    if (npc.gatePickups && this.pickups.some(p => !p.taken)) {
      this.gatedTalk = true;
      this.dialogueQueue = (npc.gateLines || []).slice();
      this.dialogueActive = true;
      this.player.moving = false;
      this.stepDialogue();
      return;
    }
    this.dialogueQueue = (npc.dialogue || []).slice();
    this.dialogueActive = true;
    this.player.moving = false;
    this.stepDialogue();
  },

  stepDialogue() {
    const item = this.dialogueQueue.shift();
    this.currentItem = item;
    if (!item) { this.finishTalk(); return; }
    if (item.choice) {
      UI.showDialog(null, item.choice.text);
      this.waitingChoice = true;
      setTimeout(() => {
        UI.showChoices(item.choice.options, (idx, opt) => {
          UI.hideChoices();
          this.waitingChoice = false;
          if (opt.flag) {
            const [k, v] = opt.flag.split('=');
            Game.state.flags[k] = v;
          }
          if (opt.next) {
            // 剧情跳转（离开探索）：结算 NPC 任务与出口任务，避免 choice 路径漏完成
            if (npc_quest(this.currentNpc)) StoryEngine.completeQuest(this.currentNpc.quest);
            (this.node.completeOnExit || []).forEach(q => StoryEngine.completeQuest(q));
            this.stop();
            StoryEngine.gotoScene(opt.next);
            return;
          }
          this.stepDialogue();
        });
      }, 350);
    } else {
      UI.showDialog(item.speaker, item.text);
    }
  },

  advance() {
    if (!this.active) return;
    if (this.waitingChoice) return;
    if (!this.dialogueActive) { this.tryInteract(); return; }
    if (UI.isTyping()) {
      const text = this.currentItem && this.currentItem.text || '';
      UI.skipTypewriter(text, document.getElementById('dialog-text'));
      return;
    }
    UI.hideDialog();
    this.stepDialogue();
  },

  finishTalk() {
    UI.hideDialog();
    this.dialogueActive = false;

    // 物件调查结束
    if (this.currentInteract) {
      const it = this.currentInteract;
      this.currentInteract = null;
      it.done = true;
      if (it.need === 'ammo') this.carried--;
      if (it.give === 'ammo') this.carried += it.giveN || 1;
      if (it.reward) {
        const r = it.reward;
        if (r.supplies) Game.state.resources.supplies += r.supplies;
        if (r.morale) Game.state.resources.morale = Math.min(100, Game.state.resources.morale + r.morale);
        UI.toast(`🎁 获得：补给 +${r.supplies || 0} · 士气 +${r.morale || 0}`, 2000);
      }
      for (let i = 0; i < 12; i++) {
        Engine.spawnParticle(
          it.px, it.py,
          (Math.random() - 0.5) * 110, -Math.random() * 100,
          it.lamp ? '#f0c060' : '#80d0e0', 3, 0.8
        );
      }
      this.checkExitOpen();
      return;
    }

    const npc = this.currentNpc;
    this.currentNpc = null;
    if (!npc) return;
    // 门槛提示对话：不标记完成、不结算任务
    if (this.gatedTalk) {
      this.gatedTalk = false;
      return;
    }
    npc.talked = true;

    if (npc.quest) StoryEngine.completeQuest(npc.quest);

    if (npc.required && !this.talkedRequired.includes(npc.id)) {
      this.talkedRequired.push(npc.id);
    }

    if (npc.reward) {
      const r = npc.reward;
      if (r.supplies) Game.state.resources.supplies += r.supplies;
      if (r.morale) Game.state.resources.morale = Math.min(100, Game.state.resources.morale + r.morale);
      UI.toast(`🎁 获得：补给 +${r.supplies || 0} · 士气 +${r.morale || 0}`, 2200);
    }

    this.checkExitOpen();
  },

  // 统一出口条件判定：交谈 + 拾取 + 调查（required 物件）
  checkExitOpen() {
    if (this.exitOpen) return;
    const reqNpc = this.npcs.filter(n => n.required);
    const talkOk = reqNpc.every(n => n.talked);
    const pickOk = this.pickups.every(p => p.taken);
    const intOk = this.interacts.filter(i => i.required !== false).every(i => i.done);
    if (!talkOk || !pickOk || !intOk) return;

    this.exitOpen = true;
    // 限时 / 潜行 完成奖励
    if (this.timeLimit > 0 && !this.timedOut) {
      Game.state.resources.supplies += 40;
      UI.toast('⏰ 准时完成！额外奖励：补给 +40', 2600);
    }
    if (this.patrols.length && this.spottedCount === 0) {
      Game.state.resources.morale = Math.min(100, Game.state.resources.morale + 10);
      UI.toast('✦ 全程未被哨兵发现！额外奖励：士气 +10', 2600);
    }
    UI.toast('✦ 全部目标完成！前往发光的出口', 3200);
    const ex = this.map.exit;
    for (let i = 0; i < 24; i++) {
      Engine.spawnParticle(
        ex.x * TILE + TILE / 2, ex.y * TILE + TILE / 2,
        (Math.random() - 0.5) * 140, (Math.random() - 0.5) * 140,
        '#e8c860', 3, 0.9
      );
    }
  },

  doExit() {
    if (!this.exitOpen) {
      const now = performance.now();
      if (now - this.exitWarned > 2500) {
        this.exitWarned = now;
        const missing = [];
        const npcLeft = this.npcs.filter(n => n.required && !n.talked).length;
        if (npcLeft) missing.push(`关键人物 ${npcLeft} 人`);
        const pickLeft = this.pickups.filter(p => !p.taken).length;
        if (pickLeft) missing.push(`${this.map.pickName || '物品'} ${pickLeft} 个`);
        const intLeft = this.interacts.filter(i => i.required !== false && !i.done).length;
        if (intLeft) missing.push(`${this.map.intName || '目标'} ${intLeft} 处`);
        UI.toast(missing.length ? `还差：${missing.join(' · ')}` : '出口即将开启……', 2000);
      }
      return;
    }
    const node = this.node;
    this.stop();
    if (node.completeOnExit) node.completeOnExit.forEach(q => StoryEngine.completeQuest(q));
    if (this.onExit) this.onExit(node.next);
  },

  // ===== 渲染 =====
  render(ctx) {
    if (!this.active) return;
    const cam = this.getCamera();
    ctx.save();
    ctx.translate(-Math.round(cam.x), -Math.round(cam.y));

    this.renderTiles(ctx, cam);
    this.renderExit(ctx);
    this.renderInteracts(ctx);
    this.renderPatrols(ctx);
    this.renderPickups(ctx);
    this.renderActors(ctx);
    this.renderBubbles(ctx);

    ctx.restore();

    if (this.map.outdoor) Engine.renderSnow();
    this.renderHUD(ctx);
  },

  getCamera() {
    const mapW = this.cols * TILE;
    const mapH = this.rows * TILE;
    let cx = this.player.x - Engine.width / 2;
    let cy = this.player.y - Engine.height / 2;
    cx = Math.max(0, Math.min(mapW - Engine.width, cx));
    cy = Math.max(0, Math.min(mapH - Engine.height, cy));
    if (mapW < Engine.width) cx = (mapW - Engine.width) / 2;
    if (mapH < Engine.height) cy = (mapH - Engine.height) / 2;
    return { x: cx, y: cy };
  },

  renderTiles(ctx, cam) {
    const pal = this.map.palette || {};
    const t0 = Math.floor(cam.x / TILE);
    const t1 = Math.ceil((cam.x + Engine.width) / TILE);
    const r0 = Math.floor(cam.y / TILE);
    const r1 = Math.ceil((cam.y + Engine.height) / TILE);

    // 第一遍：地面
    for (let ty = r0; ty <= r1; ty++) {
      for (let tx = t0; tx <= t1; tx++) {
        if (tx < 0 || ty < 0 || tx >= this.cols || ty >= this.rows) continue;
        const ch = this.grid[ty][tx];
        const def = LEGEND[ch] || LEGEND['#'];
        const px = tx * TILE, py = ty * TILE;
        if (def.type === 'floor' || def.type === 'ground' || def.type === 'platform' || def.type === 'exitdoor') {
          this.drawGround(ctx, def.type, px, py, pal, tx, ty);
        }
      }
    }
    // 第二遍：物件与墙
    for (let ty = r0; ty <= r1; ty++) {
      for (let tx = t0; tx <= t1; tx++) {
        if (tx < 0 || ty < 0 || tx >= this.cols || ty >= this.rows) continue;
        const ch = this.grid[ty][tx];
        const def = LEGEND[ch] || LEGEND['#'];
        if (def.type === 'floor' || def.type === 'ground' || def.type === 'platform') continue;
        const px = tx * TILE, py = ty * TILE;
        this.drawProp(ctx, def.type, px, py, pal, tx, ty);
      }
    }
  },

  // 稳定伪随机（基于瓦片坐标，不闪烁）
  hash(x, y) {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >> 13)) * 1274126177 | 0;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  },

  drawGround(ctx, type, px, py, pal, tx, ty) {
    const ctx2 = ctx;
    if (type === 'floor' || type === 'exitdoor') {
      ctx.fillStyle = pal.floor ? pal.floor[0] : '#3a3430';
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = pal.floorLine || 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      // 噪点
      const h = this.hash(tx, ty);
      if (h > 0.6) {
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(px + 8 + h * 12, py + 6 + h * 16, 3, 2);
      }
    } else if (type === 'ground') {
      // 雪地 / 焦土
      ctx.fillStyle = pal.ground ? pal.ground[0] : '#4a5878';
      ctx.fillRect(px, py, TILE, TILE);
      const h = this.hash(tx, ty);
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      if (h > 0.5) ctx.fillRect(px + h * 20, py + h * 22, 4, 3);
      if (h < 0.25) {
        ctx.fillStyle = 'rgba(0,0,0,0.10)';
        ctx.fillRect(px + 14 - h * 20, py + 18, 6, 4);
      }
    } else if (type === 'platform') {
      ctx.fillStyle = '#5a5248';
      ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.strokeRect(px + 0.5, py + 0.5, TILE / 2, TILE / 2);
      ctx.strokeRect(px + TILE / 2 + 0.5, py + TILE / 2 + 0.5, TILE / 2 - 1, TILE / 2 - 1);
    }
  },

  drawProp(ctx, type, px, py, pal, tx, ty) {
    const t = Engine.elapsed;
    switch (type) {
      case 'wall':
        ctx.fillStyle = pal.wall ? pal.wall[0] : '#443828';
        ctx.fillRect(px, py, TILE, TILE);
        // 砖缝
        ctx.fillStyle = pal.wall ? pal.wall[1] : '#382c20';
        ctx.fillRect(px, py + 15, TILE, 2);
        const off = (ty % 2) * 16;
        ctx.fillRect(px + off, py, 2, 15);
        ctx.fillRect(px + ((off + 16) % 32), py + 17, 2, 15);
        // 顶部高光
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(px, py, TILE, 3);
        break;

      case 'shelf': {
        // 货架
        this.drawGround(ctx, 'floor', px, py, pal, tx, ty);
        ctx.fillStyle = '#4a3626';
        ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
        ctx.fillStyle = '#3a2a1c';
        ctx.fillRect(px + 4, py + 6, TILE - 8, 8);
        ctx.fillRect(px + 4, py + 18, TILE - 8, 8);
        // 货物
        const goods = ['#8a6a4a', '#6a7a9a', '#7a8a5a', '#9a7a8a'];
        for (let i = 0; i < 3; i++) {
          const h = this.hash(tx * 3 + i, ty);
          ctx.fillStyle = goods[Math.floor(h * 4)];
          ctx.fillRect(px + 6 + i * 8, py + 8, 6, 5);
          ctx.fillStyle = goods[Math.floor(this.hash(tx, ty * 3 + i) * 4)];
          ctx.fillRect(px + 6 + i * 8, py + 20, 6, 5);
        }
        break;
      }

      case 'crate': {
        this.drawGround(ctx, 'ground', px, py, pal, tx, ty);
        // 木箱
        ctx.fillStyle = '#6a5238';
        ctx.fillRect(px + 3, py + 3, TILE - 6, TILE - 6);
        ctx.strokeStyle = '#4a3828';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 4, py + 4, TILE - 8, TILE - 8);
        ctx.beginPath();
        ctx.moveTo(px + 4, py + 4); ctx.lineTo(px + TILE - 4, py + TILE - 4);
        ctx.moveTo(px + TILE - 4, py + 4); ctx.lineTo(px + 4, py + TILE - 4);
        ctx.stroke();
        // 钉子
        ctx.fillStyle = '#8a8a8a';
        ctx.fillRect(px + 6, py + 6, 2, 2);
        ctx.fillRect(px + TILE - 8, py + TILE - 8, 2, 2);
        break;
      }

      case 'table': {
        this.drawGround(ctx, 'floor', px, py, pal, tx, ty);
        ctx.fillStyle = pal.wood || '#5a4632';
        ctx.fillRect(px + 2, py + 6, TILE - 4, TILE - 10);
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.fillRect(px + 2, py + 6, TILE - 4, 4);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.strokeRect(px + 2.5, py + 6.5, TILE - 5, TILE - 11);
        break;
      }

      case 'piano': {
        this.drawGround(ctx, 'floor', px, py, pal, tx, ty);
        ctx.fillStyle = '#141018';
        ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
        ctx.fillStyle = '#2a1820';
        ctx.fillRect(px + 4, py + 4, TILE - 8, 6);
        // 琴键
        for (let i = 0; i < 7; i++) {
          ctx.fillStyle = '#e0d8c8';
          ctx.fillRect(px + 5 + i * 4, py + 16, 3, 10);
        }
        break;
      }

      case 'lamp': {
        this.drawGround(ctx, this.map.outdoor ? 'ground' : 'floor', px, py, pal, tx, ty);
        ctx.fillStyle = '#2a2a34';
        ctx.fillRect(px + TILE / 2 - 2, py + 4, 4, TILE - 6);
        // 灯头
        const glow = 0.75 + Math.sin(t / 600 + tx) * 0.25;
        ctx.fillStyle = '#e8d090';
        ctx.fillRect(px + TILE / 2 - 5, py, 10, 6);
        // 光晕
        const g = ctx.createRadialGradient(px + TILE / 2, py + 4, 4, px + TILE / 2, py + 4, 60);
        g.addColorStop(0, `rgba(232,208,144,${0.28 * glow})`);
        g.addColorStop(1, 'rgba(232,208,144,0)');
        ctx.fillStyle = g;
        ctx.fillRect(px - 40, py - 40, TILE + 80, TILE + 80);
        break;
      }

      case 'sandbag': {
        this.drawGround(ctx, 'ground', px, py, pal, tx, ty);
        ctx.fillStyle = '#7a6a4e';
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            ctx.beginPath();
            ctx.ellipse(px + 10 + j * 13, py + 12 + i * 10, 8, 6, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(px + 16, py + 16, 8, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }

      case 'rail': {
        // 铁轨（枕木 + 钢轨）
        ctx.fillStyle = '#3a2e24';
        ctx.fillRect(px, py + 4, TILE, 24);
        ctx.fillStyle = '#2e241c';
        for (let i = 0; i < 2; i++) ctx.fillRect(px + 4 + i * 16, py + 4, 8, 24);
        ctx.fillStyle = '#8a90a0';
        ctx.fillRect(px, py + 8, TILE, 3);
        ctx.fillRect(px, py + 20, TILE, 3);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(px, py + 8, TILE, 1);
        break;
      }

      case 'fire': {
        this.drawGround(ctx, 'ground', px, py, pal, tx, ty);
        // 火盆
        ctx.fillStyle = '#3a3430';
        ctx.beginPath();
        ctx.ellipse(px + 16, py + 20, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // 火焰（3 层，动画）
        const fh = 10 + Math.sin(t / 120 + tx * 3) * 4;
        const layers = [['#e85820', 1.0], ['#f09030', 0.7], ['#f8d060', 0.45]];
        for (const [c, s] of layers) {
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.moveTo(px + 16 - 8 * s, py + 20);
          ctx.quadraticCurveTo(px + 16, py + 20 - fh * s * 2, px + 16 + 8 * s, py + 20);
          ctx.fill();
        }
        // 光晕
        const g = ctx.createRadialGradient(px + 16, py + 16, 6, px + 16, py + 16, 80);
        g.addColorStop(0, 'rgba(240,144,48,0.25)');
        g.addColorStop(1, 'rgba(240,144,48,0)');
        ctx.fillStyle = g;
        ctx.fillRect(px - 60, py - 60, TILE + 120, TILE + 120);
        break;
      }

      case 'flag': {
        this.drawGround(ctx, 'floor', px, py, pal, tx, ty);
        ctx.fillStyle = '#8a8a8a';
        ctx.fillRect(px + 6, py - 14, 3, TILE + 14);
        // 红旗（飘动）
        const wave = Math.sin(t / 300 + ty * 2) * 3;
        ctx.fillStyle = '#c03030';
        ctx.beginPath();
        ctx.moveTo(px + 9, py - 12);
        ctx.lineTo(px + 9 + 18, py - 8 + wave);
        ctx.lineTo(px + 9 + 18, py + 4 + wave);
        ctx.lineTo(px + 9, py + 6);
        ctx.closePath();
        ctx.fill();
        // 金星
        ctx.fillStyle = '#e8c860';
        ctx.fillRect(px + 14, py - 5, 4, 4);
        break;
      }

      case 'deco': {
        // 装饰：雪堆 / 瓦砾
        if (this.map.outdoor) {
          this.drawGround(ctx, 'ground', px, py, pal, tx, ty);
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.beginPath();
          ctx.ellipse(px + 16, py + 18, 11, 7, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.ellipse(px + 12, py + 15, 6, 4, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          this.drawGround(ctx, 'ground', px, py, pal, tx, ty);
          ctx.fillStyle = 'rgba(0,0,0,0.18)';
          ctx.beginPath();
          ctx.ellipse(px + 16, py + 20, 10, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.fillRect(px + 8, py + 12, 7, 5);
        }
        break;
      }
    }
  },

  renderExit(ctx) {
    const ex = this.map.exit;
    const px = ex.x * TILE, py = ex.y * TILE;
    const t = Engine.elapsed;
    if (this.exitOpen) {
      // 金色光圈 + 上升箭头
      const pulse = 0.6 + Math.sin(t / 300) * 0.4;
      const g = ctx.createRadialGradient(px + 16, py + 16, 2, px + 16, py + 16, 34);
      g.addColorStop(0, `rgba(232,200,96,${0.5 * pulse})`);
      g.addColorStop(1, 'rgba(232,200,96,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - 24, py - 24, TILE + 48, TILE + 48);
      // 门
      ctx.fillStyle = '#1a1408';
      ctx.fillRect(px + 4, py + 2, TILE - 8, TILE - 2);
      ctx.strokeStyle = '#e8c860';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 5, py + 3, TILE - 10, TILE - 4);
      // 上升箭头
      ctx.fillStyle = `rgba(232,200,96,${pulse})`;
      const ay = py + 20 - Math.sin(t / 250) * 5;
      ctx.beginPath();
      ctx.moveTo(px + 16, ay - 10);
      ctx.lineTo(px + 22, ay - 2);
      ctx.lineTo(px + 18, ay - 2);
      ctx.lineTo(px + 18, ay + 4);
      ctx.lineTo(px + 14, ay + 4);
      ctx.lineTo(px + 14, ay - 2);
      ctx.lineTo(px + 10, ay - 2);
      ctx.closePath();
      ctx.fill();
    } else {
      // 未激活的门（暗色）
      ctx.fillStyle = '#141018';
      ctx.fillRect(px + 4, py + 2, TILE - 8, TILE - 2);
      ctx.strokeStyle = '#3a3440';
      ctx.lineWidth = 2;
      ctx.strokeRect(px + 5, py + 3, TILE - 10, TILE - 4);
      // 锁定图标
      ctx.fillStyle = '#4a4450';
      ctx.fillRect(px + 12, py + 12, 8, 7);
      ctx.strokeStyle = '#4a4450';
      ctx.beginPath();
      ctx.arc(px + 16, py + 12, 4, Math.PI, 0);
      ctx.stroke();
    }
  },

  // ===== 拾取物 / 物件 / 哨兵 渲染 =====
  renderPickups(ctx) {
    const t = Engine.elapsed;
    for (const p of this.pickups) {
      if (p.taken) continue;
      const bob = Math.sin(t / 400 + p.px) * 3;
      const pulse = 0.6 + Math.sin(t / 300) * 0.4;
      const g = ctx.createRadialGradient(p.px, p.py + bob, 2, p.px, p.py + bob, 24);
      g.addColorStop(0, `rgba(232,200,96,${0.30 * pulse})`);
      g.addColorStop(1, 'rgba(232,200,96,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.px - 26, p.py + bob - 26, 52, 52);
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.icon || '📄', p.px, p.py + bob + 5);
    }
  },

  renderInteracts(ctx) {
    const t = Engine.elapsed;
    for (const it of this.interacts) {
      const pulse = 0.6 + Math.sin(t / 280 + it.px) * 0.4;
      if (it.lamp) {
        // 油灯：柱 + 灯头（点亮后暖光）
        ctx.fillStyle = '#2a2a34';
        ctx.fillRect(it.px - 2, it.py - 6, 4, 22);
        if (it.done) {
          ctx.fillStyle = '#e8d090';
          ctx.fillRect(it.px - 5, it.py - 10, 10, 6);
          const g = ctx.createRadialGradient(it.px, it.py - 8, 4, it.px, it.py - 8, 70);
          g.addColorStop(0, 'rgba(232,208,144,0.30)');
          g.addColorStop(1, 'rgba(232,208,144,0)');
          ctx.fillStyle = g;
          ctx.fillRect(it.px - 72, it.py - 80, 144, 144);
        } else {
          ctx.fillStyle = '#4a4a52';
          ctx.fillRect(it.px - 5, it.py - 10, 10, 6);
          // 青色脉冲提示圈
          ctx.strokeStyle = `rgba(120,200,220,${0.5 * pulse})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(it.px, it.py, 16 + Math.sin(t / 300) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (it.icon) {
        // 通用物件：图标 + 脉冲圈
        const bob = Math.sin(t / 450 + it.px) * 2;
        if (!it.done) {
          const g = ctx.createRadialGradient(it.px, it.py + bob, 2, it.px, it.py + bob, 22);
          g.addColorStop(0, `rgba(120,200,220,${0.28 * pulse})`);
          g.addColorStop(1, 'rgba(120,200,220,0)');
          ctx.fillStyle = g;
          ctx.fillRect(it.px - 24, it.py + bob - 24, 48, 48);
        }
        ctx.font = '15px sans-serif';
        ctx.textAlign = 'center';
        ctx.globalAlpha = it.done ? 0.55 : 1;
        ctx.fillText(it.icon, it.px, it.py + bob + 5);
        if (it.done) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#5a7a5a';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('✓', it.px + 11, it.py - 9 + bob);
        }
        ctx.globalAlpha = 1;
      }
    }
  },

  renderPatrols(ctx) {
    const t = Engine.elapsed;
    for (const p of this.patrols) {
      // 视锥（朝向前方扇形）
      const vis = p.vision || 100;
      const half = 0.95;
      ctx.fillStyle = 'rgba(200,70,70,0.13)';
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.arc(p.px, p.py, vis, p.angle - half, p.angle + half);
      ctx.closePath();
      ctx.fill();

      // 哨兵本体（像素小人）
      const pdir = Math.abs(Math.cos(p.angle)) > Math.abs(Math.sin(p.angle))
        ? (Math.cos(p.angle) > 0 ? 'right' : 'left')
        : (Math.sin(p.angle) > 0 ? 'down' : 'up');
      PixelActor.draw(ctx, 'nkvd_soldier', p.px, p.py + 10, pdir, p.frame, t);
      // 步枪（指向巡逻方向）
      ctx.save();
      ctx.translate(p.px, p.py - 8);
      ctx.rotate(p.angle);
      ctx.fillStyle = '#3a3028';
      ctx.fillRect(-4, -1.5, 17, 3);
      ctx.fillStyle = '#8a7a5a';
      ctx.fillRect(11, -1, 4, 2);
      ctx.fillStyle = '#4a3a2a';
      ctx.fillRect(-4, -3, 5, 2);
      ctx.restore();
      // 名牌
      ctx.font = '11px "Courier New", monospace';
      ctx.textAlign = 'center';
      const nm = p.name || 'NKVD哨兵';
      const w = ctx.measureText(nm).width + 10;
      ctx.fillStyle = 'rgba(10,14,26,0.78)';
      ctx.fillRect(p.px - w / 2, p.py - 56, w, 15);
      ctx.strokeStyle = 'rgba(200,90,90,0.6)';
      ctx.strokeRect(p.px - w / 2 + 0.5, p.py - 55.5, w - 1, 14);
      ctx.fillStyle = '#e0a0a0';
      ctx.fillText(nm, p.px, p.py - 45);
      // 头顶警觉图标
      ctx.font = '13px sans-serif';
      ctx.fillText('👁', p.px, p.py - 62 + Math.sin(t / 350) * 2);
    }
  },

  renderActors(ctx) {
    // 按 y 排序绘制（画家算法）
    const actors = [...this.npcs.map(n => ({ type: 'npc', n })), { type: 'player' }];
    actors.sort((a, b) => {
      const ay = a.type === 'player' ? this.player.y : a.n.y;
      const by = b.type === 'player' ? this.player.y : b.n.y;
      return ay - by;
    });
    for (const a of actors) {
      if (a.type === 'player') {
        this.drawActor(ctx, this.player.x, this.player.y, (Game.state && Game.state.currentPov) || 'anna',
          this.player.dir, this.player.frame, null, false, true);
      } else {
        const n = a.n;
        // 靠近时转向玩家
        let dir = 'down';
        const dx = this.player.x - n.x, dy = this.player.y - n.y;
        if (dx * dx + dy * dy < 8100) {
          dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        }
        this.drawActor(ctx, n.x, n.y, n.char, dir, 0, n.name, !!n.hostile, false);
      }
    }
  },

  drawActor(ctx, x, y, charId, dir, frame, name, hostile, isPlayer) {
    const t = Engine.elapsed;
    // 玩家脚底光环
    if (isPlayer) {
      const pu = 0.45 + Math.sin(t / 400) * 0.25;
      ctx.strokeStyle = 'rgba(232,200,96,' + pu.toFixed(2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y + 11, 12, 4.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    PixelActor.draw(ctx, charId || 'anna', x, y + 10, dir || 'down', frame || 0, t);
    // NPC 名牌
    if (name) {
      ctx.font = '11px "Courier New", monospace';
      ctx.textAlign = 'center';
      const w = ctx.measureText(name).width + 10;
      ctx.fillStyle = 'rgba(10,14,26,0.78)';
      ctx.fillRect(x - w / 2, y - 54, w, 15);
      ctx.strokeStyle = hostile ? 'rgba(200,90,90,0.6)' : 'rgba(120,140,190,0.5)';
      ctx.strokeRect(x - w / 2 + 0.5, y - 53.5, w - 1, 14);
      ctx.fillStyle = hostile ? '#e0a0a0' : '#c0d0f0';
      ctx.fillText(name, x, y - 43);
    }
  },

  renderBubbles(ctx) {
    const t = Engine.elapsed;
    for (const n of this.npcs) {
      if (n.talked) continue;
      const bob = Math.sin(t / 350 + n.x) * 3;
      const bx = n.x, by = n.y - 64 + bob;
      if (n.required) {
        // 金色感叹号（主线 NPC）
        ctx.fillStyle = 'rgba(10,14,26,0.85)';
        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e8c860';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#e8c860';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', bx, by + 5);
      } else {
        // 银色省略号（可聊天 NPC）
        ctx.fillStyle = 'rgba(20,26,44,0.8)';
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#a0b0d0';
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('…', bx, by + 4);
      }
    }
  },

  renderHUD(ctx) {
    // 左上：地图名 + 动态目标列表
    const label = this.map.name;
    ctx.font = '13px "Courier New", monospace';
    const w1 = ctx.measureText(label).width + 24;

    const goals = [];
    const pickTotal = this.pickups.length;
    const pickDone = this.pickups.filter(p => p.taken).length;
    if (pickTotal) goals.push({ text: `${this.map.pickVerb || '收集'}${this.map.pickName || '物品'} ${pickDone}/${pickTotal}`, ok: pickDone >= pickTotal });
    const intList = this.interacts.filter(i => i.required !== false);
    const intDone = intList.filter(i => i.done).length;
    if (intList.length) goals.push({ text: `${this.map.intVerb || '检查'}${this.map.intName || '目标'} ${intDone}/${intList.length}`, ok: intDone >= intList.length });
    const reqTotal = this.npcs.filter(n => n.required).length;
    const reqDone = this.talkedRequired.length;
    if (reqTotal) goals.push({ text: `关键人物交谈 ${reqDone}/${reqTotal}`, ok: reqDone >= reqTotal });
    if (this.map.ammoMode) goals.push({ text: `携带弹药 ${this.carried}`, ok: false });
    if (this.map.patrols && this.patrols.length) goals.push({ text: `被发现 ${this.spottedCount} 次`, ok: this.spottedCount === 0 });

    ctx.fillStyle = 'rgba(10,14,26,0.82)';
    ctx.fillRect(10, 8, w1, 24);
    ctx.strokeStyle = 'rgba(90,110,170,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10.5, 8.5, w1 - 1, 23);
    ctx.fillStyle = '#e0d0a0';
    ctx.textAlign = 'left';
    ctx.fillText(label, 22, 24);

    let y = 38;
    for (const g of goals) {
      const w = ctx.measureText(g.text).width + 24;
      ctx.fillStyle = 'rgba(10,14,26,0.82)';
      ctx.fillRect(10, y, w, 21);
      ctx.strokeStyle = 'rgba(90,110,170,0.6)';
      ctx.strokeRect(10.5, y + 0.5, w - 1, 20);
      ctx.fillStyle = g.ok ? '#80d090' : '#a0b8e0';
      ctx.fillText(g.text, 22, y + 15);
      y += 25;
    }

    // 右上：限时倒计时
    if (this.timeLimit > 0) {
      const sec = Math.ceil(this.timeLeft);
      const mm = String(Math.floor(sec / 60)).padStart(2, '0');
      const ss = String(sec % 60).padStart(2, '0');
      const txt = this.timedOut ? '⏰ 已延误' : `⏱ ${mm}:${ss}`;
      const urgent = !this.timedOut && this.timeLeft < 25;
      ctx.font = (urgent ? 'bold ' : '') + '15px "Courier New", monospace';
      const w = ctx.measureText(txt).width + 24;
      ctx.fillStyle = 'rgba(10,14,26,0.85)';
      ctx.fillRect(Engine.width - w - 10, 8, w, 26);
      ctx.strokeStyle = urgent || this.timedOut ? 'rgba(220,100,90,0.8)' : 'rgba(90,110,170,0.6)';
      ctx.strokeRect(Engine.width - w - 9.5, 8.5, w - 1, 25);
      ctx.fillStyle = this.timedOut ? '#d07060' : urgent ? '#f0a070' : '#e0d0a0';
      ctx.fillText(txt, Engine.width - w + 2, 26);
    }
  },

  // ===== 底部提示条 =====
  showHint(text) {
    let el = document.getElementById('explore-hint');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
    el.classList.remove('pop');
    void el.offsetWidth; // 重启动画
    el.classList.add('pop');
  },

  hideHint() {
    const el = document.getElementById('explore-hint');
    if (el) el.classList.add('hidden');
  },
};

// 辅助：NPC 是否配置了任务
function npc_quest(npc) {
  return npc && npc.quest;
}
