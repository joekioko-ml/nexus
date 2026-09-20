import Image from "next/image";

const logoSrc: string | null = "/logo.jpg";

export function BrandMark({ inverse = false }: { inverse?: boolean }) {
  if (logoSrc) {
    return <Image src={logoSrc} alt="Nexus Risegen Initiative" width={176} height={48} className="h-10 w-auto" />;
  }

  const text = inverse ? "text-[var(--warm-ivory)]" : "text-[var(--navy)]";

  return <span className={`flex items-center gap-2.5 ${text}`}><span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--royal-blue)] text-white shadow-sm"><svg viewBox="0 0 40 40" fill="none" className="size-7"><circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.8" /><path d="M7 20h26M20 7c4.1 3.6 6.2 7.9 6.2 13S24.1 29.4 20 33M20 7c-4.1 3.6-6.2 7.9-6.2 13S15.9 29.4 20 33" stroke="currentColor" strokeWidth="1.4" /><circle cx="12" cy="14" r="2.6" fill="var(--warm-gold)" /><circle cx="28" cy="24.5" r="2.6" fill="var(--leaf-green)" /><circle cx="20" cy="29" r="2.6" fill="var(--sky-blue)" /></svg></span><span className="flex flex-col leading-none"><span className="text-lg font-extrabold tracking-tight">Nexus</span><span className={`mt-1 text-[.56rem] font-bold uppercase tracking-[.13em] ${inverse ? "text-white/70" : "text-[var(--deep-green)]"}`}>Risegen Initiative</span></span></span>;
}
