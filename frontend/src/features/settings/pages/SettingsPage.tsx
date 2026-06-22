import { useTranslation } from 'react-i18next'

import { PageHeader } from '@components/layout'
import { useUi } from '@hooks/useStore'

export function SettingsPage() {
  const { t } = useTranslation()
  const { theme, emailNotifications, setTheme, setEmailNotifications } = useUi()

  return (
    <div>
      <PageHeader title={t('app.settings.title')} description={t('app.settings.description')} />

      <div className="max-w-xl space-y-4">
        <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {t('app.settings.emailNotifications')}
          </span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(event) => setEmailNotifications(event.target.checked)}
            className="rounded border-gray-300"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {t('app.settings.darkMode')}
          </span>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
            className="rounded border-gray-300"
          />
        </label>
      </div>
    </div>
  )
}
