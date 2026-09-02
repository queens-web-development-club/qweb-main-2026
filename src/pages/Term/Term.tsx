import { useEffect, useState } from 'react';
import { getTermEvents, type TermEvent } from '../../lib/content';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SectionHeading } from '../../components/SectionHeading';
import { findNextEvent, formatEventDate, formatEventDay, formatEventMonth, getEventStatus, todayKey } from '../../lib/events';
import './Term.css';

const fallbackEvents: TermEvent[] = [
  { id: 'fallback-1', event_name: 'Kickoff night', description: 'Meet the room, set up your tools, ship a first page.', event_date: '2026-09-12', event_time: '17:30—20:00', event_location: 'Engineering Building, Lab 4.11' },
  { id: 'fallback-2', event_name: 'Workshop // HTML + CSS', description: 'Build a responsive page from a blank file.', event_date: '2026-09-26', event_time: '18:00—20:00', event_location: 'Stauffer Library, Room 121' },
  { id: 'fallback-3', event_name: 'Industry night', description: 'A working developer talks process, teams, and the first job.', event_date: '2026-10-17', event_time: '18:30—20:30', event_location: 'Beamish-Munro Hall' },
  { id: 'fallback-4', event_name: 'Project team formation', description: 'Choose a brief and turn a rough idea into a real build.', event_date: '2026-11-07', event_time: '17:30—20:00', event_location: 'Engineering Building, Lab 4.11' },
];

function EventMeta({ event }: { event: TermEvent }) {
  return <div className="term-featured__meta">
    <div><span className="term-meta-label"><svg aria-hidden="true" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5"/><path d="M8 4.8v3.5l2.2 1.3"/></svg>Time</span><span>{event.event_time || 'Time to be announced'}</span></div>
    <div><span className="term-meta-label"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M8 14s4-4.2 4-7.5a4 4 0 1 0-8 0C4 9.8 8 14 8 14Z"/><circle cx="8" cy="6.5" r="1.3"/></svg>Where</span><span>{event.event_location || 'Location to be announced'}</span></div>
  </div>;
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

  const nextEventId = findNextEvent(events)?.id ?? null;
  const eventRows = events.map((event, index) => ({ event, index, status: getEventStatus(event, nextEventId) }));
  const nextEvent = eventRows.find(({ status }) => status === 'next')?.event ?? null;
  const upcomingEvents = eventRows.filter(({ event }) => event.id !== nextEvent?.id && event.event_date >= todayKey());

  return <section className="term-section reveal-on-scroll" aria-labelledby="term-title" aria-busy={isLoading} data-inspect="section.term-section#events">
    <SectionHeading tag="Our Events" id="term-title" title="This term at QWEB." />
    {isLoading && <p className="term-feedback">Loading events...</p>}
    {!isLoading && error && <p className="term-feedback term-feedback--error" role="alert">{error}</p>}
    {!isLoading && !error && events.length === 0 && <p className="term-feedback">No events have been scheduled yet.</p>}
    {!isLoading && !error && events.length > 0 && <>
      {nextEvent && <article className="term-featured" aria-label="Next upcoming event">
        <div className="term-featured__date"><span>{formatEventMonth(nextEvent.event_date)}</span><strong>{formatEventDay(nextEvent.event_date)}</strong><small>Event 01</small></div>
        <div className="term-featured__body"><p className="term-featured__eyebrow">● Next up</p><h3>{nextEvent.event_name}</h3><p className="term-featured__description">{nextEvent.description}</p><EventMeta event={nextEvent} /></div>
      </article>}
      {upcomingEvents.length > 0 && <div className="term-upcoming"><div className="term-upcoming__header"><span>Rest of the term</span><span>Select a row for details</span></div><div className="term-list">{upcomingEvents.map(({ event, index }) => <article className="term-row" key={event.id}><span className="term-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{event.event_name}</h3><p>{event.description}</p></div><time dateTime={event.event_date}>{formatEventDate(event.event_date)}</time><span className="term-status">Scheduled</span></article>)}</div></div>}
    </>}
  </section>;
}
