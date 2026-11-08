import { getProfile, subscribe } from "./save";

type Signal =
  | { kind: "here"; from: string }
  | { kind: "offer"; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { kind: "answer"; from: string; to: string; sdp: RTCSessionDescriptionInit }
  | { kind: "ice"; from: string; to: string; candidate: RTCIceCandidateInit };

let started = false;
let bc: BroadcastChannel | null = null;
let selfId = "";
let local: MediaStream | null = null;
let micError = "";
const peers = new Map<string, RTCPeerConnection>();
const audios = new Map<string, HTMLAudioElement>();

export function voiceError() {
  return micError;
}

function wanted() {
  const p = getProfile();
  return p.voiceOwned && p.voiceOn;
}

function self() {
  if (!selfId) {
    selfId = sessionStorage.getItem("forsaken-chat-id") || `v-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    sessionStorage.setItem("forsaken-chat-id", selfId);
  }
  return selfId;
}

function stopAll() {
  local?.getTracks().forEach((t) => t.stop());
  local = null;
  for (const pc of peers.values()) pc.close();
  peers.clear();
  for (const audio of audios.values()) {
    audio.srcObject = null;
    audio.remove();
  }
  audios.clear();
}

async function mic() {
  if (local) return local;
  micError = "";
  try {
    local = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    return local;
  } catch {
    micError = "Microphone permission was blocked.";
    return null;
  }
}

async function ensurePeer(remoteId: string) {
  if (!bc || remoteId === self() || peers.has(remoteId)) return;
  const stream = await mic();
  if (!stream) return;
  const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  peers.set(remoteId, pc);
  for (const track of stream.getTracks()) pc.addTrack(track, stream);
  pc.onicecandidate = (ev) => {
    if (ev.candidate) bc?.postMessage({ kind: "ice", from: self(), to: remoteId, candidate: ev.candidate.toJSON() });
  };
  pc.ontrack = (ev) => {
    let audio = audios.get(remoteId);
    if (!audio) {
      audio = document.createElement("audio");
      audio.autoplay = true;
      audios.set(remoteId, audio);
      document.body.appendChild(audio);
    }
    audio.srcObject = ev.streams[0] ?? null;
    void audio.play().catch(() => {});
  };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === "failed" || pc.connectionState === "closed") {
      peers.delete(remoteId);
      audios.get(remoteId)?.remove();
      audios.delete(remoteId);
    }
  };
  if (self() < remoteId) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    bc.postMessage({ kind: "offer", from: self(), to: remoteId, sdp: pc.localDescription });
  }
}

async function onSignal(data: Signal) {
  if (!data || data.from === self() || !wanted()) return;
  if (data.kind === "here") {
    await ensurePeer(data.from);
    return;
  }
  if (("to" in data && data.to !== self()) || !bc) return;
  if (data.kind === "offer") {
    await ensurePeer(data.from);
    const pc = peers.get(data.from);
    if (!pc) return;
    await pc.setRemoteDescription(data.sdp);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    bc.postMessage({ kind: "answer", from: self(), to: data.from, sdp: pc.localDescription });
  } else if (data.kind === "answer") {
    const pc = peers.get(data.from);
    if (pc) await pc.setRemoteDescription(data.sdp);
  } else if (data.kind === "ice") {
    const pc = peers.get(data.from);
    if (pc && data.candidate) await pc.addIceCandidate(data.candidate).catch(() => {});
  }
}

export async function syncVoice() {
  if (!wanted()) {
    stopAll();
    return micError;
  }
  await mic();
  bc?.postMessage({ kind: "here", from: self() });
  return micError;
}

export function startVoiceBus() {
  if (started || typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;
  started = true;
  bc = new BroadcastChannel("forsaken-voice");
  bc.onmessage = (ev) => {
    void onSignal(ev.data as Signal);
  };
  window.setInterval(() => {
    if (wanted()) bc?.postMessage({ kind: "here", from: self() });
  }, 2500);
  subscribe(() => {
    void syncVoice();
  });
  if (wanted()) void syncVoice();
}
