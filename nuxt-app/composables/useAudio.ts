let audioCtx: AudioContext | null = null

export function useAudio() {
  function playKeySound(enabled: boolean) {
    if (!enabled) return
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

    const ctx = audioCtx
    const now = ctx.currentTime

    // Short white-noise burst shaped like a typewriter key click
    const clickDuration = 0.012 + Math.random() * 0.006
    const sampleCount = Math.ceil(ctx.sampleRate * clickDuration)
    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < sampleCount; i++) {
      // Exponential decay envelope on white noise
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.25))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Band-pass to shape the "clack" frequency character
    const bandpass = ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.value = 2800 + Math.random() * 800
    bandpass.Q.value = 0.8

    // Quick high-freq transient adds the "tick" attack
    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 1200

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + clickDuration)

    noise.connect(highpass)
    highpass.connect(bandpass)
    bandpass.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + clickDuration)
  }

  return { playKeySound }
}
