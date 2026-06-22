import i18n from '@lib/i18n/config'
import { createPersistedStore } from './createPersistedStore'
import {
  DEFAULT_LOCALE,
  type SupportedLocale,
  SUPPORTED_LOCALES,
} from '@locales/types'

function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

function applyDocumentLocale(locale: SupportedLocale): void {
  document.documentElement.lang = locale
}

type LocaleState = {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
}

export const useLocaleStore = createPersistedStore<LocaleState>(
  {
    name: 'locale',
    partialize: (state) => ({ locale: state.locale }),
    onRehydrateStorage: (state) => {
      const locale =
        state?.locale && isSupportedLocale(state.locale) ? state.locale : DEFAULT_LOCALE

      void i18n.changeLanguage(locale)
      applyDocumentLocale(locale)
    },
  },
  (set) => ({
    locale: DEFAULT_LOCALE,
    setLocale: (locale) => {
      void i18n.changeLanguage(locale)
      applyDocumentLocale(locale)
      set({ locale })
    },
  }),
)

export const localeSelectors = {
  locale: (state: LocaleState) => state.locale,
}

export { DEFAULT_LOCALE, SUPPORTED_LOCALES }
export type { SupportedLocale }
