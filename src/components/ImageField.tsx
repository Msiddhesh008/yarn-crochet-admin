import { useId, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { IMAGE_ASPECTS, type ImageAspectKey } from '../data/imageAspects'
import { fileToObjectUrl, keyNearBlackToAlpha } from '../utils/imageUpload'
import { ThemeInput } from './form/FormControls'
import { ImageCropModal } from './ImageCropModal'
import { mediaUrl } from '../utils/mediaUrl'
import { ApiError, uploadDataUrl } from '../services/api'

const PNG_ASPECTS: ImageAspectKey[] = ['logo', 'qr', 'hero', 'maker']

const DEFAULT_FOLDERS: Record<ImageAspectKey, string> = {
  product: 'products',
  hero: 'content/hero',
  maker: 'content/maker',
  gallery: 'content/gallery',
  process: 'content/process',
  logo: 'content/brand',
  qr: 'content/instagram',
}

interface ImageFieldProps {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  optional?: boolean
  aspect: ImageAspectKey
  uploadFolder?: string
}

export function ImageField({
  id,
  label,
  value,
  onChange,
  optional = false,
  aspect,
  uploadFolder,
}: ImageFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const fileId = `${fieldId}-file`
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const aspectMeta = IMAGE_ASPECTS[aspect]
  const folder = uploadFolder ?? DEFAULT_FOLDERS[aspect]

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

  const onCropComplete = async (dataUrl: string) => {
    setBusy(true)
    setError('')
    try {
      let next = dataUrl
      if (aspect === 'hero') {
        next = await keyNearBlackToAlpha(dataUrl)
      }
      const url = await uploadDataUrl(next, folder)
      onChange(url)
      closeCrop()
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not finish that image.'
      setError(message)
      console.error(err)
    } finally {
      setBusy(false)
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
            src={mediaUrl(value)}
            alt=""
            className="image-field__preview"
            style={
              aspectMeta.ratio
                ? { aspectRatio: String(aspectMeta.ratio) }
                : undefined
            }
          />
        ) : (
          <div
            className="image-field__placeholder"
            style={
              aspectMeta.ratio
                ? { aspectRatio: String(aspectMeta.ratio) }
                : { aspectRatio: '4 / 5' }
            }
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
                ? 'Uploaded image'
                : 'Paste URL or /uploads path…'
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
              {busy ? 'Uploading…' : 'Upload & crop'}
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
            {aspectMeta.hint}.
            {aspectMeta.ratio
              ? ` Crop to ${aspectMeta.label} before saving`
              : ' Crop freely before saving'}
            {aspect === 'hero' ? ' Black studio plates are keyed out.' : ''}
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
          preferPng={PNG_ASPECTS.includes(aspect)}
          onCancel={closeCrop}
          onComplete={(dataUrl) => {
            onCropComplete(dataUrl).catch(console.error)
          }}
        />
      ) : null}
    </div>
  )
}
