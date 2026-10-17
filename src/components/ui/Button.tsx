import type { ReactNode } from 'react'
import { Link } from 'react-router'

type ButtonProps = {
  to: string
  variant?: 'primary' | 'outline' | 'light' | 'fx'
  size?: 'md' | 'lg'
  children: ReactNode
}

const base =
  'inline-flex items-center gap-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2'

const sizes = {
  md: 'px-5 py-3',
  lg: 'px-8 py-4 text-lg',
}

const variants = {
  primary: 'rounded-lg bg-indigo-600 text-white',
  outline:
    'rounded-lg border border-indigo-600 text-indigo-600 in-data-[theme=dark]:border-indigo-300 in-data-[theme=dark]:text-indigo-300',
  light: 'rounded-lg bg-white text-indigo-600',
  fx: 'fx',
}

export function Button({ to, variant = 'primary', size = 'md', children }: ButtonProps) {
  const className = `${base} ${sizes[size]} ${variants[variant]}`

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
