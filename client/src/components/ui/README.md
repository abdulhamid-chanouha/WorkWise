# UI component library

Shared, strongly-typed building blocks styled with Tailwind v4. Import from
`src/components/ui` (or directly from each file).

## Button

Variants: `primary` | `secondary` | `danger` | `ghost`. Supports `disabled` and `loading`.

```tsx
import { Button } from '../components/ui';

<Button variant="primary" loading={isSaving} onClick={handleSave}>
  Save changes
</Button>
```

## Input / Select / Textarea

Labeled form controls with `error` and `helperText`. All native element props
pass through, including `ref`.

```tsx
import { Input, Select, Textarea } from '../components/ui';

<Input label="Email" type="email" error={errors.email} />
<Select label="Role" options={[{ value: 'admin', label: 'Admin' }]} placeholder="Choose a role" />
<Textarea label="Notes" helperText="Optional — visible to your team only" />
```

## Modal

Accessible dialog: traps focus, closes on `Escape` or backdrop click, restores
focus to the trigger on close, and locks body scroll while open.

```tsx
import { Modal, Button } from '../components/ui';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete project?">
  <p>This action cannot be undone.</p>
  <Button variant="danger" onClick={handleDelete}>Delete</Button>
</Modal>
```

## Dropdown

Accessible menu: arrow-key navigation, click-outside to close, `aria-haspopup`/`aria-expanded`.

```tsx
import { Dropdown, Button } from '../components/ui';

<Dropdown
  trigger={<Button variant="secondary">Actions</Button>}
  items={[
    { label: 'Edit', onSelect: handleEdit },
    { label: 'Delete', onSelect: handleDelete },
  ]}
/>
```

## Card

```tsx
import { Card } from '../components/ui';

<Card title="Team members">
  <p>3 active members</p>
</Card>
```

## Spinner

```tsx
import { Spinner } from '../components/ui';

<Spinner size="md" />
```

## Toast

Imperative notifications via `useToast`. Requires `ToastProvider` (wired up in
`App.tsx`) somewhere above in the tree.

```tsx
import { useToast } from '../../hooks/useToast';

const toast = useToast();
toast.success('Project created');
toast.error('Could not save changes');
toast.info('You have unsaved changes');
```
