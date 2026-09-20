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

  // ===== 角色立绘（精细矢量分层版） =====
  // 布局：安娜等在左侧，萨布林/亚戈达在右侧；含呼吸、眨眼、发丝摆动与入场动画
  renderCharacterPortrait(characterId) {
    const char = Characters[characterId];
    if (!char) return;
    const ctx = this.ctx;
    const cfg = this.getPortraitConfig(characterId);
    const t = this.elapsed;

    // 切换角色时的入场动画（上滑 + 淡入）
    if (!this.portraitAnim || this.portraitAnim.id !== characterId) {
      this.portraitAnim = { id: characterId, t0: t };
    }
    const pr = Math.min(1, (t - this.portraitAnim.t0) / 300);
    const ease = 1 - Math.pow(1 - pr, 3);

    const side = cfg.side === 'right' ? 'right' : 'left';
    const w = 232, h = 326;
    const bx = side === 'right' ? this.width - w - 24 : 24;
    const by = 44 + (1 - ease) * 24;
    const glowC = cfg.glow || char.color || '#5a6aa0';

    ctx.save();
    ctx.globalAlpha = 0.2 + 0.8 * ease;

    // —— 面板底 ——
    const pg = ctx.createLinearGradient(bx, by, bx, by + h);
    pg.addColorStop(0, 'rgba(16, 20, 38, 0.85)');
    pg.addColorStop(1, 'rgba(8, 10, 22, 0.92)');
    this.portraitRoundRect(ctx, bx, by, w, h, 16);
    ctx.fillStyle = pg;
    ctx.fill();

    // —— 角色色氛围光 ——
    const rg = ctx.createRadialGradient(bx + w / 2, by + 140, 26, bx + w / 2, by + 150, 190);
    rg.addColorStop(0, this.portraitAlpha(glowC, 0.2));
    rg.addColorStop(1, this.portraitAlpha(glowC, 0));
    ctx.fillStyle = rg;
    this.portraitRoundRect(ctx, bx, by, w, h, 16);
    ctx.fill();

    // —— 描边 + 外发光 ——
    ctx.shadowColor = glowC;
    ctx.shadowBlur = 15;
    this.portraitRoundRect(ctx, bx + 2, by + 2, w - 4, h - 4, 14);
    ctx.strokeStyle = this.portraitAlpha(glowC, 0.85);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // —— 角落装饰 ——
    ctx.fillStyle = this.portraitAlpha(glowC, 0.9);
    ctx.save();
    ctx.translate(bx + 17, by + 17);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-3, -3, 6, 6);
    ctx.restore();
    ctx.fillStyle = this.portraitAlpha(glowC, 0.35);
    ctx.save();
    ctx.translate(bx + w - 17, by + 17);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-2.5, -2.5, 5, 5);
    ctx.restore();

    // —— 闪烁星尘 ——
    if (cfg.sparkle) {
      for (let i = 0; i < 5; i++) {
        const a = Math.max(0, Math.sin(t / 900 + i * 1.9)) * 0.55;
        if (a < 0.03) continue;
        const sx = bx + 26 + ((i * 53 + 11) % (w - 52));
        const sy = by + 22 + ((i * 43 + 29) % 130);
        ctx.strokeStyle = 'rgba(255, 250, 240, ' + a.toFixed(2) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx - 4, sy);
        ctx.lineTo(sx + 4, sy);
        ctx.moveTo(sx, sy - 4);
        ctx.lineTo(sx, sy + 4);
        ctx.stroke();
      }
    }

    // —— 角色本体 ——
    ctx.save();
    ctx.translate(bx + 6, by + 6);
    if (side === 'right') {
      ctx.translate(220, 0);
      ctx.scale(-1, 1);
    }
    this.drawPortraitFigure(ctx, cfg, t);
    ctx.restore();

    // —— 底部名牌 ——
    ctx.save();
    this.portraitRoundRect(ctx, bx, by, w, h, 16);
    ctx.clip();
    const ng = ctx.createLinearGradient(bx, by + h - 96, bx, by + h);
    ng.addColorStop(0, 'rgba(8, 10, 22, 0)');
    ng.addColorStop(0.55, 'rgba(8, 10, 22, 0.72)');
    ng.addColorStop(1, 'rgba(6, 7, 18, 0.95)');
    ctx.fillStyle = ng;
    ctx.fillRect(bx, by + h - 96, w, 96);
    ctx.fillStyle = this.portraitAlpha(glowC, 0.6);
    ctx.fillRect(bx + 40, by + h - 64, w - 80, 1.5);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f2ecdc';
    ctx.font = 'bold 16px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(char.shortName || char.name, bx + w / 2, by + h - 42);
    ctx.shadowBlur = 0;
    ctx.font = '10.5px "Microsoft YaHei", sans-serif';
    ctx.fillStyle = this.portraitAlpha(glowC, 0.95);
    ctx.fillText(char.role || '', bx + w / 2, by + h - 23);

    ctx.restore();
  },

  // —— 立绘角色配置（发型/瞳色/服装/配饰/性格化表情） ——
  // 服装风格参考：1960 年代苏联（赫鲁晓夫解冻→勃列日涅夫初期）
  //   女性：布拉吉 платье（收腰 A 字连衣裙）、针织开衫、白棉袜
  //   男性：M58/M69 军装（卡其开领单排扣夹克、肩章）、列宁装
  //   NKVD/MVD：M58 制服（卡其+深蓝帽顶+锈红帽带+红镶边）
  getPortraitConfig(id) {
    const cfg = {
      // 安娜：紫发少女，穿布拉吉连衣裙（收腰紫裙+宽腰带）
      anna: {
        seed: 11, skin: '#f2dcc6', blush: 0.5, freckles: false, wrinkles: false, ahoge: true,
        hair: { style: 'long', cut: 'sideswept', color: '#c99bdc', shade: '#a87cc0', shine: '#e8ccf4' },
        eyes: { iris: '#a06ad0', iris2: '#5a3a88', glow: '#e4c4f4' },
        brow: { color: '#9a6ab0', tilt: 0.1 },
        mouth: { smile: 0.5, color: '#c05a6a' },
        outfit: { type: 'dress', color: '#b89ac8', shade: '#9a7ca8', neck: 'platie', belt: '#5a3a88', beltBuckle: '#d8b45a', cardigan: '#7a5a8e' },
        acc: {}, glow: '#d4a5e0', sparkle: true, side: 'left',
      },
      // 萨布林：年轻政委，M58 卡其开领军装+红星肩章+领带
      sablin: {
        seed: 23, skin: '#eec9a4', blush: 0, freckles: false, wrinkles: false,
        hair: { style: 'short', cut: 'swept', color: '#6a4a32', shade: '#523824', shine: '#8a6a48' },
        eyes: { iris: '#4a7ab8', iris2: '#28486e', glow: '#a8cee8' },
        brow: { color: '#4a3320', tilt: -0.2 },
        mouth: { smile: 0.4, color: '#b06a5a' },
        outfit: { type: 'uniform', color: '#8a8060', shade: '#6a6244', neck: 'open', trim: '#c0a040', boards: '#c0a040', buttons: true, starPin: true, shirt: '#e8e2d4', tie: '#6a2a2a' },
        acc: {}, glow: '#e8c870', sparkle: true, side: 'right',
      },
      // 叶菲姆：16 岁工人少年，雀斑乱发，卡其工装+背带
      efim: {
        seed: 31, skin: '#eec9a4', blush: 0.3, freckles: true, wrinkles: false,
        hair: { style: 'short', cut: 'messy', color: '#7a4a2a', shade: '#5e3620', shine: '#96623a' },
        eyes: { iris: '#9a7038', iris2: '#6a4a22', glow: '#e0bc80' },
        brow: { color: '#5e3a20', tilt: 0.2 },
        mouth: { smile: 0.7, color: '#b56a55' },
        outfit: { type: 'work', color: '#8a7c5a', shade: '#6a5e44', neck: 'open', suspenders: '#5a4a3a' },
        acc: {}, glow: '#a0d0a0', sparkle: false, side: 'left',
      },
      // 柳帕莎：栗色长发，穿墨绿布拉吉连衣裙+针织开衫+珍珠项链
      lyupasha: {
        seed: 7, skin: '#f4ddc8', blush: 0.35, freckles: false, wrinkles: false,
        hair: { style: 'long', cut: 'sideswept', color: '#5a3a2e', shade: '#42291f', shine: '#7a5440' },
        eyes: { iris: '#5aa864', iris2: '#2e6a3c', glow: '#b8e4c0' },
        brow: { color: '#4a3020', tilt: 0.05 },
        mouth: { smile: 0.45, color: '#c05a6a' },
        outfit: { type: 'dress', color: '#5a8a7a', shade: '#426a5c', neck: 'platie', belt: '#6a4a32', beltBuckle: '#d8b45a', cardigan: '#3a5a4a', necklace: 'pearl' },
        acc: { earrings: 'pearl', rose: true }, glow: '#e090a0', sparkle: true, side: 'left',
      },
      // 老安德烈：白发白须老布尔什维克，深棕厚呢大衣+翻领
      andrei: {
        seed: 5, skin: '#dfc09e', blush: 0, freckles: false, wrinkles: true,
        hair: { style: 'balding', cut: 'balding', color: '#cfc4b0', shade: '#b0a48e', shine: '#e4dcc8' },
        eyes: { iris: '#7a92a8', iris2: '#48607a', glow: '#c8dce6' },
        brow: { color: '#b8ac96', tilt: -0.1 },
        mouth: { smile: 0.3, color: '#a06a5a', hidden: true },
        beard: 'full', beardColor: '#c8bda8', beardShade: '#a89c86',
        outfit: { type: 'coat', color: '#7a5038', shade: '#5a3c28', neck: 'lapels', lapel: '#6a4430', shirt: '#e8e2d4' },
        acc: {}, glow: '#b0a080', sparkle: false, side: 'left',
      },
      // 瓦伦蒂娜：16 岁阳光少女，蜜色齐刘海，天蓝布拉吉连衣裙+粉蝴蝶结领
      valentina: {
        seed: 13, skin: '#f4ddc8', blush: 0.55, freckles: false, wrinkles: false, ahoge: true,
        hair: { style: 'bob', cut: 'fringe', color: '#c89858', shade: '#a87c42', shine: '#e4bc80' },
        eyes: { iris: '#5a9ae0', iris2: '#2e5aa8', glow: '#c0e0f8' },
        brow: { color: '#a87c42', tilt: 0.15 },
        mouth: { smile: 0.9, color: '#c05a6a', open: true },
        outfit: { type: 'dress', color: '#9ac0d8', shade: '#7aa0b8', neck: 'platie', belt: '#e87890', collarColor: '#f2eee4', bow: '#e87890' },
        acc: { clip: '#e87890' }, glow: '#90c0e0', sparkle: true, side: 'left',
      },
      // 佩楚罗：深色中分短发圆眼镜，酒红列宁装西装+胸针
      pechuro: {
        seed: 3, skin: '#eed4b6', blush: 0.15, freckles: false, wrinkles: false,
        hair: { style: 'bob', cut: 'centerpart', color: '#4a3630', shade: '#362622', shine: '#64483c' },
        eyes: { iris: '#8a6a48', iris2: '#5a4430', glow: '#d0b088' },
        brow: { color: '#3a2a22', tilt: -0.05 },
        mouth: { smile: 0.35, color: '#b06055' },
        outfit: { type: 'suit', color: '#6a3050', shade: '#52243c', neck: 'lapels', lapel: '#5a2844', shirt: '#e8e2d4', brooch: true },
        acc: { glasses: 'round' }, glow: '#c0a0e0', sparkle: false, side: 'left',
      },
      // 布劳恩：灰白稀疏头发圆眼镜，灰西装蓝领带
      braun: {
        seed: 9, skin: '#e8c8a8', blush: 0, freckles: false, wrinkles: true,
        hair: { style: 'short', cut: 'receding', color: '#b8b4ac', shade: '#98948c', shine: '#d8d4cc' },
        eyes: { iris: '#8a98a8', iris2: '#5a6a7a', glow: '#d0dae0' },
        brow: { color: '#a8a49c', tilt: -0.1 },
        mouth: { smile: 0.28, color: '#a06655' },
        outfit: { type: 'suit', color: '#5a6472', shade: '#464e5a', neck: 'lapels', lapel: '#4c545e', shirt: '#e8e4da', tie: '#33547a' },
        acc: { glasses: 'round' }, glow: '#a0b0c0', sparkle: false, side: 'left',
      },
      // 玛雅：深色短发中分，青绿列宁装
      ulanovskaya: {
        seed: 17, skin: '#efd2b2', blush: 0.2, freckles: false, wrinkles: false,
        hair: { style: 'bob', cut: 'centerpart', color: '#4a4038', shade: '#362e28', shine: '#645448' },
        eyes: { iris: '#7ab0a0', iris2: '#4a7a6c', glow: '#cceee2' },
        brow: { color: '#3a322a', tilt: 0 },
        mouth: { smile: 0.35, color: '#b06055' },
        outfit: { type: 'suit', color: '#3a6a5c', shade: '#2c5246', neck: 'lapels', lapel: '#325c50', shirt: '#e8e2d4', pin: true },
        acc: {}, glow: '#90d0c0', sparkle: false, side: 'left',
      },
      // 亚戈达：冷面老人，M58 NKVD 卡其制服+深蓝帽顶+锈红镶边满勋章
      yagoda: {
        seed: 41, skin: '#dcc0a4', blush: 0, freckles: false, wrinkles: true,
        hair: { style: 'short', cut: 'receding', color: '#3e3c3a', shade: '#2c2a28', shine: '#5c5a58' },
        eyes: { iris: '#8a4848', iris2: '#5a2828', glow: '#c89090' },
        brow: { color: '#2c2a26', tilt: -0.35 },
        mouth: { smile: -0.2, color: '#8a4a44' },
        beard: 'mustache', beardColor: '#3a3632',
        outfit: { type: 'nkvd', color: '#6a6248', shade: '#4a4430', neck: 'open', trim: '#8b2020', piping: true, medals: 4, buttons: true, shirt: '#e8e2d4' },
        acc: { glasses: 'pince', cap: true, capTop: '#5a6a88', capBand: '#7a1e28' }, glow: '#804040', sparkle: false, side: 'right',
      },
      // NKVD 军官：大檐帽（深蓝帽顶+锈红帽带）+ 卡其制服+红镶边
      nkvd_officer: {
        seed: 29, skin: '#e2c4a4', blush: 0, freckles: false, wrinkles: false,
        hair: { style: 'short', cut: 'capshort', color: '#3a3630', shade: '#2a2620', shine: '#54483a' },
        eyes: { iris: '#6a6a62', iris2: '#403f38', glow: '#a8a89c' },
        brow: { color: '#2a2620', tilt: -0.25 },
        mouth: { smile: -0.05, color: '#9a5a4a' },
        outfit: { type: 'nkvd', color: '#7a7050', shade: '#5a523a', neck: 'open', trim: '#8b2020', piping: true, medals: 1, buttons: true, shirt: '#e8e2d4' },
        acc: { cap: true, capTop: '#5a6a88', capBand: '#7a1e28' }, glow: '#606070', sparkle: false, side: 'left',
      },
      // NKVD 纠察队长：更凶，勋章更多
      nkvd_captain: {
        seed: 37, skin: '#d8ba9c', blush: 0, freckles: false, wrinkles: true,
        hair: { style: 'short', cut: 'capshort', color: '#2e2a24', shade: '#201c18', shine: '#48403a' },
        eyes: { iris: '#68605a', iris2: '#3c3630', glow: '#a8988c' },
        brow: { color: '#201c16', tilt: -0.3 },
        mouth: { smile: -0.1, color: '#8a4a40' },
        outfit: { type: 'nkvd', color: '#6a6248', shade: '#4a4430', neck: 'open', trim: '#8b2020', piping: true, medals: 3, buttons: true, shirt: '#e8e2d4' },
        acc: { cap: true, capTop: '#5a6a88', capBand: '#8b2020' }, glow: '#705050', sparkle: false, side: 'right',
      },
    };
    // 未定义专属立绘的角色 → 剪影
    cfg.__generic = { seed: 5, silhouette: true, glow: '#8a94b8', side: 'left' };
    return cfg[id] || cfg.__generic;
  },

  // —— 立绘主体：分层绘制（后发→躯干→头部→衣领配饰） ——
  drawPortraitFigure(ctx, cfg, t) {
    const cx = 110;
    const cy = 96;
    const seed = cfg.seed || 0;

    // 呼吸与眨眼
    const breath = Math.sin(t / 1650 + seed * 0.7);
    const cycle = 3400 + (seed * 137) % 2100;
    const tB = (t + seed * 731) % cycle;
    let eyeOpen = 1;
    if (tB < 150) eyeOpen = Math.max(0.08, Math.abs(Math.cos(Math.PI * tB / 150)));

    if (cfg.silhouette) {
      this.drawPortraitSilhouette(ctx, cfg, cx, cy);
      return;
    }

    // 1. 后发
    this.drawPortraitHairBack(ctx, cfg, cx, cy, t);

    // 2. 躯干（跟随呼吸起伏）
    ctx.save();
    ctx.translate(0, breath * 2);
    this.drawPortraitTorso(ctx, cfg, cx, 'base', t);
    ctx.restore();

    // 3. 头部组（轻微呼吸）
    ctx.save();
    ctx.translate(0, breath * 0.8);
    this.drawPortraitNeck(ctx, cfg, cx, cy);
    this.drawPortraitEars(ctx, cfg, cx, cy);
    this.drawPortraitFace(ctx, cfg, cx, cy, eyeOpen);
    this.drawPortraitHairFront(ctx, cfg, cx, cy, t);
    ctx.restore();

    // 4. 衣着前层（领口/围巾/肩章等）
    ctx.save();
    ctx.translate(0, breath * 2);
    this.drawPortraitTorso(ctx, cfg, cx, 'front', t);
    ctx.restore();

    // 5. 配饰（眼镜/帽子/耳环/发饰）
    this.drawPortraitAccessories(ctx, cfg, cx, cy, t);
  },

  // —— 通用剪影（无专属立绘的角色） ——
  drawPortraitSilhouette(ctx, cfg, cx, cy) {
    ctx.fillStyle = 'rgba(30, 36, 58, 0.92)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, 42, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(34, 292);
    ctx.bezierCurveTo(36, 236, 44, 198, 66, 186);
    ctx.quadraticCurveTo(92, 174, 110, 174);
    ctx.quadraticCurveTo(128, 174, 154, 186);
    ctx.bezierCurveTo(176, 198, 184, 236, 186, 292);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = this.portraitAlpha(cfg.glow || '#8a94b8', 0.9);
    ctx.font = 'bold 44px serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', cx, cy + 18);
  },

  // —— 颈部 ——
  drawPortraitNeck(ctx, cfg, cx, cy) {
    ctx.fillStyle = cfg.skin;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy + 60);
    ctx.lineTo(cx + 10, cy + 60);
    ctx.lineTo(cx + 11, cy + 88);
    ctx.lineTo(cx - 11, cy + 88);
    ctx.closePath();
    ctx.fill();
    // 下颌投影
    const ng = ctx.createLinearGradient(cx, cy + 60, cx, cy + 78);
    ng.addColorStop(0, 'rgba(140, 95, 75, 0.4)');
    ng.addColorStop(1, 'rgba(140, 95, 75, 0)');
    ctx.fillStyle = ng;
    ctx.fillRect(cx - 11, cy + 60, 22, 20);
  },

  // —— 耳朵 ——
  drawPortraitEars(ctx, cfg, cx, cy) {
    for (const s of [-1, 1]) {
      ctx.fillStyle = cfg.skin;
      ctx.beginPath();
      ctx.ellipse(cx + s * 38, cy - 3, 6, 10, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(140, 95, 75, 0.5)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx + s * 38.5, cy - 3, 3.5, 0.3, Math.PI - 0.3);
      ctx.stroke();
    }
  },

  // —— 面部（二次元风：小脸尖下巴 + 大眼 + 赛璐璐硬边阴影） ——
  drawPortraitFace(ctx, cfg, cx, cy, eyeOpen) {
    const skinLine = this.portraitMix(cfg.skin, '#8a4436', 0.5);

    // 脸部轮廓：二次元椭圆（颅顶饱满 + 窄脸颊 + 尖下巴）
    const facePath = () => {
      ctx.beginPath();
      ctx.moveTo(cx - 38, cy - 12);
      ctx.bezierCurveTo(cx - 42, cy - 44, cx - 24, cy - 60, cx, cy - 60);
      ctx.bezierCurveTo(cx + 24, cy - 60, cx + 42, cy - 44, cx + 38, cy - 12);
      ctx.bezierCurveTo(cx + 30, cy + 14, cx + 18, cy + 40, cx + 7, cy + 54);
      ctx.quadraticCurveTo(cx, cy + 60, cx - 7, cy + 54);
      ctx.bezierCurveTo(cx - 18, cy + 40, cx - 30, cy + 14, cx - 38, cy - 12);
      ctx.closePath();
    };
    facePath();
    ctx.fillStyle = cfg.skin;
    ctx.fill();
    ctx.strokeStyle = this.portraitAlpha(skinLine, 0.5);
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 赛璐璐阴影：刘海投影 + 左颊硬边影
    ctx.save();
    facePath();
    ctx.clip();
    ctx.fillStyle = 'rgba(170, 112, 92, 0.15)';
    ctx.fillRect(cx - 46, cy - 60, 92, 25);
    ctx.beginPath();
    ctx.moveTo(cx - 46, cy - 28);
    ctx.lineTo(cx - 33, cy - 8);
    ctx.lineTo(cx - 33, cy + 48);
    ctx.lineTo(cx - 46, cy + 48);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 眉毛（细拱形，随大眼上移）
    const brow = cfg.brow;
    ctx.strokeStyle = brow.color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy - 23 + brow.tilt * 5);
    ctx.quadraticCurveTo(cx - 17, cy - 28 - brow.tilt * 3, cx - 10, cy - 24);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 10, cy - 24);
    ctx.quadraticCurveTo(cx + 17, cy - 28 - brow.tilt * 3, cx + 24, cy - 23 + brow.tilt * 5);
    ctx.stroke();

    // 眼睛（二次元大眼，上移 13px 并放大 35%）
    this.drawPortraitEye(ctx, cfg, cx - 16, cy - 5, eyeOpen, -1);
    this.drawPortraitEye(ctx, cfg, cx + 16, cy - 5, eyeOpen, 1);

    // 鼻（小点——二次元极简）
    ctx.fillStyle = this.portraitAlpha(skinLine, 0.5);
    ctx.beginPath();
    ctx.arc(cx, cy + 13, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 嘴（小而精致，上移缩小）
    if (!cfg.mouth.hidden) {
      const m = cfg.mouth;
      if (m.open) {
        // 开心露齿笑
        ctx.fillStyle = '#9a4450';
        ctx.beginPath();
        ctx.moveTo(cx - 3.8, cy + 24);
        ctx.quadraticCurveTo(cx, cy + 25 + m.smile * 4, cx + 3.8, cy + 24);
        ctx.quadraticCurveTo(cx, cy + 32, cx - 3.8, cy + 24);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f8f4ec';
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy + 24.6);
        ctx.quadraticCurveTo(cx, cy + 25.4, cx + 3, cy + 24.6);
        ctx.quadraticCurveTo(cx, cy + 27.5, cx - 3, cy + 24.6);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 3.6, cy + 25);
        ctx.quadraticCurveTo(cx, cy + 25 + m.smile * 4, cx + 3.6, cy + 25);
        ctx.stroke();
      }
    }

    // 腮红（柔和椭圆 + 斜线，上移）
    if (cfg.blush > 0) {
      for (const s of [-1, 1]) {
        const bx = cx + s * 24, by = cy + 15;
        const bg = ctx.createRadialGradient(bx, by, 1, bx, by, 11);
        bg.addColorStop(0, 'rgba(240, 130, 140, ' + (0.3 * cfg.blush + 0.08).toFixed(2) + ')');
        bg.addColorStop(1, 'rgba(240, 130, 140, 0)');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.ellipse(bx, by, 11, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(235, 115, 130, ' + (0.3 * cfg.blush).toFixed(2) + ')';
        ctx.lineWidth = 1.1;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(bx - 5 + i * 4, by + 2);
          ctx.lineTo(bx - 2 + i * 4, by - 3);
          ctx.stroke();
        }
      }
    }

    // 雀斑
    if (cfg.freckles) {
      ctx.fillStyle = 'rgba(160, 100, 70, 0.45)';
      for (const s of [-1, 1]) {
        ctx.fillRect(cx + s * 18, cy + 12, 1.3, 1.3);
        ctx.fillRect(cx + s * 23, cy + 16, 1.3, 1.3);
        ctx.fillRect(cx + s * 20, cy + 19, 1.3, 1.3);
      }
    }

    // 皱纹（弱化：眼角 + 额头）
    if (cfg.wrinkles) {
      ctx.strokeStyle = 'rgba(120, 85, 70, 0.3)';
      ctx.lineWidth = 1.1;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + s * 23, cy - 2);
        ctx.quadraticCurveTo(cx + s * 29, cy - 3, cx + s * 31, cy);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - 11, cy - 30);
      ctx.quadraticCurveTo(cx, cy - 33, cx + 11, cy - 30);
      ctx.stroke();
    }

    // 胡须（络腮胡 / 八字胡）
    if (cfg.beard === 'full') {
      ctx.fillStyle = cfg.beardColor;
      ctx.beginPath();
      ctx.moveTo(cx - 36, cy + 12);
      ctx.bezierCurveTo(cx - 40, cy + 40, cx - 22, cy + 60, cx, cy + 62);
      ctx.bezierCurveTo(cx + 22, cy + 60, cx + 40, cy + 40, cx + 36, cy + 12);
      ctx.bezierCurveTo(cx + 28, cy + 20, cx + 14, cy + 26, cx + 6, cy + 28);
      ctx.bezierCurveTo(cx + 2, cy + 29, cx - 2, cy + 29, cx - 6, cy + 28);
      ctx.bezierCurveTo(cx - 14, cy + 26, cx - 28, cy + 20, cx - 36, cy + 12);
      ctx.closePath();
      ctx.fill();
      // 八字胡
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy + 28);
      ctx.quadraticCurveTo(cx, cy + 25, cx + 9, cy + 28);
      ctx.quadraticCurveTo(cx + 13, cy + 30, cx + 10, cy + 34);
      ctx.quadraticCurveTo(cx, cy + 31, cx - 10, cy + 34);
      ctx.quadraticCurveTo(cx - 13, cy + 30, cx - 9, cy + 28);
      ctx.closePath();
      ctx.fill();
      // 胡须纹理
      ctx.strokeStyle = cfg.beardShade;
      ctx.lineWidth = 1;
      for (const s of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(cx + s * (12 + i * 6), cy + 32 + i * 4);
          ctx.quadraticCurveTo(cx + s * (10 + i * 6), cy + 40 + i * 4, cx + s * (12 + i * 6), cy + 46 + i * 3);
          ctx.stroke();
        }
      }
    } else if (cfg.beard === 'mustache') {
      ctx.fillStyle = cfg.beardColor;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + 26);
      ctx.quadraticCurveTo(cx, cy + 23, cx + 10, cy + 26);
      ctx.quadraticCurveTo(cx + 13, cy + 28, cx + 10, cy + 32);
      ctx.quadraticCurveTo(cx, cy + 29, cx - 10, cy + 32);
      ctx.quadraticCurveTo(cx - 13, cy + 28, cx - 10, cy + 26);
      ctx.closePath();
      ctx.fill();
    }
  },

  // —— 单眼（二次元：渐层虹膜 + 双高光 + 睫毛线，放大 35%） ——
  drawPortraitEye(ctx, cfg, ex, ey, eyeOpen, side) {
    const E = cfg.eyes;
    const ink = '#241c28';
    ctx.save();
    ctx.translate(ex, ey);
    ctx.scale(1, Math.max(0.07, eyeOpen));

    // 眼白（杏仁形，外角微挑，放大版）
    const eyePath = () => {
      ctx.beginPath();
      ctx.moveTo(-13.5, 0);
      ctx.quadraticCurveTo(-11.5, -9.7, 0, -10.3);
      ctx.quadraticCurveTo(11.5, -9.9, 14, -3);
      ctx.quadraticCurveTo(11.6, 8.9, 0, 9.7);
      ctx.quadraticCurveTo(-11.6, 8.9, -13.5, 0);
      ctx.closePath();
    };
    eyePath();
    ctx.fillStyle = '#fbf7ef';
    ctx.fill();

    // 虹膜（裁剪在眼内，纵向渐层）
    ctx.save();
    eyePath();
    ctx.clip();
    const ig = ctx.createLinearGradient(0, -11, 0, 11);
    ig.addColorStop(0, E.iris2);
    ig.addColorStop(0.55, E.iris);
    ig.addColorStop(1, E.glow || E.iris);
    ctx.fillStyle = ig;
    ctx.beginPath();
    ctx.ellipse(0.5, 1.1, 8.9, 10.3, 0, 0, Math.PI * 2);
    ctx.fill();
    // 瞳孔
    ctx.fillStyle = '#170f16';
    ctx.beginPath();
    ctx.ellipse(0.5, 1.4, 3.6, 4.6, 0, 0, Math.PI * 2);
    ctx.fill();
    // 底部弧形反光
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0.5, 0.5, 6.5, 0.4, Math.PI - 0.4);
    ctx.stroke();
    // 主高光 + 副高光
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3.6, -3.9, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(3.9, 4.2, 1.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // 上睫毛粗线
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-13.5, 0.5);
    ctx.quadraticCurveTo(-11.5, -9.7, 0, -10.3);
    ctx.quadraticCurveTo(11.5, -9.9, 14, -3);
    ctx.stroke();
    // 外角睫毛翼
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(side * 13, -4.3);
    ctx.quadraticCurveTo(side * 17, -6.5, side * 18.4, -2.4);
    ctx.stroke();
    // 下眼睑
    ctx.strokeStyle = 'rgba(150, 100, 110, 0.4)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-10.8, 6.5);
    ctx.quadraticCurveTo(0, 8.9, 10.8, 6.5);
    ctx.stroke();
    // 双眼皮线
    ctx.strokeStyle = 'rgba(36, 28, 40, 0.28)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-10.1, -11.9);
    ctx.quadraticCurveTo(0, -14.3, 10.1, -11.9);
    ctx.stroke();
    ctx.restore();

    // 闭眼弧线（不随缩放）
    if (eyeOpen < 0.18) {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ex - 9, ey + 1);
      ctx.quadraticCurveTo(ex, ey + 4.5, ex + 9, ey + 1);
      ctx.stroke();
    }
  },

  // —— 后发 ——
  drawPortraitHairBack(ctx, cfg, cx, cy, t) {
    const H = cfg.hair;
    if (!H) return;
    const sway = Math.sin(t / 950 + (cfg.seed % 7)) * 2.5;
    ctx.fillStyle = H.shade;
    if (H.style === 'long') {
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 38);
      ctx.bezierCurveTo(cx - 62, cy - 20, cx - 58, cy + 30, cx - 55, cy + 70);
      ctx.bezierCurveTo(cx - 53, cy + 110, cx - 60 + sway, cy + 160, cx - 50 + sway, cy + 208);
      ctx.lineTo(cx - 27 + sway, cy + 202);
      ctx.bezierCurveTo(cx - 35, cy + 150, cx - 35, cy + 90, cx - 37, cy + 26);
      ctx.lineTo(cx + 37, cy + 26);
      ctx.bezierCurveTo(cx + 35, cy + 90, cx + 35, cy + 150, cx + 27 - sway, cy + 202);
      ctx.lineTo(cx + 50 - sway, cy + 208);
      ctx.bezierCurveTo(cx + 60 - sway, cy + 160, cx + 53, cy + 110, cx + 55, cy + 70);
      ctx.bezierCurveTo(cx + 58, cy + 30, cx + 62, cy - 20, cx + 40, cy - 38);
      ctx.closePath();
      ctx.fill();
      // 发丝流线（长发）
      ctx.strokeStyle = H.color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 3;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + s * 44, cy - 10);
        ctx.bezierCurveTo(cx + s * 50, cy + 60, cx + s * 46, cy + 130, cx + s * 42, cy + 185);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (H.style === 'bob') {
      ctx.beginPath();
      ctx.moveTo(cx - 40, cy - 38);
      ctx.bezierCurveTo(cx - 60, cy - 18, cx - 57, cy + 26, cx - 53, cy + 56);
      ctx.bezierCurveTo(cx - 51, cy + 76, cx - 44, cy + 86, cx - 34, cy + 88);
      ctx.lineTo(cx + 34, cy + 88);
      ctx.bezierCurveTo(cx + 44, cy + 86, cx + 51, cy + 76, cx + 53, cy + 56);
      ctx.bezierCurveTo(cx + 57, cy + 26, cx + 60, cy - 18, cx + 40, cy - 38);
      ctx.closePath();
      ctx.fill();
      // 发丝流线（鲍勃头）
      ctx.strokeStyle = H.color;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2.5;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx + s * 46, cy + 6);
        ctx.bezierCurveTo(cx + s * 50, cy + 40, cx + s * 47, cy + 62, cx + s * 42, cy + 78);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (H.style === 'short') {
      ctx.beginPath();
      ctx.ellipse(cx, cy - 4, 46, 47, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (H.style === 'balding') {
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(cx + s * 36, cy + 12, 17, 24, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // —— 前发（二次元发簇 + 天使环高光 + 呆毛） ——
  drawPortraitHairFront(ctx, cfg, cx, cy, t) {
    const H = cfg.hair;
    if (!H) return;
    const sway = Math.sin(t / 950 + (cfg.seed % 7)) * 2;
    const hairLine = this.portraitMix(H.shade, '#241a20', 0.45);

    // 发簇助手：顶端 (x0..x1) 在发际线，尖端 (tipX, tipY)
    const strand = (x0, x1, tipX, tipY, col) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x0, cy - 57);
      ctx.quadraticCurveTo(x0 + (tipX - x0) * 0.35, (cy - 57 + tipY) / 2 - 3, tipX, tipY);
      ctx.quadraticCurveTo(x1 + (tipX - x1) * 0.65, (cy - 57 + tipY) / 2 - 3, x1, cy - 57);
      ctx.closePath();
      ctx.fill();
    };
    // 垂胸侧发束助手
    const sideLock = (col, grow) => {
      ctx.fillStyle = col;
      for (const s of [-1, 1]) {
        const lx = sway * (s === 1 ? 1 : -0.6);
        ctx.beginPath();
        ctx.moveTo(cx + s * 44, cy - 16 - grow);
        ctx.bezierCurveTo(cx + s * 53 + lx, cy + 40, cx + s * 52 + lx, cy + 96, cx + s * 45 + lx, cy + 142 + grow);
        ctx.lineTo(cx + s * 33 + lx, cy + 140 + grow);
        ctx.bezierCurveTo(cx + s * 38, cy + 86, cx + s * 38, cy + 34, cx + s * 37, cy - 10 - grow);
        ctx.closePath();
        ctx.fill();
      }
    };

    switch (H.cut) {
      case 'sideswept': {
        // 斜刘海发簇（暗层 + 亮层，流向一致）
        const tips = [[-38, -24], [-20, -19], [-2, -23], [16, -20], [34, -26]];
        for (const [tx, ty] of tips) strand(cx + tx - 8, cx + tx + 10, cx + tx + 4, cy + ty + 4, H.shade);
        for (const [tx, ty] of tips) strand(cx + tx - 10, cx + tx + 8, cx + tx, cy + ty, H.color);
        // 垂胸长簇
        sideLock(H.shade, 4);
        sideLock(H.color, 0);
        break;
      }
      case 'fringe': {
        // 齐刘海：平刘海 + 锯齿底缘
        const bang = (col, dy) => {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.moveTo(cx - 45, cy - 8 + dy);
          ctx.bezierCurveTo(cx - 47, cy - 44, cx - 26, cy - 58, cx, cy - 58);
          ctx.bezierCurveTo(cx + 26, cy - 58, cx + 47, cy - 44, cx + 45, cy - 10 + dy);
          let x = cx + 45;
          const n = 7;
          for (let i = 0; i < n; i++) {
            const x2 = cx + 45 - ((i + 1) * 90) / n;
            ctx.lineTo((x + x2) / 2, cy - 26 + dy + (i % 2) * 5);
            ctx.lineTo(x2, cy - 32 + dy + (i % 2) * 2);
            x = x2;
          }
          ctx.closePath();
          ctx.fill();
        };
        bang(H.shade, 5);
        bang(H.color, 0);
        // 短侧发
        ctx.fillStyle = H.color;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 44, cy - 14);
          ctx.bezierCurveTo(cx + s * 54, cy + 20, cx + s * 52, cy + 50, cx + s * 46, cy + 78);
          ctx.quadraticCurveTo(cx + s * 40, cy + 88, cx + s * 32, cy + 80);
          ctx.bezierCurveTo(cx + s * 38, cy + 50, cx + s * 38, cy + 20, cx + s * 37, cy - 8);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case 'centerpart': {
        // 中分：两侧弧扫
        const half = (s, col, dy) => {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.moveTo(cx + s * 2, cy - 57);
          ctx.bezierCurveTo(cx + s * 20, cy - 57, cx + s * 40, cy - 46, cx + s * 45, cy - 6 + dy);
          ctx.bezierCurveTo(cx + s * 47, cy + 4 + dy, cx + s * 41, cy + 8 + dy, cx + s * 37, cy - 2 + dy);
          ctx.bezierCurveTo(cx + s * 32, cy - 16, cx + s * 20, cy - 26, cx + s * 6, cy - 24);
          ctx.closePath();
          ctx.fill();
        };
        for (const s of [-1, 1]) half(s, H.shade, 4);
        for (const s of [-1, 1]) half(s, H.color, 0);
        // 发丝流线
        ctx.strokeStyle = H.shade;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 8, cy - 50);
          ctx.quadraticCurveTo(cx + s * 30, cy - 38, cx + s * 40, cy - 10);
          ctx.stroke();
        }
        // 贴脸侧发
        ctx.fillStyle = H.color;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 42, cy - 12);
          ctx.bezierCurveTo(cx + s * 50, cy + 20, cx + s * 48, cy + 52, cx + s * 44, cy + 78);
          ctx.quadraticCurveTo(cx + s * 36, cy + 88, cx + s * 30, cy + 80);
          ctx.bezierCurveTo(cx + s * 36, cy + 50, cx + s * 35, cy + 18, cx + s * 34, cy - 6);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case 'swept': {
        // 背梳短发：额头可见
        ctx.fillStyle = H.color;
        ctx.beginPath();
        ctx.moveTo(cx - 43, cy - 18);
        ctx.bezierCurveTo(cx - 46, cy - 46, cx - 24, cy - 62, cx + 2, cy - 60);
        ctx.bezierCurveTo(cx + 28, cy - 62, cx + 47, cy - 44, cx + 43, cy - 16);
        ctx.bezierCurveTo(cx + 36, cy - 26, cx + 24, cy - 34, cx + 8, cy - 32);
        ctx.bezierCurveTo(cx - 8, cy - 30, cx - 22, cy - 34, cx - 30, cy - 24);
        ctx.bezierCurveTo(cx - 36, cy - 20, cx - 40, cy - 18, cx - 43, cy - 18);
        ctx.closePath();
        ctx.fill();
        // 鬓角
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 43, cy - 16);
          ctx.lineTo(cx + s * 40, cy + 16);
          ctx.lineTo(cx + s * 35, cy + 14);
          ctx.lineTo(cx + s * 37, cy - 14);
          ctx.closePath();
          ctx.fill();
        }
        // 背梳发丝流线
        ctx.strokeStyle = H.shade;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 22, cy - 42);
        ctx.quadraticCurveTo(cx - 2, cy - 52, cx + 20, cy - 44);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 26, cy - 34);
        ctx.quadraticCurveTo(cx - 4, cy - 44, cx + 24, cy - 36);
        ctx.stroke();
        break;
      }
      case 'messy': {
        // 乱翘短发
        ctx.fillStyle = H.color;
        ctx.beginPath();
        ctx.moveTo(cx - 44, cy - 10);
        ctx.lineTo(cx - 40, cy - 34);
        ctx.lineTo(cx - 32, cy - 24);
        ctx.lineTo(cx - 26, cy - 52);
        ctx.lineTo(cx - 16, cy - 34);
        ctx.lineTo(cx - 6, cy - 58);
        ctx.lineTo(cx + 4, cy - 38);
        ctx.lineTo(cx + 14, cy - 54);
        ctx.lineTo(cx + 22, cy - 32);
        ctx.lineTo(cx + 32, cy - 46);
        ctx.lineTo(cx + 36, cy - 26);
        ctx.lineTo(cx + 44, cy - 32);
        ctx.lineTo(cx + 44, cy - 8);
        ctx.bezierCurveTo(cx + 38, cy + 2, cx + 28, cy - 2, cx + 22, cy - 6);
        ctx.bezierCurveTo(cx + 8, cy - 12, cx - 12, cy - 10, cx - 26, cy - 2);
        ctx.bezierCurveTo(cx - 34, cy + 2, cx - 40, cy - 2, cx - 44, cy - 10);
        ctx.closePath();
        ctx.fill();
        // 亮色挑染
        ctx.strokeStyle = H.shine;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 36);
        ctx.lineTo(cx - 13, cy - 48);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 2, cy - 40);
        ctx.lineTo(cx + 6, cy - 52);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 20, cy - 38);
        ctx.lineTo(cx + 25, cy - 46);
        ctx.stroke();
        ctx.globalAlpha = 1;
        // 鬓角
        ctx.fillStyle = H.color;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 43, cy - 12);
          ctx.lineTo(cx + s * 41, cy + 14);
          ctx.lineTo(cx + s * 35, cy + 12);
          ctx.lineTo(cx + s * 38, cy - 10);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case 'receding': {
        // 后梳稀疏：高发际线
        ctx.fillStyle = H.color;
        ctx.beginPath();
        ctx.moveTo(cx - 42, cy - 14);
        ctx.bezierCurveTo(cx - 40, cy - 40, cx - 20, cy - 54, cx + 2, cy - 52);
        ctx.bezierCurveTo(cx + 26, cy - 52, cx + 42, cy - 38, cx + 42, cy - 12);
        ctx.bezierCurveTo(cx + 34, cy - 26, cx + 18, cy - 34, cx - 2, cy - 32);
        ctx.bezierCurveTo(cx - 20, cy - 32, cx - 34, cy - 24, cx - 42, cy - 14);
        ctx.closePath();
        ctx.fill();
        // 两侧厚发
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 43, cy - 14);
          ctx.quadraticCurveTo(cx + s * 48, cy + 8, cx + s * 44, cy + 22);
          ctx.lineTo(cx + s * 36, cy + 20);
          ctx.quadraticCurveTo(cx + s * 40, cy + 2, cx + s * 38, cy - 12);
          ctx.closePath();
          ctx.fill();
        }
        // 后梳纹理
        ctx.strokeStyle = H.shade;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy - 44);
        ctx.quadraticCurveTo(cx + 4, cy - 50, cx + 20, cy - 42);
        ctx.stroke();
        break;
      }
      case 'balding': {
        // 顶部几缕稀疏白发
        ctx.strokeStyle = H.color;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        for (let i = -2; i <= 2; i++) {
          if (i === 0) continue;
          ctx.beginPath();
          ctx.moveTo(cx + i * 10, cy - 46 + Math.abs(i) * 3);
          ctx.quadraticCurveTo(cx + i * 12, cy - 54, cx + i * 14, cy - 48 + Math.abs(i) * 2);
          ctx.stroke();
        }
        break;
      }
      case 'capshort': {
        // 帽下发角：仅两侧短鬓
        ctx.fillStyle = H.color;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 43, cy - 14);
          ctx.lineTo(cx + s * 41, cy + 14);
          ctx.lineTo(cx + s * 34, cy + 12);
          ctx.lineTo(cx + s * 37, cy - 12);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
    }

    // 天使环高光（弧形亮带）
    if (H.cut !== 'balding' && H.cut !== 'capshort') {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = H.shine;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 52, -2.45, -0.7);
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 4, 50, -2.3, -0.85);
      ctx.stroke();
      ctx.restore();
    }

    // 呆毛（anna / valentina）
    if (cfg.ahoge) {
      const tip = sway * 1.5;
      ctx.fillStyle = H.color;
      ctx.beginPath();
      ctx.moveTo(cx - 2, cy - 55);
      ctx.quadraticCurveTo(cx - 10 + tip, cy - 78, cx - 24 + tip, cy - 74);
      ctx.quadraticCurveTo(cx - 12 + tip, cy - 70, cx - 8, cy - 64);
      ctx.quadraticCurveTo(cx - 5, cy - 59, cx + 4, cy - 55);
      ctx.closePath();
      ctx.fill();
    }

    // 发缘线稿（rim）
    if (H.cut !== 'balding' && H.cut !== 'capshort') {
      ctx.strokeStyle = this.portraitAlpha(hairLine, 0.5);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy - 8, 47, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
    }
  },

  // —— 躯干与服装（base=肩身，front=领口配饰） ——
  drawPortraitTorso(ctx, cfg, cx, phase, t) {
    const O = cfg.outfit;
    if (!O) return;

    if (phase === 'base') {
      // 肩身路径
      const torsoPath = () => {
        ctx.beginPath();
        ctx.moveTo(26, 292);
        ctx.bezierCurveTo(28, 240, 38, 200, 62, 186);
        ctx.bezierCurveTo(78, 176, 92, 170, 110, 170);
        ctx.bezierCurveTo(128, 170, 142, 176, 158, 186);
        ctx.bezierCurveTo(182, 200, 192, 240, 194, 292);
        ctx.closePath();
      };
      // 平涂主色（赛璐璐）
      torsoPath();
      ctx.fillStyle = O.color;
      ctx.fill();
      // 硬边阴影（右下）+ 领口投影
      ctx.save();
      torsoPath();
      ctx.clip();
      ctx.fillStyle = O.shade;
      ctx.beginPath();
      ctx.moveTo(150, 170);
      ctx.lineTo(196, 170);
      ctx.lineTo(196, 292);
      ctx.lineTo(118, 292);
      ctx.quadraticCurveTo(142, 232, 150, 170);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(10, 8, 16, 0.16)';
      ctx.fillRect(26, 170, 168, 9);
      ctx.restore();
      // 线稿
      torsoPath();
      ctx.strokeStyle = this.portraitMix(O.shade, '#1a1420', 0.5);
      ctx.lineWidth = 2;
      ctx.stroke();

      // 针织纹理
      if (O.knit) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const yy = 216 + i * 15;
          ctx.beginPath();
          ctx.moveTo(48 + i * 2, yy);
          ctx.quadraticCurveTo(110, yy - 6, 172 - i * 2, yy);
          ctx.stroke();
        }
      }

      // 肩章（军装）
      if (O.boards) {
        for (const s of [-1, 1]) {
          ctx.save();
          ctx.translate(cx + s * 54, 186);
          ctx.rotate(s * 0.45);
          ctx.fillStyle = O.boards;
          this.portraitRoundRect(ctx, -7, -22, 14, 34, 5);
          ctx.fill();
          ctx.strokeStyle = 'rgba(60, 40, 10, 0.5)';
          ctx.lineWidth = 1;
          for (let i = 1; i <= 2; i++) {
            ctx.beginPath();
            ctx.moveTo(-7, -22 + i * 10);
            ctx.lineTo(7, -22 + i * 10);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 背带（工装）
      if (O.suspenders) {
        ctx.fillStyle = O.suspenders;
        ctx.beginPath();
        ctx.moveTo(84, 172);
        ctx.lineTo(94, 168);
        ctx.lineTo(88, 292);
        ctx.lineTo(74, 292);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(126, 168);
        ctx.lineTo(136, 172);
        ctx.lineTo(146, 292);
        ctx.lineTo(132, 292);
        ctx.closePath();
        ctx.fill();
      }
      return;
    }

    // ===== 前层：领口 =====
    switch (O.neck) {
      case 'round': {
        // 彼得潘圆领
        ctx.fillStyle = O.collarColor || '#f0ece2';
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(cx + s * 12, 178, 13, 11, s * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'vneck': {
        // V 领 + 白色内搭
        ctx.fillStyle = 'rgba(232, 228, 218, 0.92)';
        ctx.beginPath();
        ctx.moveTo(cx - 22, 172);
        ctx.lineTo(cx, 202);
        ctx.lineTo(cx + 22, 172);
        ctx.quadraticCurveTo(cx, 182, cx - 22, 172);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 22, 172);
        ctx.lineTo(cx, 202);
        ctx.lineTo(cx + 22, 172);
        ctx.stroke();
        break;
      }
      case 'lapels': {
        // 衬衫 V 区
        ctx.fillStyle = O.shirt || '#e8e4da';
        ctx.beginPath();
        ctx.moveTo(cx - 12, 170);
        ctx.lineTo(cx + 12, 170);
        ctx.lineTo(cx + 4, 204);
        ctx.lineTo(cx, 210);
        ctx.lineTo(cx - 4, 204);
        ctx.closePath();
        ctx.fill();
        // 领带
        if (O.tie) {
          ctx.fillStyle = O.tie;
          ctx.beginPath();
          ctx.moveTo(cx - 5, 178);
          ctx.lineTo(cx + 5, 178);
          ctx.lineTo(cx + 3, 196);
          ctx.lineTo(cx, 212);
          ctx.lineTo(cx - 3, 196);
          ctx.closePath();
          ctx.fill();
        }
        // 翻领
        ctx.fillStyle = O.lapel || O.shade;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 3, 170);
          ctx.lineTo(cx + s * 30, 176);
          ctx.bezierCurveTo(cx + s * 42, 196, cx + s * 36, 220, cx + s * 24, 240);
          ctx.lineTo(cx + s * 12, 200);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }
      case 'stand': {
        // 立领（军装——旧式）
        ctx.fillStyle = O.shade;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 5, 168);
          ctx.lineTo(cx + s * 26, 170);
          ctx.lineTo(cx + s * 30, 188);
          ctx.lineTo(cx + s * 12, 190);
          ctx.closePath();
          ctx.fill();
        }
        ctx.strokeStyle = O.trim || '#d8b45a';
        ctx.lineWidth = 2;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 5, 168);
          ctx.lineTo(cx + s * 26, 170);
          ctx.lineTo(cx + s * 30, 188);
          ctx.stroke();
        }
        // 门襟线
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + 12, 192);
        ctx.lineTo(cx + 12, 292);
        ctx.stroke();
        break;
      }
      case 'platie': {
        // 布拉吉：小圆领+衬衫式前襟扣（苏联连衣裙 платье）
        ctx.fillStyle = O.collarColor || '#f2eee4';
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(cx + s * 11, 170, 11, 9, s * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        // 前襟扣线（从领下延伸）
        ctx.strokeStyle = O.shade;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, 178);
        ctx.lineTo(cx, 220);
        ctx.stroke();
        // 领尖交汇
        ctx.strokeStyle = O.shade;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 5, 172);
        ctx.lineTo(cx + 5, 172);
        ctx.stroke();
        // 纽扣（小）
        ctx.fillStyle = O.beltBuckle || '#d8b45a';
        for (let i = 0; i < 2; i++) {
          ctx.beginPath();
          ctx.arc(cx, 188 + i * 14, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'open': {
        // 开领军装：衬衫 V 区 + 翻领 + 领带（M58/M69 风格）
        ctx.fillStyle = O.shirt || '#e8e2d4';
        ctx.beginPath();
        ctx.moveTo(cx - 14, 168);
        ctx.lineTo(cx + 14, 168);
        ctx.lineTo(cx + 5, 210);
        ctx.lineTo(cx, 216);
        ctx.lineTo(cx - 5, 210);
        ctx.closePath();
        ctx.fill();
        // 领带
        if (O.tie) {
          ctx.fillStyle = O.tie;
          ctx.beginPath();
          ctx.moveTo(cx - 4, 176);
          ctx.lineTo(cx + 4, 176);
          ctx.lineTo(cx + 2.5, 198);
          ctx.lineTo(cx, 220);
          ctx.lineTo(cx - 2.5, 198);
          ctx.closePath();
          ctx.fill();
        }
        // 翻领
        ctx.fillStyle = O.shade;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 3, 168);
          ctx.lineTo(cx + s * 28, 174);
          ctx.bezierCurveTo(cx + s * 40, 198, cx + s * 34, 224, cx + s * 22, 248);
          ctx.lineTo(cx + s * 14, 204);
          ctx.closePath();
          ctx.fill();
        }
        // 翻领边线
        ctx.strokeStyle = this.portraitMix(O.shade, '#1a1420', 0.3);
        ctx.lineWidth = 1.2;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(cx + s * 3, 168);
          ctx.lineTo(cx + s * 28, 174);
          ctx.bezierCurveTo(cx + s * 40, 198, cx + s * 34, 224, cx + s * 22, 248);
          ctx.stroke();
        }
        break;
      }
      case 'scarf': {
        // 环颈围巾
        const S = O.scarf;
        const sw = Math.sin(t / 1200 + cfg.seed) * 2;
        ctx.fillStyle = S;
        ctx.beginPath();
        ctx.moveTo(cx - 21, 166);
        ctx.quadraticCurveTo(cx, 178, cx + 21, 166);
        ctx.quadraticCurveTo(cx + 25, 184, cx + 15, 192);
        ctx.quadraticCurveTo(cx, 200, cx - 15, 192);
        ctx.quadraticCurveTo(cx - 25, 184, cx - 21, 166);
        ctx.closePath();
        ctx.fill();
        // 垂下的围巾尾
        ctx.beginPath();
        ctx.moveTo(cx - 4, 190);
        ctx.quadraticCurveTo(cx - 15 + sw, 226, cx - 9 + sw, 258);
        ctx.lineTo(cx + 3 + sw, 256);
        ctx.quadraticCurveTo(cx - 1 + sw, 226, cx + 9, 192);
        ctx.closePath();
        ctx.fill();
        // 流苏
        ctx.strokeStyle = S;
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(cx - 10 + i * 4 + sw, 257);
          ctx.lineTo(cx - 11 + i * 4 + sw, 266);
          ctx.stroke();
        }
        // 围巾高光
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 16, 172);
        ctx.quadraticCurveTo(cx, 182, cx + 16, 172);
        ctx.stroke();
        break;
      }
    }

    // ===== 前层：配饰 =====
    // NKVD 红色门襟镶边
    if (O.piping) {
      ctx.strokeStyle = '#a83232';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 2, 192);
      ctx.lineTo(cx - 2, 292);
      ctx.stroke();
    }
    // 纽扣
    if (O.buttons) {
      ctx.fillStyle = '#d8b45a';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(cx + 14, 216 + i * 24, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // 勋章
    if (O.medals) {
      const mx = cx + 34, my = 206;
      const ribbons = ['#8b2020', '#2a4a6a', '#6a5a20'];
      const metals = ['#d8b45a', '#b8c4d0', '#c8946a'];
      for (let i = 0; i < O.medals; i++) {
        const x = mx + (i % 2) * 15, y = my + Math.floor(i / 2) * 22;
        ctx.fillStyle = ribbons[i % 3];
        ctx.fillRect(x - 5, y - 4, 10, 10);
        ctx.fillStyle = metals[i % 3];
        ctx.beginPath();
        ctx.arc(x, y + 9, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // 胸前红星（政委）
    if (O.starPin) {
      this.drawPortraitStar(ctx, cx - 28, 202, 7, '#c03030');
      this.drawPortraitStar(ctx, cx - 28, 202, 3.2, '#e87070');
    }
    // 珍珠项链
    if (O.necklace === 'pearl') {
      ctx.fillStyle = '#e8e2d4';
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx + i * 6.5, 180 + i * i * 1.1, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // 蝴蝶结（裙领）
    if (O.bow) {
      ctx.fillStyle = O.bow;
      ctx.beginPath();
      ctx.moveTo(cx - 2, 178);
      ctx.lineTo(cx - 16, 172);
      ctx.lineTo(cx - 15, 184);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 2, 178);
      ctx.lineTo(cx + 16, 172);
      ctx.lineTo(cx + 15, 184);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, 178, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // 胸针
    if (O.brooch) {
      ctx.fillStyle = '#d8b45a';
      ctx.beginPath();
      ctx.arc(cx - 14, 192, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6a3050';
      ctx.beginPath();
      ctx.arc(cx - 14, 192, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // 别针
    if (O.pin) {
      this.drawPortraitStar(ctx, cx - 16, 196, 5, '#8fcabb');
    }
    // 腰带（布拉吉/连衣裙）
    if (O.belt) {
      ctx.fillStyle = O.belt;
      ctx.fillRect(44, 248, 132, 8);
      // 腰带扣
      if (O.beltBuckle) {
        ctx.fillStyle = O.beltBuckle;
        ctx.fillRect(cx - 6, 245, 12, 14);
        ctx.strokeStyle = this.portraitMix(O.beltBuckle, '#1a1420', 0.3);
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 6, 245, 12, 14);
        // 扣中心
        ctx.fillStyle = this.portraitMix(O.beltBuckle, '#1a1420', 0.3);
        ctx.fillRect(cx - 2, 249, 4, 6);
      }
      // 腰带纹理
      ctx.strokeStyle = this.portraitMix(O.belt, '#000000', 0.2);
      ctx.lineWidth = 0.8;
      for (let i = 48; i < 172; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 250);
        ctx.lineTo(i + 4, 254);
        ctx.stroke();
      }
    }
    // 针织开衫（罩在连衣裙上）
    if (O.cardigan) {
      ctx.save();
      // 开衫主体（比服装稍大、稍深，前襟敞开露出内搭）
      const card = () => {
        ctx.beginPath();
        ctx.moveTo(40, 178);
        ctx.bezierCurveTo(32, 196, 28, 220, 32, 292);
        ctx.lineTo(82, 292);
        ctx.lineTo(88, 220);
        ctx.lineTo(76, 186);
        ctx.closePath();
      };
      ctx.fillStyle = O.cardigan;
      card(); ctx.fill();
      ctx.fillStyle = this.portraitMix(O.cardigan, '#1a1420', 0.35);
      const card2 = () => {
        ctx.beginPath();
        ctx.moveTo(180, 178);
        ctx.bezierCurveTo(188, 196, 192, 220, 188, 292);
        ctx.lineTo(138, 292);
        ctx.lineTo(132, 220);
        ctx.lineTo(144, 186);
        ctx.closePath();
      };
      card2(); ctx.fill();
      // 开衫针织纹理
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 6; i++) {
        const yy = 192 + i * 16;
        for (let x = 42; x < 82; x += 3) {
          ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + 3, yy); ctx.stroke();
        }
        for (let x = 136; x < 178; x += 3) {
          ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + 3, yy); ctx.stroke();
        }
      }
      // 开衫前襟边线
      ctx.strokeStyle = this.portraitMix(O.cardigan, '#1a1420', 0.5);
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(76, 186); ctx.lineTo(88, 292); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(144, 186); ctx.lineTo(132, 292); ctx.stroke();
      ctx.restore();
    }
  },

  // —— 头部配饰（眼镜/帽子/耳环/发饰） ——
  drawPortraitAccessories(ctx, cfg, cx, cy, t) {
    const A = cfg.acc || {};
    // 圆框眼镜
    if (A.glasses === 'round') {
      ctx.strokeStyle = 'rgba(40, 36, 44, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 16, cy - 5, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 16, cy - 5, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 8);
      ctx.quadraticCurveTo(cx, cy - 11, cx + 5, cy - 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 27, cy - 6);
      ctx.lineTo(cx - 38, cy - 11);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 27, cy - 6);
      ctx.lineTo(cx + 38, cy - 11);
      ctx.stroke();
      // 镜片反光
      ctx.strokeStyle = 'rgba(200, 220, 240, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx - 16, cy - 5, 8.5, -2.4, -1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 16, cy - 5, 8.5, -2.4, -1.5);
      ctx.stroke();
    }
    // 夹鼻眼镜
    if (A.glasses === 'pince') {
      ctx.strokeStyle = 'rgba(30, 28, 34, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 13, cy - 3, 7.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 13, cy - 3, 7.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 5);
      ctx.lineTo(cx + 6, cy - 5);
      ctx.stroke();
    }
    // 大檐帽
    if (A.cap) {
      this.drawPortraitCap(ctx, cx, cy, A.capBand, A.capTop);
    }
    // 珍珠耳环
    if (A.earrings === 'pearl') {
      ctx.fillStyle = '#efe8da';
      ctx.beginPath();
      ctx.arc(cx - 37, cy + 8, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 37, cy + 8, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    // 发饰玫瑰
    if (A.rose) {
      this.drawPortraitRose(ctx, cx + 30, cy - 30);
    }
    // 星形发卡
    if (A.clip) {
      this.drawPortraitStar(ctx, cx - 27, cy - 24, 5, A.clip);
    }
  },

  // —— 大檐帽（M58 NKVD：深蓝帽顶+锈红帽带+红星） ——
  drawPortraitCap(ctx, cx, cy, bandColor, topColor) {
    // 帽冠（深蓝/藏青——NKVD 标志色）
    ctx.fillStyle = topColor || '#5a6a88';
    ctx.beginPath();
    ctx.moveTo(cx - 38, cy - 28);
    ctx.bezierCurveTo(cx - 37, cy - 60, cx + 37, cy - 60, cx + 38, cy - 28);
    ctx.closePath();
    ctx.fill();
    // 帽墙（锈红/nnettle——MVD 标志色）
    ctx.fillStyle = bandColor || '#7a1e28';
    ctx.fillRect(cx - 40, cy - 32, 80, 13);
    ctx.strokeStyle = 'rgba(216, 180, 90, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 40, cy - 32, 80, 13);
    // 帽徽红星
    this.drawPortraitStar(ctx, cx, cy - 25.5, 5.5, '#d84040');
    // 帽檐
    ctx.fillStyle = '#151a2c';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 19, 45, 6, 0, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy - 19);
    ctx.quadraticCurveTo(cx, cy - 10, cx + 45, cy - 19);
    ctx.quadraticCurveTo(cx, cy - 15, cx - 45, cy - 19);
    ctx.closePath();
    ctx.fill();
  },

  // —— 发饰玫瑰 ——
  drawPortraitRose(ctx, x, y) {
    ctx.fillStyle = '#3a5a3a';
    ctx.beginPath();
    ctx.ellipse(x - 7, y + 4, 6, 3, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a02838';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c03848';
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d85868';
    ctx.beginPath();
    ctx.arc(x - 2, y - 2, 2.8, 0, Math.PI * 2);
    ctx.fill();
  },

  // —— 五角星 ——
  drawPortraitStar(ctx, x, y, r, color) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      const b = a + Math.PI / 5;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      ctx.lineTo(x + Math.cos(b) * r * 0.45, y + Math.sin(b) * r * 0.45);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  },

  // —— 圆角矩形 ——
  portraitRoundRect(ctx, x, y, w, h, r) {
    const rr = typeof r === 'number' ? { tl: r, tr: r, br: r, bl: r } : r;
    ctx.beginPath();
    ctx.moveTo(x + rr.tl, y);
    ctx.lineTo(x + w - rr.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr.tr);
    ctx.lineTo(x + w, y + h - rr.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr.br, y + h);
    ctx.lineTo(x + rr.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr.bl);
    ctx.lineTo(x, y + rr.tl);
    ctx.quadraticCurveTo(x, y, x + rr.tl, y);
    ctx.closePath();
  },

  // —— 颜色透明度 ——
  portraitAlpha(color, a) {
    if (typeof color !== 'string' || color[0] !== '#') return color;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  },

  // —— 两个 hex 颜色线性混合 ——
  portraitMix(c1, c2, t) {
    if (typeof c1 !== 'string' || typeof c2 !== 'string' || c1[0] !== '#' || c2[0] !== '#') return c1;
    const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const a = p(c1), b = p(c2);
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
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
