import { i as __toESM } from "../_runtime.mjs";
import { G as require_jsx_runtime, K as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Skull, c as LogOut, d as ArrowLeft, l as Coins, n as Volume2, o as Settings, r as Users, s as Play, t as VolumeX, u as ArrowUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bc1UhYxp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var CHARACTERS = [
	{
		id: "noob",
		name: "Noob",
		role: "survivor",
		price: 0,
		hp: 100,
		abilityName: "SlateSkin",
		abilityCd: 40,
		abilityText: "SlateSkin — stone guard for 5 seconds. 40s cooldown. Damage taken is cut.",
		attackName: "Shove",
		attackCd: .8,
		attackDamage: 8,
		attackRange: 1.9,
		scale: 1,
		move: 1,
		colors: {
			head: 15913520,
			torso: 3827396,
			arm: 15913520,
			leg: 4033093
		}
	},
	{
		id: "shedletsky",
		name: "Shedletsky",
		role: "survivor",
		price: 20,
		hp: 105,
		abilityName: "Slash",
		abilityCd: 30,
		abilityText: "Slash — stun the killer for 5 seconds. 30s cooldown.",
		attackName: "Swing",
		attackCd: .7,
		attackDamage: 12,
		attackRange: 2.25,
		scale: 1.02,
		move: 1,
		colors: {
			head: 15778122,
			torso: 3100569,
			arm: 15778122,
			leg: 2763306
		}
	},
	{
		id: "elliot",
		name: "Elliot",
		role: "survivor",
		price: 18,
		hp: 80,
		abilityName: "Pizza",
		abilityCd: 35,
		abilityText: "Throw pizza — only other survivors on low health can eat it. Not you. 35s cooldown.",
		attackName: "Shove",
		attackCd: .8,
		attackDamage: 6,
		attackRange: 1.8,
		scale: 1,
		move: 1.08,
		colors: {
			head: 15778122,
			torso: 12857658,
			arm: 15778122,
			leg: 4863016
		}
	},
	{
		id: "chance",
		name: "Chance",
		role: "survivor",
		price: 60,
		hp: 120,
		abilityName: "Flip Coin",
		abilityCd: .1,
		abilityText: "Extra HP — 1% chance for +2 to +8 health.\nFlip Coin — 0.10s. 50% Weakness 1–10 for 50s. 0.10% Powerful 1–4 for 50s.\nShot — 45s cooldown, 30 damage.\nRepair Hat — clears Weakness and Powerful.\nRecharge — reloads Shot and doubles the next one.",
		attackName: "Shot",
		attackCd: 45,
		attackDamage: 30,
		attackRange: 16,
		scale: 1,
		move: 1,
		colors: {
			head: 15127472,
			torso: 2894386,
			arm: 15127472,
			leg: 1841698
		}
	},
	{
		id: "jason",
		name: "Jason",
		role: "killer",
		price: 0,
		hp: 2e3,
		abilityName: "Behead",
		abilityCd: 25,
		abilityText: "Slash, and Behead — a heavy hit that executes a wounded survivor. 25s cooldown.",
		attackName: "Slash",
		attackCd: .72,
		attackDamage: 26,
		attackRange: 2.55,
		scale: 1.18,
		move: 1.02,
		colors: {
			head: 16052714,
			torso: 4016690,
			arm: 13351066,
			leg: 2761756
		}
	},
	{
		id: "coolkid",
		name: "Coolkid",
		role: "killer",
		price: 990,
		hp: 1e3,
		abilityName: "Minions",
		abilityCd: 30,
		abilityText: "Punch, and Spawn 2 minions. 30s cooldown.",
		attackName: "Punch",
		attackCd: .55,
		attackDamage: 20,
		attackRange: 2.2,
		scale: 1.05,
		move: 1.18,
		colors: {
			head: 13706282,
			torso: 1710618,
			arm: 13706282,
			leg: 13706282
		}
	},
	{
		id: "johndoe",
		name: "John Doe",
		role: "killer",
		price: 1e3,
		hp: 5e3,
		abilityName: "Super Slash",
		abilityCd: 50,
		abilityText: "Slash, and Super Slash — a lunging blow. 50s cooldown.",
		attackName: "Slash",
		attackCd: .95,
		attackDamage: 36,
		attackRange: 2.75,
		scale: 1.38,
		move: .84,
		colors: {
			head: 1708564,
			torso: 7216162,
			arm: 2763306,
			leg: 1313806
		}
	}
];
var MINION_VISUAL = {
	head: 13706282,
	torso: 1710618,
	arm: 13706282,
	leg: 8000536
};
var CHAR_MAP = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));
function getChar(id) {
	const c = CHAR_MAP[id];
	if (!c) throw new Error(`Unknown character ${id}`);
	return c;
}
function charsByRole(role) {
	return CHARACTERS.filter((c) => c.role === role);
}
var MAPS = [
	{
		id: "forest",
		name: "Forest",
		weight: 40,
		odds: "40%"
	},
	{
		id: "city",
		name: "City",
		weight: 1,
		odds: "1.0%"
	},
	{
		id: "hq",
		name: "Roblox HQ",
		weight: .3,
		odds: "0.3%"
	}
];
function mapName(id) {
	return MAPS.find((m) => m.id === id)?.name ?? "Forest";
}
function rollMap() {
	const sum = MAPS.reduce((s, m) => s + m.weight, 0);
	let r = Math.random() * sum;
	for (const m of MAPS) {
		r -= m.weight;
		if (r <= 0) return m.id;
	}
	return "forest";
}
function rollBotKiller() {
	const r = Math.random();
	if (r < .7) return "jason";
	if (r < .9) return "coolkid";
	return "johndoe";
}
function rollRandomMatch(profile) {
	if (!profile.equippedSurvivor || !profile.equippedKiller) return "Equip a survivor and a killer first.";
	const mapId = rollMap();
	const youKiller = Math.random() < .5;
	const killerCharId = youKiller ? profile.equippedKiller : rollBotKiller();
	return {
		mapId,
		mapName: mapName(mapId),
		mode: "random",
		playerRole: youKiller ? "killer" : "survivor",
		playerCharId: youKiller ? profile.equippedKiller : profile.equippedSurvivor,
		killerCharId,
		reveal: youKiller ? "The killer is you." : `The killer is ${getChar(killerCharId).name}.`
	};
}
function makeServerMatch(role, map, profile) {
	const charId = role === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
	if (!charId) return role === "survivor" ? "Equip a survivor first." : "Equip a killer first.";
	const mapId = map === "random" ? rollMap() : map;
	const killerCharId = role === "killer" ? charId : rollBotKiller();
	return {
		mapId,
		mapName: mapName(mapId),
		mode: "server",
		playerRole: role,
		playerCharId: charId,
		killerCharId,
		reveal: role === "killer" ? "Your server. You are the killer." : `Your server. Killer: ${getChar(killerCharId).name}.`
	};
}
function makePractice(role, profile) {
	const charId = role === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
	if (!charId) return role === "survivor" ? "Equip a survivor first." : "Equip a killer first.";
	return {
		mapId: "forest",
		mapName: "Forest",
		mode: "practice",
		playerRole: role,
		playerCharId: charId,
		killerCharId: role === "killer" ? charId : "jason",
		reveal: "Practice. Generators you finish still pay."
	};
}
function formatTime(t) {
	const s = Math.max(0, Math.ceil(t - 1e-4));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function moneyText(n) {
	return `$${n.toFixed(2)}`;
}
var BUTTON_IDS = [
	"leave",
	"stamina",
	"attack",
	"ability",
	"fix"
];
var UI_IDS = [
	"survivors",
	"gens",
	"timer",
	"money",
	"vitals",
	"stick"
];
var META = {
	survivors: {
		anchor: "tl",
		x: 1.5,
		y: 2,
		place: "absolute top-3 left-3",
		custom: ""
	},
	gens: {
		anchor: "tl",
		x: 1.5,
		y: 22,
		place: "absolute top-24 left-3",
		custom: ""
	},
	timer: {
		anchor: "tc",
		x: 50,
		y: 2,
		place: "absolute top-3 left-1/2 w-44 -translate-x-1/2 text-center sm:w-64",
		custom: "w-44 text-center sm:w-64"
	},
	money: {
		anchor: "tr",
		x: 1.5,
		y: 2,
		place: "absolute top-3 right-3",
		custom: ""
	},
	vitals: {
		anchor: "bl",
		x: 1.5,
		y: 2,
		place: "absolute bottom-4 left-3",
		custom: ""
	},
	stick: {
		anchor: "bl",
		x: 1.5,
		y: 34,
		place: "absolute bottom-40 left-3",
		custom: ""
	},
	leave: {
		anchor: "tr",
		x: 1.5,
		y: 16,
		place: "absolute top-20 right-3",
		custom: ""
	},
	stamina: {
		anchor: "br",
		x: 1.5,
		y: 42,
		place: "absolute right-3 bottom-44",
		custom: ""
	},
	attack: {
		anchor: "br",
		x: 1.5,
		y: 26,
		place: "absolute right-3 bottom-28",
		custom: ""
	},
	ability: {
		anchor: "br",
		x: 1.5,
		y: 2,
		place: "absolute right-3 bottom-4",
		custom: ""
	},
	fix: {
		anchor: "bc",
		x: 50,
		y: 2,
		place: "absolute bottom-4 left-1/2 -translate-x-1/2",
		custom: ""
	}
};
function isButton(id) {
	return BUTTON_IDS.includes(id);
}
function defaultPos(id) {
	return {
		x: META[id].x,
		y: META[id].y
	};
}
function placeClass(id, custom) {
	return custom ? META[id].custom : META[id].place;
}
function slotStyle(id, pos) {
	const a = META[id].anchor;
	if (a === "tr") return {
		position: "absolute",
		right: `${pos.x}%`,
		top: `${pos.y}%`
	};
	if (a === "tc") return {
		position: "absolute",
		left: `${pos.x}%`,
		top: `${pos.y}%`,
		transform: "translateX(-50%)"
	};
	if (a === "bl") return {
		position: "absolute",
		left: `${pos.x}%`,
		bottom: `${pos.y}%`
	};
	if (a === "br") return {
		position: "absolute",
		right: `${pos.x}%`,
		bottom: `${pos.y}%`
	};
	if (a === "bc") return {
		position: "absolute",
		left: `${pos.x}%`,
		bottom: `${pos.y}%`,
		transform: "translateX(-50%)"
	};
	return {
		position: "absolute",
		left: `${pos.x}%`,
		top: `${pos.y}%`
	};
}
function clamp(n) {
	return Math.min(96, Math.max(0, Math.round(n * 10) / 10));
}
function nudge(id, start, dxPct, dyPct) {
	const a = META[id].anchor;
	const x = a === "tr" || a === "br" ? start.x - dxPct : start.x + dxPct;
	const y = a === "bl" || a === "br" || a === "bc" ? start.y - dyPct : start.y + dyPct;
	return {
		x: clamp(x),
		y: clamp(y)
	};
}
var KEY = "forsaken.v1";
var DEFAULT = {
	version: 1,
	money: 0,
	ownedSurvivors: ["noob"],
	ownedKillers: ["jason"],
	equippedSurvivor: "noob",
	equippedKiller: "jason",
	muted: false,
	sfx: 100,
	music: 100,
	sensitive: false,
	buttons: {},
	ui: {}
};
var profile = DEFAULT;
var listeners = /* @__PURE__ */ new Set();
var attached = false;
function roundMoney(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.round(Math.max(0, n) * 100) / 100;
}
function clampPct(n, fallback) {
	const v = Number(n);
	if (!Number.isFinite(v)) return fallback;
	return Math.min(100, Math.max(0, Math.round(v)));
}
function sanitizePosMap(raw, ids) {
	const out = {};
	if (!raw || typeof raw !== "object") return out;
	const bag = raw;
	for (const id of ids) {
		const p = bag[id];
		const x = Number(p?.x);
		const y = Number(p?.y);
		if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
		out[id] = {
			x: Math.min(96, Math.max(0, x)),
			y: Math.min(96, Math.max(0, y))
		};
	}
	return out;
}
function sanitize(raw) {
	const ownedS = new Set(Array.isArray(raw?.ownedSurvivors) ? raw.ownedSurvivors : []);
	const ownedK = new Set(Array.isArray(raw?.ownedKillers) ? raw.ownedKillers : []);
	ownedS.add("noob");
	ownedK.add("jason");
	for (const id of [...ownedS]) try {
		if (getChar(id).role !== "survivor") ownedS.delete(id);
	} catch {
		ownedS.delete(id);
	}
	for (const id of [...ownedK]) try {
		if (getChar(id).role !== "killer") ownedK.delete(id);
	} catch {
		ownedK.delete(id);
	}
	let equippedSurvivor = raw && "equippedSurvivor" in raw ? raw.equippedSurvivor ?? null : "noob";
	let equippedKiller = raw && "equippedKiller" in raw ? raw.equippedKiller ?? null : "jason";
	if (equippedSurvivor && !ownedS.has(equippedSurvivor)) equippedSurvivor = "noob";
	if (equippedKiller && !ownedK.has(equippedKiller)) equippedKiller = "jason";
	return {
		version: 1,
		money: roundMoney(Number(raw?.money ?? 0)),
		ownedSurvivors: [...ownedS],
		ownedKillers: [...ownedK],
		equippedSurvivor,
		equippedKiller,
		muted: Boolean(raw?.muted),
		sfx: clampPct(raw?.sfx, 100),
		music: clampPct(raw?.music, 100),
		sensitive: Boolean(raw?.sensitive),
		buttons: sanitizePosMap(raw?.buttons, BUTTON_IDS),
		ui: sanitizePosMap(raw?.ui, UI_IDS)
	};
}
function writeDisk(p) {
	if (typeof localStorage === "undefined") return;
	try {
		const prev = localStorage.getItem(KEY);
		if (prev) localStorage.setItem(`${KEY}.bak`, prev);
		localStorage.setItem(KEY, JSON.stringify(p));
	} catch {}
}
function readDisk() {
	if (typeof localStorage === "undefined") return DEFAULT;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULT;
		return sanitize(JSON.parse(raw));
	} catch {
		try {
			const bak = localStorage.getItem(`${KEY}.bak`);
			if (bak) return sanitize(JSON.parse(bak));
		} catch {}
		return DEFAULT;
	}
}
function emit() {
	listeners.forEach((l) => l());
}
function commit(next) {
	profile = next;
	writeDisk(profile);
	emit();
}
function loadSave() {
	attach();
	const next = readDisk();
	if (JSON.stringify(next) !== JSON.stringify(profile)) {
		profile = next;
		emit();
	}
	try {
		navigator.storage?.persist?.();
	} catch {}
}
function attach() {
	if (attached || typeof window === "undefined") return;
	attached = true;
	const flush = () => writeDisk(profile);
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") flush();
	});
	window.addEventListener("pagehide", flush);
	window.addEventListener("beforeunload", flush);
}
function getProfile() {
	return profile;
}
function subscribe(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
function useProfile() {
	return (0, import_react.useSyncExternalStore)(subscribe, getProfile, getProfile);
}
function addMoney(amount) {
	commit({
		...profile,
		money: roundMoney(profile.money + amount)
	});
}
function toggleMuted() {
	commit({
		...profile,
		muted: !profile.muted
	});
}
function setSfx(value) {
	commit({
		...profile,
		sfx: clampPct(value, profile.sfx)
	});
}
function setMusic(value) {
	commit({
		...profile,
		music: clampPct(value, profile.music)
	});
}
function setSensitive(on) {
	commit({
		...profile,
		sensitive: on
	});
}
function setButtonPos(id, pos) {
	commit({
		...profile,
		buttons: {
			...profile.buttons,
			[id]: pos
		}
	});
}
function setUiPos(id, pos) {
	commit({
		...profile,
		ui: {
			...profile.ui,
			[id]: pos
		}
	});
}
function resetButtons() {
	commit({
		...profile,
		buttons: {}
	});
}
function resetUi() {
	commit({
		...profile,
		ui: {}
	});
}
function equipSurvivor(id) {
	if (id && !profile.ownedSurvivors.includes(id)) return;
	commit({
		...profile,
		equippedSurvivor: id
	});
}
function equipKiller(id) {
	if (id && !profile.ownedKillers.includes(id)) return;
	commit({
		...profile,
		equippedKiller: id
	});
}
function buyCharacter(id) {
	const def = getChar(id);
	if ((def.role === "survivor" ? profile.ownedSurvivors : profile.ownedKillers).includes(id)) return null;
	if (profile.money < def.price) return "Not enough money";
	if (def.role === "survivor") commit({
		...profile,
		money: roundMoney(profile.money - def.price),
		ownedSurvivors: [...profile.ownedSurvivors, id],
		equippedSurvivor: id
	});
	else commit({
		...profile,
		money: roundMoney(profile.money - def.price),
		ownedKillers: [...profile.ownedKillers, id],
		equippedKiller: id
	});
	return null;
}
var ctx = null;
var master = null;
var sfxBus = null;
var musicBus = null;
var musicOn = false;
function mix() {
	if (!sfxBus || !musicBus) return;
	const p = getProfile();
	const mute = p.muted ? 0 : 1;
	const soft = p.sensitive ? .5 : 1;
	sfxBus.gain.value = p.sfx / 100 * soft * mute;
	musicBus.gain.value = p.music / 100 * soft * mute * .08;
}
function unlockAudio() {
	if (typeof window === "undefined") return;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = .2;
		sfxBus = ctx.createGain();
		musicBus = ctx.createGain();
		sfxBus.connect(master);
		musicBus.connect(master);
		master.connect(ctx.destination);
		mix();
	}
	if (ctx.state === "suspended") ctx.resume();
	startMusic();
}
function startMusic() {
	if (!ctx || !musicBus || musicOn) return;
	musicOn = true;
	const bed = ctx.createGain();
	bed.gain.value = .85;
	const low = ctx.createOscillator();
	const mid = ctx.createOscillator();
	const midG = ctx.createGain();
	low.type = "triangle";
	mid.type = "sine";
	low.frequency.value = 55;
	mid.frequency.value = 82.5;
	midG.gain.value = .3;
	low.connect(bed);
	mid.connect(midG);
	midG.connect(bed);
	bed.connect(musicBus);
	low.start();
	mid.start();
}
function tone(freq, dur, type, gain, delay = 0) {
	const p = getProfile();
	if (!ctx || !sfxBus || p.muted || p.sfx <= 0) return;
	const wave = p.sensitive && (type === "square" || type === "sawtooth") ? "triangle" : type;
	const t = ctx.currentTime + delay;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = wave;
	o.frequency.setValueAtTime(p.sensitive ? freq * .92 : freq, t);
	g.gain.setValueAtTime(gain, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	o.connect(g);
	g.connect(sfxBus);
	o.start(t);
	o.stop(t + dur + .02);
}
function playSfx(kind) {
	const p = getProfile();
	if (!ctx || p.muted || p.sfx <= 0) return;
	switch (kind) {
		case "hit":
			tone(160, .08, "square", .2);
			tone(90, .12, "sawtooth", .08);
			break;
		case "down":
			tone(110, .25, "sawtooth", .18);
			tone(70, .4, "triangle", .12, .05);
			break;
		case "gen":
			tone(330, .12, "square", .12);
			tone(440, .16, "square", .1, .08);
			tone(660, .22, "square", .08, .16);
			break;
		case "coin":
			tone(880, .1, "square", .1);
			tone(1320, .14, "square", .08, .06);
			break;
		case "ability":
			tone(220, .16, "sawtooth", .12);
			tone(440, .12, "triangle", .08, .04);
			break;
		case "stun":
			tone(80, .3, "square", .16);
			break;
		case "heal":
			tone(520, .1, "sine", .1);
			tone(780, .14, "sine", .08, .06);
			break;
		case "win":
			tone(392, .12, "triangle", .12);
			tone(523, .14, "triangle", .1, .1);
			tone(659, .22, "triangle", .1, .2);
			break;
		case "lose":
			tone(196, .2, "triangle", .12);
			tone(146, .28, "triangle", .1, .12);
			tone(98, .4, "sawtooth", .08, .24);
	}
}
subscribe(() => mix());
function useTouchUi() {
	const [on, setOn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const apply = () => {
			const coarse = window.matchMedia("(pointer: coarse)").matches;
			setOn(coarse || window.innerWidth < 900);
		};
		apply();
		window.addEventListener("resize", apply);
		return () => window.removeEventListener("resize", apply);
	}, []);
	return on;
}
function Place({ id, children }) {
	const profile = useProfile();
	const custom = isButton(id) ? profile.buttons[id] : profile.ui[id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: placeClass(id, custom),
		style: custom ? slotStyle(id, custom) : void 0,
		children
	});
}
function hold(start, end) {
	return {
		onPointerDown: (e) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			e.preventDefault();
			start();
		},
		onPointerUp: end,
		onPointerCancel: end
	};
}
function Stick({ onChange }) {
	const padRef = (0, import_react.useRef)(null);
	const onChangeRef = (0, import_react.useRef)(onChange);
	onChangeRef.current = onChange;
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	(0, import_react.useEffect)(() => {
		const el = padRef.current;
		if (!el) return;
		let pid = null;
		const max = 34;
		const emit = (clientX, clientY, active) => {
			if (!active) {
				setKnob({
					x: 0,
					y: 0
				});
				onChangeRef.current(0, 0, false);
				return;
			}
			const rect = el.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			let dx = clientX - cx;
			let dy = clientY - cy;
			const len = Math.hypot(dx, dy) || 1;
			if (len > max) {
				dx = dx / len * max;
				dy = dy / len * max;
			}
			setKnob({
				x: dx,
				y: dy
			});
			const nx = dx / max;
			const ny = -dy / max;
			const dead = .1;
			onChangeRef.current(Math.abs(nx) < dead ? 0 : nx, Math.abs(ny) < dead ? 0 : ny, true);
		};
		const down = (e) => {
			if (e.pointerType === "mouse" && e.button !== 0) return;
			if (pid != null) return;
			pid = e.pointerId;
			try {
				el.setPointerCapture(e.pointerId);
			} catch {}
			e.preventDefault();
			emit(e.clientX, e.clientY, true);
		};
		const move = (e) => {
			if (e.pointerId !== pid) return;
			e.preventDefault();
			emit(e.clientX, e.clientY, true);
		};
		const up = (e) => {
			if (e.pointerId !== pid) return;
			pid = null;
			try {
				if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
			} catch {}
			emit(0, 0, false);
		};
		const blockMenu = (e) => e.preventDefault();
		el.addEventListener("pointerdown", down, { passive: false });
		el.addEventListener("contextmenu", blockMenu);
		window.addEventListener("pointermove", move, { passive: false });
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
		return () => {
			el.removeEventListener("pointerdown", down);
			el.removeEventListener("contextmenu", blockMenu);
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
			onChangeRef.current(0, 0, false);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative h-28 w-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: padRef,
			className: "pointer-events-auto absolute -inset-8 touch-none select-none",
			style: { touchAction: "none" },
			"aria-label": "Move",
			role: "application",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-8 rounded-full border border-line bg-bg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute top-1/2 left-1/2 h-12 w-12 rounded-full bg-bone",
				style: {
					marginLeft: -24,
					marginTop: -24,
					transform: `translate(${knob.x}px, ${knob.y}px)`
				}
			})]
		})
	});
}
function Bar({ label, value, max, tone, low }) {
	const pct = Math.max(0, Math.min(100, value / Math.max(1, max) * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-40 sm:w-52",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 flex items-center justify-between text-xs tracking-wide text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-fg",
				children: [
					Math.max(0, Math.round(value)),
					"/",
					Math.round(max)
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-3 overflow-hidden rounded-full bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `h-full ${tone === "blood" ? "bg-blood" : "bg-gold"} ${low ? "hp-low" : ""}`,
				style: { width: `${pct}%` }
			})
		})]
	});
}
function Hud({ apiRef, hudRef, opts, onLeave }) {
	const [snap, setSnap] = (0, import_react.useState)(() => hudRef.current);
	const touch = useTouchUi();
	const profile = useProfile();
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const loop = () => {
			setSnap(hudRef.current);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [hudRef]);
	const api = () => apiRef.current;
	const playing = snap.phase === "play";
	const lowHp = snap.hp / Math.max(1, snap.maxHp) < .35;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `pointer-events-none absolute inset-0 ${lowHp || snap.killerNear ? "danger-vignette" : "vignette"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
				id: "survivors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel pointer-events-none px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted",
						children: "SURVIVORS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-3xl leading-none tabular-nums",
						children: [
							snap.survivorsAlive,
							"/",
							snap.survivorsMax
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
				id: "gens",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted",
						children: "GENS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-3xl leading-none tabular-nums text-gold",
						children: [
							snap.gensDone,
							"/",
							snap.gensMax
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Place, {
				id: "timer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-display text-5xl leading-none tabular-nums sm:text-6xl ${snap.timeLeft <= 30 ? "text-blood" : "text-bone"}`,
						children: formatTime(snap.timeLeft)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs tracking-[0.16em] text-muted",
						children: snap.mapName
					}),
					snap.markerText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 inline-flex items-center gap-1 text-sm text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
							className: "h-4 w-4",
							style: { transform: `rotate(${snap.markerAngle}rad)` }
						}), snap.markerText]
					}) : null,
					snap.killerNear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-blood",
						children: "Killer nearby"
					}) : null,
					snap.toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-gold",
						children: snap.toast
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
				id: "money",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel px-3 py-2 text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted",
						children: "MONEY"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl leading-none text-gold tabular-nums",
						children: moneyText(profile.money)
					})]
				})
			}),
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
				id: "leave",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "pointer-events-auto hud-panel inline-flex h-11 items-center gap-2 px-3 text-sm",
					onClick: onLeave,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Leave"]
				})
			}) : null,
			snap.stun > 0 && playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 font-display text-4xl text-gold",
				children: "STUNNED"
			}) : null,
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [touch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
				id: "stick",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stick, { onChange: (x, y, active) => api()?.setStick(x, y, active) })
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Place, {
				id: "vitals",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							label: "HP",
							value: snap.hp,
							max: snap.maxHp,
							tone: "blood",
							low: lowHp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								label: snap.sprintOn ? "STAMINA · ON" : "STAMINA · OFF",
								value: snap.stamina,
								max: snap.maxStamina,
								tone: "gold"
							})
						}),
						snap.sprintOn && snap.stamina < 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-gold",
							children: "Exhausted"
						}) : null,
						snap.weak > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-blood",
							children: [
								"Weakness ",
								snap.weak,
								"/10 · ",
								Math.ceil(snap.weakLeft),
								"s"
							]
						}) : null,
						snap.power > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-gold",
							children: [
								"Powerful ",
								snap.power,
								"/4 · ",
								Math.ceil(snap.powerLeft),
								"s"
							]
						}) : null,
						snap.shotBoost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-gold",
							children: "Enhanced shot"
						}) : null
					]
				}), !touch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-56 text-xs text-muted",
					children: snap.charName === "Chance" ? "WASD move · right-drag look · Shift stamina · Q coin · H hat · R recharge · F shot · E fix" : "WASD move · right-drag look · Shift stamina · Q ability · F attack · E fix · click to attack"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-40 text-xs text-muted",
					children: snap.charName === "Chance" ? "Drag to look. Coin, hat, and recharge are on the right." : "Drag the screen to look. The stick only walks."
				})]
			})] }) : null,
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
					id: "stamina",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": snap.sprintOn,
						className: `pointer-events-auto h-14 w-28 rounded-lg border font-display tracking-wide ${snap.sprintOn ? "border-gold bg-gold text-bg" : "border-line bg-surface text-fg"}`,
						onClick: () => api()?.toggleSprint(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs",
							children: "STAMINA"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg leading-none",
							children: snap.sprintOn ? "ON" : "OFF"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
					id: "attack",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pointer-events-auto h-14 w-28 rounded-lg border border-line bg-surface font-display tracking-wide text-fg",
						...hold(() => api()?.setAttackButton(true), () => api()?.setAttackButton(false)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs",
							children: snap.attackName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg leading-none",
							children: snap.attackCd > .08 ? Math.ceil(snap.attackCd * 10) / 10 : snap.charName === "Chance" ? snap.shotBoost ? "60" : "30" : "HIT"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
					id: "ability",
					children: snap.charName === "Chance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pointer-events-auto h-14 w-28 rounded-lg border border-blood bg-blood font-display tracking-wide text-bone",
								onClick: () => api()?.queueAbility(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs",
									children: "FLIP COIN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-lg leading-none",
									children: "READY"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pointer-events-auto h-14 w-28 rounded-lg border border-line bg-surface font-display tracking-wide text-fg disabled:opacity-60",
								onClick: () => api()?.queueHat(),
								disabled: snap.hatCd > .05,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs",
									children: "REPAIR HAT"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-lg leading-none",
									children: snap.hatCd > .05 ? Math.ceil(snap.hatCd) : "CLEAR"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pointer-events-auto h-14 w-28 rounded-lg border border-gold bg-surface font-display tracking-wide text-gold disabled:opacity-60",
								onClick: () => api()?.queueRecharge(),
								disabled: snap.rechargeCd > .05,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs",
									children: "RECHARGE"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-lg leading-none",
									children: snap.rechargeCd > .05 ? Math.ceil(snap.rechargeCd) : snap.shotBoost ? "LOADED" : "LOAD"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pointer-events-auto h-20 w-28 rounded-lg border border-blood bg-blood font-display tracking-wide text-bone disabled:opacity-60",
						onClick: () => api()?.queueAbility(),
						disabled: snap.abilityCd > 0 && snap.buff <= 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs",
							children: snap.abilityName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-2xl leading-none",
							children: snap.buff > 0 ? snap.buff.toFixed(1) : snap.abilityCd > .05 ? Math.ceil(snap.abilityCd) : "READY"
						})]
					})
				})
			] }) : null,
			playing && snap.nearGen && snap.role === "survivor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Place, {
				id: "fix",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pointer-events-auto h-14 rounded-lg bg-gold px-5 font-display text-lg tracking-wide text-bg",
					...hold(() => api()?.setFixHeld(true), () => api()?.setFixHeld(false)),
					children: snap.fixing ? `Fixing ${Math.round(snap.genProgress * 100)}%` : snap.genProgress > 0 ? `Hold to fix ${Math.round(snap.genProgress * 100)}%` : "Hold to fix"
				})
			}) : null,
			snap.phase === "end" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute inset-0 flex items-center justify-center p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel w-full max-w-md p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.22em] text-muted",
							children: opts.mode === "practice" ? "PRACTICE" : "MATCH"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-4xl text-bone",
							children: snap.endTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted",
							children: snap.endDetail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-gold",
							children: ["Balance ", moneyText(profile.money)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-5 h-12 w-full rounded-lg bg-blood font-display text-lg tracking-wide text-bone",
							onClick: onLeave,
							children: "Back to menu"
						})
					]
				})
			}) : null
		]
	});
}
var btn$1 = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide transition disabled:opacity-40";
var btnPrimary$1 = `${btn$1} h-12 bg-blood px-5 text-lg text-bone`;
var btnGhost$1 = `${btn$1} h-12 border border-line bg-surface px-5 text-lg text-fg`;
function SettingsMenu({ onBack, onCustomize }) {
	const profile = useProfile();
	(0, import_react.useEffect)(() => {
		unlockAudio();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: btnGhost$1,
						onClick: onBack,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" }), "Back"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl",
						children: "Settings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
						className: "h-6 w-6 text-muted",
						"aria-hidden": true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hud-panel mt-6 flex flex-col gap-5 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeRow, {
						label: "SFX",
						value: profile.sfx,
						onChange: setSfx,
						onRelease: () => {
							unlockAudio();
							playSfx("coin");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeRow, {
						label: "Music",
						value: profile.music,
						onChange: setMusic
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl leading-none",
							children: "Sensitive Music and SFX"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Softer hits and a quieter bed."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": profile.sensitive,
							className: `pointer-events-auto h-12 w-20 rounded-lg border font-display text-lg ${profile.sensitive ? "border-gold bg-gold text-bg" : "border-line bg-surface text-fg"}`,
							onClick: () => {
								setSensitive(!profile.sensitive);
								unlockAudio();
								playSfx("hit");
							},
							children: profile.sensitive ? "On" : "Off"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hud-panel mt-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted",
						children: "ONLY BUTTONS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl leading-none",
						children: "Customize all buttons"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Leave, stamina, attack, ability, and fix. The rest of the HUD stays put."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${btnPrimary$1} flex-1`,
							onClick: () => onCustomize("buttons"),
							children: "Customize"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${btnGhost$1} flex-1`,
							disabled: Object.keys(profile.buttons).length === 0,
							onClick: () => resetButtons(),
							children: "Reset"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hud-panel mt-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted",
						children: "INTERFACE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl leading-none",
						children: "Customize UI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Timer, counts, money, health, and the joystick. Buttons stay put."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${btnPrimary$1} flex-1`,
							onClick: () => onCustomize("ui"),
							children: "Customize"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${btnGhost$1} flex-1`,
							disabled: Object.keys(profile.ui).length === 0,
							onClick: () => resetUi(),
							children: "Reset"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted",
				children: "Saves automatically when you leave, switch sites, or close the tab."
			})
		]
	});
}
function VolumeRow({ label, value, onChange, onRelease }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-xl leading-none",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-gold",
				children: [value, "%"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "mt-3 h-11 w-full accent-gold",
			type: "range",
			min: 0,
			max: 100,
			step: 1,
			value,
			"aria-valuetext": `${value}%`,
			onChange: (e) => onChange(Number(e.target.value)),
			onPointerUp: onRelease
		})]
	});
}
var PREVIEW = {
	survivors: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-panel px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-[0.18em] text-muted",
			children: "SURVIVORS"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl leading-none",
			children: "9/9"
		})]
	}),
	gens: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-panel px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-[0.18em] text-muted",
			children: "GENS"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl leading-none text-gold",
			children: "0/5"
		})]
	}),
	timer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-5xl leading-none text-bone",
		children: "4:00"
	}),
	money: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-panel px-3 py-2 text-right",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-[0.18em] text-muted",
			children: "MONEY"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl leading-none text-gold",
			children: "$0.00"
		})]
	}),
	vitals: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-panel w-40 px-3 py-3 sm:w-52",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "HP 100/100"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 h-3 overflow-hidden rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-blood" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: "STAMINA 100/100"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 h-3 overflow-hidden rounded-full bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-gold" })
			})
		]
	}),
	stick: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 w-28 rounded-full border border-line bg-bg" }),
	leave: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hud-panel inline-flex h-11 items-center px-3 text-sm",
		children: "Leave"
	}),
	stamina: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex h-14 w-28 items-center justify-center rounded-lg border border-line bg-surface font-display",
		children: "STAMINA"
	}),
	attack: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex h-14 w-28 items-center justify-center rounded-lg border border-line bg-surface font-display",
		children: "HIT"
	}),
	ability: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex h-20 w-28 items-center justify-center rounded-lg border border-blood bg-blood font-display text-bone",
		children: "ABILITY"
	}),
	fix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "inline-flex h-14 items-center rounded-lg bg-gold px-5 font-display text-lg text-bg",
		children: "Hold to fix"
	})
};
function LayoutEditor({ kind, onBack }) {
	const profile = useProfile();
	const ids = kind === "buttons" ? BUTTON_IDS : UI_IDS;
	const locked = kind === "buttons" ? UI_IDS : BUTTON_IDS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-30 bg-bg-deep text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 vignette" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `${btnGhost$1} pointer-events-auto h-11`,
						onClick: onBack,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" }), "Done"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: kind === "buttons" ? "Buttons only" : "UI only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnGhost$1} pointer-events-auto h-11`,
						onClick: () => kind === "buttons" ? resetButtons() : resetUi(),
						children: "Reset"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 touch-none",
				style: { touchAction: "none" },
				children: [locked.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorPiece, {
					id,
					enabled: false,
					pos: (isButton(id) ? profile.buttons[id] : profile.ui[id]) ?? defaultPos(id)
				}, id)), ids.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorPiece, {
					id,
					enabled: true,
					pos: (isButton(id) ? profile.buttons[id] : profile.ui[id]) ?? defaultPos(id)
				}, id))]
			})
		]
	});
}
function EditorPiece({ id, enabled, pos }) {
	const ref = (0, import_react.useRef)(null);
	const [live, setLive] = (0, import_react.useState)(null);
	const origin = (0, import_react.useRef)(pos);
	const shown = live ?? pos;
	const onPointerDown = (e) => {
		if (!enabled) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		origin.current = shown;
		const startX = e.clientX;
		const startY = e.clientY;
		const parent = ref.current?.parentElement;
		if (!parent) return;
		const rect = parent.getBoundingClientRect();
		const move = (ev) => {
			const dx = (ev.clientX - startX) / rect.width * 100;
			const dy = (ev.clientY - startY) / rect.height * 100;
			setLive(nudge(id, origin.current, dx, dy));
		};
		const up = (ev) => {
			const dx = (ev.clientX - startX) / rect.width * 100;
			const dy = (ev.clientY - startY) / rect.height * 100;
			const next = nudge(id, origin.current, dx, dy);
			if (isButton(id)) setButtonPos(id, next);
			else setUiPos(id, next);
			setLive(null);
			window.removeEventListener("pointermove", move);
			window.removeEventListener("pointerup", up);
			window.removeEventListener("pointercancel", up);
		};
		window.addEventListener("pointermove", move);
		window.addEventListener("pointerup", up);
		window.addEventListener("pointercancel", up);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		style: slotStyle(id, shown),
		className: enabled ? "cursor-grab touch-none ring-1 ring-gold" : "pointer-events-none opacity-40",
		onPointerDown,
		children: PREVIEW[id]
	});
}
function cssVar(name, fallback) {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
function MenuBackdrop() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const draw = () => {
			const parent = canvas.parentElement;
			if (!parent) return;
			const w = parent.clientWidth;
			const h = parent.clientHeight;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.floor(w * dpr));
			canvas.height = Math.max(1, Math.floor(h * dpr));
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const bg = cssVar("--color-bg", "#10080a");
			const deep = cssVar("--color-bg-deep", "#070406");
			const blood = cssVar("--color-blood", "#e23b3b");
			const bone = cssVar("--color-bone", "#f4efe6");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, w, h);
			const moonX = w * .78;
			const moonY = h * .2;
			const glow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, Math.max(w, h) * .45);
			glow.addColorStop(0, blood);
			glow.addColorStop(1, bg);
			ctx.globalAlpha = .45;
			ctx.fillStyle = glow;
			ctx.fillRect(0, 0, w, h);
			ctx.globalAlpha = 1;
			ctx.fillStyle = bone;
			ctx.beginPath();
			ctx.arc(moonX, moonY, Math.min(w, h) * .045, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = deep;
			const ground = h * .72;
			for (let i = 0; i < 16; i++) {
				const x = i / 15 * w;
				const th = h * (.18 + i * 3 % 5 * .035);
				const tw = 28 + i % 4 * 10;
				ctx.beginPath();
				ctx.moveTo(x, ground - th);
				ctx.lineTo(x + tw, ground + 8);
				ctx.lineTo(x - tw, ground + 8);
				ctx.fill();
			}
			ctx.fillRect(0, ground, w, h - ground);
			const kx = w * .22;
			const ky = ground - h * .16;
			ctx.fillStyle = bone;
			ctx.fillRect(kx - 8, ky, 16, 14);
			ctx.fillStyle = deep;
			ctx.fillRect(kx - 14, ky + 14, 28, 36);
			ctx.fillRect(kx - 22, ky + 16, 8, 30);
			ctx.fillRect(kx + 14, ky + 16, 8, 30);
			ctx.fillRect(kx - 12, ky + 50, 8, 28);
			ctx.fillRect(kx + 2, ky + 50, 8, 28);
		};
		draw();
		window.addEventListener("resize", draw);
		return () => window.removeEventListener("resize", draw);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "absolute inset-0 h-full w-full",
		"aria-hidden": true
	});
}
function MoneyPill() {
	const profile = useProfile();
	const [pulse, setPulse] = (0, import_react.useState)(0);
	const first = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		if (first.current) {
			first.current = false;
			return;
		}
		setPulse((n) => n + 1);
	}, [profile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-panel flex items-center gap-2 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-5 w-5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl leading-none text-gold tabular-nums",
			children: moneyText(profile.money)
		}), pulse > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Saved, {}, pulse) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "Saved on this device"
		})] })]
	});
}
function Saved() {
	const [on, setOn] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setOn(false), 1200);
		return () => clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-gold",
		children: on ? "Saved" : "Saved on this device"
	});
}
function Mini({ id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `mini mini-${id}`,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "head" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "torso" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "arm l" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "arm r" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "leg l" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "leg r" })
		]
	});
}
var btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide transition disabled:opacity-40";
var btnPrimary = `${btn} h-12 bg-blood px-5 text-lg text-bone`;
var btnGhost = `${btn} h-12 border border-line bg-surface px-5 text-lg text-fg`;
function tryLockLandscape() {
	try {
		((window.screen?.orientation)?.lock?.("landscape"))?.catch(() => {});
	} catch {}
}
function ForsakenApp() {
	const [screen, setScreen] = (0, import_react.useState)({ name: "menu" });
	const profile = useProfile();
	(0, import_react.useEffect)(() => {
		loadSave();
		const unlock = () => unlockAudio();
		window.addEventListener("pointerdown", unlock);
		return () => window.removeEventListener("pointerdown", unlock);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-hidden bg-bg text-fg",
		children: [screen.name !== "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuBackdrop, {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: screen.name === "match" ? "" : "relative z-10",
			children: [
				screen.name === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainMenu, {
					onPlay: () => setScreen({ name: "play" }),
					onSettings: () => setScreen({ name: "settings" }),
					onRoster: (tab) => setScreen({
						name: "roster",
						tab
					})
				}) : null,
				screen.name === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsMenu, {
					onBack: () => setScreen({ name: "menu" }),
					onCustomize: (kind) => setScreen({
						name: "customize",
						kind
					})
				}) : null,
				screen.name === "customize" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutEditor, {
					kind: screen.kind,
					onBack: () => setScreen({ name: "settings" })
				}) : null,
				screen.name === "roster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Roster, {
					tab: screen.tab,
					onTab: (tab) => setScreen({
						name: "roster",
						tab
					}),
					onBack: () => setScreen({ name: "menu" })
				}) : null,
				screen.name === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayMenu, {
					error: screen.error,
					onBack: () => setScreen({ name: "menu" }),
					onSearch: () => {
						const rolled = rollRandomMatch(profile);
						if (typeof rolled === "string") {
							setScreen({
								name: "play",
								error: rolled
							});
							return;
						}
						setScreen({
							name: "search",
							opts: rolled,
							line: "Searching for a server…"
						});
					},
					onServer: () => setScreen({ name: "server" }),
					onPractice: (role) => {
						const match = makePractice(role, profile);
						if (typeof match === "string") {
							setScreen({
								name: "play",
								error: match
							});
							return;
						}
						tryLockLandscape();
						setScreen({
							name: "match",
							opts: match
						});
					}
				}) : null,
				screen.name === "server" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServerMenu, {
					onBack: () => setScreen({ name: "play" }),
					onStart: (role, map) => {
						const match = makeServerMatch(role, map, profile);
						if (typeof match === "string") return match;
						tryLockLandscape();
						setScreen({
							name: "match",
							opts: match
						});
						return null;
					}
				}) : null,
				screen.name === "search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchScreen, {
					opts: screen.opts,
					onCancel: () => setScreen({ name: "play" }),
					onDrop: () => {
						tryLockLandscape();
						setScreen({
							name: "match",
							opts: screen.opts
						});
					}
				}) : null,
				screen.name === "match" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchScreen, {
					opts: screen.opts,
					onLeave: () => setScreen({ name: "menu" })
				}) : null
			]
		})]
	});
}
function MuteButton() {
	const profile = useProfile();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `${btnGhost} h-11 w-11 px-0`,
		onClick: () => toggleMuted(),
		"aria-label": profile.muted ? "Unmute" : "Mute",
		children: profile.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" })
	});
}
function MainMenu({ onPlay, onRoster, onSettings }) {
	const profile = useProfile();
	const survivor = profile.equippedSurvivor ? getChar(profile.equippedSurvivor) : null;
	const killer = profile.equippedKiller ? getChar(profile.equippedKiller) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "rise mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-5 sm:px-8 sm:py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm tracking-[0.32em] text-blood",
						children: "ASYMMETRICAL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl leading-none sm:text-7xl",
						children: "FORSAKEN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-md text-muted",
						children: "Fix the generators. Or be the thing in the trees."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuteButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyPill, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `${btnPrimary} mt-8 h-16 w-full text-2xl sm:w-72`,
				onClick: onPlay,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6" }), "Play"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `${btnGhost} mt-3 h-14 w-full text-xl sm:w-72`,
				onClick: onSettings,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-5 w-5" }), "Settings"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharacterCard, {
					kicker: "Survivor",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
					name: survivor?.name ?? "Unequipped",
					id: survivor?.id,
					detail: survivor ? `${survivor.hp} HP · ${survivor.abilityName}` : "Equip someone",
					onChange: () => onRoster("survivor")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CharacterCard, {
					kicker: "Killer",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skull, { className: "h-4 w-4" }),
					name: killer?.name ?? "Unequipped",
					id: killer?.id,
					detail: killer ? `${killer.hp} HP · ${killer.abilityName}` : "Equip someone",
					onChange: () => onRoster("killer")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapOdds, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-auto pt-6 text-xs text-muted",
				children: "Money, audio, and layout save when you leave, switch sites, or close the tab."
			})
		]
	});
}
function CharacterCard({ kicker, icon, name, id, detail, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "hud-panel flex items-center gap-4 p-4",
		children: [
			id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, { id }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 w-14 rounded-md border border-line bg-surface-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-xs tracking-[0.18em] text-muted",
						children: [icon, kicker.toUpperCase()]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "truncate font-display text-2xl leading-tight",
						children: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted",
						children: detail
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: btnGhost,
				onClick: onChange,
				children: "Change"
			})
		]
	});
}
function MapOdds() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-6 text-sm text-muted",
		children: ["Maps · ", MAPS.map((m) => `${m.name} ${m.odds}`).join(" · ")]
	});
}
function PlayMenu({ error, onBack, onSearch, onServer, onPractice }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				title: "Play",
				onBack
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-lg border border-blood bg-surface px-3 py-2 text-sm text-bone",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnPrimary} h-16 w-full text-xl`,
						onClick: onSearch,
						children: "Random Join Server"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "-mt-1 text-sm text-muted",
						children: "The killer is random: you, or another player."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnGhost} h-14 w-full`,
						onClick: onServer,
						children: "Create own server"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnGhost} h-14 w-full`,
						onClick: () => onPractice("survivor"),
						children: "Practice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnGhost} h-12 w-full text-base`,
						onClick: () => onPractice("killer"),
						children: "Killer drill"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapOdds, {})
		]
	});
}
function SearchScreen({ opts, onCancel, onDrop }) {
	const [line, setLine] = (0, import_react.useState)("Searching for a server…");
	const [ready, setReady] = (0, import_react.useState)(false);
	const dropRef = (0, import_react.useRef)(onDrop);
	dropRef.current = onDrop;
	(0, import_react.useEffect)(() => {
		const reveal = window.setTimeout(() => {
			setLine(`${opts.mapName}. ${opts.reveal}`);
			setReady(true);
		}, 700);
		const go = window.setTimeout(() => dropRef.current(), 1700);
		return () => {
			window.clearTimeout(reveal);
			window.clearTimeout(go);
		};
	}, [opts]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "rise mx-auto flex min-h-dvh w-full max-w-lg flex-col items-start px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm tracking-[0.28em] text-blood",
				children: "SERVER"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "Other players in this build are bots. Your money still saves."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex w-full flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${btnPrimary} w-full`,
					disabled: !ready,
					onClick: onDrop,
					children: "Drop in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${btnGhost} w-full`,
					onClick: onCancel,
					children: "Back"
				})]
			})
		]
	});
}
function ServerMenu({ onBack, onStart }) {
	const profile = useProfile();
	const [role, setRole] = (0, import_react.useState)("survivor");
	const [map, setMap] = (0, import_react.useState)("random");
	const [err, setErr] = (0, import_react.useState)("");
	const charId = role === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
	const charName = charId ? getChar(charId).name : "Unequipped";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				title: "Your server",
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: "Bots fill the other side. Pick who you are."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: ["survivor", "killer"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `${role === r ? btnPrimary : btnGhost} w-full capitalize`,
					onClick: () => setRole(r),
					children: r
				}, r))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: ["Playing as ", charName]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: map === "random" ? btnPrimary : btnGhost,
					onClick: () => setMap("random"),
					children: "Random map"
				}), MAPS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: map === m.id ? btnPrimary : btnGhost,
					onClick: () => setMap(m.id),
					children: m.name
				}, m.id))]
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-blood",
				children: err
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `${btnPrimary} mt-6 w-full`,
				onClick: () => {
					const message = onStart(role, map);
					setErr(message ?? "");
				},
				children: "Start match"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["You · ", charName] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: role === "killer" ? "9 survivor bots" : "8 survivor bots" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: role === "killer" ? "Killer · you" : "Killer · random bot" })
				]
			})
		]
	});
}
function Roster({ tab, onTab, onBack }) {
	const profile = useProfile();
	const list = charsByRole(tab);
	const equipped = tab === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
	const [selected, setSelected] = (0, import_react.useState)(equipped ?? list[0].id);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const def = getChar(list.some((c) => c.id === selected) ? selected : list[0].id);
	const owned = (tab === "survivor" ? profile.ownedSurvivors : profile.ownedKillers).includes(def.id);
	const isEquipped = equipped === def.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "rise mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				title: tab === "survivor" ? "Survivors" : "Killers",
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === "survivor" ? btnPrimary : btnGhost,
					onClick: () => onTab("survivor"),
					children: "Survivors"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tab === "killer" ? btnPrimary : btnGhost,
					onClick: () => onTab("killer"),
					children: "Killers"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-2 sm:grid-cols-3",
				children: list.map((c) => {
					const have = (c.role === "survivor" ? profile.ownedSurvivors : profile.ownedKillers).includes(c.id);
					const on = c.id === def.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setSelected(c.id);
							setPending(false);
							setErr("");
						},
						className: `hud-panel flex items-center gap-3 p-3 text-left ${on ? "border-blood" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, { id: c.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-xl leading-tight",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm text-muted",
							children: [c.price === 0 ? "Default" : have ? "Owned" : moneyText(c.price), equipped === c.id ? " · Equipped" : ""]
						})] })]
					}, c.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hud-panel mt-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, { id: def.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl leading-none",
							children: def.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								"HP ",
								def.hp,
								"/",
								def.hp
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 whitespace-pre-line text-sm text-bone",
						children: def.abilityText
					}),
					!owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-gold",
						children: moneyText(def.price)
					}) : null,
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-blood",
						children: err
					}) : null,
					pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: btnPrimary,
							onClick: () => {
								const message = buyCharacter(def.id);
								setErr(message ?? "");
								if (!message) setPending(false);
							},
							children: ["Buy ", moneyText(def.price)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: btnGhost,
							onClick: () => setPending(false),
							children: "Back"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							!owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: btnPrimary,
								disabled: profile.money < def.price,
								onClick: () => setPending(true),
								children: profile.money < def.price ? `Need ${moneyText(def.price)}` : `Buy ${moneyText(def.price)}`
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: btnPrimary,
								disabled: !owned || isEquipped,
								onClick: () => tab === "survivor" ? equipSurvivor(def.id) : equipKiller(def.id),
								children: "Equip"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: btnGhost,
								disabled: !isEquipped,
								onClick: () => tab === "survivor" ? equipSurvivor(null) : equipKiller(null),
								children: "Unequip"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: btnGhost,
								onClick: onBack,
								children: "Back"
							})
						]
					})
				]
			})
		]
	});
}
function Header({ title, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: btnGhost,
				onClick: onBack,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-5 w-5" }), "Back"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyPill, {})
		]
	});
}
function usePortraitPhone() {
	const [need, setNeed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const apply = () => {
			const coarse = window.matchMedia("(pointer: coarse)").matches;
			const portrait = window.innerHeight > window.innerWidth + 40;
			const phone = Math.min(window.innerWidth, window.innerHeight) < 820;
			setNeed(coarse && portrait && phone);
		};
		apply();
		window.addEventListener("resize", apply);
		window.addEventListener("orientationchange", apply);
		return () => {
			window.removeEventListener("resize", apply);
			window.removeEventListener("orientationchange", apply);
		};
	}, []);
	return need;
}
function MatchScreen({ opts, onLeave }) {
	const canvasRef = (0, import_react.useRef)(null);
	const apiRef = (0, import_react.useRef)(null);
	const hudRef = (0, import_react.useRef)(blankHud(opts));
	const [ready, setReady] = (0, import_react.useState)(false);
	const [fail, setFail] = (0, import_react.useState)(null);
	const [ask, setAsk] = (0, import_react.useState)(false);
	const [intro, setIntro] = (0, import_react.useState)(true);
	const portrait = usePortraitPhone();
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setIntro(false), 2400);
		return () => window.clearTimeout(t);
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let dead = false;
		let api = null;
		import("./engine-DW-nx6jJ.mjs").then((mod) => {
			if (dead) return;
			api = mod.startEngine(canvas, opts, (snap) => {
				hudRef.current = snap;
			});
			apiRef.current = api;
			setReady(true);
		}).catch((err) => {
			if (!dead) setFail(err instanceof Error ? err.message : "Could not start the match");
		});
		return () => {
			dead = true;
			api?.destroy();
			apiRef.current = null;
			try {
				window.screen?.orientation?.unlock?.();
			} catch {}
		};
	}, [opts]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "match-root fixed inset-0 touch-none bg-bg-deep",
		style: { touchAction: "none" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full touch-none"
			}),
			!ready && !fail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl",
				children: [
					"Entering ",
					opts.mapName,
					"…"
				]
			}) : null,
			fail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel max-w-md p-5 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: fail }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `${btnPrimary} mt-4`,
						onClick: onLeave,
						children: "Back"
					})]
				})
			}) : null,
			ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {
				apiRef,
				hudRef,
				opts,
				onLeave: () => {
					if (hudRef.current.phase === "end") onLeave();
					else setAsk(true);
				}
			}) : null,
			intro && ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute top-24 left-1/2 w-[min(100%,24rem)] -translate-x-1/2 px-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl text-bone",
					children: opts.mapName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-gold",
					children: opts.reveal
				})]
			}) : null,
			ask ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-bg p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-panel w-full max-w-sm p-5 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Leave match?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Generator money already paid is saved."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${btnGhost} flex-1`,
								onClick: () => setAsk(false),
								children: "Stay"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${btnPrimary} flex-1`,
								onClick: onLeave,
								children: "Leave"
							})]
						})
					]
				})
			}) : null,
			portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-bg px-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl",
					children: "Rotate your phone"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Forsaken plays in landscape."
				})]
			}) : null
		]
	});
}
function blankHud(opts) {
	const def = getChar(opts.playerCharId);
	return {
		phase: "play",
		timeLeft: 240,
		survivorsAlive: 9,
		survivorsMax: 9,
		gensDone: 0,
		gensMax: 5,
		hp: def.hp,
		maxHp: def.hp,
		stamina: 100,
		maxStamina: 100,
		sprintOn: false,
		abilityCd: 0,
		abilityMax: def.abilityCd,
		abilityName: def.abilityName,
		attackCd: 0,
		attackName: def.attackName,
		role: opts.playerRole,
		charName: def.name,
		nearGen: false,
		genProgress: 0,
		fixing: false,
		stun: 0,
		buff: 0,
		weak: 0,
		weakLeft: 0,
		power: 0,
		powerLeft: 0,
		hatCd: 0,
		rechargeCd: 0,
		shotBoost: false,
		killerNear: false,
		mapName: opts.mapName,
		markerText: "",
		markerAngle: 0,
		endTitle: "",
		endDetail: "",
		earned: 0,
		toast: ""
	};
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = ForsakenApp;
//#endregion
export { MINION_VISUAL as a, addMoney as i, playSfx as n, getChar as o, unlockAudio as r, routes_exports as t };
