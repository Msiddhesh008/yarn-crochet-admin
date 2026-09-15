export const CONTENT_SECTION_KEYS = [
  'brand',
  'hero',
  'collection',
  'stitchStory',
  'maker',
  'process',
  'featuredShowcase',
  'customOrder',
  'gallery',
  'testimonials',
  'shopPage',
  'aboutPage',
  'customPage',
  'footer',
  'instagram',
  'handmadeNote',
] as const

export type ContentSectionKey = (typeof CONTENT_SECTION_KEYS)[number]
