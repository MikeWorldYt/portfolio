import type { ReactNode } from 'react'
import { Link } from 'react-router'

type ButtonProps = {
  to: string
  variant?: 'primary' | 'outline'
  children: ReactNode
}

const base =
  'inline-flex items-center gap-2 rounded-lg px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary: 'bg-indigo-600 text-white',
  outline: 'border border-indigo-600 text-indigo-600',
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
