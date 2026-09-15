export type ApiProbeAuth = 'none' | 'admin'

export interface ApiProbeDef {
  id: string
  group: string
  method: 'GET'
  path: string
  auth: ApiProbeAuth
  description: string
}

/** Safe read-only probes for Admin API Health (no mutating calls). */
export const API_HEALTH_PROBES: ApiProbeDef[] = [
  {
    id: 'health',
    group: 'System',
    method: 'GET',
    path: '/api/health',
    auth: 'none',
    description: 'Service heartbeat',
  },
  {
    id: 'auth-me',
    group: 'Auth',
    method: 'GET',
    path: '/api/auth/me',
    auth: 'admin',
    description: 'Admin session',
  },
  {
    id: 'products',
    group: 'Catalog',
    method: 'GET',
    path: '/api/products',
    auth: 'admin',
    description: 'Product list',
  },
  {
    id: 'content',
    group: 'Content',
    method: 'GET',
    path: '/api/content',
    auth: 'none',
    description: 'Site content',
  },
  {
    id: 'orders',
    group: 'Commerce',
    method: 'GET',
    path: '/api/orders',
    auth: 'admin',
    description: 'Orders list',
  },
  {
    id: 'customers',
    group: 'Commerce',
    method: 'GET',
    path: '/api/customers',
    auth: 'admin',
    description: 'Customers list',
  },
  {
    id: 'custom-requests',
    group: 'Commerce',
    method: 'GET',
    path: '/api/custom-requests',
    auth: 'admin',
    description: 'Custom requests',
  },
]
