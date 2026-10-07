-- Phase 8: Admin & Content Management Migration
-- Safe to run in Supabase SQL Editor.
-- Preserves all base table data and public view privacy logic.

-- 1. Community Settings Table
create table if not exists public.community_settings (
  id text primary key default 'default',
  name text not null default 'Spiritual Riders',
  tagline text not null default 'Riders. Brotherhood. Spirit.',
  description text not null default 'A premium motorcycle brotherhood built on passion, respect, and the open road.',
  email text not null default 'contact@spiritualriders.in',
  founded_year integer not null default 2020,
  instagram_url text,
  facebook_url text,
  youtube_url text,
  updated_at timestamptz not null default now()
);

-- Seed default community settings if not present
insert into public.community_settings (
  id, name, tagline, description, email, founded_year
) values (
  'default',
  'Spiritual Riders',
  'Riders. Brotherhood. Spirit.',
  'A premium motorcycle brotherhood built on passion, respect, and the open road.',
  'contact@spiritualriders.in',
  2020
)
on conflict (id) do nothing;

-- 2. Add image columns to base tables if not already present
alter table public.riders add column if not exists profile_image_url text;
alter table public.riders add column if not exists cover_image_url text;
alter table public.riders add column if not exists bike_image_url text;

alter table public.rides add column if not exists cover_image_url text;

alter table public.gallery_items add column if not exists image_url text;

-- 3. Grants on base tables for authenticated administrators
grant select, insert, update, delete on table public.riders to authenticated;
grant select, insert, update, delete on table public.rides to authenticated;
grant select, insert, update, delete on table public.ride_riders to authenticated;
grant select, insert, update, delete on table public.gallery_items to authenticated;
grant select, insert, update, delete on table public.community_settings to authenticated;
grant select on table public.community_settings to anon;

-- 4. RLS Policies for authenticated administrators
alter table public.community_settings enable row level security;

drop policy if exists "Public read community settings" on public.community_settings;
create policy "Public read community settings"
  on public.community_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin manage community settings" on public.community_settings;
create policy "Admin manage community settings"
  on public.community_settings
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin manage riders" on public.riders;
create policy "Admin manage riders"
  on public.riders
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin manage rides" on public.rides;
create policy "Admin manage rides"
  on public.rides
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin manage ride riders" on public.ride_riders;
create policy "Admin manage ride riders"
  on public.ride_riders
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin manage gallery items" on public.gallery_items;
create policy "Admin manage gallery items"
  on public.gallery_items
  for all
  to authenticated
  using (true)
  with check (true);

-- 5. Storage Policies for rider-media bucket
insert into storage.buckets (id, name, public)
values ('rider-media', 'rider-media', true)
on conflict (id) do nothing;

drop policy if exists "Admin upload rider media" on storage.objects;
create policy "Admin upload rider media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'rider-media');

drop policy if exists "Admin update rider media" on storage.objects;
create policy "Admin update rider media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'rider-media');

drop policy if exists "Admin delete rider media" on storage.objects;
create policy "Admin delete rider media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'rider-media');

-- 6. Recreate public views safely
-- Drop dependent views first so column ordering or naming changes never conflict with PostgreSQL's schema cache.
drop view if exists public.gallery_public cascade;
drop view if exists public.ride_participant_public cascade;
drop view if exists public.ride_public cascade;
drop view if exists public.rider_public cascade;

-- View 6.1: rider_public (Privacy rules strictly enforced)
create view public.rider_public as
select
  id::text as id,
  slug,
  display_name,
  community_position,
  bio,
  short_bio,
  joined_date::text as joined_date,
  bike_brand,
  bike_model,
  bike_variant,
  bike_year,
  bike_color,
  riding_since,
  riding_style,
  favorite_route,
  achievements,
  case when show_age then age else null end as age,
  case when show_blood_group then blood_group else null end as blood_group,
  case when show_city then city else null end as city,
  case when show_social_links then instagram_url else null end as instagram_url,
  case when show_social_links then facebook_url else null end as facebook_url,
  case when show_social_links then youtube_url else null end as youtube_url,
  case when show_social_links then website_url else null end as website_url,
  is_featured,
  is_active,
  profile_image_url,
  cover_image_url,
  bike_image_url
from public.riders
where is_active = true;

grant select on public.rider_public to anon, authenticated;

-- View 6.2: ride_public
create view public.ride_public as
select
  id::text as id,
  slug,
  title,
  tagline,
  description,
  short_description,
  ride_type,
  status,
  start_date::text as start_date,
  end_date::text as end_date,
  distance_km,
  route_summary,
  meeting_point,
  participant_count,
  is_featured,
  tone,
  cover_image_url
from public.rides;

grant select on public.ride_public to anon, authenticated;

-- View 6.3: ride_participant_public (Joins rider_public so private columns never leave the database)
create view public.ride_participant_public as
select
  rd.slug as ride_slug,
  rp.slug as rider_slug,
  rp.display_name as rider_name,
  rp.community_position
from public.ride_riders rr
join public.rides rd on rd.id = rr.ride_id
join public.rider_public rp on rp.id = rr.rider_id::text;

grant select on public.ride_participant_public to anon, authenticated;

-- View 6.4: gallery_public (Joins rider_public)
create view public.gallery_public as
select
  g.id::text as id,
  g.title,
  g.caption,
  g.taken_on::text as taken_on,
  g.tone,
  rd.slug as ride_slug,
  rd.title as ride_title,
  rp.slug as rider_slug,
  rp.display_name as rider_name,
  g.image_url
from public.gallery_items g
left join public.rides rd on rd.id = g.ride_id
left join public.rider_public rp on rp.id = g.rider_id::text;

grant select on public.gallery_public to anon, authenticated;
