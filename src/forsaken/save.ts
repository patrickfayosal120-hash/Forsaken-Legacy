import { useSyncExternalStore } from "react";
import { getChar } from "./content";
import { BUTTON_IDS, UI_IDS, type ButtonId, type Pos, type UiId } from "./layout";

const KEY = "forsaken.v1";

export interface Profile {
  version: 1;
  money: number;
  ownedSurvivors: string[];
  ownedKillers: string[];
  equippedSurvivor: string | null;
  equippedKiller: string | null;
  muted: boolean;
  sfx: number;
  music: number;
  sensitive: boolean;
  buttons: Partial<Record<ButtonId, Pos>>;
  ui: Partial<Record<UiId, Pos>>;
  levels: Record<string, { level: number; xp: number }>;
  chat: ChatLine[];
  profileId: string;
  userId: string;
  name: string;
  friends: Friend[];
  account: "guest" | "google";
  localUserId: string;
  milestones: Record<string, number>;
  boosts: XpBoost[];
  lowDetail: boolean;
  graphics: Graphics;
  voiceOwned: boolean;
  voiceOn: boolean;
  commandsUntil: number;
}

export interface XpBoost {
  mult: number;
  until: number;
}

export type Graphics = "default" | "realistic" | "very";
export type PaidSku = "bundle-money" | "bundle-xp" | "voice" | "commands";

export interface Friend {
  id: string;
  name: string;
  kind: "real" | "bot";
  userId: string;
}

export interface ChatLine {
  id: number;
  channel: "friends" | "global" | "commands";
  name: string;
  text: string;
  real: boolean;
  self: boolean;
}

const DEFAULT: Profile = {
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
  ui: {},
  levels: {},
  chat: [],
  profileId: "",
  userId: "",
  name: "",
  friends: [],
  account: "guest",
  localUserId: "",
  milestones: {},
  boosts: [],
  lowDetail: false,
  graphics: "default",
  voiceOwned: false,
  voiceOn: false,
  commandsUntil: 0,
};

let profile: Profile = DEFAULT;
const listeners = new Set<() => void>();
let attached = false;

function roundMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(Math.max(0, n) * 100) / 100;
}

function clampPct(n: unknown, fallback: number) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(100, Math.max(0, Math.round(v)));
}

function cleanToken(v: unknown) {
  if (typeof v !== "string") return "";
  const s = v.trim().slice(0, 80);
  if (!s || /[\s<>"'`]/.test(s)) return "";
  return s;
}

function cleanName(v: unknown) {
  if (typeof v !== "string") return "";
  return v.replace(/\s+/g, " ").trim().slice(0, 24);
}

function makeCode(len: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
  let s = "";
  for (const b of bytes) s += alphabet[b % alphabet.length]!;
  return s;
}

function sanitizeBoosts(raw: unknown): XpBoost[] {
  if (!Array.isArray(raw)) return [];
  const now = Date.now();
  const out: XpBoost[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const mult = Math.floor(Number((row as XpBoost).mult));
    const until = Math.floor(Number((row as XpBoost).until));
    if (![2, 3, 4, 10, 20].includes(mult)) continue;
    if (!Number.isFinite(until) || until < 0) continue;
    if (until !== 0 && until <= now) continue;
    out.push({ mult, until });
  }
  return out.slice(0, 8);
}

function sanitizeMilestones(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, tier] of Object.entries(raw as Record<string, unknown>)) {
    try {
      getChar(id);
    } catch {
      continue;
    }
    const n = Math.floor(Number(tier));
    if (n >= 1 && n <= 4) out[id] = n;
  }
  return out;
}

function sanitizeFriends(raw: unknown): Friend[] {
  if (!Array.isArray(raw)) return [];
  const out: Friend[] = [];
  const seen = new Set<string>();
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const friend = row as Partial<Friend>;
    const id = cleanToken(friend.id);
    const name = cleanName(friend.name);
    const userId = cleanToken(friend.userId) || id;
    const kind = friend.kind === "bot" ? "bot" : "real";
    if (!id || !name || seen.has(id)) continue;
    seen.add(id);
    out.push({ id, name, kind, userId });
  }
  return out.slice(0, 40);
}

