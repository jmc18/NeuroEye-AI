import { useTranslation } from 'react-i18next'

import { PageHeader } from '@components/layout'
import { useAuth } from '@hooks/useStore'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const roleLabel =
    user.role === 'researcher' ? t('app.profile.roles.researcher') : user.role

  return (
    <div>
      <PageHeader title={t('app.profile.title')} description={t('app.profile.description')} />

      <div className="max-w-xl rounded-xl border border-gray-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-neutral-400">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-neutral-400">{t('app.profile.role')}</dt>
            <dd className="font-medium text-gray-800 dark:text-white">{roleLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-neutral-400">{t('app.profile.tenant')}</dt>
            <dd className="font-medium text-gray-800 dark:text-white">{user.tenant}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
