import { useCallback, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { cropToDataUrl } from '../utils/imageUpload'

interface ImageCropModalProps {
  imageSrc: string
  aspect: number
  aspectLabel: string
  aspectHint: string
  preferPng?: boolean
  onCancel: () => void
  onComplete: (dataUrl: string) => void
}

export function ImageCropModal({
  imageSrc,
  aspect,
  aspectLabel,
  aspectHint,
  preferPng = false,
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const apply = async () => {
    if (!croppedAreaPixels) return
    setBusy(true)
    setError('')
    try {
      const mime = preferPng ? 'image/png' : 'image/jpeg'
      const dataUrl = await cropToDataUrl(imageSrc, croppedAreaPixels, mime)
      onComplete(dataUrl)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not crop that image.'
      setError(message)
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <div className="crop-modal__panel">
        <div className="crop-modal__header">
          <div>
            <p className="eyebrow">Crop</p>
            <h2 id="crop-title" className="page-title" style={{ fontSize: '1.45rem' }}>
              Frame for the web · {aspectLabel}
            </h2>
            <p className="page-sub">{aspectHint}</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
            Cancel
          </button>
        </div>

        <div className="crop-modal__stage">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
          />
        </div>

        <div className="crop-modal__controls">
          <label htmlFor="crop-zoom">
            Zoom
            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
          {error ? <p className="image-field__error">{error}</p> : null}
          <div className="form-actions" style={{ marginTop: 0 }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                apply().catch(console.error)
              }}
              disabled={busy || !croppedAreaPixels}
            >
              {busy ? 'Saving…' : 'Use crop'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
