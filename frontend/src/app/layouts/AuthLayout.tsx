import { Link, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Icon } from '@components/ui'
import { LanguageSwitcher } from '@components/layout/LanguageSwitcher'
import { ROUTES } from '@config'

export default function AuthLayout() {
  const { t } = useTranslation()

  return (
    <main className="neural-background relative flex min-h-screen items-center justify-center overflow-x-hidden p-6 md:p-12">
      <LanguageSwitcher variant="floating" />

      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-20">
        <svg className="absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#117533" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0092ab" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <circle cx="10%" cy="20%" fill="#117533" r="4" />
          <circle cx="20%" cy="50%" fill="#0092ab" r="3" />
          <circle cx="15%" cy="80%" fill="#117533" r="5" />
          <circle cx="85%" cy="15%" fill="#0092ab" r="6" />
          <circle cx="90%" cy="60%" fill="#117533" r="4" />
          <path
            d="M 10% 20% L 20% 50% L 15% 80%"
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
            <Icon name="visibility" filled size={28} />
          </span>
          <Link to={ROUTES.home} className="text-xl font-bold tracking-tight text-on-surface">
            {t('common.appName')}
          </Link>
          <p className="mt-1 text-label-caps uppercase tracking-widest text-on-surface-variant">
            {t('common.clinicalPlatform')}
          </p>
        </div>

        <div className="medical-card relative overflow-hidden rounded-xl p-6 md:p-8">
          <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-primary/20 to-transparent" />
          <Outlet />
        </div>
      </div>

      <footer className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-6 text-sm text-outline">
        <Link className="hover:text-primary" to={ROUTES.legal.privacyPolicy}>
          {t('common.privacyPolicy')}
        </Link>
        <Link className="hover:text-primary" to={ROUTES.legal.terms}>
          {t('common.termsOfService')}
        </Link>
        <span className="opacity-30">|</span>
        <span className="font-data-mono uppercase tracking-tighter">HIPAA</span>
      </footer>
    </main>
  )
}
