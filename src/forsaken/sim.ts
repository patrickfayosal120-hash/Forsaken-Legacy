import { getChar } from "./content";
import { WORLD, buildLayout, type Bunker, type Obstacle } from "./maps";
import type { HudSnap, MatchOpts, Team } from "./types";

export interface Actor {
  id: string;
  name: string;
  team: Team;
  charId: string;
  x: number;
  z: number;
  yaw: number;
  hp: number;
  maxHp: number;
  radius: number;
  alive: boolean;
  corpse: number;
  stun: number;
  buff: number;
  weak: number;
  weakLeft: number;
  power: number;
  powerLeft: number;
  hatCd: number;
  rechargeCd: number;
  shotBoost: number;
  extraRoll: number;
  poison: number;
  poisonAcc: number;
  poisonFrom: string;
  engageCd: number;
  laserCd: number;
  bonusDmg: number;
  defense: number;
  ghost: number;
  rush: number;
  mileCd: number;
  chicken: number;
  chickenLeft: number;
  abilityCd: number;
  attackCd: number;
  attackDur: number;
  abilityDur: number;
  flash: number;
  isPlayer: boolean;
  speed: number;
  minionLife: number;
  ownerId: string;
  prefer: number;
}

export interface Gen {
  x: number;
  z: number;
  progress: number;
  done: boolean;
  playerWork: number;
}

export interface Sword {
  id: number;
  x: number;
  z: number;
  vx: number;
  vz: number;
  life: number;
  dmg: number;
  ownerId: string;
}

export interface Pizza {
  id: number;
  x: number;
  z: number;
  heal: number;
  life: number;
  ownerId: string;
}

export interface SimEvent {
  kind: "hit" | "down" | "gen" | "coin" | "ability" | "win" | "lose" | "stun" | "heal";
  amount?: number;
}

type EndKind =
  | "escape-win"
  | "escape-lose"
  | "time-win"
  | "time-lose"
  | "slaughter-win"
  | "slaughter-lose"
  | "forsaken";

const NAMES = ["Guest_1842", "BrickJones", "Cascade", "Northstar", "Milo_R", "Pepper", "Hollow", "Juniper", "Quill"];
const BOT_CHARS = ["noob", "noob", "noob", "noob", "shedletsky", "shedletsky", "elliot", "chance", "noob"];
const SPOTS: [number, number][] = [
  [0, 18],
  [-4, 15],
  [4, 15],
  [-7.5, 12],
  [7.5, 12],
  [-3.2, 10.5],
  [3.2, 10.5],
  [-8, 16.5],
  [8, 16.5],
];

function dist(a: { x: number; z: number }, b: { x: number; z: number }) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function yawFromDir(dx: number, dz: number) {
  return Math.atan2(-dx, -dz);
}

export function dampAngle(cur: number, target: number, maxStep: number) {
  const d = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
  const step = Math.abs(d) < maxStep ? d : Math.sign(d) * maxStep;
  return cur + step;
}

export class Sim {
  readonly opts: MatchOpts;
  readonly obstacles: Obstacle[];
  readonly bunker: Bunker | null;
  readonly actors: Actor[] = [];
  readonly gens: Gen[];
  pizzas: Pizza[] = [];
  readonly player: Actor;
  keys = new Set<string>();
  stick = { x: 0, y: 0, active: false };
  camYaw = 0;
  camPitch = 0.52;
  mouseAttack = false;
  attackButton = false;
  fixHeld = false;
  abilityQueued = false;
  hatQueued = false;
  rechargeQueued = false;
  engageQueued = false;
  laserQueued = false;
  mileQueued = false;
  sprintOn = false;
  stamina = 100;
  maxStamina = 100;
  timeLeft = 240;
  lms = false;
  survivorSlots = 9;
  swords: Sword[] = [];
  elapsed = 0;
  phase: "play" | "end" = "play";
  endTitle = "";
  endDetail = "";
  earned = 0;
  toast = "";
  toastT = 0;
  shake = 0;
  fixing = false;
  nearGen: Gen | null = null;
  events: SimEvent[] = [];
  private onMoney: (amount: number) => void;
  private onXp: (amount: number) => { level: number; leveled: boolean; gained?: number };
  private seq = 1;
  private roam = new Map<string, { x: number; z: number; until: number; run: boolean }>();
  private avoidSide = new Map<string, number>();

  constructor(
    opts: MatchOpts,
    onMoney: (amount: number) => void,
    onXp: (amount: number) => { level: number; leveled: boolean; gained?: number } = () => ({ level: 1, leveled: false }),
  ) {
    this.opts = opts;
    this.onMoney = onMoney;
    this.onXp = onXp;
    const layout = buildLayout(opts.mapId);
    this.obstacles = layout.obstacles;
    this.bunker = layout.bunker;
    this.gens = layout.gens.map((g) => ({ ...g, progress: 0, done: false, playerWork: 0 }));

    const playerIsKiller = opts.playerRole === "killer";
    const slots = opts.mode === "lms" ? 1 : 9;
    this.survivorSlots = slots;
    this.lms = opts.mode === "lms";
    this.timeLeft = opts.mode === "lms" ? 80 : 240;
    for (let i = 0; i < slots; i++) {
      const isPlayer = !playerIsKiller && i === 0;
      const charId = isPlayer ? opts.playerCharId : BOT_CHARS[i]!;
      const actor = this.make(isPlayer ? "you" : `s${i}`, isPlayer ? "You" : NAMES[i]!, "survivor", charId, isPlayer);
      actor.prefer = i % 5;
      if (!isPlayer) actor.abilityCd = Math.random() * 6;
      const [x, z] = SPOTS[i]!;
      this.drop(actor, x, z, 0);
      this.actors.push(actor);
    }

    const killer = this.make(
      "killer",
      playerIsKiller ? "You" : getChar(opts.killerCharId).name,
      "killer",
      opts.killerCharId,
      playerIsKiller,
    );
    this.drop(killer, 0, -18, Math.PI);
    this.actors.push(killer);
    this.player = this.actors.find((a) => a.isPlayer)!;
    for (const a of this.actors) if (a.charId === "chance") this.tryExtraHp(a);
  }

