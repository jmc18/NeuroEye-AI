import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Icon } from '@components/ui'
import { ROUTES } from '@config'
import { useAuth } from '@hooks/useStore'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function UserMenu() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  if (!user) {
    return null
  }

  const handleSignOut = () => {
    setOpen(false)
    logout()
    void navigate({
      to: ROUTES.auth.login,
      search: { returnUrl: pathname },
    })
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ms-1 flex size-9 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container"
        aria-label={t('common.accountMenu')}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {getInitials(user.name)}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 z-40 mt-2 w-64 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-2 shadow-xl"
        >
          <div className="border-b border-outline-variant/30 px-3 py-2">
            <p className="truncate text-sm font-semibold text-on-surface">{user.name}</p>
            <p className="truncate font-data-mono text-xs text-on-surface-variant">{user.email}</p>
          </div>
          <Link
            to={ROUTES.app.profile}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high"
          >
            <Icon name="person" size={18} />
            {t('home.routes.profile')}
          </Link>
          <Link
            to={ROUTES.app.settings}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high"
          >
            <Icon name="settings" size={18} />
            {t('home.routes.settings')}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm text-error hover:bg-error/10"
          >
            <Icon name="logout" size={18} />
            {t('common.signOut')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
