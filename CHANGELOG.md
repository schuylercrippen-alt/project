# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.9.0] - 2026-02-17

### Added
- `AuthContext` — global session provider using `supabase.auth.onAuthStateChange`
- `Auth` page (`/auth`) — tabbed sign in / create account with email confirmation flow
- `ProtectedRoute` — redirects unauthenticated users to `/auth` and back after sign in
- Nav avatar dropdown — shows user initial, Profile link, List a bike link, and Sign out when authenticated; Sign in button when signed out
- `Profile` page now shows real user email, username, and account creation date from Supabase Auth

### Changed
- `/sell` and `/profile` routes are now protected and require authentication
- `AuctionDetail` wired to Supabase — fetches listing and bids from DB, subscribes to real-time `postgres_changes` for live bid updates, and calls the atomic `place_bid` RPC on submission

## [0.8.0] - 2026-02-17

### Added
- Supabase client (`src/lib/supabase.ts`) initialised from environment variables
- `supabase/schema.sql` — `listings` and `bids` tables, atomic `place_bid` Postgres function, Row Level Security policies, and Realtime enabled on both tables
- `.env.example` for contributor onboarding

### Changed
- `.gitignore` updated to exclude `.env` and `.env.local`

## [0.7.0] - 2026-02-17

### Added
- `App.tsx` with React Router v6 routing for all pages
- `Nav` component — sticky nav with active link highlighting
- `Home` page — hero section, category filter chips, and live auction grid
- `AuctionDetail` page — hero image with thumbnail strip, sticky bidding sidebar with bid form, seller description, spec grid, host's Hot Take card, and live comments section
- `SubmitBike` page — 4-step multi-step form (Bike Info → Components → Condition & Photos → Pricing) with progress indicator
- `Profile` page — profile header with stats, tabbed view of Won / Lost / Active Bids / Comments
- `theme.ts` — shared color palette (dark grays + fluorescent pink), radii, and font constants

## [0.6.0] - 2026-02-17

### Added
- `ListingCard` component showing bike image, current bid in bold, and a live countdown timer that turns red when less than an hour remains

## [0.5.0] - 2026-02-17

### Added
- `Listing` TypeScript interface with bike details and auction-specific fields (`status`, `startingBid`, `reservePrice`, `currentBid`, `buyItNowPrice`, `bids`, `auctionStartsAt`, `auctionEndsAt`)
- `Bid`, `BikeCondition`, and `AuctionStatus` supporting types

## [0.4.0] - 2026-02-17

### Added
- `Dropdown` component with `options`, `value`, `placeholder`, `disabled`, and outside-click-to-close support

## [0.3.0] - 2026-02-17

### Added
- `Modal` component with `open`, `title`, `onClose`, and backdrop click support

## [0.2.0] - 2026-02-17

### Added
- `Input` component with `label`, `error`, and `disabled` props

## [0.1.0] - 2026-02-17

### Added
- `Button` component with `variant`, `loading`, and `disabled` props
- Vitest + React Testing Library test suite
- Apache 2.0 license
- Contributing guide
