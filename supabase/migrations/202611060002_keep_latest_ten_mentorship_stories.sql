create or replace function public.keep_latest_ten_mentorship_stories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Serialize concurrent publishes so the table never keeps more than ten.
  perform pg_advisory_xact_lock(731204091);

  delete from public.mentorship_stories
  where id in (
    select id
    from public.mentorship_stories
    order by created_at desc, id desc
    offset 10
  );

  return null;
end;
$$;

drop trigger if exists mentorship_stories_keep_latest_ten
  on public.mentorship_stories;

create trigger mentorship_stories_keep_latest_ten
after insert on public.mentorship_stories
for each statement
execute function public.keep_latest_ten_mentorship_stories();

-- Bring any existing rows into compliance when this migration is applied.
do $$
begin
  perform pg_advisory_xact_lock(731204091);
  delete from public.mentorship_stories
  where id in (
    select id
    from public.mentorship_stories
    order by created_at desc, id desc
    offset 10
  );
end;
$$;
