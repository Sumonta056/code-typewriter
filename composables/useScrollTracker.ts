import { onScopeDispose } from 'vue'

export function useScrollTracker() {
  let rafId = 0

  onScopeDispose(() => {
    cancelAnimationFrame(rafId)
  })

  function scrollToIndex(containerEl: HTMLElement | null, charEls: HTMLElement[], index: number) {
    if (!containerEl || index >= charEls.length) return

    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      const el = charEls[index]
      if (!el) return
      const r = el.getBoundingClientRect()
      const cr = containerEl.getBoundingClientRect()

      const topMargin = 50
      const bottomMargin = 50
      const leftMargin = 80
      const rightMargin = 40

      if (r.top < cr.top + topMargin) {
        containerEl.scrollTop -= cr.top + topMargin - r.top
      } else if (r.bottom > cr.bottom - bottomMargin) {
        containerEl.scrollTop += r.bottom - cr.bottom + bottomMargin
      }

      if (r.left < cr.left + leftMargin) {
        containerEl.scrollLeft -= cr.left + leftMargin - r.left
      } else if (r.right > cr.right - rightMargin) {
        containerEl.scrollLeft += r.right - cr.right + rightMargin
      }
    })
  }

  return { scrollToIndex }
}