  private make(id: string, name: string, team: Team, charId: string, isPlayer: boolean): Actor {
    const def = getChar(charId);
    return {
      id,
      name,
      team,
      charId,
      x: 0,
      z: 0,
      yaw: 0,
      hp: def.hp + (isPlayer ? (this.opts.bonusHp ?? 0) : 0),
      maxHp: def.hp + (isPlayer ? (this.opts.bonusHp ?? 0) : 0),
      radius: 0.46 * def.scale,
      alive: true,
      corpse: 0,
      stun: 0,
      buff: 0,
      weak: 0,
      weakLeft: 0,
      power: 0,
      powerLeft: 0,
      hatCd: 0,
      rechargeCd: 0,
      shotBoost: 0,
      extraRoll: charId === "chance" ? 8 : 0,
      poison: 0,
      poisonAcc: 0,
      poisonFrom: "",
      engageCd: 0,
      laserCd: 0,
      bonusDmg: isPlayer ? (this.opts.bonusDmg ?? 0) : 0,
      defense: isPlayer ? (this.opts.defense ?? 0) : 0,
      ghost: 0,
      rush: 0,
      mileCd: 0,
      chicken: isPlayer && charId === "shedletsky" && (this.opts.milestone ?? 0) === 1 ? 2 : 0,
      chickenLeft: 0,
      abilityCd: 0,
      attackCd: 0,
      attackDur: def.attackCd,
      abilityDur: def.abilityCd,
      flash: 0,
      isPlayer,
      speed: 0,
      minionLife: 0,
      ownerId: "",
      prefer: 0,
    };
  }

  private drop(a: Actor, x: number, z: number, yaw: number) {
    a.x = x;
    a.z = z;
    a.yaw = yaw;
    for (let i = 0; i < 14 && this.hits(a); i++) {
      a.x += i % 2 === 0 ? 1.4 : -1.4;
      a.z += 0.6;
    }
  }

  private hits(a: Actor) {
    if (Math.abs(a.x) > WORLD || Math.abs(a.z) > WORLD) return true;
    for (const o of this.obstacles) {
      if (o.r <= 0) continue;
      const dx = a.x - o.x;
      const dz = a.z - o.z;
      if (dx * dx + dz * dz < (a.radius + o.r) * (a.radius + o.r)) return true;
    }
    return false;
  }

  private slide(a: Actor, dx: number, dz: number) {
    a.x += dx;
    if (this.hits(a)) a.x -= dx;
    a.z += dz;
    if (this.hits(a)) a.z -= dz;
  }

  private shoveOut(a: Actor) {
    if (a.x > WORLD) a.x = WORLD;
    if (a.x < -WORLD) a.x = -WORLD;
    if (a.z > WORLD) a.z = WORLD;
    if (a.z < -WORLD) a.z = -WORLD;
    for (const o of this.obstacles) {
      if (o.r <= 0) continue;
      let dx = a.x - o.x;
      let dz = a.z - o.z;
      let d = Math.hypot(dx, dz);
      const min = a.radius + o.r;
      if (d < min) {
        if (d < 1e-4) {
          dx = 1;
          dz = 0;
          d = 1;
        }
        a.x = o.x + (dx / d) * min;
        a.z = o.z + (dz / d) * min;
      }
    }
  }

  setKeys(codes: string[]) {
    this.keys.clear();
    for (const c of codes) this.keys.add(c);
  }

  setStick(x: number, y: number, active: boolean) {
    this.stick.x = x;
    this.stick.y = y;
    this.stick.active = active;
  }

  addLook(dx: number, dy: number) {
    this.camYaw -= dx * 0.0042;
    this.camPitch = Math.min(1.15, Math.max(0.18, this.camPitch + dy * 0.0032));
  }

  toggleSprint() {
    this.sprintOn = !this.sprintOn;
  }

  queueAbility() {
    this.abilityQueued = true;
  }

  queueHat() {
    this.hatQueued = true;
  }

  queueRecharge() {
    this.rechargeQueued = true;
  }

  queueEngage() {
    this.engageQueued = true;
  }

  queueLaser() {
    this.laserQueued = true;
  }

  queueMile() {
    this.mileQueued = true;
  }

  setFixHeld(v: boolean) {
    this.fixHeld = v;
  }

  getYaw() {
    return this.player.yaw;
  }

  getSpeed() {
    return this.player.speed;
  }

  drainEvents() {
    const e = this.events;
    this.events = [];
    return e;
  }

  debugCompleteNearestGen() {
    let best: Gen | null = null;
    let bestD = 1e9;
    for (const g of this.gens) {
      if (g.done) continue;
      const d = Math.hypot(g.x - this.player.x, g.z - this.player.z);
      if (d < bestD) {
        best = g;
        bestD = d;
      }
    }
    if (!best) return;
    best.playerWork = 1;
    best.progress = 1;
    this.finishGen(best);
  }

