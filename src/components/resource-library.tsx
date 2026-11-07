"use client";

import { useMemo, useState } from "react";

export type CoreResource = {
  id: string;
  title: string;
  category: string;
  type: "Video" | "Link";
  url: string;
  description: string;
};

export function ResourceLibrary({ resources, unavailable = false }: { resources: CoreResource[]; unavailable?: boolean }) {
  const [category, setCategory] = useState("All topics");
  const [query, setQuery] = useState("");
  const categories = useMemo(() => ["All topics", ...Array.from(new Set(resources.map((resource) => resource.category)))], [resources]);
  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = category === "All topics" || resource.category === category;
      const matchesQuery = !normalizedQuery || `${resource.title} ${resource.category} ${resource.description}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, resources]);

  return <div className="mt-9">
    <div className="flex flex-col gap-4 rounded-3xl border border-[var(--line)] bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-[var(--paper)] px-4 py-3">
        <span aria-hidden="true" className="text-xl text-[var(--blue)]">⌕</span>
        <span className="sr-only">Search resources</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources, topics, or skills" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]" />
        {query && <button type="button" onClick={() => setQuery("")} className="text-xs font-semibold text-[var(--blue)] hover:underline">Clear</button>}
      </label>
      <p className="shrink-0 text-sm font-semibold text-[var(--muted)]" aria-live="polite">{filteredResources.length} {filteredResources.length === 1 ? "resource" : "resources"}</p>
    </div>

    <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Filter resources by topic">
      {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${category === item ? "bg-[var(--navy)] text-white shadow-md" : "border border-[var(--line)] bg-white text-[var(--navy)] hover:border-[var(--blue)] hover:text-[var(--blue)]"}`}>{item}</button>)}
    </div>

    {unavailable ? <div role="status" className="mt-7 rounded-3xl border border-amber-200 bg-amber-50 p-7 text-amber-950"><h3 className="text-lg font-bold">The resource library is temporarily unavailable.</h3><p className="mt-2 leading-7">Please try again shortly. The Nexus guides above are still available.</p></div> : filteredResources.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filteredResources.map((resource, index) => <article key={resource.id} className="group flex h-full flex-col rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_18px_45px_-38px_rgb(8_40_100_/_38%)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_45px_-32px_rgb(8_40_100_/_30%)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--cream)] px-3 py-1.5 text-xs font-bold text-[var(--deep-green)]">{resource.category}</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]"><span aria-hidden="true" className="text-base text-[var(--blue)]">{resource.type === "Video" ? "▶" : "↗"}</span>{resource.type}</span>
        </div>
        <p className="mt-5 text-xs font-semibold text-[var(--blue)]">{String(index + 1).padStart(2, "0")} <span className="mx-1 text-[var(--line)]">/</span> A resource to explore</p>
        <h3 className="mt-2 text-xl font-bold leading-snug text-[var(--navy)] group-hover:text-[var(--blue)]">{resource.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">{resource.description}</p>
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-between gap-3 rounded-2xl bg-[var(--paper)] px-4 py-3 text-sm font-bold text-[var(--navy)] transition group-hover:bg-[var(--navy)] group-hover:text-white" aria-label={`${resource.type === "Video" ? "Watch" : "Open"} ${resource.title} in a new tab`}>
          <span>{resource.type === "Video" ? "Watch video" : "Open resource"}</span><span aria-hidden="true">↗</span>
        </a>
      </article>)}
    </div> : <div className="mt-7 rounded-3xl border border-dashed border-[var(--line)] bg-white/80 p-8 text-center sm:p-12"><span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--cream)] text-2xl text-[var(--blue)]">⌕</span><h3 className="mt-4 text-xl font-bold">{resources.length ? "No matching resources" : "Resources are on their way"}</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">{resources.length ? "Try another topic or a shorter search phrase." : "Check back soon for practical videos and guides from trusted organizations."}</p>{(query || category !== "All topics") && <button type="button" onClick={() => { setCategory("All topics"); setQuery(""); }} className="mt-5 rounded-full bg-[var(--blue)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--navy)]">Show all resources</button>}</div>}
  </div>;
}
