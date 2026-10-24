import { NextResponse, type NextRequest } from 'next/server'

// Forward geo data to the current render, rather than waiting for a cookie
// on a later request. The current visitor's location always beats stale cookies.
export function middleware(request: NextRequest) {
  return NextResponse.next({ request: { headers: new Headers(request.headers) } })
}

export const config = {
  // Run on page navigations only (skip API, static assets and files with extensions).
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
}
