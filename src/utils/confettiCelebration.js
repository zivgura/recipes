import confetti from 'canvas-confetti'

/** Matches app theme — teal family + a warm accent */
const COLORS = [
  '#199485',
  '#3CB9AB',
  '#5DC5B5',
  '#b1e9df',
  '#e1f9f4',
  '#f0c14a',
  '#FCA978',
  '#DA7474'
]

const base = {
  zIndex: 1000,
  disableForReducedMotion: true,
  colors: COLORS
}

/**
 * Full-viewport confetti: center burst, side cannons, and a second wave from the top.
 */
export function fireCelebrationConfetti() {
  confetti({
    ...base,
    particleCount: 110,
    spread: 88,
    startVelocity: 50,
    origin: { x: 0.5, y: 0.38 },
    ticks: 320
  })

  const end = Date.now() + 200
  const tick = () => {
    confetti({
      ...base,
      particleCount: 20,
      angle: 62,
      spread: 80,
      origin: { x: 0, y: 0.62 },
    })
    confetti({
      ...base,
      particleCount: 20,
      angle: 118,
      spread: 80,
      origin: { x: 1, y: 0.62 },
    })
    if (Date.now() < end) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)

  setTimeout(() => {
    confetti({
      ...base,
      particleCount: 85,
      spread: 100,
      startVelocity: 36,
      origin: { x: 0.5, y: 0.22 },
      ticks: 280
    })
  }, 380)
}

export function resetConfetti() {
  confetti.reset()
}
