"use server";

import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getModuleQuiz } from "@/lib/module-quizzes";

export async function submitModuleQuizAnswer(input: { moduleId: string; questionId: string; answer: string }) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, complete: false, message: "Sign in to save your quiz progress." };
  const db = getSupabaseAdmin();
  const { data: module } = await db.from("core_modules").select("id, title").eq("id", input.moduleId).maybeSingle();
  if (!module) return { ok: false, complete: false, message: "This module could not be found." };
  const quiz = getModuleQuiz(module.id, module.title);
  const { data: saved } = await db.from("module_quiz_progress").select("answered_question_ids").eq("user_id", session.user.id).eq("module_id", module.id).maybeSingle();
  const answered = (saved?.answered_question_ids ?? []) as string[];
  const nextQuestion = quiz[answered.length];
  if (!nextQuestion || nextQuestion.id !== input.questionId) return { ok: false, complete: answered.length === quiz.length, message: "Refresh the module to continue from your saved question." };
  if (input.answer !== nextQuestion.correctAnswer) return { ok: false, complete: false, message: "Not quite. Review the module and try another answer." };
  const updated = [...answered, nextQuestion.id];
  const { error } = await db.from("module_quiz_progress").upsert({ user_id: session.user.id, module_id: module.id, answered_question_ids: updated, completed_at: updated.length === quiz.length ? new Date().toISOString() : null, updated_at: new Date().toISOString() });
  if (error) return { ok: false, complete: false, message: "We couldn’t save your answer. Please try again." };
  return { ok: true, complete: updated.length === quiz.length, message: nextQuestion.explanation };
}
