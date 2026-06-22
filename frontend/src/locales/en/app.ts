export const app = {
  layoutHint: 'App layout (_app)',
  dashboard: {
    title: 'Dashboard',
    description:
      'features/dashboard/pages/DashboardPage.tsx — example protected route (_app layout)',
    sessions: 'Sessions',
    activeUsers: 'Active users',
    reports: 'Reports',
  },
  profile: {
    title: 'Profile',
    description: 'features/profile/pages/ProfilePage.tsx',
    role: 'Role',
    tenant: 'Tenant',
    roles: {
      researcher: 'Researcher',
    },
  },
  settings: {
    title: 'Settings',
    description:
      'features/settings/pages/SettingsPage.tsx — another route under the same _app layout',
    emailNotifications: 'Email notifications',
    darkMode: 'Dark mode (demo)',
  },
} as const
