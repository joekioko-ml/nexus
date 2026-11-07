import { Hero, Section } from "@/components/page-elements";

const contacts = [
  {
    title: "Immediate emergency",
    numbers: ["999", "112", "911"],
    description: "Kenya National Police Service emergency hotlines. Call if someone is in immediate danger or needs urgent help.",
    source: "National Police Service",
    href: "https://www.nationalpolice.go.ke/sites/default/files/2025-01/NPS%20Service%20Standards.pdf",
  },
  {
    title: "Mental health support",
    numbers: ["1199"],
    description: "Kenya Red Cross mental health support hotline. Kenya Red Cross reported providing support through this hotline in 2025.",
    source: "Kenya Medical Research Institute",
    href: "https://www.kemri.go.ke/kemri-and-partners-launch-handbook-to-strengthen-suicide-prevention/",
  },
  {
    title: "Child Helpline Kenya",
    numbers: ["116"],
    description: "A child helpline for children and young people who need help or protection.",
    source: "Kenya Ministry of Health tele-mental health guidelines",
    href: "https://www.mntrh.go.ke/sites/default/files/2024-10/M.O.H-National-Tele-Mental-Health-Guidelines-January-2021.pdf",
  },
];

export default function CrisisSupportPage() {
  return <>
    <Hero eyebrow="Immediate support" title="You deserve support from a real person." action="Back to For Families" href="/for-families" hideDecoration>
      <p>If there is immediate danger, call your local emergency service or ask a trusted person nearby to stay with you and help make the call.</p>
    </Hero>
    <Section eyebrow="Kenya contacts" title="Reach out for urgent help.">
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">These contacts are listed for people in Kenya. If you are somewhere else, contact your local emergency number or a crisis service in your area.</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {contacts.map((contact) => <article key={contact.title} className="flex flex-col rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">{contact.title}</h2>
          <p className="mt-3 flex-1 leading-7 text-[var(--muted)]">{contact.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{contact.numbers.map((number) => <a key={number} href={`tel:${number}`} className="rounded-full bg-[var(--navy)] px-5 py-3 text-lg font-bold tracking-wide text-white transition hover:bg-[var(--blue)]">Call {number}</a>)}</div>
          <a href={contact.href} target="_blank" rel="noopener noreferrer" className="mt-5 text-sm font-semibold text-[var(--blue)] underline underline-offset-4">Source: {contact.source} ↗</a>
        </article>)}
      </div>
    </Section>
    <Section tone="cream" eyebrow="A note from Nexus" title="This page cannot respond to emergencies.">
      <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">Nexus is a community learning and mentorship space, not a medical, counselling, or crisis service. If you can, tell a trusted adult or health professional what is happening and stay with someone safe while you reach support.</p>
    </Section>
  </>;
}
