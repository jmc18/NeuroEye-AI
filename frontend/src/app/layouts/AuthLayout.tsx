import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <main className="bg-background text-on-surface font-body-md min-h-screen neural-background flex items-center justify-center p-6 md:p-12 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#117533" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0092ab" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <circle cx="10%" cy="20%" fill="#117533" r="4"></circle>
          <circle cx="20%" cy="50%" fill="#0092ab" r="3"></circle>
          <circle cx="15%" cy="80%" fill="#117533" r="5"></circle>
          <circle cx="85%" cy="15%" fill="#0092ab" r="6"></circle>
          <circle cx="90%" cy="60%" fill="#117533" r="4"></circle>
          <path
            d="M 10% 20% L 20% 50% L 15% 80%"
            fill="none"
            stroke="url(#lineGrad)"
            stroke-width="1"
          ></path>
          <path
            d="M 85% 15% L 90% 60% L 80% 90%"
            fill="none"
            stroke="url(#lineGrad)"
            stroke-width="1"
          ></path>
          <circle
            cx="50%"
            cy="50%"
            fill="url(#lineGrad)"
            opacity="0.05"
            r="300"
          ></circle>
        </svg>
      </div>
      <>
        <Outlet />
      </>
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 text-outline text-sm">
        <a className="hover:text-[#117533] transition-colors" href="#">
          {t('common.privacyPolicy')}
        </a>
        <a className="hover:text-[#117533] transition-colors" href="#">
          {t('common.contactSupport')}
        </a>
        <span className="opacity-30">|</span>
        <span className="font-mono uppercase tracking-tighter">
          V4.2.0-Alpha
        </span>
      </footer>
    </main>
  );
}
