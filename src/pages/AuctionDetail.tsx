import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { colors, font, radii } from "../theme";
import { supabase } from "../lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Listing {
  id: string;
  brand: string;
  model: string;
  year: number;
  frame_material: string;
  drivetrain: string;
  fork: string;
  shock: string | null;
  suspension: string;
  wheel_size: number;
  weight_kg: number | null;
  category: string;
  condition: string;
  description: string | null;
  images: string[];
  status: string;
  starting_bid: number;
  current_bid: number | null;
  buy_it_now: number | null;
  auction_ends_at: string | null;
}

interface Bid {
  id: string;
  amount: number;
  placed_at: string;
  bidder_id: string;
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(endsAt: string | null) {
  const [ms, setMs] = useState(() =>
    endsAt ? Math.max(0, new Date(endsAt).getTime() - Date.now()) : 0
  );
  useEffect(() => {
    if (!endsAt) return;
    const t = setInterval(() => setMs(Math.max(0, new Date(endsAt).getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return ms;
}

function Countdown({ endsAt }: { endsAt: string | null }) {
  const ms = useCountdown(endsAt);
  if (!endsAt || ms <= 0) return <span style={{ color: colors.textSecondary }}>Ended</span>;

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

function ConditionColor(condition: string) {
  const map: Record<string, string> = {
    new: "#4ade80", "like-new": "#4ade80", good: "#facc15", fair: "#fb923c", poor: "#f87171",
  };
  return map[condition] ?? colors.textSecondary;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AuctionDetail() {
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidding, setBidding] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: string; user: string; avatar: string; text: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch listing ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    async function fetchListing() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) { setError("Listing not found."); setLoading(false); return; }
      setListing(data);
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  // ── Fetch bids ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    async function fetchBids() {
      const { data } = await supabase
        .from("bids")
        .select("*")
        .eq("listing_id", id)
        .order("placed_at", { ascending: false });

      if (data) setBids(data);
    }

    fetchBids();
  }, [id]);

  // ── Real-time: listing updates (current_bid) ───────────────────────────────

  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`listing:${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "listings", filter: `id=eq.${id}` },
        (payload) => {
          setListing(prev => prev ? { ...prev, ...(payload.new as Listing) } : prev);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bids", filter: `listing_id=eq.${id}` },
        (payload) => {
          setBids(prev => [payload.new as Bid, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // ── Place bid ──────────────────────────────────────────────────────────────

  async function handleBid(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    const amount = parseFloat(bidAmount);
    const minBid = (listing?.current_bid ?? listing?.starting_bid ?? 0) + 50;

    if (isNaN(amount) || amount < minBid) {
      setBidError(`Minimum bid is $${minBid.toLocaleString()}`);
      return;
    }

    setBidding(true);
    setBidError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setBidError("You must be signed in to place a bid.");
      setBidding(false);
      return;
    }

    const { error } = await supabase.rpc("place_bid", {
      p_listing_id: id,
      p_bidder_id: user.id,
      p_amount: amount,
    });

    if (error) {
      setBidError(error.message);
    } else {
      setBidAmount("");
    }

    setBidding(false);
  }

  // ── Post comment (local only — no comments table yet) ─────────────────────

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now().toString(), user: "you", avatar: "Y",
      text: comment.trim(), time: "just now",
    }]);
    setComment("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ background: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.sans, color: colors.textSecondary }}>
        Loading…
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ background: colors.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.sans, color: colors.textSecondary }}>
        {error ?? "Listing not found."}
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : ["https://placehold.co/900x600/1a1a1a/ff2d78?text=No+Image"];
  const currentBid = listing.current_bid ?? listing.starting_bid;
  const minBid = currentBid + 50;

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: font.sans, color: colors.textPrimary }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Breadcrumb */}
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: colors.textSecondary }}>
          Auctions / {listing.category} / <span style={{ color: colors.textPrimary }}>{listing.year} {listing.brand} {listing.model}</span>
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px", alignItems: "start" }}>

          {/* ── Left column ── */}
          <div>

            {/* Main image */}
            <div style={{ borderRadius: radii.lg, overflow: "hidden", background: colors.surface, marginBottom: "12px" }}>
              <img
                src={images[activeImage]}
                alt={`${listing.year} ${listing.brand} ${listing.model}`}
                style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      padding: 0,
                      border: `2px solid ${activeImage === i ? colors.pink : colors.border}`,
                      borderRadius: radii.sm, overflow: "hidden", cursor: "pointer",
                      background: "none", flex: "0 0 80px", transition: "border-color 0.15s",
                    }}
                  >
                    <img src={src} alt={`View ${i + 1}`} style={{ width: "80px", height: "56px", objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            )}

            <Divider />

            {/* Seller description */}
            <SectionLabel>Seller's description</SectionLabel>
            <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 700, letterSpacing: "-0.03em" }}>
              {listing.year} {listing.brand} {listing.model}
            </h1>
            <p style={{ margin: "0 0 20px", fontSize: "14px", color: colors.textSecondary, lineHeight: 1.7 }}>
              {listing.description ?? "No description provided."}
            </p>

            {/* Spec grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {[
                ["Brand", listing.brand],
                ["Model", listing.model],
                ["Year", listing.year],
                ["Frame", listing.frame_material],
                ["Wheel size", `${listing.wheel_size}"`],
                ["Weight", listing.weight_kg ? `${listing.weight_kg} kg` : "—"],
                ["Fork", listing.fork],
                ["Shock", listing.shock ?? "N/A"],
                ["Drivetrain", listing.drivetrain],
              ].map(([label, value]) => (
                <div key={label} style={{ background: colors.surface, borderRadius: radii.sm, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: "11px", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500 }}>{value}</p>
                </div>
              ))}
            </div>

            <Divider />

            {/* Host's Hot Take */}
            <div style={{
              background: colors.surface, border: `1px solid ${colors.pink}22`,
              borderLeft: `3px solid ${colors.pink}`, borderRadius: radii.md, padding: "20px 24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%", background: colors.pink,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: 700, color: "#fff",
                }}>M</div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>motolot staff</p>
                  <SectionLabel>Hot Take 🔥</SectionLabel>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "15px", color: colors.textPrimary, lineHeight: 1.7 }}>
                The {listing.brand} {listing.model} is a serious machine. {listing.condition === "new" || listing.condition === "like-new"
                  ? "In this condition it's a rare find — don't let it slip."
                  : "Well-priced for its condition and spec level."}
              </p>
            </div>

            <Divider />

            {/* Comments */}
            <SectionLabel>Comments ({comments.length})</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {comments.length === 0 && (
                <p style={{ fontSize: "14px", color: colors.textSecondary }}>No comments yet. Be the first.</p>
              )}
              {comments.map(c => (
                <div key={c.id} style={{ display: "flex", gap: "12px" }}>
                  <div style={{
                    flexShrink: 0, width: "34px", height: "34px", borderRadius: "50%",
                    background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, color: colors.textSecondary,
                  }}>{c.avatar}</div>
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
              <button type="submit" style={{
                background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                color: colors.textPrimary, padding: "10px 18px", borderRadius: radii.sm,
                fontSize: "14px", cursor: "pointer", fontFamily: font.sans, fontWeight: 500,
              }}>Post</button>
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
                {bids.length} {bids.length === 1 ? "bid" : "bids"}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <SectionLabel>Time remaining</SectionLabel>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                    <Countdown endsAt={listing.auction_ends_at} />
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <SectionLabel>Condition</SectionLabel>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: ConditionColor(listing.condition) }}>
                    {listing.condition.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "20px", marginBottom: "16px" }}>
                <form onSubmit={handleBid}>
                  <p style={{ margin: "0 0 6px", fontSize: "12px", color: colors.textSecondary }}>
                    Min. bid: <strong style={{ color: colors.textPrimary }}>${minBid.toLocaleString()}</strong>
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <span style={{
                      display: "flex", alignItems: "center", padding: "0 12px",
                      background: colors.surfaceAlt, border: `1px solid ${colors.border}`,
                      borderRadius: `${radii.sm} 0 0 ${radii.sm}`, color: colors.textSecondary, fontSize: "15px",
                    }}>$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={e => { setBidAmount(e.target.value); setBidError(null); }}
                      placeholder={minBid.toString()}
                      min={minBid}
                      style={{
                        flex: 1, background: colors.surfaceAlt, border: `1px solid ${bidError ? colors.pink : colors.border}`,
                        borderLeft: "none", borderRadius: `0 ${radii.sm} ${radii.sm} 0`,
                        padding: "10px 14px", color: colors.textPrimary, fontSize: "15px",
                        fontFamily: font.sans, outline: "none",
                      }}
                    />
                  </div>
                  {bidError && (
                    <p style={{ margin: "0 0 10px", fontSize: "13px", color: colors.pink }}>{bidError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={bidding || listing.status !== "active"}
                    style={{
                      width: "100%", background: listing.status === "active" ? colors.pink : colors.surfaceAlt,
                      color: listing.status === "active" ? "#fff" : colors.textSecondary,
                      border: "none", borderRadius: radii.sm, padding: "14px",
                      fontSize: "15px", fontWeight: 700,
                      cursor: listing.status === "active" ? "pointer" : "not-allowed",
                      fontFamily: font.sans, letterSpacing: "0.02em",
                      opacity: bidding ? 0.7 : 1,
                    }}
                  >
                    {bidding ? "Placing bid…" : listing.status === "active" ? "Place Bid" : "Auction Ended"}
                  </button>
                </form>
              </div>

              {listing.buy_it_now && (
                <button style={{
                  width: "100%", background: "transparent", color: colors.textSecondary,
                  border: `1px solid ${colors.border}`, borderRadius: radii.sm, padding: "12px",
                  fontSize: "14px", cursor: "pointer", fontFamily: font.sans, marginBottom: "16px",
                }}>
                  Buy it now — ${listing.buy_it_now.toLocaleString()}
                </button>
              )}

              {/* Recent bids */}
              {bids.length > 0 && (
                <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "16px", marginTop: "4px" }}>
                  <SectionLabel>Recent bids</SectionLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {bids.slice(0, 5).map((bid, i) => (
                      <div key={bid.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: i === 0 ? colors.pink : colors.textSecondary, fontWeight: i === 0 ? 600 : 400 }}>
                          {i === 0 ? "Leading bid" : `Bid #${bids.length - i}`}
                        </span>
                        <span style={{ color: i === 0 ? colors.textPrimary : colors.textSecondary, fontWeight: i === 0 ? 700 : 400 }}>
                          ${bid.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
