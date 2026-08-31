import { createPersistedStore } from '@/store/createPersistedStore'

import { loginWithCredentials, logoutFromApi, persistSession, registerWithCredentials } from '../services/authService'
import type { AuthSession } from '../types/api'
import type { AuthState } from '../types/auth'

function writeSession(
  session: AuthSession,
  impersonator: AuthState['impersonator'] = null,
): Pick<AuthState, 'isAuthenticated' | 'user' | 'accessToken' | 'impersonator'> {
  void persistSession(session.accessToken, session.user.tenantId)
  return {
    isAuthenticated: true,
    user: session.user,
    accessToken: session.accessToken,
    impersonator,
  }
}

export const useAuthStore = createPersistedStore<AuthState>(
  {
    name: 'auth',
    partialize: (state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      accessToken: state.accessToken,
      impersonator: state.impersonator,
    }),
  },
  (set, get) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    impersonator: null,

    login: async (credentials): Promise<boolean> => {
      const session = await loginWithCredentials(credentials)

      if (!session) {
        return false
      }

      set(writeSession(session, null))
      return true
    },

    register: async (credentials): Promise<boolean> => {
      const session = await registerWithCredentials(credentials)

      if (!session) {
        return false
      }

      set(writeSession(session, null))
      return true
    },

    logout: () => {
      void logoutFromApi()

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        impersonator: null,
      })
    },

    applySession: (session) => {
      set(writeSession(session, get().impersonator))
    },

    startImpersonation: (session) => {
      const current = get()
      const impersonator = current.impersonator ?? (
        current.user && current.accessToken
          ? { user: current.user, accessToken: current.accessToken }
          : null
      )
      set(writeSession(session, impersonator))
    },

    stopImpersonating: () => {
      const impersonator = get().impersonator
      if (!impersonator) {
        return
      }
      set(writeSession(impersonator, null))
    },

    setUser: (user) => {
      set({ user })
    },
  }),
)

export const authSelectors = {
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  user: (state: AuthState) => state.user,
  accessToken: (state: AuthState) => state.accessToken,
  impersonator: (state: AuthState) => state.impersonator,
}
