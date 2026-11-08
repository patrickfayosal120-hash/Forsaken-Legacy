import { playSfx, setLmsMusic, setMapMusic, stopMatchMusic, unlockAudio } from "./audio";
import { createSim } from "./sim";
import type { EngineApi, HudSnap, MatchOpts } from "./types";
import { createView } from "./view";
import { addMoney, addXp } from "./save";

const BLOCK = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getCamYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
    };
    __forsakenDebug?: {
      completeGen: () => void;
      getEarned: () => number;
    };
  }
}

export function startEngine(
  canvas: HTMLCanvasElement,
  opts: MatchOpts,
  onHud: (snap: HudSnap) => void,
): EngineApi {
  unlockAudio();
  const sim = createSim(
    opts,
    (amount) => addMoney(amount),
    (amount) => addXp(opts.playerCharId, amount),
  );
  const view = createView(canvas, sim);
  let raf = 0;
  let acc = 0;
  let last = performance.now();
  let paused = document.hidden;
  let lmsOn = sim.lms;
  if (sim.lms) setLmsMusic(true);
  else setMapMusic(opts.mapId);

  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!paused) {
      acc += dt;
      let steps = 0;
      while (acc >= 1 / 60 && steps < 5) {
        sim.tick(1 / 60);
        acc -= 1 / 60;
        steps++;
      }
      for (const e of sim.drainEvents()) playSfx(e.kind);
      if (sim.lms !== lmsOn) {
        lmsOn = sim.lms;
        setLmsMusic(lmsOn);
      }
      view.render(dt);
      onHud(sim.getHud());
    }
    raf = requestAnimationFrame(loop);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (BLOCK.has(e.code)) e.preventDefault();
    if (e.repeat) return;
    sim.keys.add(e.code);
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") sim.toggleSprint();
    if (e.code === "KeyC") sim.queueMile();
    if (e.code === "KeyH") sim.queueHat();
    if (e.code === "KeyR") sim.queueRecharge();
    if (e.code === "KeyH") sim.queueEngage();
    if (e.code === "KeyR") sim.queueLaser();
  };
  const onKeyUp = (e: KeyboardEvent) => {
    sim.keys.delete(e.code);
  };
  let lookId: number | null = null;
  let lookX = 0;
  let lookY = 0;
  const onBlur = () => {
    sim.keys.clear();
    sim.mouseAttack = false;
    sim.attackButton = false;
    sim.fixHeld = false;
    sim.setStick(0, 0, false);
    lookId = null;
  };

  const onPointerDown = (e: PointerEvent) => {
    const mouseLook = e.pointerType === "mouse" && e.button === 2;
    const touchLook = e.pointerType === "touch" || e.pointerType === "pen";
    if (e.pointerType === "mouse" && e.button === 0) sim.mouseAttack = true;
    if (!mouseLook && !touchLook) return;
    if (lookId != null) return;
    lookId = e.pointerId;
    lookX = e.clientX;
    lookY = e.clientY;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* drag still tracked on window */
    }
    e.preventDefault();
  };
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerId !== lookId) return;
    const dx = e.clientX - lookX;
    const dy = e.clientY - lookY;
    lookX = e.clientX;
    lookY = e.clientY;
    if (dx !== 0 || dy !== 0) sim.addLook(dx, dy);
  };
  const onPointerUp = (e: PointerEvent) => {
    sim.mouseAttack = false;
    if (e.pointerId === lookId) lookId = null;
  };
  const onContext = (e: Event) => e.preventDefault();
  const onVis = () => {
    paused = document.hidden;
    last = performance.now();
    if (paused) onBlur();
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  document.addEventListener("visibilitychange", onVis);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("contextmenu", onContext);

  onHud(sim.getHud());
  raf = requestAnimationFrame(loop);

  const qa = import.meta.env.DEV || new URLSearchParams(location.search).has("qa");
  if (qa) {
    window.__controlsTest = {
      getYaw: () => sim.getYaw(),
      getCamYaw: () => sim.camYaw,
      getSpeed: () => sim.getSpeed(),
      setKeys: (codes) => sim.setKeys(codes),
    };
    window.__forsakenDebug = {
      completeGen: () => sim.debugCompleteNearestGen(),
      getEarned: () => sim.earned,
    };
  }

  return {
    destroy() {
      cancelAnimationFrame(raf);
      stopMatchMusic();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("contextmenu", onContext);
      view.dispose();
      if (window.__controlsTest) delete window.__controlsTest;
      if (window.__forsakenDebug) delete window.__forsakenDebug;
    },
    toggleSprint: () => sim.toggleSprint(),
    setStick: (x, y, active) => sim.setStick(x, y, active),
    setAttackButton: (held) => {
      sim.attackButton = held;
    },
    queueAbility: () => sim.queueAbility(),
    queueHat: () => sim.queueHat(),
    queueRecharge: () => sim.queueRecharge(),
    queueEngage: () => sim.queueEngage(),
    queueLaser: () => sim.queueLaser(),
    queueMile: () => sim.queueMile(),
    setFixHeld: (held) => sim.setFixHeld(held),
  };
}
