// Vercel function that verifies Turnstile and stores contact messages in Turso.
import { createClient } from '@libsql/client'

const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const minMessageLength = 10
const maxLength = { name: 200, email: 320, message: 5000 }

const reply = (status: number, error?: string) =>
  Response.json(error ? { error } : { ok: true }, { status })

// Own copy of the client rules: importing src/ from a function breaks ESM resolution on Vercel.
function isValid(name: string, email: string, message: string) {
  const [n, e, m] = [name.trim(), email.trim(), message.trim()]
  return (
    n.length > 0 &&
    emailPattern.test(e) &&
    m.length >= minMessageLength &&
    name.length <= maxLength.name &&
    email.length <= maxLength.email &&
    message.length <= maxLength.message
  )
}

async function isHuman(token: string, ip: string | null) {
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY ?? '', response: token })
  if (ip) body.set('remoteip', ip)
  const res = await fetch(turnstileUrl, { method: 'POST', body })
  const data = (await res.json()) as { success: boolean }
  return data.success
}

async function saveMessage(name: string, email: string, message: string) {
  const db = createClient({ url: process.env.TURSO_DATABASE_URL ?? '', authToken: process.env.TURSO_AUTH_TOKEN })
  await db.execute(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  )
  await db.execute({
    sql: 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
    args: [name.trim(), email.trim(), message.trim()],
  })
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return reply(400, 'invalid_json')
  }

  const { name, email, message, token } = payload
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' || !isValid(name, email, message)) {
    return reply(400, 'invalid_fields')
  }
  if (typeof token !== 'string' || !token) return reply(400, 'missing_token')

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    if (!(await isHuman(token, ip))) return reply(403, 'captcha_failed')
    await saveMessage(name, email, message)
    return reply(200)
  } catch (error) {
    console.error('Contact store failed', error)
    return reply(500, 'server_error')
  }
}
