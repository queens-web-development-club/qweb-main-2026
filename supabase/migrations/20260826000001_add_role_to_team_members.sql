alter table public.team_members
  add column role text not null default 'Development'
  check (role in ('Co-Chair', 'Development', 'Outreach', 'Design', 'Education'));
