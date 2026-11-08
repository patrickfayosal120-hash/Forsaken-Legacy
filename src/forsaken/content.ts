import type { MapId, MatchOpts, Role } from "./types";

export interface CharColors {
  head: number;
  torso: number;
  arm: number;
  leg: number;
}

export interface CharDef {
  id: string;
  name: string;
  role: Role;
  price: number;
  hp: number;
  abilityName: string;
  abilityCd: number;
  abilityText: string;
  attackName: string;
  attackCd: number;
  attackDamage: number;
  attackRange: number;
  scale: number;
  move: number;
  colors: CharColors;
}

export const CHARACTERS: CharDef[] = [
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
    attackCd: 0.8,
    attackDamage: 8,
    attackRange: 1.9,
    scale: 1,
    move: 1,
    colors: { head: 0xf2d230, torso: 0x3a66c4, arm: 0xf2d230, leg: 0x3d8a45 },
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
    attackCd: 0.7,
    attackDamage: 12,
    attackRange: 2.25,
    scale: 1.02,
    move: 1,
    colors: { head: 0xf0c14a, torso: 0x2f4f99, arm: 0xf0c14a, leg: 0x2a2a2a },
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
    attackCd: 0.8,
    attackDamage: 6,
    attackRange: 1.8,
    scale: 1,
    move: 1.08,
    colors: { head: 0xf0c14a, torso: 0xc4313a, arm: 0xf0c14a, leg: 0x4a3428 },
  },
  {
    id: "chance",
    name: "Chance",
    role: "survivor",
    price: 60,
    hp: 120,
    abilityName: "Flip Coin",
    abilityCd: 0.1,
    abilityText:
      "Extra HP — 1% chance for +2 to +8 health.\nFlip Coin — 0.10s. 50% Weakness 1–10 for 50s. 0.10% Powerful 1–4 for 50s.\nShot — 45s cooldown, 30 damage.\nRepair Hat — clears Weakness and Powerful.\nRecharge — reloads Shot and doubles the next one.",
    attackName: "Shot",
    attackCd: 45,
    attackDamage: 30,
    attackRange: 16,
    scale: 1,
    move: 1,
    colors: { head: 0xe6d3b0, torso: 0x2c2a32, arm: 0xe6d3b0, leg: 0x1c1a22 },
  },
  {
    id: "jason",
    name: "Jason",
    role: "killer",
    price: 0,
    hp: 2000,
    abilityName: "Behead",
    abilityCd: 25,
    abilityText: "Slash, and Behead — a heavy hit that executes a wounded survivor. 25s cooldown.",
    attackName: "Slash",
    attackCd: 0.72,
    attackDamage: 26,
    attackRange: 2.55,
    scale: 1.18,
    move: 1.02,
    colors: { head: 0xf4f1ea, torso: 0x3d4a32, arm: 0xcbb89a, leg: 0x2a241c },
  },
  {
    id: "coolkid",
    name: "Coolkid",
    role: "killer",
    price: 990,
    hp: 1000,
    abilityName: "Minions",
    abilityCd: 30,
    abilityText: "Punch, and Spawn 2 minions. 30s cooldown.",
    attackName: "Punch",
    attackCd: 0.55,
    attackDamage: 20,
    attackRange: 2.2,
    scale: 1.05,
    move: 1.18,
    colors: { head: 0xd1242a, torso: 0x1a1a1a, arm: 0xd1242a, leg: 0xd1242a },
  },
  {
    id: "johndoe",
    name: "John Doe",
    role: "killer",
    price: 1000,
    hp: 5000,
    abilityName: "Super Slash",
    abilityCd: 50,
    abilityText: "Slash, and Super Slash — a lunging blow. 50s cooldown.",
    attackName: "Slash",
    attackCd: 0.95,
    attackDamage: 36,
    attackRange: 2.75,
    scale: 1.38,
    move: 0.84,
    colors: { head: 0x1a1214, torso: 0x6e1c22, arm: 0x2a2a2a, leg: 0x140c0e },
  },
  {
    id: "onex",
    name: "1x1x1x",
    role: "killer",
    price: 700,
    hp: 1500,
    abilityName: "Mass Infection",
    abilityCd: 28,
    abilityText:
      "A hatred of a single day of work, and the engagement of a mass infection of evil.\nSlash — 30 damage.\nMass Infection — 4 acid swords, 30–45 damage, poison for 5s.\nEngagement — two swords, 10 damage each, stun for 5s.\nLaser Eyes — last man standing only. Long-range shot.",
    attackName: "Slash",
    attackCd: 0.78,
    attackDamage: 30,
    attackRange: 2.6,
    scale: 1.16,
    move: 1.05,
    colors: { head: 0x141414, torso: 0x0e0e0e, arm: 0x1a1a1a, leg: 0x101010 },
  },
];

