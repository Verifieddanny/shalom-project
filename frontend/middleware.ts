import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/student/dashboard")) {
    return NextResponse.redirect(new URL("/student", request.url));
  }

  if (!token && request.nextUrl.pathname.startsWith("/staff/dashboard")) {
    return NextResponse.redirect(new URL("/staff", request.url));
  }

  if (!token && request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/dashboard/:path*", "/staff/dashboard/:path*", "/admin/dashboard/:path*"],
};
