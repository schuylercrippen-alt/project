# project

A React component library with a `Button` component.

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
