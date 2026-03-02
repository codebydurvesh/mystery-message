import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.NEXT_AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isLoggedIn = Boolean(token);

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isDashboardPage = pathname.startsWith("/dashboard");

  if (!isLoggedIn && isDashboardPage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/signup", "/dashboard/:path*"],
};
