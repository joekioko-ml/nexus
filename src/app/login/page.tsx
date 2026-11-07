import Link from "next/link";
import { loginAction } from "@/app/auth-actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string; registered?: string }> }) {
  const query = await searchParams;
  return <section className="mx-auto max-w-xl px-5 py-16 sm:py-24">
    <p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--blue)]">Member access</p>
    <h1 className="mt-3 text-4xl font-bold">Welcome back</h1>
    <p className="mt-4 text-[var(--muted)]">Sign in to continue your Nexus Core learning journey.</p>
    {query.error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{query.error === "use-admin-login" ? "Use the separate administrator sign-in below." : "Sign-in failed. Check your email and password."}</p>}
    {query.registered && <p className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">Your account is ready. Sign in to continue.</p>}
    <form action={loginAction} className="mt-8 space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <input type="hidden" name="callbackUrl" value={query.callbackUrl || "/programmes"} />
      <label className="block text-sm font-semibold">Email<input required name="email" type="email" autoComplete="email" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
      <label className="block text-sm font-semibold">Password<input required name="password" type="password" autoComplete="current-password" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
      <button className="w-full rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white">Sign in</button>
    </form>
    <p className="mt-5 text-sm text-[var(--muted)]">New to Nexus? <Link className="font-semibold text-[var(--blue)] underline" href="/register">Create a member account</Link></p>
  </section>;
}
