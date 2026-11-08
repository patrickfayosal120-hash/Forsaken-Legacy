import { ArrowLeft, Award, Coins, MessageCircle, Play, Settings, ShoppingBag, Skull, Users, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Hud } from "./Hud";
import { ChatMenu } from "./Chat";
import { FriendsMenu, startPresence } from "./Friends";
import { startVoiceBus } from "./voice";
import { MilestonesMenu } from "./Milestones";
import { ShopMenu } from "./Shop";
import { unlockAudio } from "./audio";
import {
  MAPS,
  charsByRole,
  getChar,
  makeLms,
  makePractice,
  makeServerMatch,
  moneyText,
  rollRandomMatch,
} from "./content";
import { buyCharacter, ensureIdentity, equipKiller, equipSurvivor, equippedBonus, getEquippedMilestone, getLevel, loadSave, milestoneStats, toggleMuted, useProfile, xpForLevel } from "./save";
import { LayoutEditor, SettingsMenu } from "./Settings";
import type { EngineApi, HudSnap, MapId, MatchOpts, Role } from "./types";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

type Screen =
  | { name: "menu" }
  | { name: "settings" }
  | { name: "chat" }
  | { name: "friends" }
  | { name: "milestones" }
  | { name: "shop" }
  | { name: "customize"; kind: "buttons" | "ui" }
  | { name: "roster"; tab: Role }
  | { name: "play"; error?: string }
  | { name: "server" }
  | { name: "search"; opts: MatchOpts; line: string }
  | { name: "match"; opts: MatchOpts };

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function MenuBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
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
      const moonX = w * 0.78;
      const moonY = h * 0.2;
      const glow = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, Math.max(w, h) * 0.45);
      glow.addColorStop(0, blood);
      glow.addColorStop(1, bg);
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = bone;
      ctx.beginPath();
      ctx.arc(moonX, moonY, Math.min(w, h) * 0.045, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = deep;
      const ground = h * 0.72;
      for (let i = 0; i < 16; i++) {
        const x = (i / 15) * w;
        const th = h * (0.18 + ((i * 3) % 5) * 0.035);
        const tw = 28 + (i % 4) * 10;
        ctx.beginPath();
        ctx.moveTo(x, ground - th);
        ctx.lineTo(x + tw, ground + 8);
        ctx.lineTo(x - tw, ground + 8);
        ctx.fill();
      }
      ctx.fillRect(0, ground, w, h - ground);
      const kx = w * 0.22;
      const ky = ground - h * 0.16;
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
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

function MoneyPill() {
  const profile = useProfile();
  const [pulse, setPulse] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setPulse((n) => n + 1);
  }, [profile]);
  return (
    <div className="hud-panel flex items-center gap-2 px-3 py-2">
      <Coins className="h-5 w-5 text-gold" />
      <div>
        <p className="font-display text-xl leading-none text-gold tabular-nums">{moneyText(profile.money)}</p>
        {pulse > 0 ? <Saved key={pulse} /> : <p className="text-xs text-muted">Saved on this device</p>}
      </div>
    </div>
  );
}

function Saved() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 1200);
    return () => clearTimeout(t);
  }, []);
  return <p className="text-xs text-gold">{on ? "Saved" : "Saved on this device"}</p>;
}

function Mini({ id }: { id: string }) {
  return (
    <div className={`mini mini-${id}`} aria-hidden>
      <i className="head" />
      <i className="torso" />
      <i className="arm l" />
      <i className="arm r" />
      <i className="leg l" />
      <i className="leg r" />
    </div>
  );
}

const btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide transition disabled:opacity-40";
const btnPrimary = `${btn} h-12 bg-blood px-5 text-lg text-bone`;
const btnGhost = `${btn} h-12 border border-line bg-surface px-5 text-lg text-fg`;

function tryLockLandscape() {
  try {
    const ore = window.screen?.orientation as ScreenOrientation & { lock?: (type: string) => Promise<void> };
    const pending = ore?.lock?.("landscape");
    void pending?.catch(() => {});
  } catch {
    /* not allowed until fullscreen on some browsers */
  }
}

