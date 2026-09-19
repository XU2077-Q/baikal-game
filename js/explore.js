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
    npcs: [
      {
        id: 'efim', char: 'efim', name: '叶菲姆', avatar: '🔧', color: '#7aa86a',
        x: 13, y: 8, required: true, quest: 'q_invite_efim',
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
    npcs: [
      {
        id: 'andrei', char: 'andrei', name: '老安德烈', avatar: '👴', color: '#8a7a5a',
        x: 15, y: 16, required: true,
        dialogue: [
          { speaker: '老安德烈', text: '安娜！长椅要再检查一遍，代表们马上就到了。' },
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
    npcs: [
      {
        id: 'efim', char: 'efim', name: '叶菲姆', avatar: '🔧', color: '#7aa86a',
        x: 12, y: 7, required: true,
        dialogue: [
          { speaker: '叶菲姆', text: '政委同志！机枪组已经就位，就在那排沙袋后面。' },
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
    npcs: [
      {
        id: 'sablin', char: 'sablin', name: '萨布林', avatar: '⭐', color: '#c8a850',
        x: 15, y: 5, required: true,
        dialogue: [
          { speaker: '萨布林', text: '同志们！伊尔库茨克就在眼前——亚戈达那帮蛀虫最后的老巢！' },
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
    npcs: [
      {
        id: 'braun', char: 'braun', name: '布劳恩', avatar: '🌍', color: '#7a8a9a',
        x: 8, y: 9, required: true,
        dialogue: [
          { speaker: '布劳恩', text: '罗曼诺娃同志！列车还有二十分钟进站。车上有西北来的同志——还有药品、电台，和一份重要的消息。' },
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
    npcs: [
      {
        id: 'pechuro', char: 'pechuro', name: '佩楚罗', avatar: '📚', color: '#a08ac0',
        x: 15, y: 6, required: true,
        dialogue: [
          { speaker: '佩楚罗', text: '萨布林同志，政府的命令已经签署：战争总动员。从今天起，整个俄罗斯的命运，就在这张桌子上。' },
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
  waitingChoice: false,
  onExit: null,
  node: null,
  hintTimer: 7000,
  speed: 150,

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

    this.talkedRequired = [];
    this.exitOpen = false;
    this.dialogueActive = false;
    this.waitingChoice = false;
    this.hintTimer = 7000;

    if (node.quests) node.quests.forEach(q => StoryEngine.addQuest(q));

    this.active = true;
    Engine.gameMode = 'explore';
    UI.toast(`🗺️ ${def.name}`, 2500);
    this.showHint('WASD / 方向键 移动 · 空格 交谈');
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

  updateNearHint() {
    const n = this.nearestNpc();
    if (n && !this.dialogueActive) {
      this.showHint(`空格 · 与${n.required && !n.talked ? '★' : ''}${n.name}交谈`);
    } else if (this.exitOpen) {
      const ex = this.map.exit;
      this.showHint(`目标完成 → 前往出口（右下发光处）`);
    } else if (!this.dialogueActive) {
      this.hideHint();
    }
  },

  // ===== 交互与对话 =====
  tryInteract() {
    if (this.dialogueActive) return;
    const n = this.nearestNpc();
    if (n) this.talkTo(n);
  },

  talkTo(npc) {
    this.currentNpc = npc;
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
    const npc = this.currentNpc;
    UI.hideDialog();
    this.dialogueActive = false;
    this.currentNpc = null;
    if (!npc) return;
    npc.talked = true;

    if (npc.quest) StoryEngine.completeQuest(npc.quest);

    if (npc.required && !this.talkedRequired.includes(npc.id)) {
      this.talkedRequired.push(npc.id);
      const reqIds = this.npcs.filter(n => n.required).map(n => n.id);
      if (reqIds.every(id => this.talkedRequired.includes(id))) {
        this.exitOpen = true;
        UI.toast('✦ 交谈目标完成！前往发光的出口', 3500);
        // 出口烟花
        const ex = this.map.exit;
        for (let i = 0; i < 20; i++) {
          Engine.spawnParticle(
            ex.x * TILE + TILE / 2, ex.y * TILE + TILE / 2,
            (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120,
            '#e8c860', 3, 0.9
          );
        }
      }
    }

    if (npc.reward) {
      const r = npc.reward;
      if (r.supplies) Game.state.resources.supplies += r.supplies;
      if (r.morale) Game.state.resources.morale = Math.min(100, Game.state.resources.morale + r.morale);
      UI.toast(`🎁 获得：补给 +${r.supplies || 0} · 士气 +${r.morale || 0}`, 2200);
    }
  },

  doExit() {
    if (!this.exitOpen) {
      const now = performance.now();
      if (now - this.exitWarned > 2500) {
        this.exitWarned = now;
        const left = this.npcs.filter(n => n.required && !n.talked).length;
        UI.toast(`还有 ${left} 位关键人物（!）未交谈`, 1800);
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
        const pov = Characters[Game.state.currentPov] || Characters.anna;
        this.drawActor(ctx, this.player.x, this.player.y, pov.color || '#b08ac0',
          this.player.dir, this.player.frame, pov.avatar || '👤', null, true);
      } else {
        const n = a.n;
        this.drawActor(ctx, n.x, n.y, n.color || '#7a8a9a', 'down', 0, n.avatar || '👤', n.name, false, n.hostile);
      }
    }
  },

  drawActor(ctx, x, y, clothColor, dir, frame, avatar, name, isPlayer, hostile) {
    const t = Engine.elapsed;
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 行走腿（两帧）
    const legOff = frame === 1 || frame === 3 ? 2 : (frame === 2 ? -1 : 0);
    const walking = frame > 0;
    ctx.fillStyle = '#2a2430';
    if (dir === 'left' || dir === 'right') {
      ctx.fillRect(x - 5, y + 2, 4, 8 + (walking ? legOff : 0));
      ctx.fillRect(x + 1, y + 2, 4, 8 - (walking ? legOff : 0));
    } else {
      ctx.fillRect(x - 6, y + 2, 5, 8 + (walking ? legOff : 0));
      ctx.fillRect(x + 1, y + 2, 5, 8 - (walking ? legOff : 0));
    }

    // 身体
    ctx.fillStyle = clothColor;
    ctx.fillRect(x - 7, y - 8, 14, 12);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(x - 7, y - 8, 14, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x - 7, y + 1, 14, 3);

    // 头
    ctx.fillStyle = '#e8c8a8';
    ctx.fillRect(x - 5, y - 18, 10, 10);
    // 头发
    ctx.fillStyle = isPlayer ? this.playerHair() : '#4a3428';
    ctx.fillRect(x - 5, y - 18, 10, 4);
    if (dir === 'up') ctx.fillRect(x - 5, y - 18, 10, 8);
    if (dir === 'left') ctx.fillRect(x - 5, y - 18, 3, 8);
    if (dir === 'right') ctx.fillRect(x + 2, y - 18, 3, 8);
    // 眼睛
    if (dir !== 'up') {
      ctx.fillStyle = '#201820';
      if (dir === 'down') {
        ctx.fillRect(x - 3, y - 14, 2, 2);
        ctx.fillRect(x + 1, y - 14, 2, 2);
      } else if (dir === 'left') {
        ctx.fillRect(x - 4, y - 14, 2, 2);
      } else {
        ctx.fillRect(x + 2, y - 14, 2, 2);
      }
    }

    // 头顶 emoji
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(avatar, x, y - 22);

    // NPC 名牌
    if (name) {
      ctx.font = '11px "Courier New", monospace';
      const w = ctx.measureText(name).width + 10;
      ctx.fillStyle = 'rgba(10,14,26,0.75)';
      ctx.fillRect(x - w / 2, y - 40, w, 15);
      ctx.strokeStyle = hostile ? 'rgba(200,90,90,0.6)' : 'rgba(120,140,190,0.5)';
      ctx.strokeRect(x - w / 2 + 0.5, y - 39.5, w - 1, 14);
      ctx.fillStyle = hostile ? '#e0a0a0' : '#c0d0f0';
      ctx.fillText(name, x, y - 29);
    }
  },

  playerHair() {
    const map = { anna: '#c09ad0', sablin: '#5a3a2a', lyupasha: '#d09060' };
    return map[Game.state.currentPov] || '#5a3a2a';
  },

  renderBubbles(ctx) {
    const t = Engine.elapsed;
    for (const n of this.npcs) {
      if (n.talked) continue;
      const bob = Math.sin(t / 350 + n.x) * 3;
      const bx = n.x, by = n.y - 50 + bob;
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
    // 左上：地图名 + 目标
    const label = this.map.name;
    ctx.font = '13px "Courier New", monospace';
    const ctxx = ctx;
    const w1 = ctx.measureText(label).width + 24;
    const reqTotal = this.npcs.filter(n => n.required).length;
    const reqDone = this.talkedRequired.length;
    const goal = reqTotal > 0 ? `目标：与关键人物交谈 ${reqDone}/${reqTotal}` : '目标：前往出口';
    const w2 = ctx.measureText(goal).width + 24;

    ctx.fillStyle = 'rgba(10,14,26,0.82)';
    ctx.fillRect(10, 8, w1, 24);
    ctx.fillRect(10, 36, w2, 22);
    ctx.strokeStyle = 'rgba(90,110,170,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10.5, 8.5, w1 - 1, 23);
    ctx.strokeRect(10.5, 36.5, w2 - 1, 21);

    ctx.fillStyle = '#e0d0a0';
    ctx.textAlign = 'left';
    ctx.fillText(label, 22, 24);
    ctx.fillStyle = reqDone >= reqTotal && reqTotal > 0 ? '#80d090' : '#a0b8e0';
    ctx.fillText(goal, 22, 51);
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
