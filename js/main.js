/* =========================================================
 * 贝加尔湖畔 · 主入口
 * =======================================================*/

const Game = {
  state: null,
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    Engine.init();
    Input.init();
    Strategy.init();

    // 键盘监听
    this.setupKeyboard();

    // 检查存档
    this.checkSave();

    console.log('%c贝加尔湖畔 · Lake Baikal', 'font-size:24px;color:#c9d6ff;font-weight:bold;');
    console.log('%c一个关于革命、信念与冰湖的故事', 'color:#7a8ab0;');
  },

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // 标题画面
      if (Engine.gameMode === 'title') {
        if (e.key === ' ' || e.key === 'Enter') {
          this.startNewGame();
        }
        return;
      }

      // 剧情模式
      if (Engine.gameMode === 'story' && !StoryEngine.paused) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          StoryEngine.advance();
        }
        if (e.key === 'q' || e.key === 'Q') {
          this.toggleQuests();
        }
        if (e.key === 'w' || e.key === 'W') {
          this.toggleParty();
        }
        if (e.key === 'm' || e.key === 'M') {
          this.toggleMap();
        }
      }

      // ESC
      if (e.key === 'Escape') {
        if (document.getElementById('main-menu').classList.contains('hidden')) {
          this.toggleMenu();
        } else {
          this.toggleMenu();
        }
      }
    });
  },

  checkSave() {
    try {
      const save = localStorage.getItem('baikal_save');
      if (save) {
        // 有存档，继续游戏按钮可用
      }
    } catch (e) {}
  },

  // ===== 新游戏 =====
  startNewGame() {
    this.state = createInitialState();
    this.state.saveTime = new Date().toISOString();

    document.getElementById('title-screen').classList.add('hidden');
    UI.showTopBar('序章 · 新秩序的世界', '贝加尔湖畔');

    // 开始序章
    StoryEngine.startScene('prologue_01');
  },

  // ===== 存档 / 读档 =====
  saveGame() {
    try {
      this.state.saveTime = new Date().toISOString();
      localStorage.setItem('baikal_save', JSON.stringify(this.state));
      UI.toast('💾 游戏已保存');
    } catch (e) {
      UI.toast('保存失败：' + e.message);
    }
  },

  loadGame() {
    try {
      const save = localStorage.getItem('baikal_save');
      if (!save) {
        UI.toast('没有找到存档');
        return;
      }
      this.state = JSON.parse(save);

      document.getElementById('title-screen').classList.add('hidden');
      const ch = Characters[this.state.currentPov];
      UI.showTopBar(
        Chapters.find(c => c.id === this.state.currentChapter)?.title || '',
        ch?.name || ''
      );

      // 继续当前场景
      StoryEngine.startScene(this.state.currentScene || 'prologue_01');
      UI.toast('📂 读取存档成功');
    } catch (e) {
      UI.toast('读取失败：' + e.message);
    }
  },

  // ===== 面板切换 =====
  toggleQuests() {
    const panel = document.getElementById('quest-panel');
    const isHidden = panel.classList.contains('hidden');

    // 关闭其他面板
    document.getElementById('party-panel').classList.add('hidden');

    if (isHidden) {
      UI.updateQuestPanel();
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  },

  toggleParty() {
    const panel = document.getElementById('party-panel');
    const isHidden = panel.classList.contains('hidden');

    document.getElementById('quest-panel').classList.add('hidden');

    if (isHidden) {
      UI.updatePartyPanel();
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  },

  toggleMap() {
    if (Strategy.active) {
      Strategy.close();
    } else {
      // 先确保任务/队伍面板关闭
      document.getElementById('quest-panel').classList.add('hidden');
      document.getElementById('party-panel').classList.add('hidden');
      Strategy.open();
    }
  },

  toggleMenu() {
    const menu = document.getElementById('main-menu');
    if (menu.classList.contains('hidden')) {
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
  },

  returnToTitle() {
    // 关闭所有面板
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('quest-panel').classList.add('hidden');
    document.getElementById('party-panel').classList.add('hidden');
    document.getElementById('strategic-map').classList.add('hidden');
    UI.hideTopBar();
    UI.hideDialog();
    UI.hideChoices();

    Engine.gameMode = 'title';
    document.getElementById('title-screen').classList.remove('hidden');
  },

  showAbout() {
    document.getElementById('about-screen').classList.remove('hidden');
  },

  hideAbout() {
    document.getElementById('about-screen').classList.add('hidden');
  },
};

// 启动
window.addEventListener('load', () => {
  Game.init();
});
