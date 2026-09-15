import { useState } from 'react'
import type { SiteContent } from '../types'
import type { ContentSectionKey } from '../types/contentSections'
import { ImageField } from './ImageField'
import { ContentSectionSave } from './ContentSectionSave'
import { TextAreaField, TextField } from './form/FormControls'

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}

function Field({ id, label, value, onChange, multiline }: FieldProps) {
  if (multiline) {
    return (
      <TextAreaField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
      />
    )
  }
  return (
    <TextField id={id} label={label} value={value} onChange={onChange} />
  )
}

interface ContentEditorProps {
  draft: SiteContent
  setDraft: (next: SiteContent) => void
  onSaveSection: (section: ContentSectionKey) => Promise<void>
}

export function ContentEditor({
  draft,
  setDraft,
  onSaveSection,
}: ContentEditorProps) {
  const [savingSection, setSavingSection] = useState<ContentSectionKey | null>(
    null,
  )
  const [savedSection, setSavedSection] = useState<ContentSectionKey | null>(
    null,
  )
  const [sectionError, setSectionError] = useState<
    Partial<Record<ContentSectionKey, string>>
  >({})

  const patch = <K extends keyof SiteContent>(
    key: K,
    value: SiteContent[K],
  ) => setDraft({ ...draft, [key]: value })

  const saveSection = (section: ContentSectionKey, label: string) => {
    setSavingSection(section)
    setSectionError((prev) => ({ ...prev, [section]: '' }))
    onSaveSection(section)
      .then(() => {
        setSavedSection(section)
        window.setTimeout(() => {
          setSavedSection((current) => (current === section ? null : current))
        }, 1600)
      })
      .catch((err: unknown) => {
        setSectionError((prev) => ({
          ...prev,
          [section]:
            err instanceof Error ? err.message : `Could not save ${label}`,
        }))
      })
      .finally(() => {
        setSavingSection((current) => (current === section ? null : current))
      })
  }

  const sectionSave = (section: ContentSectionKey, label: string) => (
    <ContentSectionSave
      section={label}
      saving={savingSection === section}
      saved={savedSection === section}
      error={sectionError[section] ?? ''}
      onSave={() => saveSection(section, label)}
    />
  )

  return (
    <div className="stack">
      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Brand / Loader
        </h2>
        <Field
          id="brand-name"
          label="Name"
          value={draft.brand.name}
          onChange={(name) => patch('brand', { ...draft.brand, name })}
        />
        <Field
          id="brand-tagline"
          label="Tagline"
          value={draft.brand.tagline}
          onChange={(tagline) => patch('brand', { ...draft.brand, tagline })}
        />
        <Field
          id="brand-loader"
          label="Loader text"
          value={draft.brand.loaderText}
          onChange={(loaderText) =>
            patch('brand', { ...draft.brand, loaderText })
          }
        />
        <ImageField
          id="brand-logo"
          label="Logo"
          aspect="logo"
          value={draft.brand.logoSrc}
          onChange={(logoSrc) => patch('brand', { ...draft.brand, logoSrc })}
        />
        {sectionSave('brand', 'Brand')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Hero
        </h2>
        <Field
          id="hero-1"
          label="Line 1"
          value={draft.hero.line1}
          onChange={(line1) => patch('hero', { ...draft.hero, line1 })}
        />
        <Field
          id="hero-2"
          label="Line 2"
          value={draft.hero.line2}
          onChange={(line2) => patch('hero', { ...draft.hero, line2 })}
        />
        <Field
          id="hero-support"
          label="Supporting"
          multiline
          value={draft.hero.supporting}
          onChange={(supporting) =>
            patch('hero', { ...draft.hero, supporting })
          }
        />
        <Field
          id="hero-cta1"
          label="Primary CTA"
          value={draft.hero.primaryCta}
          onChange={(primaryCta) =>
            patch('hero', { ...draft.hero, primaryCta })
          }
        />
        <Field
          id="hero-cta2"
          label="Secondary CTA"
          value={draft.hero.secondaryCta}
          onChange={(secondaryCta) =>
            patch('hero', { ...draft.hero, secondaryCta })
          }
        />
        <ImageField
          id="hero-image"
          label="Hero image"
          aspect="hero"
          value={draft.hero.image}
          onChange={(image) => patch('hero', { ...draft.hero, image })}
        />
        {sectionSave('hero', 'Hero')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          The Collection
        </h2>
        <Field
          id="col-eyebrow"
          label="Eyebrow"
          value={draft.collection.eyebrow}
          onChange={(eyebrow) =>
            patch('collection', { ...draft.collection, eyebrow })
          }
        />
        <Field
          id="col-heading"
          label="Heading"
          value={draft.collection.heading}
          onChange={(heading) =>
            patch('collection', { ...draft.collection, heading })
          }
        />
        <Field
          id="col-sub"
          label="Italic line"
          value={draft.collection.subheading}
          onChange={(subheading) =>
            patch('collection', { ...draft.collection, subheading })
          }
        />
        <Field
          id="col-intro"
          label="Intro"
          multiline
          value={draft.collection.intro}
          onChange={(intro) =>
            patch('collection', { ...draft.collection, intro })
          }
        />
        {sectionSave('collection', 'Collection')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          The Making
        </h2>
        <Field
          id="stitch-eyebrow"
          label="Eyebrow"
          value={draft.stitchStory.eyebrow}
          onChange={(eyebrow) =>
            patch('stitchStory', { ...draft.stitchStory, eyebrow })
          }
        />
        <Field
          id="stitch-heading"
          label="Heading"
          value={draft.stitchStory.heading}
          onChange={(heading) =>
            patch('stitchStory', { ...draft.stitchStory, heading })
          }
        />
        {draft.stitchStory.steps.map((step, index) => (
          <div className="grid-2" key={step.id}>
            <Field
              id={`stitch-title-${step.id}`}
              label={`Step ${step.id} title`}
              value={step.title}
              onChange={(title) => {
                const steps = [...draft.stitchStory.steps]
                steps[index] = { ...step, title }
                patch('stitchStory', { ...draft.stitchStory, steps })
              }}
            />
            <Field
              id={`stitch-desc-${step.id}`}
              label="Description"
              multiline
              value={step.description}
              onChange={(description) => {
                const steps = [...draft.stitchStory.steps]
                steps[index] = { ...step, description }
                patch('stitchStory', { ...draft.stitchStory, steps })
              }}
            />
          </div>
        ))}
        {sectionSave('stitchStory', 'The Making')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          The Maker
        </h2>
        <Field
          id="maker-eyebrow"
          label="Eyebrow"
          value={draft.maker.eyebrow}
          onChange={(eyebrow) => patch('maker', { ...draft.maker, eyebrow })}
        />
        <Field
          id="maker-heading"
          label="Heading"
          value={draft.maker.heading}
          onChange={(heading) => patch('maker', { ...draft.maker, heading })}
        />
        <Field
          id="maker-story"
          label="Story (one line per row)"
          multiline
          value={draft.maker.story.join('\n')}
          onChange={(raw) =>
            patch('maker', {
              ...draft.maker,
              story: raw.split('\n').filter(Boolean),
            })
          }
        />
        <Field
          id="maker-signature"
          label="Signature"
          value={draft.maker.signature}
          onChange={(signature) =>
            patch('maker', { ...draft.maker, signature })
          }
        />
        <Field
          id="maker-note"
          label="Note"
          value={draft.maker.note}
          onChange={(note) => patch('maker', { ...draft.maker, note })}
        />
        <ImageField
          id="maker-image"
          label="Maker image"
          aspect="maker"
          value={draft.maker.image}
          onChange={(image) => patch('maker', { ...draft.maker, image })}
        />
        {sectionSave('maker', 'Maker')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          The Process
        </h2>
        <Field
          id="process-eyebrow"
          label="Eyebrow"
          value={draft.process.eyebrow}
          onChange={(eyebrow) =>
            patch('process', { ...draft.process, eyebrow })
          }
        />
        <Field
          id="process-heading"
          label="Heading"
          value={draft.process.heading}
          onChange={(heading) =>
            patch('process', { ...draft.process, heading })
          }
        />
        {draft.process.steps.map((step, index) => (
          <div className="grid-2" key={`${step.visual}-${index}`}>
            <Field
              id={`process-label-${index}`}
              label="Label"
              value={step.label}
              onChange={(label) => {
                const steps = [...draft.process.steps]
                steps[index] = { ...step, label }
                patch('process', { ...draft.process, steps })
              }}
            />
            <Field
              id={`process-caption-${index}`}
              label="Caption"
              value={step.caption}
              onChange={(caption) => {
                const steps = [...draft.process.steps]
                steps[index] = { ...step, caption }
                patch('process', { ...draft.process, steps })
              }}
            />
            <ImageField
              id={`process-image-${index}`}
              label="Image (optional)"
              aspect="process"
              optional
              value={step.image ?? ''}
              onChange={(image) => {
                const steps = [...draft.process.steps]
                steps[index] = { ...step, image: image || undefined }
                patch('process', { ...draft.process, steps })
              }}
            />
          </div>
        ))}
        {sectionSave('process', 'Process')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Featured
        </h2>
        <Field
          id="feat-eyebrow"
          label="Eyebrow"
          value={draft.featuredShowcase.eyebrow}
          onChange={(eyebrow) =>
            patch('featuredShowcase', { ...draft.featuredShowcase, eyebrow })
          }
        />
        <Field
          id="feat-heading"
          label="Heading"
          value={draft.featuredShowcase.heading}
          onChange={(heading) =>
            patch('featuredShowcase', { ...draft.featuredShowcase, heading })
          }
        />
        <Field
          id="feat-sub"
          label="Italic line"
          value={draft.featuredShowcase.subheading}
          onChange={(subheading) =>
            patch('featuredShowcase', {
              ...draft.featuredShowcase,
              subheading,
            })
          }
        />
        {sectionSave('featuredShowcase', 'Featured')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Custom
        </h2>
        <Field
          id="custom-eyebrow"
          label="Eyebrow"
          value={draft.customOrder.eyebrow}
          onChange={(eyebrow) =>
            patch('customOrder', { ...draft.customOrder, eyebrow })
          }
        />
        <Field
          id="custom-heading"
          label="Heading"
          value={draft.customOrder.heading}
          onChange={(heading) =>
            patch('customOrder', { ...draft.customOrder, heading })
          }
        />
        <Field
          id="custom-sub"
          label="Subheading"
          multiline
          value={draft.customOrder.subheading}
          onChange={(subheading) =>
            patch('customOrder', { ...draft.customOrder, subheading })
          }
        />
        <Field
          id="custom-cta"
          label="CTA"
          value={draft.customOrder.cta}
          onChange={(cta) =>
            patch('customOrder', { ...draft.customOrder, cta })
          }
        />
        {sectionSave('customOrder', 'Custom')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Studio Notes
        </h2>
        <Field
          id="gal-eyebrow"
          label="Eyebrow"
          value={draft.gallery.eyebrow}
          onChange={(eyebrow) =>
            patch('gallery', { ...draft.gallery, eyebrow })
          }
        />
        <Field
          id="gal-heading"
          label="Heading"
          value={draft.gallery.heading}
          onChange={(heading) =>
            patch('gallery', { ...draft.gallery, heading })
          }
        />
        <Field
          id="gal-sub"
          label="Italic line"
          value={draft.gallery.subheading}
          onChange={(subheading) =>
            patch('gallery', { ...draft.gallery, subheading })
          }
        />
        {draft.gallery.items.map((item, index) => (
          <div className="grid-2" key={item.id}>
            <Field
              id={`gal-cap-${item.id}`}
              label={`Caption (${item.id})`}
              value={item.caption}
              onChange={(caption) => {
                const items = [...draft.gallery.items]
                items[index] = { ...item, caption }
                patch('gallery', { ...draft.gallery, items })
              }}
            />
            <ImageField
              id={`gal-img-${item.id}`}
              label="Image"
              aspect="gallery"
              value={item.image}
              onChange={(image) => {
                const items = [...draft.gallery.items]
                items[index] = { ...item, image }
                patch('gallery', { ...draft.gallery, items })
              }}
            />
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                const items = draft.gallery.items.filter((_, i) => i !== index)
                patch('gallery', { ...draft.gallery, items })
              }}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => {
            const id = `g-${Date.now()}`
            patch('gallery', {
              ...draft.gallery,
              items: [
                ...draft.gallery.items,
                { id, image: '', caption: 'New caption' },
              ],
            })
          }}
        >
          Add gallery item
        </button>
        {sectionSave('gallery', 'Studio Notes')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Kind Words
        </h2>
        <Field
          id="test-eyebrow"
          label="Eyebrow"
          value={draft.testimonials.eyebrow}
          onChange={(eyebrow) =>
            patch('testimonials', { ...draft.testimonials, eyebrow })
          }
        />
        {draft.testimonials.items.map((item, index) => (
          <div className="grid-2" key={item.id}>
            <Field
              id={`quote-${item.id}`}
              label="Quote"
              multiline
              value={item.quote}
              onChange={(quote) => {
                const items = [...draft.testimonials.items]
                items[index] = { ...item, quote }
                patch('testimonials', { ...draft.testimonials, items })
              }}
            />
            <Field
              id={`author-${item.id}`}
              label="Author"
              value={item.author}
              onChange={(author) => {
                const items = [...draft.testimonials.items]
                items[index] = { ...item, author }
                patch('testimonials', { ...draft.testimonials, items })
              }}
            />
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                const items = draft.testimonials.items.filter(
                  (_, i) => i !== index,
                )
                patch('testimonials', { ...draft.testimonials, items })
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => {
            const id = `t-${Date.now()}`
            patch('testimonials', {
              ...draft.testimonials,
              items: [
                ...draft.testimonials.items,
                { id, quote: '', author: '' },
              ],
            })
          }}
        >
          Add testimonial
        </button>
        {sectionSave('testimonials', 'Kind Words')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Shop
        </h2>
        <Field
          id="shop-eyebrow"
          label="Eyebrow"
          value={draft.shopPage.eyebrow}
          onChange={(eyebrow) =>
            patch('shopPage', { ...draft.shopPage, eyebrow })
          }
        />
        <Field
          id="shop-heading"
          label="Heading"
          value={draft.shopPage.heading}
          onChange={(heading) =>
            patch('shopPage', { ...draft.shopPage, heading })
          }
        />
        <Field
          id="shop-sub"
          label="Italic line"
          value={draft.shopPage.subheading}
          onChange={(subheading) =>
            patch('shopPage', { ...draft.shopPage, subheading })
          }
        />
        {sectionSave('shopPage', 'Shop')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Our Story
        </h2>
        <Field
          id="about-eyebrow"
          label="Eyebrow"
          value={draft.aboutPage.eyebrow}
          onChange={(eyebrow) =>
            patch('aboutPage', { ...draft.aboutPage, eyebrow })
          }
        />
        <Field
          id="about-heading"
          label="Heading"
          value={draft.aboutPage.heading}
          onChange={(heading) =>
            patch('aboutPage', { ...draft.aboutPage, heading })
          }
        />
        <Field
          id="about-sub"
          label="Italic line"
          value={draft.aboutPage.subheading}
          onChange={(subheading) =>
            patch('aboutPage', { ...draft.aboutPage, subheading })
          }
        />
        <Field
          id="about-intro"
          label="Intro"
          multiline
          value={draft.aboutPage.intro}
          onChange={(intro) =>
            patch('aboutPage', { ...draft.aboutPage, intro })
          }
        />
        <Field
          id="about-cta"
          label="CTA"
          value={draft.aboutPage.cta}
          onChange={(cta) => patch('aboutPage', { ...draft.aboutPage, cta })}
        />
        {sectionSave('aboutPage', 'Our Story')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Custom Orders
        </h2>
        <Field
          id="cpage-eyebrow"
          label="Eyebrow"
          value={draft.customPage.eyebrow}
          onChange={(eyebrow) =>
            patch('customPage', { ...draft.customPage, eyebrow })
          }
        />
        <Field
          id="cpage-heading"
          label="Heading"
          value={draft.customPage.heading}
          onChange={(heading) =>
            patch('customPage', { ...draft.customPage, heading })
          }
        />
        <Field
          id="cpage-sub"
          label="Italic line"
          value={draft.customPage.subheading}
          onChange={(subheading) =>
            patch('customPage', { ...draft.customPage, subheading })
          }
        />
        <Field
          id="cpage-intro"
          label="Intro"
          multiline
          value={draft.customPage.intro}
          onChange={(intro) =>
            patch('customPage', { ...draft.customPage, intro })
          }
        />
        {sectionSave('customPage', 'Custom Orders')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Footer
        </h2>
        <Field
          id="footer-headline"
          label="Headline"
          value={draft.footer.headline}
          onChange={(headline) =>
            patch('footer', { ...draft.footer, headline })
          }
        />
        <Field
          id="footer-copyright"
          label="Copyright"
          value={draft.footer.copyright}
          onChange={(copyright) =>
            patch('footer', { ...draft.footer, copyright })
          }
        />
        <div className="grid-2">
          <Field
            id="footer-visit"
            label="Visit label"
            value={draft.footer.visitLabel}
            onChange={(visitLabel) =>
              patch('footer', { ...draft.footer, visitLabel })
            }
          />
          <Field
            id="footer-contact"
            label="Contact label"
            value={draft.footer.contactLabel}
            onChange={(contactLabel) =>
              patch('footer', { ...draft.footer, contactLabel })
            }
          />
          <Field
            id="footer-social"
            label="Social label"
            value={draft.footer.socialLabel}
            onChange={(socialLabel) =>
              patch('footer', { ...draft.footer, socialLabel })
            }
          />
          <Field
            id="footer-email"
            label="Email"
            value={draft.footer.email}
            onChange={(email) => patch('footer', { ...draft.footer, email })}
          />
        </div>
        <Field
          id="footer-handmade"
          label="Contact note"
          value={draft.footer.handmadeNote}
          onChange={(handmadeNote) =>
            patch('footer', { ...draft.footer, handmadeNote })
          }
        />
        {sectionSave('footer', 'Footer')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Instagram
        </h2>
        <Field
          id="ig-handle"
          label="Instagram handle"
          value={draft.instagram.handle}
          onChange={(handle) =>
            patch('instagram', { ...draft.instagram, handle })
          }
        />
        <Field
          id="ig-url"
          label="Instagram URL"
          value={draft.instagram.url}
          onChange={(url) => patch('instagram', { ...draft.instagram, url })}
        />
        <ImageField
          id="ig-qr"
          label="QR image"
          aspect="qr"
          value={draft.instagram.qrImage}
          onChange={(qrImage) =>
            patch('instagram', { ...draft.instagram, qrImage })
          }
        />
        <Field
          id="ig-scan"
          label="Scan label"
          value={draft.instagram.scanLabel}
          onChange={(scanLabel) =>
            patch('instagram', { ...draft.instagram, scanLabel })
          }
        />
        {sectionSave('instagram', 'Instagram')}
      </section>

      <section className="panel stack">
        <h2 className="page-title" style={{ fontSize: '1.35rem' }}>
          Handmade note
        </h2>
        <Field
          id="handmade-note"
          label="Product handmade note"
          value={draft.handmadeNote}
          onChange={(handmadeNote) => setDraft({ ...draft, handmadeNote })}
        />
        {sectionSave('handmadeNote', 'Handmade note')}
      </section>
    </div>
  )
}
