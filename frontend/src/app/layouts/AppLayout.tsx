import { Outlet } from '@tanstack/react-router'

import { RouterDevtoolsPanel } from '@app/providers/Devtools'
import { LanguageSwitcher } from '@components/layout/LanguageSwitcher'
import { usePreline } from '@hooks/usePreline'

export default function AppLayout() {
  usePreline()

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <LanguageSwitcher variant="floating" />
      <Outlet />
      <RouterDevtoolsPanel />
    </div>
  )
}
