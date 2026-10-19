import type { ChangeEvent } from 'react'

type ContactFieldProps = {
  name: string
  label: string
  value: string
  error?: string
  type?: string
  autoComplete?: string
  multiline?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const inputClass = 'fx w-full px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2'

export function ContactField({
  name,
  label,
  value,
  error,
  type = 'text',
  autoComplete,
  multiline,
  onChange,
}: ContactFieldProps) {
  const id = `contact-${name}`
  const errorId = `${id}-error`
  const shared = {
    id,
    name,
    value,
    onChange,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: inputClass,
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {label}
      </label>
      {multiline ? <textarea rows={6} {...shared} /> : <input type={type} {...shared} />}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-700 in-data-[theme=dark]:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
