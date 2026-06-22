export const app = {
  layoutHint: 'Layout de aplicación (_app)',
  dashboard: {
    title: 'Panel',
    description:
      'features/dashboard/pages/DashboardPage.tsx — ruta protegida de ejemplo (_app layout)',
    sessions: 'Sesiones',
    activeUsers: 'Usuarios activos',
    reports: 'Informes',
  },
  profile: {
    title: 'Perfil',
    description: 'features/profile/pages/ProfilePage.tsx',
    role: 'Rol',
    tenant: 'Organización',
    roles: {
      researcher: 'Investigador',
    },
  },
  settings: {
    title: 'Configuración',
    description:
      'features/settings/pages/SettingsPage.tsx — otra ruta bajo el mismo layout _app',
    emailNotifications: 'Notificaciones por correo',
    darkMode: 'Modo oscuro (demo)',
  },
} as const
