// Lo-fi text placeholder that types itself out: the untyped rest is painted as grey bars along its own lines,
// so the bars sit exactly where the real text lands and the layout never reflows.
const bar =
  'text-transparent box-decoration-clone rounded-sm [background:linear-gradient(#6b7280,#6b7280)_0_55%/100%_0.75em_no-repeat]'

export function TypedText({ text, progress }: { text: string; progress: number }) {
  const count = Math.round(text.length * progress)
  const typing = progress > 0 && progress < 1

  return (
    <>
      {text.slice(0, count)}
      {typing && (
        <span aria-hidden="true" className="-mr-0.5 inline-block h-[1em] border-l-2 border-current align-[-0.12em]" />
      )}
      <span className={bar}>{text.slice(count)}</span>
    </>
  )
}
