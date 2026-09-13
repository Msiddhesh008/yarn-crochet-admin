import { useId, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { IMAGE_ASPECTS, type ImageAspectKey } from '../data/imageAspects'
import { fileToObjectUrl } from '../utils/imageUpload'
import { ThemeInput } from './form/FormControls'
import { ImageCropModal } from './ImageCropModal'

interface ImageFieldProps {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  optional?: boolean
  aspect: ImageAspectKey
}

export function ImageField({
  id,
  label,
  value,
  onChange,
  optional = false,
  aspect,
}: ImageFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const fileId = `${fieldId}-file`
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const aspectMeta = IMAGE_ASPECTS[aspect]

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const onFile = (file: File | undefined) => {
    if (!file) return
    setError('')
    try {
      const url = fileToObjectUrl(file)
      setCropSrc(url)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not open that image.'
      setError(message)
      console.error(err)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="field image-field">
      <label htmlFor={fieldId}>
        {label}
        <span className="image-field__ratio"> · {aspectMeta.label}</span>
      </label>
      <div className="image-field__row">
        {value ? (
          <img
            src={value}
            alt=""
            className="image-field__preview"
            style={{ aspectRatio: String(aspectMeta.ratio) }}
          />
        ) : (
          <div
            className="image-field__placeholder"
            style={{ aspectRatio: String(aspectMeta.ratio) }}
            aria-hidden
          >
            {aspectMeta.label}
          </div>
        )}
        <div className="image-field__controls">
          <ThemeInput
            id={fieldId}
            type="text"
            value={value.startsWith('data:') ? '' : value}
            placeholder={
              value.startsWith('data:')
                ? 'Cropped upload'
                : 'Paste URL or path…'
            }
            onChange={(e) => {
              setError('')
              onChange(e.target.value)
            }}
          />
          <div className="image-field__actions">
            <input
              ref={inputRef}
              id={fileId}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <label htmlFor={fileId} className="btn btn--ghost btn--sm">
              <Upload size={14} />
              Upload & crop
            </label>
            {value ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setError('')
                  onChange('')
                }}
              >
                <X size={14} /> Clear
              </button>
            ) : null}
          </div>
          {error ? <p className="image-field__error">{error}</p> : null}
          <p className="page-sub" style={{ margin: 0, fontSize: '0.78rem' }}>
            {aspectMeta.hint}. Crop to {aspectMeta.label} before saving
            {optional ? ' (optional)' : ''}.
          </p>
        </div>
      </div>

      {cropSrc ? (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={aspectMeta.ratio}
          aspectLabel={aspectMeta.label}
          aspectHint={aspectMeta.hint}
          preferPng={aspect === 'logo' || aspect === 'qr'}
          onCancel={closeCrop}
          onComplete={(dataUrl) => {
            onChange(dataUrl)
            closeCrop()
          }}
        />
      ) : null}
    </div>
  )
}
