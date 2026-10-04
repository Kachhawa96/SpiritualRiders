-- Fictional rides and gallery. Run after 20261004180000_rides_gallery.sql and the rider seed.

insert into public.rides (
  slug, title, tagline, description, short_description, ride_type, status,
  start_date, end_date, distance_km, route_summary, meeting_point,
  participant_count, is_featured, tone
) values
(
  'salt-and-silence',
  'Salt and Silence',
  'A straight line to the white desert',
  $$A two-day run into the white desert. Dawn starts, a long straight, and a camp where the only sound left was the cooling of the engines. Eighteen riders left Jaipur. The ones recorded here are the crew the house can name.$$,
  'A two-day run into the white desert. Dawn starts, a long straight, and a camp where the only sound left was the cooling of the engines.',
  'tour', 'completed', '2026-03-12', '2026-03-13', 640,
  'Jaipur to the Rann', 'Jaipur, before light', 18, true, 'salt'
),
(
  'night-patrol',
  'Night Patrol',
  'Headlamps in a single line',
  $$After dark the line closes up. This patrol is the 2025 ritual: no one rides the last kilometre alone, and the captain rides where the light fails.$$,
  'The after-dark ride that became a ritual in 2025.',
  'night-ride', 'completed', '2025-11-08', null, 120,
  'The Aravalli loop', 'The city edge', 9, false, 'highway'
),
(
  'mount-abu-climb',
  'Mount Abu Climb',
  'A day on the hill road',
  $$Farhan rode the route the week before. The line followed on a clear morning, slow on the bends, and home before the lights came on.$$,
  'A day ride up the hill road Farhan had already checked.',
  'day-ride', 'completed', '2024-02-02', null, 210,
  'Jaipur to Mount Abu', 'Jaipur', 11, false, 'dawn'
),
(
  'coastal-night',
  'Coastal Night',
  'The last headlamp',
  $$Tarun rode sweep. The Tiger stayed at the back until every machine in front had a light to follow.$$,
  'A night ride along the coast, with sweep at the rear.',
  'night-ride', 'completed', '2025-08-16', null, 180,
  'The coastal night', 'Mumbai', 8, false, 'rain'
),
(
  'pushkar-dawn',
  'Pushkar Dawn',
  'Still ahead of the calendar',
  $$The next dawn start. Yash will be early. The line leaves Ajmer while the lake is still dark.$$,
  'An upcoming dawn patrol from Ajmer toward Pushkar.',
  'dawn-patrol', 'upcoming', '2026-11-14', null, 90,
  'Ajmer to Pushkar', 'Ajmer', 6, false, 'dawn'
),
(
  'monsoon-ghats',
  'Monsoon Ghats',
  'After the rain',
  $$Imran knew which ghat was still honest. The weekend line took only that road, and came back with the machines wet and the formation whole.$$,
  'A weekend ride on the ghats after the rain.',
  'weekend-ride', 'completed', '2025-07-19', '2025-07-20', 260,
  'The ghats after rain', 'The ridge', 10, false, 'rain'
)
on conflict (slug) do nothing;

insert into public.ride_riders (ride_id, rider_id)
select r.id, p.id
from public.rides r
join public.riders p on p.slug in (
  'vikram-rathore', 'kabir-sen', 'arjun-mehta', 'farhan-iqbal', 'neel-kapoor', 'sagar-joshi'
)
where r.slug = 'salt-and-silence'
on conflict do nothing;

insert into public.ride_riders (ride_id, rider_id)
select r.id, p.id
from public.rides r
join public.riders p on p.slug in ('arjun-mehta', 'ishaan-malhotra', 'mohit-bansal', 'tarun-desai')
where r.slug = 'night-patrol'
on conflict do nothing;

insert into public.ride_riders (ride_id, rider_id)
select r.id, p.id
from public.rides r
join public.riders p on p.slug in ('farhan-iqbal', 'vikram-rathore', 'reza-qureshi')
where r.slug = 'mount-abu-climb'
on conflict do nothing;

insert into public.ride_riders (ride_id, rider_id)
select r.id, p.id
from public.rides r
join public.riders p on p.slug in ('tarun-desai', 'arjun-mehta', 'imran-sheikh')
where r.slug = 'coastal-night'
on conflict do nothing;

insert into public.ride_riders (ride_id, rider_id)
select r.id, p.id
from public.rides r
join public.riders p on p.slug in ('yash-oberoi', 'vikram-rathore', 'reza-qureshi')
where r.slug = 'pushkar-dawn'
on conflict do nothing;

insert into public.ride_riders (ride_id, rider_id)
select r.id, p.id
from public.rides r
join public.riders p on p.slug in ('imran-sheikh', 'sagar-joshi', 'neel-kapoor', 'kabir-sen')
where r.slug = 'monsoon-ghats'
on conflict do nothing;

insert into public.gallery_items (title, caption, taken_on, tone, ride_id, rider_id)
select
  v.title, v.caption, v.taken_on::date, v.tone, r.id, p.id
from (
  values
    ('Before the city', 'The line, still in the dark, waiting on Vikram.', '2026-03-12', 'dawn', 'salt-and-silence', 'vikram-rathore'),
    ('White horizon', 'The straight that gives the ride its name.', '2026-03-13', 'salt', 'salt-and-silence', 'kabir-sen'),
    ('Single file', 'Night patrol, closed up, no one at the back alone.', '2025-11-08', 'highway', 'night-patrol', 'arjun-mehta'),
    ('The hill road', 'Mount Abu, after Farhan had already ridden it once.', '2024-02-02', 'dawn', 'mount-abu-climb', 'farhan-iqbal'),
    ('Last headlamp', 'Sweep on the coastal night.', '2025-08-16', 'rain', 'coastal-night', 'tarun-desai'),
    ('After the rain', 'The ghat Imran would still call honest.', '2025-07-20', 'rain', 'monsoon-ghats', 'imran-sheikh'),
    ('The long pause', 'Camp, engines cooling, the crew still in one piece.', '2026-03-13', 'crew', 'salt-and-silence', 'neel-kapoor'),
    ('Pushkar, not yet', 'The dawn start that is still ahead.', '2026-11-14', 'dawn', 'pushkar-dawn', 'yash-oberoi')
) as v(title, caption, taken_on, tone, ride_slug, rider_slug)
join public.rides r on r.slug = v.ride_slug
join public.riders p on p.slug = v.rider_slug
where not exists (
  select 1 from public.gallery_items g
  where g.title = v.title and g.ride_id = r.id
);
