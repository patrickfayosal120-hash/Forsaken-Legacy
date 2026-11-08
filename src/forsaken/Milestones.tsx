import { useState } from "react";
import { getChar } from "./content";
import {
  equipAllMilestone4,
  equipMilestone,
  getEquippedMilestone,
  getLevel,
  milestoneNeed,
  useProfile,
} from "./save";

const SURVIVORS = ["noob", "elliot", "shedletsky", "chance"] as const;
const KILLERS = ["jason", "coolkid", "johndoe", "onex"] as const;

const MILE_ABILITY: Record<string, string> = {
  noob: "Ghost Burger — you can't see killers for 10s. 50s cooldown. Stay far and they will not attack. Get close and they can.",
  shedletsky: "Fried Chicken — 2 uses. Heals you +2 HP each second for 5 seconds.",
  elliot: "Rush Hour — double speed for 5 seconds. 50s cooldown.",
};
const ROWS = [
  { tier: 1, text: "Milestone 1 — Requires level 25 to unlock." },
  { tier: 2, text: "Milestone 2 — Requires level 50 to unlock." },
  { tier: 3, text: "Milestone 3 — Requires level 75 to unlock." },
  { tier: 4, text: "Milestone 4 — Required level 100 MAX to unlock." },
] as const;

const btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide disabled:opacity-40";
const primary = `${btn} h-12 bg-blood px-4 text-lg text-bone`;
const ghost = `${btn} h-12 border border-line bg-surface px-4 text-lg text-fg`;

export function MilestonesMenu({ onBack }: { onBack: () => void }) {
  const profile = useProfile();
  const [selected, setSelected] = useState(profile.equippedSurvivor || "noob");
  const [note, setNote] = useState("");
  const def = getChar(selected);
  const level = getLevel(def.id);
  const equipped = getEquippedMilestone(def.id);

  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <h1 className="font-display text-4xl">Milestones</h1>
      <p className="mt-2 text-sm text-muted">You can equip and get extra HP, Defense, and DMG.</p>

      <p className="mt-5 text-xs tracking-[0.18em] text-muted">SELECT YOUR SURVIVORS</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {SURVIVORS.map((id) => (
          <Pick key={id} id={id} on={selected === id} onPick={setSelected} />
        ))}
      </div>

      <p className="mt-5 text-xs tracking-[0.18em] text-muted">SELECT YOUR KILLER</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {KILLERS.map((id) => (
          <Pick key={id} id={id} on={selected === id} onPick={setSelected} />
        ))}
      </div>

      <section className="hud-panel mt-5 p-4">
        <h2 className="font-display text-3xl leading-none">{def.name}</h2>
        <p className="mt-1 text-sm text-muted">Level {level}/100{equipped ? ` · Milestone ${equipped} equipped` : ""}</p>
        <ul className="mt-4 flex flex-col gap-2">
          {ROWS.map((row) => {
            const open = level >= milestoneNeed(row.tier);
            const on = equipped === row.tier;
            const ability = row.tier === 1 ? MILE_ABILITY[def.id] : "";
            const stats = row.tier === 4 ? "+10 HP, +10 DMG, Defense +20" : row.tier === 3 ? "+10 HP, +10 DMG" : "";
            return (
              <li key={row.tier} className="rounded-lg border border-line px-3 py-2">
                <p className="text-sm text-bone">{row.text}</p>
                {stats ? <p className="mt-1 text-xs text-gold">{stats}</p> : null}
                {ability ? <p className="mt-1 text-xs text-bone">{ability}</p> : null}
                <button
                  type="button"
                  className={`${on ? primary : ghost} mt-2 h-10 w-full text-base`}
                  disabled={!open && !on}
                  onClick={() => setNote(equipMilestone(def.id, row.tier) ?? "")}
                >
                  {!open ? `Level ${milestoneNeed(row.tier)}` : on ? "Equipped" : "Equip"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {note ? <p className="mt-3 text-sm text-gold">{note}</p> : null}
      <div className="mt-4 flex flex-col gap-2">
        <button type="button" className={ghost} onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className={primary}
          onClick={() => {
            const count = equipAllMilestone4();
            setNote(count ? `Equipped Milestone 4 on ${count}.` : "Milestone 4 needs level 100.");
          }}
        >
          Equip All Milestone 4 Only
        </button>
      </div>
      <p className="mt-3 text-xs text-muted">Equipped milestones save when you leave or close the tab.</p>
    </main>
  );
}

function Pick({ id, on, onPick }: { id: string; on: boolean; onPick: (id: string) => void }) {
  const name = getChar(id).name;
  const tier = getEquippedMilestone(id);
  return (
    <button type="button" className={`${on ? primary : ghost} h-14 w-full flex-col text-base leading-tight`} onClick={() => onPick(id)}>
      <span>{name}</span>
      <span className="text-[10px] tracking-wide opacity-80">{tier ? `M${tier}` : `Lv ${getLevel(id)}`}</span>
    </button>
  );
}
