export function initializePreline(): void {
  if (typeof window === 'undefined' || !window.HSStaticMethods) {
    return
  }

  window.setTimeout(() => {
    window.HSStaticMethods.autoInit()
  }, 100)
}
