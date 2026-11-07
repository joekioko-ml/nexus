create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

-- After the intended staff member registers, grant the first admin role with:
-- update public.users set role = 'admin' where email = 'staff@example.org';

create table if not exists public.core_tracks (
  id text primary key,
  title text not null,
  focus text not null,
  badge_name text not null,
  badge_key text not null unique,
  display_order smallint not null unique check (display_order between 1 and 3)
);

create table if not exists public.core_modules (
  id text primary key,
  track_id text not null references public.core_tracks(id) on delete cascade,
  module_number smallint not null check (module_number between 1 and 10),
  title text not null,
  content text not null,
  unique (track_id, module_number)
);

create table if not exists public.module_progress (
  user_id uuid not null references public.users(id) on delete cascade,
  module_id text not null references public.core_modules(id) on delete cascade,
  status text not null default 'completed' check (status in ('in_progress', 'completed')),
  completion_date timestamptz,
  primary key (user_id, module_id),
  check ((status = 'completed' and completion_date is not null) or status = 'in_progress')
);

create table if not exists public.earned_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  track_id text not null references public.core_tracks(id) on delete cascade,
  badge_key text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, track_id)
);

create table if not exists public.external_programmes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  organization text not null,
  location text,
  apply_url text,
  image_url text,
  deadline timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.core_tracks (id, title, focus, badge_name, badge_key, display_order) values
('leadership-community', 'Leadership & Community Transformation', 'Personal growth, servant leadership, and family strengthening.', 'Catalyst Badge', 'catalyst', 1),
('mental-wellness', 'Mental Wellness & Navigating Life', 'Emotional intelligence, trauma awareness, and resilience.', 'Anchor Badge', 'anchor', 2),
('future-readiness', 'Future Readiness & Career Guidance', 'Education mapping, career preparation, and networking.', 'Navigator Badge', 'navigator', 3)
on conflict (id) do update set title = excluded.title, focus = excluded.focus, badge_name = excluded.badge_name, badge_key = excluded.badge_key, display_order = excluded.display_order;

insert into public.core_modules (id, track_id, module_number, title, content) values
('leadership-community-01','leadership-community',1,'Know your values','Identify the values that guide your choices. Write down three strengths and one area you want to grow.'),
('leadership-community-02','leadership-community',2,'Build self-awareness','Notice how your feelings, habits, and decisions affect the people around you.'),
('leadership-community-03','leadership-community',3,'Lead yourself first','Set one realistic weekly goal and make a simple plan to follow through.'),
('leadership-community-04','leadership-community',4,'Listen with curiosity','Practice listening to understand before offering advice or solutions.'),
('leadership-community-05','leadership-community',5,'Practice servant leadership','Choose a useful way to support a group without needing to be the person in charge.'),
('leadership-community-06','leadership-community',6,'Communicate with respect','Use clear, calm language to share an idea and make space for another view.'),
('leadership-community-07','leadership-community',7,'Strengthen family connection','Identify one small action that can make communication or cooperation at home easier.'),
('leadership-community-08','leadership-community',8,'Work through disagreement','Separate the problem from the person and look for a fair next step.'),
('leadership-community-09','leadership-community',9,'Plan a community contribution','Choose a local need, listen to people affected, and outline a modest response.'),
('leadership-community-10','leadership-community',10,'Lead change that lasts','Reflect on what you learned and prepare a simple, shared action plan for positive change.'),
('mental-wellness-01','mental-wellness',1,'Name what you feel','Build an emotion vocabulary and notice that feelings carry information without defining you.'),
('mental-wellness-02','mental-wellness',2,'Understand your stress signals','Recognize your personal signs of stress and the situations that may trigger them.'),
('mental-wellness-03','mental-wellness',3,'Pause and ground','Practice a short grounding routine that helps you return attention to the present.'),
('mental-wellness-04','mental-wellness',4,'Respond instead of react','Create a small pause between a strong feeling and your next action.'),
('mental-wellness-05','mental-wellness',5,'Build healthy boundaries','Identify what feels safe and respectful, and practice expressing a boundary clearly.'),
('mental-wellness-06','mental-wellness',6,'Understand trauma with care','Learn that difficult experiences affect people differently; avoid pressuring anyone to disclose.'),
('mental-wellness-07','mental-wellness',7,'Grow resilience through support','Map trusted people, routines, and places that can help during difficult periods.'),
('mental-wellness-08','mental-wellness',8,'Support a friend responsibly','Listen without judgment, respect privacy, and involve a trusted adult or professional when needed.'),
('mental-wellness-09','mental-wellness',9,'Make a personal wellbeing plan','Choose supportive habits and identify who you can reach out to when you need help.'),
('mental-wellness-10','mental-wellness',10,'Navigate change with confidence','Reflect on your coping tools and create a practical plan for an upcoming transition.'),
('future-readiness-01','future-readiness',1,'Explore interests and strengths','Notice subjects, activities, and problems that hold your interest and energy.'),
('future-readiness-02','future-readiness',2,'Map education pathways','Compare courses, training, and qualifications that connect to your interests.'),
('future-readiness-03','future-readiness',3,'Set a career direction','Choose an area to explore while keeping room for new information and changing goals.'),
('future-readiness-04','future-readiness',4,'Set learning goals','Break a learning goal into weekly actions and identify the support or resources you need.'),
('future-readiness-05','future-readiness',5,'Build transferable skills','Practice communication, teamwork, problem-solving, and digital skills through real tasks.'),
('future-readiness-06','future-readiness',6,'Create a clear resume','Record your education, skills, projects, volunteering, and experience honestly and clearly.'),
('future-readiness-07','future-readiness',7,'Prepare for interviews','Practice explaining your strengths with specific examples and thoughtful questions.'),
('future-readiness-08','future-readiness',8,'Build a professional presence','Create a respectful introduction and keep public profiles accurate and safe.'),
('future-readiness-09','future-readiness',9,'Network with purpose','Reach out with a clear question, show appreciation, and follow up respectfully.'),
('future-readiness-10','future-readiness',10,'Create your next-step roadmap','Set a near-term milestone, a longer-term direction, and a review date for your plan.')
on conflict (id) do update set title = excluded.title, content = excluded.content;

alter table public.users enable row level security;
alter table public.module_progress enable row level security;
alter table public.earned_badges enable row level security;
alter table public.core_tracks enable row level security;
alter table public.core_modules enable row level security;
alter table public.external_programmes enable row level security;

-- All protected writes and reads use the server-side Supabase key. Public programme catalog is readable.
create policy "Anyone can read core tracks" on public.core_tracks for select to anon, authenticated using (true);
create policy "Anyone can read core modules" on public.core_modules for select to anon, authenticated using (true);
create policy "Anyone can read active external programmes" on public.external_programmes for select to anon, authenticated using (is_active = true);
