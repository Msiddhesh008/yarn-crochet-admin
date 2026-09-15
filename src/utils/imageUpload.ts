import type { Area } from 'react-easy-crop'

const MAX_EDGE = 1600
const JPEG_QUALITY = 0.82
/** Max channel value treated as “black plate” for chroma key. */
const BLACK_KEY_THRESHOLD = 28
export const MAX_FILE_BYTES = 8 * 1024 * 1024

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image.'))
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous'
    }
    img.src = src
  })
}

export function validateImageFile(file: File): void {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Image must be under 8MB.')
  }
}

export function fileToObjectUrl(file: File): string {
  validateImageFile(file)
  return URL.createObjectURL(file)
}

export async function cropToDataUrl(
  imageSrc: string,
  pixelCrop: Area,
  mime: 'image/jpeg' | 'image/png' = 'image/jpeg',
): Promise<string> {
  const image = await loadImage(imageSrc)
  const scale = Math.min(
    1,
    MAX_EDGE / Math.max(pixelCrop.width, pixelCrop.height),
  )
  const width = Math.max(1, Math.round(pixelCrop.width * scale))
  const height = Math.max(1, Math.round(pixelCrop.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable.')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height,
  )

  return canvas.toDataURL(mime, JPEG_QUALITY)
}

/** Turn near-black studio plates into transparent pixels (PNG data URL). */
export async function keyNearBlackToAlpha(
  imageSrc: string,
  threshold = BLACK_KEY_THRESHOLD,
): Promise<string> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable.')

  ctx.drawImage(image, 0, 0)
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = frame
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0
    }
  }
  ctx.putImageData(frame, 0, 0)
  return canvas.toDataURL('image/png')
}
