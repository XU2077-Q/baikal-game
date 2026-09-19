/* =========================================================
 * 贝加尔湖畔 · UI 系统
 * =======================================================*/

const UI = {
  toastTimer: null,

  // ===== 对话框 =====
  showDialog(speaker, text) {
    const box = document.getElementById('dialog-box');
    const speakerEl = document.getElementById('dialog-speaker');
    const textEl = document.getElementById('dialog-text');

    box.classList.remove('hidden');

    if (speaker && speaker !== '叙事' && speaker !== '内心') {
      speakerEl.textContent = speaker;
      speakerEl.style.display = 'inline-block';
    } else {
      speakerEl.style.display = 'none';
    }

    // 打字机效果
    this.typewriter(text, textEl);
  },

  typewriter(text, element) {
    element.textContent = '';
    let i = 0;
    const speed = 25; // 每个字的速度ms

    // 清除可能存在的旧计时器
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.typewriterTimer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
    }, speed);
  },

  skipTypewriter(text, element) {
    if (this.typewriterTimer) {
      clearInterval(this.typewriterTimer);
      this.typewriterTimer = null;
    }
    element.textContent = text;
  },

  isTyping() {
    return !!this.typewriterTimer;
  },

  hideDialog() {
    document.getElementById('dialog-box').classList.add('hidden');
  },

  // ===== 选项 =====
  showChoices(options, onSelect) {
    const box = document.getElementById('choice-box');
    const list = document.getElementById('choice-list');
    list.innerHTML = '';

    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt.label;
      btn.onclick = () => {
        this.hideChoices();
        onSelect(idx, opt);
      };
      list.appendChild(btn);
    });

    box.classList.remove('hidden');
  },

  hideChoices() {
    document.getElementById('choice-box').classList.add('hidden');
  },

  // ===== 顶部状态栏 =====
  showTopBar(chapter, pov) {
    const bar = document.getElementById('top-bar');
    bar.classList.remove('hidden');
    if (chapter) document.getElementById('chapter-label').textContent = chapter;
    if (pov) document.getElementById('pov-label').textContent = '视角：' + pov;
  },

  hideTopBar() {
    document.getElementById('top-bar').classList.add('hidden');
  },

  // ===== 任务面板（精美卡片版） =====
  questChapterName(ch) {
    const names = ['序章', '第一章', '第二章', '第三章', '第四章', '第五章', '第六章', '终章'];
    return names[ch] || '';
  },

  // 任务奖励：随章节递增，支线固定
  questReward(q) {
    if (q.reward) return q.reward;
    const byCh = { 0: [10, 5], 1: [20, 5], 2: [25, 10], 3: [40, 15], 4: [50, 20], 5: [60, 20], 6: [100, 25], 7: [200, 30] };
    if (q.type === 'side') return { supplies: 15, morale: 8 };
    const [s, m] = byCh[q.chapter] || [20, 5];
    return { supplies: s, morale: m };
  },

  updateQuestPanel() {
    const list = document.getElementById('quest-list');
    list.innerHTML = '';

    const state = Game.state;

    const activeMain = state.quests.active.filter(q => Quests[q] && Quests[q].type === 'main');
    const activeSide = state.quests.active.filter(q => Quests[q] && Quests[q].type === 'side');

    // 进行中主线
    if (activeMain.length > 0) {
      list.appendChild(this.createQuestSection('◆ 主线任务', 'main', activeMain.length));
      for (const qid of activeMain) list.appendChild(this.createQuestItem(qid, false));
    }

    // 进行中支线
    if (activeSide.length > 0) {
      list.appendChild(this.createQuestSection('◇ 支线任务', 'side', activeSide.length));
      for (const qid of activeSide) list.appendChild(this.createQuestItem(qid, false));
    }

    // 空状态
    if (activeMain.length === 0 && activeSide.length === 0 && state.quests.completed.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'quest-empty';
      empty.innerHTML = '🗒️<br>暂无进行中的任务<br><span>推进剧情以获取新任务</span>';
      list.appendChild(empty);
    }

    // 已完成
    if (state.quests.completed.length > 0) {
      list.appendChild(this.createQuestSection('✓ 已完成', 'done', state.quests.completed.length));
      const recent = state.quests.completed.slice().reverse().slice(0, 6);
      for (const qid of recent) list.appendChild(this.createQuestItem(qid, true));
    }
  },

  createQuestSection(title, kind, count) {
    const header = document.createElement('div');
    header.className = 'quest-section ' + kind;
    header.innerHTML = `<span>${title}</span><span class="quest-count">${count}</span>`;
    return header;
  },

  createQuestItem(qid, completed) {
    const q = Quests[qid];
    if (!q) return document.createElement('div');

    const div = document.createElement('div');
    div.className = 'quest-item ' + (q.type === 'main' ? 'main' : 'side') + (completed ? ' completed' : '');

    const badgeText = completed ? '✓' : (q.type === 'main' ? '主' : '支');
    const chapterTag = completed ? '' : `<span class="quest-chapter">${this.questChapterName(q.chapter)}</span>`;

    const reward = this.questReward(q);
    const rewardHtml = completed
      ? `<span class="quest-rewards got">奖励已领取</span>`
      : `<span class="quest-rewards">📦 +${reward.supplies} &nbsp;⭐ +${reward.morale}</span>`;

    div.innerHTML = `
      <div class="quest-left">
        <div class="quest-badge">${badgeText}</div>
        <div class="quest-status-line"></div>
      </div>
      <div class="quest-body">
        <div class="quest-head">
          <span class="quest-title">${q.title}</span>${chapterTag}
        </div>
        <div class="quest-desc">${completed ? '—— 已完成 ——' : q.desc}</div>
        ${completed ? '' : `<div class="quest-objective"><span class="obj-dot"></span>${q.objective}</div>`}
        ${rewardHtml}
      </div>
    `;
    return div;
  },

  // 任务完成横幅（全屏庆祝）
  showQuestBanner(title, reward) {
    const old = document.getElementById('quest-banner');
    if (old) old.remove();

    const banner = document.createElement('div');
    banner.id = 'quest-banner';
    banner.innerHTML = `
      <div class="banner-inner">
        <div class="banner-check">✓</div>
        <div class="banner-label">任务完成</div>
        <div class="banner-title">${title}</div>
        <div class="banner-reward">📦 补给 +${reward.supplies || 20} &nbsp;&nbsp;⭐ 士气 +${reward.morale || 5}</div>
      </div>
    `;
    document.getElementById('game-container').appendChild(banner);

    // 金色粒子
    for (let i = 0; i < 36; i++) {
      Engine.spawnParticle(
        480 + (Math.random() - 0.5) * 300,
        320 + (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 160,
        -Math.random() * 120,
        Math.random() > 0.5 ? '#e8c860' : '#f0e0a0',
        3, 1.2
      );
    }

    setTimeout(() => banner.classList.add('show'), 30);
    setTimeout(() => {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 600);
    }, 2600);
  },

  // ===== 队伍面板 =====
  updatePartyPanel() {
    const list = document.getElementById('party-list');
    list.innerHTML = '';

    for (const member of Game.state.party) {
      const char = Characters[member.id] || member;
      const hpPct = Math.floor((member.hp / member.maxHp) * 100);
      const div = document.createElement('div');
      div.className = 'party-member';
      div.innerHTML = `
        <div class="member-avatar" style="background:${char.color || '#3a4a7a'}">${char.avatar || '👤'}</div>
        <div class="member-info">
          <div class="member-name">${char.name}</div>
          <div class="member-role">${char.role} · Lv.${member.level || 1}</div>
          <div class="hp-bar"><div class="hp-fill" style="width:${hpPct}%"></div></div>
        </div>
      `;
      list.appendChild(div);
    }
  },

  // ===== 通知 =====
  toast(message, duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.classList.remove('hidden');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      el.classList.add('hidden');
    }, duration);
  },
};

