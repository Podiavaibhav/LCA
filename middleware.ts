import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Allow access to auth pages and API routes
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/"
  ) {
    return NextResponse.next()
  }

  // For now, allow all other routes - authentication will be handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
