import { supabase } from './supabase';

export type ClubProject = {
  id: string;
  name: string;
  photo: string | null;
  description: string;
  link: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  photo: string | null;
  role: 'Co-Chair' | 'Development' | 'Outreach' | 'Design' | 'Education';
  /** Every detail below is optional — a card renders without any of them. */
  year: string | null;
  program: string | null;
  responsibility: string | null;
  fun_fact: string | null;
};

export type Sponsor = {
  id: string;
  name: string;
  logo: string;
  link: string;
};

export type TermEvent = {
  id: string;
  event_name: string;
  description: string;
  event_date: string;
  event_time?: string | null;
  event_location?: string | null;
};

export async function getProjects() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('club_projects').select('id, name, photo, description, link')
    .order('display_order', { ascending: true }).order('id', { ascending: true });
}

export const SPONSOR_LOGO_BUCKET = 'sponsor-logos';

/**
 * Sponsor rows store a bucket object name, which only the storage client can
 * turn into a URL. Root-relative and absolute values are passed through
 * untouched, so the site still renders against a database that has not had the
 * bucket migration applied yet.
 */
function sponsorLogoUrl(logo: unknown) {
  if (typeof logo !== 'string' || logo === '') return null;
  if (logo.startsWith('/') || /^https?:\/\//i.test(logo)) return null;
  return supabase?.storage.from(SPONSOR_LOGO_BUCKET).getPublicUrl(logo).data.publicUrl ?? null;
}

export async function getSponsors() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  const result = await supabase.from('sponsors').select('id, name, logo, link')
    .order('display_order', { ascending: true }).order('id', { ascending: true });
  return {
    ...result,
    data: result.data?.map((sponsor) => {
      const logo = sponsorLogoUrl(sponsor.logo);
      return logo ? { ...sponsor, logo } : sponsor;
    }) ?? null,
  };
}

export async function getTeamMembers() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  // Older databases do not have the optional profile columns yet. Selecting
  // existing columns avoids rejecting the whole roster with Postgres 42703.
  const result = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
  return {
    ...result,
    data: result.data?.map((member): TeamMember => ({
      id: member.id,
      name: member.name,
      photo: member.photo ?? null,
      role: member.role,
      year: member.year ?? null,
      program: member.program ?? null,
      responsibility: member.responsibility ?? null,
      fun_fact: member.fun_fact ?? null,
    })) ?? null,
  };
}

export async function getTermEvents() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('term_events').select('id, event_name, description, event_date, event_time, event_location').order('event_date', { ascending: true });
}
