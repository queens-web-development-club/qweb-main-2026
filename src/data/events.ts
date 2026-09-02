import type { TermEvent } from '../lib/content';

/** Shown when Supabase is unconfigured or empty, so the schedule is never blank. */
export const fallbackEvents: TermEvent[] = [
  { id: 'fallback-1', event_name: 'Kickoff night', description: 'Meet the room, set up your tools, ship a first page.', event_date: '2026-09-12', event_time: '17:30—20:00', event_location: 'Engineering Building, Lab 4.11' },
  { id: 'fallback-2', event_name: 'Workshop // HTML + CSS', description: 'Build a responsive page from a blank file.', event_date: '2026-09-26', event_time: '18:00—20:00', event_location: 'Stauffer Library, Room 121' },
  { id: 'fallback-3', event_name: 'Industry night', description: 'A working developer talks process, teams, and the first job.', event_date: '2026-10-17', event_time: '18:30—20:30', event_location: 'Beamish-Munro Hall' },
  { id: 'fallback-4', event_name: 'Project team formation', description: 'Choose a brief and turn a rough idea into a real build.', event_date: '2026-11-07', event_time: '17:30—20:00', event_location: 'Engineering Building, Lab 4.11' },
];
