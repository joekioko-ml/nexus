"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitMentorshipRequest, submitSuggestion } from "@/app/actions/contact";
import { initialContactActionState } from "@/lib/contact-action-state";

const inputClass = "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm font-semibold text-slate-800";

function ActionMessage({ state }: { state: typeof initialContactActionState }) {
  if (state.status === "idle") return null;
  const style = state.success !== true
    ? "border-rose-200 bg-rose-50 text-rose-950"
    : state.status === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : state.status === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-950"
        : "border-rose-200 bg-rose-50 text-rose-950";
  return <p className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${style}`} role={state.success === true ? "status" : "alert"}>{state.message}</p>;
}

function SubmitButton({ pending, children }: { pending: boolean; children: string }) {
  return <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-indigo-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-800 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
    {pending && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
    {pending ? "Sending…" : children}
  </button>;
}

function TeamCard({ name, title, role, image, email, phone, children }: { name: string; title: string; role: string; image: string; email: string; phone: string; children?: ReactNode }) {
  return <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_65px_-48px_rgba(15,23,42,.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="grid sm:grid-cols-[10rem_1fr]">
      <div className="relative min-h-64 bg-indigo-100 sm:min-h-full">
        <Image src={image} alt={`${name}, ${title}`} fill sizes="(max-width: 640px) 100vw, 240px" className="object-cover object-center" />
      </div>
      <div className="p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-700">{title}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{name}</h3>
        <p className="mt-3 min-h-14 leading-6 text-slate-600">{role}</p>
        <div className="mt-5 space-y-3 text-sm">
          <a className="block font-semibold text-indigo-800 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-700" href={`mailto:${email}`}>{email}</a>
          <a className="block font-semibold text-slate-700 hover:text-indigo-800" href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
          {children}
        </div>
      </div>
    </div>
  </article>;
}

export default function ContactPage() {
  const [suggestionState, suggestionAction, suggestionPending] = useActionState(submitSuggestion, initialContactActionState);
  const [fallbackRequestState, requestAction, fallbackRequestPending] = useActionState(submitMentorshipRequest, initialContactActionState);
  const [requestState, setRequestState] = useState(initialContactActionState);
  const [localRequestPending, setLocalRequestPending] = useState(false);
  const [supportType, setSupportType] = useState("");
  const suggestionForm = useRef<HTMLFormElement>(null);
  const requestForm = useRef<HTMLFormElement>(null);
  const requestPending = localRequestPending || fallbackRequestPending;
  const visibleRequestState = requestState.status === "idle" ? fallbackRequestState : requestState;

  useEffect(() => {
    if (suggestionState.status === "success" || suggestionState.status === "warning") suggestionForm.current?.reset();
  }, [suggestionState]);
  useEffect(() => {
    if (fallbackRequestState.success === true) requestForm.current?.reset();
  }, [fallbackRequestState]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setLocalRequestPending(true);
    setRequestState(initialContactActionState);

    try {
      const result = await submitMentorshipRequest(initialContactActionState, new FormData(form));
      setRequestState(result);
      if (result.success === true) form.reset();
    } catch {
      setRequestState({ success: false, status: "error", message: "Database connection failed. Please try again." });
    } finally {
      setLocalRequestPending(false);
    }
  }

  return <>
    <div className="bg-gradient-to-b from-slate-50 via-white to-indigo-50/50 pb-24">
      <header className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-indigo-700">Contact Nexus RiseGen</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">Start with the kind of support you need.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Reach the team, share an idea, or ask for a conversation with our safeguarding lead. You choose what to share.</p>
      </header>

      <section aria-labelledby="directory-heading" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="grid gap-5 rounded-[2rem] bg-indigo-950 p-6 text-white shadow-[0_28px_70px_-45px_rgba(30,27,75,.65)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-indigo-200">General directory</p>
            <h2 id="directory-heading" className="mt-2 text-2xl font-bold sm:text-3xl">There’s a person behind every message.</h2>
            <a className="mt-3 inline-flex rounded-sm text-base font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" href="mailto:nexusresigen@gmail.com">nexusresigen@gmail.com</a>
          </div>
          <a href="https://whatsapp.com/channel/0029Vb8cWdZDZ4LRhsbrkw23" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-16 items-center justify-center gap-4 rounded-full bg-emerald-400 py-2 pl-2 pr-6 font-bold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-300 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <Image src="/channel.png" alt="Nexus WhatsApp channel" width={56} height={56} className="size-14 rounded-full border-2 border-white object-cover shadow-sm" />
            <span>Follow the Nexus WhatsApp Channel <span aria-hidden="true">↗</span></span>
          </a>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <TeamCard name="Esther Wanene" title="Initiative Director" role="Partnerships, Official Business, and Mentorship Operations." image="/founder1.jpg" email="estherwanene166@gmail.com" phone="+254 117 086545" />
          <TeamCard name="Joseph Kioko" title="IT & Platform Developer" role="Platform bugs, account access, and technical support." image="/founder2.jpg" email="officialjoe.k.n@gmail.com" phone="+254 143 778075">
            <a className="inline-flex font-semibold text-indigo-800 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-700" href="https://github.com/joekioko-ml" target="_blank" rel="noopener noreferrer">GitHub · @joekioko-ml ↗</a>
            <figure className="mt-4 w-fit">
              <Image src="/qr-code.png" alt="QR code to buy Joseph Kioko a coffee" width={184} height={184} className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" />
              <figcaption className="mt-2 text-xs font-medium text-slate-500">Scan to buy me a coffee ☕</figcaption>
            </figure>
          </TeamCard>
        </div>
      </section>

      <section aria-labelledby="suggestion-heading" className="border-y border-indigo-100 bg-indigo-50/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-indigo-700">Suggestion box</p>
            <h2 id="suggestion-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Help us make Nexus better.</h2>
            <p className="mt-4 leading-7 text-slate-600">Share a small idea, tell us what felt unclear, or suggest something that would make the platform more helpful.</p>
          </div>
          <form action={suggestionAction} ref={suggestionForm} className="rounded-[2rem] border border-indigo-100 bg-white p-5 shadow-sm sm:p-8">
            <label className={labelClass} htmlFor="suggestion">Suggestion <span className="text-rose-700" aria-hidden="true">*</span></label>
            <textarea id="suggestion" name="suggestion" required minLength={5} maxLength={3000} rows={4} className={inputClass} placeholder="What could we improve?" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><label className={labelClass} htmlFor="suggestion-name">Name <span className="font-normal text-slate-500">(optional)</span></label><input id="suggestion-name" name="name" maxLength={120} autoComplete="name" className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="suggestion-email">Email <span className="font-normal text-slate-500">(optional)</span></label><input id="suggestion-email" name="email" type="email" maxLength={254} autoComplete="email" className={inputClass} /></div>
            </div>
            <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="mt-6"><SubmitButton pending={suggestionPending}>Send suggestion</SubmitButton></div>
            <ActionMessage state={suggestionState} />
          </form>
        </div>
      </section>

      <section aria-labelledby="mentorship-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.16em] text-indigo-700">Safe Harbor · mentorship request</p>
            <h2 id="mentorship-heading" className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Tell us what kind of support would help.</h2>
            <p className="mt-5 rounded-2xl border-l-4 border-indigo-500 bg-indigo-50 px-5 py-4 text-base leading-7 text-indigo-950">Nexus provides community peer support and mentorship. We are not a clinical therapy or emergency medical service.</p>
            <div className="mt-6 flex gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mt-0.5 size-7 shrink-0 stroke-current" strokeWidth="1.8"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" strokeLinecap="round" /></svg>
              <div><p className="font-bold">Data is encrypted in transit and protected by strict Row Level Security (RLS).</p><p className="mt-2 text-sm leading-6 text-emerald-900">The database record is insert-only for the web and readable only by the safeguarding_lead role. A separate notification copy is emailed to nexusresigen@gmail.com; please share only the details needed for a response.</p></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">Share only what you feel comfortable sharing. The form is not monitored for emergencies.</p>
          </div>

          <form action={requestAction} onSubmit={handleSubmit} ref={requestForm} onReset={() => setSupportType("")} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_22px_65px_-48px_rgba(15,23,42,.45)] sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className={labelClass} htmlFor="request-name">Name <span className="text-rose-700" aria-hidden="true">*</span></label><input id="request-name" name="name" required maxLength={120} autoComplete="name" className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="request-email">Email <span className="text-rose-700" aria-hidden="true">*</span></label><input id="request-email" name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /></div>
            </div>
            <div className="mt-5">
              <label className={labelClass} htmlFor="age-stage">Age / Life Stage <span className="text-rose-700" aria-hidden="true">*</span></label>
              <select id="age-stage" name="age_stage" required defaultValue="" className={inputClass}>
                <option value="" disabled>Select the option that fits best</option>
                <option>Teen (13–17)</option><option>Young adult (18–24)</option><option>Adult / parent / guardian</option><option>Mentor / other adult</option><option>Prefer not to say</option>
              </select>
            </div>
            <div className="mt-5">
              <label className={labelClass} htmlFor="support-type">What kind of support are you looking for? <span className="text-rose-700" aria-hidden="true">*</span></label>
              <select id="support-type" name="support_type" required value={supportType} onChange={(event) => setSupportType(event.target.value)} className={inputClass}>
                <option value="" disabled>Choose a support area</option>
                <option>Career & Education Guidance</option>
                <option>Navigating a personal struggle / Life transition</option>
                <option>Urgent: I am in distress and need someone to talk to</option>
              </select>
              <UrgentSupportAlert urgent={supportType === "Urgent: I am in distress and need someone to talk to"} />
            </div>
            <div className="mt-5">
              <label className={labelClass} htmlFor="request-story">Your story <span className="text-rose-700" aria-hidden="true">*</span></label>
              <textarea id="request-story" name="story" required minLength={10} maxLength={6000} rows={6} className={inputClass} placeholder="What would you like us to understand? Share only what feels comfortable." />
              <p className="mt-2 text-xs leading-5 text-slate-500">Please don’t use this form to share information that someone could use to access your accounts or locate you.</p>
            </div>
            <label className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <SubmitButton pending={requestPending}>Send mentorship request</SubmitButton>
              <p className="max-w-sm text-xs leading-5 text-slate-500">Our Safeguarding Lead reviews requests daily. Expect a personalized response within 24–48 hours.</p>
            </div>
            <ActionMessage state={visibleRequestState} />
          </form>
        </div>
      </section>
    </div>

    <button type="button" onClick={() => { window.location.href = "https://google.com"; }} className="fixed bottom-5 right-5 z-50 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white bg-rose-700 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_35px_-12px_rgba(127,29,29,.75)] transition hover:-translate-y-0.5 hover:bg-rose-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-rose-500" aria-label="Quick Exit: leave this website">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5 stroke-current" strokeWidth="2"><path d="M5 12h13M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Quick Exit
    </button>
  </>;
}

function UrgentSupportAlert({ urgent }: { urgent: boolean }) {
  if (!urgent) return null;
  return <div role="alert" className="animate-fade-in-down mt-4 rounded-2xl border border-rose-300 bg-rose-50 p-5 pb-16 text-rose-950 shadow-sm sm:pb-5">
    <p className="font-bold">Your safety is our priority.</p>
    <p className="mt-2 text-sm leading-6">If you are in immediate danger or experiencing a mental health crisis, please contact emergency services or support:</p>
    <ul className="mt-3 space-y-2 text-sm leading-6">
      <li><a className="font-bold underline underline-offset-2" href="tel:999">Police Response 999</a> or <a className="font-bold underline underline-offset-2" href="tel:112">112</a> for emergencies.</li>
      <li><a className="font-bold underline underline-offset-2" href="tel:+254722178177">Befrienders Kenya +254 722 178 177</a> (Monday–Friday, 9am–5pm).</li>
      <li><a className="font-bold underline underline-offset-2" href="tel:0800720565">Nairobi Women’s Hospital GVRC 0800 720 565</a> or <a className="font-bold underline underline-offset-2" href="tel:+254719638006">+254 719 638 006</a>.</li>
    </ul>
    <Link href="/crisis-support" className="mt-3 inline-flex font-bold text-rose-900 underline underline-offset-2">See more support options →</Link>
    <p className="mt-2 text-xs leading-5">Befrienders Kenya lists its helpline hours as weekdays, 9am–5pm; call emergency services for immediate danger.</p>
  </div>;
}
