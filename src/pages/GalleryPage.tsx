import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { EmptyState } from '../components/EmptyState'
import { TextField } from '../components/form/FormControls'
import { ImageCropModal } from '../components/ImageCropModal'
import { LoadingButton } from '../components/LoadingButton'
import { fileToObjectUrl } from '../utils/imageUpload'
import { mediaUrl } from '../utils/mediaUrl'
import { ApiError } from '../services/api'

export function GalleryPage() {
  const {
    galleryAssets,
    mutating,
    uploadGalleryAsset,
    updateGalleryAsset,
    deleteGalleryAsset,
    reorderGalleryAssets,
  } = useCatalog()
  const fileRef = useRef<HTMLInputElement>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [captionDraft, setCaptionDraft] = useState('')
  const [error, setError] = useState('')
  const [editingCaptions, setEditingCaptions] = useState<Record<string, string>>(
    {},
  )

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const onFile = (file: File | undefined) => {
    if (!file) return
    setError('')
    try {
      setCropSrc(fileToObjectUrl(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open that image.')
    }
  }

  const onCropComplete = async (dataUrl: string) => {
    setError('')
    try {
      await uploadGalleryAsset(dataUrl, captionDraft.trim())
      setCaptionDraft('')
      closeCrop()
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not upload to gallery.',
      )
    }
  }

  const move = async (index: number, direction: -1 | 1) => {
    const next = index + direction
    if (next < 0 || next >= galleryAssets.length) return
    const ids = galleryAssets.map((a) => a.id)
    ;[ids[index], ids[next]] = [ids[next], ids[index]]
    try {
      await reorderGalleryAssets(ids)
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : 'Could not reorder gallery',
      )
    }
  }

  const saveCaption = async (id: string) => {
    const caption = (editingCaptions[id] ?? '').trim()
    try {
      await updateGalleryAsset(id, { caption })
      setEditingCaptions((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : 'Could not update caption',
      )
    }
  }

  const onDelete = async (id: string) => {
    if (!window.confirm('Remove this image from the gallery?')) return
    try {
      await deleteGalleryAsset(id)
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : 'Could not delete image',
      )
    }
  }

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div>
        <p className="eyebrow">Media</p>
        <h1 className="page-title">Gallery</h1>
        <p className="page-sub">
          Cloudinary library for Studio Notes and picking images across Admin.
          All assets appear on the homepage gallery automatically.
        </p>
      </div>

      <div className="toolbar" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextField
          id="new-gallery-caption"
          label="Caption for next upload"
          value={captionDraft}
          onChange={setCaptionDraft}
          placeholder="e.g. Dusty rose"
          fieldStyle={{ flex: '1 1 220px', margin: 0 }}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
        <LoadingButton
          type="button"
          className="btn btn--primary toolbar__action"
          loading={mutating && !!cropSrc}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={16} /> Upload & crop
        </LoadingButton>
      </div>

      {error ? <p className="image-field__error">{error}</p> : null}

      {galleryAssets.length === 0 ? (
        <EmptyState
          title="No gallery images yet"
          body="Upload a 4∶5 crop to start the Cloudinary library."
        />
      ) : (
        <div className="gallery-admin-grid">
          {galleryAssets.map((asset, index) => {
            const draft =
              editingCaptions[asset.id] !== undefined
                ? editingCaptions[asset.id]
                : asset.caption
            const dirty =
              editingCaptions[asset.id] !== undefined &&
              editingCaptions[asset.id] !== asset.caption
            return (
              <article key={asset.id} className="gallery-admin-card">
                <img
                  src={mediaUrl(asset.imageUrl)}
                  alt={asset.caption || 'Gallery asset'}
                  className="gallery-admin-card__img"
                />
                <div className="gallery-admin-card__body">
                  <TextField
                    id={`gal-cap-${asset.id}`}
                    label="Caption"
                    value={draft}
                    onChange={(value) =>
                      setEditingCaptions((prev) => ({
                        ...prev,
                        [asset.id]: value,
                      }))
                    }
                  />
                  <div className="gallery-admin-card__actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      disabled={index === 0 || mutating}
                      onClick={() => move(index, -1)}
                      aria-label="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      disabled={index === galleryAssets.length - 1 || mutating}
                      onClick={() => move(index, 1)}
                      aria-label="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    {dirty ? (
                      <LoadingButton
                        type="button"
                        className="btn btn--ghost btn--sm"
                        loading={mutating}
                        onClick={() => saveCaption(asset.id)}
                      >
                        Save caption
                      </LoadingButton>
                    ) : null}
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      disabled={mutating}
                      onClick={() => onDelete(asset.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {cropSrc ? (
        <ImageCropModal
          imageSrc={cropSrc}
          universal
          aspectLabel="Universal"
          aspectHint="Pick any frame used on the site, then crop."
          preferPng={false}
          onCancel={closeCrop}
          onComplete={(dataUrl) => {
            onCropComplete(dataUrl).catch(console.error)
          }}
        />
      ) : null}
    </div>
  )
}
