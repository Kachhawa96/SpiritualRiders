-- Phase 9: Seed Curated High-Quality Images for Rides
-- Run this in the Supabase SQL Editor to populate cover_image_url for all rides in the database.

update public.rides
set cover_image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-night-patrol.jpg'
where slug = 'night-patrol';

update public.rides
set cover_image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-mount-abu-climb.jpg'
where slug = 'mount-abu-climb';

update public.rides
set cover_image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-pushkar-dawn.jpg'
where slug = 'pushkar-dawn';

update public.rides
set cover_image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-salt-and-silence.jpg'
where slug = 'salt-and-silence';

update public.rides
set cover_image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-coastal-night.jpg'
where slug = 'coastal-night';

update public.rides
set cover_image_url = 'https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-monsoon-ghats.jpg'
where slug = 'monsoon-ghats';
