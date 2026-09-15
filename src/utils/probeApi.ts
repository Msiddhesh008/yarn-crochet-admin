import { getApiBaseUrl, getStoredToken } from '../services/api'
import type { ApiProbeDef } from '../data/apiHealthProbes'

export interface ApiProbeResult {
  id: string
  group: string
  method: string
  path: string
  description: string
  status: number
  ok: boolean
  ms: number
  error?: string
}

export async function probeApiEndpoint(
  probe: ApiProbeDef,
): Promise<ApiProbeResult> {
  const base: Omit<ApiProbeResult, 'status' | 'ok' | 'ms' | 'error'> = {
    id: probe.id,
    group: probe.group,
    method: probe.method,
    path: probe.path,
    description: probe.description,
  }

  const started = performance.now()
  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (probe.auth === 'admin') {
      const token = getStoredToken()
      if (!token) {
        return {
          ...base,
          status: 0,
          ok: false,
          ms: Math.round(performance.now() - started),
          error: 'No admin token',
        }
      }
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${getApiBaseUrl()}${probe.path}`, {
      method: probe.method,
      headers,
    })
    const ms = Math.round(performance.now() - started)
    if (response.ok) {
      return { ...base, status: response.status, ok: true, ms }
    }

    let message = `HTTP ${response.status}`
    try {
      const text = await response.text()
      if (text) {
        const parsed = JSON.parse(text) as { error?: string }
        message = parsed.error || text.slice(0, 120)
      }
    } catch {
      /* keep default */
    }
    return {
      ...base,
      status: response.status,
      ok: false,
      ms,
      error: message,
    }
  } catch (err: unknown) {
    return {
      ...base,
      status: 0,
      ok: false,
      ms: Math.round(performance.now() - started),
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}
