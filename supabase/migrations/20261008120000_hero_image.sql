-- Phase 8: Hero Background Image Migration
-- Adds hero_image_url column to community_settings table
-- Run this in the Supabase SQL Editor if you haven't already.

alter table public.community_settings add column if not exists hero_image_url text;
