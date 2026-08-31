type CalibrationDotProps = {
  x: number
  y: number
  label?: string
}

export function CalibrationDot({ x, y, label }: CalibrationDotProps) {
  return (
    <div
      className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/80 shadow-[0_0_16px_var(--color-primary)]"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      {label ? (
        <span className="absolute left-1/2 top-7 -translate-x-1/2 text-[10px] uppercase tracking-widest text-primary">
          {label}
        </span>
      ) : null}
    </div>
  )
}
