import type { CustomRequest, SiteContent } from '../types'
import { assetUrl } from '../utils/assetUrl'
import logo from '../assets/logo-transparent.png'

const year = new Date().getFullYear()

export const seedContent: SiteContent = {
  brand: {
    name: 'Yarn',
    tagline: 'little hands. big dreams.',
    loaderText: 'Made one loop at a time.',
    logoSrc: logo,
  },
  hero: {
    line1: 'Made by little hands.',
    line2: 'Made to be loved.',
    supporting:
      'Premium handmade crochet, stitched with curiosity and care.',
    primaryCta: 'Shop the collection',
    secondaryCta: 'Meet the maker',
    image: assetUrl('/products/pink-cozy-bear.jpg'),
  },
  collection: {
    eyebrow: 'The Collection',
    heading: 'Little loops.',
    subheading: 'Big imagination.',
    intro:
      'An editorial selection of flowers, bags, plushies, and gifts — each piece unique.',
  },
  stitchStory: {
    eyebrow: 'The making',
    heading: 'Made one stitch at a time.',
    steps: [
      {
        id: '01',
        title: 'Choose the yarn',
        description: 'Soft fibres in colours that feel like home.',
      },
      {
        id: '02',
        title: 'Find the colours',
        description: 'Dusty rose, sage, butter yellow — chosen by feel.',
      },
      {
        id: '03',
        title: 'Make the first loop',
        description: 'Where every piece begins: one quiet loop.',
      },
      {
        id: '04',
        title: 'Stitch by stitch',
        description: 'Slow work. Tiny hands. Endless patience.',
      },
      {
        id: '05',
        title: 'Finished with love',
        description: 'A handmade gift ready to be held.',
      },
    ],
  },
  maker: {
    eyebrow: 'The maker',
    heading: 'Behind every little loop.',
    story: [
      'She started crocheting with curiosity.',
      'A little yarn became a flower.',
      'A flower became a gift.',
      'And slowly, one stitch at a time,',
      'it became her little world.',
    ],
    signature: '— Yarn',
    note: 'Created by a ten-year-old maker with ten years of wonder ahead.',
    image: assetUrl('/maker/creator.png'),
  },
  process: {
    eyebrow: 'The process',
    heading: 'From yarn to something beautiful',
    steps: [
      {
        label: 'Yarn',
        caption: 'Soft fibres, chosen by feel',
        visual: 'yarn',
      },
      {
        label: 'Hook',
        caption: 'One quiet tool in little hands',
        visual: 'hook',
      },
      {
        label: 'Stitch',
        caption: 'Loop by loop, slowly',
        visual: 'stitch',
      },
      {
        label: 'Flower',
        caption: 'Shape begins to bloom',
        visual: 'flower',
      },
      {
        label: 'Finished',
        caption: 'A piece ready to love',
        visual: 'finished',
        image: assetUrl('/products/sunny-teddy.jpg'),
      },
    ],
  },
  featuredShowcase: {
    eyebrow: 'Featured',
    heading: 'Pieces to hold.',
    subheading: 'Stories to keep.',
  },
  customOrder: {
    eyebrow: 'Custom',
    heading: 'Have something special in mind?',
    subheading: "Tell us your idea. We'll turn yarn into something wonderful.",
    cta: 'Create something custom',
  },
  gallery: {
    eyebrow: 'Studio notes',
    heading: 'Soft moments.',
    subheading: 'Quiet stitches.',
    items: [
      {
        id: 'g1',
        image: assetUrl('/gallery/g1.jpg'),
        caption: 'Soft petals, dusty rose',
      },
      {
        id: 'g2',
        image: assetUrl('/gallery/g2.jpg'),
        caption: 'Yarn waiting on the table',
      },
      {
        id: 'g3',
        image: assetUrl('/gallery/g3.jpg'),
        caption: 'First loop of the day',
      },
      {
        id: 'g4',
        image: assetUrl('/gallery/g4.jpg'),
        caption: 'Behind the stitches',
      },
      {
        id: 'g5',
        image: assetUrl('/gallery/g5.jpg'),
        caption: 'Wrapped with care',
      },
      {
        id: 'g6',
        image: assetUrl('/gallery/g6.jpg'),
        caption: 'Finished and ready',
      },
    ],
  },
  testimonials: {
    eyebrow: 'Kind words',
    items: [
      {
        id: 't1',
        quote: 'Every little detail feels like it was made just for us.',
        author: 'Maya R.',
      },
      {
        id: 't2',
        quote:
          'The softest bag I own — and the story behind it makes it even better.',
        author: 'Elena K.',
      },
      {
        id: 't3',
        quote:
          'A gift that felt personal, handmade, and quietly luxurious.',
        author: 'Priya S.',
      },
    ],
  },
  shopPage: {
    eyebrow: 'Shop',
    heading: 'The collection.',
    subheading: 'Every piece a little world.',
  },
  aboutPage: {
    eyebrow: 'Our story',
    heading: 'A little world',
    subheading: 'made of yarn.',
    intro:
      'Yarn began with curiosity, soft fibre, and a ten-year-old maker who found joy one loop at a time.',
    cta: 'Start a custom piece',
  },
  customPage: {
    eyebrow: 'Custom orders',
    heading: 'Your idea.',
    subheading: 'Our stitches.',
    intro:
      "Share a colour, a shape, a feeling — we'll turn yarn into something made just for you.",
  },
  footer: {
    headline: 'See you in the next stitch.',
    copyright: `© ${year} Yarn. Handmade with love.`,
    visitLabel: 'Visit',
    contactLabel: 'Contact',
    socialLabel: 'Social',
    email: 'hello@yarn.studio',
    handmadeNote: 'Handmade to order',
  },
  instagram: {
    handle: '@CROCHETBYSONAKSHI',
    url: 'https://www.instagram.com/crochetbysonakshi/',
    qrImage: assetUrl('/instagram-qr-brand.jpg'),
    scanLabel: 'Scan to follow on Instagram',
  },
  handmadeNote:
    'Made by hand. Tiny variations make every piece unique.',
}

export const seedCustomRequests: CustomRequest[] = [
  {
    id: 'CR-221',
    name: 'Amelia',
    idea: 'Crochet flower crown in sage and butter yellow',
    colours: 'Sage, butter yellow, cream',
    message: 'For a spring birthday photoshoot.',
    createdAt: '2026-09-12T13:00:00Z',
    status: 'new',
  },
  {
    id: 'CR-220',
    name: 'Dev',
    idea: 'Custom tote with initials',
    colours: 'Terracotta and ivory',
    message: 'Monogram “D” on the front pocket.',
    createdAt: '2026-09-10T09:30:00Z',
    status: 'reviewed',
  },
  {
    id: 'CR-219',
    name: 'Sofia',
    idea: 'Mini plush matching Sunny Teddy but in dusty rose',
    colours: 'Dusty rose, cream',
    message: 'Same size as Sunny Teddy please.',
    createdAt: '2026-09-08T17:15:00Z',
    status: 'quoted',
  },
  {
    id: 'CR-218',
    name: 'Ken',
    idea: 'Keychain set for wedding favours (20 pcs)',
    colours: 'Muted pink and sage',
    message: 'Need by next month.',
    createdAt: '2026-09-05T11:40:00Z',
    status: 'closed',
  },
]
