import { getProfile, subscribe } from "./save";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let musicBus: GainNode | null = null;
let bedGain: GainNode | null = null;
let lmsGain: GainNode | null = null;
let lmsEl: HTMLAudioElement | null = null;
let mapEl: HTMLAudioElement | null = null;
let mapGain: GainNode | null = null;
let lmsWanted = false;
let mapWanted = false;
let mapMutedForLms = false;
let musicOn = false;
let mapKey = "";

const MAP_TRACKS: Record<string, string> = {
  forest: "/audio/planet-voss.mp3",
  city: "/audio/hotel-robloxia.mp3",
  classic: "/audio/underground-war.mp3",
};

function armKick() {
  if (typeof window === "undefined") return;
  window.addEventListener(
    "pointerdown",
    () => {
      if (lmsWanted && lmsEl?.paused) void lmsEl.play().catch(() => {});
      if (mapWanted && !mapMutedForLms && mapEl?.paused) void mapEl.play().catch(() => {});
    },
    { once: false },
  );
}

function lmsVolume() {
  const p = getProfile();
  const mute = p.muted ? 0 : 1;
  const soft = p.sensitive ? 0.45 : 1;
  return (p.music / 100) * soft * mute * 0.72;
}

function mix() {
  if (!sfxBus || !musicBus) return;
  const p = getProfile();
  const mute = p.muted ? 0 : 1;
  const soft = p.sensitive ? 0.5 : 1;
  sfxBus.gain.value = (p.sfx / 100) * soft * mute;
  musicBus.gain.value = (p.music / 100) * soft * mute * 0.08;
  if (lmsGain) lmsGain.gain.value = lmsVolume();
  if (mapGain) mapGain.gain.value = mapMutedForLms ? 0 : lmsVolume();
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.2;
    sfxBus = ctx.createGain();
    musicBus = ctx.createGain();
    sfxBus.connect(master);
    musicBus.connect(master);
    master.connect(ctx.destination);
    mix();
  }
  if (ctx.state === "suspended") void ctx.resume();
  startMusic();
}

function startMusic() {
  if (!ctx || !musicBus || musicOn) return;
  musicOn = true;
  bedGain = ctx.createGain();
  bedGain.gain.value = 0.85;
  const low = ctx.createOscillator();
  const mid = ctx.createOscillator();
  const midG = ctx.createGain();
  low.type = "triangle";
  mid.type = "sine";
  low.frequency.value = 55;
  mid.frequency.value = 82.5;
  midG.gain.value = 0.3;
  low.connect(bedGain);
  mid.connect(midG);
  midG.connect(bedGain);
  bedGain.connect(musicBus);
  low.start();
  mid.start();
  armKick();
}

function ensureMapEl() {
  if (!ctx || !master || mapEl) return;
  mapEl = new Audio();
  mapEl.loop = true;
  mapEl.preload = "auto";
  const src = ctx.createMediaElementSource(mapEl);
  mapGain = ctx.createGain();
  mapGain.gain.value = lmsVolume();
  src.connect(mapGain);
  mapGain.connect(master);
}

export function setMapMusic(mapId: string) {
  mapWanted = true;
  mapMutedForLms = false;
  unlockAudio();
  if (!ctx || !master) return;
  const track = MAP_TRACKS[mapId];
  ensureMapEl();
  if (!mapEl || !bedGain) return;
  if (!track) {
    mapEl.pause();
    mapEl.currentTime = 0;
    mapKey = "";
    bedGain.gain.value = 0.85;
    return;
  }
  bedGain.gain.value = 0;
  if (mapKey !== mapId) {
    mapKey = mapId;
    mapEl.src = track;
  }
  mapEl.currentTime = 0;
  if (mapGain) mapGain.gain.value = lmsVolume();
  void mapEl.play().catch(() => {});
}

export function stopMatchMusic() {
  mapWanted = false;
  mapMutedForLms = false;
  lmsWanted = false;
  if (mapEl) {
    mapEl.pause();
    mapEl.currentTime = 0;
  }
  if (lmsEl) {
    lmsEl.pause();
    lmsEl.currentTime = 0;
  }
  if (bedGain) bedGain.gain.value = 0.85;
}

export function setLmsMusic(on: boolean) {
  lmsWanted = on;
  unlockAudio();
  if (!ctx || !master) return;
  if (!lmsEl) {
    lmsEl = new Audio("/audio/grave-soul.mp3");
    lmsEl.loop = true;
    lmsEl.preload = "auto";
    const src = ctx.createMediaElementSource(lmsEl);
    lmsGain = ctx.createGain();
    lmsGain.gain.value = lmsVolume();
    src.connect(lmsGain);
    lmsGain.connect(master);
  }
  if (!lmsEl || !bedGain) return;
  if (on) {
    mapMutedForLms = true;
    if (mapEl && !mapEl.paused) mapEl.pause();
    if (mapGain) mapGain.gain.value = 0;
    bedGain.gain.value = 0;
    lmsEl.currentTime = 0;
    if (lmsGain) lmsGain.gain.value = lmsVolume();
    void lmsEl.play().catch(() => {});
  } else {
    lmsEl.pause();
    lmsEl.currentTime = 0;
    mapMutedForLms = false;
    if (mapWanted && mapEl && mapKey) {
      if (mapGain) mapGain.gain.value = lmsVolume();
      void mapEl.play().catch(() => {});
    } else {
      bedGain.gain.value = 0.85;
    }
  }
}

function tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0) {
  const p = getProfile();
  if (!ctx || !sfxBus || p.muted || p.sfx <= 0) return;
  const wave: OscillatorType = p.sensitive && (type === "square" || type === "sawtooth") ? "triangle" : type;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = wave;
  o.frequency.setValueAtTime(p.sensitive ? freq * 0.92 : freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(sfxBus);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function playSfx(kind: string) {
  const p = getProfile();
  if (!ctx || p.muted || p.sfx <= 0) return;
  switch (kind) {
    case "hit":
      tone(160, 0.08, "square", 0.2);
      tone(90, 0.12, "sawtooth", 0.08);
      break;
    case "down":
      tone(110, 0.25, "sawtooth", 0.18);
      tone(70, 0.4, "triangle", 0.12, 0.05);
      break;
    case "gen":
      tone(330, 0.12, "square", 0.12);
      tone(440, 0.16, "square", 0.1, 0.08);
      tone(660, 0.22, "square", 0.08, 0.16);
      break;
    case "coin":
      tone(880, 0.1, "square", 0.1);
      tone(1320, 0.14, "square", 0.08, 0.06);
      break;
    case "ability":
      tone(220, 0.16, "sawtooth", 0.12);
      tone(440, 0.12, "triangle", 0.08, 0.04);
      break;
    case "stun":
      tone(80, 0.3, "square", 0.16);
      break;
    case "heal":
      tone(520, 0.1, "sine", 0.1);
      tone(780, 0.14, "sine", 0.08, 0.06);
      break;
    case "win":
      tone(392, 0.12, "triangle", 0.12);
      tone(523, 0.14, "triangle", 0.1, 0.1);
      tone(659, 0.22, "triangle", 0.1, 0.2);
      break;
    case "lose":
      tone(196, 0.2, "triangle", 0.12);
      tone(146, 0.28, "triangle", 0.1, 0.12);
      tone(98, 0.4, "sawtooth", 0.08, 0.24);
      break;
    default:
      break;
  }
}

subscribe(() => mix());
