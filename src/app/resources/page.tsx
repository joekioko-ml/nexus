import { Hero, Section } from "@/components/page-elements";
import { ResourceLibrary, type CoreResource } from "@/components/resource-library";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  let resources: CoreResource[] = [];
  let unavailable = false;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("core_resources")
      .select("id, title, category, type, url, description")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;
    resources = (data ?? []) as CoreResource[];
  } catch (error) {
    const failure = error as { message?: string; code?: string; details?: string; hint?: string };
    console.error("Could not load Nexus resources:", {
      message: failure?.message ?? String(error),
      code: failure?.code,
      details: failure?.details,
      hint: failure?.hint,
    });
    unavailable = true;
  }

  return <>
    <Hero eyebrow="Resources" title="Useful things to return to, share, and make your own." action="For families" href="/for-families" backgroundImage="/background3.jpeg" hideDecoration overlay className="resources-hero" titleClassName="text-white">
      <span className="text-white">Explore trusted learning material for everyday wellbeing, leadership, career choices, technology, and supportive mentorship.</span>
    </Hero>
    <Section eyebrow="Start here" title="Nexus guides and learning support.">
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <a href="/nexus.pdf" target="_blank" rel="noreferrer" className="group rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Nexus overview · PDF</p><h2 className="mt-3 text-2xl font-bold group-hover:text-[var(--blue)]">What is Nexus RiseGen?</h2><p className="mt-3 leading-7 text-[var(--muted)]">Read about Nexus’s purpose, who it serves, its focus areas, mentorship approach, and safeguarding boundaries.</p><span className="mt-5 inline-flex font-semibold text-[var(--blue)]">Open the Nexus overview →</span></a>
        <a href="/resources/programme-guides" className="group rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-6 transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--deep-green)]">Nexus Core · answer guide</p><h2 className="mt-3 text-2xl font-bold group-hover:text-[var(--blue)]">Programme quiz guides</h2><p className="mt-3 leading-7 text-[var(--muted)]">Review every module question, the correct answer, and the explanation behind it across all three tracks.</p><span className="mt-5 inline-flex font-semibold text-[var(--blue)]">Browse the programme guides →</span></a>
      </div>
    </Section>
    <Section eyebrow="Resource library" title="Good ideas, from trusted voices." tone="cream">
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">Browse practical videos, guides, and learning materials. Search by topic or choose an area to find a useful next step.</p>
      <ResourceLibrary resources={resources} unavailable={unavailable} />
    </Section>
  </>;
}
