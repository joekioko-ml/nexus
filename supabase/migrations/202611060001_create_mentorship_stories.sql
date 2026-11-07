create table if not exists public.mentorship_stories (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

alter table public.mentorship_stories enable row level security;

-- Public reads are used by the Mentorship stories feed. Inserts use the
-- server-side Supabase secret key after the admin token check in the API route.
create policy "Anyone can read mentorship stories"
  on public.mentorship_stories for select
  to anon, authenticated
  using (true);