export function ForsakenApp() {
  const [screen, setScreen] = useState<Screen>({ name: "menu" });
  const profile = useProfile();
  const auth = useCurrentUserState();

  useEffect(() => {
    loadSave();
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    if (auth.isPending) return;
    const user = auth.user;
    ensureIdentity(
      user && !user.isDevFallback ? { id: user.id, name: user.displayName, real: true } : { id: "", name: null, real: false },
    );
    startPresence();
    startVoiceBus();
  }, [auth.isPending, auth.user]);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-bg text-fg">
      {screen.name !== "match" ? <MenuBackdrop /> : null}
      <div className={screen.name === "match" ? "" : "relative z-10"}>
        {screen.name === "menu" ? (
          <MainMenu
            onPlay={() => setScreen({ name: "play" })}
            onSettings={() => setScreen({ name: "settings" })}
            onChat={() => setScreen({ name: "chat" })}
            onFriends={() => setScreen({ name: "friends" })}
            onMilestones={() => setScreen({ name: "milestones" })}
            onShop={() => setScreen({ name: "shop" })}
            onRoster={(tab) => setScreen({ name: "roster", tab })}
          />
        ) : null}
        {screen.name === "chat" ? <ChatMenu onBack={() => setScreen({ name: "menu" })} /> : null}
        {screen.name === "friends" ? <FriendsMenu onBack={() => setScreen({ name: "menu" })} /> : null}
        {screen.name === "milestones" ? <MilestonesMenu onBack={() => setScreen({ name: "menu" })} /> : null}
        {screen.name === "shop" ? <ShopMenu onBack={() => setScreen({ name: "menu" })} /> : null}
        {screen.name === "settings" ? (
          <SettingsMenu onBack={() => setScreen({ name: "menu" })} onCustomize={(kind) => setScreen({ name: "customize", kind })} />
        ) : null}
        {screen.name === "customize" ? <LayoutEditor kind={screen.kind} onBack={() => setScreen({ name: "settings" })} /> : null}
        {screen.name === "roster" ? <Roster tab={screen.tab} onTab={(tab) => setScreen({ name: "roster", tab })} onBack={() => setScreen({ name: "menu" })} /> : null}
        {screen.name === "play" ? (
          <PlayMenu
            error={screen.error}
            onBack={() => setScreen({ name: "menu" })}
            onSearch={() => {
              const rolled = rollRandomMatch(profile);
              if (typeof rolled === "string") {
                setScreen({ name: "play", error: rolled });
                return;
              }
              setScreen({ name: "search", opts: rolled, line: "Searching for a server…" });
            }}
            onServer={() => setScreen({ name: "server" })}
            onPractice={(role) => {
              const match = makePractice(role, profile);
              if (typeof match === "string") {
                setScreen({ name: "play", error: match });
                return;
              }
              tryLockLandscape();
              setScreen({ name: "match", opts: stamp(match) });
            }}
            onLms={(role) => {
              const match = makeLms(role, profile);
              if (typeof match === "string") {
                setScreen({ name: "play", error: match });
                return;
              }
              tryLockLandscape();
              setScreen({ name: "match", opts: stamp(match) });
            }}
          />
        ) : null}
        {screen.name === "server" ? (
          <ServerMenu
            onBack={() => setScreen({ name: "play" })}
            onStart={(role, map) => {
              const match = makeServerMatch(role, map, profile);
              if (typeof match === "string") return match;
              tryLockLandscape();
              setScreen({ name: "match", opts: stamp(match) });
              return null;
            }}
          />
        ) : null}
        {screen.name === "search" ? (
          <SearchScreen opts={screen.opts} onCancel={() => setScreen({ name: "play" })} onDrop={() => {
            tryLockLandscape();
            setScreen({ name: "match", opts: stamp(screen.opts) });
          }} />
        ) : null}
        {screen.name === "match" ? <MatchScreen opts={screen.opts} onLeave={() => setScreen({ name: "menu" })} /> : null}
      </div>
    </div>
  );
}

