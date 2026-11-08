import { ArrowLeft, Settings } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { playSfx, unlockAudio } from "./audio";
import { syncVoice } from "./voice";
import {
  BUTTON_IDS,
  UI_IDS,
  defaultPos,
  isButton,
  nudge,
  slotStyle,
  type Pos,
  type SlotId,
} from "./layout";
import {
  resetButtons,
  resetUi,
  setButtonPos,
  setMusic,
  setSensitive,
  setSfx,
  setName,
  setUiPos,
  setLowDetail,
  setGraphics,
  setVoiceOn,
  commandsActive,
  isMobileDevice,
  useGoogleAccount,
  useGuestAccount,
  useProfile,
} from "./save";

const btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide transition disabled:opacity-40";
const btnPrimary = `${btn} h-12 bg-blood px-5 text-lg text-bone`;
const btnGhost = `${btn} h-12 border border-line bg-surface px-5 text-lg text-fg`;

export function SettingsMenu({
  onBack,
  onCustomize,
}: {
  onBack: () => void;
  onCustomize: (kind: "buttons" | "ui") => void;
}) {
  const profile = useProfile();
  const auth = useCurrentUserState();
  const [authNote, setAuthNote] = useState("");
  const [category, setCategory] = useState<"all" | "audio" | "account" | "credits" | "premium" | "controls" | "performance">("all");

  useEffect(() => {
    unlockAudio();
  }, []);

  const show = (id: "audio" | "account" | "credits" | "controls" | "premium" | "performance") => category === "all" || category === id;

  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <button type="button" className={btnGhost} onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
        <h1 className="font-display text-3xl">Settings</h1>
        <Settings className="h-6 w-6 text-muted" aria-hidden />
      </div>
      <p className="mt-4 text-sm text-muted">You can switch UI of categories.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(
          [
            ["all", "All"],
            ["audio", "Music & SFX Systems"],
            ["account", "Account"],
            ["credits", "Credits"],
            ["premium", "Premium Tools"],
            ["controls", "Controls and interface"],
            ["performance", "Performance"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={`${category === id ? btnPrimary : btnGhost} h-auto min-h-12 px-3 py-2 text-base`} onClick={() => setCategory(id)}>
            {label}
          </button>
        ))}
      </div>

      {show("audio") ? (
      <section className="hud-panel mt-6 flex flex-col gap-5 p-4">
        <VolumeRow
          label="SFX"
          value={profile.sfx}
          onChange={setSfx}
          onRelease={() => {
            unlockAudio();
            playSfx("coin");
          }}
        />
        <VolumeRow label="Music" value={profile.music} onChange={setMusic} />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl leading-none">Sensitive Music and SFX</p>
            <p className="mt-1 text-sm text-muted">Softer hits and a quieter bed.</p>
          </div>
          <button
            type="button"
            aria-pressed={profile.sensitive}
            className={`pointer-events-auto h-12 w-20 rounded-lg border font-display text-lg ${profile.sensitive ? "border-gold bg-gold text-bg" : "border-line bg-surface text-fg"}`}
            onClick={() => {
              setSensitive(!profile.sensitive);
              unlockAudio();
              playSfx("hit");
            }}
          >
            {profile.sensitive ? "On" : "Off"}
          </button>
        </div>
      </section>
      ) : null}

      {show("controls") ? (
        <>
      <section className="hud-panel mt-4 p-4">
        <p className="text-xs tracking-[0.18em] text-muted">ONLY BUTTONS</p>
        <p className="mt-1 font-display text-2xl leading-none">Customize all buttons</p>
        <p className="mt-2 text-sm text-muted">Leave, stamina, attack, ability, and fix. The rest of the HUD stays put.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" className={`${btnPrimary} flex-1`} onClick={() => onCustomize("buttons")}>
            Customize
          </button>
          <button type="button" className={`${btnGhost} flex-1`} disabled={Object.keys(profile.buttons).length === 0} onClick={() => resetButtons()}>
            Reset
          </button>
        </div>
      </section>

      <section className="hud-panel mt-4 p-4">
        <p className="text-xs tracking-[0.18em] text-muted">INTERFACE</p>
        <p className="mt-1 font-display text-2xl leading-none">Customize UI</p>
        <p className="mt-2 text-sm text-muted">Timer, counts, money, health, and the joystick. Buttons stay put.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" className={`${btnPrimary} flex-1`} onClick={() => onCustomize("ui")}>
            Customize
          </button>
          <button type="button" className={`${btnGhost} flex-1`} disabled={Object.keys(profile.ui).length === 0} onClick={() => resetUi()}>
            Reset
          </button>
        </div>
      </section>
        </>
      ) : null}
      {show("account") ? (
      <section className="hud-panel mt-4 p-4">
        <p className="text-xs tracking-[0.18em] text-muted">PROFILE</p>
        <label className="mt-3 block text-xs tracking-wide text-muted">
          Profile ID
          <input
            readOnly
            value={profile.profileId}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-bg px-3 text-base text-bone outline-none"
          />
        </label>
        <label className="mt-3 block text-xs tracking-wide text-muted">
          User ID
          <input
            readOnly
            value={profile.userId}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-bg px-3 text-base text-bone outline-none"
          />
        </label>
        <label className="mt-3 block text-xs tracking-wide text-muted">
          Name
          <input
            value={profile.name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Name"
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-base text-fg outline-none"
          />
        </label>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setAuthNote("");
              if (!authEnabled) {
                setAuthNote("Google sign-in is not available in this preview. Use a guest account.");
                return;
              }
              useGoogleAccount();
              void signIn("grok-google", { callbackURL: "/" }).catch((err: unknown) => {
                useGuestAccount();
                setAuthNote(err instanceof Error ? err.message : "Google sign-in failed.");
              });
            }}
          >
            Sign in Google (G)
          </button>
          <button
            type="button"
            className={btnGhost}
            onClick={() => {
              useGuestAccount();
              setAuthNote("Signed in with a guest account on this device.");
            }}
          >
            Sign in Guest / Local Account 👤
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">
          {profile.account === "google" && auth.user && !auth.user.isDevFallback
            ? `Google · ${auth.user.displayName || profile.name}`
            : "Guest / local account"}
        </p>
        {authNote ? <p className="mt-2 text-sm text-gold">{authNote}</p> : null}
      </section>
      ) : null}
      {show("credits") ? (
        <section className="hud-panel mt-4 p-6 text-center">
          <p className="text-xs tracking-[0.18em] text-muted">CREDITS</p>
          <p className="mt-4 whitespace-pre-line font-display text-2xl leading-snug text-bone">
            {`Patrick 10 Official
This game is
Unofficial port of
Roblox.
Forsaken™`}
          </p>
        </section>
      ) : null}
      {show("premium") ? (
        <section className="hud-panel mt-4 p-4">
          <p className="text-xs tracking-[0.18em] text-muted">PREMIUM TOOLS</p>
          <p className="mt-1 font-display text-2xl leading-none">Voice Chat</p>
          <p className="mt-2 text-sm text-muted">Permanent. Speak with real players only. Buy it in the shop if it is locked.</p>
          <button
            type="button"
            className={`mt-3 h-12 w-full rounded-lg border font-display text-lg ${profile.voiceOn ? "border-gold bg-gold text-bg" : "border-line bg-surface text-fg"}`}
            disabled={!profile.voiceOwned}
            onClick={() => {
              const next = !profile.voiceOn;
              setVoiceOn(next);
              void syncVoice().then((err) => setAuthNote(err || (next ? "Voice chat is on." : "Voice chat is off.")));
            }}
          >
            {profile.voiceOwned ? (profile.voiceOn ? "On" : "Off") : "Locked"}
          </button>
          <p className="mt-5 font-display text-2xl leading-none">Commands</p>
          <p className="mt-2 text-sm text-muted">
            {commandsActive()
              ? `Unlocked until ${new Date(profile.commandsUntil).toLocaleString()}. Use the Commands tab in Chat.`
              : "Locked. Buy 1 month in the shop, then type in Chat, Commands."}
          </p>
        </section>
      ) : null}
      {show("performance") ? (
        <section className="hud-panel mt-4 flex flex-col gap-4 p-4">
          <p className="text-xs tracking-[0.18em] text-muted">PERFORMANCE</p>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-xl leading-none">Low detail mode</p>
              <p className="mt-1 text-sm text-muted">Reduces lag and visual effects.</p>
            </div>
            <button
              type="button"
              className={`h-12 w-20 rounded-lg border font-display text-lg ${profile.lowDetail ? "border-gold bg-gold text-bg" : "border-line bg-surface text-fg"}`}
              onClick={() => setLowDetail(!profile.lowDetail)}
            >
              {profile.lowDetail ? "On" : "Off"}
            </button>
          </div>
          <div>
            <p className="font-display text-xl leading-none">Graphics</p>
            <div className="mt-3 flex flex-col gap-2">
              <button type="button" className={profile.graphics === "default" ? btnPrimary : btnGhost} onClick={() => setAuthNote(setGraphics("default") ?? "Default graphics.")}>
                Default (Support Mobile And PC)
              </button>
              <button type="button" className={profile.graphics === "realistic" ? btnPrimary : btnGhost} onClick={() => setAuthNote(setGraphics("realistic") ?? "Realistic graphics.")}>
                Realistic (Fine, Support Mobile And PC)
              </button>
              <button
                type="button"
                className={profile.graphics === "very" ? btnPrimary : btnGhost}
                disabled={isMobileDevice()}
                onClick={() => setAuthNote(setGraphics("very") ?? "Very Realistic. PC only. It can crash.")}
              >
                Very Realistic (It might crash, PC only)
              </button>
            </div>
          </div>
        </section>
      ) : null}
      <p className="mt-4 text-xs text-muted">Saves automatically when you leave, switch sites, or close the tab.</p>
    </main>
  );
}

