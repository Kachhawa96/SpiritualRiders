-- Migration: 20261010140000_gallery_images.sql
-- Description: Add image_url to gallery_items, recreate gallery_public view, and seed gallery image URLs.

-- 1. Ensure image_url column exists on public.gallery_items
alter table public.gallery_items add column if not exists image_url text;

-- 2. Drop and recreate gallery_public view to prevent PostgreSQL column ordering conflict
drop view if exists public.gallery_public cascade;

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

-- 3. Populate image URLs for existing gallery items
update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-before-the-city.jpg'
where title = 'Before the city';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-white-horizon.jpg'
where title = 'White horizon';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-single-file.jpg'
where title = 'Single file';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-the-hill-road.jpg'
where title = 'The hill road';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-last-headlamp.jpg'
where title = 'Last headlamp';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-after-the-rain.jpg'
where title = 'After the rain';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-the-long-pause.jpg'
where title = 'The long pause';

update public.gallery_items
set image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-pushkar-not-yet.jpg'
where title = 'Pushkar, not yet';
