import UrlPattern from 'url-pattern'

export function middlewareMatched(endpoints: string[], path: string) {
  return endpoints.some((endpoints) => {
    const pattern = new UrlPattern(endpoints)

    return pattern.match(path)
  })
}
