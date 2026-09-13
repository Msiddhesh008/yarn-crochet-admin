import type { Area } from 'react-easy-crop'

const MAX_EDGE = 1600
const JPEG_QUALITY = 0.82
export const MAX_FILE_BYTES = 8 * 1024 * 1024

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image.'))
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
