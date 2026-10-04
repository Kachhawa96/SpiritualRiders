-- Fictional crew. Matches src/data/mock-riders.ts.
-- Safe to re-run: existing slugs are left as they are.

insert into public.riders (
  slug, full_name, display_name, community_position, bio, short_bio,
  age, blood_group, city, show_age, show_blood_group, show_city, show_social_links,
  joined_date, bike_brand, bike_model, bike_year, bike_color, riding_since,
  riding_style, favorite_route, achievements, instagram_url, is_featured
) values
(
  'vikram-rathore', 'Vikram Singh Rathore', 'Vikram Rathore', 'founder',
  $$Vikram called the first departure out of Jaipur, before the city had light in the windows. He still treats a dawn start as the honest hour of the house.

The Continental GT is the machine he trusts for that hour. The crew follows the line he sets, and he waits if the line breaks.$$,
  'Keeps the dawn starts honest and the crew pointed at the horizon.',
  41, 'O+', 'Jaipur', false, false, true, true,
  '2020-01-11', 'Royal Enfield', 'Continental GT', 2022, 'Black and brass', 2004,
  array['touring'], 'Jaipur to the Rann',
  array['Called the first dawn departure in 2020', 'Led Salt and Silence toward the Rann', 'Keeps the founding machine in the line'],
  'https://example.com/vikram-rathore', true
),
(
  'arjun-mehta', 'Arjun Mehta', 'Arjun Mehta', 'captain',
  $$Arjun rides at the front when the light is gone and at the back when someone falls out of the formation. The captain’s work is the whole line, not the fastest machine.

He does not talk about where he keeps his boots. The road is the only address the house needs from him.$$,
  'Rides the long way home and never leaves a machine in the dark.',
  36, 'B+', 'Pune', false, false, false, false,
  '2020-06-02', 'Triumph', 'Street Twin', 2019, 'Matt iron', 2009,
  array['naked'], 'The night patrol',
  array['Holds the line together on night patrol', 'Never leaves a stopped rider behind'],
  null, true
),
(
  'kabir-sen', 'Kabir Sen', 'Kabir Sen', 'co-founder',
  $$Kabir was in the first twelve. He rides near the back on purpose, where a problem shows up before it becomes a story.

The R nineT has crossed the same deserts as the founder’s machine. He stops first, and he does not make a speech about it.$$,
  'The quiet one at the back of the line, and the first to stop for another rider.',
  39, 'A+', 'Udaipur', false, false, true, false,
  '2020-01-11', 'BMW', 'R nineT', 2021, 'Graphite', 2006,
  array['naked', 'touring'], 'Udaipur lakes road',
  array['Rode the first morning beside the founder', 'Anchor of the formation on long tours'],
  null, true
),
(
  'neel-kapoor', 'Neel Kapoor', 'Neel Kapoor', 'member',
  'Neel takes the track that leaves the highway. The Adventure is how he comes back with dust on the cases and the crew still in sight.',
  'Takes the rough road when the highway feels too easy.',
  29, 'O-', 'Jodhpur', true, false, true, false,
  '2022-11-18', 'KTM', '390 Adventure', 2023, 'Orange', 2016,
  array['adventure'], 'Jodhpur dunes',
  array['Opened the dune road west of Jodhpur for the chapter'],
  null, false
),
(
  'reza-qureshi', 'Reza Qureshi', 'Reza Qureshi', 'member',
  'Reza is the one who notices a loose bolt before the lunch stop. Long Sundays suit him. The tools ride in his pannier, not as a performance.',
  'A steady hand on long Sundays, and the one who packs the tools.',
  33, 'AB+', 'Ahmedabad', false, false, true, false,
  '2021-08-09', 'Honda', 'CB350', 2021, 'Pearl white', 2012,
  array['touring', 'commuter'], 'Ahmedabad to the coast',
  array['Keeps the spares for the Sunday line'],
  null, false
),
(
  'ishaan-malhotra', 'Ishaan Malhotra', 'Ishaan Malhotra', 'vice-president',
  'Ishaan makes the departure time mean something. Plans stay quiet. The Versys is usually fueled before anyone else has found their gloves.',
  'Keeps the chapter’s plans quiet and the departures on time.',
  44, 'A-', 'Delhi', false, false, false, false,
  '2021-02-14', 'Kawasaki', 'Versys 650', 2020, 'Green', 2001,
  array['adventure', 'touring'], 'The Aravalli loop',
  array['Set the chapter’s dawn departure ritual'],
  null, false
),
(
  'farhan-iqbal', 'Farhan Iqbal', 'Farhan Iqbal', 'secretary',
  'Farhan writes the rides down: who came, which road, what the weather actually did. The Himalayan is the machine he uses to go check a route before the line commits.',
  'Writes the rides down so the house remembers them.',
  31, 'B-', 'Jaipur', false, false, true, false,
  '2021-04-03', 'Royal Enfield', 'Himalayan', 2024, 'Slate', 2014,
  array['adventure'], 'Mount Abu climb',
  array['Keeps the written record of the chapter rides'],
  null, false
),
(
  'mohit-bansal', 'Mohit Bansal', 'Mohit Bansal', 'member',
  'Mohit rides the edge of the formation and refuses to hurry a sunset. The Iron 883 is not the newest machine in the house. It is one of the most present.',
  'Cruises at the edge of the line and never rushes a sunset.',
  46, 'O+', 'Lucknow', true, false, false, false,
  '2022-01-20', 'Harley-Davidson', 'Iron 883', 2018, 'Black', 1999,
  array['cruiser'], 'The long plain',
  array['Rode every night patrol in 2025'],
  null, false
),
(
  'sagar-joshi', 'Sagar Joshi', 'Sagar Joshi', 'member',
  'Sagar likes a bend and a short burst, then he waits. The Scrambler is quick. He is quicker to fall back when the line needs a pair of eyes behind it.',
  'Likes the twist and the short burst, then waits for the crew.',
  27, 'A+', 'Udaipur', true, false, true, false,
  '2023-09-01', 'Ducati', 'Scrambler', 2022, 'Red', 2017,
  array['naked', 'sport'], 'Kumbhalgarh bends',
  array['Marked the Kumbhalgarh bends for the crew'],
  null, false
),
(
  'tarun-desai', 'Tarun Desai', 'Tarun Desai', 'co-captain',
  'Tarun rides sweep. When the line is long and the light is leaving, he is the last headlamp the rider in front can trust.',
  'Rides sweep when the line is long and the light is going.',
  34, 'B+', 'Mumbai', false, false, true, false,
  '2021-12-05', 'Triumph', 'Tiger 900', 2023, 'Sand', 2010,
  array['adventure', 'touring'], 'The coastal night',
  array['Sweep rider for the coastal night runs'],
  null, false
),
(
  'imran-sheikh', 'Imran Sheikh', 'Imran Sheikh', 'member',
  'Imran rides a light machine and looks back more than he looks at the horizon. After rain, he is the one who knows which ghat is still honest.',
  'A light machine and a habit of checking the rider behind him.',
  30, 'AB-', 'Indore', false, true, false, false,
  '2024-02-17', 'Yamaha', 'MT-07', 2020, 'Cyan', 2013,
  array['naked'], 'The ghats after rain',
  array['Scouted the ghats after the monsoon'],
  null, false
),
(
  'yash-oberoi', 'Yash Oberoi', 'Yash Oberoi', 'prospect',
  'Yash is new to the line and already early. The Classic 350 is a prospect’s machine: kept clean, ridden often, and not asked to lead yet.',
  'New to the line, already early to the dawn start.',
  24, 'O+', 'Ajmer', false, false, true, false,
  '2025-10-04', 'Royal Enfield', 'Classic 350', 2024, 'Chrome', 2021,
  array['cruiser'], 'Ajmer to Pushkar',
  array['First dawn start as a prospect, on time'],
  null, false
)
on conflict (slug) do nothing;
