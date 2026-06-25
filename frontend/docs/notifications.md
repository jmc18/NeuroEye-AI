# Toast notifications

Enterprise-ready global notifications built on **React Toastify** (engine only) with **Preline-inspired** Tailwind UI.

## Architecture

```
Page / Service / Hook / Axios interceptor
        ↓
  toast.service.ts   ← only public API
        ↓
  React Toastify     ← stacking, queue, lifecycle, a11y
        ↓
  PrelineToast + variants (visible UI)
```

**Never import `react-toastify` outside `src/shared/notifications/`.**

Import from:

```typescript
import { toast } from '@shared/notifications'
```

## Setup

`ToastProvider` is mounted in `AppProviders`. No extra setup required in pages.

## Basic usage

```typescript
import { toast } from '@shared/notifications'

toast.success('Patient saved')
toast.error('Failed to save patient')
toast.warning('Subscription expires soon')
toast.info('Analysis started')
toast.loading('Processing analysis')
```

## Object payloads

```typescript
toast.success({
  title: 'Patient Created',
  message: 'Patient saved successfully',
})

toast.error({
  title: 'Save failed',
  message: 'Could not persist patient record',
  duration: 8000,
})
```

## Custom content

```typescript
toast.show({
  type: 'success',
  content: (
    <div className="text-sm text-gray-600 dark:text-neutral-400">
      Custom layout inside Preline shell
    </div>
  ),
})
```

## Custom component

```typescript
function PatientCreatedToast({ patient }: { patient: Patient }) {
  return (
    <div>
      <p className="font-semibold">{patient.name}</p>
      <p className="text-sm text-gray-600">Record #{patient.id}</p>
    </div>
  )
}

toast.custom(<PatientCreatedToast patient={patient} />)
```

## Avatar toast

```typescript
toast.show({
  type: 'info',
  avatar: patient.avatarUrl,
  title: patient.name,
  message: 'Analysis completed',
})
```

## Action toast

```typescript
toast.show({
  type: 'info',
  title: 'Analysis completed',
  message: 'The report is ready',
  action: {
    label: 'View Results',
    onClick: () => navigate({ to: '/results/$id', params: { id } }),
  },
})
```

## Loading toast

```typescript
const id = toast.loading({
  title: 'Processing',
  message: 'AI analysis in progress',
})

// later
toast.dismiss(id)
```

## Progress toast

```typescript
toast.show({
  type: 'info',
  title: 'Uploading video',
  message: 'Please keep this tab open',
  progress: 65,
})
```

## Promise toast

```typescript
await toast.promise(createAnalysis(payload), {
  pending: 'Processing analysis...',
  success: {
    title: 'Analysis completed',
    message: 'Results are ready',
  },
  error: 'Analysis failed',
})
```

## Dismiss

```typescript
const id = toast.info('Syncing...')

toast.dismiss(id)
toast.dismissAll()
```

## From services

```typescript
// features/patients/services/patientService.ts
import { toast } from '@shared/notifications'

export async function savePatient(data: PatientInput) {
  try {
    await createPatient(data)
    toast.success({ title: 'Patient saved', message: data.name })
  } catch (error) {
    // Axios interceptor already toasts API errors; handle domain logic only
    throw error
  }
}
```

## Skip automatic Axios error toast

Per-request opt-out (e.g. login form with inline validation):

```typescript
import { login } from '@api/generated/auth/auth'

await login(credentials, { skipErrorToast: true })
```

401 responses are never toasted globally (auth flows handle their own UX).

## Options reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | — | Bold heading |
| `message` | `string` | — | Body text |
| `content` | `ReactNode` | — | Custom body (inside Preline shell) |
| `avatar` | `string` | — | Avatar image URL |
| `icon` | `ReactNode` | type icon | Override icon |
| `action` | `{ label, onClick }` | — | Action button |
| `duration` | `number` | by type | Auto-close ms |
| `persistent` | `boolean` | `false` | Never auto-close |
| `closable` | `boolean` | `true` | Show close button |
| `progress` | `number` | — | 0–100 progress bar |

## Stacking

- Vertical stack, newest on top
- Default limit: **5** (`TOAST_LIMIT`)
- Container scrolls when limit exceeded
- Configure via `<ToastProvider config={{ limit: 8 }} />`

## Accessibility

- `role="alert"` on each toast
- `aria-live="polite"` (or `assertive` for errors)
- Close button with `aria-label`
- Progress bar with `role="progressbar"`

## Replacing React Toastify

Only these files depend on React Toastify:

- `toast.service.ts`
- `toast.provider.tsx`

Swap the engine by reimplementing those two modules; the public `toast` API stays stable.
