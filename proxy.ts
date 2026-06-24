import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  const isPublicPage = pathname === "/login";
  const isAuthApi = pathname.startsWith("/api/auth");
  const isRealtimeApi = pathname === "/api/realtime";

  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico");

  if (isStaticAsset) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    if (!isAuthApi && !isRealtimeApi && !session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Active session required",
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  if (!session && !isPublicPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && isPublicPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    "/api/:path*",
  ],
};