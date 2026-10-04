-- Rides, gallery, and the public link to riders.
-- Joins go through rider_public so hidden cities and other private columns never leave the database.

create table public.rides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text not null,
  short_description text not null,
  ride_type text not null check (
    ride_type in (
      'day-ride',
      'weekend-ride',
      'tour',
      'charity',
      'meetup',
      'dawn-patrol',
      'night-ride'
    )
  ),
  status text not null check (
    status in ('upcoming', 'ongoing', 'completed', 'cancelled')
  ),
  start_date date not null,
  end_date date,
  distance_km integer,
  route_summary text,
  meeting_point text,
  participant_count integer not null default 0,
  is_featured boolean not null default false,
  tone text not null default 'highway' check (
    tone in ('highway', 'machine', 'crew', 'dawn', 'salt', 'rain')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ride_riders (
  ride_id uuid not null references public.rides (id) on delete cascade,
  rider_id uuid not null references public.riders (id) on delete cascade,
  primary key (ride_id, rider_id)
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text not null,
  taken_on date,
  tone text not null default 'highway' check (
    tone in ('highway', 'machine', 'crew', 'dawn', 'salt', 'rain')
  ),
  ride_id uuid references public.rides (id) on delete set null,
  rider_id uuid references public.riders (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.rides enable row level security;
alter table public.ride_riders enable row level security;
alter table public.gallery_items enable row level security;

revoke all on table public.rides from anon, authenticated;
revoke all on table public.ride_riders from anon, authenticated;
revoke all on table public.gallery_items from anon, authenticated;

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
  tone
from public.rides;

create view public.ride_participant_public as
select
  rd.slug as ride_slug,
  rp.slug as rider_slug,
  rp.display_name as rider_name,
  rp.community_position
from public.ride_riders rr
join public.rides rd on rd.id = rr.ride_id
join public.rider_public rp on rp.id = rr.rider_id::text;

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
  rp.display_name as rider_name
from public.gallery_items g
left join public.rides rd on rd.id = g.ride_id
left join public.rider_public rp on rp.id = g.rider_id::text;

grant select on public.ride_public to anon, authenticated;
grant select on public.ride_participant_public to anon, authenticated;
grant select on public.gallery_public to anon, authenticated;
