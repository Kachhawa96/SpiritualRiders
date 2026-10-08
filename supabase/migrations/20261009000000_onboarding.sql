-- Phase 8 Addon: Rider Profile Onboarding System
-- Dedicated pending submissions table, community feature toggle, and access policies.
-- Safe to run in Supabase SQL Editor.
-- Does not touch live riders table or existing public views.

-- 1. Feature Toggle in Community Settings
alter table public.community_settings 
  add column if not exists onboarding_enabled boolean not null default false;

-- 2. Dedicated Pending Submissions Table
create table if not exists public.rider_profile_submissions (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references public.riders(id) on delete set null,
  submission_type text not null default 'new' check (submission_type in ('new', 'update')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  
  -- Identity
  slug text not null,
  full_name text not null,
  display_name text not null,
  community_position text not null default 'member' check (
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
  joined_date date not null default current_date,

  -- Machine Specifications
  bike_brand text not null,
  bike_model text not null,
  bike_variant text,
  bike_year integer not null,
  bike_color text,

  -- Personal Information & Privacy Settings
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

  -- Riding Profile
  riding_since integer,
  riding_style text[] not null default '{}',
  favorite_route text,
  achievements text[] not null default '{}',

  -- Social Links
  instagram_url text,
  facebook_url text,
  youtube_url text,
  website_url text,

  -- Imagery URLs
  profile_image_url text,
  cover_image_url text,
  bike_image_url text,

  -- Publication Preferences
  is_featured boolean not null default false,
  is_active boolean not null default true,

  -- Contact details (for administrative communications / verification)
  contact_email text,
  contact_phone text,

  -- Administrative Review Metadata
  submitter_ip text,
  reviewer_email text,
  reviewer_notes text,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for efficient administrative querying by status and date
create index if not exists idx_rider_submissions_status_created 
  on public.rider_profile_submissions (status, created_at desc);

create index if not exists idx_rider_submissions_rider_id 
  on public.rider_profile_submissions (rider_id);

-- 3. Grants
grant select, insert, update, delete on table public.rider_profile_submissions to authenticated;
grant select, insert on table public.rider_profile_submissions to anon;

-- 4. Row Level Security Policies
alter table public.rider_profile_submissions enable row level security;

-- Admins can view and manage all submissions
drop policy if exists "Admin manage rider submissions" on public.rider_profile_submissions;
create policy "Admin manage rider submissions"
  on public.rider_profile_submissions
  for all
  to authenticated
  using (true)
  with check (true);

-- Anonymous visitors can submit new pending profile records
drop policy if exists "Anon submit rider profile" on public.rider_profile_submissions;
create policy "Anon submit rider profile"
  on public.rider_profile_submissions
  for insert
  to anon
  with check (status = 'pending');

-- Anonymous visitors can check their submission status
drop policy if exists "Anon view rider submissions" on public.rider_profile_submissions;
create policy "Anon view rider submissions"
  on public.rider_profile_submissions
  for select
  to anon
  using (true);

-- 5. Storage Policy: Allow public upload of onboarding images to rider-media bucket under 'onboarding/' folder
drop policy if exists "Public upload onboarding media" on storage.objects;
create policy "Public upload onboarding media"
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'rider-media'
    and (storage.foldername(name))[1] in ('onboarding', 'riders', 'bikes', 'covers')
  );
