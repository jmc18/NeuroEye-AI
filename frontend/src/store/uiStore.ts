import { createPersistedStore } from './createPersistedStore'

export type ThemeMode = 'light' | 'dark'

type UiState = {
  theme: ThemeMode
  emailNotifications: boolean
  sidebarCollapsed: boolean
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setEmailNotifications: (enabled: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export const useUiStore = createPersistedStore<UiState>(
  {
    name: 'ui',
    partialize: (state) => ({
      theme: state.theme,
      emailNotifications: state.emailNotifications,
      sidebarCollapsed: state.sidebarCollapsed,
    }),
    onRehydrateStorage: (state) => {
      applyTheme(state?.theme ?? 'light')
    },
  },
  (set, get) => ({
    theme: 'light',
    emailNotifications: true,
    sidebarCollapsed: false,

    setTheme: (theme) => {
      applyTheme(theme)
      set({ theme })
    },

    toggleTheme: () => {
      const theme = get().theme === 'dark' ? 'light' : 'dark'
      applyTheme(theme)
      set({ theme })
    },

    setEmailNotifications: (enabled) => {
      set({ emailNotifications: enabled })
    },

    setSidebarCollapsed: (collapsed) => {
      set({ sidebarCollapsed: collapsed })
    },
  }),
)

export const uiSelectors = {
  theme: (state: UiState) => state.theme,
  emailNotifications: (state: UiState) => state.emailNotifications,
  sidebarCollapsed: (state: UiState) => state.sidebarCollapsed,
}
