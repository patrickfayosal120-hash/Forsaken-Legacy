import { useEffect, useState } from "react";
import { moneyText } from "./content";
import { activeBoosts, buyBoost, grantPaid, useProfile, xpMultiplier, type PaidSku } from "./save";

const btn = "inline-flex items-center justify-center gap-2 rounded-lg font-display tracking-wide disabled:opacity-40";
const primary = `${btn} h-12 bg-blood px-4 text-lg text-bone`;
const ghost = `${btn} h-12 border border-line bg-surface px-4 text-lg text-fg`;

const BOOSTS = [
  { id: "x2", name: "2x XP (1 Hour)", price: 500 },
  { id: "x3", name: "3x XP (4 Hours)", price: 1000 },
  { id: "x4", name: "4x XP (5 Hours)", price: 2000 },
  { id: "x10", name: "10x XP (permanent)", price: 5000 },
] as const;

const VIP = [
  {
    sku: "bundle-money" as const,
    name: "Bundle Money",
    price: "USD $19.99",
    detail: "Random reward: $50K, $100K, $999K, or $1M.",
    url: "https://buy.stripe.com/test_eVq14odk62OQ0cV5Kp87K04",
  },
  {
    sku: "bundle-xp" as const,
    name: "Bundle XP",
    price: "USD $10.99",
    detail: "Random 10x XP or 20x XP for 3 days.",
    url: "https://buy.stripe.com/test_7sY7sMfse6129Nv2yd87K05",
  },
];

const TOOLS = [
  {
    sku: "voice" as const,
    name: "Voice Chat (Permanent)",
    price: "USD $19.99",
    detail: "Speak with real players only. Turn it on in Settings, Premium Tools.",
    url: "https://buy.stripe.com/test_3cI3cw1BoblmbVDegV87K06",
  },
  {
    sku: "commands" as const,
    name: "Commands (1 Month)",
    price: "USD $9.99",
    detail: "Unlock the Commands tab in Chat for 1 month.",
    url: "https://buy.stripe.com/test_28E5kE5RE9de8Jr4Gl87K07",
  },
];

const PENDING_KEY = "forsaken.vipPending";
const PAID: PaidSku[] = ["bundle-money", "bundle-xp", "voice", "commands"];

function leftLabel(until: number, now: number) {
  if (until === 0) return "permanent";
  const s = Math.max(0, Math.ceil((until - now) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${r}s`;
}

function readPending(): PaidSku | "" {
  try {
    const v = sessionStorage.getItem(PENDING_KEY);
    if ((PAID as string[]).includes(v)) return v as PaidSku;
  } catch {
    /* private mode */
  }
  return "";
}

export function ShopMenu({ onBack }: { onBack: () => void }) {
  const profile = useProfile();
  const [tab, setTab] = useState<"xp" | "vip" | "tools">("xp");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<PaidSku | "">(readPending);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const boosts = activeBoosts(now);
  const mult = xpMultiplier(now);

  function openStripe(sku: PaidSku, url: string) {
    const ref = profile.profileId || profile.userId || "guest";
    const pay = `${url}?client_reference_id=${encodeURIComponent(ref)}`;
    try {
      sessionStorage.setItem(PENDING_KEY, sku);
    } catch {
      /* ignore */
    }
    setPending(sku);
    window.open(pay, "_blank", "noopener,noreferrer");
    setNote("Stripe checkout is open. After you pay, come back and tap Claim reward.");
  }

  function claim() {
    if (!pending) return;
    const msg = grantPaid(pending);
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }
    setPending("");
    setNote(msg);
  }

  return (
    <main className="rise mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 py-5">
      <h1 className="font-display text-4xl">Shop</h1>
      <p className="mt-2 text-sm text-muted">Balance {moneyText(profile.money)}</p>
      <p className="mt-1 text-sm text-gold">{mult > 1 ? `Active XP ${mult}x` : "No XP boost active"}</p>
      {boosts.length ? (
        <ul className="mt-2 text-xs text-muted">
          {boosts
            .slice()
            .sort((a, b) => b.mult - a.mult)
            .map((b) => (
              <li key={`${b.mult}-${b.until}`}>
                {b.mult}x · {leftLabel(b.until, now)}
              </li>
            ))}
        </ul>
      ) : null}

      <p className="mt-5 text-xs tracking-[0.18em] text-muted">CATEGORY</p>
      <div className="mt-2 flex flex-col gap-2">
        <button type="button" className={tab === "xp" ? primary : ghost} onClick={() => setTab("xp")}>
          XP Boosters
        </button>
        <button type="button" className={tab === "vip" ? primary : ghost} onClick={() => setTab("vip")}>
          VIP
        </button>
        <button type="button" className={tab === "tools" ? primary : ghost} onClick={() => setTab("tools")}>
          Settings Unlocked Tools
        </button>
      </div>

      {tab === "xp" ? (
        <ul className="mt-4 flex flex-col gap-2">
          {BOOSTS.map((item) => (
            <li key={item.id} className="hud-panel flex items-center justify-between gap-3 p-3">
              <div>
                <p className="font-display text-xl leading-none">{item.name}</p>
                <p className="mt-1 text-sm text-gold">{moneyText(item.price)}</p>
              </div>
              <button
                type="button"
                className={`${primary} h-11 shrink-0 px-4 text-base`}
                onClick={() => {
                  const err = buyBoost(item.id);
                  setNote(err ?? `Bought ${item.name}.`);
                }}
              >
                Buy
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "vip" ? (
        <section className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-muted">This VIP buy uses real payment on Stripe. The connected account is in test mode, so use a Stripe test card.</p>
          {VIP.map((item) => (
            <article key={item.sku} className="hud-panel p-4">
              <p className="font-display text-2xl leading-none">{item.name}</p>
              <p className="mt-2 text-sm text-bone">{item.detail}</p>
              <p className="mt-2 text-gold">{item.price}</p>
              <button type="button" className={`${primary} mt-3 w-full`} onClick={() => openStripe(item.sku, item.url)}>
                Buy
              </button>
            </article>
          ))}
          {pending ? (
            <button type="button" className={`${ghost} w-full`} onClick={claim}>
              Claim reward
            </button>
          ) : null}
        </section>
      ) : null}

      {tab === "tools" ? (
        <section className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-muted">Settings Unlocked Tools use real payment too. After you pay, claim the reward, then open Settings, Premium Tools.</p>
          {TOOLS.map((item) => (
            <article key={item.sku} className="hud-panel p-4">
              <p className="font-display text-2xl leading-none">{item.name}</p>
              <p className="mt-2 text-sm text-bone">{item.detail}</p>
              <p className="mt-2 text-gold">{item.price}</p>
              <button type="button" className={`${primary} mt-3 w-full`} onClick={() => openStripe(item.sku, item.url)}>
                Buy
              </button>
            </article>
          ))}
          {pending === "voice" || pending === "commands" ? (
            <button type="button" className={`${ghost} w-full`} onClick={claim}>
              Claim reward
            </button>
          ) : null}
        </section>
      ) : null}

      {note ? <p className="mt-3 text-sm text-gold">{note}</p> : null}
      <button type="button" className={`${ghost} mt-4 w-full`} onClick={onBack}>
        Back
      </button>
      <p className="mt-3 text-xs text-muted">Boosts, money, and VIP rewards save when you leave, switch sites, or close the tab.</p>
    </main>
  );
}