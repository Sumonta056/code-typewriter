import { onScopeDispose } from 'vue'
import {
  SCROLL_MARGIN_BOTTOM,
  SCROLL_MARGIN_LEFT,
  SCROLL_MARGIN_RIGHT,
  SCROLL_MARGIN_TOP,
} from '~/utils/constants'

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

      const needsScrollV =
        r.top < cr.top + SCROLL_MARGIN_TOP || r.bottom > cr.bottom - SCROLL_MARGIN_BOTTOM
      const needsScrollH =
        r.left < cr.left + SCROLL_MARGIN_LEFT || r.right > cr.right - SCROLL_MARGIN_RIGHT

      if (needsScrollV || needsScrollH) {
        let targetTop = containerEl.scrollTop
        let targetLeft = containerEl.scrollLeft

        if (r.top < cr.top + SCROLL_MARGIN_TOP) {
          targetTop -= cr.top + SCROLL_MARGIN_TOP - r.top
        } else if (r.bottom > cr.bottom - SCROLL_MARGIN_BOTTOM) {
          targetTop += r.bottom - cr.bottom + SCROLL_MARGIN_BOTTOM
        }

        if (r.left < cr.left + SCROLL_MARGIN_LEFT) {
          targetLeft -= cr.left + SCROLL_MARGIN_LEFT - r.left
        } else if (r.right > cr.right - SCROLL_MARGIN_RIGHT) {
          targetLeft += r.right - cr.right + SCROLL_MARGIN_RIGHT
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
