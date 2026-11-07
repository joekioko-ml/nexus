import "next-auth";

declare module "next-auth" {
  interface User { role: "admin" | "member" }
  interface Session { user: { id: string; role: "admin" | "member" } & NonNullable<Session["user"]> }
}

declare module "next-auth/jwt" {
  interface JWT { userId?: string; role?: "admin" | "member" }
}
