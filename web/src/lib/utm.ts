const UTM_KEYS = [
  'utm_source',
  'utm_campaign',
  'utm_id',
  'utm_medium',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'ttclid',
  'click_id',
] as const

export function captureUtmsFromUrl() {
  const params = new URLSearchParams(window.location.search)
  UTM_KEYS.forEach((key) => {
    const value = params.get(key)
    if (value) localStorage.setItem(key, value)
  })
}

export function getStoredUtms(): Record<string, string> {
  const utms: Record<string, string> = {}
  UTM_KEYS.forEach((key) => {
    const value = localStorage.getItem(key)
    if (value) utms[key] = value
  })
  return utms
}

export function appendUtms(params: URLSearchParams) {
  UTM_KEYS.forEach((key) => {
    const value = localStorage.getItem(key)
    if (value && !params.has(key)) params.set(key, value)
  })
  return params
}

export function buildUrlWithUtms(path: string) {
  const params = appendUtms(new URLSearchParams())
  const query = params.toString()
  return query ? `${path}?${query}` : path
}