function sanitizeChat(raw: unknown): ChatLine[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatLine[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const line = row as Partial<ChatLine>;
    const channel = line.channel === "friends" || line.channel === "global" || line.channel === "commands" ? line.channel : null;
    const name = typeof line.name === "string" ? line.name.slice(0, 24) : "";
    const text = typeof line.text === "string" ? line.text.slice(0, 160).trim() : "";
    if (!channel || !name || !text) continue;
    out.push({
      id: Number.isFinite(Number(line.id)) ? Number(line.id) : out.length + 1,
      channel,
      name,
      text,
      real: Boolean(line.real),
      self: Boolean(line.self),
    });
  }
  return out.slice(-80);
}

function sanitizeLevels(raw: unknown): Record<string, { level: number; xp: number }> {
  const out: Record<string, { level: number; xp: number }> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, row] of Object.entries(raw as Record<string, { level?: unknown; xp?: unknown }>)) {
    try {
      getChar(id);
    } catch {
      continue;
    }
    const level = Math.min(100, Math.max(1, Math.floor(Number(row?.level))));
    const xp = Math.max(0, Math.floor(Number(row?.xp)));
    if (!Number.isFinite(level) || !Number.isFinite(xp)) continue;
    if (level <= 1 && xp <= 0) continue;
    out[id] = { level, xp: level >= 100 ? 0 : xp };
  }
  return out;
}

function sanitizePosMap<T extends string>(raw: unknown, ids: readonly T[]): Partial<Record<T, Pos>> {
  const out: Partial<Record<T, Pos>> = {};
  if (!raw || typeof raw !== "object") return out;
  const bag = raw as Record<string, { x?: unknown; y?: unknown }>;
  for (const id of ids) {
    const p = bag[id];
    const x = Number(p?.x);
    const y = Number(p?.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    out[id] = { x: Math.min(96, Math.max(0, x)), y: Math.min(96, Math.max(0, y)) };
  }
  return out;
}

function sanitize(raw: Partial<Profile> | null): Profile {
  const ownedS = new Set<string>(Array.isArray(raw?.ownedSurvivors) ? raw!.ownedSurvivors : []);
  const ownedK = new Set<string>(Array.isArray(raw?.ownedKillers) ? raw!.ownedKillers : []);
  ownedS.add("noob");
  ownedK.add("jason");
  for (const id of [...ownedS]) {
    try {
      if (getChar(id).role !== "survivor") ownedS.delete(id);
    } catch {
      ownedS.delete(id);
    }
  }
  for (const id of [...ownedK]) {
    try {
      if (getChar(id).role !== "killer") ownedK.delete(id);
    } catch {
      ownedK.delete(id);
    }
  }
  let equippedSurvivor: string | null =
    raw && "equippedSurvivor" in raw ? (raw.equippedSurvivor ?? null) : "noob";
  let equippedKiller: string | null =
    raw && "equippedKiller" in raw ? (raw.equippedKiller ?? null) : "jason";
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
    ui: sanitizePosMap(raw?.ui, UI_IDS),
    levels: sanitizeLevels(raw?.levels),
    chat: sanitizeChat(raw?.chat),
    profileId: cleanToken(raw?.profileId),
    userId: cleanToken(raw?.userId),
    name: cleanName(raw?.name),
    friends: sanitizeFriends(raw?.friends),
    account: raw?.account === "google" ? "google" : "guest",
    localUserId: cleanToken(raw?.localUserId),
    milestones: sanitizeMilestones(raw?.milestones),
    boosts: sanitizeBoosts(raw?.boosts),
    lowDetail: Boolean(raw?.lowDetail),
    graphics: raw?.graphics === "realistic" || raw?.graphics === "very" ? raw.graphics : "default",
    voiceOwned: Boolean(raw?.voiceOwned),
    voiceOn: Boolean(raw?.voiceOn),
    commandsUntil: Math.max(0, Math.floor(Number(raw?.commandsUntil) || 0)),
  };
}

function writeDisk(p: Profile) {
  if (typeof localStorage === "undefined") return;
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(`${KEY}.bak`, prev);
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode / quota — keep the in-memory profile */
  }
}

