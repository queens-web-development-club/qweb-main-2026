import { useEffect, useState } from 'react';
import { getTermEvents, type TermEvent } from '../../lib/content';
import { isSupabaseConfigured } from '../../lib/supabase';
import './Term.css';

type EventStatus = 'finished' | 'next' | 'soon';

const fallbackEvents: TermEvent[] = [
  { id: 'fallback-1', event_name: 'Kickoff night', description: 'Meet the room, set up your tools, ship a first page.', event_date: '2026-09-12' },
  { id: 'fallback-2', event_name: 'Workshop // HTML + CSS', description: 'Build a responsive page from a blank file.', event_date: '2026-09-26' },
  { id: 'fallback-3', event_name: 'Industry night', description: 'A working developer talks process, teams, and the first job.', event_date: '2026-10-17' },
  { id: 'fallback-4', event_name: 'Project team formation', description: 'Choose a brief and turn a rough idea into a real build.', event_date: '2026-11-07' },
];

function todayKey() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function getEventStatus(event: TermEvent, nextEventId: string | null): EventStatus {
  if (event.event_date < todayKey()) return 'finished';
  return event.id === nextEventId ? 'next' : 'soon';
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: '2-digit' }).format(new Date(`${date}T00:00:00`)).toUpperCase();
}

export function Term() {
  const [events, setEvents] = useState<TermEvent[]>(isSupabaseConfigured ? [] : fallbackEvents);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getTermEvents().then(({ data, error: queryError }) => {
      if (queryError) setError('We could not load the term events right now.');
      else setEvents(data ?? []);
      setIsLoading(false);
    });
  }, []);

  const nextEventId = events.find((event) => event.event_date >= todayKey())?.id ?? null;

  return <section className="term-section reveal-on-scroll" id="events" aria-labelledby="term-title" aria-busy={isLoading}>
    <div className="section-heading"><div><p className="section-kicker">// 2026 — 2027</p><h2 id="term-title">This term at QWEB.</h2></div><span className="section-index">04 / 06</span></div>
    {isLoading && <p className="term-feedback">Loading events...</p>}
    {!isLoading && error && <p className="term-feedback term-feedback--error" role="alert">{error}</p>}
    {!isLoading && !error && events.length === 0 && <p className="term-feedback">No events have been scheduled yet.</p>}
    {!isLoading && !error && events.length > 0 && <div className="term-list">{events.map((event, index) => { const status = getEventStatus(event, nextEventId); return <article className="term-row reveal-on-scroll" key={event.id}><span className="term-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{event.event_name}</h3><p>{event.description}</p></div><time dateTime={event.event_date}>{formatEventDate(event.event_date)}</time><span className={`term-status term-status--${status}`}>{status === 'finished' ? 'Finished' : status === 'next' ? 'Next Up' : 'Soon'}</span></article>; })}</div>}
  </section>;
}
