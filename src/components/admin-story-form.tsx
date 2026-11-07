"use client";

import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";

export function AdminStoryForm() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("Saving story…");
    const response = await fetch("/api/mentorship-stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ media_url: mediaUrl, caption }) });
    const result = await response.json(); setMessage(response.ok ? "Story published." : result.error ?? "Could not publish the story.");
    if (response.ok) { setMediaUrl(""); setCaption(""); }
  }
  return <form onSubmit={publish} className="space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6">
    <div><h3 className="text-xl font-bold">Publish an Insta-story</h3><p className="mt-1 text-sm text-[var(--muted)]">Stories are limited to the latest ten; publishing an eleventh removes the oldest.</p></div>
    <CldUploadButton uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER, multiple: false, sources: ["local", "camera"] }} onSuccess={(result) => { const info = (result as { info?: { secure_url?: string } }).info; if (info?.secure_url) setMediaUrl(info.secure_url); }} className="rounded-full border border-[var(--line)] px-5 py-3 font-semibold">{mediaUrl ? "Replace media" : "Choose media"}</CldUploadButton>
    {mediaUrl && <p className="text-sm text-[var(--deep-green)]">Media is ready to publish.</p>}
    <label className="block text-sm font-semibold">Caption<textarea value={caption} onChange={(event) => setCaption(event.target.value)} required maxLength={500} rows={3} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <button disabled={!mediaUrl} className="rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white disabled:opacity-50">Publish story</button>
    {message && <p role="status" className="text-sm">{message}</p>}
  </form>;
}