function readDisk(): Profile {
  if (typeof localStorage === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return sanitize(JSON.parse(raw) as Partial<Profile>);
  } catch {
    try {
      const bak = localStorage.getItem(`${KEY}.bak`);
      if (bak) return sanitize(JSON.parse(bak) as Partial<Profile>);
    } catch {
      /* fall through */
    }
    return DEFAULT;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: Profile) {
  profile = next;
  writeDisk(profile);
  emit();
}

export function loadSave() {
  attach();
  const next = readDisk();
  if (JSON.stringify(next) !== JSON.stringify(profile)) {
    profile = next;
    emit();
  }
  try {
    void navigator.storage?.persist?.();
  } catch {
    /* ignore */
  }
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

export function getProfile() {
  return profile;
}

export function ensureIdentity(auth?: { id: string; name: string | null; real: boolean }) {
  let profileId = profile.profileId;
  let localUserId = profile.localUserId;
  let name = profile.name;
  let changed = false;
  if (!profileId) {
    profileId = makeCode(6);
    changed = true;
  }
  const googleId = auth?.real ? cleanToken(auth.id) : "";
  if (!localUserId || localUserId === googleId) {
    const current = profile.userId && profile.userId !== googleId ? profile.userId : "";
    localUserId = current || `U${makeCode(8)}`;
    changed = true;
  }
  let userId = localUserId;
  if (profile.account === "google" && googleId) userId = googleId;
  if (userId !== profile.userId) changed = true;
  if (!name) {
    name = (profile.account === "google" ? cleanName(auth?.name || "") : "") || "Player";
    changed = true;
  }
  if (changed) commit({ ...profile, profileId, userId, localUserId, name });
}

export function useGuestAccount() {
  const local = profile.localUserId || (profile.account === "guest" ? profile.userId : "") || `U${makeCode(8)}`;
  commit({ ...profile, account: "guest", localUserId: local, userId: local });
}

export function useGoogleAccount() {
  const local = profile.localUserId || (profile.account === "guest" ? profile.userId : "") || `U${makeCode(8)}`;
  commit({ ...profile, account: "google", localUserId: local });
}

export function setName(name: string) {
  const next = cleanName(name);
  commit({ ...profile, name: next });
}

export function addFriend(friend: Friend) {
  const id = cleanToken(friend.id);
  const name = cleanName(friend.name);
  const userId = cleanToken(friend.userId) || id;
  if (!id || !name) return "Enter a name or profile ID.";
  if (id === profile.profileId || userId === profile.userId) return "That is you.";
  if (profile.friends.some((f) => f.id === id || f.userId === userId)) return "Already a friend.";
  if (profile.friends.length >= 40) return "Friend list is full.";
  commit({
    ...profile,
    friends: [...profile.friends, { id, name, kind: friend.kind === "bot" ? "bot" : "real", userId }],
  });
  return null;
}

export function removeFriend(id: string) {
  commit({ ...profile, friends: profile.friends.filter((f) => f.id !== id) });
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getProfile, getProfile);
}

export function setLowDetail(on: boolean) {
  commit({ ...profile, lowDetail: on });
}

export function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  if (/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)) return true;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 900;
}

export function setGraphics(graphics: Graphics): string | null {
  if (graphics === "very" && isMobileDevice()) return "Very Realistic is PC only. It can crash on mobile.";
  commit({ ...profile, graphics });
  return null;
}

export function setVoiceOn(on: boolean) {
  if (on && !profile.voiceOwned) return;
  commit({ ...profile, voiceOn: on });
}

export function commandsActive(now = Date.now()) {
  return profile.commandsUntil > now;
}