function VolumeRow({
  label,
  value,
  onChange,
  onRelease,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  onRelease?: () => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="font-display text-xl leading-none">{label}</span>
        <span className="tabular-nums text-gold">{value}%</span>
      </span>
      <input
        className="mt-3 h-11 w-full accent-gold"
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-valuetext={`${value}%`}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={onRelease}
      />
    </label>
  );
}

const PREVIEW: Record<SlotId, ReactNode> = {
  survivors: (
    <div className="hud-panel px-3 py-2">
      <p className="text-xs tracking-[0.18em] text-muted">SURVIVORS</p>
      <p className="font-display text-3xl leading-none">9/9</p>
    </div>
  ),
  gens: (
    <div className="hud-panel px-3 py-2">
      <p className="text-xs tracking-[0.18em] text-muted">GENS</p>
      <p className="font-display text-3xl leading-none text-gold">0/5</p>
    </div>
  ),
  timer: <p className="font-display text-5xl leading-none text-bone">4:00</p>,
  money: (
    <div className="hud-panel px-3 py-2 text-right">
      <p className="text-xs tracking-[0.18em] text-muted">MONEY</p>
      <p className="font-display text-xl leading-none text-gold">$0.00</p>
    </div>
  ),
  vitals: (
    <div className="hud-panel w-40 px-3 py-3 sm:w-52">
      <p className="text-xs text-muted">HP 100/100</p>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-full bg-blood" />
      </div>
      <p className="mt-2 text-xs text-muted">STAMINA 100/100</p>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-full bg-gold" />
      </div>
    </div>
  ),
  stick: <div className="h-28 w-28 rounded-full border border-line bg-bg" />,
  leave: <div className="hud-panel inline-flex h-11 items-center px-3 text-sm">Leave</div>,
  stamina: <div className="inline-flex h-14 w-28 items-center justify-center rounded-lg border border-line bg-surface font-display">STAMINA</div>,
  attack: <div className="inline-flex h-14 w-28 items-center justify-center rounded-lg border border-line bg-surface font-display">HIT</div>,
  ability: <div className="inline-flex h-20 w-28 items-center justify-center rounded-lg border border-blood bg-blood font-display text-bone">ABILITY</div>,
  fix: <div className="inline-flex h-14 items-center rounded-lg bg-gold px-5 font-display text-lg text-bg">Hold to fix</div>,
};

