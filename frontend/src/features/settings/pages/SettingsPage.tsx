import { useTranslation } from 'react-i18next'

import { PageHeader } from '@components/layout'
import { Card } from '@components/ui'
import { useUi } from '@hooks/useStore'

export function SettingsPage() {
  const { t } = useTranslation()
  const { theme, emailNotifications, setTheme, setEmailNotifications } = useUi()

  return (
    <div>
      <PageHeader title={t('app.settings.title')} description={t('app.settings.description')} />

      <div className="max-w-xl space-y-4">
        <Card className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface">
            {t('app.settings.emailNotifications')}
          </span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(event) => setEmailNotifications(event.target.checked)}
            className="rounded border-outline-variant text-primary"
          />
        </Card>
        <Card className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface">{t('app.settings.darkMode')}</span>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
            className="rounded border-outline-variant text-primary"
          />
        </Card>
      </div>
    </div>
  )
}
