import type { ReactNode } from 'react'
import { Link } from 'react-router'

type ButtonProps = {
  to: string
  variant?: 'primary' | 'outline' | 'light' | 'fx'
  children: ReactNode
}

const base =
  'inline-flex items-center gap-2 px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary: 'rounded-lg bg-indigo-600 text-white',
  outline: 'rounded-lg border border-indigo-600 text-indigo-600',
  light: 'rounded-lg bg-white text-indigo-600',
  fx: 'fx',
}

export function Button({ to, variant = 'primary', children }: ButtonProps) {
  const className = `${base} ${variants[variant]}`

  if (to.startsWith('#')) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}
