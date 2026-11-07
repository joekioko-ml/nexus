"use client";

import { useState } from "react";
import { Hero, Section } from "@/components/page-elements";

type Perspective = "parent" | "youth";

type BridgeCard = {
  id: string;
  title: string;
  icon: string;
  parent: { translation: string; action: string };
  youth: { translation: string; action: string };
};

const bridgeCards: BridgeCard[] = [
  {
    id: "education-careers",
    title: "Education & Modern Careers",
    icon: "✳",
    parent: {
      translation: "Your child may want to skip traditional university for a tech bootcamp, freelance work, or TVET. They aren't throwing their future away; they are looking at a modern job market that often values skills and portfolios over paper degrees.",
      action: "Ask to see a project they’ve built or a skill they've learned today, rather than asking about their grades.",
    },
    youth: {
      translation: "Your parents pushing for a traditional degree aren't trying to trap you. To their generation, a degree was the only guaranteed path to financial safety. They are acting out of protective fear.",
      action: "Show them the job requirements for a modern tech role to frame your path as a strategic career choice, not just 'dropping out'.",
    },
  },
  {
    id: "wellness-exhaustion",
    title: "Mental Wellness & Exhaustion",
    icon: "☼",
    parent: {
      translation: "If your child is constantly tired, isolating, or irritable, it may not be 'teenage rebellion' or laziness. It could be burnout or depression. The pressure on today’s youth is continuous.",
      action: "Instead of asking 'What do you have to be stressed about?', try saying, 'You seem overwhelmed. How can I help take something off your plate?'",
    },
    youth: {
      translation: "Your parents might dismiss your burnout by comparing it to their own past hardships. They aren't trying to minimize your pain; they just grew up in a culture that didn't have the vocabulary for mental health.",
      action: "Explain your feelings using physical terms they understand, like 'My brain feels like a battery that won't recharge,' instead of clinical psychological terms.",
    },
  },
  {
    id: "family-dynamics",
    title: "Broken-Family Dynamics",
    icon: "⌂",
    parent: {
      translation: "When parents conflict or separate, children often feel forced to choose sides or act as emotional caretakers. This trauma can last a lifetime.",
      action: "Set a strict boundary to never vent about your co-parent to your child. Let them be a youth, not your therapist.",
    },
    youth: {
      translation: "It is not your job to fix your parents' relationship or absorb their anger. When the family breaks, it is easy to feel like it’s your fault—it never is.",
      action: "It is okay to protect your peace. You are allowed to say, 'I love you, but I can't be the person you complain to about this.'",
    },
  },
  {
    id: "digital-life",
    title: "Digital Life & Screen Time",
    icon: "⌘",
    parent: {
      translation: "To you, the phone is a distraction. To your child, it is their primary community, study group, and social lifeline. Taking it away as a punishment isolates them completely from their peers.",
      action: "Negotiate 'tech-free' family hours together rather than confiscating devices unpredictably.",
    },
    youth: {
      translation: "Your parents' fear of the internet is based on real dangers—scams, predators, and cyberbullying. When they ask what you are doing online, it usually comes from anxiety, not a desire to ruin your fun.",
      action: "Share one positive thing you did online today (a coding tutorial, a good chat) to demystify the screen for them.",
    },
  },
  {
    id: "independence-trust",
    title: "Independence & Trust",
    icon: "↗",
    parent: {
      translation: "Your teenager pulling away and wanting privacy is a healthy, necessary stage of development, not a rejection of your love. They are practicing how to be independent adults.",
      action: "Shift your parenting from being a 'manager' to a 'consultant.' Offer advice when asked, but let them make (and learn from) safe mistakes.",
    },
    youth: {
      translation: "Your parents are grieving the fact that you don't need them the way you used to. Their sudden strictness or questioning is often a reaction to losing control as you grow up.",
      action: "Earn their trust proactively. Tell them your plans before they have to ask—it reduces their anxiety and gives you more freedom.",
    },
  },
  {
    id: "emotional-communication",
    title: "Emotional Communication",
    icon: "♡",
    parent: {
      translation: "Telling a youth to 'toughen up' or 'stop crying' teaches them to hide their struggles until it becomes a crisis. Real resilience comes from feeling heard and supported.",
      action: "Validate their feelings before offering solutions. Say, 'That sounds incredibly hard,' before telling them what to do.",
    },
    youth: {
      translation: "Older generations were often raised to suppress emotions to survive. If your parent seems emotionally distant or awkward when you cry, they may literally not know how to process it.",
      action: "Tell them exactly what you need. Say, 'I don't need you to fix this, I just need you to listen to me for five minutes.'",
    },
  },
];

