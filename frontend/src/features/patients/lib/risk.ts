import type { StatusTone } from '@components/ui'

export function riskTone(level: string): StatusTone {
  if (level === 'critical') return 'critical'
  if (level === 'high') return 'warning'
  if (level === 'moderate') return 'info'
  return 'success'
}
