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
      <button
        type="button"
        className="btn btn--primary"
        disabled={saving}
        onClick={onSave}
      >
        {saving ? 'Saving…' : `Save ${section}`}
      </button>
      {saved ? <span className="page-sub">Saved.</span> : null}
      {error ? <span className="login-error">{error}</span> : null}
    </div>
  )
}
