# Auth services layer

HTTP and business logic are split so components and stores stay thin.

```
features/auth/
├── services/authService.ts # Orval login + mapping + token/session sync
├── store/authStore.ts      # Zustand — calls services
├── hooks/useLoginForm.ts   # Form logic (react-hook-form)
└── pages/LoginPage.tsx     # UI only
```

## Flow

```
LoginPage → useLoginForm → useAuth().login()
         → authStore → authService.loginWithCredentials()
         → login() from @api/generated/auth
         → customInstance (axios) with Bearer + X-Tenant-Id
```

## Session sync

- On login: `authService` persists token to `localStorage` and sets `httpSession`.
- On logout: `httpSession.clear()` and token removed from storage.
- On app load: `StoreHydrationGate` calls `syncHttpSessionFromStorage()` after Zustand rehydration.

## When the backend is ready

Remove the demo fallback in the `catch` block of `loginWithCredentials` once login is validated in production.

## Forms (no FormEvent)

Login uses **react-hook-form** + **zod** via `useLoginForm`:

```tsx
const { form, onSubmit, isSubmitting } = useLoginForm(returnUrl)

<form onSubmit={onSubmit}>
  <input {...form.register('email')} />
</form>
```

## Reuse across features

```tsx
import { loginWithCredentials } from '@features/auth'
```

Direct Orval usage (when no extra logic is needed):

```tsx
import { login } from '@api/generated/auth/auth'
```
