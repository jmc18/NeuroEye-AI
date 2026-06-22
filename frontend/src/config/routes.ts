/**
 * Named route paths for navigation and links.
 * Update here when routes change — no hardcoded strings in components.
 */
export const ROUTES = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register',
    recoveryPassword: '/recovery-password',
  },
  app: {
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
  },
  legal: {
    privacyPolicy: '/privacy-policy',
    terms: '/terms',
  },
  reports: {
    list: '/reports',
    detail: (id: string) => `/reports/${id}` as const,
  },
  eyetracking: {
    session: '/eyetracking/session',
  },
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
