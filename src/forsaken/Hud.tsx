import { ArrowUp, LogOut } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode, type RefObject } from "react";
import { formatTime, moneyText } from "./content";
import { placeClass, slotStyle, isButton, type SlotId } from "./layout";
import { useProfile } from "./save";
import type { EngineApi, HudSnap, MatchOpts } from "./types";

function useTouchUi() {
  const [on, setOn] = useState(false);
  useEffect(() => {
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

function Place({ id, children }: { id: SlotId; children: ReactNode }) {
  const profile = useProfile();
  const custom = isButton(id) ? profile.buttons[id] : profile.ui[id];
  return (
    <div className={placeClass(id, custom)} style={custom ? slotStyle(id, custom) : undefined}>
      {children}
    </div>
  );
}

function hold(
  start: () => void,
  end: () => void,
): {
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
} {
  return {
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
      start();
    },
    onPointerUp: end,
    onPointerCancel: end,
  };
}

function Stick({ onChange }: { onChange: (x: number, y: number, active: boolean) => void }) {
  const padRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = padRef.current;
    if (!el) return;
    let pid: number | null = null;
    const max = 34;

    const emit = (clientX: number, clientY: number, active: boolean) => {
      if (!active) {
        setKnob({ x: 0, y: 0 });
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
        dx = (dx / len) * max;
        dy = (dy / len) * max;
      }
      setKnob({ x: dx, y: dy });
      const nx = dx / max;
      const ny = -dy / max;
      const dead = 0.1;
      onChangeRef.current(Math.abs(nx) < dead ? 0 : nx, Math.abs(ny) < dead ? 0 : ny, true);
    };

    const down = (e: globalThis.PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (pid != null) return;
      pid = e.pointerId;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* capture is optional; window move/up still tracks the finger */
      }
      e.preventDefault();
      emit(e.clientX, e.clientY, true);
    };
    const move = (e: globalThis.PointerEvent) => {
      if (e.pointerId !== pid) return;
      e.preventDefault();
      emit(e.clientX, e.clientY, true);
    };
    const up = (e: globalThis.PointerEvent) => {
      if (e.pointerId !== pid) return;
      pid = null;
      try {
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      emit(0, 0, false);
    };
    const blockMenu = (e: Event) => e.preventDefault();

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

  return (
    <div className="relative h-28 w-28">
      <div
        ref={padRef}
        className="pointer-events-auto absolute -inset-8 touch-none select-none"
        style={{ touchAction: "none" }}
        aria-label="Move"
        role="application"
      >
        <div className="pointer-events-none absolute inset-8 rounded-full border border-line bg-bg" />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 h-12 w-12 rounded-full bg-bone"
          style={{ marginLeft: -24, marginTop: -24, transform: `translate(${knob.x}px, ${knob.y}px)` }}
        />
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  tone,
  low,
}: {
  label: string;
  value: number;
  max: number;
  tone: "blood" | "gold";
  low?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="w-40 sm:w-52">
      <div className="mb-1 flex items-center justify-between text-xs tracking-wide text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-fg">
          {Math.max(0, Math.round(value))}/{Math.round(max)}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full ${tone === "blood" ? "bg-blood" : "bg-gold"} ${low ? "hp-low" : ""}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Hud({
  apiRef,
  hudRef,
  opts,
  onLeave,
}: {
  apiRef: RefObject<EngineApi | null>;
  hudRef: RefObject<HudSnap>;
  opts: MatchOpts;
  onLeave: () => void;
}) {
  const [snap, setSnap] = useState<HudSnap>(() => hudRef.current);
  const touch = useTouchUi();
  const profile = useProfile();

  useEffect(() => {
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
  const lowHp = snap.hp / Math.max(1, snap.maxHp) < 0.35;

  return (
    <div className={`pointer-events-none absolute inset-0 ${lowHp || snap.killerNear ? "danger-vignette" : "vignette"}`}>
      <Place id="survivors">
        <div className="hud-panel pointer-events-none px-3 py-2">
          <p className="text-xs tracking-[0.18em] text-muted">SURVIVORS</p>
          <p className="font-display text-3xl leading-none tabular-nums">
            {snap.survivorsAlive}/{snap.survivorsMax}
          </p>
        </div>
      </Place>
      <Place id="gens">
        <div className="hud-panel px-3 py-2">
          <p className="text-xs tracking-[0.18em] text-muted">GENS</p>
          <p className="font-display text-3xl leading-none tabular-nums text-gold">
            {snap.gensDone}/{snap.gensMax}
          </p>
        </div>
      </Place>

      <Place id="timer">
        {snap.lms ? <p className="text-xs tracking-[0.22em] text-blood">LAST MAN STANDING</p> : null}
        <p className={`font-display text-5xl leading-none tabular-nums sm:text-6xl ${snap.lms || snap.timeLeft <= 30 ? "text-blood" : "text-bone"}`}>
          {formatTime(snap.timeLeft)}
        </p>
        <p className="mt-1 text-xs tracking-[0.16em] text-muted">{snap.mapName}</p>
        {snap.lms ? <p className="text-[11px] tracking-wide text-blood">A grave soul (Run, Now)</p> : null}
        {snap.markerText ? (
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-gold">
            <ArrowUp className="h-4 w-4" style={{ transform: `rotate(${snap.markerAngle}rad)` }} />
            {snap.markerText}
          </p>
        ) : null}
        {snap.killerNear ? <p className="text-sm text-blood">Killer nearby</p> : null}
        {snap.toast ? <p className="mt-1 text-sm text-gold">{snap.toast}</p> : null}
      </Place>

      <Place id="money">
        <div className="hud-panel px-3 py-2 text-right">
          <p className="text-xs tracking-[0.18em] text-muted">MONEY</p>
          <p className="font-display text-xl leading-none text-gold tabular-nums">{moneyText(profile.money)}</p>
        </div>
      </Place>
      {playing ? (
        <Place id="leave">
          <button type="button" className="pointer-events-auto hud-panel inline-flex h-11 items-center gap-2 px-3 text-sm" onClick={onLeave}>
            <LogOut className="h-4 w-4" />
            Leave
          </button>
        </Place>
      ) : null}

      {snap.lms && playing ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 36%, rgba(92,0,8,0.55) 100%)" }}
        />
      ) : null}

      {snap.stun > 0 && playing ? (
        <p className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 font-display text-4xl text-gold">STUNNED</p>
      ) : null}

      {playing ? (
        <>
          {touch ? (
            <Place id="stick">
              <Stick onChange={(x, y, active) => api()?.setStick(x, y, active)} />
            </Place>
          ) : null}
          <Place id="vitals">
            <div className="hud-panel px-3 py-3">
              <Bar label="HP" value={snap.hp} max={snap.maxHp} tone="blood" low={lowHp} />
              <div className="mt-2">
                <Bar
                  label={snap.sprintOn ? "STAMINA · ON" : "STAMINA · OFF"}
                  value={snap.stamina}
                  max={snap.maxStamina}
                  tone="gold"
                />
              </div>
              {snap.sprintOn && snap.stamina < 1 ? <p className="mt-1 text-xs text-gold">Exhausted</p> : null}
              {snap.weak > 0 ? (
                <p className="mt-1 text-xs text-blood">
                  Weakness {snap.weak}/10 · {Math.ceil(snap.weakLeft)}s
                </p>
              ) : null}
              {snap.power > 0 ? (
                <p className="mt-1 text-xs text-gold">
                  Powerful {snap.power}/4 · {Math.ceil(snap.powerLeft)}s
                </p>
              ) : null}
              {snap.shotBoost ? <p className="mt-1 text-xs text-gold">Enhanced shot</p> : null}
            </div>
            {!touch ? (
              <p className="mt-2 max-w-56 text-xs text-muted">
                {snap.charName === "Chance"
                  ? "WASD move · right-drag look · Shift stamina · Q coin · H hat · R recharge · F shot · E fix"
                  : snap.charName === "1x1x1x"
                    ? "WASD move · right-drag look · Q infect · H engage · R laser · F slash"
                    : snap.mileName
                      ? "WASD move · right-drag look · Shift stamina · Q ability · C milestone · F attack · E fix"
                      : "WASD move · right-drag look · Shift stamina · Q ability · F attack · E fix · click to attack"}
              </p>
            ) : (
              <p className="mt-2 max-w-40 text-xs text-muted">
                {snap.charName === "Chance" ? "Drag to look. Coin, hat, and recharge are on the right." : "Drag the screen to look. The stick only walks."}
              </p>
            )}
          </Place>
        </>
      ) : null}

      {playing ? (
        <>
          <Place id="stamina">
            <button
              type="button"
              aria-pressed={snap.sprintOn}
              className={`pointer-events-auto h-14 w-28 rounded-lg border font-display tracking-wide ${snap.sprintOn ? "border-gold bg-gold text-bg" : "border-line bg-surface text-fg"}`}
              onClick={() => api()?.toggleSprint()}
            >
              <span className="block text-xs">STAMINA</span>
              <span className="block text-lg leading-none">{snap.sprintOn ? "ON" : "OFF"}</span>
            </button>
          </Place>
          <Place id="attack">
            <button
              type="button"
              className="pointer-events-auto h-14 w-28 rounded-lg border border-line bg-surface font-display tracking-wide text-fg"
              {...hold(
                () => api()?.setAttackButton(true),
                () => api()?.setAttackButton(false),
              )}
            >
              <span className="block text-xs">{snap.attackName}</span>
              <span className="block text-lg leading-none">
                {snap.attackCd > 0.08 ? Math.ceil(snap.attackCd * 10) / 10 : snap.charName === "Chance" ? (snap.shotBoost ? "60" : "30") : "HIT"}
              </span>
            </button>
          </Place>
          <Place id="ability">
            {snap.charName === "1x1x1x" ? (
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  className="pointer-events-auto h-14 w-24 rounded-lg border border-blood bg-blood font-display tracking-wide text-bone disabled:opacity-60"
                  onClick={() => api()?.queueAbility()}
                  disabled={snap.abilityCd > 0.05}
                >
                  <span className="block text-[10px]">INFECT</span>
                  <span className="block text-lg leading-none">{snap.abilityCd > 0.05 ? Math.ceil(snap.abilityCd) : "READY"}</span>
                </button>
                <button
                  type="button"
                  className="pointer-events-auto h-14 w-24 rounded-lg border border-line bg-surface font-display tracking-wide text-fg disabled:opacity-60"
                  onClick={() => api()?.queueEngage()}
                  disabled={snap.engageCd > 0.05}
                >
                  <span className="block text-[10px]">ENGAGE</span>
                  <span className="block text-lg leading-none">{snap.engageCd > 0.05 ? Math.ceil(snap.engageCd) : "DUAL"}</span>
                </button>
                <button
                  type="button"
                  className="pointer-events-auto h-14 w-24 rounded-lg border border-gold bg-surface font-display tracking-wide text-gold disabled:opacity-60"
                  onClick={() => api()?.queueLaser()}
                  disabled={snap.laserCd > 0.05}
                >
                  <span className="block text-[10px]">LASER</span>
                  <span className="block text-lg leading-none">
                    {snap.laserCd > 0.05 ? Math.ceil(snap.laserCd) : snap.lms ? "FIRE" : "LMS"}
                  </span>
                </button>
              </div>
            ) : snap.charName === "Chance" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="pointer-events-auto h-14 w-28 rounded-lg border border-blood bg-blood font-display tracking-wide text-bone"
                  onClick={() => api()?.queueAbility()}
                >
                  <span className="block text-xs">FLIP COIN</span>
                  <span className="block text-lg leading-none">READY</span>
                </button>
                <button
                  type="button"
                  className="pointer-events-auto h-14 w-28 rounded-lg border border-line bg-surface font-display tracking-wide text-fg disabled:opacity-60"
                  onClick={() => api()?.queueHat()}
                  disabled={snap.hatCd > 0.05}
                >
                  <span className="block text-xs">REPAIR HAT</span>
                  <span className="block text-lg leading-none">{snap.hatCd > 0.05 ? Math.ceil(snap.hatCd) : "CLEAR"}</span>
                </button>
                <button
                  type="button"
                  className="pointer-events-auto h-14 w-28 rounded-lg border border-gold bg-surface font-display tracking-wide text-gold disabled:opacity-60"
                  onClick={() => api()?.queueRecharge()}
                  disabled={snap.rechargeCd > 0.05}
                >
                  <span className="block text-xs">RECHARGE</span>
                  <span className="block text-lg leading-none">
                    {snap.rechargeCd > 0.05 ? Math.ceil(snap.rechargeCd) : snap.shotBoost ? "LOADED" : "LOAD"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-end gap-2">
                {snap.mileName ? (
                  <button
                    type="button"
                    className="pointer-events-auto h-20 w-28 rounded-lg border border-gold bg-surface font-display tracking-wide text-gold disabled:opacity-60"
                    onClick={() => api()?.queueMile()}
                    disabled={
                      snap.mileName === "CHICKEN"
                        ? snap.mileUses <= 0 || snap.mileLeft > 0.05
                        : snap.mileCd > 0.05
                    }
                  >
                    <span className="block text-xs">{snap.mileName}</span>
                    <span className="block text-2xl leading-none">
                      {snap.mileLeft > 0.05
                        ? snap.mileLeft.toFixed(1)
                        : snap.mileName === "CHICKEN"
                          ? snap.mileUses > 0
                            ? `${snap.mileUses} LEFT`
                            : "EMPTY"
                          : snap.mileCd > 0.05
                            ? Math.ceil(snap.mileCd)
                            : "READY"}
                    </span>
                  </button>
                ) : null}
                <button
                  type="button"
                  className="pointer-events-auto h-20 w-28 rounded-lg border border-blood bg-blood font-display tracking-wide text-bone disabled:opacity-60"
                  onClick={() => api()?.queueAbility()}
                  disabled={snap.abilityCd > 0 && snap.buff <= 0}
                >
                  <span className="block text-xs">{snap.abilityName}</span>
                  <span className="block text-2xl leading-none">
                    {snap.buff > 0 ? snap.buff.toFixed(1) : snap.abilityCd > 0.05 ? Math.ceil(snap.abilityCd) : "READY"}
                  </span>
                </button>
              </div>
            )}
          </Place>
        </>
      ) : null}

      {playing && snap.nearGen && snap.role === "survivor" ? (
        <Place id="fix">
          <button
            type="button"
            className="pointer-events-auto h-14 rounded-lg bg-gold px-5 font-display text-lg tracking-wide text-bg"
            {...hold(
              () => api()?.setFixHeld(true),
              () => api()?.setFixHeld(false),
            )}
          >
            {snap.fixing ? `Fixing ${Math.round(snap.genProgress * 100)}%` : snap.genProgress > 0 ? `Hold to fix ${Math.round(snap.genProgress * 100)}%` : "Hold to fix"}
          </button>
        </Place>
      ) : null}

      {snap.phase === "end" ? (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-4">
          <div className="hud-panel w-full max-w-md p-6 text-center">
            <p className="text-xs tracking-[0.22em] text-muted">{opts.mode === "practice" ? "PRACTICE" : "MATCH"}</p>
            <h2 className="mt-2 font-display text-4xl text-bone">{snap.endTitle}</h2>
            <p className="mt-3 text-muted">{snap.endDetail}</p>
            <p className="mt-2 text-gold">Balance {moneyText(profile.money)}</p>
            <button type="button" className="mt-5 h-12 w-full rounded-lg bg-blood font-display text-lg tracking-wide text-bone" onClick={onLeave}>
              Back to menu
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
