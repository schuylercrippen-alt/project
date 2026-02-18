import React, { useState } from "react";
import { Link } from "react-router-dom";
import { colors, font, radii } from "../theme";
import { Listing, BikeCategory } from "../types/Listing";

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockListings: Listing[] = [
  {
    id: "1", sellerId: "s1", brand: "Trek", model: "Slash 9.9", year: 2024,
    frameMaterial: "carbon", drivetrain: "Shimano XT 12-speed", fork: "Fox 36 Factory",
    shock: "Fox Float X2", suspension: "full-suspension", wheelSize: 29,
    weightKg: 13.5, category: "enduro", condition: "like-new",
    description: "Barely ridden, immaculate condition.", images: ["https://placehold.co/600x400/1a1a1a/ff2d78?text=Trek+Slash"],
    status: "active", startingBid: 3000, reservePrice: null, currentBid: 4500,
    buyItNowPrice: null, bids: [], auctionStartsAt: new Date(),
    auctionEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), createdAt: new Date(),
  },
  {
    id: "2", sellerId: "s2", brand: "Santa Cruz", model: "Megatower CC", year: 2023,
    frameMaterial: "carbon", drivetrain: "SRAM XX1 Eagle", fork: "RockShox Lyrik Ultimate",
    shock: "RockShox Super Deluxe", suspension: "full-suspension", wheelSize: 29,
    weightKg: 14.2, category: "enduro", condition: "good",
    description: "One season of riding.", images: ["https://placehold.co/600x400/1a1a1a/ff2d78?text=Santa+Cruz"],
    status: "active", startingBid: 4000, reservePrice: 5000, currentBid: 4200,
    buyItNowPrice: 6500, bids: [], auctionStartsAt: new Date(),
    auctionEndsAt: new Date(Date.now() + 45 * 60 * 1000), createdAt: new Date(),
  },
  {
    id: "3", sellerId: "s3", brand: "Yeti", model: "SB150 T-Series", year: 2024,
    frameMaterial: "carbon", drivetrain: "Shimano XTR 12-speed", fork: "Fox 36 Factory",
    shock: "Fox Float X2 Factory", suspension: "full-suspension", wheelSize: 29,
    weightKg: 13.8, category: "enduro", condition: "new",
    description: "Never ridden, bought wrong size.", images: ["https://placehold.co/600x400/1a1a1a/ff2d78?text=Yeti+SB150"],
    status: "active", startingBid: 5500, reservePrice: null, currentBid: null,
    buyItNowPrice: 8000, bids: [], auctionStartsAt: new Date(),
    auctionEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), createdAt: new Date(),
  },
  {
    id: "4", sellerId: "s4", brand: "Specialized", model: "Stumpjumper EVO", year: 2023,
    frameMaterial: "aluminum", drivetrain: "SRAM GX Eagle", fork: "RockShox Pike",
    shock: "RockShox Monarch", suspension: "full-suspension", wheelSize: 29,
    weightKg: 14.9, category: "trail", condition: "fair",
    description: "A few seasons of hard trail riding.", images: ["https://placehold.co/600x400/1a1a1a/ff2d78?text=Stumpjumper"],
    status: "active", startingBid: 1800, reservePrice: null, currentBid: 2100,
    buyItNowPrice: null, bids: [], auctionStartsAt: new Date(),
    auctionEndsAt: new Date(Date.now() + 6 * 60 * 60 * 1000), createdAt: new Date(),
  },
  {
    id: "5", sellerId: "s5", brand: "Cannondale", model: "Scalpel Hi-MOD", year: 2024,
    frameMaterial: "carbon", drivetrain: "Shimano XT 12-speed", fork: "Fox 32 SC Factory",
    shock: null, suspension: "full-suspension", wheelSize: 29,
    weightKg: 10.1, category: "cross-country", condition: "like-new",
    description: "Race-ready XC machine.", images: ["https://placehold.co/600x400/1a1a1a/ff2d78?text=Scalpel"],
    status: "active", startingBid: 4500, reservePrice: null, currentBid: 5800,
    buyItNowPrice: null, bids: [], auctionStartsAt: new Date(),
    auctionEndsAt: new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000), createdAt: new Date(),
  },
  {
    id: "6", sellerId: "s6", brand: "Commencal", model: "Supreme DH V5", year: 2023,
    frameMaterial: "aluminum", drivetrain: "Shimano Saint", fork: "Marzocchi Bomber 58",
    shock: "RockShox Super Deluxe Coil", suspension: "full-suspension", wheelSize: 27.5,
    weightKg: 18.5, category: "downhill", condition: "good",
    description: "Park bike, maintained after every session.", images: ["https://placehold.co/600x400/1a1a1a/ff2d78?text=Supreme+DH"],
    status: "active", startingBid: 2500, reservePrice: null, currentBid: 2700,
    buyItNowPrice: null, bids: [], auctionStartsAt: new Date(),
    auctionEndsAt: new Date(Date.now() + 20 * 60 * 1000), createdAt: new Date(),
  },
];

