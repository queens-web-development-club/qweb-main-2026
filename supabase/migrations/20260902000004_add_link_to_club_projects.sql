-- Client projects that are still live get a link out from the card.
alter table club_projects add column if not exists link text;
