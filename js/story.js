/* =========================================================
 * 贝加尔湖畔 · 剧情数据（TNO 融合版）
 * 章节结构：
 *   序章 · 新秩序的世界（TNO 世界观）
 *   第一章 · 来自西边的故人（小说 · 安娜视角）
 *   第二章 · 「国际」与「革命」（小说 · 大会与NKVD突袭）
 *   第三章 · 新十月革命（TNO 正史 · 广播塔起义）
 *   第四章 · 冰湖的解放（伊尔库茨克战役）
 *   第五章 · 东方红（东方红子模组联动 · 中国线）
 *   第六章 · 再造苏联（统一俄罗斯 · 战略地图）
 *   终章 · 第二次西俄战争（2WRW · 莫斯科-日耳曼尼亚）
 * =======================================================*/

const Story = {
  // ======== 序章 · 新秩序的世界（TNO 世界观） ========
  prologue_01: {
    chapter: 0,
    nodes: [
      { type: 'narrative', text: '1962年。欧洲最后的黄昏。' },
      { type: 'narrative', text: '大多数俄国人会说，苏联毁灭于1945年——当纳粹的战车碾过乌拉尔，联盟在炮火中土崩瓦解，德军直抵阿斯特拉罕-阿尔汉格尔斯克线。' },
      { type: 'narrative', text: '但伊尔库茨克的亚戈达和他的「最高主席团」宣称：苏联从未毁灭，仍从贝加尔湖畔合法地统治着它。' },
      { type: 'narrative', text: '然而，有一个年轻人知道真相——' },
      { type: 'narrative', text: '苏联真正毁灭于1924年。那一年，尼古拉·布哈林赢得了继承列宁的权力斗争，开始亲手拆解列宁曾为之奋斗的一切。' },
      { type: 'narrative', text: '布哈林的政策因经济缺陷、控制力不足、备战滞后，最终在德军入侵后全面失败。1941年，「巴巴罗萨」降临，苏军兵败如山倒。' },
      { type: 'narrative', text: '战败、崩溃、瓜分。德国人拿到了莫斯科和西方的沃土，日本人占据了远东，而在两者之间的广袤废土上，几十个军阀割据混战——西俄战争阵线、萨马拉、秋明、斯维尔德洛夫斯克、黑军团、外贝加尔「公国」……' },
      { type: 'scene-set', scene: 'snow_street' },
      { type: 'narrative', text: '1960年，东方专员辖区。' },
      { type: 'narrative', text: '史密斯将军正把玩着去年生日时元首送来的礼物——一枚原子弹的模型。那本该是装着铀-235的地方现在放着一根哈瓦那的雪茄。这已是欧洲现在能触摸的最安全的核武器了。今年春天，华盛顿又向东欧运输了200枚核弹头。' },
      { type: 'narrative', text: '窗外传来坦克的轰鸣声，帝国的铁十字旗在零下三十度的暴雪中冻成了一块薄板。副官快步走进房间，身上带着一股汽油味。' },
      { type: 'dialogue', speaker: '副官', text: '长官，电报。' },
      { type: 'narrative', text: '电文：西俄叛军已占领秋明，我第二集团军撤出油田，往高尔基。' },
      { type: 'narrative', text: '接近天明时分，史密斯将军来到了教堂。这座教堂已经辨认不出是哪一座——帝国的军队占领这里后，把和斯拉夫人有关的历史遗迹都抹去了。' },
      { type: 'dialogue', speaker: '史密斯', text: '党卫军居然没有烧掉这儿。' },
      { type: 'narrative', text: '面前的人一副东亚面孔——这里是将军接见日本特使的地方。特使拿出了一台设备，将军的眼前顿时呈现出一幅全息影像。' },
      { type: 'dialogue', speaker: '日本特使', text: '阁下，这是东京湾的樱花。' },
      { type: 'narrative', text: '史密斯仔细端详着。在核尘埃的笼罩下，樱花是为数不多的尚有生机的生物。一缕灰黄的光线穿过教堂的彩色玻璃照进黑暗的圣坛——阳光经过核尘埃的过滤已经微乎其微。' },
      { type: 'dialogue', speaker: '日本特使', text: '关东军可以提供给你们石油，只要把外兴安岭以北……' },
      { type: 'narrative', text: '史密斯将军没有丝毫犹豫，签下了足以出卖半个西伯利亚的协议。' },
      { type: 'narrative', text: '这就是「新秩序」的世界——纳粹登上了月球，经济在奴役中腐烂，三大阵营在核火边缘对峙。而在贝加尔湖畔的冰层之下，有什么东西正在苏醒。' },
      { type: 'narrative', text: '一个1939年出生的年轻人——没有卫国战争的记忆，却从小梦想着记忆里的那个苏联。' },
      { type: 'narrative', text: '他的名字，叫瓦列里·萨布林。' },
      { type: 'narrative', text: '「为了敢于疯狂，我们高唱赞歌。」——高尔基《海燕之歌》' },
      { type: 'quest-complete', quest: 'q_tno_intro' },
      { type: 'transition', target: 'ch1_01', effect: 'fade', wait: 2000 },
    ]
  },

  // ======== 第一章 · 来自西边的故人（安娜视角） ========
  ch1_01: {
    chapter: 1,
    pov: 'anna',
    chapterTitle: '第一章 · 来自西边的故人',
    nodes: [
      { type: 'scene-set', scene: 'underground_bunker' },
      { type: 'narrative', text: '地下50米。' },
      { type: 'narrative', text: '偌大的地下室空荡荡的，只有一架旧钢琴摆在房间的一角。周围静得出奇，只有钢琴琴锤敲击琴弦的声音。' },
      { type: 'narrative', text: '安娜·罗森塔尔娃正在为这架博兰斯勒调音。这架从博物馆里拖出来的钢琴已经老旧不堪，甚至少了几个键。但是，已经足以弹奏那首曲子了。' },
      { type: 'narrative', text: '自从亚戈达带着一帮军官走遍了贝加尔湖畔之后，所有人都沉默了。' },
      { type: 'narrative', text: '「苏联最高主席团」组建了一支名为NKVD的部队——与其说是部队，不如说像是亚戈达派出的私人武装。他们在街上昂首挺胸地打砸抢，颇有些党卫军的风采。' },
      { type: 'narrative', text: '安娜第一次看到NKVD的时候，只有16岁。她和父亲逃亡到这个远离东欧战火的地方，而母亲早已在战火中去世。' },
      { type: 'narrative', text: '他们是居住在俄罗斯的犹太人。在大屠杀的阴影里，能活着到这贝加尔湖的犹太人百里挑一。' },
      { type: 'narrative', text: '她当时在工厂里做杂活。一个NKVD的军官看上了她，把她拽到一个角落，欲行不轨。很多人假装没看见——这在他们已稀松平常，漂亮女人就是NKVD军官的奴隶。' },
      { type: 'narrative', text: '正当安娜决定接受命运的时候，一个看上去只比她大几岁的年轻士官冲出来一拳干倒了那军官。' },
      { type: 'dialogue', speaker: '年轻士官', text: '快跑，跑到没人的地方去，快跑！安娜！' },
      { type: 'narrative', text: '安娜不知道那个士官的姓名。她只记得他白色的海军军装。' },
      { type: 'dialogue', speaker: '安娜', text: '那个人救了我。' },
      { type: 'dialogue', speaker: '父亲', text: '他是谁，孩子？' },
      { type: 'narrative', text: '安娜不知道怎么回答，沉默了一会儿。' },
      { type: 'dialogue', speaker: '安娜', text: '爸爸，你说，这绝望的世界什么人会去改变它呢？' },
      { type: 'dialogue', speaker: '父亲', text: '安娜，你觉得什么人会？' },
      { type: 'dialogue', speaker: '安娜', text: '委员会的人？' },
      { type: 'narrative', text: '父亲沉默着。' },
      { type: 'dialogue', speaker: '安娜', text: '自由国家组织？' },
      { type: 'narrative', text: '她听到了父亲长长的一声叹息，接着又是一阵沉默。' },
      { type: 'dialogue', speaker: '父亲', text: '孩子，以后如果有机会，你会知道答案的。' },
      { type: 'narrative', text: '安娜带着这个问题又活了三年，转眼间已是1962年。' },
      { type: 'narrative', text: '半年前，她偶然间加入了一个地下组织。他们称自己为「布尔什维克」，走街串巷地做些宣传工作，而且互称「同志」。' },
      { type: 'narrative', text: '安娜对这些工作潜藏的危险一无所知。她只是隐约听闻，有些同志被NKVD秘密逮捕，从此杳无音信。' },
      { type: 'narrative', text: '但她清楚，组织所从事的是伟大的工作——是为了砸碎镣铐、消灭剥削、解放全人类。' },
      { type: 'narrative', text: '在组织里，学习有关马克思主义的著作是每天都有的活动。安娜已读完了《资本论》的第一卷，一个关于阶级、剥削与解放的全新世界，清晰地展现在她眼前。' },
      { type: 'narrative', text: '今天，一个比她年长的同志把一架旧钢琴搬到了这个位于地下50米的地下室。' },
      { type: 'dialogue', speaker: '安德烈', text: '小姑娘，你居然会这个？这以前可是资产阶级的老爷们才接触的玩意儿。' },
      { type: 'narrative', text: '此话一出，旁边的几个姑娘便开始窃窃私语起来。' },
      { type: 'dialogue', speaker: '安娜', text: '和家父学过一些。' },
      { type: 'dialogue', speaker: '安德烈', text: '那么，同志们，如果没有异议，这件工作就交给安娜了。这周五就要表演了。喏，这是谱子。' },
      { type: 'narrative', text: '这位叫安德烈·托尔斯泰的老同志把一张泛黄的乐谱交到她手里。' },
      { type: 'narrative', text: '安娜正在调音，安德烈却不知什么时候走了。她拿起谱子——' },
      { type: 'narrative', text: '曲名是《国际歌》。' },
      { type: 'narrative', text: '想起父亲的话，安娜的眼泪无意间流了下来。' },
      { type: 'quest-add', quest: 'q_tune_piano' },
      { type: 'quest-complete', quest: 'q_tune_piano' },
      { type: 'transition', target: 'ch1_02', effect: 'fade', wait: 1200 },
    ]
  },

  ch1_02: {
    chapter: 1,
    pov: 'anna',
    nodes: [
      { type: 'scene-set', scene: 'club_warehouse' },
      { type: 'narrative', text: '干部俱乐部。' },
      { type: 'narrative', text: '亚戈达用首都的名字给这片土地命名——「伊尔库茨克」，东西伯利亚的第二大城市。' },
      { type: 'narrative', text: '曾几何时，亚戈达也算是实际上的「苏联最高主席团」的主席。特别是在西俄战争中西俄革命战线失败之后，叶戈罗夫苟延残喘，斯大林含恨离世，他亚戈达总算是成了「苏联」的核心人物。' },
      { type: 'narrative', text: '谁知道改组扩建了NKVD之后，军队竟然一天天地颓败下去，以至于丢了外阿穆尔、阿穆尔，只能龟缩在贝加尔湖周围的一小圈里，与黑军时常大动干戈，让他头痛不已。' },
      { type: 'narrative', text: '但是，生活中还是有美好的一面的——比如说，现在在他面前整理文件的柳帕莎·罗曼诺娃。' },
      { type: 'dialogue', speaker: '亚戈达', text: '罗曼诺娃同志，来，我给你看样东西。' },
      { type: 'dialogue', speaker: '柳帕莎', text: '主席同志，这些文件已经整理好了，我先去处理其他工作了。' },
      { type: 'narrative', text: '说完，柳帕莎头也不回地走了。' },
      { type: 'narrative', text: '亚戈达望着她的背影，突然就没了斗志。过了一会儿，他抬起头来，愤怒地颤抖着，肌肉抽搐，面目狰狞。' },
      { type: 'dialogue', speaker: '亚戈达', text: '总有一天……总有一天！' },
      { type: 'narrative', text: '——视线回到安娜这边。' },
      { type: 'narrative', text: '昨天晚上弹完琴后，安娜的心情久久不能平复。爸爸说的话仍然萦绕在耳畔。' },
      { type: 'dialogue', speaker: '安娜（内心）', text: '"你会知道答案的，孩子。"……可是，答案在哪里呢？' },
      { type: 'narrative', text: '政府所说的苏联，和现在没有什么差别。分配制是没有变化的，就是计划经济体制，有小私人商贩在街上走动，只不过是因为政府管控不严格罢了。' },
      { type: 'dialogue', speaker: '安娜（内心）', text: '父亲口中真正的苏联是什么模样？或许，它从未出现过？' },
      { type: 'narrative', text: '生活总得继续。清晨的斜阳把安娜从单身公寓的床上唤醒后，安娜将《国际歌》的谱子藏好，出门拐过几条街，便走到了平常工作的地方——干部俱乐部。' },
      { type: 'narrative', text: '一个军官搂着一个美妇，踹开大门，从俱乐部里摇摇晃晃地走了出来，差点撞到安娜。安娜急忙躲闪。' },
      { type: 'dialogue', speaker: '安娜', text: '这些好吃懒做的家伙。' },
      { type: 'narrative', text: '安娜扶正了俱乐部门口的两块牌子，牌子上写着「坚持宵衣旰食，抵制醉生梦死」。安娜冷笑了一声，拉开门走了进去。' },
      { type: 'narrative', text: '天刚蒙蒙亮，俱乐部却如同白昼一般。酒盏碰击的声音和军官、士兵毫无顾忌的大笑声混在一起。俱乐部里没有钟表已经是一个不成文的规定了。' },
      { type: 'narrative', text: '安娜绕开一个浑身散发着酒气的士兵，走进了俱乐部的仓库。她的工作就是清点与核算——一个无聊的工作。她曾经想辞掉这个工作，但老安德烈劝她说待在这里或许会有大用处，她便一直待了下来。' },
      { type: 'narrative', text: '仓库里还很安静。晨光从高窗斜落进来，照在一排排货架上。' },
      { type: 'transition', target: 'ch1_02e', effect: 'fade', wait: 600 },
    ]
  },

  ch1_03_a: {
    chapter: 1, pov: 'anna',
    nodes: [
      { type: 'dialogue', speaker: '安娜', text: '叶菲姆，你还年轻，未来是你们的。我们做的事情，也许现在看起来很危险，但总有一天，你会明白它的意义。' },
      { type: 'dialogue', speaker: '安娜', text: '你想想看——我们为什么要在这里忍气吞声？为什么那些NKVD可以为所欲为？' },
      { type: 'dialogue', speaker: '叶菲姆', text: '姐……我知道了。我去。' },
      { type: 'dialogue', speaker: '安娜', text: '这就对了！今晚八点，老地方。记住——不要告诉任何人。' },
      { type: 'narrative', text: '叶菲姆用力点点头，然后又把自己埋进了一堆账本里。' },
      { type: 'quest-complete', quest: 'q_invite_efim' },
      { type: 'transition', target: 'ch1_04', effect: 'fade', wait: 800 },
    ]
  },
  ch1_03_b: {
    chapter: 1, pov: 'anna',
    nodes: [
      { type: 'dialogue', speaker: '安娜', text: '叶菲姆，我不是逼你。只是现在这个世道，我们工人不团结起来，就只能永远被欺负。' },
      { type: 'dialogue', speaker: '安娜', text: '你看外面那些军官——他们凭什么作威作福？因为他们手里有枪，而我们一盘散沙。' },
      { type: 'dialogue', speaker: '叶菲姆', text: '姐，你说得对。我……我去看看。' },
      { type: 'narrative', text: '叶菲姆答应下来，然后又把自己埋进了一堆账本里。' },
      { type: 'quest-complete', quest: 'q_invite_efim' },
      { type: 'transition', target: 'ch1_04', effect: 'fade', wait: 800 },
    ]
  },
  ch1_03_c: {
    chapter: 1, pov: 'anna',
    nodes: [
      { type: 'dialogue', speaker: '安娜', text: '没关系，你不想去也不勉强。毕竟这事有风险。' },
      { type: 'dialogue', speaker: '叶菲姆', text: '姐……我不是不想去。我就是怕万一出了事……' },
      { type: 'narrative', text: '叶菲姆低着头，似乎在纠结什么。过了一会儿——' },
      { type: 'dialogue', speaker: '叶菲姆', text: '姐，我……我还是去吧。我想亲眼看看。' },
      { type: 'quest-complete', quest: 'q_invite_efim' },
      { type: 'transition', target: 'ch1_04', effect: 'fade', wait: 800 },
    ]
  },

  ch1_04: {
    chapter: 1,
    pov: 'anna',
    nodes: [
      { type: 'narrative', text: '安娜看着叶菲姆，突然觉得有些好笑。果然是个孩子呢。她想，我当时恐怕在别人眼里也就是这样——一个异乡人，涉世未深的犹太女孩。' },
      { type: 'narrative', text: '仓库外面传来一阵嘈杂的声音。一个军官正和外面的堂倌吵嚷着要进仓库拿上好的雪茄。' },
      { type: 'dialogue', speaker: '军官', text: '滚！老子自己动手。' },
      { type: 'narrative', text: '军官不耐烦了，打了堂倌一巴掌，把他推到一边。一声闷响，军官已经撞开了仓库大门。' },
      { type: 'dialogue', speaker: '军官', text: '你们这儿谁管事的，给我过来！' },
      { type: 'narrative', text: '叶菲姆主动迎了上去。安娜盯着那军官——她好像在哪里见过这个人，但此刻无论如何也回想不起来。' },
      { type: 'dialogue', speaker: '军官', text: '啰啰嗦嗦的，最好的雪茄烟在哪里放，要古巴产的那种……' },
      { type: 'narrative', text: '叶菲姆知道自己马上要大祸临头了——他不清楚雪茄的存放位置。沉默只持续了几秒钟，军官举起拳头——' },
      { type: 'narrative', text: '安娜认出了那个军官。三年前，正是他想占有自己。' },
      { type: 'narrative', text: '安娜不知道自己是怎样冲到叶菲姆身边推开了他，拉着那个军官给他挑选了最好的雪茄。整个过程中，安娜没有抬头看一眼。' },
      { type: 'narrative', text: '她把军官送出仓库时，面色煞白。叶菲姆仿佛看见了从未见过的陌生人，不敢说一句话。' },
      { type: 'dialogue', speaker: '叶菲姆', text: '姐，你没事吧？你认识那个人么？' },
      { type: 'dialogue', speaker: '安娜', text: '不……不认识。叶菲姆，你帮我值半天班吧，下次我请你吃饭……' },
      { type: 'narrative', text: '叶菲姆目送着安娜，看着她踉踉跄跄地走出了俱乐部。' },
      { type: 'narrative', text: '他怎么会来这里？他不是在西岸吗？我怎么这么倒霉？我……我为什么还这么怕他？' },
      { type: 'scene-set', scene: 'apartment' },
      { type: 'narrative', text: '这样想着的安娜走回了单身公寓。她躺在床上，心里五味杂陈，泪眼婆娑中，她又想起了那个穿着白色海军军装的青年。' },
      { type: 'dialogue', speaker: '安娜（内心）', text: '他在哪儿呢？或许，他已经死了……毕竟惹了NKVD的人都没有好下场。' },
      { type: 'narrative', text: '在太阳即将隐没的时候，谁能确保自己下一秒还能看见眼前人呢？' },
      { type: 'narrative', text: '安娜拿出了国际歌的谱子，轻轻地哼唱起来。过了一会，她披上了大衣，在亮着昏黄灯光的书桌上抽出一张信纸，给父亲写了一封信。' },
      { type: 'narrative', text: '封好信时，屋外的雪下得愈发紧切。安娜关上台灯，戴上父亲送她的小毡帽，拿起谱子和信封，拉开门钻进了雪里。大雪密密簌簌地落下，不久便掩盖了她去时的足迹。' },
      { type: 'quest-complete', quest: 'q_club_work' },
      { type: 'quest-add', quest: 'q_meeting' },
      { type: 'transition', target: 'ch2_00e', effect: 'fade', wait: 1500 },
    ]
  },

  // ======== 第二章 · 「国际」与「革命」（大会 + NKVD突袭） ========
  ch2_01: {
    chapter: 2,
    pov: 'anna',
    chapterTitle: '第二章 · 「国际」与「革命」',
    nodes: [
      { type: 'scene-set', scene: 'bunker_hall' },
      { type: 'narrative', text: '「伊尔库茨克」有许多这样的秘密集聚场所——它们或是一个偏僻郊外的废弃工厂，或是在闹市区出租的一套单身公寓，又或是一些前苏联时期遗留下来的防空洞。' },
      { type: 'narrative', text: '安德烈在一次维修工作中偶然发现的这个位于上乌金斯克市区地下50米的防空洞，就是其中之一。' },
      { type: 'narrative', text: '组织内的大会马上要召开了。许多青年人陆续走进会场，其中偶尔看见一两个五六十岁的老同志。奇怪的是，进来的人中几乎没有中年人。' },
      { type: 'narrative', text: '坐在前排的柳帕莎·罗曼诺娃正聚精会神地盯着入口。按照她的想法，大家不应该这么一窝蜂地进来——积聚的任何团体都会引发NKVD的怀疑。' },
      { type: 'narrative', text: '柳帕莎无奈地笑了笑。她在等待的那个人也在这许多同志之中呢。' },
      { type: 'narrative', text: '瓦伦蒂娜·娜塔莉亚诺娃走到讲台前。她是今天的主持人。' },
      { type: 'dialogue', speaker: '瓦伦蒂娜', text: '各位同志们，大家晚上好！我们「布尔什维克爱国青年组织」的第一次代表大会现在开始了！首先请西岸的柳帕莎·罗曼诺娃同志上台作工作报告！' },
      { type: 'narrative', text: '台下响起了一阵震耳欲聋的掌声。安娜也在他们之中，她坐在第四排靠近走道的位置。' },
      { type: 'dialogue', speaker: '柳帕莎', text: '同志们好！组织刚成立的那一年，西岸的成员年末时只有50个，而截至目前，我们已有1000名成员，足足是六年前的20倍！' },
      { type: 'dialogue', speaker: '柳帕莎', text: '同志们应该都熟悉我们组织的纲领的最高目标——那就是实现全俄布尔什维克的大联合。这样的力量才能撼动德国鬼子的统治根基，才能争取我们的幸福和自由！' },
      { type: 'dialogue', speaker: '瓦伦蒂娜', text: '接下来请东岸的安德烈·托尔斯泰同志上台作工作报告。' },
      { type: 'dialogue', speaker: '安德烈', text: '东岸的工作，相比于柳帕莎同志领导的西岸，要困难许多。我们靠近日本人的势力范围，NKVD的渗透和监视就像贝加尔湖冬天的冰层一样，又厚又冷。' },
      { type: 'dialogue', speaker: '安德烈', text: '但是，同志们！数字不能说明一切！我们的同志，每一个都像西伯利亚的落叶松，扎根在冻土里，顽强地生长！' },
      { type: 'dialogue', speaker: '安德烈', text: '我们在最关键的地方——军工企业和运输枢纽——埋下了种子！我们正在绘制NKVD在东岸各地的详细布防图。这些工作，像在刀尖上跳舞，但我们没有退缩！' },
      { type: 'narrative', text: '台下爆发出热烈的掌声。坐在安娜旁边的一个青年眉宇间带着几分英气，像个军人，也站起来鼓掌。' },
      { type: 'dialogue', speaker: '瓦伦蒂娜', text: '同志们，我刚接到情报，NKVD的纠察队正向这里赶来，大约在1个小时之内，所以大会的议程紧急缩短了……不过，今天萨布林同志来了。让我们请他上台！' },
      { type: 'narrative', text: '众人面面相觑，都想知道萨布林在哪里。这个青年领袖神龙见首不见尾。' },
      { type: 'narrative', text: '有人说他是潜伏的地下党，有人说他与自由国家组织时有联系，甚至有人说他还在苏联太平洋舰队服役。总之，是个神秘人物。' },
      { type: 'narrative', text: '这时，安娜身边的那个青年站了起来。掌声顿时如同潮水般涌来。' },
      { type: 'narrative', text: '安娜吃了一惊，怔怔地望着那个青年人走上了讲台。但她像是没有看见他今天穿的大衣，脑海中只有那穿着白色军装挺身而出的身影。' },
      { type: 'dialogue', speaker: '安娜（内心）', text: '难道……是他？自己怎么对他的面容没有一点印象呢？但是那个背影——不，不会有错……' },
      { type: 'quest-add', quest: 'q_meet_sablin' },
      { type: 'transition', target: 'ch2_02', effect: 'fade', wait: 1500 },
    ]
  },

  // 萨布林视角 · 大会演讲
  ch2_02: {
    chapter: 2,
    pov: 'sablin',
    nodes: [
      { type: 'narrative', text: '瓦列里·萨布林看着台下黑压压的人群，心里万千感慨。' },
      { type: 'narrative', text: '自从他出手打了NKVD的军官救了那个女孩之后，已经过了三年。他被伊尔库茨克开除军籍，撤职政委，后来辗转加入了伊万·尤马舍夫将军的苏联太平洋舰队。' },
      { type: 'narrative', text: '他看着自己创建的组织发展壮大，已经形成了狂风暴雨之势，足以对亚戈达构成威胁……他一秒钟都不想耽搁。他心中有万千的话想对同志们说。' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们，谢谢，请大家安静。今天开这个会，一是为了总结我们的胜利成果，二是为了展望我们的未来。我今天想讲的是——「国际」与「革命」。' },
      { type: 'dialogue', speaker: '萨布林', text: '曾经有同志问了我一个问题：我们可不可以团结德国人进行革命？德国纳粹是我们的仇人，这是毋庸置疑的。但是，所有的德国人都是我们的敌人吗？我想并不是。' },
      { type: 'dialogue', speaker: '萨布林', text: '如果你对历史有足够的了解，就不难发现，我们在德国也拥有过同志。恩斯特·台尔曼，德国无产阶级革命的领袖，他领导的德国共产党曾占据了德国国会三分之一的席位。他最终被捕，死在奥斯维辛的集中营里。' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们，仇恨不是一下子形成的。我们不自觉地形成了一种民族对民族的仇恨——这对于我们的组织是不可取的。我们绝不能以狭隘的民族仇恨来埋没我们自己前进的道路。' },
      { type: 'dialogue', speaker: '萨布林', text: '《国际歌》——这首歌包含了伟大的国际主义精神，是全世界无产阶级的战歌！这就是「国际」。' },
      { type: 'dialogue', speaker: '萨布林', text: '东亚战争中有一个加拿大共产党员去往中国支援中国共产党，与日本法西斯作战。虽然他们最终失败，但那个叫白求恩的加拿大同志留在了中国。后来我去中国西北的时候见到了那位老人。他仍带领着中国共产党的党员们建设医院。' },
      { type: 'dialogue', speaker: '萨布林', text: '中国共产党没有消失——他们在西北的荒漠和西南的丛林中仍留有火种。同志们，我们有无穷的信心，我们的朋友遍布全世界！这就是「国际」！' },
      { type: 'narrative', text: '没等萨布林讲完话，台下已经爆发出掌声。他挥挥手，示意大家安静。这时，他脸上的神情突然从无比的自信转变成了钢铁般的坚毅。' },
      { type: 'dialogue', speaker: '萨布林', text: '谢谢同志们。我接下来想讲的第二个词，是——「革命」。' },
      { type: 'dialogue', speaker: '萨布林', text: '请大家仔细回想一下——五六年前，亚戈达是否还占有着远东？是的。但是现在呢？那些地方变成了雅库特、马加丹、阿穆尔，甚至外贝加尔「公国」。亚戈达所统辖的地区竟然被拥戴封建制的人推翻了——可见其统治已经多么摇摇欲坠、危如累卵！' },
      { type: 'dialogue', speaker: '萨布林', text: '他鼓吹自己是「苏联」的正统继承人。但我想说——他的「苏联」早已经死了！' },
      { type: 'dialogue', speaker: '萨布林', text: '苏联不是那个已经不堪回首的埋葬在历史中的国家，不是亚戈达及其走狗引以为傲的称呼，更不是以红色的名义搞联盟对立的工具！' },
      { type: 'dialogue', speaker: '萨布林', text: '苏联存在于我们无产阶级的心中，存在于每一个被奴役的民族之中，存在于每一个受压迫的人的血液中！' },
      { type: 'dialogue', speaker: '萨布林', text: '苏维埃不是一个代号——它是我们共同的信仰，是我们为之奋斗的目标，和我们愿意为之牺牲一切的东西！' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们，让亚戈达老鬼在革命的浪潮中发抖吧！同志们——我们就再造红军，我们将再造苏维埃，我们将再造苏联！' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们！我们一定胜利！苏维埃万岁！' },
      { type: 'narrative', text: '整个地下室颤动了一下，发出了震耳欲聋的掌声和嗡嗡声，仿佛要将房顶震塌。' },
      { type: 'narrative', text: '血液涌上了萨布林的头顶，他感到一阵眩晕。但一旁的钢琴让他回想起来最后一件事。' },
      { type: 'dialogue', speaker: '萨布林', text: '那么，请安娜·罗森塔尔娃同志来为我们伴奏《国际歌》。' },
      { type: 'narrative', text: '萨布林望着安娜，投以肯定的目光——他早已认出了这个女孩，没想到她已经长这么大了。' },
      { type: 'narrative', text: '安娜望着萨布林的面容，脑海中的回忆不断浮现。她想起来了——是这个青年，保护了她，救了她……她连忙起身走到台前的钢琴旁坐下。' },
      { type: 'dialogue', speaker: '萨布林', text: '放轻松，听我指挥。三、二、一——起！' },
      { type: 'narrative', text: '庄严的《国际歌》声在会场中响起。那段旋律，在每个人的耳中，都听得清清楚楚。' },
      { type: 'narrative', text: '"起来，饥寒交迫的奴隶！"' },
      { type: 'narrative', text: '"起来，全世界受苦的人！"' },
      { type: 'narrative', text: '"这是最后的斗争，团结起来到明天，英特纳雄耐尔，就一定要实现！"' },
      { type: 'narrative', text: '萨布林和几个老同志的齐唱逐渐变成了全体与会者的大合唱。歌声穿透了屋顶，穿透了50米的泥土，飞跃了覆盖着皑皑白雪的原野。' },
      { type: 'quest-complete', quest: 'q_meet_sablin' },
      { type: 'quest-complete', quest: 'q_meeting' },
      { type: 'quest-add', quest: 'q_kvkd_raid' },
      { type: 'transition', target: 'battle_raid_intro', effect: 'shake', wait: 2000 },
    ]
  },

  // NKVD突袭
  battle_raid_intro: {
    chapter: 2,
    pov: 'sablin',
    nodes: [
      { type: 'narrative', text: '突然——一阵枪声从入口处传来！' },
      { type: 'dialogue', speaker: 'NKVD队长', text: 'NKVD！全都不许动！' },
      { type: 'narrative', text: '粗暴的吼声回荡在防空洞里。瓦伦蒂娜的情报是准确的——但纠察队比预计来得更快。' },
      { type: 'dialogue', speaker: '安德烈', text: '同志们！保护代表们从密道撤离！萨布林同志，你带东岸的同志断后！' },
      { type: 'dialogue', speaker: '萨布林', text: '明白！柳帕莎，带大家走！安德烈同志，我们上！' },
      { type: 'narrative', text: '萨布林一把拽过旁边的椅子当作掩体，从大衣内侧拔出了手枪。这是三年来，他第一次重新投入战斗。' },
      { type: 'battle', battleId: 'battle_nkvd_raid', party: ['sablin', 'andrei', 'anna'], next: 'ch2_03' },
    ]
  },

  ch2_03: {
    chapter: 2,
    pov: 'sablin',
    nodes: [
      { type: 'narrative', text: '最后一名NKVD士兵倒在了地上。纠察队被击退了。' },
      { type: 'dialogue', speaker: '安德烈', text: '呼……好险。这帮家伙来的真快。这里已经暴露了，我们必须立即转移。' },
      { type: 'narrative', text: '萨布林转过头，看见安娜还靠在钢琴边，微微喘着气。她的手还在发抖——这是她第一次经历战斗。' },
      { type: 'dialogue', speaker: '萨布林', text: '你是……安娜·罗森塔尔娃？三年前，在西岸的一个工厂边上……我还记得。' },
      { type: 'narrative', text: '安娜抬起头，看着萨布林的眼睛。泪水突然涌了上来。' },
      { type: 'dialogue', speaker: '安娜', text: '真的是你……我找了你好久……我想知道——这绝望的世界，什么人会去改变它？' },
      { type: 'narrative', text: '萨布林沉默了一会儿，然后伸出手，轻轻拍了拍安娜的肩膀。' },
      { type: 'dialogue', speaker: '萨布林', text: '答案你已经知道了——不是吗？是我们。是每一个不愿做奴隶的人。是你，安娜。' },
      { type: 'narrative', text: '安娜望着他，破涕为笑。' },
      { type: 'dialogue', speaker: '安德烈', text: '萨布林同志，NKVD很快会派出更大规模的搜捕。我们在上乌金斯克待不下去了。' },
      { type: 'dialogue', speaker: '萨布林', text: '不——安德烈同志，恰恰相反。他们今晚的搜捕，暴露了他们在城内兵力空虚。' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们，密道里的代表们都撤离了吗？很好。那么——是时候了。' },
      { type: 'dialogue', speaker: '萨布林', text: '今晚，我们不逃了。今晚——我们去占领广播塔。' },
      { type: 'narrative', text: '所有人都愣住了。' },
      { type: 'dialogue', speaker: '安德烈', text: '广播塔？！那里有一个排的NKVD守备！' },
      { type: 'dialogue', speaker: '萨布林', text: '一个排——加上市里正在搜捕的大部队。他们会以为我们往城外跑。而我们，就站在他们的心脏里。' },
      { type: 'dialogue', speaker: '萨布林', text: '四十五年前，阿芙乐尔号的炮声宣告了一个时代。今晚——让广播塔的电波，宣告另一个时代。' },
      { type: 'quest-complete', quest: 'q_kvkd_raid' },
      { type: 'quest-add', quest: 'q_radio_tower' },
      { type: 'transition', target: 'ch3_00e', effect: 'fade', wait: 2000 },
    ]
  },

  // ======== 第三章 · 新十月革命（TNO 正史：广播塔起义） ========
  ch3_01: {
    chapter: 3,
    pov: 'sablin',
    chapterTitle: '第三章 · 新十月革命',
    nodes: [
      { type: 'scene-set', scene: 'radio_tower' },
      { type: 'narrative', text: '凌晨两点。上乌金斯克广播塔。' },
      { type: 'narrative', text: '暴风雪停了。萨布林带着二十名最可靠的同志，沿着维修梯无声地攀上了塔楼。' },
      { type: 'narrative', text: '在塔下，第五突击步兵师的一个连队正在待命——他们的营长上个月被NKVD拖进了树林，再也没有出现。' },
      { type: 'narrative', text: '他们只等一个信号。' },
      { type: 'dialogue', speaker: '萨布林', text: '记住——尽量活捉。最好不要流血。我们是革命者，不是屠夫。' },
      { type: 'dialogue', speaker: '萨布林', text: '广播塔里只有一个排的守军。叶菲姆——你带两个人控制配电室。安娜同志，你跟我来。' },
      { type: 'dialogue', speaker: '安娜', text: '我？我能做什么？' },
      { type: 'dialogue', speaker: '萨布林', text: '电波会传遍整个西伯利亚——但只有俄语。而布里亚特的牧民们，需要听到他们自己的语言。' },
      { type: 'narrative', text: '安娜愣住了，随即用力地点了点头。' },
      { type: 'narrative', text: '塔楼的灯亮了。NKVD的守军惊醒过来——' },
      { type: 'battle', battleId: 'battle_radio_tower', party: ['sablin', 'efim', 'anna', 'andrei'], next: 'ch3_02' },
    ]
  },

  ch3_02: {
    chapter: 3,
    pov: 'sablin',
    nodes: [
      { type: 'narrative', text: '枪声停了。守军排长放下了武器——他甚至没有真正抵抗。他的军饷被克扣了三分之一，他的弟弟在伊尔库茨克因「思想问题」被捕。' },
      { type: 'narrative', text: '萨布林走进了播音室。技术员们被反绑在椅子上，惊恐地望着这个穿着旧海军大衣的年轻人。' },
      { type: 'dialogue', speaker: '萨布林', text: '解开他们。同志们，如果你们愿意，请帮我们一个忙——把发射功率调到最大。' },
      { type: 'narrative', text: '技术员们交换了一下眼神。年长的那个缓缓站起来，走到了调音台前。' },
      { type: 'dialogue', speaker: '广播技术员', text: '……我父亲是老布尔什维克。他死于1948年。' },
      { type: 'dialogue', speaker: '广播技术员', text: '话筒给你，同志。全西伯利亚都听得见。' },
      { type: 'narrative', text: '萨布林深吸一口气，按下了直播键。红色的指示灯亮起——' },
      { type: 'dialogue', speaker: '萨布林', text: '全俄国的同志们，公民们！我是瓦列里·萨布林，布里亚特苏维埃的政委。' },
      { type: 'dialogue', speaker: '萨布林', text: '此刻，从贝加尔湖畔，我向你们讲话。十七年来，亚戈达和他的「最高主席团」自封为列宁的继承人——而他们用NKVD的皮靴，踩碎了一切党内批评的声音。' },
      { type: 'dialogue', speaker: '萨布林', text: '他们说，苏联还活着。同志们——苏联死于1924年，死于布哈林的手里！但他们连布哈林的遗产都配不上——他们只有腐败、告密和劳改营！' },
      { type: 'dialogue', speaker: '萨布林', text: '今夜，布里亚特的工人、牧民、士兵和妇女们站了起来。我们宣布——布里亚特自治苏维埃社会主义共和国，成立！' },
      { type: 'dialogue', speaker: '萨布林', text: '我们不承认亚戈达的「苏联」。我们要再造红军，再造苏维埃，再造一个属于全体人民——俄罗斯人、布里亚特人、一切被压迫民族——的苏联！' },
      { type: 'dialogue', speaker: '萨布林', text: '这不是叛乱。这是革命。是新十月！' },
      { type: 'dialogue', speaker: '萨布林', text: '全俄罗斯的兄弟们——加入我们！' },
      { type: 'narrative', text: '电波冲上夜空，越过贝加尔湖的冰面，越过外贝加尔的草原，传向伊尔库茨克、赤塔、新西伯利亚——传向整个在黑暗中等待了十七年的俄罗斯。' },
      { type: 'narrative', text: '安娜接过话筒，用布里亚特语重述了这段宣言。她的声音有些颤抖，但一字一顿。' },
      { type: 'dialogue', speaker: '安娜（布里亚特语广播）', text: '——蒙古语区的牧民兄弟们！……白音扎布老人在电台里听到自己民族的语言时，正在给马群添草料。他放下草叉，哭了。' },
      { type: 'narrative', text: '黎明时分，广播塔顶升起了红旗。' },
      { type: 'narrative', text: '而在上乌金斯克的兵营里，第五突击步兵师的士兵们撕掉了领章上的NKVD徽记。整个城市在一夜之间易帜——几乎没有流一滴血。' },
      { type: 'narrative', text: '同日，来自伊尔库茨克的三封电报到达：' },
      { type: 'narrative', text: '——苏珊娜·佩楚罗率政治犯同志会宣布支持革命，即刻北上。' },
      { type: 'narrative', text: '——奥托·布劳恩以德共流亡者支部的名义，向柏林方向发出德语通电：「不是所有德国人都是纳粹。」' },
      { type: 'narrative', text: '——玛雅·乌拉诺夫斯卡娅带着西岸地下组织的全部档案与经费，抵达上乌金斯克。' },
      { type: 'narrative', text: '布里亚特ASSR的第一届政府，在这座广播塔下宣誓就职。' },
      { type: 'dialogue', speaker: '佩楚罗', text: '萨布林同志，政府搭起来了。但我必须提醒你——伊尔库茨克的亚戈达还有九千兵力，而我们只有三千，一半是昨天的民兵。' },
      { type: 'dialogue', speaker: '萨布林', text: '所以不能等他缓过劲来。安德烈同志，民兵整训要多久？' },
      { type: 'dialogue', speaker: '安德烈', text: '满打满算，两个月。但有一个消息——城里的工人说，伊尔库茨克的军械库里，弹药只够打一场大仗。' },
      { type: 'dialogue', speaker: '佩楚罗', text: '还有更重要的。亚戈达的兵，四成是像今晚那个排长一样的人。他们不是敌人——是没有醒过来的自己人。' },
      { type: 'dialogue', speaker: '布劳恩', text: '那么战争的另一半，要在广播里打。我在慕尼黑写过传单，在华西列夫斯基的司令部里挨过批评——但这一次，请让我用德语和俄语，向他们的士兵喊话。' },
      { type: 'dialogue', speaker: '萨布林', text: '好。诸君——伊尔库茨克，贝加尔湖的心脏。拿不下它，革命就只有一个冬天的性命。' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们，向伊尔库茨克——进军！' },
      { type: 'quest-complete', quest: 'q_radio_tower' },
      { type: 'quest-complete', quest: 'q_buryatia_founded' },
      { type: 'quest-add', quest: 'q_irkutsk_offensive' },
      { type: 'transition', target: 'ch4_00e', effect: 'fade', wait: 2000 },
    ]
  },

  // ======== 第四章 · 冰湖的解放（伊尔库茨克战役） ========
  ch4_01: {
    chapter: 4,
    pov: 'anna',
    chapterTitle: '第四章 · 冰湖的解放',
    nodes: [
      { type: 'scene-set', scene: 'snow_street' },
      { type: 'narrative', text: '1963年3月。贝加尔湖的冰层开始碎裂的季节。' },
      { type: 'narrative', text: '革命军的纵队沿着湖岸向西挺进。安娜坐在宣传车的高音喇叭旁——布劳恩教了她喊话的技巧，而她教给了更多同志。' },
      { type: 'narrative', text: '一路上，村庄的青年们扛着猎枪加入队伍，牧民献出了马匹，妇女们把面包塞进士兵手里。' },
      { type: 'narrative', text: '而在对面的战壕里，NKVD的士兵们听着喇叭里的《国际歌》，一个接一个地扔下了步枪。' },
      { type: 'dialogue', speaker: '柳帕莎', text: '报——萨布林同志！伊尔库茨克内线传来的消息：亚戈达枪毙了两个主张谈判的团长，城里已经人心浮动。' },
      { type: 'dialogue', speaker: '萨布林', text: '他在替我们做动员。各部注意——明晨发起总攻。佩楚罗同志主持后方，乌拉诺夫斯卡娅同志保障补给。' },
      { type: 'dialogue', speaker: '萨布林', text: '安娜同志，你留在指挥所。' },
      { type: 'dialogue', speaker: '安娜', text: '不。我要去前线广播站。' },
      { type: 'dialogue', speaker: '萨布林', text: '……为什么？' },
      { type: 'dialogue', speaker: '安娜', text: '因为三年前在俱乐部仓库里，我因为恐惧，给他挑了最好的雪茄。我不想再在恐惧里待一秒钟了。' },
      { type: 'narrative', text: '萨布林看着她，点了点头。' },
      { type: 'narrative', text: '3月17日凌晨。伊尔库茨克城下。' },
      { type: 'narrative', text: '炮击开始了。安娜的广播站就架在距前线八百米的一座小教堂里——正是当年史密斯将军接见日本特使的那一类教堂，只是这一次，圣坛前架着的是扩音器。' },
      { type: 'battle', battleId: 'battle_irkutsk', party: ['sablin', 'andrei', 'efim', 'lyupasha'], next: 'ch4_02' },
    ]
  },

  ch4_02: {
    chapter: 4,
    pov: 'anna',
    nodes: [
      { type: 'narrative', text: '中午十二点，伊尔库茨克克里姆林宫顶上的蓝帽子旗被扯了下来。' },
      { type: 'narrative', text: '亚戈达在办公室里被士兵们揪出来的时候，还穿着睡衣。他挣扎着喊：「我是苏联的主席！你们都是叛徒！」' },
      { type: 'dialogue', speaker: '起义士兵', text: '苏联？哪个苏联？我们营长被你吊死在市中心的时候，你的苏联在哪儿？' },
      { type: 'narrative', text: '萨布林赶到时，制止了士兵们的拳头。' },
      { type: 'dialogue', speaker: '萨布林', text: '够了。他会接受审判——人民的审判，公开的审判。不是劳改营里的黑枪，也不是地窖里的绞索。这就是我们和他的区别。' },
      { type: 'narrative', text: '当夜，伊尔库茨克全城通电。广播里循环播放着新政府的公告。' },
      { type: 'dialogue', speaker: '安娜（广播）', text: '伊尔库茨克的公民们！从今天起，你们不需要通行证才能在夜里出门，不需要向蓝帽子鞠躬，不会因为一句玩笑话消失。' },
      { type: 'dialogue', speaker: '安娜（广播）', text: '从今天起，这里不再是「东俄最后的净土」——因为很快，整个俄罗斯都将是净土。' },
      { type: 'narrative', text: '冰湖解冻的轰鸣声中，贝加尔湖两岸第一次升起了同一面旗帜。' },
      { type: 'narrative', text: '——但革命还没有结束。' },
      { type: 'dialogue', speaker: '布劳恩', text: '萨布林同志，北京方向的密电。' },
      { type: 'narrative', text: '布劳恩把一张写满数字的纸条推过桌面。萨布林看完，缓缓抬起头。' },
      { type: 'dialogue', speaker: '萨布林', text: '西北的同志们……动手了？' },
      { type: 'dialogue', speaker: '布劳恩', text: '华北地下组织确认：中国共产党已在西北发起总反攻。日本人的「共荣圈」，撑不过这个十年了。' },
      { type: 'dialogue', speaker: '布劳恩', text: '他们的电报最后说——「全世界无产者，联合起来。期待与你们在第聂伯河会师。」' },
      { type: 'narrative', text: '萨布林走到窗前。窗外，贝加尔湖的春汛正奔涌向东。' },
      { type: 'dialogue', speaker: '萨布林', text: '第聂伯河……好，好啊。' },
      { type: 'dialogue', speaker: '萨布林', text: '传我的话给全体指战员：我们的革命，从来不只是俄罗斯一家的事。' },
      { type: 'quest-complete', quest: 'q_irkutsk_offensive' },
      { type: 'quest-add', quest: 'q_east_red' },
      { type: 'transition', target: 'ch5_00e', effect: 'fade', wait: 2000 },
    ]
  },

  // ======== 第五章 · 东方红（中国线联动） ========
  ch5_01: {
    chapter: 5,
    pov: 'lyupasha',
    chapterTitle: '第五章 · 东方红',
    nodes: [
      { type: 'scene-set', scene: 'snow_street' },
      { type: 'narrative', text: '满洲里边境。1965年春。' },
      { type: 'narrative', text: '柳帕莎·罗曼诺娃受命率领布里亚特代表团，秘密穿越边境——名义上是「考察贸易」，实际上，是去见一位老人。' },
      { type: 'narrative', text: '越过额尔古纳河，日军封锁线的另一侧，世界焕然一新：' },
      { type: 'narrative', text: '西北黄土高原上，「大生产」的标语刷满了窑洞；昔日的边区首府已是工业城市；土地改革的档案堆满了新政府的院子。' },
      { type: 'narrative', text: '而在延安的白求恩国际和平医院里，七十多岁的诺尔曼·白求恩大夫仍在做手术——从1938年到现在，他的手术刀没有停过。' },
      { type: 'dialogue', speaker: '白求恩', text: '哦？从贝加尔湖来的同志？瓦列里还好吗？我在莫斯科见过他还是个娃娃的时候——不，也许记错了，那时我还以为所有的苏联青年都一个样。' },
      { type: 'dialogue', speaker: '柳帕莎', text: '大夫，他让我给您带一句话：「您留在了中国，我们记着。」' },
      { type: 'dialogue', speaker: '白求恩', text: '哈哈！告诉那个娃娃——共产主义者的记性，要用在会师上，别用在客气话上。' },
      { type: 'narrative', text: '在同一场会谈里，中方代表通报了局势：' },
      { type: 'dialogue', speaker: '中方代表', text: '总反攻已经开始。东北的地下武装、华北的根据地、西南的游击走廊——三线齐发。日本人的兵力还差得远。' },
      { type: 'dialogue', speaker: '中方代表', text: '而你们——你们统一俄罗斯的速度，将决定我们在中欧会师的日期。' },
      { type: 'dialogue', speaker: '柳帕莎', text: '我们带来了布劳恩同志的方案：中俄两条战线，互为犄角。你们打穿满洲，我们打穿西伯利亚。' },
      { type: 'dialogue', speaker: '中方代表', text: '好。等你们打到乌拉尔，我们在长城上放礼炮。' },
      { type: 'narrative', text: '归途上，柳帕莎在火车里翻看会谈纪要。窗外的东北平原上，游击队的信号火连成了一线，像大地上的星河。' },
      { type: 'narrative', text: '她想起自己曾给亚戈达整理文件的日子——那时她以为，忍下去总会有出路。' },
      { type: 'dialogue', speaker: '柳帕莎（内心）', text: '出路不是忍出来的。是打出来的。' },
      { type: 'narrative', text: '一年后，东北全境解放。又两年，北京。' },
      { type: 'narrative', text: '而在世界的另一头，德国人的「东方专员辖区」正在燃烧——被萨布林的红军点燃。' },
      { type: 'quest-complete', quest: 'q_east_red' },
      { type: 'quest-add', quest: 'q_unification' },
      { type: 'transition', target: 'ch6_00e', effect: 'fade', wait: 2000 },
    ]
  },

  // ======== 第六章 · 再造苏联（统一俄罗斯 · 战略地图） ========
  ch6_01: {
    chapter: 6,
    pov: 'sablin',
    chapterTitle: '第六章 · 再造苏联',
    nodes: [
      { type: 'narrative', text: '1963年至1971年。八年统一战争。' },
      { type: 'narrative', text: '伊尔库茨克解放后，革命的浪潮席卷东西伯利亚：' },
      { type: 'narrative', text: '——赤塔的「外贝加尔公国」，农奴兵在阵前倒戈，「大公」流亡满洲；' },
      { type: 'narrative', text: '——雅库茨克与马加丹不战而降，冻原上的黑军游击队接受了整编；' },
      { type: 'narrative', text: '——鄂木斯克的黑军团拒绝一切谈判，亚佐夫的士兵高喊着「以血还血」战至最后一人；' },
      { type: 'narrative', text: '——新西伯利亚的知识分子们则在全民公投中加入了联盟——舒克申总统说：「我们需要的是俄罗斯的未来，而不是俄国的过去。」' },
      { type: 'narrative', text: '——斯维尔德洛夫斯克，巴托夫元帅放下武器，向萨布林敬了最后一个军礼：「我的红军，终于回家了。」' },
      { type: 'narrative', text: '到1970年，从太平洋到乌拉尔，红军的旗帜插遍了俄罗斯大地。' },
      { type: 'dialogue', speaker: '佩楚罗', text: '萨布林同志，联盟重建的准备工作全部完成。全民公决以百分之九十一的支持率通过。' },
      { type: 'dialogue', speaker: '佩楚罗', text: '各加盟共和国、自治共和国的代表已在伊尔库茨克集结。就等你一句话了。' },
      { type: 'dialogue', speaker: '萨布林', text: '等等——先别急。还有最后一件事没做。' },
      { type: 'dialogue', speaker: '乌拉诺夫斯卡娅', text: '你是说……西边？' },
      { type: 'dialogue', speaker: '萨布林', text: '1924年死去的那个联盟，1945年跪下的那个俄罗斯——都在乌拉尔以西等着我们。' },
      { type: 'dialogue', speaker: '萨布林', text: '莫斯科还在德国人手里。一日不收复莫斯科，苏联就一日没有资格说「重建」。' },
      { type: 'dialogue', speaker: '布劳恩', text: '那将是对德战争。他们有两千枚核弹头，萨布林。' },
      { type: 'dialogue', speaker: '萨布林', text: '而我们有四亿俄罗斯人民、十亿中国人民，和全世界等着看新秩序倒塌的劳动者。' },
      { type: 'dialogue', speaker: '萨布林', text: '何况——布劳恩同志，你比我更清楚，德国内部是什么样子。希特勒一死，四巨头争到现在。施佩尔的改革救不了奴隶制经济。他们外强中干。' },
      { type: 'dialogue', speaker: '布劳恩', text: '……好。那这回，我给全德的地下同志写总动员令。' },
      { type: 'narrative', text: '1971年6月22日——巴巴罗萨三十周年纪念日。' },
      { type: 'narrative', text: '新生的苏维埃联盟向纳粹德国宣战。' },
      { type: 'narrative', text: '史称：第二次西俄战争。' },
      { type: 'strategic-map', text: '——统一战争 · 战略地图——\n此刻起，指挥红军统一俄罗斯全境！\n攻占所有据点后，向莫斯科进军！' },
      { type: 'narrative', text: '【战略阶段】指挥你的红军，统一俄罗斯全境。\n\n提示：\n· 点击地图据点查看详情、发起进攻\n· 兵力与补给每攻占一城都会增长\n· 统一乌拉尔以东全部据点后，继续向西——收复莫斯科！' },
      { type: 'quest-complete', quest: 'q_unification' },
      { type: 'quest-add', quest: 'q_2wrw' },
      { type: 'transition', target: 'ch7_01', effect: 'fade', wait: 1000 },
    ]
  },

  // ======== 终章 · 第二次西俄战争 ========
  ch7_01: {
    chapter: 7,
    pov: 'sablin',
    chapterTitle: '终章 · 第二次西俄战争',
    nodes: [
      { type: 'scene-set', scene: 'snow_street' },
      { type: 'narrative', text: '1971年6月22日，凌晨3时15分。' },
      { type: 'narrative', text: '三千门火箭炮在乌拉尔山麓同时开火。第二次西俄战争的第一个黎明，被凝固汽油弹染成了血色。' },
      { type: 'narrative', text: '德军「东方壁垒」在七十二小时内崩溃。二十年没有打过败仗的国防军，第一次在自己的地图上看见全线后退的箭头。' },
      { type: 'narrative', text: '而在他们身后，每一座城市都燃起了起义的火：明斯克、斯摩棱斯克、基辅——布劳恩的德语广播在每一个德占城市上空回荡。' },
      { type: 'dialogue', speaker: '布劳恩（广播）', text: '德国士兵们！你们的元首用你们的性命在东方筑起坟场，用你们亲人的口粮去喂养党卫军的庄园！' },
      { type: 'dialogue', speaker: '布劳恩（广播）', text: '台尔曼的德国不是希特勒的德国！放下武器——红军保证你们活着回家，参加一个没有纳粹的德国的重建！' },
      { type: 'narrative', text: '9月。红军兵临莫斯科城下。' },
      { type: 'narrative', text: '「东方专员辖区」的党卫军烧掉了档案，炸断了桥梁，把自己钉死在克里姆林宫的地堡里。' },
      { type: 'dialogue', speaker: '萨布林', text: '同志们。二十六年了。' },
      { type: 'dialogue', speaker: '萨布林', text: '二十六年前，我们的父辈从这座城里被赶出去。今天——我们回来了。' },
      { type: 'dialogue', speaker: '萨布林', text: '全军听令：莫斯科——突击！' },
      { type: 'battle', battleId: 'battle_moscow', party: ['sablin', 'andrei', 'efim', 'lyupasha'], next: 'ch7_02' },
    ]
  },

  ch7_02: {
    chapter: 7,
    pov: 'sablin',
    nodes: [
      { type: 'narrative', text: '1971年10月7日，下午4时。' },
      { type: 'narrative', text: '克里姆林宫的斯帕斯卡亚塔楼升起了红旗。塔楼的自鸣钟敲响了《国际歌》的旋律——钟声工程师花了整整三天重新调校。' },
      { type: 'narrative', text: '萨布林站在红场上，向全世界发表讲话。' },
      { type: 'dialogue', speaker: '萨布林', text: '公民们，同志们！莫斯科解放了！' },
      { type: 'dialogue', speaker: '萨布林', text: '但这不是结束。在我们身后，是四分之一个世纪的占领、屠杀和奴役。在我们前面，在维斯瓦河与莱茵河之间——还有千百万被纳粹奴役的欧洲劳动者。' },
      { type: 'dialogue', speaker: '萨布林', text: '德国的工人、波兰的工人、法国的工人——全世界受法西斯奴役的人们，都在等待这一声号令！' },
      { type: 'dialogue', speaker: '萨布林', text: '战争不会被核讹诈吓停。我们即将跨过布格河、跨过维斯瓦河——直捣日耳曼尼亚！' },
      { type: 'dialogue', speaker: '萨布林', text: '不是为了复仇。是为了让1945年就该死去的东西，彻底死去——为了让「新秩序」这个词，从这个星球上永远消失！' },
      { type: 'dialogue', speaker: '萨布林', text: '全军——向日耳曼尼亚，前进！' },
      { type: 'narrative', text: '1972年5月9日。' },
      { type: 'narrative', text: '百万红军与欧洲各地起义军会师于柏林城下。日本在东方崩溃，美国的舰队长驻不来梅港「维持秩序」——但没有人能阻止红旗升上国会大厦。' },
      { type: 'narrative', text: '日耳曼尼亚。帝国总理府的地堡里，最后的党卫军还在负隅顽抗。' },
      { type: 'battle', battleId: 'battle_germania', party: ['sablin', 'anna', 'efim', 'lyupasha', 'braun'], next: 'ending_01' },
    ]
  },

  // ======== 结局 ========
  ending_01: {
    chapter: 7,
    pov: 'anna',
    chapterTitle: '尾声 · 英特纳雄耐尔',
    nodes: [
      { type: 'scene-set', scene: 'bunker_hall' },
      { type: 'narrative', text: '1972年5月9日夜。日耳曼尼亚，国会大厦楼顶。' },
      { type: 'narrative', text: '红旗升上穹顶的那一刻，来自五十六个国家的士兵、游击队员和流亡者，在废墟间齐声高唱。' },
      { type: 'narrative', text: '领唱的人，是安娜·罗森塔尔娃。' },
      { type: 'narrative', text: '十年前，她在地下五十米的防空洞里为一架缺了键的钢琴调音；十年后，她的声音在纳粹帝国的尸体上空回荡。' },
      { type: 'narrative', text: '"起来，饥寒交迫的奴隶！"' },
      { type: 'narrative', text: '"起来，全世界受苦的人！"' },
      { type: 'narrative', text: '萨布林站在人群外围，望着东方——贝加尔湖的方向。' },
      { type: 'dialogue', speaker: '佩楚罗', text: '在想什么，主席同志？' },
      { type: 'dialogue', speaker: '萨布林', text: '在想我父亲说过的一句话。他说，苏联死于1924年。' },
      { type: 'dialogue', speaker: '萨布林', text: '我今天想告诉他——它今天复活了。而且这一次，它不会死于任何一个领导人——因为它是四亿人自己建起来的。' },
      { type: 'dialogue', speaker: '布劳恩', text: '那么接下来呢？战后的德国、欧洲的重建、和美国人漫长的冷战……' },
      { type: 'dialogue', speaker: '萨布林', text: '接下来——是建设。是铁路、学校和医院。是让每一个孩子都读得起《资本论》，也读得起诉状与诗。' },
      { type: 'dialogue', speaker: '萨布林', text: '革命不是一夜之间。革命是每一个清晨。' },
      { type: 'narrative', text: '"这是最后的斗争，团结起来到明天——"' },
      { type: 'narrative', text: '"英特纳雄耐尔，就一定要实现！"' },
      { type: 'narrative', text: '歌声越过勃兰登堡门的残柱，越过易北河与维斯瓦河，越过乌拉尔山与贝加尔湖，越过长城与黄河——' },
      { type: 'narrative', text: '传向每一个在黑暗中等待黎明的人。' },
      { type: 'quest-complete', quest: 'q_2wrw' },
      { type: 'narrative', text: '【全剧终】\n\n《贝加尔湖畔》· Lake Baikal\n\n改编自同名小说\n融合 TNO: The New Order 正史、\n「东方红」「第二次西俄战争」子模组设定\n\n感谢游玩\n\n苏维埃万岁。' },
      { type: 'return-title' },
    ]
  },

  // ======== 探索场景 · WASD 自由移动 ========

  // 第一章 · 仓库（与叶菲姆交谈 → 邀请选择）
  ch1_02e: {
    chapter: 1,
    pov: 'anna',
    chapterTitle: '第一章 · 仓库里的清晨',
    nodes: [
      { type: 'narrative', text: '（WASD 移动。收齐三份申请表——靠近发光物件按空格拾取——再去邀请叶菲姆。）' },
      { type: 'quest-add', quest: 'q_club_work' },
      { type: 'quest-add', quest: 'q_invite_efim' },
      { type: 'explore', map: 'club_warehouse_day', spawn: [2, 18], next: 'ch1_04', completeOnExit: ['q_club_work'] },
    ]
  },

  // 第二章 · 大会筹备
  ch2_00e: {
    chapter: 2,
    pov: 'anna',
    nodes: [
      { type: 'scene-set', scene: 'bunker_hall' },
      { type: 'narrative', text: '上乌金斯克郊外，地下五十米。代表们陆续抵达，大会开幕前，还有些事情要确认。' },
      { type: 'narrative', text: '（点亮会场四角的信号灯，并与老安德烈、瓦伦蒂娜确认准备事宜。）' },
      { type: 'explore', map: 'bunker_prepare', spawn: [15, 18], next: 'ch2_01' },
    ]
  },

  // 第三章 · 广播塔集结（夜）
  ch3_00e: {
    chapter: 3,
    pov: 'sablin',
    nodes: [
      { type: 'scene-set', scene: 'radio_tower' },
      { type: 'narrative', text: '午夜。上乌金斯克广播塔下的林地里，起义者们屏息集结。进攻发起前，再去看看同志们。' },
      { type: 'narrative', text: '（避开 NKVD 哨兵的视线——被照见就会被赶回出发点——逐一检查三处机枪阵地，并向叶菲姆报到。）' },
      { type: 'explore', map: 'radio_staging', spawn: [2, 2], next: 'ch3_01' },
    ]
  },

  // 第四章 · 伊尔库茨克前线
  ch4_00e: {
    chapter: 4,
    pov: 'anna',
    nodes: [
      { type: 'scene-set', scene: 'irkutsk' },
      { type: 'narrative', text: '伊尔库茨克城郊，前进阵地。总攻发起在即——各纵队都已进入位置。' },
      { type: 'narrative', text: '（先收集散落的弹药箱，再为三处机枪阵地补给弹药，最后向萨布林报到。）' },
      { type: 'explore', map: 'irkutsk_front', spawn: [2, 18], next: 'ch4_01' },
    ]
  },

  // 第五章 · 铁路会让站（中国线）
  ch5_00e: {
    chapter: 5,
    pov: 'lyupasha',
    nodes: [
      { type: 'scene-set', scene: 'snow_street' },
      { type: 'narrative', text: '西伯利亚大铁路，某个会让站。来自东方的列车即将进站——新世界的信使正在路上。' },
      { type: 'narrative', text: '（限时 100 秒！快去点验三节车厢的货物、与布劳恩碰头——准时完成有额外奖励。）' },
      { type: 'explore', map: 'train_station', spawn: [4, 6], next: 'ch5_01' },
    ]
  },

  // 第六章 · 统一战争前夕
  ch6_00e: {
    chapter: 6,
    pov: 'sablin',
    nodes: [
      { type: 'scene-set', scene: 'snow_street' },
      { type: 'narrative', text: '伊尔库茨克，红军总指挥部。统一战争的号角即将吹响——出发前，听听同志们的报告。' },
      { type: 'narrative', text: '（按参谋部的规矩依次行事：收听电台战报 → 确认战略地图 → 联系野战电话，再向佩楚罗报到。）' },
      { type: 'explore', map: 'hq_command', spawn: [15, 18], next: 'ch6_01' },
    ]
  },
};
