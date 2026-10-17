import type { ContactValues } from './validateContact.ts'

export async function submitContact(values: ContactValues, token: string): Promise<void> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, token }),
  })
  if (!res.ok) throw new Error(`Contact request failed with ${res.status}`)
}