const categories: { label: string; value: BikeCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Enduro", value: "enduro" },
  { label: "Trail", value: "trail" },
  { label: "XC", value: "cross-country" },
  { label: "Downhill", value: "downhill" },
  { label: "Dirt Jump", value: "dirt-jump" },
  { label: "Gravel", value: "gravel" },
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
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  const urgent = ms < 60 * 60 * 1000;
  const label = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m ${sec}s` : `${m}m ${sec}s`;

  return (
    <span style={{ color: urgent ? colors.pink : colors.textSecondary, fontWeight: urgent ? 600 : 400 }}>
      {label}
    </span>
  );
}

// ─── Listing Card ─────────────────────────────────────────────────────────────

function AuctionCard({ listing }: { listing: Listing }) {
  const bid = listing.currentBid ?? listing.startingBid;

  return (
    <Link to={`/auction/${listing.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.md,
          overflow: "hidden",
          transition: "border-color 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = colors.pink)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border)}
      >
        <img
          src={listing.images[0]}
          alt={`${listing.year} ${listing.brand} ${listing.model}`}
          style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
        />
        <div style={{ padding: "16px" }}>
          <p style={{ margin: "0 0 2px", fontSize: "11px", color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {listing.brand}
          </p>
          <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 600, color: colors.textPrimary }}>
            {listing.year} {listing.model}
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ margin: 0, fontSize: "11px", color: colors.textSecondary }}>Current bid</p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: colors.textPrimary }}>
                ${bid.toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "11px", color: colors.textSecondary }}>Ends in</p>
              <p style={{ margin: 0, fontSize: "13px" }}>
                <Countdown endsAt={listing.auctionEndsAt} />
              </p>
            </div>
          </div>
          {listing.buyItNowPrice && (
            <p style={{ margin: "10px 0 0", fontSize: "12px", color: colors.textSecondary }}>
              Buy it now: <span style={{ color: colors.pink, fontWeight: 600 }}>${listing.buyItNowPrice.toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Home() {
  const [activeCategory, setActiveCategory] = useState<BikeCategory | "all">("all");

  const filtered = activeCategory === "all"
    ? mockListings
    : mockListings.filter(l => l.category === activeCategory);

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: font.sans }}>

      {/* Hero */}
      <div
        style={{
          padding: "96px 32px",
          textAlign: "center",
          borderBottom: `1px solid ${colors.border}`,
          background: `radial-gradient(ellipse at 50% 0%, #2a0d18 0%, ${colors.bg} 70%)`,
        }}
      >
        <p style={{ margin: "0 0 16px", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: colors.pink, fontWeight: 600 }}>
          Live auctions
        </p>
        <h1
          style={{
            margin: "0 auto 24px",
            maxWidth: "640px",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            color: colors.textPrimary,
          }}
        >
          The best place to sell your{" "}
          <span style={{ color: colors.pink }}>high-end bike</span>
        </h1>
        <p style={{ margin: "0 auto 36px", maxWidth: "480px", fontSize: "16px", color: colors.textSecondary, lineHeight: 1.6 }}>
          Auction your mountain bike to thousands of serious riders. No fees until it sells.
        </p>
        <Link
          to="/sell"
          style={{
            display: "inline-block",
            background: colors.pink,
            color: "#fff",
            padding: "14px 32px",
            borderRadius: radii.sm,
            fontWeight: 700,
            fontSize: "14px",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          List your bike →
        </Link>
      </div>

      {/* Filters */}
      <div style={{ padding: "24px 32px 0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {categories.map(c => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            style={{
              padding: "7px 16px",
              borderRadius: "999px",
              border: `1px solid ${activeCategory === c.value ? colors.pink : colors.border}`,
              background: activeCategory === c.value ? colors.pink : "transparent",
              color: activeCategory === c.value ? "#fff" : colors.textSecondary,
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: font.sans,
              transition: "all 0.15s",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          padding: "24px 32px 64px",
        }}
      >
        {filtered.map(listing => (
          <AuctionCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