  tick(dt: number) {
    if (this.phase === "end") {
      this.toastT = Math.max(0, this.toastT - dt);
      if (this.toastT <= 0) this.toast = "";
      this.shake = Math.max(0, this.shake - dt * 1.5);
      return;
    }
    this.elapsed += dt;
    this.timeLeft = Math.max(0, this.timeLeft - dt);

    for (const a of this.actors) {
      a.abilityCd = Math.max(0, a.abilityCd - dt);
      a.attackCd = Math.max(0, a.attackCd - dt);
      a.hatCd = Math.max(0, a.hatCd - dt);
      a.rechargeCd = Math.max(0, a.rechargeCd - dt);
      a.engageCd = Math.max(0, a.engageCd - dt);
      a.laserCd = Math.max(0, a.laserCd - dt);
      a.mileCd = Math.max(0, a.mileCd - dt);
      a.ghost = Math.max(0, a.ghost - dt);
      a.rush = Math.max(0, a.rush - dt);
      if (a.alive && a.chickenLeft > 0) {
        const step = Math.min(dt, a.chickenLeft);
        a.chickenLeft -= step;
        a.hp = Math.min(a.maxHp, a.hp + 2 * step);
      }
      a.stun = Math.max(0, a.stun - dt);
      a.buff = Math.max(0, a.buff - dt);
      a.flash = Math.max(0, a.flash - dt);
      if (a.weakLeft > 0) {
        a.weakLeft = Math.max(0, a.weakLeft - dt);
        if (a.weakLeft <= 0) a.weak = 0;
      }
      if (a.powerLeft > 0) {
        a.powerLeft = Math.max(0, a.powerLeft - dt);
        if (a.powerLeft <= 0) a.power = 0;
      }
      if (a.alive && a.poison > 0) {
        a.poison = Math.max(0, a.poison - dt);
        a.poisonAcc += dt;
        while (a.poisonAcc >= 1 && a.alive && a.poison > 0) {
          a.poisonAcc -= 1;
          const src = this.actors.find((x) => x.id === a.poisonFrom) ?? a;
          this.damage(a, src, 5);
        }
        if (a.poison <= 0) a.poisonFrom = "";
      }
      if (a.alive && a.charId === "chance") {
        a.extraRoll -= dt;
        if (a.extraRoll <= 0) {
          a.extraRoll = 8;
          this.tryExtraHp(a);
        }
      }
      if (!a.alive) a.corpse -= dt;
      if (a.alive && a.team === "minion") {
        a.minionLife -= dt;
        if (a.minionLife <= 0) {
          a.alive = false;
          a.corpse = 0.6;
        }
      }
    }

    this.steerPlayer(dt);
    for (const a of this.actors) {
      if (!a.alive || a.isPlayer || a.stun > 0) {
        if (a.stun > 0) a.speed = 0;
        continue;
      }
      if (a.team === "survivor") this.steerSurvivor(a, dt);
      else if (a.team === "killer") this.steerKiller(a, dt);
      else this.steerMinion(a, dt);
    }

    this.separate();
    for (const a of this.actors) if (a.alive) this.shoveOut(a);
    this.updatePizzas(dt);
    this.updateSwords(dt);
    this.updateFix(dt);
    this.watchLms();
    this.checkEnd();
    this.toastT = Math.max(0, this.toastT - dt);
    if (this.toastT <= 0) this.toast = "";
    this.shake = Math.max(0, this.shake - dt * 1.4);
  }

  private axes() {
    let f = 0;
    let r = 0;
    const k = this.keys;
    if (k.has("KeyW") || k.has("ArrowUp")) f += 1;
    if (k.has("KeyS") || k.has("ArrowDown")) f -= 1;
    if (k.has("KeyD") || k.has("ArrowRight")) r += 1;
    // Chase cam: A is -right so the nose yaws left (controls skill).
    if (k.has("KeyA") || k.has("ArrowLeft")) r -= 1;
    if (this.stick.active) {
      f += this.stick.y;
      r += this.stick.x;
    }
    const len = Math.hypot(f, r);
    if (len > 1) {
      f /= len;
      r /= len;
    }
    return { f, r };
  }

  private steerPlayer(dt: number) {
    const a = this.player;
    if (!a.alive || a.stun > 0) {
      a.speed = 0;
      if (this.abilityQueued) this.abilityQueued = false;
      this.mileQueued = false;
      this.hatQueued = false;
      this.rechargeQueued = false;
      this.engageQueued = false;
      this.laserQueued = false;
      return;
    }
    const { f, r } = this.axes();
    const moving = Math.hypot(f, r) > 0.08;
    const fx = -Math.sin(this.camYaw);
    const fz = -Math.cos(this.camYaw);
    const rx = Math.cos(this.camYaw);
    const rz = -Math.sin(this.camYaw);
    if (moving) {
      let mx = fx * f + rx * r;
      let mz = fz * f + rz * r;
      const ml = Math.hypot(mx, mz) || 1;
      mx /= ml;
      mz /= ml;
      const def = getChar(a.charId);
      const sprinting = this.sprintOn && this.stamina > 0.4;
      const spd = this.pace(a, (sprinting ? 9.4 : 5.7) * def.move);
      const ox = a.x;
      const oz = a.z;
      this.slide(a, mx * spd * dt, mz * spd * dt);
      a.speed = Math.hypot(a.x - ox, a.z - oz) / Math.max(dt, 1e-6);
      a.yaw = dampAngle(a.yaw, Math.atan2(-mx, -mz), 12 * dt);
      if (sprinting && a.speed > 0.5) this.stamina = Math.max(0, this.stamina - 20 * dt);
      else this.regen(dt, false);
    } else {
      a.speed = 0;
      this.regen(dt, true);
    }
    if (this.abilityQueued) {
      this.abilityQueued = false;
      this.useAbility(a);
    }
    if (this.mileQueued) {
      this.mileQueued = false;
      this.useMile(a);
    }
    if (this.hatQueued) {
      this.hatQueued = false;
      this.repairHat(a);
    }
    if (this.rechargeQueued) {
      this.rechargeQueued = false;
      this.rechargeShot(a);
    }
    if (this.engageQueued) {
      this.engageQueued = false;
      this.engagement(a);
    }
    if (this.laserQueued) {
      this.laserQueued = false;
      this.laserEyes(a);
    }
    if (this.keys.has("KeyF") || this.mouseAttack || this.attackButton) this.basicAttack(a);
  }

  private regen(dt: number, still: boolean) {
    const rate = still && !this.sprintOn ? 22 : 12;
    this.stamina = Math.min(this.maxStamina, this.stamina + rate * dt);
  }

  private probe(a: Actor, nx: number, nz: number, reach: number) {
    const ox = a.x;
    const oz = a.z;
    a.x += nx * reach;
    a.z += nz * reach;
    const hit = this.hits(a);
    a.x = ox;
    a.z = oz;
    return hit;
  }

  private skirt(a: Actor, nx: number, nz: number) {
    const prefer = this.avoidSide.get(a.id) ?? 1;
    for (const ang of [0.55, 1.05, 1.55, 2.15, 2.7]) {
      for (const s of [prefer, -prefer]) {
        const c = Math.cos(ang * s);
        const sn = Math.sin(ang * s);
        const rx = nx * c - nz * sn;
        const rz = nx * sn + nz * c;
        if (!this.probe(a, rx, rz, 1.45)) {
          this.avoidSide.set(a.id, s > 0 ? 1 : -1);
          return { x: rx, z: rz };
        }
      }
    }
    this.avoidSide.set(a.id, -prefer);
    return null;
  }

