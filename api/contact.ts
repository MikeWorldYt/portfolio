// Vercel function that verifies Turnstile and stores contact messages in Turso.
/// <reference types="node" />
import { createClient } from '@libsql/client'

const turnstileUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const minMessageLength = 10
const maxLength = { name: 200, email: 320, message: 5000 }
const rateLimit = { max: 5, windowMs: 10 * 60 * 1000 }

const turnstileTimeoutMs = 5000

class CaptchaUnavailable extends Error {}

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
  const res = await fetch(turnstileUrl, { method: 'POST', body, signal: AbortSignal.timeout(turnstileTimeoutMs) })
  if (!res.ok) throw new CaptchaUnavailable(`siteverify responded ${res.status}`)
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null
  if (!data) throw new CaptchaUnavailable('siteverify returned non-JSON')
  return data.success === true
}

const clientIp = (request: Request) =>
  request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null

const openDb = () => createClient({ url: process.env.TURSO_DATABASE_URL ?? '', authToken: process.env.TURSO_AUTH_TOKEN })

// Counts and records the attempt in one place so a burst cannot slip between check and insert.
async function isRateLimited(ip: string) {
  const db = openDb()
  await db.execute('CREATE TABLE IF NOT EXISTS rate_limits (ip TEXT NOT NULL, created_at INTEGER NOT NULL)')
  const since = Date.now() - rateLimit.windowMs
  await db.execute({ sql: 'DELETE FROM rate_limits WHERE created_at < ?', args: [since] })
  const result = await db.execute({
    sql: 'INSERT INTO rate_limits (ip, created_at) SELECT ?, ? WHERE (SELECT COUNT(*) FROM rate_limits WHERE ip = ?) < ?',
    args: [ip, Date.now(), ip, rateLimit.max],
  })
  return result.rowsAffected === 0
}

async function saveMessage(name: string, email: string, message: string) {
  const db = openDb()
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
    const ip = clientIp(request)
    if (ip && (await isRateLimited(ip))) return reply(429, 'rate_limited')
    if (!(await isHuman(token, ip))) return reply(403, 'captcha_failed')
    await saveMessage(name, email, message)
    return reply(200)
  } catch (error) {
    console.error('Contact request failed', error)
    if (error instanceof CaptchaUnavailable || (error instanceof Error && error.name === 'TimeoutError')) {
      return reply(503, 'captcha_unavailable')
    }
    return reply(500, 'server_error')
  }
}
