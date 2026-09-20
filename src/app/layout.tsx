import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: { default: "Nexus | Find your next step", template: "%s | Nexus" }, description: "Nexus is a youth-led mentorship initiative for teenagers, students, young adults, families, and mentors." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="en"><body><a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a><SiteHeader /><main id="main">{children}</main><SiteFooter /></body></html>; }