function MuteButton() {
  const profile = useProfile();
  return (
    <button type="button" className={`${btnGhost} h-11 w-11 px-0`} onClick={() => toggleMuted()} aria-label={profile.muted ? "Unmute" : "Mute"}>
      {profile.muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
}

function stamp(opts: MatchOpts): MatchOpts {
  const level = getLevel(opts.playerCharId);
  const ms = equippedBonus(opts.playerCharId);
  return {
    ...opts,
    level,
    bonusHp: ms.hp,
    bonusDmg: ms.dmg,
    defense: ms.defense,
    milestone: getEquippedMilestone(opts.playerCharId),
  };
}

function MainMenu({
  onPlay,
  onRoster,
  onSettings,
  onChat,
  onFriends,
  onMilestones,
  onShop,
}: {
  onPlay: () => void;
  onRoster: (tab: Role) => void;
  onSettings: () => void;
  onChat: () => void;
  onFriends: () => void;
  onMilestones: () => void;
  onShop: () => void;
}) {
  const profile = useProfile();
  const survivor = profile.equippedSurvivor ? getChar(profile.equippedSurvivor) : null;
  const killer = profile.equippedKiller ? getChar(profile.equippedKiller) : null;
  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-5 sm:px-8 sm:py-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm tracking-[0.32em] text-blood">ASYMMETRICAL</p>
          <h1 className="font-display text-4xl leading-none sm:text-7xl">FORSAKEN</h1>
          <p className="mt-2 max-w-md text-muted">Fix the generators. Or be the thing in the trees.</p>
        </div>
        <div className="flex items-start gap-2">
          <MuteButton />
          <MoneyPill />
        </div>
      </header>

      <button type="button" className={`${btnPrimary} mt-8 h-16 w-full text-2xl sm:w-72`} onClick={onPlay}>
        <Play className="h-6 w-6" />
        Play
      </button>
      <button type="button" className={`${btnGhost} mt-3 h-14 w-full text-xl sm:w-72`} onClick={onShop}>
        <ShoppingBag className="h-5 w-5" />
        Shop
      </button>
      <button type="button" className={`${btnGhost} mt-3 h-14 w-full text-xl sm:w-72`} onClick={onSettings}>
        <Settings className="h-5 w-5" />
        Settings
      </button>
      <button type="button" className={`${btnGhost} mt-3 h-14 w-full text-xl sm:w-72`} onClick={onChat}>
        <MessageCircle className="h-5 w-5" />
        Chat
      </button>
      <button type="button" className={`${btnGhost} mt-3 h-14 w-full text-xl sm:w-72`} onClick={onFriends}>
        <Users className="h-5 w-5" />
        Friends list
      </button>
      <button type="button" className={`${btnGhost} mt-3 h-14 w-full text-xl sm:w-72`} onClick={onMilestones}>
        <Award className="h-5 w-5" />
        Milestones
      </button>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <CharacterCard
          kicker="Survivor"
          icon={<Users className="h-4 w-4" />}
          name={survivor?.name ?? "Unequipped"}
          id={survivor?.id}
          detail={survivor ? `Level ${getLevel(survivor.id)} · ${survivor.hp} HP · ${survivor.abilityName}` : "Equip someone"}
          onChange={() => onRoster("survivor")}
        />
        <CharacterCard
          kicker="Killer"
          icon={<Skull className="h-4 w-4" />}
          name={killer?.name ?? "Unequipped"}
          id={killer?.id}
          detail={killer ? `Level ${getLevel(killer.id)} · ${killer.hp} HP · ${killer.abilityName}` : "Equip someone"}
          onChange={() => onRoster("killer")}
        />
      </div>

      <MapOdds />
      <p className="mt-auto pt-6 text-xs text-muted">Money, levels, friends, chat, audio, and layout save when you leave, switch sites, or close the tab.</p>
    </main>
  );
}

function CharacterCard({
  kicker,
  icon,
  name,
  id,
  detail,
  onChange,
}: {
  kicker: string;
  icon: ReactNode;
  name: string;
  id?: string;
  detail: string;
  onChange: () => void;
}) {
  return (
    <section className="hud-panel flex items-center gap-4 p-4">
      {id ? <Mini id={id} /> : <div className="h-16 w-14 rounded-md border border-line bg-surface-2" />}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-xs tracking-[0.18em] text-muted">
          {icon}
          {kicker.toUpperCase()}
        </p>
        <h2 className="truncate font-display text-2xl leading-tight">{name}</h2>
        <p className="truncate text-sm text-muted">{detail}</p>
      </div>
      <button type="button" className={btnGhost} onClick={onChange}>
        Change
      </button>
    </section>
  );
}

function MapOdds() {
  return (
    <p className="mt-6 text-sm text-muted">
      Maps · {MAPS.map((m) => `${m.name} ${m.odds}`).join(" · ")}
    </p>
  );
}

function PlayMenu({
  error,
  onBack,
  onSearch,
  onServer,
  onPractice,
  onLms,
}: {
  error?: string;
  onBack: () => void;
  onSearch: () => void;
  onServer: () => void;
  onPractice: (role: Role) => void;
  onLms: (role: Role) => void;
}) {
  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <Header title="Play" onBack={onBack} />
      {error ? <p className="mt-4 rounded-lg border border-blood bg-surface px-3 py-2 text-sm text-bone">{error}</p> : null}
      <div className="mt-6 flex flex-col gap-3">
        <button type="button" className={`${btnPrimary} h-16 w-full text-xl`} onClick={onSearch}>
          Random Join Server
        </button>
        <p className="-mt-1 text-sm text-muted">The killer is random: you, or another player.</p>
        <button type="button" className={`${btnGhost} h-14 w-full`} onClick={onServer}>
          Create own server
        </button>
        <button type="button" className={`${btnGhost} h-14 w-full`} onClick={() => onPractice("survivor")}>
          Practice
        </button>
        <button type="button" className={`${btnGhost} h-12 w-full text-base`} onClick={() => onPractice("killer")}>
          Killer drill
        </button>
        <button type="button" className={`${btnGhost} h-14 w-full`} onClick={() => onLms("survivor")}>
          Last Man Standing
        </button>
        <p className="-mt-1 text-sm text-muted">1 survivor vs the killer. Clock starts at 1:20.</p>
        <button type="button" className={`${btnGhost} h-12 w-full text-base`} onClick={() => onLms("killer")}>
          LMS as killer
        </button>
      </div>
      <MapOdds />
    </main>
  );
}

