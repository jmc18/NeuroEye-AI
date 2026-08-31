# TanStack Router — rutas de ejemplo

## Estructura

```
app/router/routes/
├── __root.tsx              # Layout raíz (AppLayout + 404)
├── index.tsx               # /  → HomePage
├── _auth.tsx               # Layout pathless (login, register…)
├── _auth/
│   ├── login.tsx           # /login
│   ├── register.tsx        # /register
│   └── recovery-password.tsx
├── _app.tsx                # Layout con sidebar (área privada)
├── _app/
│   ├── dashboard.tsx       # /dashboard
│   ├── profile.tsx         # /profile
│   └── settings.tsx        # /settings
├── privacy-policy.tsx      # /privacy-policy
└── terms.tsx               # /terms
```

## Conceptos clave

| Concepto | Ejemplo en el proyecto |
|----------|------------------------|
| **File-based routing** | Cada archivo en `routes/` = una ruta |
| **Layout pathless (`_`)** | `_auth` y `_app` agrupan rutas sin añadir segmento a la URL |
| **Página vs ruta** | La ruta importa el componente desde `features/*/pages/` |
| **ROUTES** | Constantes en `@config/routes.ts` — no hardcodear URLs |
| **`<Link to={}>`** | Navegación type-safe con TanStack Router |
| **`head()`** | Título de página por ruta |

## Return URL (post-login redirect)

When an unauthenticated user opens a protected URL (e.g. `/profile` in the browser), `_app` `beforeLoad` redirects to:

```
/login?returnUrl=/profile
```

After login, the app navigates back to `returnUrl`. Auth state is stored in Zustand (`features/auth/store/authStore.ts`) with localStorage persistence (demo).

### Try it

1. Sign out from the sidebar
2. Paste `http://localhost:5173/profile` in the browser
3. You should land on login with `?returnUrl=/profile`
4. Submit the login form → back to `/profile`

## Añadir una ruta nueva

1. Crea la página en `features/<feature>/pages/MiPage.tsx`
2. Crea el archivo de ruta en `app/router/routes/…`
3. Añade la URL en `src/config/routes.ts`
4. El plugin regenera `routeTree.gen.ts` al hacer `pnpm dev`

## Rutas disponibles

| URL | Página | Layout |
|-----|--------|--------|
| `/` | Home | root |
| `/login` | Login | _auth |
| `/register` | Register | _auth |
| `/recovery-password` | Recovery | _auth |
| `/dashboard` | Dashboard | _app |
| `/patients` | Patient list | _app |
| `/patients/$patientId` | Patient file | _app |
| `/sessions` | Session history | _app |
| `/eyetracking/session` | AI screening canvas | ScreeningLayout |
| `/reports/$sessionId` | Diagnostic report | _app |
| `/profile` | Profile | _app |
| `/settings` | Settings | _app |
| `/privacy-policy` | Privacy | root |
| `/terms` | Terms | root |
