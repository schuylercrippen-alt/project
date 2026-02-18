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

export interface Listing {
  id: string;
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
  askingPrice: number;
  description: string;
  images: string[];
  createdAt: Date;
}
