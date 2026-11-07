import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getModuleQuiz, getQuizOptions } from "@/lib/module-quizzes";

export default async function ProgrammeGuidesPage() {
  const db = getSupabaseAdmin();
  const [{ data: tracks }, { data: modules }] = await Promise.all([
    db.from("core_tracks").select("id, title, focus, badge_name").order("display_order"),
    db.from("core_modules").select("id, track_id, module_number, title").order("track_id").order("module_number"),
  ]);
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
    <Link href="/resources" className="text-sm font-semibold text-[var(--blue)]">← Back to Resources</Link>
    <header className="mt-6 max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Nexus Core · answer guides</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Understand the questions, not just the answers.</h1><p className="mt-5 text-lg leading-8 text-[var(--muted)]">Use these explanations to review the ideas in each module. The quizzes still ask you to choose an answer yourself before you can continue.</p></header>
    <nav aria-label="Programme guide tracks" className="mt-8 flex flex-wrap gap-3">{tracks?.map((track) => <a key={track.id} href={`#${track.id}`} className="rounded-full bg-[var(--cream)] px-4 py-2 text-sm font-semibold text-[var(--navy)]">{track.title}</a>)}</nav>
    <div className="mt-12 space-y-16">{tracks?.map((track) => {
      const trackModules = (modules ?? []).filter((module) => module.track_id === track.id);
      return <section id={track.id} key={track.id} className="scroll-mt-24">
        <div className="border-b border-[var(--line)] pb-5"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--deep-green)]">Reward: {track.badge_name}</p><h2 className="mt-2 text-3xl font-bold">{track.title}</h2><p className="mt-3 text-[var(--muted)]">{track.focus}</p></div>
        <div className="mt-6 space-y-5">{trackModules.map((module) => <article key={module.id} className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-sm sm:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--blue)]">Module {module.module_number}</p><h3 className="mt-2 text-xl font-bold">{module.title}</h3><div className="mt-5 space-y-5">{getModuleQuiz(module.id, module.title).map((question, index) => {
            const options = getQuizOptions(question, module.module_number + index);
            return <div key={question.id} className="rounded-2xl bg-[var(--paper)] p-4 sm:p-5"><p className="font-semibold">{index + 1}. {question.prompt}</p><ol className="mt-3 space-y-2">{options.map((option) => <li key={option} className={`rounded-xl px-3 py-2 text-sm leading-6 ${option === question.correctAnswer ? "bg-green-100 font-semibold text-green-950" : "bg-white text-[var(--muted)]"}`}>{option}{option === question.correctAnswer ? " · Correct answer" : ""}</li>)}</ol><p className="mt-3 text-sm leading-6 text-[var(--muted)]"><span className="font-bold text-[var(--navy)]">Why:</span> {question.explanation}</p></div>;
          })}</div></article>)}</div>
      </section>;
    })}</div>
  </main>;
}
