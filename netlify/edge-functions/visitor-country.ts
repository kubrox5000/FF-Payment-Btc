import type { Config, Context } from '@netlify/edge-functions'

export default function visitorCountry(request: Request, context: Context) {
  const headers = request.headers
  // Always replace incoming values with Netlify's trusted geolocation.
  headers.delete('x-visitor-country')
  const country = context.geo?.country?.code
  if (country && /^[A-Z]{2}$/.test(country)) headers.set('x-visitor-country', country)
  // Request header mutations are passed to the next handler in the chain.
  return
}

export const config: Config = {
  path: '/*',
  excludedPath: ['/_next/*', '/.netlify/*', '/favicon.ico', '/icon.png', '/apple-icon.png'],
}
