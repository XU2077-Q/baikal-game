/* =========================================================
 * 贝加尔湖畔 · 战略地图系统
 * =======================================================*/

const Strategy = {
  active: false,
  canvas: null,
  ctx: null,
  selectedStronghold: null,
  hoveredStronghold: null,

  init() {
    this.canvas = document.getElementById('map-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.canvas.addEventListener('click', (e) => this.onClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
  },

  open() {
    this.active = true;
    document.getElementById('strategic-map').classList.remove('hidden');
    this.updateResourceDisplay();
    this.render();
  },

  close() {
    this.active = false;
    document.getElementById('strategic-map').classList.add('hidden');
  },

  updateResourceDisplay() {
    const res = Game.state.resources;
    document.getElementById('res-troops').textContent = res.troops;
    document.getElementById('res-supplies').textContent = res.supplies;
    document.getElementById('res-morale').textContent = res.morale + '%';
  },

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const stronghold = this.getStrongholdAt(x, y);
    if (stronghold) {
      this.selectedStronghold = stronghold;
      this.showStrongholdInfo(stronghold);
    }
  },

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const stronghold = this.getStrongholdAt(x, y);
    this.hoveredStronghold = stronghold;
    this.render();

    if (stronghold) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  },

  getStrongholdAt(x, y) {
    for (const id in Game.state.strongholds) {
      const s = Game.state.strongholds[id];
      const dx = x - s.x;
      const dy = y - s.y;
      if (dx * dx + dy * dy < 20 * 20) {
        return s;
      }
    }
    return null;
  },

  showStrongholdInfo(s) {
    const faction = Factions[s.owner] || { name: '未知', color: '#888' };
    const tooltip = document.getElementById('map-tooltip');
    tooltip.innerHTML = `
      <b style="color:${faction.color}">${s.name}</b> · ${faction.name}<br>
      <span style="color:#8a9ab0">
        驻军：${s.garrison} · 补给：${s.supplies} · 士气：${s.morale}%<br>
        ${s.desc}
      </span>
      ${s.owner !== 'red' && this.canAttack(s) ?
        `<br><button class="pixel-btn small primary" onclick="Strategy.attackStronghold('${s.id}')">⚔ 进攻</button>` : ''}
      ${s.owner === 'red' ?
        `<br><button class="pixel-btn small" onclick="Strategy.reinforce('${s.id}')">📦 增兵</button>` : ''}
    `;
  },

  canAttack(stronghold) {
    // 判断是否与己方领地相邻
    const redIds = Object.keys(Game.state.strongholds).filter(
      id => Game.state.strongholds[id].owner === 'red'
    );
    for (const rid of redIds) {
      const r = Game.state.strongholds[rid];
      const dist = Math.sqrt((r.x - stronghold.x) ** 2 + (r.y - stronghold.y) ** 2);
      if (dist < 200) return true;
    }
    return false;
  },

  attackStronghold(id) {
    const target = Game.state.strongholds[id];
    if (!target || target.owner === 'red') return;

    if (Game.state.resources.troops < 100) {
      UI.toast('兵力不足！至少需要100兵力才能进攻');
      return;
    }
    if (Game.state.resources.supplies < 50) {
      UI.toast('补给不足！进攻需要至少50补给');
      return;
    }

    UI.toast(`向 ${target.name} 发起进攻！`);
    Game.state.resources.supplies = Math.max(0, Game.state.resources.supplies - 50);

    // 战斗计算：士气影响攻防，俘虏可改编
    const attackPower = Game.state.resources.troops * (Game.state.resources.morale / 100) * 0.9;
    const defensePower = target.garrison * (target.morale / 100);

    const attackerLoss = Math.floor(defensePower * 0.25);
    const defenderLoss = Math.floor(attackPower * 0.5);

    const preGarrison = target.garrison;
    target.garrison = Math.max(0, target.garrison - defenderLoss);
    Game.state.resources.troops = Math.max(0, Game.state.resources.troops - attackerLoss);

    setTimeout(() => {
      if (target.garrison <= 0) {
        target.owner = 'red';
        // 俘虏改编：敌军四成加入红军
        const POWs = Math.floor(preGarrison * 0.4);
        target.garrison = POWs;
        Game.state.resources.troops += POWs;
        target.morale = Math.max(60, Game.state.resources.morale - 10);
        Game.state.resources.supplies += Math.floor(target.supplies * 0.5);
        Game.state.resources.territory++;
        UI.toast(`🎉 攻占 ${target.name}！${POWs} 名俘虏加入红军！`);

        // 胜利条件：收复莫斯科
        if (target.id === 'moscow') {
          setTimeout(() => this.showVictory(), 1500);
        }
      } else {
        UI.toast(`进攻受阻，敌军剩余 ${target.garrison} 人。可增兵后再攻！`);
      }
      this.updateResourceDisplay();
      this.showStrongholdInfo(target);
      this.render();
    }, 1000);
  },

  reinforce(id) {
    const target = Game.state.strongholds[id];
    if (!target || target.owner !== 'red') return;

    const amount = Math.min(200, Game.state.resources.troops);
    if (amount <= 0) {
      UI.toast('没有可调动的兵力');
      return;
    }

    Game.state.resources.troops -= amount;
    target.garrison += amount;
    Game.state.resources.supplies = Math.max(0, Game.state.resources.supplies - 10);
    UI.toast(`向 ${target.name} 增兵 ${amount} 人`);
    this.updateResourceDisplay();
    this.showStrongholdInfo(target);
    this.render();
  },

  showVictory() {
    UI.toast('🏆 萨布林重新统一了俄罗斯！苏维埃万岁！');
  },

  render() {
    if (!this.active) return;

    const ctx = this.ctx;
    const canvas = this.canvas;

    // 背景 - 西伯利亚地图（简化）
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#1a2535');
    bgGrad.addColorStop(1, '#0d1520');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 贝加尔湖
    ctx.fillStyle = '#2a4a7a';
    ctx.beginPath();
    ctx.ellipse(450, 300, 80, 140, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 湖面冰裂纹
    ctx.strokeStyle = 'rgba(150, 180, 220, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(420 + i * 10, 200);
      ctx.bezierCurveTo(430 + i * 12, 280, 410 + i * 8, 360, 440 + i * 10, 420);
      ctx.stroke();
    }

    // 陆地纹理
    ctx.fillStyle = 'rgba(50, 65, 85, 0.4)';
    for (let i = 0; i < 100; i++) {
      const x = (i * 73.7) % canvas.width;
      const y = (i * 41.3) % canvas.height;
      // 避开湖
      const dx = x - 450, dy = y - 300;
      if ((dx * dx) / 6400 + (dy * dy) / 19600 < 1) continue;
      ctx.fillRect(x, y, 3, 3);
    }

    // 山脉（简化像素风）
    ctx.fillStyle = '#3a4a5a';
    this.drawMountain(ctx, 100, 250, 60);
    this.drawMountain(ctx, 180, 230, 80);
    this.drawMountain(ctx, 700, 200, 70);
    this.drawMountain(ctx, 780, 250, 55);
    this.drawMountain(ctx, 550, 100, 65);

    // 积雪山顶
    ctx.fillStyle = '#d0dce8';
    this.drawMountainPeak(ctx, 100, 250, 60);
    this.drawMountainPeak(ctx, 180, 230, 80);
    this.drawMountainPeak(ctx, 700, 200, 70);
    this.drawMountainPeak(ctx, 780, 250, 55);
    this.drawMountainPeak(ctx, 550, 100, 65);

    // 连接路线
    ctx.strokeStyle = 'rgba(150, 170, 200, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const redIds = Object.keys(Game.state.strongholds).filter(
      id => Game.state.strongholds[id].owner === 'red'
    );
    for (const rid of redIds) {
      const r = Game.state.strongholds[rid];
      for (const eid in Game.state.strongholds) {
        if (eid === rid) continue;
        const e = Game.state.strongholds[eid];
        const dist = Math.sqrt((r.x - e.x) ** 2 + (r.y - e.y) ** 2);
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(e.x, e.y);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);

    // 据点
    for (const id in Game.state.strongholds) {
      const s = Game.state.strongholds[id];
      this.drawStronghold(ctx, s);
    }

    // 悬停高亮
    if (this.hoveredStronghold) {
      const s = this.hoveredStronghold;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 选中高亮
    if (this.selectedStronghold) {
      const s = this.selectedStronghold;
      const pulse = 2 + Math.sin(Date.now() / 300) * 2;
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 24 + pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    requestAnimationFrame(() => this.render());
  },

  drawMountain(ctx, x, y, w) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y + 40);
    ctx.lineTo(x, y - w / 3);
    ctx.lineTo(x + w / 2, y + 40);
    ctx.closePath();
    ctx.fill();
  },

  drawMountainPeak(ctx, x, y, w) {
    const peakY = y - w / 3;
    ctx.beginPath();
    ctx.moveTo(x - w / 6, peakY + 15);
    ctx.lineTo(x, peakY);
    ctx.lineTo(x + w / 6, peakY + 15);
    ctx.closePath();
    ctx.fill();
  },

  drawStronghold(ctx, s) {
    const faction = Factions[s.owner] || { color: '#888', light: '#aaa' };

    // 外圆（所属势力色）
    ctx.fillStyle = faction.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 16, 0, Math.PI * 2);
    ctx.fill();

    // 内圆
    ctx.fillStyle = faction.light;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // 中心图标（红星/铁十字等）
    ctx.fillStyle = '#fff';
    if (s.owner === 'red') {
      // 红星
      this.drawStar(ctx, s.x, s.y, 5, 8, 4);
    } else if (s.owner === 'nkvd') {
      // NKVD徽章（紫色方块）
      ctx.fillStyle = '#a060c0';
      ctx.fillRect(s.x - 5, s.y - 5, 10, 10);
    } else if (s.owner === 'japan') {
      // 日章
      ctx.fillStyle = '#c03030';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.owner === 'germany') {
      // 铁十字
      ctx.fillStyle = '#d0d0d0';
      ctx.fillRect(s.x - 2, s.y - 7, 4, 14);
      ctx.fillRect(s.x - 7, s.y - 2, 14, 4);
    } else if (s.owner === 'black') {
      // 黑旗
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(s.x - 6, s.y - 6, 12, 12);
    } else {
      // 封建
      ctx.fillStyle = '#e8c870';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - 7);
      ctx.lineTo(s.x + 6, s.y + 5);
      ctx.lineTo(s.x - 6, s.y + 5);
      ctx.closePath();
      ctx.fill();
    }

    // 城市名
    ctx.fillStyle = '#d0d8e8';
    ctx.font = '12px Microsoft YaHei, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.name, s.x, s.y + 30);
  },

  drawStar(ctx, cx, cy, spikes, outer, inner) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outer;
      y = cy + Math.sin(rot) * outer;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * inner;
      y = cy + Math.sin(rot) * inner;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outer);
    ctx.closePath();
    ctx.fill();
  },
};
