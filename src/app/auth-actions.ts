"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const { data: account } = await getSupabaseAdmin().from("users").select("role").eq("email", email).maybeSingle();
  if (account?.role === "admin") redirect("/login?error=use-admin-login");
  try {
    await signIn("credentials", { email, password: formData.get("password"), redirectTo: String(formData.get("callbackUrl") || "/programmes") });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=credentials");
    throw error;
  }
}

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const { data: account } = await getSupabaseAdmin().from("users").select("role").eq("email", email).maybeSingle();
  if (account?.role !== "admin") redirect("/admin/login?error=credentials");
  try {
    await signIn("credentials", { email, password: formData.get("password"), redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/admin/login?error=credentials");
    throw error;
  }
}

export async function registerMemberAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12) redirect("/register?error=validation");
  const password_hash = await hash(password, 12);
  const { error } = await getSupabaseAdmin().from("users").insert({ name, email, password_hash, role: "member" });
  if (error) redirect(`/register?error=${error.code === "23505" ? "exists" : "save"}`);
  redirect("/login?registered=1");
}
