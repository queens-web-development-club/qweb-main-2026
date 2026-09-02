import type { TermEvent } from '../lib/content';

/**
 * The 2026–27 weekly workshop series: Thursdays from 17 September, in
 * Kinesiology Room 100. Topics follow the club's education schedule — a
 * portfolio site over weeks 1–5, then a club site through week 10.
 *
 * Times are unset until confirmed; the Term section renders "Time to be
 * announced" rather than showing a time nobody has agreed to.
 *
 * Shown when Supabase is unconfigured or empty, so the schedule is never blank.
 */
const KIN_100 = 'Kinesiology Building, Room 100';

export const fallbackEvents: TermEvent[] = [
  { id: 'week-01', event_name: 'Kickoff + tools setup', description: 'Get set up properly: VS Code, GitHub, terminal basics, and your first HTML page.', event_date: '2026-09-17', event_time: null, event_location: KIN_100 },
  { id: 'week-02', event_name: 'CSS + Flexbox', description: 'Style your homepage and make it responsive — box model, hover states, media queries, Tailwind against plain CSS.', event_date: '2026-09-24', event_time: null, event_location: KIN_100 },
  { id: 'week-03', event_name: 'JavaScript + the DOM', description: 'Add interactivity: functions, event listeners, and changing the page as people use it.', event_date: '2026-10-01', event_time: null, event_location: KIN_100 },
  { id: 'week-04', event_name: 'Git + GitHub', description: 'Version control like a developer — commits, .gitignore, and pushing a repo you can share.', event_date: '2026-10-08', event_time: null, event_location: KIN_100 },
  { id: 'week-05', event_name: 'React & Vite', description: 'Rebuild your homepage out of components in a real Vite project.', event_date: '2026-10-15', event_time: null, event_location: KIN_100 },
  { id: 'week-06', event_name: 'Routing, components & styling', description: 'Structure an app across pages with a shared header, footer, and layout.', event_date: '2026-10-22', event_time: null, event_location: KIN_100 },
  { id: 'week-07', event_name: 'APIs + fetching data', description: 'Make the site dynamic: fetch, useEffect, and working with JSON.', event_date: '2026-10-29', event_time: null, event_location: KIN_100 },
  { id: 'week-08', event_name: 'Backend integration', description: 'What a backend actually is, and moving your fetch over to Express.', event_date: '2026-11-05', event_time: null, event_location: KIN_100 },
  { id: 'week-09', event_name: 'Database integration', description: 'Add a form and store what people submit, using Supabase.', event_date: '2026-11-12', event_time: null, event_location: KIN_100 },
  { id: 'week-10', event_name: 'Deployment + final polish', description: 'Deploy live on Vercel, handle environment variables, and polish the thing.', event_date: '2026-11-19', event_time: null, event_location: KIN_100 },
  { id: 'week-11', event_name: 'Demo night', description: 'Everyone presents what they built, plus where to go next.', event_date: '2026-11-26', event_time: null, event_location: KIN_100 },
];