function SearchScreen({ opts, onCancel, onDrop }: { opts: MatchOpts; onCancel: () => void; onDrop: () => void }) {
  const [line, setLine] = useState("Searching for a server…");
  const [ready, setReady] = useState(false);
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;
  useEffect(() => {
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
  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col items-start px-4 py-5">
      <p className="font-display text-sm tracking-[0.28em] text-blood">SERVER</p>
      <h1 className="mt-3 font-display text-4xl">{line}</h1>
      <p className="mt-3 text-muted">Other players in this build are bots. Your money still saves.</p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <button type="button" className={`${btnPrimary} w-full`} disabled={!ready} onClick={onDrop}>
          Drop in
        </button>
        <button type="button" className={`${btnGhost} w-full`} onClick={onCancel}>
          Back
        </button>
      </div>
    </main>
  );
}

function ServerMenu({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (role: Role, map: MapId | "random") => string | null;
}) {
  const profile = useProfile();
  const [role, setRole] = useState<Role>("survivor");
  const [map, setMap] = useState<MapId | "random">("random");
  const [err, setErr] = useState("");
  const charId = role === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
  const charName = charId ? getChar(charId).name : "Unequipped";
  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <Header title="Your server" onBack={onBack} />
      <p className="mt-4 text-muted">Bots fill the other side. Pick who you are.</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["survivor", "killer"] as const).map((r) => (
          <button key={r} type="button" className={`${role === r ? btnPrimary : btnGhost} w-full capitalize`} onClick={() => setRole(r)}>
            {r}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">Playing as {charName}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className={map === "random" ? btnPrimary : btnGhost} onClick={() => setMap("random")}>
          Random map
        </button>
        {MAPS.filter((m) => m.id !== "classic").map((m) => (
          <button key={m.id} type="button" className={map === m.id ? btnPrimary : btnGhost} onClick={() => setMap(m.id)}>
            {m.name}
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs tracking-[0.18em] text-muted">NEW MAP</p>
      <button
        type="button"
        className={`${map === "classic" ? btnPrimary : btnGhost} mt-2 w-full`}
        onClick={() => setMap("classic")}
      >
        Classic Battlegrounds
      </button>
      {err ? <p className="mt-3 text-sm text-blood">{err}</p> : null}
      <button
        type="button"
        className={`${btnPrimary} mt-6 w-full`}
        onClick={() => {
          const message = onStart(role, map);
          setErr(message ?? "");
        }}
      >
        Start match
      </button>
      <ul className="mt-4 text-sm text-muted">
        <li>You · {charName}</li>
        <li>{role === "killer" ? "9 survivor bots" : "8 survivor bots"}</li>
        <li>{role === "killer" ? "Killer · you" : "Killer · random bot"}</li>
      </ul>
    </main>
  );
}

function Roster({ tab, onTab, onBack }: { tab: Role; onTab: (tab: Role) => void; onBack: () => void }) {
  const profile = useProfile();
  const list = charsByRole(tab);
  const equipped = tab === "survivor" ? profile.equippedSurvivor : profile.equippedKiller;
  const [selected, setSelected] = useState(equipped ?? list[0]!.id);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");
  const def = getChar(list.some((c) => c.id === selected) ? selected : list[0]!.id);
  const owned = (tab === "survivor" ? profile.ownedSurvivors : profile.ownedKillers).includes(def.id);
  const isEquipped = equipped === def.id;

  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-5">
      <Header title={tab === "survivor" ? "Survivors" : "Killers"} onBack={onBack} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" className={tab === "survivor" ? btnPrimary : btnGhost} onClick={() => onTab("survivor")}>
          Survivors
        </button>
        <button type="button" className={tab === "killer" ? btnPrimary : btnGhost} onClick={() => onTab("killer")}>
          Killers
        </button>
      </div>
      <p className="mt-3 text-xs tracking-[0.18em] text-muted">LEVELS</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {list.map((c) => {
          const have = (c.role === "survivor" ? profile.ownedSurvivors : profile.ownedKillers).includes(c.id);
          const on = c.id === def.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelected(c.id);
                setPending(false);
                setErr("");
              }}
              className={`hud-panel flex items-center gap-3 p-3 text-left ${on ? "border-blood" : ""}`}
            >
              <Mini id={c.id} />
              <span>
                <span className="block font-display text-xl leading-tight">{c.name}</span>
                <span className="block text-sm text-gold">Level {getLevel(c.id)}/100</span>
                <span className="block text-sm text-muted">
                  {c.price === 0 ? "Default" : have ? "Owned" : moneyText(c.price)}
                  {equipped === c.id ? " · Equipped" : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <section className="hud-panel mt-4 p-4">
        <div className="flex items-center gap-4">
          <Mini id={def.id} />
          <div>
            <p className="text-xs tracking-[0.18em] text-gold">LEVEL</p>
            <h2 className="font-display text-3xl leading-none">{def.name}</h2>
            <LevelLine id={def.id} hp={def.hp} />
          </div>
        </div>
        <p className="mt-3 whitespace-pre-line text-sm text-bone">{def.abilityText}</p>
        {!owned ? <p className="mt-2 text-gold">{moneyText(def.price)}</p> : null}
        {err ? <p className="mt-2 text-sm text-blood">{err}</p> : null}
        {pending ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              onClick={() => {
                const message = buyCharacter(def.id);
                setErr(message ?? "");
                if (!message) setPending(false);
              }}
            >
              Buy {moneyText(def.price)}
            </button>
            <button type="button" className={btnGhost} onClick={() => setPending(false)}>
              Back
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {!owned ? (
              <button type="button" className={btnPrimary} disabled={profile.money < def.price} onClick={() => setPending(true)}>
                {profile.money < def.price ? `Need ${moneyText(def.price)}` : `Buy ${moneyText(def.price)}`}
              </button>
            ) : null}
            <button
              type="button"
              className={btnPrimary}
              disabled={!owned || isEquipped}
              onClick={() => (tab === "survivor" ? equipSurvivor(def.id) : equipKiller(def.id))}
            >
              Equip
            </button>
            <button
              type="button"
              className={btnGhost}
              disabled={!isEquipped}
              onClick={() => (tab === "survivor" ? equipSurvivor(null) : equipKiller(null))}
            >
              Unequip
            </button>
            <button type="button" className={btnGhost} onClick={onBack}>
              Back
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function LevelLine({ id, hp }: { id: string; hp: number }) {
  const profile = useProfile();
  const row = profile.levels[id];
  const level = Math.min(100, Math.max(1, Math.floor(row?.level ?? 1)));
  const xp = level >= 100 ? 0 : Math.max(0, Math.floor(row?.xp ?? 0));
  const next = xpForLevel(level);
  const bonus = equippedBonus(id);
  const tier = getEquippedMilestone(id);
  const width = level >= 100 ? 100 : next ? Math.min(100, (xp / next) * 100) : 0;
  return (
    <div className="mt-1">
      <p className="text-sm text-muted">
        Level {level}/100 · HP {hp + bonus.hp}/{hp + bonus.hp}
        {bonus.dmg ? ` · +${bonus.dmg} DMG` : ""}
        {bonus.defense ? ` · Defense +${bonus.defense}` : ""}
      </p>
      <div className="mt-2 h-2 w-44 overflow-hidden rounded-full bg-bg">
        <div className="h-full bg-gold" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted">
        {level >= 100 ? "MAX" : `${xp}/${next} XP`}
        {tier ? ` · Milestone ${tier} equipped` : ""}
        {!tier && milestoneStats(level).m1 ? " · Milestone unlocked" : ""}
      </p>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button type="button" className={btnGhost} onClick={onBack}>
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>
      <h1 className="font-display text-3xl">{title}</h1>
      <MoneyPill />
    </div>
  );
}

function usePortraitPhone() {
  const [need, setNeed] = useState(false);
  useEffect(() => {
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

function MatchScreen({ opts, onLeave }: { opts: MatchOpts; onLeave: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<EngineApi | null>(null);
  const hudRef = useRef<HudSnap>(blankHud(opts));
  const [ready, setReady] = useState(false);
  const [fail, setFail] = useState<string | null>(null);
  const [ask, setAsk] = useState(false);
  const [intro, setIntro] = useState(true);
  const portrait = usePortraitPhone();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 2400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    let api: EngineApi | null = null;
    void import("./engine")
      .then((mod) => {
        if (dead) return;
        api = mod.startEngine(canvas, opts, (snap) => {
          hudRef.current = snap;
        });
        apiRef.current = api;
        setReady(true);
      })
      .catch((err: unknown) => {
        if (!dead) setFail(err instanceof Error ? err.message : "Could not start the match");
      });
    return () => {
      dead = true;
      api?.destroy();
      apiRef.current = null;
      try {
        window.screen?.orientation?.unlock?.();
      } catch {
        /* ignore */
      }
    };
  }, [opts]);

  return (
    <div className="match-root fixed inset-0 touch-none bg-bg-deep" style={{ touchAction: "none" }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />
      {!ready && !fail ? (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl">Entering {opts.mapName}…</p>
      ) : null}
      {fail ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="hud-panel max-w-md p-5 text-center">
            <p>{fail}</p>
            <button type="button" className={`${btnPrimary} mt-4`} onClick={onLeave}>
              Back
            </button>
          </div>
        </div>
      ) : null}
      {ready ? (
        <Hud
          apiRef={apiRef}
          hudRef={hudRef}
          opts={opts}
          onLeave={() => {
            if (hudRef.current.phase === "end") onLeave();
            else setAsk(true);
          }}
        />
      ) : null}
      {intro && ready ? (
        <div className="pointer-events-none absolute top-24 left-1/2 w-[min(100%,24rem)] -translate-x-1/2 px-4 text-center">
          <p className="font-display text-3xl text-bone">{opts.mapName}</p>
          <p className="mt-1 text-gold">{opts.reveal}</p>
        </div>
      ) : null}
      {ask ? (
        <div className="absolute inset-0 flex items-center justify-center bg-bg p-4">
          <div className="hud-panel w-full max-w-sm p-5 text-center">
            <h2 className="font-display text-2xl">Leave match?</h2>
            <p className="mt-2 text-sm text-muted">Generator money already paid is saved.</p>
            <div className="mt-4 flex gap-2">
              <button type="button" className={`${btnGhost} flex-1`} onClick={() => setAsk(false)}>
                Stay
              </button>
              <button type="button" className={`${btnPrimary} flex-1`} onClick={onLeave}>
                Leave
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {portrait ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
          <p className="font-display text-3xl">Rotate your phone</p>
          <p className="text-muted">Forsaken plays in landscape.</p>
        </div>
      ) : null}
    </div>
  );
}

function blankHud(opts: MatchOpts): HudSnap {
  const def = getChar(opts.playerCharId);
  return {
    phase: "play",
    timeLeft: opts.mode === "lms" ? 80 : 240,
    survivorsAlive: opts.mode === "lms" ? 1 : 9,
    survivorsMax: opts.mode === "lms" ? 1 : 9,
    gensDone: 0,
    gensMax: 5,
    hp: def.hp + (opts.bonusHp ?? 0),
    maxHp: def.hp + (opts.bonusHp ?? 0),
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
    lms: opts.mode === "lms",
    poison: 0,
    level: opts.level ?? getLevel(opts.playerCharId),
    engageCd: 0,
    laserCd: 0,
    bonusDmg: opts.bonusDmg ?? 0,
    mileName: "",
    mileCd: 0,
    mileLeft: 0,
    mileUses: 0,
    killerNear: false,
    mapName: opts.mapName,
    markerText: "",
    markerAngle: 0,
    endTitle: "",
    endDetail: "",
    earned: 0,
    toast: "",
  };
}
