/* =========================================================
 * 贝加尔湖畔 · 游戏引擎
 * =======================================================*/

const Engine = {
  canvas: null,
  ctx: null,
  width: 960,
  height: 640,

  // 场景状态
  currentScene: null,
  sceneData: null,
  isAnimating: false,

  // 粒子效果
  particles: [],

  // 时间
  lastTime: 0,
  deltaTime: 0,
  elapsed: 0,

  // 场景类型：'title' | 'story' | 'battle' | 'map' | 'menu'
  gameMode: 'title',

  init() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.startLoop();
  },

  startLoop() {
    const loop = (ts) => {
      this.deltaTime = ts - this.lastTime;
      this.lastTime = ts;
      this.elapsed += this.deltaTime;
      this.update(this.deltaTime / 1000);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  update(dt) {
    // 更新粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // 场景更新
    if (this.gameMode === 'story' && this.sceneData && this.sceneData.type === 'walkable') {
      this.updateWalkableScene(dt);
    }
    // 平面探索模式
    if (this.gameMode === 'explore') {
      Explore.update(dt);
    }
  },

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    switch (this.gameMode) {
      case 'title':
        this.renderTitleScene();
        break;
      case 'story':
        this.renderStoryScene();
        break;
      case 'battle':
        // 战斗由 battle.js 管理 canvas
        break;
      case 'map':
        // 战略地图由 strategy.js 管理
        break;
      case 'explore':
        // 平面探索由 explore.js 渲染
        Explore.render(this.ctx);
        break;
    }

    // 粒子（顶层）
    this.renderParticles();
  },

  // ===== 标题场景 =====
  renderTitleScene() {
    const ctx = this.ctx;

    // 背景：深夜的贝加尔湖
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#0a0e1a');
    grad.addColorStop(0.5, '#151a2e');
    grad.addColorStop(0.7, '#1e2842');
    grad.addColorStop(1, '#2a3a5a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 星星
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 80; i++) {
      const sx = (i * 137.5) % this.width;
      const sy = (i * 73.3) % (this.height * 0.5);
      const size = (i % 3) + 1;
      const alpha = 0.3 + Math.sin(this.elapsed / 1000 + i) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;

    // 远处的山脉剪影
    ctx.fillStyle = '#12182a';
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.lineTo(100, 340);
    ctx.lineTo(200, 380);
    ctx.lineTo(320, 300);
    ctx.lineTo(450, 360);
    ctx.lineTo(560, 310);
    ctx.lineTo(680, 370);
    ctx.lineTo(800, 330);
    ctx.lineTo(920, 380);
    ctx.lineTo(this.width, 350);
    ctx.lineTo(this.width, 500);
    ctx.lineTo(0, 500);
    ctx.closePath();
    ctx.fill();

    // 近处的山（贝加尔湖东岸）
    ctx.fillStyle = '#0d1525';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.lineTo(150, 430);
    ctx.lineTo(280, 460);
    ctx.lineTo(400, 420);
    ctx.lineTo(550, 450);
    ctx.lineTo(700, 410);
    ctx.lineTo(850, 455);
    ctx.lineTo(this.width, 430);
    ctx.lineTo(this.width, 520);
    ctx.lineTo(0, 520);
    ctx.closePath();
    ctx.fill();

    // 湖面（冰）
    const iceGrad = ctx.createLinearGradient(0, 520, 0, this.height);
    iceGrad.addColorStop(0, '#2a3a5e');
    iceGrad.addColorStop(0.3, '#1e2d4a');
    iceGrad.addColorStop(1, '#14203a');
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, 520, this.width, this.height - 520);

    // 冰面反光
    ctx.strokeStyle = 'rgba(150, 180, 220, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const y = 540 + i * 6 + Math.sin(this.elapsed / 2000 + i) * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y + 2);
      ctx.stroke();
    }

    // 飘雪
    this.renderSnow();
  },

  renderSnow() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(220, 230, 255, 0.7)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 193 + this.elapsed * 0.03) % this.width;
      const y = (i * 127 + this.elapsed * 0.06) % this.height;
      const size = (i % 3) + 1;
      ctx.fillRect(x, y, size, size);
    }
  },

  // ===== 剧情场景渲染 =====
  renderStoryScene() {
    const ctx = this.ctx;
    const scene = this.currentScene || 'bunker_hall';

    // 背景
    this.renderSceneBackground(scene);

    // 角色立绘（如果在对话中）
    if (StoryEngine.currentSpeaker && StoryEngine.showingDialogue) {
      this.renderCharacterPortrait(StoryEngine.currentSpeaker);
    }

    // 飘雪（室外场景）
    if (this.isOutdoorScene(scene)) {
      this.renderSnow();
    }
  },

  isOutdoorScene(scene) {
    return scene === 'lake_shore' || scene === 'club_outside' || scene === 'snow_street';
  },

  renderSceneBackground(scene) {
    const ctx = this.ctx;

    switch (scene) {
      case 'bunker_hall':
        // 地下防空洞会场
        const bunkerGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        bunkerGrad.addColorStop(0, '#1a1520');
        bunkerGrad.addColorStop(1, '#2a2030');
        ctx.fillStyle = bunkerGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 天花板管道
        ctx.fillStyle = '#151018';
        ctx.fillRect(0, 0, this.width, 60);
        ctx.strokeStyle = '#3a2a3a';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 20 + i * 8);
          ctx.lineTo(this.width, 20 + i * 8);
          ctx.stroke();
        }

        // 墙壁纹理
        ctx.fillStyle = '#251c2a';
        for (let y = 80; y < this.height - 100; y += 40) {
          for (let x = 0; x < this.width; x += 60) {
            const offset = (y / 40) % 2 === 0 ? 0 : 30;
            ctx.fillRect(x + offset, y, 58, 38);
          }
        }

        // 讲台
        ctx.fillStyle = '#3a2d40';
        ctx.fillRect(380, 380, 200, 100);
        ctx.fillStyle = '#4a3a50';
        ctx.fillRect(380, 375, 200, 10);
        // 讲台上的红旗
        ctx.fillStyle = '#8b2020';
        ctx.fillRect(470, 280, 4, 95);
        ctx.fillStyle = '#c03030';
        ctx.beginPath();
        ctx.moveTo(474, 280);
        ctx.lineTo(520, 295);
        ctx.lineTo(474, 310);
        ctx.closePath();
        ctx.fill();
        // 锤子镰刀（简化）
        ctx.fillStyle = '#e8c870';
        ctx.fillRect(488, 292, 4, 12);
        ctx.fillRect(486, 300, 10, 3);

        // 人群剪影（坐满的代表）
        ctx.fillStyle = 'rgba(20, 15, 25, 0.8)';
        for (let i = 0; i < 30; i++) {
          const x = 30 + (i % 10) * 95;
          const y = 500 + Math.floor(i / 10) * 30;
          // 头
          ctx.beginPath();
          ctx.arc(x + 15, y - 10, 8, 0, Math.PI * 2);
          ctx.fill();
          // 身体
          ctx.fillRect(x, y, 30, 40);
        }

        // 钢琴（左下角）
        ctx.fillStyle = '#1a1018';
        ctx.fillRect(30, 420, 80, 60);
        ctx.fillStyle = '#2a1820';
        ctx.fillRect(35, 430, 70, 5);
        ctx.strokeStyle = '#d4a5e0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo(38 + i * 7, 440);
          ctx.lineTo(38 + i * 7, 470);
          ctx.stroke();
        }
        break;

      case 'club_warehouse':
        // 干部俱乐部仓库
        const wareGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        wareGrad.addColorStop(0, '#2a2520');
        wareGrad.addColorStop(1, '#3a3028');
        ctx.fillStyle = wareGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 木地板
        ctx.fillStyle = '#3a2e22';
        ctx.fillRect(0, 500, this.width, 140);
        ctx.strokeStyle = '#2a2018';
        for (let x = 0; x < this.width; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 500);
          ctx.lineTo(x, this.height);
          ctx.stroke();
        }

        // 货架
        ctx.fillStyle = '#4a3a2a';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(50 + i * 220, 180, 180, 320);
          // 层板
          for (let j = 0; j < 4; j++) {
            ctx.fillRect(55 + i * 220, 230 + j * 70, 170, 8);
          }
          // 货物（箱子）
          const colors = ['#6a4a3a', '#5a4a3a', '#7a5a4a', '#4a3a2a'];
          for (let j = 0; j < 10; j++) {
            ctx.fillStyle = colors[j % 4];
            const bx = 60 + i * 220 + (j % 3) * 55;
            const by = 240 + Math.floor(j / 3) * 70;
            ctx.fillRect(bx, by, 45, 35);
          }
        }

        // 灯泡
        ctx.fillStyle = '#6a5a3a';
        ctx.fillRect(475, 0, 10, 50);
        ctx.fillStyle = '#e8d090';
        ctx.beginPath();
        ctx.arc(480, 60, 20, 0, Math.PI * 2);
        ctx.fill();
        // 光晕
        const lightGrad = ctx.createRadialGradient(480, 60, 10, 480, 60, 150);
        lightGrad.addColorStop(0, 'rgba(232, 208, 144, 0.3)');
        lightGrad.addColorStop(1, 'rgba(232, 208, 144, 0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(330, 0, 300, 250);
        break;

      case 'apartment':
        // 安娜的单身公寓
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(0, 0, this.width, this.height);

        // 墙壁
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(0, 0, this.width, 520);

        // 地板
        ctx.fillStyle = '#2a202a';
        ctx.fillRect(0, 520, this.width, 120);

        // 书桌
        ctx.fillStyle = '#4a3a3a';
        ctx.fillRect(650, 420, 200, 100);
        ctx.fillRect(660, 410, 180, 15);

        // 台灯
        ctx.fillStyle = '#5a4a4a';
        ctx.fillRect(790, 360, 5, 55);
        ctx.fillStyle = '#e8d090';
        ctx.beginPath();
        ctx.moveTo(770, 360);
        ctx.lineTo(815, 360);
        ctx.lineTo(805, 340);
        ctx.lineTo(780, 340);
        ctx.closePath();
        ctx.fill();

        const deskLight = ctx.createRadialGradient(792, 360, 10, 792, 360, 120);
        deskLight.addColorStop(0, 'rgba(232, 208, 144, 0.25)');
        deskLight.addColorStop(1, 'rgba(232, 208, 144, 0)');
        ctx.fillStyle = deskLight;
        ctx.fillRect(670, 320, 250, 200);

        // 床
        ctx.fillStyle = '#4a3a4a';
        ctx.fillRect(50, 460, 180, 60);
        ctx.fillStyle = '#5a4a5a';
        ctx.fillRect(50, 450, 180, 15);
        // 被子
        ctx.fillStyle = '#6a4a5a';
        ctx.fillRect(55, 465, 170, 50);

        // 窗户
        ctx.fillStyle = '#1a2a3a';
        ctx.fillRect(350, 120, 200, 250);
        ctx.fillStyle = '#2a3a4a';
        ctx.fillRect(355, 125, 190, 240);
        // 窗框
        ctx.strokeStyle = '#4a5a6a';
        ctx.lineWidth = 4;
        ctx.strokeRect(350, 120, 200, 250);
        ctx.beginPath();
        ctx.moveTo(450, 120);
        ctx.lineTo(450, 370);
        ctx.moveTo(350, 245);
        ctx.lineTo(550, 245);
        ctx.stroke();

        // 窗外飘雪
        ctx.fillStyle = 'rgba(220, 230, 255, 0.6)';
        for (let i = 0; i < 15; i++) {
          const x = 360 + (i * 37) % 180;
          const y = 130 + (i * 23 + this.elapsed * 0.05) % 230;
          ctx.fillRect(x, y, 2, 2);
        }
        break;

      case 'underground_bunker':
        // 地下50米 防空洞
        const ugGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        ugGrad.addColorStop(0, '#121018');
        ugGrad.addColorStop(1, '#1e1a28');
        ctx.fillStyle = ugGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 拱形天花板
        ctx.fillStyle = '#1a1622';
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.quadraticCurveTo(this.width / 2, -50, this.width, 200);
        ctx.lineTo(this.width, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // 墙壁砖块
        ctx.fillStyle = '#1e1a28';
        for (let y = 200; y < this.height; y += 35) {
          for (let x = 0; x < this.width; x += 55) {
            const offset = (y / 35) % 2 === 0 ? 0 : 27;
            ctx.fillStyle = (Math.floor(y / 35) + Math.floor((x + offset) / 55)) % 2 === 0 ? '#1e1a28' : '#221d2e';
            ctx.fillRect(x + offset, y, 52, 32);
          }
        }

        // 灯泡
        for (let i = 0; i < 3; i++) {
          const lx = 200 + i * 280;
          ctx.fillStyle = '#3a2a3a';
          ctx.fillRect(lx - 2, 100, 4, 40);
          ctx.fillStyle = '#d4a060';
          ctx.beginPath();
          ctx.arc(lx, 145, 15, 0, Math.PI * 2);
          ctx.fill();

          const bulb = ctx.createRadialGradient(lx, 145, 8, lx, 145, 100);
          bulb.addColorStop(0, 'rgba(212, 160, 96, 0.2)');
          bulb.addColorStop(1, 'rgba(212, 160, 96, 0)');
          ctx.fillStyle = bulb;
          ctx.fillRect(lx - 100, 100, 200, 250);
        }

        // 钢琴
        ctx.fillStyle = '#0f0a14';
        ctx.fillRect(380, 420, 200, 90);
        ctx.fillStyle = '#1a1020';
        ctx.fillRect(385, 415, 190, 12);
        // 琴键
        for (let i = 0; i < 14; i++) {
          ctx.fillStyle = '#e0d8c8';
          ctx.fillRect(395 + i * 13, 435, 11, 60);
          if (i % 7 !== 2 && i % 7 !== 6) {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(404 + i * 13, 435, 6, 35);
          }
        }
        break;

      case 'snow_street':
        // 雪中街道
        const streetGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        streetGrad.addColorStop(0, '#1a2235');
        streetGrad.addColorStop(0.6, '#2a3550');
        streetGrad.addColorStop(1, '#3a4a6a');
        ctx.fillStyle = streetGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 远处建筑剪影
        ctx.fillStyle = '#1a2030';
        for (let i = 0; i < 8; i++) {
          const bx = i * 130 - 20;
          const bh = 150 + (i * 47) % 120;
          ctx.fillRect(bx, 380 - bh, 100, bh);
          // 窗户
          ctx.fillStyle = 'rgba(180, 200, 230, 0.2)';
          for (let wy = 0; wy < 5; wy++) {
            for (let wx = 0; wx < 3; wx++) {
              if ((i + wy + wx) % 3 !== 0) {
                ctx.fillRect(bx + 15 + wx * 25, 380 - bh + 30 + wy * 25, 12, 15);
              }
            }
          }
          ctx.fillStyle = '#1a2030';
        }

        // 近处建筑
        ctx.fillStyle = '#252d40';
        ctx.fillRect(0, 300, 200, 260);
        ctx.fillRect(760, 280, 200, 280);

        // 窗户亮灯
        ctx.fillStyle = '#e8d090';
        ctx.fillRect(80, 340, 25, 30);
        ctx.fillRect(130, 400, 20, 25);
        ctx.fillRect(820, 330, 30, 35);
        ctx.fillRect(870, 420, 20, 25);

        // 雪地
        ctx.fillStyle = '#d8e0f0';
        ctx.beginPath();
        ctx.moveTo(0, 560);
        ctx.quadraticCurveTo(200, 540, 400, 555);
        ctx.quadraticCurveTo(600, 570, 800, 550);
        ctx.quadraticCurveTo(900, 545, this.width, 560);
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(0, this.height);
        ctx.closePath();
        ctx.fill();

        // 路灯
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(250, 380, 6, 180);
        ctx.fillStyle = '#e8d090';
        ctx.beginPath();
        ctx.arc(253, 375, 12, 0, Math.PI * 2);
        ctx.fill();
        const lampGrad = ctx.createRadialGradient(253, 375, 8, 253, 375, 80);
        lampGrad.addColorStop(0, 'rgba(232, 208, 144, 0.3)');
        lampGrad.addColorStop(1, 'rgba(232, 208, 144, 0)');
        ctx.fillStyle = lampGrad;
        ctx.fillRect(170, 300, 160, 150);

        // 脚印
        ctx.fillStyle = '#b0c0d8';
        for (let i = 0; i < 10; i++) {
          ctx.fillRect(400 - i * 25, 580 + (i % 2) * 8, 8, 12);
        }
        break;

      case 'radio_tower':
        // 广播塔（新十月革命）
        const rtGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        rtGrad.addColorStop(0, '#0a0e1e');
        rtGrad.addColorStop(0.6, '#141a30');
        rtGrad.addColorStop(1, '#1e2440');
        ctx.fillStyle = rtGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 夜空星星
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 40; i++) {
          const sx = (i * 211) % this.width;
          const sy = (i * 89) % 200;
          ctx.globalAlpha = 0.3 + Math.sin(this.elapsed / 1000 + i) * 0.3;
          ctx.fillRect(sx, sy, 2, 2);
        }
        ctx.globalAlpha = 1;

        // 远处城市剪影
        ctx.fillStyle = '#0d1220';
        for (let i = 0; i < 10; i++) {
          const bx = i * 100 - 30;
          const bh = 100 + (i * 53) % 80;
          ctx.fillRect(bx, 420 - bh, 80, bh);
        }

        // 铁塔结构
        ctx.strokeStyle = '#4a5a7a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(440, 460);
        ctx.lineTo(500, 120);
        ctx.moveTo(560, 460);
        ctx.lineTo(500, 120);
        ctx.stroke();
        // 塔身横梁
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const t = i / 8;
          const y = 460 - t * 340;
          const halfW = 60 * (1 - t) + 4;
          ctx.beginPath();
          ctx.moveTo(500 - halfW, y);
          ctx.lineTo(500 + halfW, y);
          ctx.stroke();
          // 交叉斜撑
          if (i < 7) {
            const t2 = (i + 1) / 8;
            const y2 = 460 - t2 * 340;
            const halfW2 = 60 * (1 - t2) + 4;
            ctx.beginPath();
            ctx.moveTo(500 - halfW, y);
            ctx.lineTo(500 + halfW2, y2);
            ctx.moveTo(500 + halfW, y);
            ctx.lineTo(500 - halfW2, y2);
            ctx.stroke();
          }
        }

        // 塔顶红灯（闪烁）
        const blink = Math.sin(this.elapsed / 400) > 0;
        ctx.fillStyle = blink ? '#e04040' : '#601515';
        ctx.beginPath();
        ctx.arc(500, 115, 8, 0, Math.PI * 2);
        ctx.fill();
        if (blink) {
          const redGlow = ctx.createRadialGradient(500, 115, 5, 500, 115, 60);
          redGlow.addColorStop(0, 'rgba(224, 64, 64, 0.4)');
          redGlow.addColorStop(1, 'rgba(224, 64, 64, 0)');
          ctx.fillStyle = redGlow;
          ctx.fillRect(440, 55, 120, 120);
        }

        // 发射电波（动画圆弧）
        ctx.strokeStyle = 'rgba(224, 200, 112, 0.35)';
        for (let i = 0; i < 3; i++) {
          const r = ((this.elapsed / 15) % 200) + i * 66;
          ctx.globalAlpha = Math.max(0, 1 - r / 200) * 0.5;
          ctx.beginPath();
          ctx.arc(500, 115, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // 地面雪地
        ctx.fillStyle = '#2a3450';
        ctx.fillRect(0, 460, this.width, this.height - 460);
        ctx.fillStyle = '#39445e';
        ctx.fillRect(0, 460, this.width, 10);

        // 红旗（塔底升起）
        ctx.fillStyle = '#8b2020';
        ctx.fillRect(600, 340, 4, 120);
        ctx.fillStyle = '#c03030';
        ctx.beginPath();
        ctx.moveTo(604, 340);
        ctx.lineTo(660, 352);
        ctx.lineTo(604, 368);
        ctx.closePath();
        ctx.fill();
        break;

      case 'irkutsk':
        // 伊尔库茨克战役
        const irkGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        irkGrad.addColorStop(0, '#1a1418');
        irkGrad.addColorStop(0.5, '#2a1e24');
        irkGrad.addColorStop(1, '#32242c');
        ctx.fillStyle = irkGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 天空炮火闪光
        const flash = Math.sin(this.elapsed / 300) > 0.6;
        if (flash) {
          ctx.fillStyle = 'rgba(255, 200, 100, 0.15)';
          ctx.fillRect(0, 0, this.width, 300);
        }

        // 伊尔库茨克克里姆林轮廓（远处）
        ctx.fillStyle = '#171019';
        // 教堂洋葱顶
        ctx.fillRect(120, 200, 60, 160);
        ctx.beginPath();
        ctx.arc(150, 200, 30, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(140, 140, 20, 45);
        ctx.beginPath();
        ctx.arc(150, 140, 10, 0, Math.PI * 2);
        ctx.fill();
        // 主体建筑
        ctx.fillRect(200, 240, 300, 120);
        // 塔楼
        ctx.fillRect(520, 180, 50, 180);
        ctx.beginPath();
        ctx.arc(545, 180, 25, Math.PI, 0);
        ctx.fill();

        // 城墙
        ctx.fillRect(80, 300, 560, 60);
        // 城垛
        for (let i = 0; i < 14; i++) {
          ctx.fillRect(80 + i * 40, 290, 24, 12);
        }

        // 战场（中景）：弹坑与拒马
        ctx.fillStyle = '#241a20';
        ctx.fillRect(0, 360, this.width, 100);
        // 弹坑
        ctx.fillStyle = '#151015';
        for (let i = 0; i < 8; i++) {
          const cx = 60 + i * 115;
          ctx.beginPath();
          ctx.ellipse(cx, 400 + (i % 3) * 15, 35, 12, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // 拒马
        ctx.strokeStyle = '#3a2a20';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          const bx = 100 + i * 150;
          ctx.beginPath();
          ctx.moveTo(bx, 420);
          ctx.lineTo(bx + 30, 390);
          ctx.moveTo(bx + 30, 390);
          ctx.lineTo(bx + 60, 420);
          ctx.stroke();
        }

        // 前景雪地
        ctx.fillStyle = '#3d3038';
        ctx.fillRect(0, 460, this.width, this.height - 460);
        break;

      case 'moscow':
        // 莫斯科战役
        const mskGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        mskGrad.addColorStop(0, '#181420');
        mskGrad.addColorStop(0.5, '#241a28');
        mskGrad.addColorStop(1, '#2c2030');
        ctx.fillStyle = mskGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 烟柱
        for (let i = 0; i < 5; i++) {
          const sx = 150 + i * 160;
          const grad = ctx.createLinearGradient(sx, 0, sx, 350);
          grad.addColorStop(0, 'rgba(80, 70, 80, 0)');
          grad.addColorStop(1, 'rgba(60, 50, 60, 0.5)');
          ctx.fillStyle = grad;
          ctx.fillRect(sx - 25, 0, 50, 350);
        }

        // 克里姆林宫斯帕斯卡亚塔（受损）
        ctx.fillStyle = '#1a1520';
        ctx.fillRect(430, 160, 70, 260);
        // 塔顶（尖顶歪斜）
        ctx.beginPath();
        ctx.moveTo(430, 160);
        ctx.lineTo(475, 90);
        ctx.lineTo(505, 155);
        ctx.closePath();
        ctx.fill();
        // 塔楼窗口的火光
        const fire = Math.sin(this.elapsed / 250) > 0;
        ctx.fillStyle = fire ? '#e88030' : '#a05020';
        ctx.fillRect(455, 200, 12, 18);
        ctx.fillRect(458, 250, 10, 15);
        ctx.fillRect(455, 300, 12, 16);

        // 克里姆林城墙
        ctx.fillStyle = '#201826';
        ctx.fillRect(200, 340, 560, 80);
        for (let i = 0; i < 14; i++) {
          ctx.fillRect(200 + i * 40, 330, 24, 12);
        }

        // 红星（即将升起的位置 - 空缺）
        ctx.strokeStyle = 'rgba(224, 100, 100, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(475, 85, 12, 0, Math.PI * 2);
        ctx.stroke();

        // 废墟前景
        ctx.fillStyle = '#241c28';
        ctx.fillRect(0, 420, this.width, this.height - 420);
        // 瓦砾堆
        ctx.fillStyle = '#302432';
        for (let i = 0; i < 10; i++) {
          const rx = 30 + i * 95;
          const ry = 440 + (i % 3) * 20;
          ctx.beginPath();
          ctx.moveTo(rx, 520);
          ctx.lineTo(rx + 40, ry);
          ctx.lineTo(rx + 80, 520);
          ctx.closePath();
          ctx.fill();
        }
        // 破坦克残骸
        ctx.fillStyle = '#1c1620';
        ctx.fillRect(700, 440, 90, 30);
        ctx.fillRect(720, 425, 50, 18);
        ctx.beginPath();
        ctx.arc(720, 472, 12, 0, Math.PI * 2);
        ctx.arc(760, 472, 12, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'germania':
        // 日耳曼尼亚 · 国会大厦废墟
        const gerGrad = ctx.createLinearGradient(0, 0, 0, this.height);
        gerGrad.addColorStop(0, '#12101a');
        gerGrad.addColorStop(0.5, '#1c1824');
        gerGrad.addColorStop(1, '#262030');
        ctx.fillStyle = gerGrad;
        ctx.fillRect(0, 0, this.width, this.height);

        // 探照灯
        for (let i = 0; i < 3; i++) {
          const lx = 200 + i * 280;
          const angle = Math.sin(this.elapsed / 3000 + i * 2) * 0.4 - 0.2;
          ctx.save();
          ctx.translate(lx, 520);
          ctx.rotate(angle);
          const beam = ctx.createLinearGradient(0, 0, 0, -480);
          beam.addColorStop(0, 'rgba(200, 210, 240, 0.25)');
          beam.addColorStop(1, 'rgba(200, 210, 240, 0)');
          ctx.fillStyle = beam;
          ctx.beginPath();
          ctx.moveTo(-8, 0);
          ctx.lineTo(-40, -480);
          ctx.lineTo(40, -480);
          ctx.lineTo(8, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // 国会大厦（半毁）：主体
        ctx.fillStyle = '#1a1622';
        ctx.fillRect(220, 250, 520, 220);
        // 立柱
        ctx.fillStyle = '#251f2c';
        for (let i = 0; i < 8; i++) {
          ctx.fillRect(250 + i * 65, 260, 34, 200);
        }
        // 穹顶（破洞）
        ctx.fillStyle = '#1a1622';
        ctx.beginPath();
        ctx.arc(480, 250, 90, Math.PI, 0);
        ctx.fill();
        // 穹顶破洞（透出天空）
        ctx.fillStyle = '#0d0b14';
        ctx.beginPath();
        ctx.arc(470, 225, 50, Math.PI, 0.4);
        ctx.fill();
        // 穹顶上的红旗（最终胜利）
        ctx.fillStyle = '#8b2020';
        ctx.fillRect(478, 130, 4, 60);
        ctx.fillStyle = '#d03030';
        ctx.beginPath();
        ctx.moveTo(482, 130);
        ctx.lineTo(545, 145);
        ctx.lineTo(482, 162);
        ctx.closePath();
        ctx.fill();

        // 台阶与弹痕
        ctx.fillStyle = '#221c2a';
        ctx.fillRect(200, 470, 560, 30);
        ctx.fillStyle = '#2a2232';
        ctx.fillRect(180, 500, 600, 30);
        // 弹痕
        ctx.fillStyle = '#0f0c14';
        for (let i = 0; i < 12; i++) {
          ctx.beginPath();
          ctx.arc(240 + i * 45, 480 + (i % 2) * 10, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // 前景瓦砾
        ctx.fillStyle = '#1e1826';
        ctx.fillRect(0, 530, this.width, this.height - 530);
        // 铁十字旗残片（掉落在地）
        ctx.fillStyle = '#3a3444';
        ctx.fillRect(120, 560, 70, 40);
        ctx.strokeStyle = '#5a5464';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(155, 565); ctx.lineTo(155, 595);
        ctx.moveTo(140, 580); ctx.lineTo(170, 580);
        ctx.stroke();
        break;

      default:
        // 默认深色背景
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, this.width, this.height);
    }
  },

  // ===== 角色立绘（像素风格简化版） =====
  renderCharacterPortrait(characterId) {
    const char = Characters[characterId];
    if (!char) return;

    const ctx = this.ctx;
    const x = characterId === 'anna' ? 80 : (characterId === 'sablin' ? 800 : 100);
    const y = 80;

    // 简单的像素头像框
    ctx.fillStyle = 'rgba(20, 25, 45, 0.6)';
    ctx.fillRect(x - 10, y - 10, 180, 240);
    ctx.strokeStyle = char.color || '#5a6aa0';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 10, y - 10, 180, 240);

    // 像素头像（简化为大像素块）
    const px = 5; // 像素大小
    const colors = this.getPixelCharacterColors(characterId);
    const pattern = this.getPixelCharacterPattern(characterId);

    for (let py = 0; py < pattern.length; py++) {
      for (let px = 0; px < pattern[py].length; px++) {
        const c = pattern[py][px];
        if (c !== ' ' && c !== '.') {
          ctx.fillStyle = colors[c] || '#fff';
          ctx.fillRect(x + px * 6, y + py * 6, 6, 6);
        }
      }
    }
  },

  getPixelCharacterColors(id) {
    const palettes = {
      anna: {
        'H': '#d4a5e0',  // 头发
        'S': '#f0d8c0',  // 皮肤
        'E': '#3a2a4a',  // 眼睛
        'C': '#8b2030',  // 衣服（红色围巾/毛衣）
        'D': '#6a1520',  // 衣服阴影
        'W': '#ffffff',  // 白色高光
        'B': '#2a1a2a',  // 深色
      },
      sablin: {
        'H': '#5a3a2a',  // 头发
        'S': '#f0d8c0',  // 皮肤
        'E': '#2a3a5a',  // 眼睛
        'C': '#2a3a5a',  // 军装
        'D': '#1a2a4a',  // 军装阴影
        'W': '#e8d090',  // 金色肩章
        'B': '#0a1525',  // 深色
        'R': '#c03030',  // 红星
      },
      andrei: {
        'H': '#b0a080',  // 白发
        'S': '#e0c8a8',  // 皮肤
        'E': '#3a3020',  // 眼睛
        'C': '#4a3a3a',  // 外套
        'D': '#3a2a2a',  // 阴影
        'B': '#2a1a1a',  // 深色
        'W': '#d0c0a0',  // 胡须
      },
      yagoda: {
        'H': '#404040',
        'S': '#d8b8a0',
        'E': '#602020',
        'C': '#402030',
        'D': '#301020',
        'B': '#100010',
        'M': '#804040',  // 勋章
      },
    };
    return palettes[id] || palettes.anna;
  },

  getPixelCharacterPattern(id) {
    // 24x28 像素头像
    const patterns = {
      anna: [
        '      HHHHHHHH      ',
        '    HHHHHHHHHHHH    ',
        '   HHHHHHHHHHHHHH   ',
        '  HHHSSSSSSSSSHHH   ',
        '  HSSSSSSSSSSSSSH   ',
        '  HSSSSESSSSESSH    ',
        '  SSSSSSSSSSSSSS    ',
        '  SSSSSS..SSSSSS    ',
        '  SSSSSSMMSSSSSS    ',
        '  HSSSSSSSSSSSSH    ',
        '  HHSSSSSSSSSHH     ',
        '   HHHSSSSSHHH      ',
        '  CCCCCCCCCCCCCC    ',
        ' CCCCDCCCCCCDCCCC   ',
        ' CCCCDCCCCCCDCCCC   ',
        ' WCCCDCCCCCCDCCCW   ',
        ' CCCCCCCCCCCCCCCC   ',
        '  CCCCCCCCCCCCCC    ',
        '  CCCCCCCCCCCCCC    ',
        '   CCCCCCCCCCCC     ',
        '    CCCCCCCCCC      ',
        '    CCC    CCC      ',
        '    CCC    CCC      ',
      ],
      sablin: [
        '      BBBBBBBB      ',
        '    BBBBBBBBBBBB    ',
        '   BBRBBBBBBBRBB    ',
        '  BBHHHHHHHHHHBB    ',
        '  BHSSSSSSSSSSHB    ',
        '  BSSSESSSSSESSH    ',
        '  SSSSSSSSSSSSSS    ',
        '  SSSSSSSSSSSSSS    ',
        '  SSSSSSMMSSSSSS    ',
        '  BSSSSSSSSSSSB     ',
        '  BBSSSSSSSSSBB     ',
        '   WBBSSSSSBBW      ',
        '  WCCCCCCCCCCCW     ',
        ' WCCCDCCCCCCDCCCW   ',
        ' WCCCDCCCCCCDCCCW   ',
        '  CCDCCCCCCCDCC     ',
        '  CCCCCCCCCCCCCC    ',
        '  CCCCCCCCCCCCCC    ',
        '  DCCCCCCCCCCCD     ',
        '   DDDDDDDDDDDD     ',
        '    DDDDDDDDDD      ',
        '    DDD    DDD      ',
        '    DDD    DDD      ',
      ],
      andrei: [
        '      WWWWWWWW      ',
        '    WWWWWWWWWWWW    ',
        '   WWWWWWWWWWWWWW   ',
        '  WWWSSSSSSSSSWWW   ',
        '  WSSSSSSSSSSSSSW   ',
        '  WSSSESSSSSESSW    ',
        '  SSSSSSSSSSSSSS    ',
        '  SSSSSSSSSSSSSS    ',
        '  WWWWWWSSWWWWWW    ',
        '  WWWWWWWWWWWWWW    ',
        '  BSSSSSSSSSSSB     ',
        '  BBSSSSSSSSSBB     ',
        '   BBBSSSSSBBB      ',
        '  CCCCCCCCCCCCCC    ',
        ' CCCCDCCCCCCDCCCC   ',
        ' CCCCDCCCCCCDCCCC   ',
        '  CCDCCCCCCCDCC     ',
        '  CCCCCCCCCCCCCC    ',
        '  CCCCCCCCCCCCCC    ',
        '   CCCCCCCCCCCC     ',
        '    CCCCCCCCCC      ',
        '    CCC    CCC      ',
        '    CCC    CCC      ',
      ],
      yagoda: [
        '      BBBBBBBB      ',
        '    BBBBBBBBBBBB    ',
        '   BBHHHHHHHHBB     ',
        '  BBHHHHHHHHHHBB    ',
        '  BHSSSSSSSSSSHB    ',
        '  BSSSESSSSSESSH    ',
        '  SSSSSSSSSSSSSS    ',
        '  SSSSSSSSSSSSSS    ',
        '  SSSSSS..SSSSSS    ',
        '  BSSSSSSSSSSSB     ',
        '  BBSSSSSSSSSBB     ',
        '   MBBSSSSSBBM      ',
        '  CCCCCCCCCCCCCC    ',
        ' CCCCDCCCCCCDCCCC   ',
        ' MMCCDCCCCCDDCCMM   ',
        '  CCDCCCCCCCDCC     ',
        '  CCCCCCCCCCCCCC    ',
        '  MCCCCCCCCCCCCM    ',
        '   CCCCCCCCCCCC     ',
        '    CCCCCCCCCC      ',
        '    CCC    CCC      ',
        '    CCC    CCC      ',
        '    CCC    CCC      ',
      ],
    };
    return patterns[id] || patterns.anna;
  },

  // ===== 粒子系统 =====
  spawnParticle(x, y, vx, vy, color, size, life) {
    this.particles.push({
      x, y, vx, vy, color, size,
      life, maxLife: life, alpha: 1,
    });
  },

  renderParticles() {
    const ctx = this.ctx;
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  },

  // ===== 场景切换特效 =====
  transitionEffect: null,

  startTransition(effect, callback) {
    this.transitionEffect = {
      type: effect || 'fade',
      progress: 0,
      duration: effect === 'fade' ? 800 : 600,
      callback,
      phase: 'in', // 'in' = 淡入黑，'out' = 从黑淡出
    };
  },

  // ===== 可走场景（简易） =====
  walkablePlayer: { x: 480, y: 400, dir: 'down', frame: 0, frameTimer: 0 },
  walkableMap: null,

  updateWalkableScene(dt) {
    const speed = 120;
    let moved = false;
    if (Input.isDown('ArrowUp') || Input.isDown('w') || Input.isDown('W')) {
      this.walkablePlayer.y -= speed * dt;
      this.walkablePlayer.dir = 'up';
      moved = true;
    }
    if (Input.isDown('ArrowDown') || Input.isDown('s') || Input.isDown('S')) {
      this.walkablePlayer.y += speed * dt;
      this.walkablePlayer.dir = 'down';
      moved = true;
    }
    if (Input.isDown('ArrowLeft') || Input.isDown('a') || Input.isDown('A')) {
      this.walkablePlayer.x -= speed * dt;
      this.walkablePlayer.dir = 'left';
      moved = true;
    }
    if (Input.isDown('ArrowRight') || Input.isDown('d') || Input.isDown('D')) {
      this.walkablePlayer.x += speed * dt;
      this.walkablePlayer.dir = 'right';
      moved = true;
    }

    // 边界
    this.walkablePlayer.x = Math.max(20, Math.min(this.width - 20, this.walkablePlayer.x));
    this.walkablePlayer.y = Math.max(100, Math.min(this.height - 30, this.walkablePlayer.y));

    // 动画帧
    if (moved) {
      this.walkablePlayer.frameTimer += dt;
      if (this.walkablePlayer.frameTimer > 0.15) {
        this.walkablePlayer.frameTimer = 0;
        this.walkablePlayer.frame = (this.walkablePlayer.frame + 1) % 4;
      }
    } else {
      this.walkablePlayer.frame = 0;
    }
  },
};

// ===== 输入系统 =====
const Input = {
  keys: {},
  justPressed: {},

  init() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.key]) {
        this.justPressed[e.key] = true;
      }
      this.keys[e.key] = true;

      // 阻止方向键滚动页面
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  },

  isDown(key) {
    return !!this.keys[key];
  },

  consume(key) {
    if (this.justPressed[key]) {
      this.justPressed[key] = false;
      return true;
    }
    return false;
  },

  // 每帧末尾调用，清空 justPressed
  endFrame() {
    this.justPressed = {};
  },
};
