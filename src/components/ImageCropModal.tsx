import { useCallback, useEffect, useMemo, useState } from 'react'
import Cropper, { type Area, type MediaSize } from 'react-easy-crop'
import { cropToDataUrl } from '../utils/imageUpload'
import {
  SITE_CROP_PRESETS,
  type CropRatioPreset,
} from '../data/imageAspects'
import { LoadingButton } from './LoadingButton'

interface ImageCropModalProps {
  imageSrc: string
  /** Fixed ratio. Omit for universal presets (all site frames). */
  aspect?: number
  aspectLabel: string
  aspectHint: string
  preferPng?: boolean
  /** When true (or aspect omitted), show every site crop preset. */
  universal?: boolean
  onCancel: () => void
  onComplete: (dataUrl: string) => void
}

export function ImageCropModal({
  imageSrc,
  aspect: fixedAspect,
  aspectLabel,
  aspectHint,
  preferPng = false,
  universal = false,
  onCancel,
  onComplete,
}: ImageCropModalProps) {
  const usePresets = universal || fixedAspect == null
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mediaSize, setMediaSize] = useState<MediaSize | null>(null)
  const [presetId, setPresetId] = useState('4-5')

  const presets: CropRatioPreset[] = SITE_CROP_PRESETS

  const naturalAspect = useMemo(() => {
    if (!mediaSize?.naturalWidth || !mediaSize.naturalHeight) return null
    return mediaSize.naturalWidth / mediaSize.naturalHeight
  }, [mediaSize])

  const activePreset = useMemo(
    () => presets.find((p) => p.id === presetId) ?? presets[0],
    [presets, presetId],
  )

  const activeAspect = useMemo(() => {
    if (!usePresets) return fixedAspect
    if (activePreset.value != null) return activePreset.value
    return naturalAspect ?? 1
  }, [usePresets, fixedAspect, activePreset, naturalAspect])

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

  const titleRatio = usePresets ? activePreset.label : aspectLabel
  const hintText = usePresets ? activePreset.hint : aspectHint

  return (
    <div className="crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <div className="crop-modal__panel">
        <div className="crop-modal__header">
          <div>
            <p className="eyebrow">Crop</p>
            <h2 id="crop-title" className="page-title" style={{ fontSize: '1.45rem' }}>
              Frame for the web · {titleRatio}
            </h2>
            <p className="page-sub">{hintText}</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
            Cancel
          </button>
        </div>

        {usePresets ? (
          <>
            <div className="crop-modal__presets" role="group" aria-label="Crop shape">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`btn btn--ghost btn--sm${presetId === preset.id ? ' is-active' : ''}`}
                  onClick={() => setPresetId(preset.id)}
                  title={preset.hint}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <p className="crop-modal__preset-hint page-sub" aria-live="polite">
              <strong>{activePreset.label}</strong>
              {' — '}
              {activePreset.hint}
            </p>
          </>
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
            <LoadingButton
              type="button"
              className="btn--primary"
              onClick={() => {
                apply().catch(console.error)
              }}
              loading={busy}
              loadingLabel="Saving…"
              disabled={!croppedAreaPixels}
            >
              Use crop
            </LoadingButton>
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
