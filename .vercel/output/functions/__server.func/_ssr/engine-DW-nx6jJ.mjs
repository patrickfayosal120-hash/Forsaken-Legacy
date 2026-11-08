import { a as MINION_VISUAL, i as addMoney, n as playSfx, o as getChar, r as unlockAudio } from "./routes-Bc1UhYxp.mjs";
import { C as Scene, E as Vector3, S as SRGBColorSpace, T as TorusGeometry, _ as MeshStandardMaterial, a as Color, b as PointLight, c as DirectionalLight, d as Group, f as HemisphereLight, g as MeshLambertMaterial, h as MeshBasicMaterial, i as CircleGeometry, l as DodecahedronGeometry, m as Mesh, n as BoxGeometry, o as ConeGeometry, p as InstancedMesh, r as CanvasTexture, s as CylinderGeometry, t as WebGLRenderer, u as Fog, v as Object3D, w as SphereGeometry, x as RepeatWrapping, y as PerspectiveCamera } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-DW-nx6jJ.js
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function laneBlocked(x, z) {
	if (Math.hypot(x, z - 18) < 7.5) return true;
	if (Math.hypot(x, z + 18) < 7.5) return true;
	if (Math.abs(x) < 6.5 && z > 4 && z < 24) return true;
	return false;
}
function forest() {
	const gens = [
		{
			x: -16,
			z: -8
		},
		{
			x: 15,
			z: -14
		},
		{
			x: -18,
			z: 8
		},
		{
			x: 17,
			z: 6
		},
		{
			x: 8,
			z: -22
		}
	];
	const rand = mulberry32(23057);
	const obstacles = [];
	let guard = 0;
	while (obstacles.filter((o) => o.kind === "tree").length < 42 && guard < 400) {
		guard++;
		const x = (rand() * 2 - 1) * 27;
		const z = (rand() * 2 - 1) * 27;
		if (laneBlocked(x, z)) continue;
		if (gens.some((g) => Math.hypot(g.x - x, g.z - z) < 5)) continue;
		if (obstacles.some((o) => Math.hypot(o.x - x, o.z - z) < 2.4)) continue;
		obstacles.push({
			x,
			z,
			r: .85,
			kind: "tree"
		});
	}
	guard = 0;
	while (obstacles.filter((o) => o.kind === "rock").length < 8 && guard < 80) {
		guard++;
		const x = (rand() * 2 - 1) * 26;
		const z = (rand() * 2 - 1) * 26;
		if (laneBlocked(x, z)) continue;
		if (gens.some((g) => Math.hypot(g.x - x, g.z - z) < 4)) continue;
		obstacles.push({
			x,
			z,
			r: 1.05,
			kind: "rock"
		});
	}
	return {
		obstacles,
		gens
	};
}
function city() {
	const obstacles = [];
	for (let gx = -2; gx <= 2; gx++) for (let gz = -2; gz <= 2; gz++) {
		if (gx === 0 || gz === 0) continue;
		obstacles.push({
			x: gx * 12,
			z: gz * 12,
			r: 3.5,
			kind: "building"
		});
	}
	return {
		obstacles,
		gens: [
			{
				x: 0,
				z: 12
			},
			{
				x: 0,
				z: -12
			},
			{
				x: 12,
				z: 0
			},
			{
				x: -12,
				z: 0
			},
			{
				x: 0,
				z: 0
			}
		]
	};
}
function hq() {
	return {
		obstacles: [
			{
				x: 0,
				z: 0,
				r: 4.2,
				kind: "monument"
			},
			{
				x: 12,
				z: 12,
				r: 1.25,
				kind: "pillar"
			},
			{
				x: -12,
				z: 12,
				r: 1.25,
				kind: "pillar"
			},
			{
				x: 12,
				z: -12,
				r: 1.25,
				kind: "pillar"
			},
			{
				x: -12,
				z: -12,
				r: 1.25,
				kind: "pillar"
			},
			{
				x: 16,
				z: 8,
				r: 2.2,
				kind: "building"
			},
			{
				x: -16,
				z: 8,
				r: 2.2,
				kind: "building"
			},
			{
				x: 16,
				z: -10,
				r: 2.2,
				kind: "building"
			},
			{
				x: -16,
				z: -10,
				r: 2.2,
				kind: "building"
			}
		],
		gens: [
			{
				x: 8,
				z: 16
			},
			{
				x: -8,
				z: 16
			},
			{
				x: 10,
				z: -18
			},
			{
				x: -14,
				z: -16
			},
			{
				x: 22,
				z: -2
			}
		]
	};
}
function buildLayout(mapId) {
	if (mapId === "city") return city();
	if (mapId === "hq") return hq();
	return forest();
}
var NAMES = [
	"Guest_1842",
	"BrickJones",
	"Cascade",
	"Northstar",
	"Milo_R",
	"Pepper",
	"Hollow",
	"Juniper",
	"Quill"
];
var BOT_CHARS = [
	"noob",
	"noob",
	"noob",
	"noob",
	"shedletsky",
	"shedletsky",
	"elliot",
	"chance",
	"noob"
];
var SPOTS = [
	[0, 18],
	[-4, 15],
	[4, 15],
	[-7.5, 12],
	[7.5, 12],
	[-3.2, 10.5],
	[3.2, 10.5],
	[-8, 16.5],
	[8, 16.5]
];
function dist(a, b) {
	return Math.hypot(a.x - b.x, a.z - b.z);
}
function yawFromDir(dx, dz) {
	return Math.atan2(-dx, -dz);
}
function dampAngle(cur, target, maxStep) {
	const d = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
	return cur + (Math.abs(d) < maxStep ? d : Math.sign(d) * maxStep);
}
var Sim = class {
	opts;
	obstacles;
	actors = [];
	gens;
	pizzas = [];
	player;
	keys = /* @__PURE__ */ new Set();
	stick = {
		x: 0,
		y: 0,
		active: false
	};
	camYaw = 0;
	camPitch = .52;
	mouseAttack = false;
	attackButton = false;
	fixHeld = false;
	abilityQueued = false;
	hatQueued = false;
	rechargeQueued = false;
	sprintOn = false;
	stamina = 100;
	maxStamina = 100;
	timeLeft = 240;
	elapsed = 0;
	phase = "play";
	endTitle = "";
	endDetail = "";
	earned = 0;
	toast = "";
	toastT = 0;
	shake = 0;
	fixing = false;
	nearGen = null;
	events = [];
	onMoney;
	seq = 1;
	roam = /* @__PURE__ */ new Map();
	constructor(opts, onMoney) {
		this.opts = opts;
		this.onMoney = onMoney;
		const layout = buildLayout(opts.mapId);
		this.obstacles = layout.obstacles;
		this.gens = layout.gens.map((g) => ({
			...g,
			progress: 0,
			done: false,
			playerWork: 0
		}));
		const playerIsKiller = opts.playerRole === "killer";
		for (let i = 0; i < 9; i++) {
			const isPlayer = !playerIsKiller && i === 0;
			const charId = isPlayer ? opts.playerCharId : BOT_CHARS[i];
			const actor = this.make(isPlayer ? "you" : `s${i}`, isPlayer ? "You" : NAMES[i], "survivor", charId, isPlayer);
			actor.prefer = i % 5;
			if (!isPlayer) actor.abilityCd = Math.random() * 6;
			const [x, z] = SPOTS[i];
			this.drop(actor, x, z, 0);
			this.actors.push(actor);
		}
		const killer = this.make("killer", playerIsKiller ? "You" : getChar(opts.killerCharId).name, "killer", opts.killerCharId, playerIsKiller);
		this.drop(killer, 0, -18, Math.PI);
		this.actors.push(killer);
		this.player = this.actors.find((a) => a.isPlayer);
		for (const a of this.actors) if (a.charId === "chance") this.tryExtraHp(a);
	}
	make(id, name, team, charId, isPlayer) {
		const def = getChar(charId);
		return {
			id,
			name,
			team,
			charId,
			x: 0,
			z: 0,
			yaw: 0,
			hp: def.hp,
			maxHp: def.hp,
			radius: .46 * def.scale,
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
			abilityCd: 0,
			attackCd: 0,
			attackDur: def.attackCd,
			abilityDur: def.abilityCd,
			flash: 0,
			isPlayer,
			speed: 0,
			minionLife: 0,
			ownerId: "",
			prefer: 0
		};
	}
	drop(a, x, z, yaw) {
		a.x = x;
		a.z = z;
		a.yaw = yaw;
		for (let i = 0; i < 14 && this.hits(a); i++) {
			a.x += i % 2 === 0 ? 1.4 : -1.4;
			a.z += .6;
		}
	}
	hits(a) {
		if (Math.abs(a.x) > 30 || Math.abs(a.z) > 30) return true;
		for (const o of this.obstacles) {
			const dx = a.x - o.x;
			const dz = a.z - o.z;
			if (dx * dx + dz * dz < (a.radius + o.r) * (a.radius + o.r)) return true;
		}
		return false;
	}
	slide(a, dx, dz) {
		a.x += dx;
		if (this.hits(a)) a.x -= dx;
		a.z += dz;
		if (this.hits(a)) a.z -= dz;
	}
	shoveOut(a) {
		if (a.x > 30) a.x = 30;
		if (a.x < -30) a.x = -30;
		if (a.z > 30) a.z = 30;
		if (a.z < -30) a.z = -30;
		for (const o of this.obstacles) {
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
				a.x = o.x + dx / d * min;
				a.z = o.z + dz / d * min;
			}
		}
	}
	setKeys(codes) {
		this.keys.clear();
		for (const c of codes) this.keys.add(c);
	}
	setStick(x, y, active) {
		this.stick.x = x;
		this.stick.y = y;
		this.stick.active = active;
	}
	addLook(dx, dy) {
		this.camYaw -= dx * .0042;
		this.camPitch = Math.min(1.15, Math.max(.18, this.camPitch + dy * .0032));
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
	setFixHeld(v) {
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
		let best = null;
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
	tick(dt) {
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
					a.corpse = .6;
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
		this.updateFix(dt);
		this.checkEnd();
		this.toastT = Math.max(0, this.toastT - dt);
		if (this.toastT <= 0) this.toast = "";
		this.shake = Math.max(0, this.shake - dt * 1.4);
	}
	axes() {
		let f = 0;
		let r = 0;
		const k = this.keys;
		if (k.has("KeyW") || k.has("ArrowUp")) f += 1;
		if (k.has("KeyS") || k.has("ArrowDown")) f -= 1;
		if (k.has("KeyD") || k.has("ArrowRight")) r += 1;
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
		return {
			f,
			r
		};
	}
	steerPlayer(dt) {
		const a = this.player;
		if (!a.alive || a.stun > 0) {
			a.speed = 0;
			if (this.abilityQueued) this.abilityQueued = false;
			this.hatQueued = false;
			this.rechargeQueued = false;
			return;
		}
		const { f, r } = this.axes();
		const moving = Math.hypot(f, r) > .08;
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
			const sprinting = this.sprintOn && this.stamina > .4;
			const spd = this.pace(a, (sprinting ? 9.4 : 5.7) * def.move);
			const ox = a.x;
			const oz = a.z;
			this.slide(a, mx * spd * dt, mz * spd * dt);
			a.speed = Math.hypot(a.x - ox, a.z - oz) / Math.max(dt, 1e-6);
			a.yaw = dampAngle(a.yaw, Math.atan2(-mx, -mz), 12 * dt);
			if (sprinting && a.speed > .5) this.stamina = Math.max(0, this.stamina - 20 * dt);
			else this.regen(dt, false);
		} else {
			a.speed = 0;
			this.regen(dt, true);
		}
		if (this.abilityQueued) {
			this.abilityQueued = false;
			this.useAbility(a);
		}
		if (this.hatQueued) {
			this.hatQueued = false;
			this.repairHat(a);
		}
		if (this.rechargeQueued) {
			this.rechargeQueued = false;
			this.rechargeShot(a);
		}
		if (this.keys.has("KeyF") || this.mouseAttack || this.attackButton) this.basicAttack(a);
	}
	regen(dt, still) {
		const rate = still && !this.sprintOn ? 22 : 12;
		this.stamina = Math.min(this.maxStamina, this.stamina + rate * dt);
	}
	moveDir(a, dx, dz, speed, dt) {
		const len = Math.hypot(dx, dz);
		if (len < .001) {
			a.speed = 0;
			return;
		}
		const nx = dx / len;
		const nz = dz / len;
		const ox = a.x;
		const oz = a.z;
		this.slide(a, nx * this.pace(a, speed) * dt, nz * this.pace(a, speed) * dt);
		a.speed = Math.hypot(a.x - ox, a.z - oz) / Math.max(dt, 1e-6);
		a.yaw = dampAngle(a.yaw, yawFromDir(nx, nz), 8 * dt);
	}
	nearest(from, pred) {
		let best = null;
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
	steerSurvivor(a, dt) {
		if (this.gens.every((g) => g.done)) {
			this.roamSurvivor(a, dt);
			return;
		}
		const killer = this.actors.find((x) => x.alive && x.team === "killer") ?? null;
		let threat = null;
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
			const hurt = this.actors.find((s) => s.alive && s.team === "survivor" && s.id !== a.id && s.hp / s.maxHp <= .62);
			if (hurt) {
				a.yaw = yawFromDir(hurt.x - a.x, hurt.z - a.z);
				this.useAbility(a);
			}
		} else if (a.charId === "noob" && threat && a.hp / a.maxHp < .5 && a.abilityCd <= 0) this.useAbility(a);
		else if (a.charId === "chance") {
			const kd = killer ? dist(a, killer) : 1e9;
			if (a.weak >= 6 && a.hatCd <= 0) this.repairHat(a);
			else if (killer && kd < 16 && a.attackCd <= 0) {
				a.yaw = yawFromDir(killer.x - a.x, killer.z - a.z);
				this.basicAttack(a);
			} else if (killer && kd < 16 && a.attackCd > 8 && a.rechargeCd <= 0) this.rechargeShot(a);
			else if (!threat && a.weak < 3 && a.abilityCd <= 0 && Math.random() < .02) this.flipCoin(a);
		}
		if (threat) {
			this.moveDir(a, a.x - threat.x, a.z - threat.z, 8.1, dt);
			return;
		}
		if (a.hp / a.maxHp <= .7) {
			let best = null;
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
		if (Math.hypot(gen.x - a.x, gen.z - a.z) > 2.15) this.moveDir(a, gen.x - a.x, gen.z - a.z, 5.5, dt);
		else {
			a.speed = 0;
			a.yaw = dampAngle(a.yaw, yawFromDir(gen.x - a.x, gen.z - a.z), 8 * dt);
			if (!gen.done) {
				gen.progress = Math.min(1, gen.progress + .05 * dt);
				if (gen.progress >= 1) this.finishGen(gen);
			}
		}
	}
	pickGen(a) {
		const undone = this.gens.map((g, i) => ({
			g,
			i
		})).filter((x) => !x.g.done);
		if (!undone.length) return null;
		const pref = undone.find((x) => x.i === a.prefer);
		if (pref) return pref.g;
		let best = undone[0].g;
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
	roamSurvivor(a, dt) {
		let plan = this.roam.get(a.id);
		if (!plan || this.elapsed >= plan.until) {
			const ang = Math.random() * Math.PI * 2;
			plan = {
				x: Math.sin(ang),
				z: Math.cos(ang),
				until: this.elapsed + .75 + Math.random() * 1.7,
				run: Math.random() < .5
			};
			this.roam.set(a.id, plan);
		}
		this.moveDir(a, plan.x, plan.z, plan.run ? 8.8 : 4.3, dt);
		if (a.speed < .35) plan.until = this.elapsed;
	}
	steerKiller(a, dt) {
		const prey = this.nearest(a, (s) => s.alive && s.team === "survivor");
		if (!prey) {
			a.speed = 0;
			return;
		}
		const d = dist(a, prey);
		const def = getChar(a.charId);
		if (d > def.attackRange * .92) this.moveDir(a, prey.x - a.x, prey.z - a.z, 6.6 * def.move, dt);
		else {
			a.yaw = dampAngle(a.yaw, yawFromDir(prey.x - a.x, prey.z - a.z), 10 * dt);
			a.speed = 0;
			this.basicAttack(a);
		}
		if (a.abilityCd <= 0 && this.elapsed > 2.5) {
			if (a.charId === "jason" && d < 3.15 && (prey.hp / prey.maxHp < .55 || a.attackCd > .2)) this.useAbility(a);
			else if (a.charId === "coolkid") this.useAbility(a);
			else if (a.charId === "johndoe" && d < 7.5) this.useAbility(a);
		}
	}
	steerMinion(a, dt) {
		const prey = this.nearest(a, (s) => s.alive && s.team === "survivor");
		if (!prey) {
			a.speed = 0;
			return;
		}
		if (dist(a, prey) > 1.55) this.moveDir(a, prey.x - a.x, prey.z - a.z, 7.3, dt);
		else {
			a.yaw = dampAngle(a.yaw, yawFromDir(prey.x - a.x, prey.z - a.z), 12 * dt);
			a.speed = 0;
			if (a.attackCd <= 0) {
				a.attackCd = .85;
				this.damage(prey, a, 12);
				this.events.push({ kind: "hit" });
			}
		}
	}
	separate() {
		const live = this.actors.filter((a) => a.alive);
		for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) {
			const a = live[i];
			const b = live[j];
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
	pace(a, speed) {
		let m = 1;
		if (a.weak > 0) m *= Math.max(.55, 1 - .025 * a.weak);
		if (a.power > 0) m *= 1 + .05 * a.power;
		return speed * m;
	}
	note(text) {
		this.toast = text;
		this.toastT = 1.8;
	}
	tryExtraHp(a) {
		if (a.charId !== "chance" || !a.alive) return;
		if (Math.random() >= .01) return;
		const n = 2 + Math.floor(Math.random() * 7);
		a.maxHp += n;
		a.hp += n;
		if (a.isPlayer) this.note(`Extra HP +${n}`);
		this.events.push({
			kind: "heal",
			amount: n
		});
	}
	flipCoin(a) {
		if (!a.alive || a.stun > 0 || a.abilityCd > 0 || a.charId !== "chance") return;
		a.abilityCd = .1;
		const parts = [];
		if (Math.random() < .5) {
			a.weak = 1 + Math.floor(Math.random() * 10);
			a.weakLeft = 50;
			parts.push(`Weakness ${a.weak}`);
		}
		if (Math.random() < .001) {
			a.power = 1 + Math.floor(Math.random() * 4);
			a.powerLeft = 50;
			parts.push(`Powerful ${a.power}`);
		}
		if (a.isPlayer && parts.length) this.note(parts.join(" · "));
		this.events.push({ kind: "ability" });
		a.flash = .08;
	}
	repairHat(a) {
		if (!a.alive || a.stun > 0 || a.charId !== "chance" || a.hatCd > 0) return;
		if (a.weak <= 0 && a.power <= 0) return;
		a.weak = 0;
		a.weakLeft = 0;
		a.power = 0;
		a.powerLeft = 0;
		a.hatCd = 8;
		if (a.isPlayer) this.note("Hat cleared effects");
		this.events.push({ kind: "heal" });
		a.flash = .08;
	}
	rechargeShot(a) {
		if (!a.alive || a.stun > 0 || a.charId !== "chance" || a.rechargeCd > 0) return;
		a.attackCd = 0;
		a.shotBoost = 1;
		a.rechargeCd = 20;
		if (a.isPlayer) this.note("Shot recharged");
		this.events.push({ kind: "ability" });
		a.flash = .08;
	}
	basicAttack(a) {
		if (!a.alive || a.stun > 0 || a.attackCd > 0) return;
		const def = getChar(a.charId);
		a.attackCd = def.attackCd;
		if (a.charId === "chance") {
			const boosted = a.shotBoost > 0;
			a.shotBoost = 0;
			const dmg = def.attackDamage * (boosted ? 2 : 1) + a.power * 8;
			const hits = this.cone(a, def.attackRange, .86, (t) => t.team === "killer" || t.team === "minion");
			for (const h of hits) {
				this.damage(h, a, dmg);
				if (boosted && h.team === "killer") h.stun = Math.max(h.stun, 1);
			}
			if (hits.length) this.events.push({ kind: "hit" });
			else if (a.isPlayer) this.note("Shot missed");
			return;
		}
		const hits = this.cone(a, def.attackRange, .15, (t) => a.team === "survivor" ? t.team !== "survivor" : t.team === "survivor");
		for (const h of hits) this.damage(h, a, def.attackDamage);
		if (hits.length) this.events.push({ kind: "hit" });
	}
	useAbility(a) {
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
			const hits = this.cone(a, 2.85, .05, (t) => t.team === "killer" || t.team === "minion");
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
			const pizza = {
				id: this.seq++,
				x: a.x + fx * 3.3,
				z: a.z + fz * 3.3,
				heal: 45,
				life: 18,
				ownerId: a.id
			};
			this.shovePoint(pizza);
			this.pizzas.push(pizza);
		} else if (id === "jason") {
			a.abilityCd = 25;
			const hits = this.cone(a, 3.15, .1, (t) => t.team === "survivor");
			for (const h of hits) {
				const exec = h.hp / h.maxHp <= .36;
				this.damage(h, a, exec ? h.hp + 10 : 62);
			}
		} else if (id === "coolkid") {
			a.abilityCd = 30;
			for (const m of this.actors) if (m.team === "minion" && m.ownerId === a.id && m.alive) {
				m.alive = false;
				m.corpse = .3;
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
		} else return;
		this.events.push({ kind: "ability" });
		a.flash = .08;
	}
	shovePoint(p) {
		for (const o of this.obstacles) {
			let dx = p.x - o.x;
			let dz = p.z - o.z;
			let d = Math.hypot(dx, dz);
			const min = o.r + .8;
			if (d < min) {
				if (d < 1e-4) {
					dx = 1;
					dz = 0;
					d = 1;
				}
				p.x = o.x + dx / d * min;
				p.z = o.z + dz / d * min;
			}
		}
	}
	spawnMinion(owner, x, z) {
		const m = {
			id: `m${this.actors.length}-${Math.floor(this.elapsed * 100)}`,
			name: "Minion",
			team: "minion",
			charId: "minion",
			x,
			z,
			yaw: owner.yaw,
			hp: 100,
			maxHp: 100,
			radius: .36,
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
			abilityCd: 0,
			attackCd: .3,
			attackDur: .85,
			abilityDur: 0,
			flash: 0,
			isPlayer: false,
			speed: 0,
			minionLife: 24,
			ownerId: owner.id,
			prefer: 0
		};
		this.drop(m, x, z, owner.yaw);
		this.actors.push(m);
	}
	cone(a, range, minDot, pred) {
		const fx = -Math.sin(a.yaw);
		const fz = -Math.cos(a.yaw);
		const hits = [];
		for (const t of this.actors) {
			if (t === a || !t.alive || !pred(t)) continue;
			const dx = t.x - a.x;
			const dz = t.z - a.z;
			const d = Math.hypot(dx, dz);
			if (d > range + t.radius || d < 1e-4) continue;
			const dot = (dx * fx + dz * fz) / d;
			if (d < a.radius + t.radius + .45 || dot >= minDot) hits.push(t);
		}
		return hits;
	}
	damage(target, source, amount) {
		if (!target.alive || this.phase === "end") return;
		let amt = amount;
		if (target.buff > 0) amt *= .2;
		if (target.weak > 0) amt *= 1 + .1 * target.weak;
		if (target.power > 0) amt *= Math.max(.15, 1 - .1 * target.power);
		target.hp -= amt;
		target.flash = .16;
		if (target.isPlayer || source.isPlayer) this.shake = Math.min(.55, this.shake + .28);
		if (target.hp <= 0) {
			target.hp = 0;
			target.alive = false;
			target.corpse = 2.5;
			this.events.push({ kind: "down" });
			if (target.team === "survivor" && this.player.team === "killer" && (source.isPlayer || source.team === "minion" && source.ownerId === this.player.id)) this.grant(40 + Math.floor(Math.random() * 31), "kill");
			if (target.isPlayer) this.finish("forsaken");
		}
	}
	updatePizzas(dt) {
		for (const p of this.pizzas) {
			p.life -= dt;
			if (p.life <= 0) continue;
			for (const a of this.actors) {
				if (!a.alive || a.team !== "survivor" || a.id === p.ownerId) continue;
				if (a.hp / a.maxHp > .7 || a.hp >= a.maxHp) continue;
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
	updateFix(dt) {
		const a = this.player;
		this.fixing = false;
		this.nearGen = null;
		if (a.team !== "survivor" || !a.alive) return;
		let best = null;
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
		const rate = .17;
		best.progress = Math.min(1, best.progress + rate * dt);
		best.playerWork += rate * dt;
		if (best.progress >= 1) this.finishGen(best);
	}
	finishGen(g) {
		if (g.done) return;
		g.done = true;
		g.progress = 1;
		this.events.push({ kind: "gen" });
		if (this.player.team === "survivor" && this.player.alive && g.playerWork >= .03) {
			const pay = 10 + Math.floor(Math.random() * 11);
			this.grant(pay, "generator");
		} else if (this.gens.every((gen) => gen.done)) {
			this.toast = "Survivors are scattering";
			this.toastT = 2.8;
		}
	}
	grant(pay, label) {
		this.earned = Math.round((this.earned + pay) * 100) / 100;
		this.toast = `+$${pay.toFixed(2)} ${label}`;
		this.toastT = 2.6;
		this.events.push({
			kind: "coin",
			amount: pay
		});
		this.onMoney(pay);
	}
	checkEnd() {
		if (this.phase !== "play") return;
		if (this.actors.filter((a) => a.alive && a.team === "survivor").length === 0) {
			this.finish(this.player.team === "killer" ? "slaughter-win" : "slaughter-lose");
			return;
		}
		if (this.timeLeft <= 0) {
			this.timeLeft = 0;
			this.grant(325, "time");
			this.finish("time-win");
		}
	}
	finish(kind) {
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
	}
	getHud() {
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
			let best = null;
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
			} else if (this.gens.every((g) => g.done)) markerText = "Hold out";
		} else {
			const prey = this.nearest(a, (s) => s.alive && s.team === "survivor");
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
		const killerNear = a.team === "survivor" && !!killer && dist(a, killer) < 16;
		return {
			phase: this.phase,
			timeLeft: this.timeLeft,
			survivorsAlive: aliveS,
			survivorsMax: 9,
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
			killerNear,
			mapName: this.opts.mapName,
			markerText,
			markerAngle,
			endTitle: this.endTitle,
			endDetail: this.endDetail,
			earned: this.earned,
			toast: this.toastT > 0 ? this.toast : ""
		};
	}
};
function createSim(opts, onMoney) {
	return new Sim(opts, onMoney);
}
var THEME = {
	forest: {
		bg: 791056,
		sky: 2371652,
		ground: 1708558,
		hemi: .55,
		dir: .7,
		near: 12,
		far: 42,
		floor: 1713684
	},
	city: {
		bg: 1184794,
		sky: 2765636,
		ground: 1315086,
		hemi: .5,
		dir: .55,
		near: 16,
		far: 52,
		floor: 2763824
	},
	hq: {
		bg: 12893876,
		sky: 15921128,
		ground: 12037796,
		hemi: .95,
		dir: 1.05,
		near: 24,
		far: 78,
		floor: 14012616
	}
};
function std(hex, rough = .72) {
	return new MeshStandardMaterial({
		color: hex,
		roughness: rough,
		metalness: .05
	});
}
function buildAvatar(charId) {
	const colors = charId === "minion" ? MINION_VISUAL : getChar(charId).colors;
	const scale = charId === "minion" ? .62 : getChar(charId).scale;
	const g = new Group();
	const mats = [];
	const mat = (hex) => {
		const m = std(hex);
		mats.push(m);
		return m;
	};
	const box = (w, h, d, material) => new Mesh(new BoxGeometry(w, h, d), material);
	const head = box(.92, .86, .84, mat(colors.head));
	head.position.y = 2.32;
	const torso = box(1.12, 1.16, .58, mat(colors.torso));
	torso.position.y = 1.36;
	const armGeo = new BoxGeometry(.36, 1.16, .36);
	const lArm = new Mesh(armGeo, mat(colors.arm));
	lArm.position.set(-.78, 1.36, 0);
	const rArm = new Mesh(armGeo, mat(colors.arm));
	rArm.position.set(.78, 1.36, 0);
	const legGeo = new BoxGeometry(.42, 1.05, .44);
	const lLeg = new Mesh(legGeo, mat(colors.leg));
	lLeg.position.set(-.28, .52, 0);
	const rLeg = new Mesh(legGeo, mat(colors.leg));
	rLeg.position.set(.28, .52, 0);
	const eyeMat = mat(charId === "johndoe" ? 14826299 : charId === "coolkid" ? 16052198 : 1710618);
	const eyeGeo = new BoxGeometry(.12, .12, .06);
	const e1 = new Mesh(eyeGeo, eyeMat);
	const e2 = new Mesh(eyeGeo, eyeMat);
	e1.position.set(-.18, .08, .44);
	e2.position.set(.18, .08, .44);
	if (charId !== "johndoe") head.add(e2);
	else e1.scale.set(1.4, 1.4, 1);
	head.add(e1);
	if (charId === "noob" || charId === "shedletsky" || charId === "elliot" || charId === "chance") {
		const smile = box(.32, .07, .06, mat(2365455));
		smile.position.set(0, -.18, .44);
		head.add(smile);
	}
	if (charId === "jason") {
		const mark = box(.16, .16, .05, mat(12857658));
		mark.position.set(0, -.16, .44);
		head.add(mark);
	}
	if (charId === "coolkid" || charId === "minion") {
		const mouth = box(.42, .1, .06, mat(1312778));
		mouth.position.set(0, -.18, .44);
		head.add(mouth);
	}
	if (charId === "shedletsky") {
		const hair = box(.98, .28, .92, mat(7027231));
		hair.position.y = .42;
		head.add(hair);
		const blade = box(.1, .95, .08, mat(14278114));
		blade.position.set(.05, -.15, .28);
		rArm.add(blade);
	}
	if (charId === "elliot") {
		const cap = box(.98, .16, .96, mat(12857658));
		cap.position.y = .48;
		const brim = box(.72, .06, .28, mat(12857658));
		brim.position.set(0, .36, .46);
		head.add(cap, brim);
	}
	if (charId === "chance") {
		const brim = box(1.2, .08, 1.08, mat(1315860));
		brim.position.set(0, .46, .06);
		const crown = box(.62, .32, .62, mat(1315860));
		crown.position.y = .64;
		const band = box(.66, .08, .66, mat(13934615));
		band.position.y = .5;
		head.add(brim, crown, band);
		const gun = box(.12, .12, .62, mat(3815994));
		gun.position.set(.02, -.2, .46);
		rArm.add(gun);
	}
	if (charId === "jason" || charId === "johndoe") {
		const blade = box(.12, 1.05, .08, mat(charId === "johndoe" ? 7216162 : 14278114));
		blade.position.set(.02, -.25, .32);
		rArm.add(blade);
	}
	if (charId === "johndoe") {
		const spike = new Mesh(new ConeGeometry(.14, .5, 4), mat(9052200));
		spike.rotation.x = Math.PI / 2;
		spike.position.set(.2, .2, -.42);
		const spike2 = spike.clone();
		spike2.position.x = -.2;
		torso.add(spike, spike2);
	}
	const blob = new Mesh(new CircleGeometry(.72, 14), new MeshBasicMaterial({
		color: 0,
		transparent: true,
		opacity: .35
	}));
	blob.rotation.x = -Math.PI / 2;
	blob.position.y = .03;
	g.add(head, torso, lArm, rArm, lLeg, rLeg, blob);
	g.scale.setScalar(scale);
	g.userData = {
		parts: {
			lLeg,
			rLeg,
			lArm,
			rArm
		},
		mats,
		mode: "norm"
	};
	for (const m of mats) m.userData.base = m.color.getHex();
	return g;
}
function groundTexture(mapId) {
	const c = document.createElement("canvas");
	c.width = 256;
	c.height = 256;
	const g = c.getContext("2d");
	if (mapId === "forest") {
		g.fillStyle = "#1a2614";
		g.fillRect(0, 0, 256, 256);
		for (let i = 0; i < 1800; i++) {
			g.fillStyle = i % 2 ? "#24361c" : "#121c10";
			g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
		}
	} else if (mapId === "city") {
		g.fillStyle = "#2a2c30";
		g.fillRect(0, 0, 256, 256);
		g.strokeStyle = "#3c4048";
		g.lineWidth = 4;
		for (let i = 0; i <= 256; i += 32) {
			g.beginPath();
			g.moveTo(i, 0);
			g.lineTo(i, 256);
			g.stroke();
			g.beginPath();
			g.moveTo(0, i);
			g.lineTo(256, i);
			g.stroke();
		}
		g.strokeStyle = "#c9a15a";
		g.lineWidth = 2;
		g.beginPath();
		g.moveTo(128, 0);
		g.lineTo(128, 256);
		g.stroke();
		g.beginPath();
		g.moveTo(0, 128);
		g.lineTo(256, 128);
		g.stroke();
	} else {
		g.fillStyle = "#d5d0c8";
		g.fillRect(0, 0, 256, 256);
		g.strokeStyle = "#c4b8aa";
		g.lineWidth = 3;
		for (let i = 0; i <= 256; i += 32) {
			g.beginPath();
			g.moveTo(i, 0);
			g.lineTo(i, 256);
			g.stroke();
			g.beginPath();
			g.moveTo(0, i);
			g.lineTo(256, i);
			g.stroke();
		}
		g.fillStyle = "#c4313a";
		g.fillRect(116, 0, 24, 256);
	}
	const tex = new CanvasTexture(c);
	tex.wrapS = tex.wrapT = RepeatWrapping;
	tex.repeat.set(8, 8);
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
function windowTexture() {
	const c = document.createElement("canvas");
	c.width = 64;
	c.height = 64;
	const g = c.getContext("2d");
	g.fillStyle = "#23262e";
	g.fillRect(0, 0, 64, 64);
	for (let y = 6; y < 64; y += 16) for (let x = 6; x < 64; x += 16) {
		g.fillStyle = (x + y) % 32 === 0 ? "#2a3140" : "#f0d7a0";
		g.fillRect(x, y, 8, 10);
	}
	const tex = new CanvasTexture(c);
	tex.colorSpace = SRGBColorSpace;
	tex.wrapS = tex.wrapT = RepeatWrapping;
	return tex;
}
function createView(canvas, sim) {
	const mapId = sim.opts.mapId;
	const theme = THEME[mapId];
	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: false,
		powerPreference: "high-performance"
	});
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 900 ? 1.25 : 1.6));
	const scene = new Scene();
	scene.background = new Color(theme.bg);
	scene.fog = new Fog(theme.bg, theme.near, theme.far);
	const camera = new PerspectiveCamera(62, 1, .1, 140);
	scene.add(new HemisphereLight(theme.sky, theme.ground, theme.hemi));
	const dir = new DirectionalLight(mapId === "hq" ? 16774890 : 14016240, theme.dir);
	dir.position.set(-14, 28, 10);
	scene.add(dir);
	const floorTex = groundTexture(mapId);
	const floorMat = std(16777215, .95);
	floorMat.map = floorTex;
	const floor = new Mesh(new CircleGeometry(38, 48), floorMat);
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);
	const curb = new Mesh(new TorusGeometry(30, .18, 6, 64), new MeshStandardMaterial({
		color: mapId === "hq" ? 14826299 : 1708564,
		roughness: .8
	}));
	curb.rotation.x = Math.PI / 2;
	curb.position.y = .08;
	scene.add(curb);
	const disposables = [floorTex];
	if (mapId === "forest") {
		const moon = new Mesh(new SphereGeometry(2.1, 16, 12), new MeshBasicMaterial({ color: 15984351 }));
		moon.position.set(16, 20, -24);
		scene.add(moon);
	}
	const trees = sim.obstacles.filter((o) => o.kind === "tree");
	if (trees.length) {
		const trunkGeo = new CylinderGeometry(.22, .34, 1.7, 5);
		const leafGeo = new ConeGeometry(1.25, 2.6, 6);
		const trunkMat = new MeshLambertMaterial({ color: 3811868 });
		const leafMat = new MeshLambertMaterial({ color: 1915426 });
		const trunks = new InstancedMesh(trunkGeo, trunkMat, trees.length);
		const leaves = new InstancedMesh(leafGeo, leafMat, trees.length);
		const dummy = new Object3D();
		trees.forEach((o, i) => {
			dummy.position.set(o.x, .85, o.z);
			dummy.rotation.set(0, o.x * .4, 0);
			dummy.scale.set(1, .85 + i % 4 * .12, 1);
			dummy.updateMatrix();
			trunks.setMatrixAt(i, dummy.matrix);
			dummy.position.y = 2.35;
			dummy.updateMatrix();
			leaves.setMatrixAt(i, dummy.matrix);
		});
		scene.add(trunks, leaves);
		disposables.push(trunkGeo, leafGeo, trunkMat, leafMat);
	}
	const winTex = mapId === "city" ? windowTexture() : null;
	if (winTex) disposables.push(winTex);
	for (const o of sim.obstacles) if (o.kind === "building") {
		const h = mapId === "hq" ? 4.2 : 5 + Math.abs(Math.sin(o.x * .35 + o.z)) * 6;
		const mat = std(mapId === "hq" ? 16052198 : 2896188, .8);
		if (winTex && mapId === "city") mat.map = winTex;
		const mesh = new Mesh(new BoxGeometry(o.r * 1.85, h, o.r * 1.85), mat);
		mesh.position.set(o.x, h / 2, o.z);
		scene.add(mesh);
		disposables.push(mesh.geometry, mat);
	} else if (o.kind === "rock") {
		const mesh = new Mesh(new DodecahedronGeometry(o.r, 0), std(4867647, .9));
		mesh.position.set(o.x, o.r * .45, o.z);
		mesh.scale.y = .7;
		scene.add(mesh);
		disposables.push(mesh.geometry);
	} else if (o.kind === "pillar") {
		const mesh = new Mesh(new CylinderGeometry(o.r, o.r * 1.05, 6.5, 8), std(16052198, .45));
		mesh.position.set(o.x, 3.25, o.z);
		const cap = new Mesh(new BoxGeometry(o.r * 2.2, .35, o.r * 2.2), std(14826299, .5));
		cap.position.set(o.x, 6.4, o.z);
		scene.add(mesh, cap);
	} else if (o.kind === "monument") {
		const white = std(16052198, .4);
		const red = std(14826299, .45);
		const tower = new Mesh(new BoxGeometry(7.2, 11, 7.2), white);
		tower.position.set(o.x, 5.5, o.z);
		const band = new Mesh(new BoxGeometry(7.7, 1.25, 7.7), red);
		band.position.set(o.x, 8.1, o.z);
		const cap = new Mesh(new BoxGeometry(3.6, 1.8, 3.6), red);
		cap.position.set(o.x, 11.5, o.z);
		scene.add(tower, band, cap);
	}
	if (mapId === "city") {
		const metal = std(2237998, .4);
		for (const [x, z] of [
			[3, 12],
			[3, -12],
			[12, 3],
			[-12, 3]
		]) {
			const pole = new Mesh(new CylinderGeometry(.08, .1, 4.2, 6), metal);
			pole.position.set(x, 2.1, z);
			const lamp = new PointLight(16763274, .7, 16, 2);
			lamp.position.set(x, 4, z);
			scene.add(pole, lamp);
		}
	}
	const genGroups = [];
	const genGeoCore = new CylinderGeometry(.32, .32, 1.15, 8);
	const genGeoBase = new CylinderGeometry(1.05, 1.2, .7, 8);
	const genGeoRing = new TorusGeometry(.9, .055, 6, 18);
	for (const g of sim.gens) {
		const group = new Group();
		const base = new Mesh(genGeoBase, std(2366490, .85));
		base.position.y = .35;
		const coreMat = new MeshStandardMaterial({
			color: 14987610,
			emissive: 14987610,
			emissiveIntensity: .25,
			roughness: .35
		});
		const core = new Mesh(genGeoCore, coreMat);
		core.position.y = 1.15;
		const ring = new Mesh(genGeoRing, new MeshStandardMaterial({
			color: 14826299,
			emissive: 14826299,
			emissiveIntensity: .6,
			roughness: .4
		}));
		ring.rotation.x = Math.PI / 2;
		ring.position.y = 1.45;
		group.add(base, core, ring);
		group.position.set(g.x, 0, g.z);
		group.userData = {
			coreMat,
			ring
		};
		scene.add(group);
		genGroups.push(group);
	}
	const avatars = /* @__PURE__ */ new Map();
	const pizzas = /* @__PURE__ */ new Map();
	const desired = new Vector3();
	const look = new Vector3();
	function ensureAvatar(a) {
		let g = avatars.get(a.id);
		if (!g) {
			g = buildAvatar(a.charId);
			avatars.set(a.id, g);
			scene.add(g);
		}
		return g;
	}
	function syncAvatar(a, group) {
		const sunk = a.alive ? 0 : Math.min(1.3, Math.max(0, .8 - a.corpse) * .7);
		group.position.set(a.x, -sunk, a.z);
		group.rotation.y = a.yaw + Math.PI;
		group.rotation.z = a.alive ? 0 : 1.15;
		group.visible = a.alive || a.corpse > 0;
		const parts = group.userData.parts;
		const swing = Math.sin(sim.elapsed * 9 + a.x) * Math.min(a.speed / 7, 1) * .65;
		if (a.alive) {
			parts.lLeg.rotation.x = swing;
			parts.rLeg.rotation.x = -swing;
			parts.lArm.rotation.x = -swing * .8;
			parts.rArm.rotation.x = a.attackCd > 0 && a.attackCd > a.attackDur - .16 ? -1.45 : swing * .8;
		}
		let mode = "norm";
		if (a.flash > 0) mode = "flash";
		else if (a.buff > 0) mode = "stone";
		else if (a.stun > 0) mode = "stun";
		if (group.userData.mode !== mode) {
			group.userData.mode = mode;
			const mats = group.userData.mats;
			for (const m of mats) {
				const base = m.userData.base ?? m.color.getHex();
				if (mode === "flash") m.color.setHex(16777215);
				else if (mode === "stone") m.color.setHex(10133670);
				else m.color.setHex(base);
				m.emissive.setHex(mode === "stun" ? 14987610 : 0);
				m.emissiveIntensity = mode === "stun" ? .35 : 0;
			}
		}
	}
	let sizedW = 0;
	let sizedH = 0;
	function resize() {
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		if (w < 2 || h < 2 || w === sizedW && h === sizedH) return;
		sizedW = w;
		sizedH = h;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}
	const ro = new ResizeObserver(() => resize());
	ro.observe(canvas);
	resize();
	return {
		resize,
		render(dt) {
			resize();
			const seen = /* @__PURE__ */ new Set();
			for (const a of sim.actors) {
				syncAvatar(a, ensureAvatar(a));
				seen.add(a.id);
			}
			for (const [id, g] of avatars) if (!seen.has(id)) {
				scene.remove(g);
				avatars.delete(id);
			}
			sim.gens.forEach((g, i) => {
				const group = genGroups[i];
				if (!group) return;
				const ring = group.userData.ring;
				const coreMat = group.userData.coreMat;
				ring.rotation.z = sim.elapsed * (g.done ? .4 : 2.2);
				coreMat.emissiveIntensity = g.done ? 1.7 : .15 + g.progress * 1.3;
			});
			const alivePizza = /* @__PURE__ */ new Set();
			for (const p of sim.pizzas) {
				alivePizza.add(p.id);
				let mesh = pizzas.get(p.id);
				if (!mesh) {
					mesh = new Group();
					const crust = new Mesh(new CylinderGeometry(.38, .38, .1, 10), std(14197082, .6));
					const top = new Mesh(new CylinderGeometry(.3, .3, .08, 10), std(12857658, .5));
					top.position.y = .08;
					mesh.add(crust, top);
					scene.add(mesh);
					pizzas.set(p.id, mesh);
				}
				mesh.position.set(p.x, .35 + Math.sin(sim.elapsed * 4 + p.id) * .06, p.z);
			}
			for (const [key, mesh] of pizzas) if (!alivePizza.has(key)) {
				scene.remove(mesh);
				pizzas.delete(key);
			}
			const p = sim.player;
			const yaw = sim.camYaw;
			const pitch = sim.camPitch;
			const fx = -Math.sin(yaw);
			const fz = -Math.cos(yaw);
			const back = Math.cos(pitch) * 9.2;
			const height = Math.sin(pitch) * 9.2;
			desired.set(p.x - fx * back, 1.35 + height, p.z - fz * back);
			camera.position.copy(desired);
			look.set(p.x + fx * 1.1, 1.45, p.z + fz * 1.1);
			if (sim.shake > .01) {
				camera.position.x += (Math.random() - .5) * sim.shake;
				camera.position.y += (Math.random() - .5) * sim.shake * .5;
			}
			camera.lookAt(look);
			renderer.render(scene, camera);
		},
		dispose() {
			ro.disconnect();
			const geos = /* @__PURE__ */ new Set();
			const mats = /* @__PURE__ */ new Set();
			scene.traverse((obj) => {
				const mesh = obj;
				if (mesh.geometry) geos.add(mesh.geometry);
				const mat = mesh.material;
				if (Array.isArray(mat)) mat.forEach((m) => mats.add(m));
				else if (mat) mats.add(mat);
			});
			geos.forEach((g) => g.dispose());
			mats.forEach((m) => m.dispose());
			for (const d of disposables) d.dispose();
			renderer.dispose();
		}
	};
}
var BLOCK = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Space"
]);
function startEngine(canvas, opts, onHud) {
	unlockAudio();
	const sim = createSim(opts, (amount) => addMoney(amount));
	const view = createView(canvas, sim);
	let raf = 0;
	let acc = 0;
	let last = performance.now();
	let paused = document.hidden;
	const loop = (now) => {
		const dt = Math.min(.05, (now - last) / 1e3);
		last = now;
		if (!paused) {
			acc += dt;
			let steps = 0;
			while (acc >= 1 / 60 && steps < 5) {
				sim.tick(1 / 60);
				acc -= 1 / 60;
				steps++;
			}
			for (const e of sim.drainEvents()) playSfx(e.kind);
			view.render(dt);
			onHud(sim.getHud());
		}
		raf = requestAnimationFrame(loop);
	};
	const onKeyDown = (e) => {
		if (BLOCK.has(e.code)) e.preventDefault();
		if (e.repeat) return;
		sim.keys.add(e.code);
		if (e.code === "ShiftLeft" || e.code === "ShiftRight") sim.toggleSprint();
		if (e.code === "KeyQ") sim.queueAbility();
		if (e.code === "KeyH") sim.queueHat();
		if (e.code === "KeyR") sim.queueRecharge();
	};
	const onKeyUp = (e) => {
		sim.keys.delete(e.code);
	};
	let lookId = null;
	let lookX = 0;
	let lookY = 0;
	const onBlur = () => {
		sim.keys.clear();
		sim.mouseAttack = false;
		sim.attackButton = false;
		sim.fixHeld = false;
		sim.setStick(0, 0, false);
		lookId = null;
	};
	const onPointerDown = (e) => {
		const mouseLook = e.pointerType === "mouse" && e.button === 2;
		const touchLook = e.pointerType === "touch" || e.pointerType === "pen";
		if (e.pointerType === "mouse" && e.button === 0) sim.mouseAttack = true;
		if (!mouseLook && !touchLook) return;
		if (lookId != null) return;
		lookId = e.pointerId;
		lookX = e.clientX;
		lookY = e.clientY;
		try {
			canvas.setPointerCapture(e.pointerId);
		} catch {}
		e.preventDefault();
	};
	const onPointerMove = (e) => {
		if (e.pointerId !== lookId) return;
		const dx = e.clientX - lookX;
		const dy = e.clientY - lookY;
		lookX = e.clientX;
		lookY = e.clientY;
		if (dx !== 0 || dy !== 0) sim.addLook(dx, dy);
	};
	const onPointerUp = (e) => {
		sim.mouseAttack = false;
		if (e.pointerId === lookId) lookId = null;
	};
	const onContext = (e) => e.preventDefault();
	const onVis = () => {
		paused = document.hidden;
		last = performance.now();
		if (paused) onBlur();
	};
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", onBlur);
	window.addEventListener("pointermove", onPointerMove);
	window.addEventListener("pointerup", onPointerUp);
	window.addEventListener("pointercancel", onPointerUp);
	document.addEventListener("visibilitychange", onVis);
	canvas.addEventListener("pointerdown", onPointerDown);
	canvas.addEventListener("contextmenu", onContext);
	onHud(sim.getHud());
	raf = requestAnimationFrame(loop);
	if (new URLSearchParams(location.search).has("qa")) {
		window.__controlsTest = {
			getYaw: () => sim.getYaw(),
			getCamYaw: () => sim.camYaw,
			getSpeed: () => sim.getSpeed(),
			setKeys: (codes) => sim.setKeys(codes)
		};
		window.__forsakenDebug = {
			completeGen: () => sim.debugCompleteNearestGen(),
			getEarned: () => sim.earned
		};
	}
	return {
		destroy() {
			cancelAnimationFrame(raf);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
			document.removeEventListener("visibilitychange", onVis);
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("contextmenu", onContext);
			view.dispose();
			if (window.__controlsTest) delete window.__controlsTest;
			if (window.__forsakenDebug) delete window.__forsakenDebug;
		},
		toggleSprint: () => sim.toggleSprint(),
		setStick: (x, y, active) => sim.setStick(x, y, active),
		setAttackButton: (held) => {
			sim.attackButton = held;
		},
		queueAbility: () => sim.queueAbility(),
		queueHat: () => sim.queueHat(),
		queueRecharge: () => sim.queueRecharge(),
		setFixHeld: (held) => sim.setFixHeld(held)
	};
}
//#endregion
export { startEngine };
