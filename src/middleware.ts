import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and auth routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Redirect unauthenticated users to sign-in page
  if (!isAuthenticated && pathname !== "/auth/signin") {
    const url = new URL("/auth/signin", request.url);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from sign-in page
  if (isAuthenticated && pathname === "/auth/signin") {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
