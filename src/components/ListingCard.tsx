import React, { useState, useEffect } from "react";
import { Listing } from "../types/Listing";

interface ListingCardProps {
  listing: Listing;
}

function getTimeRemaining(endsAt: Date): number {
  return Math.max(0, endsAt.getTime() - Date.now());
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ended";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

export function ListingCard({ listing }: ListingCardProps) {
  const { brand, model, year, images, currentBid, startingBid, auctionEndsAt, status } = listing;

  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(auctionEndsAt));

  useEffect(() => {
    if (status !== "active") return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(auctionEndsAt);
      setTimeRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionEndsAt, status]);

  const isExpiringSoon = timeRemaining > 0 && timeRemaining < ONE_HOUR_MS;
  const highBid = currentBid ?? startingBid;

  return (
    <div data-testid="listing-card">
      <img
        src={images[0]}
        alt={`${year} ${brand} ${model}`}
      />
      <div>
        <h2>{year} {brand} {model}</h2>
        <p>
          <strong data-testid="current-bid">${highBid.toLocaleString()}</strong>
        </p>
        {status === "active" && (
          <p
            data-testid="countdown"
            data-expiring={isExpiringSoon}
            style={{ color: isExpiringSoon ? "red" : "inherit" }}
          >
            {formatCountdown(timeRemaining)}
          </p>
        )}
        {status === "ended" || status === "sold" ? (
          <p data-testid="auction-ended">Auction ended</p>
        ) : null}
      </div>
    </div>
  );
}