  private moveDir(a: Actor, dx: number, dz: number, speed: number, dt: number) {
    const len = Math.hypot(dx, dz);
    if (len < 0.001) {
      a.speed = 0;
      return;
    }
    let mx = dx / len;
    let mz = dz / len;
    if ((a.team === "killer" || a.team === "minion") && this.probe(a, mx, mz, 1.35)) {
      const turn = this.skirt(a, mx, mz);
      if (turn) {
        mx = turn.x;
        mz = turn.z;
      }
    }
    const ox = a.x;
    const oz = a.z;
    this.slide(a, mx * this.pace(a, speed) * dt, mz * this.pace(a, speed) * dt);
    a.speed = Math.hypot(a.x - ox, a.z - oz) / Math.max(dt, 1e-6);
    a.yaw = dampAngle(a.yaw, yawFromDir(mx, mz), 8 * dt);
  }

  private canHunt(from: Actor, target: Actor) {
    return !(target.ghost > 0 && dist(from, target) > 7);
  }

  private nearest(from: Actor, pred: (a: Actor) => boolean) {
    let best: Actor | null = null;
    let bd = 1e9;
    for (const a of this.actors) {
      if (a === from || !pred(a)) continue;
      const d = dist(from, a);
      if (d < bd) {
        bd = d;
        best = a;
      }
    }
    return best;
  }

  private steerSurvivor(a: Actor, dt: number) {
    if (this.gens.every((g) => g.done)) {
      this.roamSurvivor(a, dt);
      return;
    }
    const killer = this.actors.find((x) => x.alive && x.team === "killer") ?? null;
    let threat: Actor | null = null;
    let td = 1e9;
    if (killer) {
      const d = dist(a, killer);
      if (d < 13) {
        threat = killer;
        td = d;
      }
    }
    const minion = this.nearest(a, (x) => x.alive && x.team === "minion");
    if (minion) {
      const d = dist(a, minion);
      if (d < 7.5 && d < td) threat = minion;
    }

    if (a.charId === "shedletsky" && killer && dist(a, killer) < 2.7 && a.abilityCd <= 0) {
      a.yaw = yawFromDir(killer.x - a.x, killer.z - a.z);
      this.useAbility(a);
    } else if (a.charId === "elliot" && a.abilityCd <= 0) {
      const hurt = this.actors.find(
        (s) => s.alive && s.team === "survivor" && s.id !== a.id && s.hp / s.maxHp <= 0.62,
      );
      if (hurt) {
        a.yaw = yawFromDir(hurt.x - a.x, hurt.z - a.z);
        this.useAbility(a);
      }
    } else if (a.charId === "noob" && threat && a.hp / a.maxHp < 0.5 && a.abilityCd <= 0) {
      this.useAbility(a);
    } else if (a.charId === "chance") {
      const kd = killer ? dist(a, killer) : 1e9;
      if (a.weak >= 6 && a.hatCd <= 0) this.repairHat(a);
      else if (killer && kd < 16 && a.attackCd <= 0) {
        a.yaw = yawFromDir(killer.x - a.x, killer.z - a.z);
        this.basicAttack(a);
      } else if (killer && kd < 16 && a.attackCd > 8 && a.rechargeCd <= 0) {
        this.rechargeShot(a);
      } else if (!threat && a.weak < 3 && a.abilityCd <= 0 && Math.random() < 0.02) {
        this.flipCoin(a);
      }
    }

    if (threat) {
      this.moveDir(a, a.x - threat.x, a.z - threat.z, 8.1, dt);
      return;
    }

    if (a.hp / a.maxHp <= 0.7) {
      let best: Pizza | null = null;
      let bd = 22;
      for (const p of this.pizzas) {
        if (p.ownerId === a.id) continue;
        const d = Math.hypot(p.x - a.x, p.z - a.z);
        if (d < bd) {
          bd = d;
          best = p;
        }
      }
      if (best) {
        this.moveDir(a, best.x - a.x, best.z - a.z, 6.4, dt);
        return;
      }
    }

    const gen = this.pickGen(a);
    if (!gen) {
      a.speed = 0;
      return;
    }
    const d = Math.hypot(gen.x - a.x, gen.z - a.z);
    if (d > 2.15) this.moveDir(a, gen.x - a.x, gen.z - a.z, 5.5, dt);
    else {
      a.speed = 0;
      a.yaw = dampAngle(a.yaw, yawFromDir(gen.x - a.x, gen.z - a.z), 8 * dt);
      if (!gen.done) {
        gen.progress = Math.min(1, gen.progress + 0.05 * dt);
        if (gen.progress >= 1) this.finishGen(gen);
      }
    }
  }

  private pickGen(a: Actor): Gen | null {
    const undone = this.gens.map((g, i) => ({ g, i })).filter((x) => !x.g.done);
    if (!undone.length) return null;
    const pref = undone.find((x) => x.i === a.prefer);
    if (pref) return pref.g;
    let best = undone[0]!.g;
    let bd = dist(a, best);
    for (const u of undone) {
      const d = dist(a, u.g);
      if (d < bd) {
        bd = d;
        best = u.g;
      }
    }
    return best;
  }

  private roamSurvivor(a: Actor, dt: number) {
    let plan = this.roam.get(a.id);
    if (!plan || this.elapsed >= plan.until) {
      const ang = Math.random() * Math.PI * 2;
      plan = {
        x: Math.sin(ang),
        z: Math.cos(ang),
        until: this.elapsed + 0.75 + Math.random() * 1.7,
        run: Math.random() < 0.5,
      };
      this.roam.set(a.id, plan);
    }
    this.moveDir(a, plan.x, plan.z, plan.run ? 8.8 : 4.3, dt);
    if (a.speed < 0.35) plan.until = this.elapsed;
  }

  private steerKiller(a: Actor, dt: number) {
    const prey = this.nearest(a, (s) => s.alive && s.team === "survivor" && this.canHunt(a, s));
    if (!prey) {
      a.speed = 0;
      return;
    }
    const d = dist(a, prey);
    const def = getChar(a.charId);
    if (d > def.attackRange * 0.92) this.moveDir(a, prey.x - a.x, prey.z - a.z, 6.6 * def.move, dt);
    else {
      a.yaw = dampAngle(a.yaw, yawFromDir(prey.x - a.x, prey.z - a.z), 10 * dt);
      a.speed = 0;
      this.basicAttack(a);
    }
    if (a.abilityCd <= 0 && this.elapsed > 2.5) {
      if (a.charId === "jason" && d < 3.15 && (prey.hp / prey.maxHp < 0.55 || a.attackCd > 0.2)) this.useAbility(a);
      else if (a.charId === "coolkid") this.useAbility(a);
      else if (a.charId === "johndoe" && d < 7.5) this.useAbility(a);
      else if (a.charId === "onex") {
        if (d < 3.3 && a.engageCd <= 0) this.engagement(a);
        else if (this.lms && d < 26 && a.laserCd <= 0) {
          a.yaw = dampAngle(a.yaw, yawFromDir(prey.x - a.x, prey.z - a.z), 10 * dt);
          this.laserEyes(a);
        } else if (a.abilityCd <= 0 && d < 14) this.useAbility(a);
      }
    }
  }

