import Link from "next/link";
import { registerMemberAction } from "@/app/auth-actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="mx-auto max-w-xl px-5 py-16 sm:py-24">
    <p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Join Nexus</p>
    <h1 className="mt-3 text-4xl font-bold">Create your learning account</h1>
    <p className="mt-4 text-[var(--muted)]">Your account tracks module progress and badges across Nexus Core.</p>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{error === "exists" ? "An account with that email already exists." : "Check your details. Use a password of at least 12 characters."}</p>}
    <form action={registerMemberAction} className="mt-8 space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold">Name<input required minLength={2} name="name" autoComplete="name" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
      <label className="block text-sm font-semibold">Email<input required name="email" type="email" autoComplete="email" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
      <label className="block text-sm font-semibold">Password<input required minLength={12} name="password" type="password" autoComplete="new-password" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /><span className="mt-1 block font-normal text-[var(--muted)]">Use at least 12 characters.</span></label>
      <button className="w-full rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white">Create account</button>
    </form>
    <p className="mt-5 text-sm text-[var(--muted)]">Already registered? <Link className="font-semibold text-[var(--blue)] underline" href="/login">Sign in</Link></p>
  </section>;
}
