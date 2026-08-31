import { useAuthStore, authSelectors } from '@features/auth/store/authStore'
import {
  useLocaleStore,
  localeSelectors,
  useUiStore,
  uiSelectors,
} from '@store'

export function useAuth() {
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated)
  const user = useAuthStore(authSelectors.user)
  const accessToken = useAuthStore(authSelectors.accessToken)
  const impersonator = useAuthStore(authSelectors.impersonator)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)
  const applySession = useAuthStore((state) => state.applySession)
  const startImpersonation = useAuthStore((state) => state.startImpersonation)
  const stopImpersonating = useAuthStore((state) => state.stopImpersonating)
  const setUser = useAuthStore((state) => state.setUser)

  return {
    isAuthenticated,
    user,
    accessToken,
    impersonator,
    login,
    register,
    logout,
    applySession,
    startImpersonation,
    stopImpersonating,
    setUser,
  }
}

export function useLocale() {
  const locale = useLocaleStore(localeSelectors.locale)
  const setLocale = useLocaleStore((state) => state.setLocale)

  return { locale, setLocale }
}

export function useUi() {
  const theme = useUiStore(uiSelectors.theme)
  const emailNotifications = useUiStore(uiSelectors.emailNotifications)
  const sidebarCollapsed = useUiStore(uiSelectors.sidebarCollapsed)
  const setTheme = useUiStore((state) => state.setTheme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const setEmailNotifications = useUiStore((state) => state.setEmailNotifications)
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed)

  return {
    theme,
    emailNotifications,
    sidebarCollapsed,
    setTheme,
    toggleTheme,
    setEmailNotifications,
    setSidebarCollapsed,
  }
}
