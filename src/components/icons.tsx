import type { ReactNode } from "react";
export function Spark({ className = "" }: { className?: string }) { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}><path d="M12 2c.8 5.8 3.9 9.2 9 10-5.1.8-8.2 4.2-9 10-.8-5.8-3.9-9.2-9-10 5.1-.8 8.2-4.2 9-10Z" fill="currentColor" /></svg>; }
export function Arrow() { return <span aria-hidden="true" className="ml-2 text-lg leading-none">→</span>; }
export function Icon({ children }: { children: ReactNode }) { return <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--sky)] text-xl text-[var(--blue)]">{children}</div>; }
