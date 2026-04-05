export function useKeyboardHandler(getTabSize: () => number = () => 2) {
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
      const spaces = ' '.repeat(getTabSize())
      for (const ch of spaces) {
        callbacks.onChar(ch)
      }
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
