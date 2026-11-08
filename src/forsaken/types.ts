export type Role = "survivor" | "killer";
export type Team = "survivor" | "killer" | "minion";
export type MapId = "forest" | "city" | "hq" | "classic";
export type Mode = "random" | "server" | "practice" | "lms";

export interface MatchOpts {
  mapId: MapId;
  mapName: string;
  mode: Mode;
  playerRole: Role;
  playerCharId: string;
  killerCharId: string;
  reveal: string;
  level?: number;
  bonusHp?: number;
  bonusDmg?: number;
  defense?: number;
  milestone?: number;
}

export interface HudSnap {
  phase: "play" | "end";
  timeLeft: number;
  survivorsAlive: number;
  survivorsMax: number;
  gensDone: number;
  gensMax: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  sprintOn: boolean;
  abilityCd: number;
  abilityMax: number;
  abilityName: string;
  attackCd: number;
  attackName: string;
  role: Role;
  charName: string;
  nearGen: boolean;
  genProgress: number;
  fixing: boolean;
  stun: number;
  buff: number;
  weak: number;
  weakLeft: number;
  power: number;
  powerLeft: number;
  hatCd: number;
  rechargeCd: number;
  shotBoost: boolean;
  lms: boolean;
  poison: number;
  level: number;
  engageCd: number;
  laserCd: number;
  bonusDmg: number;
  mileName: string;
  mileCd: number;
  mileLeft: number;
  mileUses: number;
  killerNear: boolean;
  mapName: string;
  markerText: string;
  markerAngle: number;
  endTitle: string;
  endDetail: string;
  earned: number;
  toast: string;
}

export interface EngineApi {
  destroy: () => void;
  toggleSprint: () => void;
  setStick: (x: number, y: number, active: boolean) => void;
  setAttackButton: (held: boolean) => void;
  queueAbility: () => void;
  queueHat: () => void;
  queueRecharge: () => void;
  queueEngage: () => void;
  queueLaser: () => void;
  queueMile: () => void;
  setFixHeld: (held: boolean) => void;
}
