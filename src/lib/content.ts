import { supabase } from './supabase';
import { safeImage, safeLink } from './urls';

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
  /** Free text; only "Co-Chair" is special, and it groups the card at the top. */
  role: string;
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
  /** Null when the stored destination failed validation; the logo still shows. */
  link: string | null;
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
  const result = await supabase.from('club_projects').select('id, name, photo, description, link')
    .order('display_order', { ascending: true }).order('id', { ascending: true });
  return {
    ...result,
    // Validate at the loader, not in each card, so no component can forget.
    data: result.data?.map((project) => ({
      ...project,
      photo: safeImage(project.photo),
      link: safeLink(project.link),
    })) ?? null,
  };
}

export const SPONSOR_LOGO_BUCKET = 'sponsor-logos';
export const TEAM_PHOTO_BUCKET = 'team-photos';

/**
 * A bare object name resolves against a bucket; anything else is a path or a
 * URL and is validated as one. Storing the name rather than the full URL keeps
 * the project reference out of every row, so moving the Supabase project does
 * not rewrite the table.
 */
function bucketImage(value: unknown, bucket: string) {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  if (name === '') return null;
  if (name.includes('/') || name.includes(':')) return safeImage(name);
  return supabase?.storage.from(bucket).getPublicUrl(name).data.publicUrl ?? null;
}

/**
 * Sponsor rows store a bucket object name, which only the storage client can
 * turn into a URL. A database constraint keeps the column to a bare name, so
 * every stored logo resolves against the bucket.
 */
function sponsorLogoUrl(logo: unknown) {
  if (typeof logo !== 'string' || logo === '') return null;
  return supabase?.storage.from(SPONSOR_LOGO_BUCKET).getPublicUrl(logo).data.publicUrl ?? null;
}

export async function getSponsors() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  const result = await supabase.from('sponsors').select('id, name, logo, link')
    .order('display_order', { ascending: true }).order('id', { ascending: true });
  return {
    ...result,
    data: result.data?.map((sponsor) => {
      const logo = safeImage(sponsorLogoUrl(sponsor.logo));
      const link = safeLink(sponsor.link);
      return logo ? { ...sponsor, logo, link } : { ...sponsor, link };
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
      photo: bucketImage(member.photo, TEAM_PHOTO_BUCKET),
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
