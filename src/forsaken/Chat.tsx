import { useEffect, useRef, useState } from "react";
import { commandsActive, pushChat, runCommand, useProfile } from "./save";

const FRIENDS = ["Noob", "Shedletsky", "Elliot", "Chance", "Builderman"];
const GLOBAL = ["Guest", "Coolkid", "1x1x1x", "Jason", "John Doe", "Guest284"];
const LINES = [
  "gen at the edge is open",
  "killer is close, run",
  "who is the killer",
  "forest again",
  "dont stand still",
  "last man standing soon",
  "i saw the killer by the rocks",
  "save a gen for later",
  "that slash hurt",
  "anyone still at city",
  "lms clock is 1:20",
  "im fixing, cover me",
  "red sky means you are last",
  "watch the acid swords",
  "stamina off means you walk",
];

const btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide";
const primary = `${btn} h-12 bg-blood px-5 text-lg text-bone`;
const ghost = `${btn} h-12 border border-line bg-surface px-5 text-lg text-fg`;

export function ChatMenu({ onBack }: { onBack: () => void }) {
  const profile = useProfile();
  const [tab, setTab] = useState<"friends" | "global" | "commands">("friends");
  const [text, setText] = useState("");
  const [peers, setPeers] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const lines = profile.chat.filter((line) => line.channel === tab);

  useEffect(() => {
    const id =
      sessionStorage.getItem("forsaken-chat-id") || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem("forsaken-chat-id", id);
    const bc = new BroadcastChannel("forsaken-chat");
    const seen = new Map<string, number>();
    const refresh = () => {
      const now = Date.now();
      for (const [key, at] of seen) if (now - at > 6000) seen.delete(key);
      setPeers(seen.size);
    };
    const ping = window.setInterval(() => {
      bc.postMessage({ kind: "ping", from: id });
      refresh();
    }, 2000);
    bc.onmessage = (ev) => {
      const data = ev.data as {
        kind?: string;
        from?: string;
        channel?: "friends" | "global" | "commands";
        name?: string;
        text?: string;
      };
      if (!data || data.from === id) return;
      if (data.kind === "ping" && data.from) {
        seen.set(data.from, Date.now());
        refresh();
      }
      if (data.kind === "say" && data.text && (data.channel === "friends" || data.channel === "global" || data.channel === "commands")) {
        if (data.channel === "commands" && !commandsActive()) return;
        pushChat({
          channel: data.channel,
          name: (data.name || "Player").slice(0, 24),
          text: data.text,
          real: true,
          self: false,
        });
      }
    };
    const bots = window.setInterval(() => {
      const channel = Math.random() < 0.5 ? "friends" : "global";
      const pool = channel === "friends" ? FRIENDS : GLOBAL;
      const name = pool[Math.floor(Math.random() * pool.length)]!;
      const line = LINES[Math.floor(Math.random() * LINES.length)]!;
      pushChat({ channel, name, text: line, real: false, self: false });
    }, 6500);
    bc.postMessage({ kind: "ping", from: id });
    return () => {
      window.clearInterval(ping);
      window.clearInterval(bots);
      bc.close();
    };
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.length, tab]);

  function send() {
    const value = text.trim();
    if (!value) return;
    if (tab === "commands") {
      if (!commandsActive()) return;
      pushChat({ channel: "commands", name: "You", text: value, real: true, self: true });
      pushChat({ channel: "commands", name: "Commands", text: runCommand(value), real: false, self: false });
      setText("");
      return;
    }
    pushChat({ channel: tab, name: "You", text: value, real: true, self: true });
    const id = sessionStorage.getItem("forsaken-chat-id") || "you";
    const bc = new BroadcastChannel("forsaken-chat");
    bc.postMessage({ kind: "say", from: id, channel: tab, name: "Player", text: value });
    bc.close();
    setText("");
  }

  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <button type="button" className={ghost} onClick={onBack}>
          Back
        </button>
        <h1 className="font-display text-3xl">Chat</h1>
        <span className="w-16" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" className={tab === "friends" ? primary : ghost} onClick={() => setTab("friends")}>
          Friends
        </button>
        <button type="button" className={tab === "global" ? primary : ghost} onClick={() => setTab("global")}>
          Global
        </button>
        <button type="button" className={tab === "commands" ? primary : ghost} onClick={() => setTab("commands")}>
          Commands
        </button>
      </div>
      <p className="mt-3 text-sm text-muted">
        {tab === "commands"
          ? commandsActive()
            ? "Commands are unlocked. Try /help."
            : "Commands are locked. Buy them in the shop first."
          : tab === "friends"
          ? peers > 0
            ? `${peers} real player${peers === 1 ? "" : "s"} connected. Friends chat is only live players, and your bots can type here too.`
            : "Friends chat connects to real players. None are online yet. Your bots can still type here."
          : "Global. Bots type here, and so can a real player on another screen."}
      </p>
      <div ref={scroller} className="hud-panel mt-3 h-80 overflow-y-auto p-3">
        {lines.length === 0 ? <p className="text-sm text-muted">No messages yet.</p> : null}
        {lines.map((line) => (
          <p key={line.id} className="mb-2 text-sm">
            <span className={line.self ? "text-gold" : line.real ? "text-bone" : "text-muted"}>
              {line.name}
              {line.real && !line.self ? " · live" : ""}
              {!line.real ? " · bot" : ""}
            </span>
            <span className="text-fg"> {line.text}</span>
          </p>
        ))}
      </div>
      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs tracking-wide text-muted">
          Type your message
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 160))}
            placeholder={tab === "commands" ? "/help" : "Ask anything"}
            disabled={tab === "commands" && !commandsActive()}
            className="h-12 w-full rounded-lg border border-line bg-surface px-3 text-base text-fg outline-none"
          />
        </label>
        <button type="submit" className={primary}>
          Send
        </button>
      </form>
      <p className="mt-3 text-xs text-muted">Messages save when you leave, switch sites, or close the tab.</p>
    </main>
  );
}
