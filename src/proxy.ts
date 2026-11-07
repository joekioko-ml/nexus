import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((request) => {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login") return NextResponse.next();
  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  const isLearning = path.startsWith("/programmes/") && path.split("/").filter(Boolean).length >= 3;
  const user = request.auth?.user;

  if (isAdmin && user?.role !== "admin") {
    const destination = new URL(user ? "/programmes" : "/admin/login", request.url);
    if (!user) destination.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(destination);
  }
  if (isLearning && !user) {
    const destination = new URL("/login", request.url);
    destination.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(destination);
  }
  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*", "/programmes/:path*"] };
