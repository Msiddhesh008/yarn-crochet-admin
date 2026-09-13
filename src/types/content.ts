export type ProcessVisual = 'yarn' | 'hook' | 'stitch' | 'flower' | 'finished'

export interface StitchStoryStep {
  id: string
  title: string
  description: string
}

export interface ProcessStep {
  label: string
  caption: string
  visual: ProcessVisual
  image?: string
}

export interface GalleryContentItem {
  id: string
  image: string
  caption: string
}

export interface TestimonialItem {
  id: string
  quote: string
  author: string
}

export interface SiteContent {
  brand: {
    name: string
    tagline: string
    loaderText: string
    logoSrc: string
  }
  hero: {
    line1: string
    line2: string
    supporting: string
    primaryCta: string
    secondaryCta: string
    image: string
  }
  collection: {
    eyebrow: string
    heading: string
    subheading: string
    intro: string
  }
  stitchStory: {
    eyebrow: string
    heading: string
    steps: StitchStoryStep[]
  }
  maker: {
    eyebrow: string
    heading: string
    story: string[]
    signature: string
    note: string
    image: string
  }
  process: {
    eyebrow: string
    heading: string
    steps: ProcessStep[]
  }
  featuredShowcase: {
    eyebrow: string
    heading: string
    subheading: string
  }
  customOrder: {
    eyebrow: string
    heading: string
    subheading: string
    cta: string
  }
  gallery: {
    eyebrow: string
    heading: string
    subheading: string
    items: GalleryContentItem[]
  }
  testimonials: {
    eyebrow: string
    items: TestimonialItem[]
  }
  shopPage: {
    eyebrow: string
    heading: string
    subheading: string
  }
  aboutPage: {
    eyebrow: string
    heading: string
    subheading: string
    intro: string
    cta: string
  }
  customPage: {
    eyebrow: string
    heading: string
    subheading: string
    intro: string
  }
  footer: {
    headline: string
    copyright: string
    visitLabel: string
    contactLabel: string
    socialLabel: string
    email: string
    handmadeNote: string
  }
  instagram: {
    handle: string
    url: string
    qrImage: string
    scanLabel: string
  }
  handmadeNote: string
}