  private steerMinion(a: Actor, dt: number) {
    const prey = this.nearest(a, (s) => s.alive && s.team === "survivor" && this.canHunt(a, s));
    if (!prey) {
      a.speed = 0;
      return;
    }
    const d = dist(a, prey);
    if (d > 1.55) this.moveDir(a, prey.x - a.x, prey.z - a.z, 7.3, dt);
    else {
      a.yaw = dampAngle(a.yaw, yawFromDir(prey.x - a.x, prey.z - a.z), 12 * dt);
      a.speed = 0;
      if (a.attackCd <= 0) {
        a.attackCd = 0.85;
        this.damage(prey, a, 12);
        this.events.push({ kind: "hit" });
      }
    }
  }

  private separate() {
    const live = this.actors.filter((a) => a.alive);
    for (let i = 0; i < live.length; i++) {
      for (let j = i + 1; j < live.length; j++) {
        const a = live[i]!;
        const b = live[j]!;
        let dx = b.x - a.x;
        let dz = b.z - a.z;
        let d = Math.hypot(dx, dz);
        const min = a.radius + b.radius;
        if (d < min) {
          if (d < 1e-4) {
            dx = 1;
            dz = 0;
            d = 1;
          }
          const push = (min - d) / 2;
          dx /= d;
          dz /= d;
          a.x -= dx * push;
          a.z -= dz * push;
          b.x += dx * push;
          b.z += dz * push;
        }
      }
    }
  }

  private pace(a: Actor, speed: number) {
    let m = 1;
    if (a.weak > 0) m *= Math.max(0.55, 1 - 0.025 * a.weak);
    if (a.power > 0) m *= 1 + 0.05 * a.power;
    if (a.rush > 0) m *= 2;
    return speed * m;
  }

  private gainXp(amount: number, toast: boolean) {
    const res = this.onXp(amount);
    const got = res.gained ?? Math.floor(amount);
    if (res.leveled) this.note(`Level ${res.level}`);
    else if (toast && got > 0) this.note(`+${got} XP`);
  }

  private watchLms() {
    if (this.lms || this.phase !== "play") return;
    const alive = this.actors.filter((a) => a.alive && a.team === "survivor").length;
    if (alive !== 1) return;
    this.lms = true;
    this.timeLeft = 80;
    this.note("Last man standing · 1:20");
  }

  private massInfection(a: Actor) {
    if (!a.alive || a.stun > 0 || a.abilityCd > 0) return;
    a.abilityCd = 28;
    for (let i = 0; i < 4; i++) {
      const ang = a.yaw + (i - 1.5) * 0.32;
      const fx = -Math.sin(ang);
      const fz = -Math.cos(ang);
      this.swords.push({
        id: this.seq++,
        x: a.x + fx * 1.1,
        z: a.z + fz * 1.1,
        vx: fx * 16,
        vz: fz * 16,
        life: 1.15,
        dmg: 30 + Math.floor(Math.random() * 16),
        ownerId: a.id,
      });
    }
    this.events.push({ kind: "ability" });
    a.flash = 0.08;
  }

  private engagement(a: Actor) {
    if (!a.alive || a.stun > 0 || a.charId !== "onex" || a.engageCd > 0) return;
    a.engageCd = 22;
    const hits = this.cone(a, 3.2, 0.15, (t) => t.team === "survivor");
    for (const h of hits) {
      this.damage(h, a, 10);
      this.damage(h, a, 10);
      h.stun = Math.max(h.stun, 5);
    }
    if (a.isPlayer && !hits.length) this.note("Engagement missed");
    this.events.push({ kind: hits.length ? "stun" : "ability" });
    a.flash = 0.08;
  }

  private laserEyes(a: Actor) {
    if (!a.alive || a.stun > 0 || a.charId !== "onex" || a.laserCd > 0) return;
    if (!this.lms) {
      if (a.isPlayer) this.note("Laser eyes — last man standing only");
      return;
    }
    a.laserCd = 16;
    let hits = this.cone(a, 28, 0.9, (t) => t.team === "survivor");
    if (!hits.length) {
      const last = this.actors.find((s) => s.alive && s.team === "survivor" && this.canHunt(a, s));
      if (last && dist(a, last) < 30) {
        a.yaw = yawFromDir(last.x - a.x, last.z - a.z);
        hits = [last];
      }
    }
    for (const h of hits) this.damage(h, a, 40);
    if (a.isPlayer && !hits.length) this.note("Laser missed");
    else this.events.push({ kind: "hit" });
    a.flash = 0.1;
  }

  private updateSwords(dt: number) {
    for (const s of this.swords) {
      if (s.life <= 0) continue;
      s.life -= dt;
      s.x += s.vx * dt;
      s.z += s.vz * dt;
      for (const a of this.actors) {
        if (!a.alive || a.team !== "survivor") continue;
        if (a.ghost > 0) {
          const owner = this.actors.find((x) => x.id === s.ownerId);
          if (owner && dist(owner, a) > 7) continue;
        }
        if (Math.hypot(a.x - s.x, a.z - s.z) > a.radius + 0.55) continue;
        const owner = this.actors.find((x) => x.id === s.ownerId);
        if (owner) this.damage(a, owner, s.dmg);
        a.poison = 5;
        a.poisonAcc = 0;
        a.poisonFrom = s.ownerId;
        s.life = 0;
        this.events.push({ kind: "hit" });
        break;
      }
    }
    if (this.swords.length) this.swords = this.swords.filter((s) => s.life > 0);
  }

  private note(text: string) {
    this.toast = text;
    this.toastT = 1.8;
  }