export const MINION_VISUAL: CharColors = {
  head: 0xd1242a,
  torso: 0x1a1a1a,
  arm: 0xd1242a,
  leg: 0x7a1418,
};

const CHAR_MAP: Record<string, CharDef> = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));

export function getChar(id: string): CharDef {
  const c = CHAR_MAP[id];
  if (!c) throw new Error(`Unknown character ${id}`);
  return c;
}

export function charsByRole(role: Role): CharDef[] {
  return CHARACTERS.filter((c) => c.role === role);
}

export const MAPS: { id: MapId; name: string; weight: number; odds: string }[] = [
  { id: "forest", name: "Forest", weight: 40, odds: "40%" },
  { id: "classic", name: "Classic Battlegrounds", weight: 30, odds: "30%" },
  { id: "city", name: "City", weight: 1, odds: "1.0%" },
  { id: "hq", name: "Roblox HQ", weight: 0.3, odds: "0.3%" },
];

export function mapName(id: MapId): string {
  return MAPS.find((m) => m.id === id)?.name ?? "Forest";
}

export function rollMap(): MapId {
  const sum = MAPS.reduce((s, m) => s + m.weight, 0);
  let r = Math.random() * sum;
  for (const m of MAPS) {
    r -= m.weight;
    if (r <= 0) return m.id;
  }
  return "forest";
}

function rollBotKiller(): string {
  const r = Math.random();
  if (r < 0.6) return "jason";
  if (r < 0.78) return "coolkid";
  if (r < 0.9) return "johndoe";
  return "onex";
}

export interface EquipState {
  equippedSurvivor: string | null;
  equippedKiller: string | null;
}

export function rollRandomMatch(profile: EquipState): MatchOpts | string {
  if (!profile.equippedSurvivor || !profile.equippedKiller) {
    return "Equip a survivor and a killer first.";
  }
  const mapId = rollMap();
  const youKiller = Math.random() < 0.5;
  const killerCharId = youKiller ? profile.equippedKiller : rollBotKiller();
  return {
    mapId,
    mapName: mapName(mapId),
    mode: "random",
    playerRole: youKiller ? "killer" : "survivor",
    playerCharId: youKiller ? profile.equippedKiller : profile.equippedSurvivor,
    killerCharId,
    reveal: youKiller ? "The killer is you." : `The killer is ${getChar(killerCharId).name}.`,
  };
}

export function makeServerMatch(
  role: Role,
  map: MapId | "random",
  profile: EquipState,
): MatchOpts | string {
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
    reveal:
      role === "killer"
        ? "Your server. You are the killer."
        : `Your server. Killer: ${getChar(killerCharId).name}.`,
  };
}

export function makePractice(role: Role, profile: EquipState): MatchOpts | string {
  const charId = role === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
  if (!charId) return role === "survivor" ? "Equip a survivor first." : "Equip a killer first.";
  const killerCharId = role === "killer" ? charId : "jason";
  return {
    mapId: "forest",
    mapName: "Forest",
    mode: "practice",
    playerRole: role,
    playerCharId: charId,
    killerCharId,
    reveal: "Practice. Generators you finish still pay.",
  };
}

export function makeLms(role: Role, profile: EquipState): MatchOpts | string {
  const charId = role === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
  if (!charId) return role === "survivor" ? "Equip a survivor first." : "Equip a killer first.";
  const killerCharId = role === "killer" ? charId : (profile.equippedKiller ?? "jason");
  const mapId = rollMap();
  return {
    mapId,
    mapName: mapName(mapId),
    mode: "lms",
    playerRole: role,
    playerCharId: charId,
    killerCharId,
    reveal: "Last man standing. The clock is 1:20.",
  };
}

export function formatTime(t: number): string {
  const s = Math.max(0, Math.ceil(t - 1e-4));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function moneyText(n: number): string {
  return `$${n.toFixed(2)}`;
}
