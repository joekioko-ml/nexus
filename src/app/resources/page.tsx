import Link from "next/link";
import { Hero, Section, Card } from "@/components/page-elements";

export default function ResourcesPage() {
  return <>
    <Hero eyebrow="Resources" title="Useful things to return to, share, and make your own." action="For families" href="/for-families"><p>These ideas are designed for everyday moments: a conversation after school, a note to yourself, or a pause before making a decision.</p></Hero>
    <Section eyebrow="Start here" title="Nexus guides and learning support.">
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Link href="/nexus.pdf" target="_blank" className="group rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Nexus overview · PDF</p><h2 className="mt-3 text-2xl font-bold group-hover:text-[var(--blue)]">What is Nexus RiseGen?</h2><p className="mt-3 leading-7 text-[var(--muted)]">Read about Nexus’s purpose, who it serves, its focus areas, mentorship approach, and safeguarding boundaries.</p><span className="mt-5 inline-flex font-semibold text-[var(--blue)]">Open the Nexus overview →</span></Link>
        <Link href="/resources/programme-guides" className="group rounded-3xl border border-[var(--line)] bg-[var(--cream)] p-6 transition hover:-translate-y-1 hover:shadow-lg"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--deep-green)]">Nexus Core · answer guide</p><h2 className="mt-3 text-2xl font-bold group-hover:text-[var(--blue)]">Programme quiz guides</h2><p className="mt-3 leading-7 text-[var(--muted)]">Review every module question, the correct answer, and the explanation behind it across all three tracks.</p><span className="mt-5 inline-flex font-semibold text-[var(--blue)]">Browse the programme guides →</span></Link>
      </div>
    </Section>
    <Section eyebrow="Explore" title="More resources for everyday moments."><div className="mt-10 grid gap-5 md:grid-cols-3"><Card icon={<span className="text-2xl">✎</span>} title="Conversation starters">Simple prompts for talking about goals, choices, confidence, and the things that are hard to name.</Card><Card icon={<span className="text-2xl">↗</span>} title="Next-step notes">Gentle ways to break a big idea into smaller things you can try or explore.</Card><Card icon={<span className="text-2xl">◌</span>} title="Reflection tools">Questions for noticing what is going well, what feels stuck, and what matters to you.</Card></div></Section>
  </>;
}
