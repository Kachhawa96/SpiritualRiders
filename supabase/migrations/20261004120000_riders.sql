-- Spiritual Riders: riders table, privacy view, and media bucket.
-- The base table is not readable by the browser key.
-- rider_public nulls age, blood group, city, and social links when the flag is off.

create table public.riders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  display_name text not null,
  community_position text not null check (
    community_position in (
      'founder',
      'co-founder',
      'president',
      'vice-president',
      'secretary',
      'treasurer',
      'captain',
      'co-captain',
      'member',
      'prospect'
    )
  ),
  bio text not null,
  short_bio text not null,
  age integer,
  blood_group text check (
    blood_group is null
    or blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  ),
  city text,
  show_age boolean not null default false,
  show_blood_group boolean not null default false,
  show_city boolean not null default false,
  show_social_links boolean not null default false,
  joined_date date not null,
  bike_brand text not null,
  bike_model text not null,
  bike_variant text,
  bike_year integer not null,
  bike_color text,
  riding_since integer,
  riding_style text[] not null default '{}',
  favorite_route text,
  achievements text[] not null default '{}',
  instagram_url text,
  facebook_url text,
  youtube_url text,
  website_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.riders enable row level security;

revoke all on table public.riders from anon, authenticated;

-- Owner-rights view so the public key can read masked rows and cannot read the table.
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
  is_active
from public.riders
where is_active = true;

grant select on public.rider_public to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('rider-media', 'rider-media', true)
on conflict (id) do nothing;

create policy "Public read rider media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'rider-media');
