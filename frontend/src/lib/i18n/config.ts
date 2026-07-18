import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@locales/en'
import es from '@locales/es'
import { DEFAULT_LOCALE } from '@locales/types'

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
