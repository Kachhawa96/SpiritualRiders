-- Phase 8 Enhancement Migration: Date of Birth and Age Support
-- Adds date_of_birth column to both pending submissions and live riders table.
-- Safe to run in Supabase SQL Editor.

alter table public.rider_profile_submissions 
  add column if not exists date_of_birth date;

alter table public.riders 
  add column if not exists date_of_birth date;
