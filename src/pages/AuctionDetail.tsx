import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { colors, font, radii } from "../theme";

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockImages = [
  "https://placehold.co/900x600/1a1a1a/ff2d78?text=Main",
  "https://placehold.co/200x140/222/888?text=Side",
  "https://placehold.co/200x140/222/888?text=Fork",
  "https://placehold.co/200x140/222/888?text=Drivetrain",
  "https://placehold.co/200x140/222/888?text=Detail",
];

const mockComments = [
  { id: "1", user: "shredder_99", avatar: "S", text: "Is the shock still under warranty?", time: "2h ago" },
  { id: "2", user: "traildog", avatar: "T", text: "Rode one of these last season — absolutely rips on tech terrain.", time: "1h ago" },
  { id: "3", user: "bikewrench", avatar: "B", text: "What size is this? Doesn't say in the listing.", time: "45m ago" },
];

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(endsAt: Date) {
  const [ms, setMs] = React.useState(() => Math.max(0, endsAt.getTime() - Date.now()));
  React.useEffect(() => {
    const t = setInterval(() => setMs(Math.max(0, endsAt.getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return ms;
}

function Countdown({ endsAt }: { endsAt: Date }) {
  const ms = useCountdown(endsAt);
  if (ms <= 0) return <span style={{ color: colors.textSecondary }}>Ended</span>;

  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const urgent = ms < 60 * 60 * 1000;
  const label = h > 0 ? `${h}h ${m}m ${sec}s` : `${m}m ${sec}s`;

  return <span style={{ color: urgent ? colors.pink : colors.textPrimary }}>{label}</span>;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ borderTop: `1px solid ${colors.border}`, margin: "32px 0" }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 12px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: colors.textSecondary, fontWeight: 600 }}>
      {children}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AuctionDetail() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(mockComments);
  const auctionEndsAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const currentBid = 4500;
  const minBid = currentBid + 50;

  function handleBid(e: React.FormEvent) {
    e.preventDefault();
    setBidAmount("");
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), user: "you", avatar: "Y", text: comment.trim(), time: "just now" }]);
    setComment("");
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: font.sans, color: colors.textPrimary }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Breadcrumb */}
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: colors.textSecondary }}>
          Auctions / Enduro / <span style={{ color: colors.textPrimary }}>2024 Trek Slash 9.9</span>
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px", alignItems: "start" }}>

          {/* ── Left column ── */}
          <div>

            {/* Main image */}
            <div style={{ borderRadius: radii.lg, overflow: "hidden", background: colors.surface, marginBottom: "12px" }}>
              <img
                src={mockImages[activeImage]}
                alt="Bike"
                style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Thumbnail strip */}
            <div style={{ display: "flex", gap: "8px" }}>
              {mockImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    padding: 0,
                    border: `2px solid ${activeImage === i ? colors.pink : colors.border}`,
                    borderRadius: radii.sm,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "none",
                    flex: "0 0 80px",
                    transition: "border-color 0.15s",
                  }}
                >
                  <img src={src} alt={`View ${i + 1}`} style={{ width: "80px", height: "56px", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>

            <Divider />

            {/* Seller description */}
            <SectionLabel>Seller's description</SectionLabel>
            <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em" }}>
              2024 Trek Slash 9.9
            </h1>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: colors.textSecondary, lineHeight: 1.7 }}>
              Purchased new in March 2024 and ridden for one season. The bike has been immaculately maintained — cleaned after every ride, suspension serviced at 50 hours. No crashes, no damage. Selling because I'm moving up to a larger frame size.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                ["Brand", "Trek"], ["Model", "Slash 9.9"], ["Year", "2024"],
                ["Frame", "Carbon"], ["Wheel size", "29\""], ["Weight", "13.5 kg"],
                ["Fork", "Fox 36 Factory"], ["Shock", "Fox Float X2"], ["Drivetrain", "Shimano XT 12-speed"],
              ].map(([label, value]) => (
                <div key={label} style={{ background: colors.surface, borderRadius: radii.sm, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>

            <Divider />

            {/* Host's Hot Take */}
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.pink}22`,
                borderLeft: `3px solid ${colors.pink}`,
                borderRadius: radii.md,
                padding: "20px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: colors.pink, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 700, color: "#fff",
                }}>
                  M
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>motolot staff</p>
                  <SectionLabel>Hot Take 🔥</SectionLabel>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "15px", color: colors.textPrimary, lineHeight: 1.7 }}>
                The Slash 9.9 in carbon is one of the most dialled enduro setups you can get right now. Factory Fox suspension front and rear, full XT drivetrain, and Trek's carbon layup is stupid light for a 150mm travel bike. At $4,500 this is already below market — if it clears $5k it's still a steal for a bike this clean. Don't sleep on it.
              </p>
            </div>

            <Divider />

            {/* Comments */}
            <SectionLabel>Comments ({comments.length})</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {comments.map(c => (
                <div key={c.id} style={{ display: "flex", gap: "12px" }}>
                  <div style={{
                    flexShrink: 0, width: "34px", height: "34px", borderRadius: "50%",
                    background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: colors.textSecondary,
                  }}>
                    {c.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "baseline", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{c.user}</span>
                      <span style={{ fontSize: "12px", color: colors.textSecondary }}>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: 1.6 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleComment} style={{ display: "flex", gap: "10px" }}>
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Leave a comment…"
                style={{
                  flex: 1, background: colors.surface, border: `1px solid ${colors.border}`,
                  borderRadius: radii.sm, padding: "10px 14px", color: colors.textPrimary,
                  fontSize: "14px", fontFamily: font.sans, outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                  color: colors.textPrimary, padding: "10px 18px", borderRadius: radii.sm,
                  fontSize: "14px", cursor: "pointer", fontFamily: font.sans, fontWeight: 500,
                }}
              >
                Post
              </button>
            </form>
          </div>

          {/* ── Bidding sidebar ── */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.lg, padding: "24px" }}>

              <SectionLabel>Current bid</SectionLabel>
              <p style={{ margin: "0 0 4px", fontSize: "38px", fontWeight: 800, letterSpacing: "-0.04em" }}>
                ${currentBid.toLocaleString()}
              </p>
              <p style={{ margin: "0 0 20px", fontSize: "13px", color: colors.textSecondary }}>
                14 bids
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <SectionLabel>Time remaining</SectionLabel>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                    <Countdown endsAt={auctionEndsAt} />
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <SectionLabel>Condition</SectionLabel>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#4ade80" }}>Like New</p>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "20px", marginBottom: "16px" }}>
                <form onSubmit={handleBid}>
                  <p style={{ margin: "0 0 6px", fontSize: "12px", color: colors.textSecondary }}>
                    Min. bid: <strong style={{ color: colors.textPrimary }}>${minBid.toLocaleString()}</strong>
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", padding: "0 12px", background: colors.surfaceAlt, border: `1px solid ${colors.border}`, borderRadius: `${radii.sm} 0 0 ${radii.sm}`, color: colors.textSecondary, fontSize: "15px" }}>$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder={minBid.toString()}
                      min={minBid}
                      style={{
                        flex: 1, background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                        borderLeft: "none", borderRadius: `0 ${radii.sm} ${radii.sm} 0`,
                        padding: "10px 14px", color: colors.textPrimary, fontSize: "15px",
                        fontFamily: font.sans, outline: "none",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: "100%", background: colors.pink, color: "#fff",
                      border: "none", borderRadius: radii.sm, padding: "14px",
                      fontSize: "15px", fontWeight: 700, cursor: "pointer",
                      fontFamily: font.sans, letterSpacing: "0.02em",
                    }}
                  >
                    Place Bid
                  </button>
                </form>
              </div>

              <button
                style={{
                  width: "100%", background: "transparent", color: colors.textSecondary,
                  border: `1px solid ${colors.border}`, borderRadius: radii.sm, padding: "12px",
                  fontSize: "14px", cursor: "pointer", fontFamily: font.sans,
                }}
              >
                Buy it now — $6,500
              </button>

              <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: "20px", paddingTop: "20px" }}>
                <SectionLabel>Seller</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", fontWeight: 700, color: colors.textSecondary,
                  }}>
                    J
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>jamesrider</p>
                    <p style={{ margin: 0, fontSize: "12px", color: colors.textSecondary }}>⭐ 4.9 · 12 sales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
