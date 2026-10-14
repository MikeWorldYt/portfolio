import type { ReactNode } from 'react'

type ImagePlaceholderProps = {
  label: string
  className?: string
  children?: ReactNode
}

export function ImagePlaceholder({ label, className = '', children }: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`fx-ph relative grid place-items-center overflow-hidden ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        stroke="var(--bd)"
        strokeWidth="1.5"
        className="absolute inset-0 size-full opacity-(--x) transition-opacity duration-700 motion-reduce:transition-none"
      >
        <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative opacity-[calc(1_-_var(--x))] transition-opacity duration-700 motion-reduce:transition-none">
        {children}
      </span>
    </div>
  )
}
