import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { completeModuleAction } from "@/app/programmes/actions";
import { ModuleQuiz } from "@/components/module-quiz";
import { getModuleQuiz, getQuizOptions } from "@/lib/module-quizzes";

export default async function LearningModePage({ params, searchParams }: { params: Promise<{ track: string; module: string }>; searchParams: Promise<{ badge?: string; error?: string }> }) {
  const [{ track: trackId, module: moduleParam }, query, session] = await Promise.all([params, searchParams, auth()]);
  if (!session?.user?.id) redirect(`/login?callbackUrl=/programmes/${trackId}/${moduleParam}`);
  const moduleNumber = Number(moduleParam);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 10) notFound();
  const db = getSupabaseAdmin();
  const [{ data: track }, { data: modules }, { data: progress }, { data: badges }, { data: quizProgress }] = await Promise.all([
    db.from("core_tracks").select("id, title, badge_name, badge_key").eq("id", trackId).maybeSingle(),
    db.from("core_modules").select("id, module_number, title, content").eq("track_id", trackId).order("module_number"),
    db.from("module_progress").select("module_id, status, completion_date, core_modules!inner(track_id)").eq("user_id", session.user.id).eq("status", "completed"),
    db.from("earned_badges").select("track_id, badge_key").eq("user_id", session.user.id),
    db.from("module_quiz_progress").select("answered_question_ids").eq("user_id", session.user.id).eq("module_id", `${trackId}-${String(moduleNumber).padStart(2, "0")}`).maybeSingle(),
  ]);
  if (!track || !modules?.length) notFound();
  const trackProgress = (progress ?? []).filter((row) => (row.core_modules as unknown as { track_id: string }).track_id === trackId);
  const completed = new Set(trackProgress.map((row) => row.module_id));
  const currentModule = modules.find((item) => item.module_number === moduleNumber);
  if (!currentModule) notFound();
  if (moduleNumber > 1 && !completed.has(modules[moduleNumber - 2].id)) redirect(`/programmes/${trackId}/${moduleNumber - 1}`);
  const isComplete = completed.has(currentModule.id);
  const answeredQuestionIds = (quizProgress?.answered_question_ids ?? []) as string[];
  const quiz = getModuleQuiz(currentModule.id, currentModule.title).map((question, index) => ({ id: question.id, prompt: question.prompt, options: getQuizOptions(question, moduleNumber + index) }));
  const quizComplete = answeredQuestionIds.length === quiz.length && quiz.length > 0;
  const badgeEarned = (badges ?? []).some((badge) => badge.track_id === trackId);

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
    <Link href="/programmes" className="text-sm font-semibold text-[var(--blue)]">← All programmes</Link>
    <div className="mt-6 grid gap-8 lg:grid-cols-[19rem_1fr]">
      <aside className="h-fit rounded-3xl border border-[var(--line)] bg-white p-5 lg:sticky lg:top-6"><p className="text-xs font-bold uppercase tracking-wider text-[var(--blue)]">Learning mode</p><h1 className="mt-2 text-xl font-bold">{track.title}</h1><p className="mt-2 text-sm text-[var(--muted)]">{completed.size} of 10 modules complete</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--cream)]"><div className="h-full rounded-full bg-[var(--deep-green)]" style={{ width: `${completed.size * 10}%` }} /></div><ol className="mt-5 space-y-2">{modules.map((item) => { const done = completed.has(item.id); const locked = item.module_number > 1 && !completed.has(modules[item.module_number - 2].id); const active = item.module_number === moduleNumber; return <li key={item.id}><Link aria-disabled={locked} href={locked ? `#module-${item.module_number}` : `/programmes/${trackId}/${item.module_number}`} className={`flex items-start gap-3 rounded-xl px-3 py-3 text-sm ${active ? "bg-[var(--navy)] text-white" : locked ? "cursor-not-allowed bg-slate-50 text-slate-400" : "hover:bg-[var(--cream)]"}`}><span className="font-bold">{done ? "✓" : locked ? "🔒" : String(item.module_number).padStart(2, "0")}</span><span>{item.title}</span></Link></li>; })}</ol></aside>
      <main className="min-h-[34rem] rounded-3xl bg-white p-6 shadow-sm sm:p-10"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Module {moduleNumber} of 10</p><h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{currentModule.title}</h2><div className="mt-8 max-w-3xl whitespace-pre-line text-lg leading-8 text-[var(--muted)]">{currentModule.content}</div><div className="mt-10 rounded-2xl bg-[var(--cream)] p-6"><h3 className="font-bold">Take a moment to reflect</h3><p className="mt-2 leading-7 text-[var(--muted)]">What is one idea from this module you can try or discuss with someone you trust?</p></div>
        {!isComplete && <ModuleQuiz key={currentModule.id} moduleId={currentModule.id} questions={quiz} initialAnsweredIds={answeredQuestionIds} />}
        {query.error && <p role="alert" className="mt-5 text-sm text-red-700">{query.error === "quiz" ? "Complete every quiz question correctly before marking this module complete." : "We couldn’t save your progress. Please try again."}</p>}
        {isComplete ? <div className="mt-8 flex flex-wrap gap-3"><span className="rounded-full bg-green-100 px-5 py-3 font-semibold text-green-900">Module completed</span>{moduleNumber < 10 && <Link href={`/programmes/${trackId}/${moduleNumber + 1}`} className="rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white">Continue to next module →</Link>}</div> : quizComplete && <form action={completeModuleAction} className="mt-8"><input type="hidden" name="module_id" value={currentModule.id} /><button className="rounded-full bg-[var(--blue)] px-6 py-3.5 font-semibold text-white">Complete Module &amp; Continue →</button></form>}
        {query.badge && badgeEarned && <div role="status" className="badge-reveal mt-8 rounded-3xl border border-[var(--warm-gold)] bg-gradient-to-r from-amber-50 to-green-50 p-8 text-center"><p className="text-4xl">🏅</p><p className="mt-2 text-sm font-bold uppercase tracking-[.18em] text-[var(--deep-green)]">Track complete</p><h3 className="mt-2 text-3xl font-bold">{track.badge_name} earned!</h3><p className="mt-2 text-[var(--muted)]">You completed all ten modules in this Nexus Core track.</p><Link href="/programmes" className="mt-5 inline-flex rounded-full bg-[var(--navy)] px-5 py-3 font-semibold text-white">Explore another track</Link></div>}
      </main>
    </div>
  </div>;
}
