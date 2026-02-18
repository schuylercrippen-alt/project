# project

A mountain bike auction site built with React, TypeScript, and React Router. Dark gray and fluorescent pink aesthetic.

## Pages

### Home (`/`)

Hero section with a headline and CTA, category filter chips, and a live auction grid. Each card shows the bike image, current bid, and a countdown timer.

### Auction Detail (`/auction/:id`)

- Large hero image with a scrollable thumbnail strip
- Sticky bidding sidebar — current bid, time remaining, bid input, Place Bid button, and Buy It Now
- Seller description with a full spec grid
- Host's Hot Take — a staff editorial callout
- Live comments section with a post form

### Sell a Bike (`/sell`)

A 4-step multi-step form for sellers:
1. **Bike Info** — brand, model, year, frame material, category, suspension, wheel size
2. **Components** — fork, shock, drivetrain, weight
3. **Condition & Photos** — condition chips, description, photo upload
4. **Pricing** — starting bid, reserve price, buy it now, fee summary

### Profile (`/profile`)

Profile header with stats, and a tabbed view of:
- **Won** — auctions the user has won with final prices
- **Lost** — auctions lost with the user's bid vs. final sale price
- **Active Bids** — live auctions with leading/outbid status
- **Comments** — comment history across listings

## Components

### Button

A flexible button component with support for variants, loading state, and disabled state.

```tsx
import { Button } from "./src/components/Button";

<Button variant="primary" onClick={() => console.log("clicked")}>
  Click me
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "danger"` | `"primary"` | Visual style of the button |
| `loading` | `boolean` | `false` | Shows "Loading..." and disables the button |
| `disabled` | `boolean` | `false` | Disables the button |
| `children` | `ReactNode` | — | Button label |

All standard HTML button attributes are also supported.

### Input

A labeled input component with error state support.

```tsx
import { Input } from "./src/components/Input";

<Input label="Email" error="Required" onChange={(e) => console.log(e.target.value)} />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label text displayed above the input |
| `error` | `string` | — | Error message displayed below the input |
| `disabled` | `boolean` | `false` | Disables the input |

All standard HTML input attributes are also supported.

### Modal

A dialog component with backdrop click and close button support.

```tsx
import { Modal } from "./src/components/Modal";

<Modal open={isOpen} title="Confirm" onClose={() => setIsOpen(false)}>
  Are you sure?
</Modal>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls visibility of the modal |
| `title` | `string` | — | Optional title displayed at the top |
| `onClose` | `() => void` | — | Called when the close button or backdrop is clicked |
| `children` | `ReactNode` | — | Modal content |

### Dropdown

A listbox component with outside-click-to-close and accessible option selection.

```tsx
import { Dropdown } from "./src/components/Dropdown";

<Dropdown
  options={[
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]}
  value={selected}
  onChange={(value) => setSelected(value)}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ label: string; value: string }[]` | — | List of options to display |
| `value` | `string` | — | Currently selected value |
| `placeholder` | `string` | `"Select..."` | Text shown when no value is selected |
| `disabled` | `boolean` | `false` | Disables the dropdown |
| `onChange` | `(value: string) => void` | — | Called with the selected value |

### ListingCard

Displays a mountain bike auction listing with a bike image, current bid, and live countdown timer.

```tsx
import { ListingCard } from "./src/components/ListingCard";

<ListingCard listing={listing} />
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `listing` | `Listing` | The auction listing to display |

- Shows the first image in `listing.images` as a full-width photo
- Displays `currentBid` in bold, falling back to `startingBid` if no bids have been placed
- Shows a live countdown timer for active auctions that turns red when less than an hour remains
- Shows "Auction ended" for listings with status `"ended"` or `"sold"`

## Types

### Listing

The core type for a mountain bike auction listing, found in `src/types/Listing.ts`.

```ts
import { Listing } from "./src/types/Listing";
```

**Bike fields:**

| Field | Type | Description |
|-------|------|-------------|
| `brand` | `string` | Manufacturer (e.g. `"Trek"`) |
| `model` | `string` | Model name (e.g. `"Slash 9.9"`) |
| `year` | `number` | Model year |
| `frameMaterial` | `"aluminum" \| "carbon" \| "steel" \| "titanium"` | Frame material |
| `drivetrain` | `string` | Drivetrain description (e.g. `"Shimano XT 12-speed"`) |
| `fork` | `string` | Fork model (e.g. `"Fox 36 Factory"`) |
| `shock` | `string \| null` | Rear shock model, or `null` for hardtails/rigid |
| `suspension` | `"hardtail" \| "full-suspension" \| "rigid"` | Suspension type |
| `wheelSize` | `26 \| 27.5 \| 29` | Wheel diameter in inches |
| `weightKg` | `number` | Bike weight in kilograms |
| `category` | `"cross-country" \| "trail" \| "enduro" \| "downhill" \| "dirt-jump" \| "gravel"` | Riding discipline |
| `condition` | `"new" \| "like-new" \| "good" \| "fair" \| "poor"` | Bike condition |

**Auction fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | `"draft" \| "active" \| "ended" \| "sold" \| "cancelled"` | Auction status |
| `startingBid` | `number` | Opening bid amount |
| `reservePrice` | `number \| null` | Minimum price to sell, or `null` for no reserve |
| `currentBid` | `number \| null` | Latest bid amount, or `null` if no bids placed |
| `buyItNowPrice` | `number \| null` | Optional instant purchase price |
| `bids` | `Bid[]` | Array of all bids placed |
| `auctionStartsAt` | `Date` | Auction start time |
| `auctionEndsAt` | `Date` | Auction end time |

## Theme

Shared design tokens are in `src/theme.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `colors.bg` | `#111111` | Page background |
| `colors.surface` | `#1a1a1a` | Cards and panels |
| `colors.border` | `#2a2a2a` | Borders and dividers |
| `colors.pink` | `#ff2d78` | Accents, CTAs, active states |
| `colors.textPrimary` | `#f0f0f0` | Primary text |
| `colors.textSecondary` | `#888888` | Secondary / muted text |

## Development

Install dependencies:

```sh
npm install
```

Run tests:

```sh
npx vitest run
```

Watch mode:

```sh
npx vitest
```
