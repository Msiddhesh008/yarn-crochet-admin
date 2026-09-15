/** Web storefront crop ratios (match Client CSS aspect-ratio rules). */
export const IMAGE_ASPECTS = {
  product: { ratio: 4 / 5, label: '4∶5', hint: 'Product cards & shop grid' },
  hero: {
    ratio: undefined,
    label: 'Freeform',
    hint: 'Home hero media — crop freely to suit the frame',
  },
  maker: { ratio: 3 / 4, label: '3∶4', hint: 'Maker portrait frame' },
  gallery: { ratio: 4 / 5, label: '4∶5', hint: 'Studio notes gallery' },
  process: { ratio: 1, label: '1∶1', hint: 'Process step visual' },
  logo: { ratio: 8 / 5, label: '8∶5', hint: 'Brand logo' },
  qr: { ratio: 1, label: '1∶1', hint: 'Instagram QR' },
} as const

export type ImageAspectKey = keyof typeof IMAGE_ASPECTS

export type ImageAspectMeta = {
  ratio: number | undefined
  label: string
  hint: string
}
