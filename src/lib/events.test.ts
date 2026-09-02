import { describe, expect, it } from 'vitest';
import { findNextEvent, formatEventDate, formatEventDay, formatEventMonth, getEventStatus, todayKey } from './events';
import type { TermEvent } from './content';

const event = (id: string, event_date: string): TermEvent => ({ id, event_name: id, description: '', event_date });
const term = [event('past', '2026-09-01'), event('next', '2026-09-12'), event('later', '2026-10-17')];

describe('todayKey', () => {
  it('formats a date as YYYY-MM-DD with padding', () => {
    expect(todayKey(new Date(2026, 8, 2))).toBe('2026-09-02');
  });
});

describe('findNextEvent', () => {
  it('picks the earliest event that has not passed', () => {
    expect(findNextEvent(term, '2026-09-02')?.id).toBe('next');
  });

  it('treats an event happening today as still upcoming', () => {
    expect(findNextEvent(term, '2026-09-12')?.id).toBe('next');
  });

  it('returns null once the term is over', () => {
    expect(findNextEvent(term, '2026-12-01')).toBeNull();
  });

  it('returns null for an empty schedule', () => {
    expect(findNextEvent([], '2026-09-02')).toBeNull();
  });
});

describe('getEventStatus', () => {
  it('marks a past event finished', () => {
    expect(getEventStatus(term[0], 'next', '2026-09-02')).toBe('finished');
  });

  it('marks the next event next', () => {
    expect(getEventStatus(term[1], 'next', '2026-09-02')).toBe('next');
  });

  it('marks a later event soon', () => {
    expect(getEventStatus(term[2], 'next', '2026-09-02')).toBe('soon');
  });
});

describe('formatters', () => {
  it('formats a full date label', () => {
    expect(formatEventDate('2026-09-12')).toBe('SEP 12');
  });

  it('formats month and day separately', () => {
    expect(formatEventMonth('2026-09-12')).toBe('SEP');
    expect(formatEventDay('2026-09-12')).toBe('12');
  });

  it('does not shift the day across a timezone boundary', () => {
    expect(formatEventDay('2026-01-01')).toBe('01');
  });
});
