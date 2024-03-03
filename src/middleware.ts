import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CustomUser } from "./app/api/auth/[...nextauth]/options";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const nonProtectedRoutes = [
    
    "/login",
    "/signup",
    "/admin-login",
    "/renter-login",
    "/renter-signup",
  ];
  const protectedUserRoutes = ["/"];
  const nonProtectedRenterRoutes = ["/"]
  const protectedAdminRoutes = ["/admin/dashboard"];
  const protectedRenterRoutes = ["/renter/dashboard"];

  if (nonProtectedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  if (token == null) {
    if (protectedUserRoutes.includes(pathname)) {
      return redirect(
        "/login?error=Please login first to access this route",
        request.url
      );
    }
    if (protectedAdminRoutes.includes(pathname)) {
      return redirect(
        "/admin-login?error=Please login first to access this route",
        request.url
      );
    }
    if (protectedRenterRoutes.includes(pathname)) {
      return redirect(
        "/renter-login?error=Please login first to access this route",
        request.url
      );
    }
  }

  const user: CustomUser | null = token?.user as CustomUser;
  if (!user) return; // Ensure user is not null before proceeding

  switch (user.role) {
    case "User":
      if (protectedAdminRoutes.includes(pathname)) {
        return redirect(
          "/admin-login?error=You do not have access to this route.",
          request.url
        );
      }
      if (protectedRenterRoutes.includes(pathname)) {
        return redirect(
          "/renter-login?error=You do not have access to this route.",
          request.url
        );
      }
      break;
    case "Renter":
      if (protectedAdminRoutes.includes(pathname)) {
        return redirect(
          "/admin-login?error=You do not have access to this route.",
          request.url
        );
      }
      if (protectedUserRoutes.includes(pathname) && !(nonProtectedRenterRoutes.includes(pathname))) {
        return redirect(
          "/login?error=You do not have access to this route.",
          request.url
        );
        
      }
      NextResponse.next();
      break;
    case "Admin":
      // Admin-specific logic here (if any)
      break;
  }

  return NextResponse.next();
}

function redirect(location: string, currentUrl: string) {
  return NextResponse.redirect(new URL(location, currentUrl));
}
