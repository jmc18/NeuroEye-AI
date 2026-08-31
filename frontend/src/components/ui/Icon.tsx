import { cn } from '@lib/utils'

type IconProps = {
  name: string
  className?: string
  filled?: boolean
  size?: number
}

/** Material Symbols Outlined icon used across the clinical UI. */
export function Icon({ name, className, filled = false, size }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined shrink-0', className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        fontSize: size ? `${size}px` : undefined,
      }}
      aria-hidden
    >
      {name}
    </span>
  )
}
