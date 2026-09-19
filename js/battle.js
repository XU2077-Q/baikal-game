/* =========================================================
 * 贝加尔湖畔 · 战斗系统
 * =======================================================*/

const Battle = {
  active: false,
  battleData: null,
  playerUnits: [],
  enemyUnits: [],
  currentTurn: 0,
  turnOrder: [],
  currentUnitIndex: 0,
  selectedAction: null,
  battleLog: [],
  callback: null,
  canvas: null,
  ctx: null,
  animating: false,
  effectQueue: [],
  currentEffect: null,

  start(battleId, partyIds, callback) {
    const data = Battles[battleId];
    if (!data) return;

    this.battleData = data;
    this.callback = callback;
    this.active = true;

    // 构建玩家单位
    this.playerUnits = partyIds.map((id, idx) => {
      const base = Characters[id] || Characters.anna;
      return {
        ...base,
        uid: 'p_' + idx,
        side: 'player',
        hp: base.stats.hp,
        maxHp: base.stats.hp,
        mp: base.stats.mp,
        maxMp: base.stats.mp,
        level: 1,
        buffs: [],
        isDead: false,
        x: 150 + idx * 100,
        y: 200 + (idx % 2) * 60,
        targetX: 150 + idx * 100,
        targetY: 200 + (idx % 2) * 60,
        action: null,
      };
    });

    // 构建敌方单位
    this.enemyUnits = data.enemies.map((e, idx) => {
      const base = Characters[e.base] || Characters.nkvd_soldier;
      const lv = e.level || 1;
      const hp = Math.floor(base.stats.hp * (1 + (lv - 1) * 0.3));
      return {
        ...base,
        uid: 'e_' + idx,
        side: 'enemy',
        hp,
        maxHp: hp,
        mp: base.stats.mp,
        maxMp: base.stats.mp,
        level: lv,
        buffs: [],
        isDead: false,
        x: 650 + idx * 90,
        y: 180 + (idx % 3) * 50,
        targetX: 650 + idx * 90,
        targetY: 180 + (idx % 3) * 50,
        action: null,
      };
    });

    this.battleLog = [];
    this.log(`⚔ ${data.name} 开始！`);
    this.log(data.description);

    this.canvas = document.getElementById('battle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    document.getElementById('battle-screen').classList.remove('hidden');
    Engine.gameMode = 'battle';

    this.startTurn();
    this.animate();
  },

  log(text) {
    this.battleLog.push(text);
    if (this.battleLog.length > 50) this.battleLog.shift();
    const logEl = document.getElementById('battle-log');
    if (logEl) {
      logEl.innerHTML = this.battleLog.map(l => `<div>${l}</div>`).join('');
      logEl.scrollTop = logEl.scrollHeight;
    }
  },

  startTurn() {
    // 计算行动顺序（按速度排序）
    const allUnits = [...this.playerUnits.filter(u => !u.isDead), ...this.enemyUnits.filter(u => !u.isDead)];
    allUnits.sort((a, b) => this.getEffectiveStat(b, 'spd') - this.getEffectiveStat(a, 'spd'));
    this.turnOrder = allUnits.map(u => u.uid);
    this.currentUnitIndex = 0;
    this.currentTurn++;

    this.log(`— 第 ${this.currentTurn} 回合 —`);
    this.updateUI();
    this.nextUnit();
  },

  getEffectiveStat(unit, stat) {
    let base = unit.stats[stat];
    for (const buff of unit.buffs) {
      if (buff.effect[stat + 'Boost']) {
        base *= (1 + buff.effect[stat + 'Boost']);
      }
      if (buff.effect[stat + 'Drop']) {
        base *= (1 - buff.effect[stat + 'Drop']);
      }
    }
    return Math.floor(base);
  },

  getCurrentUnit() {
    const uid = this.turnOrder[this.currentUnitIndex];
    return this.findUnit(uid);
  },

  findUnit(uid) {
    return [...this.playerUnits, ...this.enemyUnits].find(u => u.uid === uid);
  },

  nextUnit() {
    this.currentUnitIndex++;
    if (this.currentUnitIndex >= this.turnOrder.length) {
      // 回合结束，处理buff
      this.tickBuffs();
      this.startTurn();
      return;
    }

    const unit = this.getCurrentUnit();
    if (!unit || unit.isDead) {
      this.nextUnit();
      return;
    }

    this.updateUI();

    if (unit.side === 'enemy') {
      // AI行动
      setTimeout(() => this.enemyAI(unit), 800);
    } else {
      // 玩家行动
      this.showPlayerActions(unit);
    }
  },

  showPlayerActions(unit) {
    const actionsEl = document.getElementById('battle-actions');
    actionsEl.innerHTML = '';

    // 普攻
    const atkBtn = document.createElement('button');
    atkBtn.className = 'battle-action-btn';
    atkBtn.textContent = '⚔ 攻击';
    atkBtn.onclick = () => this.selectAttackTarget(unit, 'attack');
    actionsEl.appendChild(atkBtn);

    // 技能
    const skillBtn = document.createElement('button');
    skillBtn.className = 'battle-action-btn';
    skillBtn.textContent = '✨ 技能';
    skillBtn.onclick = () => this.showSkillMenu(unit);
    actionsEl.appendChild(skillBtn);

    // 防御
    const defBtn = document.createElement('button');
    defBtn.className = 'battle-action-btn';
    defBtn.textContent = '🛡 防御';
    defBtn.onclick = () => this.playerDefend(unit);
    actionsEl.appendChild(defBtn);

    // 道具
    const itemBtn = document.createElement('button');
    itemBtn.className = 'battle-action-btn';
    itemBtn.textContent = '💊 急救包';
    itemBtn.onclick = () => this.useHealItem(unit);
    actionsEl.appendChild(itemBtn);
  },

  showSkillMenu(unit) {
    const actionsEl = document.getElementById('battle-actions');
    actionsEl.innerHTML = '';

    const backBtn = document.createElement('button');
    backBtn.className = 'battle-action-btn';
    backBtn.textContent = '← 返回';
    backBtn.onclick = () => this.showPlayerActions(unit);
    actionsEl.appendChild(backBtn);

    for (const skillName of unit.skills) {
      const skill = Skills[skillName];
      if (!skill) continue;
      const btn = document.createElement('button');
      btn.className = 'battle-action-btn';
      btn.textContent = `${skillName} (${skill.mp}MP)`;
      btn.disabled = unit.mp < skill.mp;
      btn.onclick = () => this.selectSkillTarget(unit, skillName);
      actionsEl.appendChild(btn);
    }
  },

  selectAttackTarget(unit, action) {
    const actionsEl = document.getElementById('battle-actions');
    actionsEl.innerHTML = '<div style="color:#a0b0d0;font-size:13px;padding:8px;">选择攻击目标：</div>';

    for (const enemy of this.enemyUnits) {
      if (enemy.isDead) continue;
      const btn = document.createElement('button');
      btn.className = 'battle-action-btn';
      btn.textContent = enemy.name;
      btn.onclick = () => this.executeAttack(unit, enemy);
      actionsEl.appendChild(btn);
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'battle-action-btn';
    backBtn.textContent = '← 返回';
    backBtn.onclick = () => this.showPlayerActions(unit);
    actionsEl.appendChild(backBtn);
  },

  selectSkillTarget(unit, skillName) {
    const skill = Skills[skillName];
    if (!skill) return;

    const actionsEl = document.getElementById('battle-actions');
    actionsEl.innerHTML = '';

    if (skill.target === 'ally_all' || skill.target === 'enemy_all' || skill.target === 'self') {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'battle-action-btn';
      confirmBtn.textContent = `使用 ${skillName}`;
      confirmBtn.onclick = () => this.executeSkill(unit, skillName, null);
      actionsEl.appendChild(confirmBtn);
    } else if (skill.target === 'ally_single') {
      const title = document.createElement('div');
      title.style.cssText = 'color:#a0b0d0;font-size:13px;padding:8px;';
      title.textContent = '选择目标：';
      actionsEl.appendChild(title);
      for (const ally of this.playerUnits) {
        if (ally.isDead) continue;
        const btn = document.createElement('button');
        btn.className = 'battle-action-btn';
        btn.textContent = ally.name;
        btn.onclick = () => this.executeSkill(unit, skillName, ally);
        actionsEl.appendChild(btn);
      }
    } else if (skill.target === 'enemy_single') {
      const title = document.createElement('div');
      title.style.cssText = 'color:#a0b0d0;font-size:13px;padding:8px;';
      title.textContent = '选择目标：';
      actionsEl.appendChild(title);
      for (const enemy of this.enemyUnits) {
        if (enemy.isDead) continue;
        const btn = document.createElement('button');
        btn.className = 'battle-action-btn';
        btn.textContent = enemy.name;
        btn.onclick = () => this.executeSkill(unit, skillName, enemy);
        actionsEl.appendChild(btn);
      }
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'battle-action-btn';
    backBtn.textContent = '← 返回';
    backBtn.onclick = () => this.showSkillMenu(unit);
    actionsEl.appendChild(backBtn);
  },

  executeAttack(attacker, target) {
    const dmg = this.calculateDamage(attacker, target, 1.0);
    this.animateAttack(attacker, target, dmg, () => {
      this.applyDamage(target, dmg);
      this.log(`${attacker.name} 攻击了 ${target.name}，造成 ${dmg} 点伤害！`);
      this.checkBattleEnd();
    });
  },

  executeSkill(user, skillName, target) {
    const skill = Skills[skillName];
    if (!skill) return;
    if (user.mp < skill.mp) return;

    user.mp -= skill.mp;
    this.log(`${user.name} 使用了【${skillName}】！`);

    if (skill.type === 'attack') {
      if (skill.target === 'enemy_single') {
        const dmg = this.calculateDamage(user, target, skill.effect.dmgMul || 1, skill.effect.critBonus || 0);
        this.animateAttack(user, target, dmg, () => {
          this.applyDamage(target, dmg);
          this.log(`造成 ${dmg} 点伤害！`);
          if (skill.effect.recoil) {
            const recoil = Math.floor(dmg * skill.effect.recoil);
            this.applyDamage(user, recoil);
            this.log(`${user.name} 反冲受到 ${recoil} 点伤害！`);
          }
          this.checkBattleEnd();
        });
      } else if (skill.target === 'enemy_all') {
        const enemies = this.enemyUnits.filter(u => !u.isDead);
        let done = 0;
        for (const e of enemies) {
          const dmg = this.calculateDamage(user, e, skill.effect.dmgMul || 0.8);
          setTimeout(() => {
            this.applyDamage(e, dmg);
            this.log(`${e.name} 受到 ${dmg} 点伤害！`);
            done++;
            if (done === enemies.length) this.checkBattleEnd();
          }, 200 * done);
        }
      }
    } else if (skill.type === 'heal') {
      const heal = skill.effect.heal || 30;
      if (skill.target === 'ally_single') {
        target.hp = Math.min(target.maxHp, target.hp + heal);
        this.log(`${target.name} 恢复了 ${heal} 点HP！`);
        this.spawnHealEffect(target);
        setTimeout(() => this.endPlayerTurn(user), 800);
      } else if (skill.target === 'ally_all') {
        for (const ally of this.playerUnits) {
          if (!ally.isDead) {
            ally.hp = Math.min(ally.maxHp, ally.hp + heal);
            this.spawnHealEffect(ally);
          }
        }
        this.log(`全体恢复 ${heal} 点HP！`);
        setTimeout(() => this.endPlayerTurn(user), 800);
      }
      this.updateUI();
    } else if (skill.type === 'buff') {
      const targets = skill.target === 'ally_all' ? this.playerUnits.filter(u => !u.isDead) :
                      skill.target === 'self' ? [user] : [target];
      for (const t of targets) {
        t.buffs.push({ name: skillName, effect: skill.effect, duration: skill.effect.duration || 3 });
      }
      this.log(`${skill.desc}`);
      setTimeout(() => this.endPlayerTurn(user), 800);
      this.updateUI();
    } else if (skill.type === 'debuff') {
      const targets = skill.target === 'enemy_all' ? this.enemyUnits.filter(u => !u.isDead) : [target];
      for (const t of targets) {
        t.buffs.push({ name: skillName, effect: skill.effect, duration: skill.effect.duration || 2, debuff: true });
      }
      this.log(`${skill.desc}`);
      setTimeout(() => this.endPlayerTurn(user), 800);
      this.updateUI();
    } else if (skill.type === 'special') {
      if (skill.effect.mpRestore) {
        for (const ally of this.playerUnits) {
          if (!ally.isDead) {
            ally.mp = Math.min(ally.maxMp, ally.mp + skill.effect.mpRestore);
          }
        }
        this.log(`全体恢复 ${skill.effect.mpRestore} 点MP！`);
      }
      setTimeout(() => this.endPlayerTurn(user), 800);
      this.updateUI();
    }
  },

  playerDefend(unit) {
    unit.buffs.push({ name: '防御', effect: { defBoost: 0.5 }, duration: 1 });
    this.log(`${unit.name} 进入防御姿态！`);
    this.endPlayerTurn(unit);
  },

  useHealItem(unit) {
    const heal = 30;
    unit.hp = Math.min(unit.maxHp, unit.hp + heal);
    this.log(`${unit.name} 使用了急救包，恢复 ${heal} 点HP！`);
    this.spawnHealEffect(unit);
    this.endPlayerTurn(unit);
  },

  calculateDamage(attacker, target, multiplier = 1.0, critBonus = 0) {
    const atk = this.getEffectiveStat(attacker, 'atk');
    const def = this.getEffectiveStat(target, 'def');
    let base = Math.max(1, Math.floor(atk * multiplier - def * 0.6));
    // 暴击
    const critChance = 0.1 + critBonus;
    if (Math.random() < critChance) {
      base = Math.floor(base * 1.8);
      this.log('💥 暴击！');
    }
    // 浮动
    base = Math.floor(base * (0.9 + Math.random() * 0.2));
    return Math.max(1, base);
  },

  applyDamage(unit, dmg) {
    unit.hp = Math.max(0, unit.hp - dmg);
    if (unit.hp <= 0) {
      unit.isDead = true;
      this.log(`💀 ${unit.name} 被击败了！`);
    }
    this.updateUI();
  },

  spawnHealEffect(unit) {
    // 简单的治愈粒子
    for (let i = 0; i < 8; i++) {
      Engine.spawnParticle(
        unit.x + Math.random() * 40 - 20,
        unit.y + Math.random() * 30,
        (Math.random() - 0.5) * 30,
        -30 - Math.random() * 20,
        '#70e090',
        3,
        1.0
      );
    }
  },

  animateAttack(attacker, target, dmg, callback) {
    const startX = attacker.x;
    const startY = attacker.y;
    const dir = attacker.side === 'player' ? 1 : -1;

    attacker.targetX = target.x - dir * 60;
    attacker.targetY = target.y;

    setTimeout(() => {
      // 回到原位
      attacker.targetX = startX;
      attacker.targetY = startY;

      // 伤害数字
      for (let i = 0; i < 10; i++) {
        Engine.spawnParticle(
          target.x + Math.random() * 30 - 15,
          target.y + Math.random() * 20,
          (Math.random() - 0.5) * 60,
          -20 - Math.random() * 30,
          '#ff6060',
          3,
          0.8
        );
      }
      callback && callback();
    }, 300);

    setTimeout(() => {
      this.endPlayerTurn(attacker);
    }, 700);
  },

  enemyAI(unit) {
    // 简单AI：随机攻击一个玩家单位
    const alivePlayers = this.playerUnits.filter(u => !u.isDead);
    if (alivePlayers.length === 0) return;

    const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

    // 30%概率用技能
    const availableSkills = (unit.skills || []).filter(s => {
      const sk = Skills[s];
      return sk && unit.mp >= sk.mp && (sk.type === 'attack' || sk.type === 'buff');
    });

    if (availableSkills.length > 0 && Math.random() < 0.3) {
      const skillName = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      const skill = Skills[skillName];
      unit.mp -= skill.mp;
      this.log(`${unit.name} 使用了【${skillName}】！`);

      if (skill.type === 'attack') {
        const dmg = this.calculateDamage(unit, target, skill.effect.dmgMul || 1);
        this.animateAttack(unit, target, dmg, () => {
          this.applyDamage(target, dmg);
          this.log(`造成 ${dmg} 点伤害！`);
          this.checkBattleEnd();
        });
      } else if (skill.type === 'buff') {
        for (const e of this.enemyUnits) {
          if (!e.isDead) {
            e.buffs.push({ name: skillName, effect: skill.effect, duration: skill.effect.duration || 2 });
          }
        }
        this.log(skill.desc);
        setTimeout(() => {
          this.endEnemyTurn(unit);
          this.checkBattleEnd();
        }, 800);
      }
    } else {
      const dmg = this.calculateDamage(unit, target, 1.0);
      this.animateAttack(unit, target, dmg, () => {
        this.applyDamage(target, dmg);
        this.log(`${unit.name} 攻击了 ${target.name}，造成 ${dmg} 点伤害！`);
        this.checkBattleEnd();
      });
    }
  },

  endPlayerTurn(unit) {
    this.nextUnit();
  },

  endEnemyTurn(unit) {
    this.nextUnit();
  },

  tickBuffs() {
    for (const unit of [...this.playerUnits, ...this.enemyUnits]) {
      if (unit.isDead) continue;
      for (let i = unit.buffs.length - 1; i >= 0; i--) {
        unit.buffs[i].duration--;
        if (unit.buffs[i].duration <= 0) {
          unit.buffs.splice(i, 1);
        }
      }
    }
  },

  checkBattleEnd() {
    const playersAlive = this.playerUnits.some(u => !u.isDead);
    const enemiesAlive = this.enemyUnits.some(u => !u.isDead);

    if (!enemiesAlive) {
      // 胜利
      setTimeout(() => this.endBattle(true), 1000);
      return true;
    }
    if (!playersAlive) {
      // 失败
      setTimeout(() => this.endBattle(false), 1000);
      return true;
    }
    return false;
  },

  endBattle(victory) {
    this.active = false;
    document.getElementById('battle-screen').classList.add('hidden');
    Engine.gameMode = 'story';

    if (victory) {
      this.log('🎉 战斗胜利！');
      const reward = this.battleData.reward || {};
      if (reward.exp) {
        for (const u of this.playerUnits) {
          if (!u.isDead) u.exp = (u.exp || 0) + reward.exp;
        }
      }
      if (reward.supplies) Game.state.resources.supplies += reward.supplies;
      if (reward.morale) Game.state.resources.morale += reward.morale;

      UI.toast(`战斗胜利！获得补给 +${reward.supplies || 0}，士气 +${reward.morale || 0}`);
    } else {
      this.log('💀 战斗失败……');
      UI.toast('战斗失败，同志们撤退了');
    }

    // 回调
    if (this.callback) {
      this.callback(victory);
    }
  },

  updateUI() {
    // 更新玩家单位列表
    const playerEl = document.getElementById('player-units');
    if (playerEl) {
      playerEl.innerHTML = '';
      for (const u of this.playerUnits) {
        const current = this.getCurrentUnit();
        const isActive = current && current.uid === u.uid;
        const div = document.createElement('div');
        div.className = 'battle-unit' + (isActive ? ' active' : '') + (u.isDead ? ' dead' : '');
        const hpPct = Math.floor(u.hp / u.maxHp * 100);
        div.innerHTML = `
          <span class="battle-unit-name">${u.name}</span>
          <span class="battle-unit-hp">${u.hp}/${u.maxHp} HP</span>
        `;
        playerEl.appendChild(div);
      }
    }

    // 更新敌方单位列表
    const enemyEl = document.getElementById('enemy-units');
    if (enemyEl) {
      enemyEl.innerHTML = '';
      for (const u of this.enemyUnits) {
        const current = this.getCurrentUnit();
        const isActive = current && current.uid === u.uid;
        const div = document.createElement('div');
        div.className = 'battle-unit' + (isActive ? ' active' : '') + (u.isDead ? ' dead' : '');
        const hpPct = Math.floor(u.hp / u.maxHp * 100);
        div.innerHTML = `
          <span class="battle-unit-name">${u.name}</span>
          <span class="battle-unit-hp">${u.hp}/${u.maxHp} HP</span>
        `;
        enemyEl.appendChild(div);
      }
    }
  },

  // 战斗画面渲染
  animFrame: 0,

  animate() {
    if (!this.active) return;

    const ctx = this.ctx;
    const canvas = this.canvas;

    // 背景
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#1a2030');
    bgGrad.addColorStop(1, '#0d1520');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 地面
    ctx.fillStyle = '#2a3545';
    ctx.fillRect(0, 300, canvas.width, 80);

    // 地面纹理
    ctx.strokeStyle = 'rgba(60, 80, 110, 0.3)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 50, 300);
      ctx.lineTo(i * 50 + 25, 380);
      ctx.stroke();
    }

    // 更新单位位置（平滑移动）
    const allUnits = [...this.playerUnits, ...this.enemyUnits];
    for (const u of allUnits) {
      u.x += (u.targetX - u.x) * 0.15;
      u.y += (u.targetY - u.y) * 0.15;
    }

    // 绘制单位
    for (const u of allUnits) {
      if (u.isDead) {
        ctx.globalAlpha = 0.3;
      }
      this.drawBattleUnit(ctx, u);
      ctx.globalAlpha = 1;
    }

    this.animFrame++;
    requestAnimationFrame(() => this.animate());
  },

  drawBattleUnit(ctx, unit) {
    const x = unit.x;
    const y = unit.y;
    const isPlayer = unit.side === 'player';

    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 45, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 身体（像素风格简化）
    const bodyColor = unit.color || (isPlayer ? '#4a6a8a' : '#6a3a3a');
    const darkColor = isPlayer ? '#2a4a6a' : '#4a2020';

    // 腿
    ctx.fillStyle = darkColor;
    ctx.fillRect(x - 8, y + 20, 6, 20);
    ctx.fillRect(x + 2, y + 20, 6, 20);

    // 身体
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x - 12, y - 5, 24, 30);

    // 头
    ctx.fillStyle = '#f0d8c0';
    ctx.fillRect(x - 8, y - 22, 16, 18);

    // 头发
    ctx.fillStyle = unit.id === 'anna' ? '#d4a5e0' :
                   unit.id === 'sablin' ? '#5a3a2a' :
                   unit.id === 'andrei' ? '#b0a080' : '#404040';
    ctx.fillRect(x - 8, y - 24, 16, 8);

    // 眼睛
    ctx.fillStyle = '#1a1a2a';
    if (isPlayer) {
      ctx.fillRect(x - 4, y - 15, 2, 2);
      ctx.fillRect(x + 2, y - 15, 2, 2);
    } else {
      ctx.fillRect(x - 4, y - 15, 2, 2);
      ctx.fillRect(x + 2, y - 15, 2, 2);
    }

    // HP条
    const hpPct = unit.hp / unit.maxHp;
    ctx.fillStyle = '#2a1a1a';
    ctx.fillRect(x - 18, y - 32, 36, 5);
    ctx.fillStyle = hpPct > 0.5 ? '#50a070' : hpPct > 0.25 ? '#c0a050' : '#c05050';
    ctx.fillRect(x - 18, y - 32, 36 * hpPct, 5);

    // 名字
    ctx.fillStyle = '#e0e8f0';
    ctx.font = '11px Microsoft YaHei, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(unit.shortName || unit.name, x, y - 38);
  },
};
