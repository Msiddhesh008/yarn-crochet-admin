import { assetUrl } from './assetUrl'
import { getApiBaseUrl } from '../services/api'

const APP_BASE_PREFIXES = ['/yarn-crochet-admin/', '/yarn-crochet/']

/** Canonical public path for API/DB storage (e.g. `/products/foo.jpg`). */
export function storageMediaPath(src: string): string {
  if (!src) return ''
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src
  }
  let path = src.trim()
  for (const prefix of APP_BASE_PREFIXES) {
    if (path.startsWith(prefix)) {
      path = `/${path.slice(prefix.length)}`
      break
    }
  }
  if (!path.startsWith('/')) path = `/${path}`
  return path
}

/** Resolve media: API uploads vs Vite public assets. */
export function mediaUrl(src: string | undefined | null): string {
  if (!src) return ''
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  ) {
    return src
  }
  if (src.includes('/assets/')) {
    return src
  }
  const path = storageMediaPath(src)
  if (path.startsWith('/uploads/')) {
    return `${getApiBaseUrl()}${path}`
  }
  const base = import.meta.env.BASE_URL
  if (src.startsWith(base)) {
    return src
  }
  return assetUrl(path)
}