export function grantPaid(sku: PaidSku): string {
  if (sku === "bundle-money") {
    const rolls = [50000, 100000, 999000, 1000000];
    const n = rolls[Math.floor(Math.random() * rolls.length)]!;
    addMoney(n);
    return `Bundle Money paid. Reward ${n >= 1000000 ? "$1M" : n >= 999000 ? "$999K" : n >= 100000 ? "$100K" : "$50K"}.`;
  }
  if (sku === "bundle-xp") {
    const mult = Math.random() < 0.5 ? 10 : 20;
    const boosts = activeBoosts();
    boosts.push({ mult, until: Date.now() + 3 * 24 * 60 * 60 * 1000 });
    commit({ ...profile, boosts });
    return `Bundle XP paid. ${mult}x XP for 3 days.`;
  }
  if (sku === "voice") {
    commit({ ...profile, voiceOwned: true, voiceOn: true });
    return "Voice Chat is unlocked. Enable it in Settings, Premium Tools.";
  }
  const until = Date.now() + 30 * 24 * 60 * 60 * 1000;
  commit({ ...profile, commandsUntil: Math.max(profile.commandsUntil, until) });
  return "Commands unlocked for 1 month. Open Chat, then Commands.";
}

export function runCommand(text: string): string {
  const cmd = text.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (cmd === "/help") return "/help  /money  /xp  /time  /boost  /who";
  if (cmd === "/money") return `Balance $${profile.money.toFixed(2)}`;
  if (cmd === "/xp") return `XP multiplier ${xpMultiplier()}x`;
  if (cmd === "/time") return new Date().toLocaleString();
  if (cmd === "/who") return profile.name || "Player";
  if (cmd === "/boost") {
    const rows = activeBoosts();
    if (!rows.length) return "No XP boost is active.";
    return rows.map((b) => (b.until === 0 ? `${b.mult}x permanent` : `${b.mult}x`)).join(", ");
  }
  return "Unknown command. Try /help.";
}

export function addMoney(amount: number) {
  commit({ ...profile, money: roundMoney(profile.money + amount) });
}

export function toggleMuted() {
  commit({ ...profile, muted: !profile.muted });
}

export function setSfx(value: number) {
  commit({ ...profile, sfx: clampPct(value, profile.sfx) });
}

export function setMusic(value: number) {
  commit({ ...profile, music: clampPct(value, profile.music) });
}

export function setSensitive(on: boolean) {
  commit({ ...profile, sensitive: on });
}

export function setButtonPos(id: ButtonId, pos: Pos) {
  commit({ ...profile, buttons: { ...profile.buttons, [id]: pos } });
}

export function setUiPos(id: UiId, pos: Pos) {
  commit({ ...profile, ui: { ...profile.ui, [id]: pos } });
}

export function resetButtons() {
  commit({ ...profile, buttons: {} });
}

export function resetUi() {
  commit({ ...profile, ui: {} });
}

export function xpForLevel(level: number) {
  if (level >= 100) return 0;
  return 20 + level;
}

export function getProgress(id: string) {
  const row = profile.levels[id];
  const level = Math.min(100, Math.max(1, Math.floor(row?.level ?? 1)));
  const xp = level >= 100 ? 0 : Math.max(0, Math.floor(row?.xp ?? 0));
  return { level, xp };
}

export function getLevel(id: string) {
  return getProgress(id).level;
}

export function milestoneStats(level: number) {
  const lv = Math.min(100, Math.max(1, Math.floor(level)));
  let hp = 0;
  let dmg = 0;
  let defense = 0;
  if (lv >= 75) {
    hp += 10;
    dmg += 10;
  }
  if (lv >= 100) {
    hp += 10;
    dmg += 10;
    defense = 20;
  }
  return { hp, dmg, defense, m1: lv >= 25, m2: lv >= 50, m3: lv >= 75, m4: lv >= 100 };
}

export function milestoneNeed(tier: number) {
  if (tier <= 1) return 25;
  if (tier === 2) return 50;
  if (tier === 3) return 75;
  return 100;
}

export function bonusForTier(tier: number) {
  if (tier >= 4) return { hp: 10, dmg: 10, defense: 20 };
  if (tier === 3) return { hp: 10, dmg: 10, defense: 0 };
  return { hp: 0, dmg: 0, defense: 0 };
}

export function getEquippedMilestone(id: string) {
  const tier = profile.milestones[id] ?? 0;
  if (tier < 1 || tier > 4) return 0;
  if (getLevel(id) < milestoneNeed(tier)) return 0;
  return tier;
}

export function equippedBonus(id: string) {
  return bonusForTier(getEquippedMilestone(id));
}

