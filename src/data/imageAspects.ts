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

/** Presets for universal / gallery cropper — covers every site frame. */
export type CropRatioPreset = {
  id: string
  label: string
  /** null = use media natural aspect */
  value: number | null
  hint: string
}

export const SITE_CROP_PRESETS: CropRatioPreset[] = [
  {
    id: 'original',
    label: 'Original',
    value: null,
    hint: 'Hero / freeform',
  },
  {
    id: '4-5',
    label: '4∶5',
    value: 4 / 5,
    hint: 'Products, shop grid, Studio Notes',
  },
  {
    id: '3-4',
    label: '3∶4',
    value: 3 / 4,
    hint: 'Maker portrait',
  },
  {
    id: '1-1',
    label: '1∶1',
    value: 1,
    hint: 'Process steps, Instagram QR',
  },
  {
    id: '8-5',
    label: '8∶5',
    value: 8 / 5,
    hint: 'Brand logo',
  },
  {
    id: '16-9',
    label: '16∶9',
    value: 16 / 9,
    hint: 'Wide banner for admin',
  },
]
