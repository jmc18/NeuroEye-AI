import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@lib/utils'

import { Icon } from './Icon'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'cta'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  children?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-container text-on-primary-container hover:opacity-90 active:scale-[0.98]',
  secondary:
    'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-high',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high',
  destructive:
    'bg-error/10 text-error border border-error/30 hover:bg-error/20',
  cta: 'bg-primary-container text-on-primary-container font-label-caps tracking-widest uppercase hover:opacity-90',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-body-md',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </button>
  )
}
