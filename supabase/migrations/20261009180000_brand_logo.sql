-- Brand Logo Migration
-- Adds logo_image_url column to community_settings table
-- Safe to run in Supabase SQL Editor.

alter table public.community_settings 
  add column if not exists logo_image_url text;
