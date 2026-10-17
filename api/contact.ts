// Vercel function that verifies Turnstile and stores contact messages in Turso.
import { createClient } from '@libsql/client'
import { validateContact } from '../src/utils/validateContact.ts'
import type { ContactValues } from '../src/utils/validateContact.ts'

const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const maxLength = { name: 200, email: 320, message: 5000 }

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const tableReady = db.execute(
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
)

const reply = (status: number, error?: string) =>
  Response.json(error ? { error } : { ok: true }, { status })

async function isHuman(token: string, ip: string | null) {
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY ?? '', response: token })
  if (ip) body.set('remoteip', ip)
  const res = await fetch(turnstileUrl, { method: 'POST', body })
  const data = (await res.json()) as { success: boolean }
  return data.success
}

export async function POST(request: Request) {
  let payload: Partial<ContactValues> & { token?: string }
  try {
    payload = await request.json()
  } catch {
    return reply(400, 'invalid_json')
  }

  const { name = '', email = '', message = '', token = '' } = payload
  const values = { name, email, message }

  const fieldsOk = Object.entries(maxLength).every(
    ([key, max]) => typeof values[key as keyof ContactValues] === 'string' && values[key as keyof ContactValues].length <= max,
  )
  if (!fieldsOk || Object.keys(validateContact(values)).length > 0) return reply(400, 'invalid_fields')
  if (!token) return reply(400, 'missing_token')

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    if (!(await isHuman(token, ip))) return reply(403, 'captcha_failed')

    await tableReady
    await db.execute({
      sql: 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
      args: [name.trim(), email.trim(), message.trim()],
    })
    return reply(200)
  } catch (error) {
    console.error('Contact store failed', error)
    return reply(500, 'server_error')
  }
}
