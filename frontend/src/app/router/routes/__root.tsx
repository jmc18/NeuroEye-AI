import { createRootRouteWithContext } from '@tanstack/react-router'

import type { RouterContext } from '@app/router/context'
import AppLayout from '@app/layouts/AppLayout'
import { NotFoundPage } from '@features/home/pages/NotFoundPage'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: AppLayout,
  notFoundComponent: NotFoundPage,
})
