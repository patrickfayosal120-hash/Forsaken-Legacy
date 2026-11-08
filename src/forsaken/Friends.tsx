import { useSyncExternalStore, useState } from "react";
import { addFriend, getProfile, removeFriend, useProfile, type Friend } from "./save";

export const MAYBE: Friend[] = [
  { id: "bot-noob", name: "Noob", kind: "bot", userId: "BOT-NOOB" },
  { id: "bot-shedletsky", name: "Shedletsky", kind: "bot", userId: "BOT-SHED" },
  { id: "bot-elliot", name: "Elliot", kind: "bot", userId: "BOT-ELLIOT" },
  { id: "bot-chance", name: "Chance", kind: "bot", userId: "BOT-CHANCE" },
  { id: "bot-builderman", name: "Builderman", kind: "bot", userId: "BOT-BUILD" },
  { id: "bot-guest", name: "Guest", kind: "bot", userId: "BOT-GUEST" },
  { id: "bot-coolkid", name: "Coolkid", kind: "bot", userId: "BOT-COOL" },
  { id: "bot-jason", name: "Jason", kind: "bot", userId: "BOT-JASON" },
  { id: "bot-johndoe", name: "John Doe", kind: "bot", userId: "BOT-JOHN" },
  { id: "bot-1x", name: "1x1x1x", kind: "bot", userId: "BOT-1X1X1X" },
];

interface LivePlayer {
  profileId: string;
  userId: string;
  name: string;
  seen: number;
}

let live: LivePlayer[] = [];
const liveListeners = new Set<() => void>();
let presenceOn = false;

function emitLive() {
  live = live.slice();
  liveListeners.forEach((fn) => fn());
}

export function useLivePlayers() {
  return useSyncExternalStore(
    (fn) => {
      liveListeners.add(fn);
      return () => liveListeners.delete(fn);
    },
    () => live,
    () => live,
  );
}

export function startPresence() {
  if (presenceOn || typeof BroadcastChannel === "undefined") return;
  presenceOn = true;
  const bc = new BroadcastChannel("forsaken-presence");
  const publish = () => {
    const p = getProfile();
    if (!p.profileId) return;
    bc.postMessage({ kind: "ping", profileId: p.profileId, userId: p.userId, name: p.name || "Player" });
  };
  bc.onmessage = (ev) => {
    const data = ev.data as { kind?: string; profileId?: string; userId?: string; name?: string };
    if (!data || data.kind !== "ping" || typeof data.profileId !== "string") return;
    const mine = getProfile();
    if (data.profileId === mine.profileId) return;
    const name = (data.name || "Player").replace(/\s+/g, " ").trim().slice(0, 24);
    const userId = typeof data.userId === "string" ? data.userId.slice(0, 80) : data.profileId;
    const next = live.filter((p) => p.profileId !== data.profileId);
    next.push({ profileId: data.profileId.slice(0, 64), userId, name: name || "Player", seen: Date.now() });
    live = next;
    emitLive();
  };
  publish();
  window.setInterval(publish, 2000);
  window.setInterval(() => {
    const now = Date.now();
    const next = live.filter((p) => now - p.seen < 6000);
    if (next.length !== live.length) {
      live = next;
      emitLive();
    }
  }, 2000);
}

const btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide";
const primary = `${btn} h-12 bg-blood px-5 text-lg text-bone`;
const ghost = `${btn} h-12 border border-line bg-surface px-5 text-lg text-fg`;

function hit(q: string, friend: Friend) {
  const n = q.trim().toLowerCase();
  if (!n) return true;
  return friend.name.toLowerCase().includes(n) || friend.id.toLowerCase().includes(n) || friend.userId.toLowerCase().includes(n);
}

