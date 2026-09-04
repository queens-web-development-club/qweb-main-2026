-- Exec cards carry the person, not just the role: the 2024 site listed year,
-- program, what each exec is responsible for, and a fun fact. All nullable, so
-- a card renders correctly before anyone fills them in.
alter table team_members add column if not exists year text;
alter table team_members add column if not exists program text;
alter table team_members add column if not exists responsibility text;
alter table team_members add column if not exists fun_fact text;
