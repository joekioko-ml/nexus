create table if not exists public.module_quiz_progress (
  user_id uuid not null references public.users(id) on delete cascade,
  module_id text not null references public.core_modules(id) on delete cascade,
  answered_question_ids text[] not null default '{}',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.module_quiz_progress enable row level security;
