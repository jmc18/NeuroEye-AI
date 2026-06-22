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
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  return { isAuthenticated, user, accessToken, login, logout }
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
