import type { Dictionary } from './types.ts'

function setContent(selector: string, value: string) {
  document.querySelector(selector)?.setAttribute('content', value)
}

export function applyMeta({ title, description }: Dictionary['meta']) {
  document.title = title
  setContent('meta[name="description"]', description)
  setContent('meta[property="og:title"]', title)
  setContent('meta[property="og:description"]', description)
}
