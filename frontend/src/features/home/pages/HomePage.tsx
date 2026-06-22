import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { ROUTES } from '@config'

export function HomePage() {
  const { t } = useTranslation()

  const demoRoutes = [
    {
      group: t('home.groups.public'),
      routes: [
        { label: t('home.routes.home'), path: ROUTES.home, note: 'index.tsx — landing' },
        {
          label: t('home.routes.privacyPolicy'),
          path: ROUTES.legal.privacyPolicy,
          note: 'privacy-policy.tsx',
        },
        { label: t('home.routes.terms'), path: ROUTES.legal.terms, note: 'terms.tsx' },
      ],
    },
    {
      group: t('home.groups.auth'),
      routes: [
        { label: t('home.routes.login'), path: ROUTES.auth.login, note: '_auth/login.tsx' },
        {
          label: t('home.routes.register'),
          path: ROUTES.auth.register,
          note: '_auth/register.tsx',
        },
        {
          label: t('home.routes.recoveryPassword'),
          path: ROUTES.auth.recoveryPassword,
          note: '_auth/recovery-password.tsx',
        },
      ],
    },
    {
      group: t('home.groups.app'),
      routes: [
        {
          label: t('home.routes.dashboard'),
          path: ROUTES.app.dashboard,
          note: '_app/dashboard.tsx',
        },
        { label: t('home.routes.profile'), path: ROUTES.app.profile, note: '_app/profile.tsx' },
        {
          label: t('home.routes.settings'),
          path: ROUTES.app.settings,
          note: '_app/settings.tsx',
        },
      ],
    },
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          {t('common.appName')}
        </h1>
        <p className="mt-3 text-gray-600 dark:text-neutral-400">{t('home.subtitle')}</p>
      </div>

      <div className="space-y-8">
        {demoRoutes.map((section) => (
          <section key={section.group}>
            <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
              {section.group}
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500">
                      {t('common.page')}
                    </th>
                    <th className="px-4 py-3 text-start text-xs font-medium uppercase text-gray-500">
                      {t('common.routeFile')}
                    </th>
                    <th className="px-4 py-3 text-end text-xs font-medium uppercase text-gray-500">
                      {t('common.go')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                  {section.routes.map((route) => (
                    <tr key={route.path}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                        {route.label}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-neutral-400">
                        {route.note}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Link
                          to={route.path}
                          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {route.path}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
