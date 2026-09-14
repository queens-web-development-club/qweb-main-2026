-- One line per role for the team cards, which have rendered name and role only.
-- Year, program and fun fact are personal, so they stay null until each person
-- supplies their own; these lines describe the job, not the person.
--
-- Matched on role rather than name, so a new exec in an existing role picks the
-- line up. Only empty responsibilities are filled: anything someone has written
-- for themselves is left alone. Wording follows how the 2024 roster described
-- the same jobs (qweb-main-2024, src/Components/team/teamData.js).

update public.team_members as member
set responsibility = line.responsibility
from (values
  ('co-chair',    'Runs the club day to day and keeps all five teams on the same page.'),
  ('education',   'Leads the team that writes and teaches the Thursday workshops.'),
  ('development', 'Leads the client builds and looks after the QWEB site itself.'),
  ('design',      'Leads design for client sites, the club''s socials and merch.'),
  ('outreach',    'Finds the clients our teams build for and the sponsors who back the club.'),
  ('finance',     'Manages the club''s budget and where sponsorship money goes.')
) as line(role, responsibility)
where lower(trim(member.role)) = line.role
  and nullif(trim(member.responsibility), '') is null;
