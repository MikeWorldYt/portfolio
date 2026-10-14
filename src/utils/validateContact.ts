export type ContactValues = {
  name: string
  email: string
  message: string
}

export type ContactErrorKey = 'required' | 'email' | 'tooShort'

export type ContactErrors = Partial<Record<keyof ContactValues, ContactErrorKey>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const minMessageLength = 10

export function validateContact({ name, email, message }: ContactValues): ContactErrors {
  const errors: ContactErrors = {}

  if (!name.trim()) errors.name = 'required'

  if (!email.trim()) errors.email = 'required'
  else if (!emailPattern.test(email.trim())) errors.email = 'email'

  if (!message.trim()) errors.message = 'required'
  else if (message.trim().length < minMessageLength) errors.message = 'tooShort'

  return errors
}
