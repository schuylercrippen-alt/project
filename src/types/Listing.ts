export type FrameMaterial = "aluminum" | "carbon" | "steel" | "titanium";

export type Suspension =
  | "hardtail"
  | "full-suspension"
  | "rigid";

export type WheelSize = 26 | 27.5 | 29;

export type BikeCategory =
  | "cross-country"
  | "trail"
  | "enduro"
  | "downhill"
  | "dirt-jump"
  | "gravel";

export type BikeCondition = "new" | "like-new" | "good" | "fair" | "poor";

export type AuctionStatus = "draft" | "active" | "ended" | "sold" | "cancelled";

export interface Bid {
  id: string;
  bidderId: string;
  amount: number;
  placedAt: Date;
}

export interface Listing {
  id: string;
  sellerId: string;

  // Bike details
  brand: string;
  model: string;
  year: number;
  frameMaterial: FrameMaterial;
  drivetrain: string;
  fork: string;
  shock: string | null;
  suspension: Suspension;
  wheelSize: WheelSize;
  weightKg: number;
  category: BikeCategory;
  condition: BikeCondition;
  description: string;
  images: string[];

  // Auction details
  status: AuctionStatus;
  startingBid: number;
  reservePrice: number | null;
  currentBid: number | null;
  buyItNowPrice: number | null;
  bids: Bid[];
  auctionStartsAt: Date;
  auctionEndsAt: Date;
  createdAt: Date;
}
