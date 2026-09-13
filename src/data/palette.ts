/**
 * YARN palette — mirrored from Client for visual consistency.
 */
export const palette = {
  ivory: '#f7f3eb',
  cream: '#f5f0e8',
  offWhite: '#faf7f2',
  surface: '#fffcf7',
  mutedPink: '#c9a9a6',
  dustyRose: '#b76e79',
  terracotta: '#c4785a',
  warmBrown: '#8b7355',
  sage: '#a8b5a0',
  butter: '#e8d5a3',
  ink: '#3d3229',
  inkSoft: '#5c4a3a',
  heroDeep: '#efe6d8',
} as const

export type PaletteKey = keyof typeof palette

export const paletteCssVars: Record<PaletteKey, string> = {
  ivory: '--color-ivory',
  cream: '--color-cream',
  offWhite: '--color-off-white',
  surface: '--color-surface',
  mutedPink: '--color-muted-pink',
  dustyRose: '--color-dusty-rose',
  terracotta: '--color-terracotta',
  warmBrown: '--color-warm-brown',
  sage: '--color-sage',
  butter: '--color-butter',
  ink: '--color-ink',
  inkSoft: '--color-ink-soft',
  heroDeep: '--color-hero-deep',
}

export function applyPaletteToDom(
  overrides: Partial<Record<PaletteKey, string>> = {},
): void {
  const root = document.documentElement
  ;(Object.keys(palette) as PaletteKey[]).forEach((key) => {
    root.style.setProperty(paletteCssVars[key], overrides[key] ?? palette[key])
  })
}