  private tryExtraHp(a: Actor) {
    if (a.charId !== "chance" || !a.alive) return;
    if (Math.random() >= 0.01) return;
    const n = 2 + Math.floor(Math.random() * 7);
    a.maxHp += n;
    a.hp += n;
    if (a.isPlayer) this.note(`Extra HP +${n}`);
    this.events.push({ kind: "heal", amount: n });
  }

  private flipCoin(a: Actor) {
    if (!a.alive || a.stun > 0 || a.abilityCd > 0 || a.charId !== "chance") return;
    a.abilityCd = 0.1;
    const parts: string[] = [];
    if (Math.random() < 0.5) {
      a.weak = 1 + Math.floor(Math.random() * 10);
      a.weakLeft = 50;
      parts.push(`Weakness ${a.weak}`);
    }
    if (Math.random() < 0.001) {
      a.power = 1 + Math.floor(Math.random() * 4);
      a.powerLeft = 50;
      parts.push(`Powerful ${a.power}`);
    }
    if (a.isPlayer && parts.length) this.note(parts.join(" · "));
    this.events.push({ kind: "ability" });
    a.flash = 0.08;
  }

  private repairHat(a: Actor) {
    if (!a.alive || a.stun > 0 || a.charId !== "chance" || a.hatCd > 0) return;
    if (a.weak <= 0 && a.power <= 0) return;
    a.weak = 0;
    a.weakLeft = 0;
    a.power = 0;
    a.powerLeft = 0;
    a.hatCd = 8;
    if (a.isPlayer) this.note("Hat cleared effects");
    this.events.push({ kind: "heal" });
    a.flash = 0.08;
  }

  private rechargeShot(a: Actor) {
    if (!a.alive || a.stun > 0 || a.charId !== "chance" || a.rechargeCd > 0) return;
    a.attackCd = 0;
    a.shotBoost = 1;
    a.rechargeCd = 20;
    if (a.isPlayer) this.note("Shot recharged");
    this.events.push({ kind: "ability" });
    a.flash = 0.08;
  }

  private basicAttack(a: Actor) {
    if (!a.alive || a.stun > 0 || a.attackCd > 0) return;
    const def = getChar(a.charId);
    a.attackCd = def.attackCd;
    if (a.charId === "chance") {
      const boosted = a.shotBoost > 0;
      a.shotBoost = 0;
      const dmg = def.attackDamage * (boosted ? 2 : 1) + a.power * 8;
      const hits = this.cone(a, def.attackRange, 0.86, (t) => t.team === "killer" || t.team === "minion");
      for (const h of hits) {
        this.damage(h, a, dmg);
        if (boosted && h.team === "killer") h.stun = Math.max(h.stun, 1);
      }
      if (hits.length) this.events.push({ kind: "hit" });
      else if (a.isPlayer) this.note("Shot missed");
      return;
    }
    const hits = this.cone(a, def.attackRange, 0.15, (t) =>
      a.team === "survivor" ? t.team !== "survivor" : t.team === "survivor",
    );
    for (const h of hits) this.damage(h, a, def.attackDamage);
    if (hits.length) this.events.push({ kind: "hit" });
  }

  private useAbility(a: Actor) {
    if (!a.alive || a.stun > 0 || a.abilityCd > 0) return;
    const id = a.charId;
    if (id === "chance") {
      this.flipCoin(a);
      return;
    }
    if (id === "noob") {
      a.buff = 5;
      a.abilityCd = 40;
    } else if (id === "shedletsky") {
      a.abilityCd = 30;
      const hits = this.cone(a, 2.85, 0.05, (t) => t.team === "killer" || t.team === "minion");
      for (const h of hits) {
        if (h.team === "killer") {
          h.stun = 5;
          this.events.push({ kind: "stun" });
        }
        this.damage(h, a, h.team === "killer" ? 22 : 28);
      }
    } else if (id === "elliot") {
      a.abilityCd = 35;
      const fx = -Math.sin(a.yaw);
      const fz = -Math.cos(a.yaw);
      const pizza: Pizza = {
        id: this.seq++,
        x: a.x + fx * 3.3,
        z: a.z + fz * 3.3,
        heal: 45,
        life: 18,
        ownerId: a.id,
      };
      this.shovePoint(pizza);
      this.pizzas.push(pizza);
    } else if (id === "jason") {
      a.abilityCd = 25;
      const hits = this.cone(a, 3.15, 0.1, (t) => t.team === "survivor");
      for (const h of hits) {
        const exec = h.hp / h.maxHp <= 0.36;
        this.damage(h, a, exec ? h.hp + 10 : 62);
      }
    } else if (id === "coolkid") {
      a.abilityCd = 30;
      for (const m of this.actors) {
        if (m.team === "minion" && m.ownerId === a.id && m.alive) {
          m.alive = false;
          m.corpse = 0.3;
        }
      }
      const rx = Math.cos(a.yaw);
      const rz = -Math.sin(a.yaw);
      this.spawnMinion(a, a.x + rx * 1.7, a.z + rz * 1.7);
      this.spawnMinion(a, a.x - rx * 1.7, a.z - rz * 1.7);
    } else if (id === "johndoe") {
      a.abilityCd = 50;
      const fx = -Math.sin(a.yaw);
      const fz = -Math.cos(a.yaw);
      this.slide(a, fx * 5.5, fz * 5.5);
      for (const h of this.actors) {
        if (!h.alive || h.team !== "survivor") continue;
        if (dist(a, h) < 4.7) this.damage(h, a, 96);
      }
    } else if (id === "onex") {
      this.massInfection(a);
      return;
    } else return;
    this.events.push({ kind: "ability" });
    a.flash = 0.08;
  }

  private useMile(a: Actor) {
    if (!a.alive || a.stun > 0 || !a.isPlayer || a.team !== "survivor") return;
    if ((this.opts.milestone ?? 0) !== 1) {
      this.note("Equip Milestone 1");
      return;
    }
    if (a.charId === "noob") {
      if (a.mileCd > 0) return;
      a.ghost = 10;
      a.mileCd = 50;
      this.note("Ghost Burger");
    } else if (a.charId === "shedletsky") {
      if (a.chicken <= 0) {
        this.note("No chicken left");
        return;
      }
      if (a.chickenLeft > 0) return;
      a.chicken -= 1;
      a.chickenLeft = 5;
      this.note("Fried Chicken");
    } else if (a.charId === "elliot") {
      if (a.mileCd > 0) return;
      a.rush = 5;
      a.mileCd = 50;
      this.note("Rush Hour");
    } else return;
    this.events.push({ kind: "ability" });
    a.flash = 0.08;
  }

