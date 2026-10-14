import type { ContactValues } from './validateContact.ts'

// Placeholder until a provider (Formspree, mailto, etc.) is chosen; swap only this body.
export async function submitContact(_values: ContactValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))
}
