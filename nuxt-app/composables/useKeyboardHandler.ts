export function useKeyboardHandler() {
  function handleKeyDown(
    e: KeyboardEvent,
    callbacks: {
      onChar: (char: string) => void
      onBackspace: () => void
      isDisabled: () => boolean
    },
  ) {
    if (callbacks.isDisabled()) return

    if (e.key === 'Tab') {
      e.preventDefault()
      callbacks.onChar('\t')
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      callbacks.onChar('\n')
      return
    }

    if (e.key === 'Backspace') {
      e.preventDefault()
      callbacks.onBackspace()
      return
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key.length > 1) return

    e.preventDefault()
    callbacks.onChar(e.key)
  }

  return { handleKeyDown }
}
