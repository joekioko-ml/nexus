import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export default async function ProgrammesPage() {
  const session = await auth();
  const db = getSupabaseAdmin();
  const [{ data: tracks }, { data: opportunities }] = await Promise.all([
    db.from("core_tracks").select("*").order("display_order"),
    db.from("external_programmes").select("*").eq("is_active", true).order("deadline", { ascending: true }),
  ]);
  const { data: progress } = session?.user?.id
    ? await db.from("module_progress").select("module_id, status, core_modules!inner(track_id)").eq("user_id", session.user.id).eq("status", "completed")
    : { data: [] as { module_id: string; status: string; core_modules: { track_id: string } }[] };
  const completionByTrack = new Map<string, number>();
  for (const row of progress ?? []) {
    const relation = row.core_modules as unknown as { track_id: string };
    completionByTrack.set(relation.track_id, (completionByTrack.get(relation.track_id) ?? 0) + 1);
  }

  return <div className="mx-auto max-w-7xl space-y-16 px-5 py-12 sm:px-8 sm:py-16">
    <header className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Learn and grow</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">Programmes for your next step.</h1><p className="mt-5 text-lg leading-8 text-[var(--muted)]">Build lasting skills through Nexus Core, or find an opportunity happening in your community.</p></header>

    <section><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Permanent learning</p><h2 className="mt-2 text-3xl font-bold">Nexus Core Programmes</h2></div>{!session && <Link className="rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white" href="/login?callbackUrl=/programmes">Sign in to track progress</Link>}</div>
      <div className="grid gap-5 lg:grid-cols-3">{(tracks ?? []).map((track) => { const completed = completionByTrack.get(track.id) ?? 0; return <article key={track.id} className="flex flex-col rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm"><span className="w-fit rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--deep-green)]">10 modules · {track.badge_name}</span><h3 className="mt-5 text-2xl font-bold">{track.title}</h3><p className="mt-3 flex-1 leading-7 text-[var(--muted)]">{track.focus}</p>{session && <p className="mt-5 text-sm font-semibold">{completed} of 10 modules completed</p>}<Link className="mt-5 rounded-full bg-[var(--navy)] px-5 py-3 text-center font-semibold text-white transition hover:bg-[var(--blue)]" href={session ? `/programmes/${track.id}/1` : `/login?callbackUrl=/programmes/${track.id}/1`}>{completed ? "Continue learning" : "Start this track"}</Link></article>; })}</div>
    </section>

    <section><div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Changing opportunities</p><h2 className="mt-2 text-3xl font-bold">External programmes</h2><p className="mt-3 text-[var(--muted)]">Time-bound opportunities from organizations and partners.</p></div>
      {opportunities?.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{opportunities.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-sm">{item.image_url && <div className="relative h-48"><Image src={item.image_url} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div>}<div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-[var(--blue)]">{item.organization}{item.location ? ` · ${item.location}` : ""}</p><h3 className="mt-2 text-xl font-bold">{item.title}</h3><p className="mt-3 line-clamp-4 leading-7 text-[var(--muted)]">{item.description}</p>{item.deadline && <p className="mt-4 text-sm font-semibold">Apply by {new Date(item.deadline).toLocaleDateString()}</p>}{item.apply_url && <a href={item.apply_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white">View opportunity</a>}</div></article>)}</div> : <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--cream)] px-6 py-12 text-center"><h3 className="text-xl font-bold">No external opportunities right now</h3><p className="mx-auto mt-2 max-w-xl text-[var(--muted)]">New programmes will appear here as they open. Explore Nexus Core in the meantime and check back for updates.</p></div>}
    </section>
  </div>;
}
