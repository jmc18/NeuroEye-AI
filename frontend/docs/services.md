# Auth services layer

HTTP and business logic are split so components and stores stay thin.

```
features/auth/
├── api/authApi.ts         # HTTP calls (axios)
├── services/authService.ts # Orchestration, mapping, token persistence
├── store/authStore.ts      # Zustand — calls services
├── hooks/useLoginForm.ts   # Form logic (react-hook-form)
└── pages/LoginPage.tsx     # UI only
```

## Flow

```
LoginPage → useLoginForm → useAuth().login()
         → authStore → authService.loginWithCredentials()
         → authApi.login()  (falls back to demo if API unavailable)
```

## When the backend is ready

`authService.ts` already calls `POST /api/v1/auth/login`. Remove the demo fallback in the `catch` block once the endpoint exists.

## Forms (no FormEvent)

Login uses **react-hook-form** + **zod** via `useLoginForm`:

```tsx
const { form, onSubmit, isSubmitting } = useLoginForm(returnUrl)

<form onSubmit={onSubmit}>
  <input {...form.register('email')} />
</form>
```

`handleSubmit` from RHF infers types from the schema — no manual `FormEvent` handlers.

## Reuse across features

Import the service from other modules:

```tsx
import { loginWithCredentials } from '@features/auth'
```

Or only the API layer:

```tsx
import { authApi } from '@features/auth/api/authApi'
```
