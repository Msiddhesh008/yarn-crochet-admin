import { useCallback, useEffect, useMemo, useState } from 'react'
import Cropper, { type Area, type MediaSize } from 'react-easy-crop'
import { cropToDataUrl } from '../utils/imageUpload'

interface ImageCropModalProps {
  imageSrc: string
  /** Fixed ratio. Omit for freeform (original + presets). */
  aspect?: number
  aspectLabel: string
  aspectHint: string
  preferPng?: boolean
  onCancel: () => void
  onComplete: (dataUrl: string) => void
}

type RatioPreset = {
  id: string
  label: string
  /** null = use media natural aspect */
  value: number | null
}

const FREEFORM_PRESETS: RatioPreset[] = [
  { id: 'original', label: 'Original', value: null },
  { id: '1-1', label: '1∶1', value: 1 },
  { id: '4-5', label: '4∶5', value: 4 / 5 },
  { id: '3-4', label: '3∶4', value: 3 / 4 },
  { id: '16-9', label: '16∶9', value: 16 / 9 },
]

export function ImageCropModal({
  imageSrc,
  aspect: fixedAspect,
  aspectLabel,
  aspectHint,
  preferPng = false,
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const freeform = fixedAspect == null
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mediaSize, setMediaSize] = useState<MediaSize | null>(null)
  const [presetId, setPresetId] = useState('original')

  const naturalAspect = useMemo(() => {
    if (!mediaSize?.naturalWidth || !mediaSize.naturalHeight) return null
    return mediaSize.naturalWidth / mediaSize.naturalHeight
  }, [mediaSize])

  const activeAspect = useMemo(() => {
    if (!freeform) return fixedAspect
    const preset = FREEFORM_PRESETS.find((p) => p.id === presetId)
    if (preset?.value != null) return preset.value
    return naturalAspect ?? 1
  }, [freeform, fixedAspect, presetId, naturalAspect])

  useEffect(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }, [activeAspect, imageSrc])

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const onMediaLoaded = useCallback((size: MediaSize) => {
    setMediaSize(size)
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

  const titleRatio = freeform
    ? (FREEFORM_PRESETS.find((p) => p.id === presetId)?.label ?? 'Freeform')
    : aspectLabel

  return (
    <div className="crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <div className="crop-modal__panel">
        <div className="crop-modal__header">
          <div>
            <p className="eyebrow">Crop</p>
            <h2 id="crop-title" className="page-title" style={{ fontSize: '1.45rem' }}>
              Frame for the web · {titleRatio}
            </h2>
            <p className="page-sub">{aspectHint}</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
            Cancel
          </button>
        </div>

        {freeform ? (
          <div className="crop-modal__presets" role="group" aria-label="Crop shape">
            {FREEFORM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`btn btn--ghost btn--sm${presetId === preset.id ? ' is-active' : ''}`}
                onClick={() => setPresetId(preset.id)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="crop-modal__stage">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={activeAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={onMediaLoaded}
            objectFit="contain"
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
