# State management (Zustand)

Global client state uses [Zustand](https://zustand.docs.pmnd.rs/) with persistence, devtools (dev only), and hydration before routing.

## Stores

| Store | File | Persists | Purpose |
|-------|------|----------|---------|
| **Auth** | `features/auth/store/authStore.ts` | ✅ | Session, user, token |
| **Locale** | `store/localeStore.ts` | ✅ | Language (`es` / `en`) |
| **UI** | `store/uiStore.ts` | ✅ | Theme, notifications, sidebar |

## Hooks (preferred API)

Use hooks from `@hooks/useStore` instead of importing stores directly in components:

```tsx
import { useAuth, useLocale, useUi } from '@hooks/useStore'

const { user, login, logout, isAuthenticated } = useAuth()
const { locale, setLocale } = useLocale()
const { theme, setTheme, emailNotifications } = useUi()
```

## Auth flow

```tsx
await login({ email, password })
// → updates Zustand + localStorage + access_token for axios

logout()
// → clears session and token
```

Integrated with TanStack Router via `AppProviders` → `RouterContext.auth`.

`StoreHydrationGate` waits for persisted stores before rendering routes (avoids false redirects on refresh).

## Add a new store

1. Create `features/<feature>/store/myStore.ts` or `store/myStore.ts`
2. Use `createPersistedStore` from `@store/createPersistedStore`
3. Add selectors + hook in `hooks/useStore.ts`
4. Register in `StoreHydrationGate` if persisted

```ts
import { createPersistedStore } from '@store/createPersistedStore'

export const useMyStore = createPersistedStore<MyState>(
  { name: 'my-feature', partialize: (s) => ({ ... }) },
  (set) => ({ ... }),
)
```

## DevTools

Stores are named `neuroeye/<store>` in Redux DevTools when `import.meta.env.DEV` is true.
