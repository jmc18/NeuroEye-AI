/**
 * Re-exports path-related constants.
 *
 * Import aliases (configured in `paths.config.ts` at project root):
 *
 * | Alias          | Folder           |
 * |----------------|------------------|
 * | `@app/*`       | `src/app/`       |
 * | `@features/*`  | `src/features/`  |
 * | `@components/*`| `src/components/`|
 * | `@lib/*`       | `src/lib/`       |
 * | `@hooks/*`     | `src/hooks/`     |
 * | `@types/*`     | `src/types/`     |
 * | `@assets/*`    | `src/assets/`    |
 * | `@config/*`    | `src/config/`    |
 * | `@/*`          | `src/` (fallback)|
 */
export { ROUTES, type AppRoute } from './routes'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const ENV = {
  apiUrl: API_URL,
  wsUrl: (import.meta.env.VITE_WS_URL as string | undefined) ?? API_URL.replace(/^http/, 'ws'),
} as const
