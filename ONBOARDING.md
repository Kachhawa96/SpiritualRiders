# Rider Profile Onboarding System — Temporary Feature Documentation

This document describes the design, administration, and clean decommissioning procedures for the **Rider Profile Onboarding System** in Spiritual Riders.

---

## 1. Feature Architecture Overview

The onboarding system allows both **new prospective riders** and **existing roster members** to submit complete profiles and updates through a dedicated public portal.

### Key Guarantees:
1. **Isolated Data Storage:** All public submissions are stored exclusively in the dedicated `public.rider_profile_submissions` table.
2. **Zero Direct Mutations:** The live `public.riders` table is **never touched** until an administrator explicitly reviews and approves the submission in `/admin/onboarding`.
3. **Auto-Generated Slugs:** URL slugs (e.g., `/riders/vikram-rathore`) are automatically derived and verified against collision, requiring zero technical input from submitters.
4. **Built-in Rate Limiting & Anti-Spam:** An in-memory sliding-window limiter restricts submissions to **10 requests per minute per IP**, combined with honeypot bot trap validation.
5. **Admin Feature Toggle:** Onboarding can be turned on or off in real-time from the Admin Settings panel.

---

## 2. Managing the Feature Toggle

### From the Admin Panel:
1. Log in to the Admin Dashboard at `/admin`.
2. Go to **Settings** (`/admin/settings`).
3. Scroll to the **Rider Profile Onboarding System** section.
4. Toggle the **"Enable Public Rider Profile Onboarding Portal"** checkbox.
5. Click **Save Community Settings**.

### Behavior:
- **When Enabled:** The public URL (`/onboard` and `/join`) is active and accessible to everyone.
- **When Disabled:** Anyone visiting `/onboard` or `/join` is automatically redirected to the homepage with a polite notification banner: *"Notice: Profile onboarding is currently closed."*
- **Administrative Continuity:** Even when the portal is disabled, administrators can still access `/admin/onboarding` to review, approve, or reject existing pending submissions.

---

## 3. Database Schema & Migration

The feature uses a dedicated migration file:
`supabase/migrations/20261009000000_onboarding.sql`

### What it creates:
- `onboarding_enabled boolean` column in `public.community_settings`
- `public.rider_profile_submissions` table with full rider telemetry columns plus administrative review metadata (`status`, `rider_id`, `submission_type`, `reviewer_email`, `reviewer_notes`, `reviewed_at`, `submitter_ip`)
- RLS policies allowing anonymous visitors to insert `status = 'pending'` records and check their reference ID.
- Storage RLS policy allowing public media uploads into the `rider-media` bucket under `onboarding/`.

---

## 4. Administrative Review & Approval Flow

1. Navigate to **Admin → Onboarding** (`/admin/onboarding`).
2. Filter submissions by **Pending Review**, **Approved**, or **Rejected**.
3. Click **Review →** on any submission to view the detailed comparison:
   - **For Existing Riders:** An intelligent side-by-side diff table compares current live values against submitted changes, highlighting modified fields in gold.
   - **For New Riders:** A full preview of motorcycle specifications, privacy preferences, narrative bio, and uploaded images is displayed.
4. **Approve Action:**
   - If a new rider: Creates a new record in `public.riders` and marks `is_active = true` (immediately searchable and live).
   - If an existing rider: Updates the live `public.riders` record with the submitted changes.
   - Marks submission `status = 'approved'`, records admin email and timestamp.
5. **Reject Action:**
   - Marks submission `status = 'rejected'`, records reviewer email, and stores optional feedback notes for the submitter.

---

## 5. Clean Decommissioning & Removal Guide

The entire feature has been strictly isolated so that disabling or permanently removing it requires zero refactoring of core phases (0–7 or live riders).

### Option A: Disable Permanently (Recommended)
Simply uncheck the toggle in **Admin → Settings**. The public portal will remain inaccessible, and all submitted data remains safely archived in the database.

### Option B: Complete Removal from Codebase
If you wish to completely remove the feature in the future, delete the following isolated files:

1. **Routes & Actions:**
   - `src/app/onboard/` (entire folder)
   - `src/app/join/` (entire folder)
   - `src/app/admin/(dashboard)/onboarding/` (entire folder)
   - `src/app/admin/onboarding/` (entire folder)
2. **Components:**
   - `src/components/onboarding/` (entire folder)
   - `src/components/admin/SubmissionTable.tsx`
   - `src/components/admin/SubmissionReview.tsx`
3. **Data Access & Security:**
   - `src/lib/db/onboarding-schema.ts`
   - `src/lib/db/onboarding.ts`
   - `src/lib/security/rate-limiter.ts`
4. **Remove Navigation Link:**
   - In `src/components/admin/AdminNav.tsx`, remove `{ href: "/admin/onboarding", label: "Onboarding" }`.
5. **Database Cleanup (Optional SQL):**
   ```sql
   drop table if exists public.rider_profile_submissions cascade;
   alter table public.community_settings drop column if exists onboarding_enabled;
   ```
