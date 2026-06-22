import { useTranslation } from 'react-i18next'

import { PageHeader } from '@components/layout'

export function DashboardPage() {
  const { t } = useTranslation()

  const stats = [
    { label: t('app.dashboard.sessions'), value: '128' },
    { label: t('app.dashboard.activeUsers'), value: '24' },
    { label: t('app.dashboard.reports'), value: '12' },
  ]

  return (
    <div>
      <PageHeader title={t('app.dashboard.title')} description={t('app.dashboard.description')} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <p className="text-sm text-gray-500 dark:text-neutral-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
