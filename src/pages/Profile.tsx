import React, { useState } from "react";
import { Link } from "react-router-dom";
import { colors, font, radii } from "../theme";
import { useAuth } from "../context/AuthContext";

// ─── Mock data ────────────────────────────────────────────────────────────────

const wonAuctions = [
  { id: "w1", title: "2023 Santa Cruz Hightower CC", finalBid: 5200, date: "Jan 14, 2026", image: "https://placehold.co/200x140/1a1a1a/ff2d78?text=Hightower" },
  { id: "w2", title: "2022 Yeti SB130 T2", finalBid: 3800, date: "Dec 3, 2025", image: "https://placehold.co/200x140/1a1a1a/ff2d78?text=SB130" },
];

const lostAuctions = [
  { id: "l1", title: "2024 Trek Slash 9.9", yourBid: 4500, finalPrice: 4900, date: "Feb 1, 2026", image: "https://placehold.co/200x140/1a1a1a/888?text=Slash" },
  { id: "l2", title: "2023 Specialized Enduro S-Works", yourBid: 6200, finalPrice: 7100, date: "Jan 28, 2026", image: "https://placehold.co/200x140/1a1a1a/888?text=Enduro" },
  { id: "l3", title: "2024 Cannondale Scalpel Hi-MOD", yourBid: 5400, finalPrice: 5750, date: "Jan 10, 2026", image: "https://placehold.co/200x140/1a1a1a/888?text=Scalpel" },
];

const activeBids = [
  { id: "a1", title: "2024 Commencal Supreme DH V5", yourBid: 2700, currentBid: 2700, endsIn: "20m", leading: true, image: "https://placehold.co/200x140/1a1a1a/ff2d78?text=Supreme" },
  { id: "a2", title: "2023 Rocky Mountain Altitude", yourBid: 3400, currentBid: 3600, endsIn: "4h 12m", leading: false, image: "https://placehold.co/200x140/1a1a1a/888?text=Altitude" },
];

const commentHistory = [
  { id: "c1", listing: "2024 Trek Slash 9.9", text: "Is the shock still under warranty?", time: "2h ago" },
  { id: "c2", listing: "2023 Santa Cruz Megatower CC", text: "What frame size is this?", time: "1d ago" },
  { id: "c3", listing: "2022 Yeti SB150 T2", text: "Any reason for selling so quickly after buying?", time: "3d ago" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 16px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: colors.textSecondary, fontWeight: 600 }}>
      {children}
    </p>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: "48px", textAlign: "center", background: colors.surface, borderRadius: radii.md, border: `1px solid ${colors.border}` }}>
      <p style={{ margin: 0, color: colors.textSecondary, fontSize: "14px" }}>{message}</p>
    </div>
  );
}

function AuctionRow({ image, title, children }: { image: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", gap: "16px", alignItems: "center",
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: radii.md, padding: "14px 16px",
    }}>
      <img src={image} alt={title} style={{ width: "80px", height: "56px", objectFit: "cover", borderRadius: radii.sm, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
        {children}
      </div>
    </div>
  );
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function WonTab() {
  if (!wonAuctions.length) return <EmptyState message="No won auctions yet." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {wonAuctions.map(a => (
        <AuctionRow key={a.id} image={a.image} title={a.title}>
          <div style={{ display: "flex", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>Won · ${a.finalBid.toLocaleString()}</span>
            <span style={{ fontSize: "13px", color: colors.textSecondary }}>{a.date}</span>
          </div>
        </AuctionRow>
      ))}
    </div>
  );
}

function LostTab() {
  if (!lostAuctions.length) return <EmptyState message="No lost auctions." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {lostAuctions.map(a => (
        <AuctionRow key={a.id} image={a.image} title={a.title}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: colors.textSecondary }}>Your bid: ${a.yourBid.toLocaleString()}</span>
            <span style={{ fontSize: "13px", color: colors.textSecondary }}>Sold for: <strong style={{ color: colors.textPrimary }}>${a.finalPrice.toLocaleString()}</strong></span>
            <span style={{ fontSize: "13px", color: colors.textSecondary }}>{a.date}</span>
          </div>
        </AuctionRow>
      ))}
    </div>
  );
}

