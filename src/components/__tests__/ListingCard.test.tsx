import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ListingCard } from "../ListingCard";
import { Listing } from "../../types/Listing";

const baseListing: Listing = {
  id: "1",
  sellerId: "seller-1",
  brand: "Trek",
  model: "Slash 9.9",
  year: 2024,
  frameMaterial: "carbon",
  drivetrain: "Shimano XT 12-speed",
  fork: "Fox 36 Factory",
  shock: "Fox Float X2",
  suspension: "full-suspension",
  wheelSize: 29,
  weightKg: 13.5,
  category: "enduro",
  condition: "like-new",
  description: "Barely ridden.",
  images: ["https://example.com/bike.jpg"],
  status: "active",
  startingBid: 3000,
  reservePrice: null,
  currentBid: 4500,
  buyItNowPrice: null,
  bids: [],
  auctionStartsAt: new Date("2026-02-17T00:00:00Z"),
  auctionEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  createdAt: new Date("2026-02-17T00:00:00Z"),
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("ListingCard", () => {
  it("renders the bike image with alt text", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "2024 Trek Slash 9.9");
  });

  it("renders the bike image src", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/bike.jpg");
  });

  it("renders the year, brand, and model", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByRole("heading")).toHaveTextContent("2024 Trek Slash 9.9");
  });

  it("renders the current bid in bold", () => {
    render(<ListingCard listing={baseListing} />);
    const bid = screen.getByTestId("current-bid");
    expect(bid.tagName).toBe("STRONG");
    expect(bid).toHaveTextContent("$4,500");
  });

  it("falls back to starting bid when there are no bids", () => {
    render(<ListingCard listing={{ ...baseListing, currentBid: null }} />);
    expect(screen.getByTestId("current-bid")).toHaveTextContent("$3,000");
  });

  it("renders a countdown timer for active auctions", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByTestId("countdown")).toBeInTheDocument();
  });

  it("countdown is not red when more than an hour remains", () => {
    render(<ListingCard listing={baseListing} />);
    expect(screen.getByTestId("countdown")).toHaveAttribute("data-expiring", "false");
  });

  it("countdown turns red when less than an hour remains", () => {
    const soonListing: Listing = {
      ...baseListing,
      auctionEndsAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    };
    render(<ListingCard listing={soonListing} />);
    expect(screen.getByTestId("countdown")).toHaveAttribute("data-expiring", "true");
    expect(screen.getByTestId("countdown")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("updates the countdown every second", () => {
    render(<ListingCard listing={baseListing} />);
    const before = screen.getByTestId("countdown").textContent;
    act(() => vi.advanceTimersByTime(1000));
    const after = screen.getByTestId("countdown").textContent;
    expect(before).not.toBe(after);
  });

  it("shows 'Ended' when the auction time has elapsed", () => {
    const endedListing: Listing = {
      ...baseListing,
      auctionEndsAt: new Date(Date.now() - 1000),
    };
    render(<ListingCard listing={endedListing} />);
    expect(screen.getByTestId("countdown")).toHaveTextContent("Ended");
  });

  it("does not render a countdown for ended auctions", () => {
    render(<ListingCard listing={{ ...baseListing, status: "ended" }} />);
    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
    expect(screen.getByTestId("auction-ended")).toBeInTheDocument();
  });
});