export function FriendsMenu({ onBack }: { onBack: () => void }) {
  const profile = useProfile();
  const online = useLivePlayers();
  const [find, setFind] = useState("");
  const [know, setKnow] = useState("");
  const [addText, setAddText] = useState("");
  const [err, setErr] = useState("");
  const yours = profile.friends.filter((f) => hit(find, f));
  const knownIds = new Set(profile.friends.map((f) => f.id));
  const suggestions: Friend[] = [
    ...MAYBE.filter((b) => !knownIds.has(b.id)),
    ...online
      .filter((p) => p.profileId !== profile.profileId && !knownIds.has(p.profileId))
      .map((p) => ({ id: p.profileId, name: p.name, kind: "real" as const, userId: p.userId })),
  ].filter((f) => hit(know, f));

  function addTyped() {
    const q = addText.trim();
    if (!q) {
      setErr("Type a profile ID or a name.");
      return;
    }
    const pool = [...MAYBE, ...online.map((p) => ({ id: p.profileId, name: p.name, kind: "real" as const, userId: p.userId }))];
    const found = pool.find(
      (f) => f.id.toLowerCase() === q.toLowerCase() || f.name.toLowerCase() === q.toLowerCase() || f.userId.toLowerCase() === q.toLowerCase(),
    );
    const message = found
      ? addFriend(found)
      : addFriend({ id: q.replace(/[^\w.-]/g, "").slice(0, 64), name: q.slice(0, 24), kind: "real", userId: q.replace(/[^\w.-]/g, "").slice(0, 64) });
    setErr(message ?? "");
    if (!message) setAddText("");
  }

  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <button type="button" className={ghost} onClick={onBack}>
          Back
        </button>
        <h1 className="font-display text-3xl">Friends list</h1>
        <span className="w-16" />
      </div>
      <p className="mt-3 text-sm text-muted">Your profile ID {profile.profileId || "…"}. Other players add you with that.</p>

      <section className="hud-panel mt-4 p-4">
        <p className="text-xs tracking-[0.18em] text-muted">YOUR FRIENDS</p>
        <h2 className="mt-1 font-display text-2xl leading-none">Your real friends</h2>
        <label className="mt-3 block text-xs tracking-wide text-muted">
          Search
          <input
            value={find}
            onChange={(e) => setFind(e.target.value.slice(0, 32))}
            placeholder="Search"
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-base text-fg outline-none"
          />
        </label>
        <ul className="mt-3 flex flex-col gap-2">
          {yours.length === 0 ? <li className="text-sm text-muted">No friends yet.</li> : null}
          {yours.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
              <span>
                <span className="block font-display text-xl leading-tight">{f.name}</span>
                <span className="block text-xs text-muted">
                  {f.kind === "real" ? "Real player" : "Bot"} · {f.id}
                </span>
              </span>
              <button type="button" className={`${ghost} h-10 px-3 text-base`} onClick={() => removeFriend(f.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="hud-panel mt-4 p-4">
        <p className="text-xs tracking-[0.18em] text-muted">ADD FRIENDS</p>
        <h2 className="mt-1 font-display text-2xl leading-none">Add friend</h2>
        <p className="mt-2 text-sm text-muted">You can add friend bots and real players.</p>
        <form
          className="mt-3 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addTyped();
          }}
        >
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs tracking-wide text-muted">
            Profile ID or name
            <input
              value={addText}
              onChange={(e) => setAddText(e.target.value.slice(0, 32))}
              placeholder="Add friend"
              className="h-12 w-full rounded-lg border border-line bg-surface px-3 text-base text-fg outline-none"
            />
          </label>
          <button type="submit" className={primary}>
            Add
          </button>
        </form>
        {err ? <p className="mt-2 text-sm text-blood">{err}</p> : null}
        <label className="mt-4 block text-xs tracking-wide text-muted">
          Search: you may know
          <input
            value={know}
            onChange={(e) => setKnow(e.target.value.slice(0, 32))}
            placeholder="You may know"
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-base text-fg outline-none"
          />
        </label>
        <ul className="mt-3 flex flex-col gap-2">
          {suggestions.length === 0 ? <li className="text-sm text-muted">No one new to add.</li> : null}
          {suggestions.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
              <span>
                <span className="block font-display text-xl leading-tight">{f.name}</span>
                <span className="block text-xs text-muted">{f.kind === "real" ? "Real player · online" : "Bot"} · {f.id}</span>
              </span>
              <button
                type="button"
                className={`${primary} h-10 px-3 text-base`}
                onClick={() => setErr(addFriend(f) ?? "")}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-4 text-xs text-muted">Friends save when you leave, switch sites, or close the tab.</p>
    </main>
  );
}
