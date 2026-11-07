"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const Stories = dynamic(() => import("react-insta-stories"), { ssr: false });

type Story = { id: string; media_url: string; caption: string; created_at: string };

const mentorshipSlides = [
  { label: "Start with your voice", title: "Your goals belong to you.", text: "A mentor can help you explore options and make a plan. You get to choose what feels right for your life." },
  { label: "A good conversation", title: "You don’t need a perfect question.", text: "Bring a rough idea, a worry, or something you’re curious about. Starting anywhere is still a start." },
  { label: "Growing takes practice", title: "Small steps count as progress.", text: "Try one manageable next step, notice what you learn, and adjust as you go. You are allowed to change direction." },
  { label: "Support with respect", title: "A mentor listens without taking over.", text: "Good mentorship makes room for your perspective, your boundaries, and your decisions." },
];

export function MentorshipStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/mentorship-stories")
      .then(async (response) => {
        if (!response.ok) throw new Error("Stories are temporarily unavailable.");
        return response.json();
      })
      .then(setStories)
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const communityStories = stories.map((story) => ({
    content: () => <div className="relative h-full w-full overflow-hidden bg-slate-900">
      {/* Cloudinary URLs can point to either an image or video asset. */}
      {story.media_url.match(/\.(mp4|webm|mov)(\?|$)/i)
        ? <video src={story.media_url} className="h-full w-full object-cover" autoPlay muted playsInline />
        : <Image src={story.media_url} alt="" fill unoptimized sizes="360px" className="object-cover" />}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-6 pt-20 text-white">
        <p className="text-base font-medium leading-6">{story.caption}</p>
      </div>
    </div>,
  }));

  const guidanceSlides = mentorshipSlides.map((slide, index) => ({
    content: () => <div className={`flex h-full w-full flex-col justify-between p-8 text-white sm:p-12 ${[
      "bg-gradient-to-br from-[#082864] via-[#1269c4] to-[#236443]",
      "bg-gradient-to-br from-[#236443] via-[#70a841] to-[#082864]",
      "bg-gradient-to-br from-[#1269c4] via-[#2497dd] to-[#082864]",
      "bg-gradient-to-br from-[#082864] via-[#236443] to-[#70a841]",
    ][index]}`}>
      <span className="w-fit rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em]">{slide.label}</span>
      <div className="max-w-3xl pb-4">
        <h3 className="text-3xl font-bold leading-tight sm:text-5xl">{slide.title}</h3>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-xl sm:leading-8">{slide.text}</p>
      </div>
      <p className="text-sm font-semibold tracking-wide text-white/70">NEXUS · YOUTH MENTORSHIP</p>
    </div>,
  }));
  const storyItems = [...communityStories, ...guidanceSlides];

  return <div className="w-full overflow-hidden rounded-3xl shadow-[0_24px_60px_-35px_rgb(8_40_100_/_55%)]">
    {error && <p className="mb-3 text-sm text-[var(--muted)]">{error} Showing mentorship guidance slides instead.</p>}
    <Stories stories={storyItems} width="100%" height={600} defaultInterval={7000} keyboardNavigation />
  </div>;
}
