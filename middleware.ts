import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  const isPublicPage = pathname === "/login";
  const isAuthApi = pathname.startsWith("/api/auth");
  const isRealtimeApi = pathname === "/api/realtime";
  
  // Static files and system assets are public
  const isStaticAsset = 
    pathname.startsWith("/_next") || 
    pathname.includes(".") || 
    pathname.startsWith("/favicon.ico");

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // 1. Guard API Routes (excluding auth endpoints and realtime SSE stream)
  if (pathname.startsWith("/api")) {
    if (!isAuthApi && !isRealtimeApi && !session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Active session required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Guard Page Routes
  if (!session && !isPublicPage) {
    // Redirect to login page if unauthenticated
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isPublicPage) {
    // Redirect authenticated users trying to access login back to dashboard
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to pages and api routes
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
