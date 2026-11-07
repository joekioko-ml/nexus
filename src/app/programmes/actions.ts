"use server";

import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getModuleQuiz } from "@/lib/module-quizzes";

export async function completeModuleAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const moduleId = String(formData.get("module_id") || "");
  const { data: module } = await getSupabaseAdmin().from("core_modules").select("id, track_id, module_number").eq("id", moduleId).maybeSingle();
  if (!module) redirect("/programmes");
  const db = getSupabaseAdmin();
  const { data: quizProgress } = await db.from("module_quiz_progress").select("answered_question_ids").eq("user_id", session.user.id).eq("module_id", module.id).maybeSingle();
  const { data: moduleDetails } = await db.from("core_modules").select("title").eq("id", module.id).single();
  const quiz = getModuleQuiz(module.id, moduleDetails?.title ?? "");
  if (!quiz.length || (quizProgress?.answered_question_ids?.length ?? 0) !== quiz.length) redirect(`/programmes/${module.track_id}/${module.module_number}?error=quiz`);
  if (module.module_number > 1) {
    const { data: previous } = await db.from("core_modules").select("id").eq("track_id", module.track_id).eq("module_number", module.module_number - 1).single();
    if (!previous) redirect("/programmes");
    const { data: progress } = await db.from("module_progress").select("status").eq("user_id", session.user.id).eq("module_id", previous.id).maybeSingle();
    if (progress?.status !== "completed") redirect(`/programmes/${module.track_id}/${module.module_number - 1}`);
  }
  const { error } = await db.from("module_progress").upsert({ user_id: session.user.id, module_id: module.id, status: "completed", completion_date: new Date().toISOString() });
  if (error) redirect(`/programmes/${module.track_id}/${module.module_number}?error=save`);
  revalidatePath(`/programmes/${module.track_id}/${module.module_number}`);
  if (module.module_number === 10) {
    const { data: track } = await db.from("core_tracks").select("badge_key").eq("id", module.track_id).single();
    if (track) await db.from("earned_badges").upsert({ user_id: session.user.id, track_id: module.track_id, badge_key: track.badge_key }, { onConflict: "user_id,track_id" });
    redirect(`/programmes/${module.track_id}/10?badge=${track?.badge_key ?? "earned"}`);
  }
  redirect(`/programmes/${module.track_id}/${module.module_number + 1}`);
}