export function equipMilestone(id: string, tier: number) {
  try {
    getChar(id);
  } catch {
    return "Unknown character.";
  }
  if (tier < 1 || tier > 4) return "Pick a milestone.";
  if (getLevel(id) < milestoneNeed(tier)) return `Requires level ${milestoneNeed(tier)} to unlock.`;
  const milestones = { ...profile.milestones };
  if (milestones[id] === tier) delete milestones[id];
  else milestones[id] = tier;
  commit({ ...profile, milestones });
  return null;
}

export function equipAllMilestone4() {
  const milestones = { ...profile.milestones };
  let count = 0;
  for (const id of ["noob", "elliot", "shedletsky", "chance", "jason", "coolkid", "johndoe", "onex"]) {
    if (getLevel(id) < 100) continue;
    milestones[id] = 4;
    count += 1;
  }
  commit({ ...profile, milestones });
  return count;
}

export function activeBoosts(now = Date.now()) {
  return profile.boosts.filter((b) => b.until === 0 || b.until > now);
}

export function xpMultiplier(now = Date.now()) {
  let mult = 1;
  for (const b of activeBoosts(now)) if (b.mult > mult) mult = b.mult;
  return mult;
}

const SHOP_BOOSTS = [
  { id: "x2", mult: 2, hours: 1, price: 500 },
  { id: "x3", mult: 3, hours: 4, price: 1000 },
  { id: "x4", mult: 4, hours: 5, price: 2000 },
  { id: "x10", mult: 10, hours: 0, price: 5000 },
] as const;

export function buyBoost(id: string): string | null {
  const item = SHOP_BOOSTS.find((b) => b.id === id);
  if (!item) return "Unknown booster.";
  if (item.hours === 0 && profile.boosts.some((b) => b.mult === 10 && b.until === 0)) return "You already own permanent 10x XP.";
  if (profile.money < item.price) return "Not enough money.";
  const boosts = activeBoosts();
  if (item.hours === 0) {
    boosts.push({ mult: 10, until: 0 });
  } else {
    const ms = item.hours * 60 * 60 * 1000;
    const row = boosts.find((b) => b.mult === item.mult && b.until > 0);
    if (row) row.until += ms;
    else boosts.push({ mult: item.mult, until: Date.now() + ms });
  }
  commit({ ...profile, money: roundMoney(profile.money - item.price), boosts });
  return null;
}

export function addXp(id: string, amount: number) {
  const cur = getProgress(id);
  if (cur.level >= 100 || amount <= 0) return { level: cur.level, leveled: false, gained: 0 };
  let level = cur.level;
  const gained = Math.floor(amount * xpMultiplier());
  let xp = cur.xp + gained;
  let leveled = false;
  while (level < 100 && xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    leveled = true;
  }
  if (level >= 100) xp = 0;
  commit({ ...profile, levels: { ...profile.levels, [id]: { level, xp } } });
  return { level, leveled, gained };
}

export function pushChat(line: Omit<ChatLine, "id">) {
  const text = line.text.slice(0, 160).trim();
  if (!text) return;
  const next: ChatLine = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    channel: line.channel,
    name: line.name.slice(0, 24),
    text,
    real: line.real,
    self: line.self,
  };
  commit({ ...profile, chat: [...profile.chat, next].slice(-80) });
}

export function equipSurvivor(id: string | null) {
  if (id && !profile.ownedSurvivors.includes(id)) return;
  commit({ ...profile, equippedSurvivor: id });
}

export function equipKiller(id: string | null) {
  if (id && !profile.ownedKillers.includes(id)) return;
  commit({ ...profile, equippedKiller: id });
}

export function buyCharacter(id: string): string | null {
  const def = getChar(id);
  const owned = def.role === "survivor" ? profile.ownedSurvivors : profile.ownedKillers;
  if (owned.includes(id)) return null;
  if (profile.money < def.price) return "Not enough money";
  if (def.role === "survivor") {
    commit({
      ...profile,
      money: roundMoney(profile.money - def.price),
      ownedSurvivors: [...profile.ownedSurvivors, id],
      equippedSurvivor: id,
    });
  } else {
    commit({
      ...profile,
      money: roundMoney(profile.money - def.price),
      ownedKillers: [...profile.ownedKillers, id],
      equippedKiller: id,
    });
  }
  return null;
}
