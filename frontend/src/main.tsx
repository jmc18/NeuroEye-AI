import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter } from '@tanstack/react-router'

import { AppProviders } from '@app/providers/AppProviders'
import type { RouterContext } from '@app/router/context'
import { routeTree } from '@app/router/routeTree.gen'
import '@lib/i18n/config'
import '@lib/preline-plugins'
import './index.css'

const defaultContext: RouterContext = {
  auth: {
    isAuthenticated: false,
    user: null,
    login: async () => false,
    logout: () => undefined,
  },
}

const router = createRouter({
  routeTree,
  context: defaultContext,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

import('preline').then(() => {
  createRoot(document.getElementById('root-container')!).render(
    <StrictMode>
      <AppProviders router={router} />
    </StrictMode>,
  )
})
