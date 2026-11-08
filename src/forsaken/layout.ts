export type ButtonId = "leave" | "stamina" | "attack" | "ability" | "fix";
export type UiId = "survivors" | "gens" | "timer" | "money" | "vitals" | "stick";
export type SlotId = ButtonId | UiId;
export type Pos = { x: number; y: number };

export const BUTTON_IDS: readonly ButtonId[] = ["leave", "stamina", "attack", "ability", "fix"];
export const UI_IDS: readonly UiId[] = ["survivors", "gens", "timer", "money", "vitals", "stick"];

type Anchor = "tl" | "tr" | "tc" | "bl" | "br" | "bc";

const META: Record<SlotId, { anchor: Anchor; x: number; y: number; place: string; custom: string }> = {
  survivors: { anchor: "tl", x: 1.5, y: 2, place: "absolute top-3 left-3", custom: "" },
  gens: { anchor: "tl", x: 1.5, y: 22, place: "absolute top-24 left-3", custom: "" },
  timer: {
    anchor: "tc",
    x: 50,
    y: 2,
    place: "absolute top-3 left-1/2 w-44 -translate-x-1/2 text-center sm:w-64",
    custom: "w-44 text-center sm:w-64",
  },
  money: { anchor: "tr", x: 1.5, y: 2, place: "absolute top-3 right-3", custom: "" },
  vitals: { anchor: "bl", x: 1.5, y: 2, place: "absolute bottom-4 left-3", custom: "" },
  stick: { anchor: "bl", x: 1.5, y: 34, place: "absolute bottom-40 left-3", custom: "" },
  leave: { anchor: "tr", x: 1.5, y: 16, place: "absolute top-20 right-3", custom: "" },
  stamina: { anchor: "br", x: 1.5, y: 42, place: "absolute right-3 bottom-44", custom: "" },
  attack: { anchor: "br", x: 1.5, y: 26, place: "absolute right-3 bottom-28", custom: "" },
  ability: { anchor: "br", x: 1.5, y: 2, place: "absolute right-3 bottom-4", custom: "" },
  fix: { anchor: "bc", x: 50, y: 2, place: "absolute bottom-4 left-1/2 -translate-x-1/2", custom: "" },
};

export function isButton(id: SlotId): id is ButtonId {
  return (BUTTON_IDS as readonly string[]).includes(id);
}

export function defaultPos(id: SlotId): Pos {
  return { x: META[id].x, y: META[id].y };
}

export function placeClass(id: SlotId, custom: Pos | undefined) {
  return custom ? META[id].custom : META[id].place;
}

export type SlotStyle = {
  position: "absolute";
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  transform?: string;
};

export function slotStyle(id: SlotId, pos: Pos): SlotStyle {
  const a = META[id].anchor;
  if (a === "tr") return { position: "absolute", right: `${pos.x}%`, top: `${pos.y}%` };
  if (a === "tc") return { position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translateX(-50%)" };
  if (a === "bl") return { position: "absolute", left: `${pos.x}%`, bottom: `${pos.y}%` };
  if (a === "br") return { position: "absolute", right: `${pos.x}%`, bottom: `${pos.y}%` };
  if (a === "bc") return { position: "absolute", left: `${pos.x}%`, bottom: `${pos.y}%`, transform: "translateX(-50%)" };
  return { position: "absolute", left: `${pos.x}%`, top: `${pos.y}%` };
}

function clamp(n: number) {
  return Math.min(96, Math.max(0, Math.round(n * 10) / 10));
}

export function nudge(id: SlotId, start: Pos, dxPct: number, dyPct: number): Pos {
  const a = META[id].anchor;
  const x = a === "tr" || a === "br" ? start.x - dxPct : start.x + dxPct;
  const y = a === "bl" || a === "br" || a === "bc" ? start.y - dyPct : start.y + dyPct;
  return { x: clamp(x), y: clamp(y) };
}
