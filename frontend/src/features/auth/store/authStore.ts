import { createPersistedStore } from '@/store/createPersistedStore'

import { loginWithCredentials, logoutFromApi, persistAccessToken } from '../services/authService'
import type { AuthState } from '../types/auth'

export const useAuthStore = createPersistedStore<AuthState>(
  {
    name: 'auth',
    partialize: (state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      accessToken: state.accessToken,
    }),
  },
  (set) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,

    login: async (credentials) => {
      const session = await loginWithCredentials(credentials)

      persistAccessToken(session.accessToken)

      set({
        isAuthenticated: true,
        user: session.user,
        accessToken: session.accessToken,
      })
    },

    logout: () => {
      void logoutFromApi()

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
      })
    },
  }),
)

export const authSelectors = {
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  user: (state: AuthState) => state.user,
  accessToken: (state: AuthState) => state.accessToken,
}
