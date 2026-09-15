const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  '',
) ?? 'http://localhost:4000'

const TOKEN_KEY = 'yarn-admin:auth-token'
const EMAIL_KEY = 'yarn-admin:auth-email'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getApiBaseUrl(): string {
  return API_URL
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getStoredEmail(): string | null {
  try {
    return localStorage.getItem(EMAIL_KEY)
  } catch {
    return null
  }
}

export function setSession(token: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EMAIL_KEY, email)
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EMAIL_KEY)
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.auth !== false) {
    const token = getStoredToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    const message =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Request failed (${response.status})`
    if (response.status === 401) {
      clearSession()
    }
    throw new ApiError(response.status, message)
  }

  return data as T
}

function dataUrlToBlob(dataUrl: string): Blob {
  const match = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl)
  if (!match) {
    throw new ApiError(400, 'Invalid data URL')
  }
  const mime = match[1]
  const binary = atob(match[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: mime })
}

/** Upload a cropped data URL to the API uploads folder. Returns `/uploads/...`. */
export async function uploadDataUrl(
  dataUrl: string,
  folder: string,
): Promise<string> {
  const blob = dataUrlToBlob(dataUrl)
  const ext = blob.type.includes('png')
    ? 'png'
    : blob.type.includes('webp')
      ? 'webp'
      : 'jpg'
  const form = new FormData()
  form.append('file', blob, `upload.${ext}`)

  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = getStoredToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(
    `${API_URL}/api/uploads?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      headers,
      body: form,
    },
  )

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    const message =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Upload failed (${response.status})`
    throw new ApiError(response.status, message)
  }

  const url =
    data &&
    typeof data === 'object' &&
    'url' in data &&
    typeof (data as { url: unknown }).url === 'string'
      ? (data as { url: string }).url
      : ''
  if (!url) {
    throw new ApiError(500, 'Upload response missing url')
  }
  return url
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<{ token: string; email: string }> {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
}
