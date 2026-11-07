"use client";

import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";

type UploadInfo = { secure_url?: string };

export function MentorshipStoryAdmin() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Saving story…");
    const response = await fetch("/api/mentorship-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ media_url: mediaUrl, caption }),
    });
    const result = await response.json();
    setStatus(response.ok ? "Story published." : result.error ?? "Could not publish the story.");
    if (response.ok) { setMediaUrl(""); setCaption(""); }
  }

  return <form onSubmit={submit} className="mt-8 max-w-xl space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6">
    <div>
      <p className="font-bold">Publish a story</p>
      <p className="mt-1 text-sm text-[var(--muted)]">Upload a photo or video, add a caption, then publish.</p>
    </div>
    <CldUploadButton
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER, multiple: false, sources: ["local", "camera"] }}
      onSuccess={(result) => {
        const info = (result as { info?: UploadInfo }).info;
        if (info?.secure_url) setMediaUrl(info.secure_url);
      }}
      className="rounded-full border border-[var(--line)] px-5 py-3 font-semibold"
    >
      {mediaUrl ? "Choose a different file" : "Choose media"}
    </CldUploadButton>
    {mediaUrl && <p className="truncate text-sm text-[var(--deep-green)]">Media uploaded and ready to publish.</p>}
    <label className="block text-sm font-semibold">Caption
      <textarea value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} required rows={3} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" />
    </label>
    <label className="block text-sm font-semibold">Admin token
      <input type="password" value={adminToken} onChange={(event) => setAdminToken(event.target.value)} required autoComplete="current-password" className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" />
    </label>
    <button disabled={!mediaUrl} className="rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white disabled:opacity-50">Publish story</button>
    {status && <p role="status" className="text-sm">{status}</p>}
  </form>;
}
