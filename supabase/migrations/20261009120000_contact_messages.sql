-- Contact Messages Migration
-- Safe to run in Supabase SQL Editor.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null default 'general',
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now()
);

-- Grants
grant insert on table public.contact_messages to anon, authenticated;
grant select, update, delete on table public.contact_messages to authenticated;

-- RLS
alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit contact message" on public.contact_messages;
create policy "Anyone can submit contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admin manage contact messages" on public.contact_messages;
create policy "Admin manage contact messages"
  on public.contact_messages
  for all
  to authenticated
  using (true)
  with check (true);