  private shovePoint(p: { x: number; z: number }) {
    for (const o of this.obstacles) {
      if (o.r <= 0) continue;
      let dx = p.x - o.x;
      let dz = p.z - o.z;
      let d = Math.hypot(dx, dz);
      const min = o.r + 0.8;
      if (d < min) {
        if (d < 1e-4) {
          dx = 1;
          dz = 0;
          d = 1;
        }
        p.x = o.x + (dx / d) * min;
        p.z = o.z + (dz / d) * min;
      }
    }
  }

  private spawnMinion(owner: Actor, x: number, z: number) {
    const m: Actor = {
      id: `m${this.actors.length}-${Math.floor(this.elapsed * 100)}`,
      name: "Minion",
      team: "minion",
      charId: "minion",
      x,
      z,
      yaw: owner.yaw,
      hp: 100,
      maxHp: 100,
      radius: 0.36,
      alive: true,
      corpse: 0,
      stun: 0,
      buff: 0,
      weak: 0,
      weakLeft: 0,
      power: 0,
      powerLeft: 0,
      hatCd: 0,
      rechargeCd: 0,
      shotBoost: 0,
      extraRoll: 0,
      poison: 0,
      poisonAcc: 0,
      poisonFrom: "",
      engageCd: 0,
      laserCd: 0,
      bonusDmg: 0,
      defense: 0,
      ghost: 0,
      rush: 0,
      mileCd: 0,
      chicken: 0,
      chickenLeft: 0,
      abilityCd: 0,
      attackCd: 0.3,
      attackDur: 0.85,
      abilityDur: 0,
      flash: 0,
      isPlayer: false,
      speed: 0,
      minionLife: 24,
      ownerId: owner.id,
      prefer: 0,
    };
    this.drop(m, x, z, owner.yaw);
    this.actors.push(m);
  }

  private cone(a: Actor, range: number, minDot: number, pred: (t: Actor) => boolean) {
    const fx = -Math.sin(a.yaw);
    const fz = -Math.cos(a.yaw);
    const hits: Actor[] = [];
    for (const t of this.actors) {
      if (t === a || !t.alive || !pred(t)) continue;
      const dx = t.x - a.x;
      const dz = t.z - a.z;
      const d = Math.hypot(dx, dz);
      if (d > range + t.radius || d < 1e-4) continue;
      if (!this.canHunt(a, t) && (a.team === "killer" || a.team === "minion")) continue;
      const dot = (dx * fx + dz * fz) / d;
      if (d < a.radius + t.radius + 0.45 || dot >= minDot) hits.push(t);
    }
    return hits;
  }

