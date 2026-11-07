"use client";

import { CldUploadButton } from "next-cloudinary";
import { saveExternalProgramme } from "@/app/admin/actions";
import { useState } from "react";

type Programme = { id: string; title: string; organization: string; description: string; location: string | null; deadline: string | null; apply_url: string | null; image_url: string | null; is_active: boolean };

export function ExternalProgrammeForm({ programme }: { programme?: Programme }) {
  const [imageUrl, setImageUrl] = useState(programme?.image_url ?? "");
  return <form action={saveExternalProgramme} className="grid gap-4 rounded-3xl border border-[var(--line)] bg-white p-6 sm:grid-cols-2">
    {programme && <input type="hidden" name="id" value={programme.id} />}
    <label className="text-sm font-semibold">Programme title<input required name="title" defaultValue={programme?.title} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <label className="text-sm font-semibold">Organization<input required name="organization" defaultValue={programme?.organization} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <label className="text-sm font-semibold sm:col-span-2">Description<textarea required name="description" defaultValue={programme?.description} rows={3} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <label className="text-sm font-semibold">Location<input name="location" defaultValue={programme?.location ?? ""} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <label className="text-sm font-semibold">Application deadline<input type="date" name="deadline" defaultValue={programme?.deadline?.slice(0, 10) ?? ""} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <label className="text-sm font-semibold sm:col-span-2">Application link<input type="url" name="apply_url" defaultValue={programme?.apply_url ?? ""} className="mt-2 block w-full rounded-xl border border-[var(--line)] p-3 font-normal" /></label>
    <div className="sm:col-span-2"><p className="mb-2 text-sm font-semibold">Cover image</p><CldUploadButton uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} options={{ folder: process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER, multiple: false, sources: ["local", "camera"] }} onSuccess={(result) => { const info = (result as { info?: { secure_url?: string } }).info; if (info?.secure_url) setImageUrl(info.secure_url); }} className="rounded-full border border-[var(--line)] px-5 py-3 font-semibold">{imageUrl ? "Replace image" : "Upload cover image"}</CldUploadButton><input type="hidden" name="image_url" value={imageUrl} />{imageUrl && <p className="mt-2 truncate text-sm text-[var(--deep-green)]">Cover image attached.</p>}</div>
    <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" name="is_active" defaultChecked={programme?.is_active ?? true} />Show on the public noticeboard</label>
    <button className="w-fit rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white">{programme ? "Save changes" : "Add programme"}</button>
  </form>;
}
