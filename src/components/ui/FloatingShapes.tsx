import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts'
import { createBody, hitTest, push, step } from '../../utils/spacePhysics.ts'
import type { Body } from '../../utils/spacePhysics.ts'

const shapes = [
  { id: 'green', width: 160, height: 64, x: 0.12, y: 0.1 },
  { id: 'orange', width: 110, height: 110, x: 0.88, y: 0.33 },
  { id: 'bar', width: 150, height: 44, x: 0.5, y: 0.5 },
  { id: 'blue', width: 170, height: 40, x: 0.16, y: 0.86 },
  { id: 'cyan', width: 80, height: 80, x: 0.62, y: 0.9 },
]

// Content in front of a shape keeps its own click; only bare background reaches the shapes.
const blocking = 'a, button, input, textarea, select, label, nav, footer, h1, h2, h3, h4, p, img, svg, [role="img"], .fx, .lg-tile'

function render(element: HTMLSpanElement | null, body: Body, width: number, height: number) {
  if (!element) return
  element.style.transform = `translate(${body.x - width / 2}px, ${body.y - height / 2}px) rotate(${body.angle}rad)`
}

export function FloatingShapes({ active }: { active: boolean }) {
  const elementsRef = useRef<(HTMLSpanElement | null)[]>([])
  const bodiesRef = useRef<Body[]>([])
  const reduceMotion = usePrefersReducedMotion()

  if (bodiesRef.current.length === 0) {
    bodiesRef.current = shapes.map((shape, index) =>
      createBody(shape.width, shape.height, shape.x * window.innerWidth, shape.y * window.innerHeight, index * 1.9),
    )
  }

  useEffect(() => {
    bodiesRef.current.forEach((body, index) => render(elementsRef.current[index], body, shapes[index].width, shapes[index].height))
    if (!active || reduceMotion) return

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000)
      last = now
      step(bodiesRef.current, dt, now / 1000, window.innerWidth, window.innerHeight)
      bodiesRef.current.forEach((body, index) => render(elementsRef.current[index], body, shapes[index].width, shapes[index].height))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const shapeAt = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest(blocking)) return undefined
      return bodiesRef.current.find((body) => hitTest(body, event.clientX, event.clientY))
    }
    const onDown = (event: PointerEvent) => {
      const body = shapeAt(event)
      if (body) push(body, event.clientX, event.clientY)
    }
    const onMove = (event: PointerEvent) => {
      document.body.style.cursor = shapeAt(event) ? 'pointer' : ''
    }

    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      document.body.style.cursor = ''
    }
  }, [active, reduceMotion])

  return (
    <div className="lg-shapes">
      {shapes.map((shape, index) => (
        <span
          key={shape.id}
          ref={(element) => {
            elementsRef.current[index] = element
          }}
          className={`lg-shape lg-shape--${shape.id}`}
          style={{ width: shape.width, height: shape.height }}
        />
      ))}
    </div>
  )
}
