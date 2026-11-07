"use server";

import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  if ((await auth())?.user?.role !== "admin") throw new Error("Forbidden");
}

export async function saveExternalProgramme(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const organization = String(formData.get("organization") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const deadlineInput = String(formData.get("deadline") || "");
  const applyUrl = String(formData.get("apply_url") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  if (!title || !organization || !description) redirect("/admin?error=required");
  const record = { title, organization, description, deadline: deadlineInput ? new Date(deadlineInput).toISOString() : null, apply_url: applyUrl || null, image_url: imageUrl || null, location: String(formData.get("location") || "").trim() || null, is_active: formData.get("is_active") === "on", updated_at: new Date().toISOString() };
  const supabase = getSupabaseAdmin();
  const { error } = id
    ? await supabase.from("external_programmes").update(record).eq("id", id)
    : await supabase.from("external_programmes").insert(record);
  if (error) redirect("/admin?error=save");
  revalidatePath("/admin"); revalidatePath("/programmes");
  redirect("/admin?saved=1");
}

export async function deleteExternalProgramme(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin?error=missing");
  const { error } = await getSupabaseAdmin().from("external_programmes").delete().eq("id", id);
  if (error) redirect("/admin?error=delete");
  revalidatePath("/admin"); revalidatePath("/programmes");
  redirect("/admin?deleted=1");
}
