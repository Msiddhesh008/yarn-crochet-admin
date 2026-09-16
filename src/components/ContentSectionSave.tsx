import { LoadingButton } from './LoadingButton'

interface ContentSectionSaveProps {
  section: string
  saving: boolean
  saved: boolean
  error: string
  onSave: () => void
}

export function ContentSectionSave({
  section,
  saving,
  saved,
  error,
  onSave,
}: ContentSectionSaveProps) {
  return (
    <div className="form-actions content-section-save">
      <LoadingButton
        type="button"
        className="btn--primary"
        loading={saving}
        loadingLabel="Saving…"
        onClick={onSave}
      >
        {`Save ${section}`}
      </LoadingButton>
      {saved ? <span className="page-sub">Saved.</span> : null}
      {error ? <span className="login-error">{error}</span> : null}
    </div>
  )
}
