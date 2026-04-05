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

      // Extra vertical padding so the cursor sits in the middle third
      const topMargin = 80
      const bottomMargin = 80
      const leftMargin = 80
      const rightMargin = 40

      const needsScrollV = r.top < cr.top + topMargin || r.bottom > cr.bottom - bottomMargin
      const needsScrollH = r.left < cr.left + leftMargin || r.right > cr.right - rightMargin

      if (needsScrollV || needsScrollH) {
        let targetTop = containerEl.scrollTop
        let targetLeft = containerEl.scrollLeft

        if (r.top < cr.top + topMargin) {
          targetTop -= cr.top + topMargin - r.top
        } else if (r.bottom > cr.bottom - bottomMargin) {
          targetTop += r.bottom - cr.bottom + bottomMargin
        }

        if (r.left < cr.left + leftMargin) {
          targetLeft -= cr.left + leftMargin - r.left
        } else if (r.right > cr.right - rightMargin) {
          targetLeft += r.right - cr.right + rightMargin
        }

        containerEl.scrollTo({
          top: targetTop,
          left: targetLeft,
          behavior: 'smooth',
        })
      }
    })
  }

  return { scrollToIndex }
}