function ActiveBidsTab() {
  if (!activeBids.length) return <EmptyState message="No active bids." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {activeBids.map(a => (
        <Link to={`/auction/${a.id}`} key={a.id} style={{ textDecoration: "none", color: "inherit" }}>
          <AuctionRow image={a.image} title={a.title}>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: a.leading ? "#4ade80" : colors.pink }}>
                {a.leading ? "Leading" : "Outbid"}
              </span>
              <span style={{ fontSize: "13px", color: colors.textSecondary }}>
                Current: <strong style={{ color: colors.textPrimary }}>${a.currentBid.toLocaleString()}</strong>
              </span>
              <span style={{ fontSize: "13px", color: a.endsIn.includes("m") && !a.endsIn.includes("h") ? colors.pink : colors.textSecondary }}>
                {a.endsIn} left
              </span>
            </div>
          </AuctionRow>
        </Link>
      ))}
    </div>
  );
}

function CommentsTab() {
  if (!commentHistory.length) return <EmptyState message="No comments yet." />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {commentHistory.map(c => (
        <div key={c.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: radii.md, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: colors.pink, fontWeight: 500 }}>{c.listing}</span>
            <span style={{ fontSize: "12px", color: colors.textSecondary }}>{c.time}</span>
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: 1.6 }}>{c.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
  { label: "Won", count: wonAuctions.length },
  { label: "Lost", count: lostAuctions.length },
  { label: "Active Bids", count: activeBids.length },
  { label: "Comments", count: commentHistory.length },
];

export function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const displayName = user?.email?.split("@")[0] ?? "rider";
  const avatarLetter = displayName[0].toUpperCase();

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: font.sans, color: colors.textPrimary }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: colors.surfaceAlt, border: `2px solid ${colors.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", fontWeight: 800, color: colors.pink, flexShrink: 0,
          }}>
            {avatarLetter}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em" }}>{displayName}</h1>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: colors.textSecondary }}>{user?.email}</p>
            <p style={{ margin: "0 0 10px", fontSize: "13px", color: colors.textSecondary }}>
              Member since {new Date(user?.created_at ?? Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            <div style={{ display: "flex", gap: "20px" }}>
              {[
                ["2", "Won"],
                ["3", "Lost"],
                ["2", "Active bids"],
                ["4.9 ⭐", "Rating"],
              ].map(([val, label]) => (
                <div key={label}>
                  <span style={{ fontSize: "16px", fontWeight: 700 }}>{val}</span>
                  <span style={{ fontSize: "12px", color: colors.textSecondary, marginLeft: "4px" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <button style={{
            background: "transparent", border: `1px solid ${colors.border}`,
            color: colors.textSecondary, padding: "8px 16px", borderRadius: radii.sm,
            fontSize: "13px", cursor: "pointer", fontFamily: font.sans,
          }}>
            Edit profile
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${colors.border}`, marginBottom: "24px" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === i ? colors.pink : "transparent"}`,
                color: activeTab === i ? colors.textPrimary : colors.textSecondary,
                fontSize: "14px",
                fontWeight: activeTab === i ? 600 : 400,
                cursor: "pointer",
                fontFamily: font.sans,
                transition: "color 0.15s",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  marginLeft: "6px", fontSize: "11px",
                  background: activeTab === i ? colors.pink : colors.surfaceAlt,
                  color: activeTab === i ? "#fff" : colors.textSecondary,
                  padding: "1px 7px", borderRadius: "999px",
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <SectionLabel>{TABS[activeTab].label}</SectionLabel>
        {activeTab === 0 && <WonTab />}
        {activeTab === 1 && <LostTab />}
        {activeTab === 2 && <ActiveBidsTab />}
        {activeTab === 3 && <CommentsTab />}
      </div>
    </div>
  );
}
