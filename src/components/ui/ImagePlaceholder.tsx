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
      className={`grid place-items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-200 text-gray-500 ${className}`}
    >
      {children}
    </div>
  )
}
