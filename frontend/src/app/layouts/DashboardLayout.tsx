import { Outlet } from '@tanstack/react-router'

import { SidebarNav } from '@components/layout'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
