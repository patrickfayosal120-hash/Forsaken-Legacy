import type { MapId } from "./types";

export const WORLD = 30;

export interface Obstacle {
  x: number;
  z: number;
  r: number;
  kind: "tree" | "rock" | "building" | "pillar" | "monument" | "wall" | "house" | "artillery" | "tank" | "flag" | "stud" | "fire" | "dust" | "grenade" | "corpse";
  yaw?: number;
  tint?: number;
}

export interface Bunker {
  x: number;
  z: number;
  hw: number;
  hd: number;
  depth: number;
  ramp: number;
  door: number;
}

export interface Layout {
  obstacles: Obstacle[];
  gens: { x: number; z: number }[];
  bunker: Bunker | null;
}

export function surfaceY(b: Bunker | null, x: number, z: number) {
  if (!b) return 0;
  const lx = x - b.x;
  const lz = z - b.z;
  const lip = b.hw;
  const outside = lip + b.ramp;
  if (lx > lip - 0.05 && lx < outside && Math.abs(lz) < b.door * 0.5) {
    const t = (outside - lx) / b.ramp;
    return -b.depth * Math.min(1, Math.max(0, t));
  }
  if (Math.abs(lx) < b.hw - 0.2 && Math.abs(lz) < b.hd - 0.2) return -b.depth;
  return 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function laneBlocked(x: number, z: number) {
  if (Math.hypot(x, z - 18) < 7.5) return true;
  if (Math.hypot(x, z + 18) < 7.5) return true;
  if (Math.abs(x) < 6.5 && z > 4 && z < 24) return true;
  return false;
}

function forest(): Layout {
  const gens = [
    { x: -16, z: -8 },
    { x: 15, z: -14 },
    { x: -18, z: 8 },
    { x: 17, z: 6 },
    { x: 8, z: -22 },
  ];
  const rand = mulberry32(0x5a11);
  const obstacles: Obstacle[] = [];
  let guard = 0;
  while (obstacles.filter((o) => o.kind === "tree").length < 42 && guard < 400) {
    guard++;
    const x = (rand() * 2 - 1) * 27;
    const z = (rand() * 2 - 1) * 27;
    if (laneBlocked(x, z)) continue;
    if (gens.some((g) => Math.hypot(g.x - x, g.z - z) < 5)) continue;
    if (obstacles.some((o) => Math.hypot(o.x - x, o.z - z) < 2.4)) continue;
    obstacles.push({ x, z, r: 0.85, kind: "tree" });
  }
  guard = 0;
  while (obstacles.filter((o) => o.kind === "rock").length < 8 && guard < 80) {
    guard++;
    const x = (rand() * 2 - 1) * 26;
    const z = (rand() * 2 - 1) * 26;
    if (laneBlocked(x, z)) continue;
    if (gens.some((g) => Math.hypot(g.x - x, g.z - z) < 4)) continue;
    obstacles.push({ x, z, r: 1.05, kind: "rock" });
  }
  return { obstacles, gens, bunker: null };
}

function city(): Layout {
  const obstacles: Obstacle[] = [];
  for (let gx = -2; gx <= 2; gx++) {
    for (let gz = -2; gz <= 2; gz++) {
      if (gx === 0 || gz === 0) continue;
      obstacles.push({ x: gx * 12, z: gz * 12, r: 3.5, kind: "building" });
    }
  }
  const gens = [
    { x: 0, z: 12 },
    { x: 0, z: -12 },
    { x: 12, z: 0 },
    { x: -12, z: 0 },
    { x: 0, z: 0 },
  ];
  return { obstacles, gens, bunker: null };
}

function hq(): Layout {
  const obstacles: Obstacle[] = [
    { x: 0, z: 0, r: 4.2, kind: "monument" },
    { x: 12, z: 12, r: 1.25, kind: "pillar" },
    { x: -12, z: 12, r: 1.25, kind: "pillar" },
    { x: 12, z: -12, r: 1.25, kind: "pillar" },
    { x: -12, z: -12, r: 1.25, kind: "pillar" },
    { x: 16, z: 8, r: 2.2, kind: "building" },
    { x: -16, z: 8, r: 2.2, kind: "building" },
    { x: 16, z: -10, r: 2.2, kind: "building" },
    { x: -16, z: -10, r: 2.2, kind: "building" },
  ];
  const gens = [
    { x: 8, z: 16 },
    { x: -8, z: 16 },
    { x: 10, z: -18 },
    { x: -14, z: -16 },
    { x: 22, z: -2 },
  ];
  return { obstacles, gens, bunker: null };
}

function wallRun(out: Obstacle[], x: number, z: number, len: number, alongX: boolean) {
  const n = Math.max(1, Math.round(len / 2.2));
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : -len / 2 + (i + 0.5) * (len / n);
    out.push({
      x: alongX ? x + t : x,
      z: alongX ? z : z + t,
      r: 1.05,
      kind: "wall",
      yaw: alongX ? 0 : Math.PI / 2,
    });
  }
}

