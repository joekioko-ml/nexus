import { auth } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ExternalProgrammeForm } from "@/components/external-programme-form";
import { AdminStoryForm } from "@/components/admin-story-form";
import { deleteExternalProgramme } from "./actions";
import { redirect } from "next/navigation";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; deleted?: string }> }) {
  if ((await auth())?.user?.role !== "admin") redirect("/login");
  const [{ data: programmes }, { data: stories }, query] = await Promise.all([
    getSupabaseAdmin().from("external_programmes").select("*").order("created_at", { ascending: false }),
    getSupabaseAdmin().from("mentorship_stories").select("id, caption, media_url, created_at").order("created_at", { ascending: false }).limit(10),
    searchParams,
  ]);
  return <section className="mx-auto max-w-7xl space-y-14 px-5 py-12 sm:px-8 sm:py-16">
    <header><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Nexus staff</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">Admin dashboard</h1><p className="mt-4 max-w-2xl text-[var(--muted)]">Manage current opportunities and community stories.</p></header>
    {query.error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">Could not save that change. Check all required fields and try again.</p>}
    {query.saved && <p className="rounded-xl bg-green-50 p-4 text-green-800">Programme saved.</p>}
    {query.deleted && <p className="rounded-xl bg-green-50 p-4 text-green-800">Programme removed.</p>}
    <section><h2 className="mb-5 text-2xl font-bold">Add an external programme</h2><ExternalProgrammeForm /></section>
    <section><h2 className="mb-5 text-2xl font-bold">Manage external programmes</h2>
      {programmes?.length ? <div className="space-y-5">{programmes.map((programme) => <article key={programme.id} className="space-y-4 rounded-3xl bg-[var(--cream)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-xl font-bold">{programme.title}</h3><form action={deleteExternalProgramme}><input type="hidden" name="id" value={programme.id} /><button className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-800">Remove</button></form></div><ExternalProgrammeForm programme={programme} /></article>)}</div> : <p className="rounded-2xl bg-[var(--cream)] p-6 text-[var(--muted)]">No external programmes yet. Add one above to start the noticeboard.</p>}
    </section>
    <section><h2 className="mb-5 text-2xl font-bold">Publish an Insta-story</h2><AdminStoryForm /><div className="mt-6 grid gap-3 sm:grid-cols-2">{stories?.map((story) => <article key={story.id} className="rounded-2xl border border-[var(--line)] bg-white p-4"><p className="line-clamp-2 font-medium">{story.caption}</p><p className="mt-2 text-xs text-[var(--muted)]">{new Date(story.created_at).toLocaleString()}</p></article>)}</div></section>
  </section>;
}