  private damage(target: Actor, source: Actor, amount: number) {
    if (!target.alive || this.phase === "end") return;
    let amt = amount + Math.max(0, source.bonusDmg);
    if (target.buff > 0) amt *= 0.2;
    if (target.weak > 0) amt *= 1 + 0.1 * target.weak;
    if (target.power > 0) amt *= Math.max(0.15, 1 - 0.1 * target.power);
    if (target.defense > 0) amt *= 1 - Math.min(20, target.defense) / 100;
    target.hp -= amt;
    target.flash = 0.16;
    if (target.isPlayer || source.isPlayer) this.shake = Math.min(0.55, this.shake + 0.28);
    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      target.corpse = 2.5;
      this.events.push({ kind: "down" });
      const yours =
        target.team === "survivor" &&
        this.player.team === "killer" &&
        (source.isPlayer || (source.team === "minion" && source.ownerId === this.player.id));
      if (yours) {
        this.grant(40 + Math.floor(Math.random() * 31), "kill");
        this.gainXp(12, false);
      }
      if (target.isPlayer) this.finish("forsaken");
    }
  }

  private updatePizzas(dt: number) {
    for (const p of this.pizzas) {
      p.life -= dt;
      if (p.life <= 0) continue;
      for (const a of this.actors) {
        if (!a.alive || a.team !== "survivor" || a.id === p.ownerId) continue;
        if (a.hp / a.maxHp > 0.7 || a.hp >= a.maxHp) continue;
        if (Math.hypot(a.x - p.x, a.z - p.z) < 1.2) {
          a.hp = Math.min(a.maxHp, a.hp + p.heal);
          p.life = 0;
          if (a.isPlayer) this.events.push({ kind: "heal" });
          break;
        }
      }
    }
    this.pizzas = this.pizzas.filter((p) => p.life > 0);
  }

  private updateFix(dt: number) {
    const a = this.player;
    this.fixing = false;
    this.nearGen = null;
    if (a.team !== "survivor" || !a.alive) return;
    let best: Gen | null = null;
    let bd = 2.6;
    for (const g of this.gens) {
      if (g.done) continue;
      const d = Math.hypot(g.x - a.x, g.z - a.z);
      if (d < bd) {
        bd = d;
        best = g;
      }
    }
    this.nearGen = best;
    const holding = this.keys.has("KeyE") || this.fixHeld;
    if (!best || !holding || a.stun > 0 || a.speed > 1.25) return;
    this.fixing = true;
    const rate = 0.17;
    best.progress = Math.min(1, best.progress + rate * dt);
    best.playerWork += rate * dt;
    if (best.progress >= 1) this.finishGen(best);
  }

  private finishGen(g: Gen) {
    if (g.done) return;
    g.done = true;
    g.progress = 1;
    this.events.push({ kind: "gen" });
    if (this.player.team === "survivor" && this.player.alive && g.playerWork >= 0.03) {
      const pay = 10 + Math.floor(Math.random() * 11);
      this.grant(pay, "generator");
      this.gainXp(8, false);
    } else if (this.gens.every((gen) => gen.done)) {
      this.toast = "Survivors are scattering";
      this.toastT = 2.8;
    }
  }

  private grant(pay: number, label: string) {
    this.earned = Math.round((this.earned + pay) * 100) / 100;
    this.toast = `+$${pay.toFixed(2)} ${label}`;
    this.toastT = 2.6;
    this.events.push({ kind: "coin", amount: pay });
    this.onMoney(pay);
  }

  private checkEnd() {
    if (this.phase !== "play") return;
    const aliveS = this.actors.filter((a) => a.alive && a.team === "survivor").length;
    if (aliveS === 0) {
      this.finish(this.player.team === "killer" ? "slaughter-win" : "slaughter-lose");
      return;
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.grant(325, "time");
      this.finish("time-win");
    }
  }

  private finish(kind: EndKind) {
    if (this.phase === "end") return;
    this.phase = "end";
    const earned = `Earned $${this.earned.toFixed(2)} this round.`;
    const win = kind === "escape-win" || kind === "time-win" || kind === "slaughter-win";
    if (kind === "escape-win") {
      this.endTitle = "ESCAPED";
      this.endDetail = `All 5 generators are done. ${earned}`;
    } else if (kind === "escape-lose") {
      this.endTitle = "THEY ESCAPED";
      this.endDetail = `The survivors finished every generator. ${earned}`;
    } else if (kind === "time-win") {
      this.endTitle = "TIME'S UP";
      this.endDetail = `Clock hit zero. ${earned}`;
    } else if (kind === "time-lose") {
      this.endTitle = "TIME'S UP";
      this.endDetail = `The generators were not finished. ${earned}`;
    } else if (kind === "slaughter-win") {
      this.endTitle = "SLAUGHTER";
      this.endDetail = `No survivors remain. ${earned}`;
    } else if (kind === "forsaken") {
      this.endTitle = "YOU WERE FORSAKEN";
      this.endDetail = `The killer got you. ${earned}`;
    } else {
      this.endTitle = "WIPED";
      this.endDetail = earned;
    }
    this.events.push({ kind: win ? "win" : "lose" });
    this.gainXp(win ? 25 : 8, false);
    if (this.lms && kind === "time-win") {
      this.endTitle = "LAST MAN STANDING";
      this.endDetail = `The clock hit zero. ${earned}`;
    }
  }

  getHud(): HudSnap {
    const a = this.player;
    const def = getChar(a.charId);
    const aliveS = this.actors.filter((x) => x.alive && x.team === "survivor").length;
    const gensDone = this.gens.filter((g) => g.done).length;
    let markerText = "";
    let markerAngle = 0;
    let tx = 0;
    let tz = 0;
    let labeled = false;
    if (a.team === "survivor") {
      let best: Gen | null = null;
      let bd = 1e9;
      for (const g of this.gens) {
        if (g.done) continue;
        const d = Math.hypot(g.x - a.x, g.z - a.z);
        if (d < bd) {
          bd = d;
          best = g;
        }
      }
      if (best) {
        tx = best.x;
        tz = best.z;
        markerText = `Gen ${Math.round(bd)}m`;
        labeled = true;
      } else if (this.gens.every((g) => g.done)) {
        markerText = "Hold out";
      }
    } else {
      const prey = this.nearest(a, (s) => s.alive && s.team === "survivor" && this.canHunt(a, s));
      if (prey) {
        tx = prey.x;
        tz = prey.z;
        const d = dist(a, prey);
        markerText = `${prey.name} ${Math.round(d)}m`;
        labeled = true;
      }
    }
    if (labeled) {
      const dx = tx - a.x;
      const dz = tz - a.z;
      const fx = -Math.sin(this.camYaw);
      const fz = -Math.cos(this.camYaw);
      const rx = Math.cos(this.camYaw);
      const rz = -Math.sin(this.camYaw);
      markerAngle = Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz);
    }
    const killer = this.actors.find((x) => x.alive && x.team === "killer");
    const hidden = a.ghost > 0;
    const killerNear = a.team === "survivor" && !!killer && !hidden && dist(a, killer) < 16;
    let mileName = "";
    let mileCd = 0;
    let mileLeft = 0;
    let mileUses = 0;
    if ((this.opts.milestone ?? 0) === 1 && a.isPlayer && a.team === "survivor") {
      if (a.charId === "noob") {
        mileName = "GHOST";
        mileCd = a.mileCd;
        mileLeft = a.ghost;
      } else if (a.charId === "shedletsky") {
        mileName = "CHICKEN";
        mileLeft = a.chickenLeft;
        mileUses = a.chicken;
      } else if (a.charId === "elliot") {
        mileName = "RUSH";
        mileCd = a.mileCd;
        mileLeft = a.rush;
      }
    }
    return {
      phase: this.phase,
      timeLeft: this.timeLeft,
      survivorsAlive: aliveS,
      survivorsMax: this.survivorSlots,
      gensDone,
      gensMax: 5,
      hp: a.hp,
      maxHp: a.maxHp,
      stamina: this.stamina,
      maxStamina: this.maxStamina,
      sprintOn: this.sprintOn,
      abilityCd: a.abilityCd,
      abilityMax: def.abilityCd,
      abilityName: def.abilityName,
      attackCd: a.attackCd,
      attackName: def.attackName,
      role: a.team === "killer" ? "killer" : "survivor",
      charName: def.name,
      nearGen: !!this.nearGen && !this.nearGen.done,
      genProgress: this.nearGen ? this.nearGen.progress : 0,
      fixing: this.fixing,
      stun: a.stun,
      buff: a.buff,
      weak: a.weak,
      weakLeft: a.weakLeft,
      power: a.power,
      powerLeft: a.powerLeft,
      hatCd: a.hatCd,
      rechargeCd: a.rechargeCd,
      shotBoost: a.shotBoost > 0,
      lms: this.lms,
      poison: a.poison,
      level: this.opts.level ?? 1,
      engageCd: a.engageCd,
      laserCd: a.laserCd,
      bonusDmg: a.bonusDmg,
      mileName,
      mileCd,
      mileLeft,
      mileUses,
      killerNear,
      mapName: this.opts.mapName,
      markerText,
      markerAngle,
      endTitle: this.endTitle,
      endDetail: this.endDetail,
      earned: this.earned,
      toast: this.toastT > 0 ? this.toast : "",
    };
  }
}

export function createSim(
  opts: MatchOpts,
  onMoney: (amount: number) => void,
  onXp?: (amount: number) => { level: number; leveled: boolean; gained?: number },
) {
  return new Sim(opts, onMoney, onXp);
}
