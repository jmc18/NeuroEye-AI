# Frontend

React + Vite app with Tailwind CSS 4, Preline UI, and TanStack Router.

## Quick start

```powershell
cd frontend
copy .env.example .env
pnpm install
pnpm dev
```

## Architecture

```
src/
├── app/
│   ├── router/routes/    # TanStack Router file-based routes
│   ├── providers/        # React Query, etc.
│   └── layouts/          # App shell (Preline init here)
├── features/             # Domain modules (auth, reports, eyetracking)
├── components/
│   ├── ui/               # Preline wrappers (Dropdown, Modal, Collapse)
│   ├── forms/
│   └── layout/
├── lib/                  # axios, preline, utils
├── hooks/
└── types/
```

## Documentation

- [TanStack Router — example routes](docs/routing.md)
- [Internationalization (i18n)](docs/i18n.md)
- [State management (Zustand)](docs/state.md)
- [Services layer](docs/services.md)

Default language: **Spanish (`es`)**. Use the language switcher (top-right) for English.

## Path aliases

All import aliases are defined in **`paths.config.ts`** (single source of truth for Vite).
Mirror changes in `tsconfig.app.json` when adding new aliases.

| Alias | Folder | Example |
|-------|--------|---------|
| `@app/*` | `src/app/` | `import { AppProviders } from '@app/providers/AppProviders'` |
| `@features/*` | `src/features/` | `import { ... } from '@features/auth'` |
| `@components/*` | `src/components/` | `import { Modal } from '@components/ui'` |
| `@lib/*` | `src/lib/` | `import { api } from '@lib/axios'` |
| `@hooks/*` | `src/hooks/` | `import { usePreline } from '@hooks/usePreline'` |
| `@types/*` | `src/types/` | `import type { ApiError } from '@types'` |
| `@assets/*` | `src/assets/` | `import logo from '@assets/hero.png'` |
| `@config/*` | `src/config/` | `import { ROUTES } from '@config'` |
| `@/*` | `src/` | Fallback for anything else |

### Route paths

Use named route constants from `@config` instead of hardcoded URL strings:

```tsx
import { ROUTES } from '@config'
import { Link } from '@tanstack/react-router'

<Link to={ROUTES.auth.login}>Login</Link>
```

## Preline + React

Do not use `data-hs-*` attributes directly in pages. Use wrappers from `components/ui/` so you can swap libraries later.

Preline re-initializes on route changes via `usePreline()` in `AppLayout`.
