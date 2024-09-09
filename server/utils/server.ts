import UrlPattern from 'url-pattern'

export function middlewareMatched(endpoints: { path: string, method: string }[], path: string, method: string) {
  const normalizedPath = path.trim().replace(/\/+$/, '')

  return endpoints.some((endpoint) => {
    const pattern = new UrlPattern(endpoint.path)

    return (pattern.match(normalizedPath) && endpoint.method === method)
  })
}
