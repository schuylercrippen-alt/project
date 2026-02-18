# project

A React component library and TypeScript types for a mountain bike auction site.

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
