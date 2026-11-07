create extension if not exists pgcrypto;

create table if not exists public.core_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  type text not null check (type in ('Video', 'Link')),
  url text not null unique,
  description text not null
);

create index if not exists core_resources_category_title_idx
  on public.core_resources (category, title);

alter table public.core_resources enable row level security;

drop policy if exists "Anyone can read core resources" on public.core_resources;
create policy "Anyone can read core resources"
  on public.core_resources for select to anon, authenticated using (true);
