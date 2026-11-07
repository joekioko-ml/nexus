import Link from "next/link";
import { adminLoginAction } from "@/app/auth-actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="mx-auto max-w-xl px-5 py-16 sm:py-24">
    <p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--deep-green)]">Nexus staff access</p>
    <h1 className="mt-3 text-4xl font-bold">Administrator sign in</h1>
    <p className="mt-4 text-[var(--muted)]">This sign-in is reserved for accounts with the admin role.</p>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">Sign-in failed. Check the administrator email and password.</p>}
    <form action={adminLoginAction} className="mt-8 space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold">Admin email<input required name="email" type="email" autoComplete="username" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
      <label className="block text-sm font-semibold">Password<input required name="password" type="password" autoComplete="current-password" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
      <button className="w-full rounded-full bg-[var(--navy)] px-5 py-3 font-semibold text-white">Sign in to admin</button>
    </form>
    <p className="mt-5 text-sm text-[var(--muted)]">Member? <Link href="/login" className="font-semibold text-[var(--blue)] underline">Use member sign in</Link></p>
  </section>;
}
