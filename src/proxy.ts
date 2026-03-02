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
  const isVerified = Boolean(token?.isVerified);
  const username = typeof token?.username === "string" ? token.username : "";

  const isAuthPage =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verify");
  const isVerifyPage = pathname.startsWith("/verify");
  const isDashboardPage = pathname.startsWith("/dashboard");

  if (!isLoggedIn && isDashboardPage) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isLoggedIn && isAuthPage) {
    if (!isVerified) {
      if (isVerifyPage) {
        return NextResponse.next();
      }

      if (username) {
        return NextResponse.redirect(
          new URL(`/verify/${username}`, request.url),
        );
      }

      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isLoggedIn && !isVerified && isDashboardPage && username) {
    return NextResponse.redirect(new URL(`/verify/${username}`, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/signup", "/verify/:path*", "/dashboard/:path*"],
};
