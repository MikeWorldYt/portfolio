import type { CSSProperties } from 'react'

// Deterministic pseudo-random values so the stars keep their place between renders.
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

const stars = Array.from({ length: 70 }, (_, index) => {
  const size = 1 + seeded(index, 3) * 2.5
  return {
    left: `${seeded(index, 1) * 100}%`,
    top: `${seeded(index, 2) * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    filter: `blur(${seeded(index, 4) * 1.5}px)`,
    animationDuration: `${4 + seeded(index, 6) * 6}s`,
    animationDelay: `${-seeded(index, 7) * 10}s`,
    '--o': 0.15 + seeded(index, 5) * 0.65,
  } as CSSProperties
})

export function StarField() {
  return (
    <>
      {stars.map((style, index) => (
        <span key={index} className="lg-star" style={style} />
      ))}
    </>
  )
}
