import { useEffect, useState } from 'react'
import { useCatalog } from '../context/CatalogContext'
import type { SiteContent } from '../types'
import type { ContentSectionKey } from '../types/contentSections'
import { ContentEditor } from '../components/ContentEditor'

export function ContentPage() {
  const { content, saveContentSection } = useCatalog()
  const [draft, setDraft] = useState<SiteContent>(content)

  useEffect(() => {
    setDraft(content)
  }, [content])

  const onSaveSection = (section: ContentSectionKey) =>
    saveContentSection(section, draft)

  return (
    <div>
      <p className="eyebrow">Content</p>
      <h1 className="page-title">Storefront words</h1>
      <p className="page-sub">
        Edit and save each section with its own API. Images upload to the server
        folder.
      </p>

      <div style={{ marginTop: '1.25rem' }}>
        <ContentEditor
          draft={draft}
          setDraft={setDraft}
          onSaveSection={onSaveSection}
        />
      </div>
    </div>
  )
}
