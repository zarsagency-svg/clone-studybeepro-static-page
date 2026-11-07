-- Notifications are managed through the Supabase dashboard, not by visitors.
create table public.mindspark_notifications (
  id text primary key default gen_random_uuid()::text,
  title text not null default '' check (char_length(title) <= 200),
  body text not null check (char_length(trim(body)) between 1 and 10000),
  created_at timestamptz not null default now()
);
create table public.mindspark_notification_likes (
  notification_id text not null references public.mindspark_notifications(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (notification_id, visitor_id)
);
alter table public.mindspark_notifications enable row level security;
alter table public.mindspark_notification_likes enable row level security;
revoke all on table public.mindspark_notifications from anon, authenticated;
revoke all on table public.mindspark_notification_likes from anon, authenticated;

-- Dashboard administrators can manage messages. Visitors can only call these
-- functions: no public message writes or direct reads of visitor identifiers.
create function public.mindspark_get_notifications(p_visitor_id uuid default null)
returns table(id text, title text, body text, created_at timestamptz, likes bigint, liked boolean)
language sql stable security definer set search_path = '' as $$
  select n.id, n.title, n.body, n.created_at,
    (select count(*) from public.mindspark_notification_likes l where l.notification_id = n.id),
    exists (select 1 from public.mindspark_notification_likes l where l.notification_id = n.id and l.visitor_id = p_visitor_id)
  from public.mindspark_notifications n
  order by n.created_at desc, n.id desc;
$$;

create function public.mindspark_set_notification_like(p_message_id text, p_visitor_id uuid, p_liked boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if p_visitor_id is null or p_message_id is null or p_liked is null then
    raise exception 'Missing required like parameters' using errcode = '22023';
  end if;
  if not exists (select 1 from public.mindspark_notifications where id = p_message_id) then
    raise exception 'Notification not found' using errcode = '22023';
  end if;
  if p_liked then
    insert into public.mindspark_notification_likes(notification_id, visitor_id)
    values (p_message_id, p_visitor_id) on conflict do nothing;
  else
    delete from public.mindspark_notification_likes
    where notification_id = p_message_id and visitor_id = p_visitor_id;
  end if;
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.mindspark_get_notifications(uuid) from public;
revoke all on function public.mindspark_set_notification_like(text, uuid, boolean) from public;
grant execute on function public.mindspark_get_notifications(uuid) to anon, authenticated;
grant execute on function public.mindspark_set_notification_like(text, uuid, boolean) to anon, authenticated;

-- Preserve the notification currently published by the site.
insert into public.mindspark_notifications (id, title, body, created_at)
values ('welcome-mr-sad', 'A message from Mr Sad, Admin',
  'Hello everyone, I am Mr Sad, the administrator of MIND SPARK. I hope you are all doing well. It is a pleasure to have you here — I will be sharing important updates and announcements through this channel. If you need any assistance, please feel free to reach out.',
  to_timestamp(1793886497834 / 1000.0));
