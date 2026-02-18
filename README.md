# project

A React component library with `Button`, `Input`, and `Modal` components.

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