export function LayoutEditor({ kind, onBack }: { kind: "buttons" | "ui"; onBack: () => void }) {
  const profile = useProfile();
  const ids = kind === "buttons" ? BUTTON_IDS : UI_IDS;
  const locked = kind === "buttons" ? UI_IDS : BUTTON_IDS;

  return (
    <div className="fixed inset-0 z-30 bg-bg-deep text-fg">
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-3">
        <button type="button" className={`${btnGhost} pointer-events-auto h-11`} onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          Done
        </button>
        <p className="font-display text-xl">{kind === "buttons" ? "Buttons only" : "UI only"}</p>
        <button
          type="button"
          className={`${btnGhost} pointer-events-auto h-11`}
          onClick={() => (kind === "buttons" ? resetButtons() : resetUi())}
        >
          Reset
        </button>
      </div>
      <div className="absolute inset-0 touch-none" style={{ touchAction: "none" }}>
        {locked.map((id) => (
          <EditorPiece key={id} id={id} enabled={false} pos={(isButton(id) ? profile.buttons[id] : profile.ui[id]) ?? defaultPos(id)} />
        ))}
        {ids.map((id) => (
          <EditorPiece key={id} id={id} enabled pos={(isButton(id) ? profile.buttons[id] : profile.ui[id]) ?? defaultPos(id)} />
        ))}
      </div>
    </div>
  );
}

function EditorPiece({ id, enabled, pos }: { id: SlotId; enabled: boolean; pos: Pos }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<Pos | null>(null);
  const origin = useRef<Pos>(pos);
  const shown = live ?? pos;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    origin.current = shown;
    const startX = e.clientX;
    const startY = e.clientY;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const move = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      setLive(nudge(id, origin.current, dx, dy));
    };
    const up = (ev: PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
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

  return (
    <div
      ref={ref}
      style={slotStyle(id, shown)}
      className={enabled ? "cursor-grab touch-none ring-1 ring-gold" : "pointer-events-none opacity-40"}
      onPointerDown={onPointerDown}
    >
      {PREVIEW[id]}
    </div>
  );
}
