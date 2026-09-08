-- Only one of the eleven archived builds still had a working destination
-- (QFLIP), which made a single card behave differently from the other ten for
-- no reason a visitor could infer. The club would rather the archive read as
-- one uniform set than carry a lone link, so the destination is cleared.
--
-- The projects themselves are unchanged; if live URLs are gathered for the
-- rest later, set them together in one migration.
update public.club_projects
set link = null
where link is not null;