export default function FamiliesPage() {
  const [perspective, setPerspective] = useState<Perspective>("parent");
  const [openCard, setOpenCard] = useState<string | null>(null);

  return <div className="families-bridge-page">
    <Hero eyebrow="For families · The Nexus Bridge" title="A generational translation guide." action="Explore resources" href="/resources" backgroundImage="/background4.jpeg" hideDecoration overlay className="families-bridge-hero" titleClassName="text-white">
      <span className="text-white">A little help understanding what’s underneath the words. Choose your perspective, explore a common point of tension, and find one practical next step.</span>
    </Hero>

    <Section eyebrow="The Nexus Bridge" title="Translate the moment. Find a way forward." className="families-bridge-content">
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">Parents and young people can care deeply about each other and still see the same situation differently. This open guide helps both sides understand the meaning behind the message and try a small, respectful action.</p>

      <div className="mt-9 rounded-[2rem] border border-[var(--line)] bg-white p-4 shadow-[0_24px_60px_-42px_rgb(8_40_100_/_38%)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--blue)]">Choose your point of view</p>
            <p className="mt-1 text-sm text-[var(--muted)]">The guide changes its translation and suggested action.</p>
          </div>
          <div role="group" aria-label="Choose a perspective" className="grid grid-cols-2 rounded-2xl bg-[var(--paper)] p-1.5">
            <button type="button" onClick={() => setPerspective("parent")} aria-label="I am viewing as a Parent / Guardian" aria-pressed={perspective === "parent"} className={`rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 sm:px-5 ${perspective === "parent" ? "bg-[var(--navy)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--navy)]"}`}><span className="block text-[11px] font-medium opacity-80">I am viewing as a</span><span>Parent / Guardian</span></button>
            <button type="button" onClick={() => setPerspective("youth")} aria-label="I am viewing as a Youth / Student" aria-pressed={perspective === "youth"} className={`rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 sm:px-5 ${perspective === "youth" ? "bg-[var(--navy)] text-white shadow-md" : "text-[var(--muted)] hover:text-[var(--navy)]"}`}><span className="block text-[11px] font-medium opacity-80">I am viewing as a</span><span>Youth / Student</span></button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{perspective === "parent" ? "I am viewing as a Parent / Guardian" : "I am viewing as a Youth / Student"}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bridgeCards.map((card, index) => {
          const isOpen = openCard === card.id;
          const content = card[perspective];
          const panelId = `${card.id}-translation`;
          return <article key={card.id} className={`group overflow-hidden rounded-[1.75rem] border bg-white transition-all duration-300 ${isOpen ? "border-[var(--blue)] shadow-[0_22px_55px_-35px_rgb(8_40_100_/_55%)]" : "border-[var(--line)] shadow-[0_18px_45px_-38px_rgb(8_40_100_/_38%)] hover:-translate-y-1 hover:shadow-[0_24px_45px_-32px_rgb(8_40_100_/_30%)]"}`}>
            <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenCard(isOpen ? null : card.id)} className="flex w-full items-start gap-4 p-5 text-left sm:p-6">
              <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--cream)] text-2xl text-[var(--blue)] transition group-hover:rotate-3 group-hover:scale-105">{card.icon}</span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-bold uppercase tracking-[.14em] text-[var(--blue)]">Bridge {String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-lg font-bold leading-snug text-[var(--navy)]">{card.title}</span></span>
              <span aria-hidden="true" className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--paper)] text-xl text-[var(--navy)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div id={panelId} aria-hidden={!isOpen} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-[var(--line)] px-5 pb-6 pt-5 sm:px-6">
                  <div className="rounded-2xl bg-[var(--paper)] p-4 sm:p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--deep-green)]">The translation</p><p className="mt-2 leading-7 text-[var(--navy)]">{content.translation}</p></div>
                  <div className="mt-3 rounded-2xl bg-[var(--blue)]/[.06] p-4 sm:p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--blue)]">The actionable step</p><p className="mt-2 leading-7 text-[var(--navy)]">{content.action}</p></div>
                </div>
              </div>
            </div>
          </article>;
        })}
      </div>
      <p className="mt-7 text-sm leading-6 text-[var(--muted)]">You can switch perspectives at any time. These prompts are conversation starters; choose what feels safe and useful for your family.</p>
    </Section>

    <div className="families-safeguarding-banner fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-blue-950 text-white shadow-[0_-12px_35px_-20px_rgb(8_40_100_/_65%)]" role="region" aria-label="Immediate support">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
        <p className="max-w-4xl text-sm leading-6 text-white/90 sm:text-base">Need immediate support? The Nexus platform is a community space, not a medical or crisis service. If you or a family member are in immediate distress, please reach out to professional help.</p>
        <a href="/crisis-support" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-blue-950 shadow transition hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-white">View Emergency Contacts <span aria-hidden="true" className="ml-2">→</span></a>
      </div>
    </div>
  </div>;
}
