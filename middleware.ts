import { NextResponse, type NextRequest } from 'next/server'
import { countryFromHeaders } from '@/lib/visitor-locale'

export function middleware(request: NextRequest) {
  const country = countryFromHeaders(request.headers)
  const res = NextResponse.next()
  // Refresh the country on every visit; never reuse a previous location.
  if (country) {
    res.cookies.set('ff_country', country, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    })
  }
  return res
}

export const config = {
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
}
