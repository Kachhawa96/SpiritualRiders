-- Migration: 20261010150000_hero_video.sql
-- Description: Adds hero_video_url column to community_settings table for cinematic background video.

alter table public.community_settings add column if not exists hero_video_url text;
