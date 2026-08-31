import { Outlet } from '@tanstack/react-router'

import { RouterDevtoolsPanel } from '@app/providers/Devtools'
import { usePreline } from '@hooks/usePreline'

export default function AppLayout() {
  usePreline()

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Outlet />
      <RouterDevtoolsPanel />
    </div>
  )
}