function bunkerWalls(out: Obstacle[], b: Bunker) {
  const step = 2.2;
  for (let x = b.x - b.hw; x <= b.x + b.hw + 0.01; x += step) {
    out.push({ x, z: b.z + b.hd, r: 1.05, kind: "wall", yaw: 0 });
    out.push({ x, z: b.z - b.hd, r: 1.05, kind: "wall", yaw: 0 });
  }
  for (let z = b.z - b.hd; z <= b.z + b.hd + 0.01; z += step) {
    out.push({ x: b.x - b.hw, z, r: 1.05, kind: "wall", yaw: Math.PI / 2 });
    if (Math.abs(z - b.z) > b.door * 0.55) {
      out.push({ x: b.x + b.hw, z, r: 1.05, kind: "wall", yaw: Math.PI / 2 });
    }
  }
}

function classic(): Layout {
  const bunker: Bunker = { x: -14, z: -3, hw: 13, hd: 10, depth: 5, ramp: 7.5, door: 6.2 };
  const inside = (x: number, z: number) => Math.abs(x - bunker.x) < bunker.hw && Math.abs(z - bunker.z) < bunker.hd;
  const obstacles: Obstacle[] = [
    { x: 16, z: -18, r: 2.55, kind: "house", yaw: 0.4 },
    { x: 20, z: 16, r: 2.55, kind: "house", yaw: -0.55 },
    { x: 22, z: -24, r: 0.4, kind: "flag", tint: 0xc4313a, yaw: 0.25 },
    { x: 24, z: 22, r: 0.4, kind: "flag", tint: 0x2a5fbf, yaw: -0.4 },
    { x: 10, z: -10, r: 2.05, kind: "tank", yaw: 1.05 },
    { x: 8, z: 10, r: 1.35, kind: "artillery", yaw: -0.7 },
    { x: 18, z: 4, r: 1.35, kind: "artillery", yaw: 0.55 },
  ];
  wallRun(obstacles, 14, -14, 8, true);
  wallRun(obstacles, 18, 8, 6, false);
  wallRun(obstacles, 22, 12, 6, false);
  for (const [x, z, yaw] of [
    [-23, -8, 0.2],
    [-20, 3, 1.1],
    [-9, -9, 0.4],
    [-7, 3.5, 0.8],
    [-17, 5, 0.15],
    [-24, 0, 1.3],
    [-11, 1, 0.6],
  ] as const) {
    obstacles.push({ x, z, r: 0.95, kind: "wall", yaw });
  }
  bunkerWalls(obstacles, bunker);
  for (const [x, z] of [
    [12, -16],
    [22, 8],
    [4, 12],
    [-22, -7],
    [-18, 2],
    [-10, -6],
    [-8, 2],
    [-20, -9],
    [-16, 4],
  ] as const) {
    obstacles.push({ x, z, r: inside(x, z) ? 0.55 : 0.62, kind: "fire" });
  }
  for (const [x, z] of [
    [10, -6],
    [14, -12],
    [18, 8],
    [6, 4],
    [-6, 14],
  ] as const) {
    if (inside(x, z)) continue;
    obstacles.push({ x, z, r: 0, kind: "dust" });
  }
  for (let x = -24; x <= 24; x += 6) {
    for (let z = -24; z <= 24; z += 6) {
      if (inside(x, z)) continue;
      obstacles.push({ x, z, r: 0, kind: "stud" });
    }
  }
  for (const [x, z] of [
    [-22, -4],
    [-18, -8],
    [-15, 2],
    [-11, -7],
    [-8, -1],
    [-21, 4],
    [-13, -8],
    [-17, -1],
  ] as const) {
    obstacles.push({ x, z, r: 0, kind: "grenade" });
  }
  for (const [x, z, yaw] of [
    [-23, 2, 0.4],
    [-19, -5, 1.5],
    [-12, 4, -0.4],
    [-9, -8, 0.9],
    [-16, -9, 2.1],
    [-21, -1, -0.8],
    [-7, 1, 0.2],
  ] as const) {
    obstacles.push({ x, z, r: 0, kind: "corpse", yaw });
  }
  const gens = [
    { x: 26, z: 18 },
    { x: 22, z: -22 },
    { x: -4, z: 22 },
    { x: 8, z: -24 },
    { x: bunker.x, z: bunker.z },
  ];
  return { obstacles, gens, bunker };
}

export function buildLayout(mapId: MapId): Layout {
  if (mapId === "city") return city();
  if (mapId === "hq") return hq();
  if (mapId === "classic") return classic();
  return forest();
}
