import { useEffect, useState, type FormEvent } from 'react'
import { useCatalog } from '../context/CatalogContext'
import type { SiteContent } from '../types'
import { ContentEditor } from '../components/ContentEditor'

export function ContentPage() {
  const { content, saveContent } = useCatalog()
  const [draft, setDraft] = useState<SiteContent>(content)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDraft(content)
  }, [content])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveContent(draft)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return (
    <div>
      <p className="eyebrow">Content</p>
      <h1 className="page-title">Storefront words</h1>
      <p className="page-sub">
        Edit every marketing line and content image. Ready for future content APIs.
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: '1.25rem' }}>
        <ContentEditor draft={draft} setDraft={setDraft} />
        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            Save content
          </button>
          {saved ? <span className="page-sub">Saved to this browser.</span> : null}
        </div>
      </form>
    </div>
  )
}
