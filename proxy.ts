import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Skip middleware for maintenance page and API routes
  if (
    request.nextUrl.pathname.startsWith("/maintenance") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  try {
    // Fetch maintenance status
    const maintenanceResponse = await fetch(`${request.nextUrl.origin}/api/maintenance`, { cache: "no-store" })
    const maintenance = await maintenanceResponse.json()

    // Redirect to maintenance page if active
    if (maintenance.is_active) {
      return NextResponse.redirect(new URL("/maintenance", request.url))
    }
  } catch (error) {
    // Log error but don't block traffic if API fails
    console.error("Middleware error:", error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
