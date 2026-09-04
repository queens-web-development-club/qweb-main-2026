import type { TermEvent } from './content';

export type EventStatus = 'finished' | 'next' | 'soon';

export function todayKey(today = new Date()) {
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export function findNextEvent(events: TermEvent[], today = todayKey()) {
  return events.find((event) => event.event_date >= today) ?? null;
}

export function getEventStatus(event: TermEvent, nextEventId: string | null, today = todayKey()): EventStatus {
  if (event.event_date < today) return 'finished';
  return event.id === nextEventId ? 'next' : 'soon';
}

// Parsing with an explicit midnight keeps the day from shifting west of UTC.
const asDate = (date: string) => new Date(`${date}T00:00:00`);
const format = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-CA', options).format(asDate(date));

export function formatEventDate(date: string) {
  return format(date, { month: 'short', day: '2-digit' }).toUpperCase();
}

export function formatEventMonth(date: string) {
  return format(date, { month: 'short' }).toUpperCase();
}

export function formatEventDay(date: string) {
  return format(date, { day: '2-digit' });
}
