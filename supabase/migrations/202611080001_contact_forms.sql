-- Contact form storage with public insert-only access and safeguarding-only reads.
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'safeguarding_lead') then
    create role safeguarding_lead nologin nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
  end if;
end
$$;

grant safeguarding_lead to authenticator;
grant usage on schema public to safeguarding_lead;

create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  age_stage text not null,
  support_type text not null,
  story text not null,
  created_at timestamptz not null default now(),
  constraint mentorship_requests_name_length check (char_length(trim(name)) between 1 and 120),
  constraint mentorship_requests_email_format check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint mentorship_requests_age_stage check (age_stage in ('Teen (13–17)', 'Young adult (18–24)', 'Adult / parent / guardian', 'Mentor / other adult', 'Prefer not to say')),
  constraint mentorship_requests_support_type check (support_type in ('Career & Education Guidance', 'Navigating a personal struggle / Life transition', 'Urgent: I am in distress and need someone to talk to')),
  constraint mentorship_requests_story_length check (char_length(trim(story)) between 10 and 6000)
);

create table if not exists public.platform_suggestions (
  id uuid primary key default gen_random_uuid(),
  suggestion text not null,
  name text,
  email text,
  created_at timestamptz not null default now(),
  constraint platform_suggestions_length check (char_length(trim(suggestion)) between 5 and 3000),
  constraint platform_suggestions_name_length check (name is null or char_length(name) <= 120),
  constraint platform_suggestions_email_format check (email is null or email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')
);

alter table public.mentorship_requests enable row level security;
alter table public.mentorship_requests force row level security;
alter table public.platform_suggestions enable row level security;
alter table public.platform_suggestions force row level security;

revoke all on table public.mentorship_requests from public, anon, authenticated, service_role;
revoke all on table public.platform_suggestions from public, anon, authenticated, service_role;

grant insert on table public.mentorship_requests to anon, authenticated;
grant select on table public.mentorship_requests to safeguarding_lead;
grant insert on table public.platform_suggestions to anon, authenticated;

drop policy if exists mentorship_requests_web_insert on public.mentorship_requests;
create policy mentorship_requests_web_insert
  on public.mentorship_requests for insert to anon, authenticated
  with check (true);

drop policy if exists mentorship_requests_safeguarding_read on public.mentorship_requests;
create policy mentorship_requests_safeguarding_read
  on public.mentorship_requests for select to safeguarding_lead
  using (true);

drop policy if exists platform_suggestions_web_insert on public.platform_suggestions;
create policy platform_suggestions_web_insert
  on public.platform_suggestions for insert to anon, authenticated
  with check (true);
