// Lets a background shape push "own" a click so the same click does not also auto-scroll.

// Content in front of the background keeps its own clicks.
export const contentSelector =
  'a, button, input, textarea, select, label, nav, footer, h1, h2, h3, h4, p, img, svg, [role="img"], .fx, .lg-tile'

let claimedAt = -Infinity

export function claimPointer() {
  claimedAt = performance.now()
}

export function wasPointerClaimed() {
  return performance.now() - claimedAt < 500
}
