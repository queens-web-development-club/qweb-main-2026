import { supabase } from './supabase';

export type ClubProject = {
  id: string;
  name: string;
  photo: string | null;
  description: string;
};

export type TeamMember = {
  id: string;
  name: string;
  photo: string | null;
  role: 'Co-Chair' | 'Development' | 'Outreach' | 'Design' | 'Education';
};

export type TermEvent = {
  id: string;
  event_name: string;
  description: string;
  event_date: string;
};

export async function getProjects() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('club_projects').select('id, name, photo, description').order('created_at', { ascending: false });
}

export async function getTeamMembers() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('team_members').select('id, name, photo, role').order('created_at', { ascending: true });
}

export async function getTermEvents() {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('term_events').select('id, event_name, description, event_date').order('event_date', { ascending: true });
}
