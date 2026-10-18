// Tiny zero-gravity sim for the background shapes: every body is a capsule (a circle has zero length).

export type Body = {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  spin: number
  radius: number
  halfLength: number
  invMass: number
  invInertia: number
  energy: number
  phase: number
}

type Point = { x: number; y: number }

const restitution = 0.85
const driftSpeed = 9
const driftSpin = 0.04
const settleRate = 0.8
const energizedSeconds = 3

export function createBody(width: number, height: number, x: number, y: number, phase: number): Body {
  const radius = Math.min(width, height) / 2
  const mass = (width * height) / 1000
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle: 0,
    spin: 0,
    radius,
    halfLength: Math.max(0, (width - height) / 2),
    invMass: 1 / mass,
    invInertia: 12 / (mass * (width * width + height * height)),
    energy: 0,
    phase,
  }
}

function endpoints(body: Body): [Point, Point] {
  const dx = Math.cos(body.angle) * body.halfLength
  const dy = Math.sin(body.angle) * body.halfLength
  return [
    { x: body.x - dx, y: body.y - dy },
    { x: body.x + dx, y: body.y + dy },
  ]
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

// Closest points between two segments (Ericson, Real-Time Collision Detection 5.1.9).
function closestPoints(p1: Point, q1: Point, p2: Point, q2: Point): [Point, Point] {
  const d1 = { x: q1.x - p1.x, y: q1.y - p1.y }
  const d2 = { x: q2.x - p2.x, y: q2.y - p2.y }
  const r = { x: p1.x - p2.x, y: p1.y - p2.y }
  const a = d1.x * d1.x + d1.y * d1.y
  const e = d2.x * d2.x + d2.y * d2.y
  const f = d2.x * r.x + d2.y * r.y
  let s = 0
  let t = 0

  if (a > 1e-6 || e > 1e-6) {
    if (a <= 1e-6) {
      t = clamp01(f / e)
    } else {
      const c = d1.x * r.x + d1.y * r.y
      if (e <= 1e-6) {
        s = clamp01(-c / a)
      } else {
        const b = d1.x * d2.x + d1.y * d2.y
        const denom = a * e - b * b
        s = denom !== 0 ? clamp01((b * f - c * e) / denom) : 0
        t = (b * s + f) / e
        if (t < 0) {
          t = 0
          s = clamp01(-c / a)
        } else if (t > 1) {
          t = 1
          s = clamp01((b - c) / a)
        }
      }
    }
  }

  return [
    { x: p1.x + d1.x * s, y: p1.y + d1.y * s },
    { x: p2.x + d2.x * t, y: p2.y + d2.y * t },
  ]
}

const cross = (ax: number, ay: number, bx: number, by: number) => ax * by - ay * bx

// Impulse along normal n at contact c; `other` is null for a wall (infinite mass).
function applyContact(body: Body, other: Body | null, c: Point, nx: number, ny: number) {
  const ra = { x: c.x - body.x, y: c.y - body.y }
  const rb = other ? { x: c.x - other.x, y: c.y - other.y } : { x: 0, y: 0 }
  const va = { x: body.vx - body.spin * ra.y, y: body.vy + body.spin * ra.x }
  const vb = other ? { x: other.vx - other.spin * rb.y, y: other.vy + other.spin * rb.x } : { x: 0, y: 0 }
  const closing = (va.x - vb.x) * nx + (va.y - vb.y) * ny
  if (closing >= 0) return

  const raN = cross(ra.x, ra.y, nx, ny)
  const rbN = cross(rb.x, rb.y, nx, ny)
  const denom =
    body.invMass + body.invInertia * raN * raN + (other ? other.invMass + other.invInertia * rbN * rbN : 0)
  const j = (-(1 + restitution) * closing) / denom

  body.vx += j * nx * body.invMass
  body.vy += j * ny * body.invMass
  body.spin += j * raN * body.invInertia
  if (other) {
    other.vx -= j * nx * other.invMass
    other.vy -= j * ny * other.invMass
    other.spin -= j * rbN * other.invInertia
  }
}

function collide(a: Body, b: Body) {
  const [a1, a2] = endpoints(a)
  const [b1, b2] = endpoints(b)
  const [ca, cb] = closestPoints(a1, a2, b1, b2)
  let dx = ca.x - cb.x
  let dy = ca.y - cb.y
  let distance = Math.hypot(dx, dy)
  const overlap = a.radius + b.radius - distance
  if (overlap <= 0) return

  if (distance < 1e-6) {
    dx = a.x - b.x || 1
    dy = a.y - b.y
    distance = Math.hypot(dx, dy)
  }
  const nx = dx / distance
  const ny = dy / distance
  const share = a.invMass / (a.invMass + b.invMass)
  a.x += nx * overlap * share
  a.y += ny * overlap * share
  b.x -= nx * overlap * (1 - share)
  b.y -= ny * overlap * (1 - share)

  applyContact(a, b, { x: cb.x + nx * b.radius, y: cb.y + ny * b.radius }, nx, ny)
  a.energy = Math.max(a.energy, energizedSeconds * 0.6)
  b.energy = Math.max(b.energy, energizedSeconds * 0.6)
}

function bounceWalls(body: Body, width: number, height: number) {
  for (const point of endpoints(body)) {
    const walls: [number, number, number, number, number][] = [
      [body.radius - point.x, 1, 0, point.x - body.radius, point.y],
      [point.x + body.radius - width, -1, 0, point.x + body.radius, point.y],
      [body.radius - point.y, 0, 1, point.x, point.y - body.radius],
      [point.y + body.radius - height, 0, -1, point.x, point.y + body.radius],
    ]
    for (const [depth, nx, ny, cx, cy] of walls) {
      if (depth <= 0) continue
      body.x += nx * depth
      body.y += ny * depth
      applyContact(body, null, { x: cx, y: cy }, nx, ny)
    }
  }
}

// Advances the world; collisions only happen when a pushed (energized) body is involved,
// so idle shapes may drift over each other like layers in space.
export function step(bodies: Body[], dt: number, time: number, width: number, height: number) {
  const settle = Math.min(1, settleRate * dt)
  for (const body of bodies) {
    const targetVx = Math.sin(time * 0.11 + body.phase) * driftSpeed
    const targetVy = Math.cos(time * 0.07 + body.phase * 1.7) * driftSpeed
    body.vx += (targetVx - body.vx) * settle
    body.vy += (targetVy - body.vy) * settle
    body.spin += (Math.sin(time * 0.05 + body.phase) * driftSpin - body.spin) * settle * 0.6
    body.x += body.vx * dt
    body.y += body.vy * dt
    body.angle += body.spin * dt
    body.energy = Math.max(0, body.energy - dt)
  }

  for (let i = 0; i < bodies.length; i++) {
    for (let k = i + 1; k < bodies.length; k++) {
      if (bodies[i].energy > 0 || bodies[k].energy > 0) collide(bodies[i], bodies[k])
    }
  }

  for (const body of bodies) bounceWalls(body, width, height)
}

export function hitTest(body: Body, x: number, y: number) {
  const [p, q] = endpoints(body)
  const [, onSegment] = closestPoints({ x, y }, { x, y }, p, q)
  return Math.hypot(x - onSegment.x, y - onSegment.y) <= body.radius
}

// Click impulse: away from the click point, applied off-centre so pills spin.
export function push(body: Body, x: number, y: number) {
  let nx = body.x - x
  let ny = body.y - y
  const distance = Math.hypot(nx, ny) || 1
  nx /= distance
  ny /= distance
  const strength = 900 / Math.sqrt(body.invMass)
  const rx = x - body.x
  const ry = y - body.y
  body.vx += nx * strength * body.invMass
  body.vy += ny * strength * body.invMass
  body.spin += cross(rx, ry, nx * strength, ny * strength) * body.invInertia * 0.3
  body.energy = energizedSeconds
}