// ===== 剧情引擎 =====
const StoryEngine = {
  currentNode: null,
  currentNodeIndex: 0,
  currentSceneData: null,
  showingDialogue: false,
  currentSpeaker: null,
  waitingForChoice: false,
  waitingForInput: false,
  paused: false,

  startScene(sceneId) {
    const scene = Story[sceneId];
    if (!scene) {
      console.error('Scene not found:', sceneId);
      return;
    }

    this.currentSceneData = scene;
    this.currentNodeIndex = 0;
    Game.state.currentScene = sceneId;

    // 设置章节
    if (scene.chapter && scene.chapter !== Game.state.currentChapter) {
      Game.state.currentChapter = scene.chapter;
    }

    // 设置视角
    if (scene.pov && scene.pov !== Game.state.currentPov) {
      Game.state.currentPov = scene.pov;
      const ch = Characters[scene.pov];
      if (ch) {
        UI.showTopBar(null, ch.name);
      }
    }

    // 章节标题
    if (scene.chapterTitle) {
      this.showChapterTitle(scene.chapterTitle, scene.subtitle || '');
      setTimeout(() => this.processNode(), 2500);
    } else {
      this.processNode();
    }

    // 进入场景
    Engine.gameMode = 'story';
    Engine.currentScene = this.detectSceneBg(sceneId);
  },

  detectSceneBg(sceneId) {
    if (sceneId.startsWith('prologue')) return 'snow_street';
    if (sceneId.startsWith('ch1_01')) return 'underground_bunker';
    if (sceneId.startsWith('ch1_02') || sceneId.startsWith('ch1_03')) return 'club_warehouse';
    if (sceneId.startsWith('ch1_04')) return 'apartment';
    if (sceneId.startsWith('ch2') || sceneId.startsWith('battle_raid')) return 'bunker_hall';
    if (sceneId.startsWith('ch3')) return 'radio_tower';
    if (sceneId.startsWith('ch4')) return 'irkutsk';
    if (sceneId.startsWith('ch5') || sceneId.startsWith('ch6')) return 'snow_street';
    if (sceneId.startsWith('ch7_01')) return 'moscow';
    if (sceneId.startsWith('ch7_02') || sceneId.startsWith('ending')) return 'germania';
    return 'bunker_hall';
  },

  showChapterTitle(title, subtitle) {
    const overlay = document.createElement('div');
    overlay.id = 'chapter-title-overlay';
    overlay.style.cssText = `
      position:absolute;top:0;left:0;width:100%;height:100%;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      background:rgba(10,10,20,0.85);z-index:40;
      animation:fadeIn 1s ease;
    `;
    overlay.innerHTML = `
      <h2 style="font-size:42px;color:#d0dcf0;letter-spacing:8px;text-shadow:2px 2px 0 #2a3a6a, 0 0 20px rgba(150,180,255,0.5);margin-bottom:10px;">${title}</h2>
      <p style="font-size:18px;color:#7a8ab0;letter-spacing:4px;">${subtitle}</p>
    `;
    document.getElementById('game-container').appendChild(overlay);

    UI.showTopBar(title, Characters[Game.state.currentPov]?.name || '');

    setTimeout(() => {
      overlay.style.transition = 'opacity 1s';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 1000);
    }, 2000);
  },

  processNode() {
    if (!this.currentSceneData) return;

    const nodes = this.currentSceneData.nodes;
    if (this.currentNodeIndex >= nodes.length) {
      // 场景结束
      this.endScene();
      return;
    }

    const node = nodes[this.currentNodeIndex];

    switch (node.type) {
      case 'narrative':
        this.showingDialogue = true;
        this.currentSpeaker = null;
        Engine.currentScene = this.detectSceneBg(Game.state.currentScene);
        UI.showDialog(null, node.text);
        this.waitingForInput = true;
        break;

      case 'dialogue':
        this.showingDialogue = true;
        this.currentSpeaker = this.resolveSpeaker(node.speaker);
        Engine.currentScene = this.detectSceneBg(Game.state.currentScene);
        UI.showDialog(node.speaker, node.text);
        this.waitingForInput = true;
        break;

      case 'choice':
        this.showingDialogue = true;
        this.currentSpeaker = null;
        UI.showDialog(null, node.text || '做出选择：');
        setTimeout(() => {
          this.waitingForChoice = true;
          UI.showChoices(node.options, (idx, opt) => {
            // 设置flag
            if (opt.flag) {
              const [key, val] = opt.flag.split('=');
              Game.state.flags[key] = val;
            }
            // 跳转到对应场景
            if (opt.next) {
              this.gotoScene(opt.next);
            } else {
              this.nextNode();
            }
          });
        }, 500);
        break;

      case 'transition':
        UI.hideDialog();
        this.showingDialogue = false;
        this.currentSpeaker = null;
        const wait = node.wait || 1000;
        setTimeout(() => {
          if (node.target) {
            this.gotoScene(node.target);
          } else {
            this.nextNode();
          }
        }, wait);
        break;

      case 'quest-add':
        this.addQuest(node.quest);
        this.nextNode();
        break;

      case 'quest-complete':
        this.completeQuest(node.quest);
        this.nextNode();
        break;

      case 'battle':
        UI.hideDialog();
        this.showingDialogue = false;
        this.paused = true;
        const party = node.party || ['anna'];
        // 确保队伍里有这些角色
        for (const pid of party) {
          if (!Game.state.party.find(p => p.id === pid)) {
            const ch = Characters[pid];
            if (ch) {
              Game.state.party.push({
                ...ch,
                hp: ch.stats.hp,
                maxHp: ch.stats.hp,
                mp: ch.stats.mp,
                maxMp: ch.stats.mp,
                level: 1,
                exp: 0,
              });
            }
          }
        }
        Battle.start(node.battleId, party, (victory) => {
          this.paused = false;
          if (victory) {
            if (node.next) {
              this.gotoScene(node.next);
            } else {
              this.nextNode();
            }
          } else {
            // 失败：回到前一个节点重试
            UI.toast('撤退……重整旗鼓再来！');
            // 恢复一些HP
            for (const m of Game.state.party) {
              m.hp = Math.floor(m.maxHp * 0.5);
              m.mp = Math.floor(m.maxMp * 0.5);
            }
            this.currentNodeIndex--;
            this.processNode();
          }
        });
        break;

      case 'strategic-map':
        UI.hideDialog();
        this.showingDialogue = false;
        // 统一战争阶段：授予大军（剧情进度到 1971，红军已成规模）
        Game.state.resources.troops = Math.max(Game.state.resources.troops, 2500);
        Game.state.resources.supplies = Math.max(Game.state.resources.supplies, 800);
        Game.state.resources.morale = Math.max(Game.state.resources.morale, 95);
        if (node.text) UI.toast(node.text, 4000);
        Game.toggleMap();
        // 等地图关闭后继续
        const checkMap = setInterval(() => {
          if (!Strategy.active) {
            clearInterval(checkMap);
            this.nextNode();
          }
        }, 500);
        break;

      case 'scene-set':
        Engine.currentScene = node.scene;
        this.nextNode();
        break;

      case 'explore':
        // 平面探索模式：WASD 自由移动
        UI.hideDialog();
        this.showingDialogue = false;
        this.currentSpeaker = null;
        Explore.start(node, (next) => {
          Engine.gameMode = 'story';
          if (next) this.gotoScene(next);
          else this.nextNode();
        });
        break;

      case 'return-title':
        UI.hideDialog();
        this.showingDialogue = false;
        setTimeout(() => Game.returnToTitle(), 3000);
        break;

      default:
        this.nextNode();
    }
  },

  resolveSpeaker(speaker) {
    if (!speaker) return null;
    // 把"安娜（内心）"这种格式提取id
    const clean = speaker.replace(/（.*?）/g, '').replace(/\(.*?\)/g, '').trim();
    const map = {
      '安娜': 'anna',
      '萨布林': 'sablin',
      '瓦列里': 'sablin',
      '叶菲姆': 'efim',
      '柳帕莎': 'lyupasha',
      '安德烈': 'andrei',
      '老安德烈': 'andrei',
      '托尔斯泰': 'andrei',
      '瓦伦蒂娜': 'valentina',
      '亚戈达': 'yagoda',
      // TNO 布里亚特 ASSR 领导层
      '佩楚罗': 'pechuro',
      '苏珊娜': 'pechuro',
      '布劳恩': 'braun',
      '奥托': 'braun',
      '乌拉诺夫斯卡娅': 'ulanovskaya',
      '玛雅': 'ulanovskaya',
    };
    return map[clean] || null;
  },

  nextNode() {
    this.currentNodeIndex++;
    this.processNode();
  },

  gotoScene(sceneId) {
    this.waitingForChoice = false;
    this.waitingForInput = false;
    this.currentNodeIndex = 0;
    this.startScene(sceneId);
  },

  advance() {
    if (this.paused) return;
    if (this.waitingForChoice) return;

    if (UI.isTyping()) {
      // 跳过打字机
      const textEl = document.getElementById('dialog-text');
      const nodes = this.currentSceneData?.nodes;
      if (nodes && nodes[this.currentNodeIndex]) {
        UI.skipTypewriter(nodes[this.currentNodeIndex].text, textEl);
      }
      return;
    }

    if (this.waitingForInput) {
      this.waitingForInput = false;
      UI.hideDialog();
      this.showingDialogue = false;
      this.currentSpeaker = null;
      setTimeout(() => this.nextNode(), 100);
    }
  },

  addQuest(qid) {
    if (!Game.state.quests.active.includes(qid) && !Game.state.quests.completed.includes(qid)) {
      Game.state.quests.active.push(qid);
      const q = Quests[qid];
      if (q) {
        UI.toast(`📋 新任务：${q.title}`, 3200);
        // 面板若打开则刷新
        const panel = document.getElementById('quest-panel');
        if (panel && !panel.classList.contains('hidden')) UI.updateQuestPanel();
      }
    }
  },

  completeQuest(qid) {
    const idx = Game.state.quests.active.indexOf(qid);
    if (idx >= 0) {
      Game.state.quests.active.splice(idx, 1);
      Game.state.quests.completed.push(qid);
      const q = Quests[qid];
      if (q) {
        const reward = UI.questReward(q);
        Game.state.resources.supplies += reward.supplies || 20;
        Game.state.resources.morale = Math.min(100, Game.state.resources.morale + (reward.morale || 5));
        UI.showQuestBanner(q.title, reward);
      }
      UI.updateQuestPanel();
    }
  },

  endScene() {
    // 场景结束，等待
    this.showingDialogue = false;
  },
};
