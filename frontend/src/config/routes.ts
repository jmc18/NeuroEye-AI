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
    patients: '/patients',
    patient: (id: string) => `/patients/${id}` as const,
    sessions: '/sessions',
  },
  admin: {
    tenants: '/admin/tenants',
    tenant: (id: string) => `/admin/tenants/${id}` as const,
    accounts: '/admin/accounts',
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
    forPatient: (patientId: string) => `/eyetracking/session/${patientId}` as const,
  },
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
