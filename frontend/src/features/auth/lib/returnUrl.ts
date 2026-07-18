import { ROUTES } from '@config'

export function isSafeInternalPath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//')
}

export function resolveReturnUrl(
  returnUrl: string | undefined,
  fallback = ROUTES.app.dashboard,
): string {
  if (returnUrl && isSafeInternalPath(returnUrl)) {
    return returnUrl
  }
  return fallback
}

type NavigateFn = (options: {
  to: string
  search?: Record<string, string>
}) => Promise<void> | void

export function navigateToReturnUrl(
  navigate: NavigateFn,
  returnUrl: string | undefined,
  fallback = ROUTES.app.dashboard,
): void {
  const target = resolveReturnUrl(returnUrl, fallback)
  const url = new URL(target, 'http://localhost')
  const search = Object.fromEntries(url.searchParams.entries())

  void navigate({
    to: url.pathname,
    ...(Object.keys(search).length > 0 ? { search } : {}),
  })
}
