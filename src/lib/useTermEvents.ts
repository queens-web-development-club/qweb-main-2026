import { useEffect, useState } from 'react';
import { getTermEvents, type TermEvent } from './content';
import { isSupabaseConfigured } from './supabase';

/**
 * The schedule is read in two places — the next-up line on Home and the full
 * term list in Education — so the request is memoised at module level and both
 * consumers share one fetch.
 *
 * The database is the only source of the schedule. An unconfigured or empty
 * database reports an unscheduled term, because a second copy in the
 * repository would drift from the dates the club actually announces.
 */
let pending: ReturnType<typeof getTermEvents> | null = null;
const loadEvents = () => (pending ??= getTermEvents());

export type TermEventsState = { events: TermEvent[]; isLoading: boolean; error: string };

export function useTermEvents(): TermEventsState {
  const [state, setState] = useState<TermEventsState>(
    { events: [], isLoading: isSupabaseConfigured, error: '' },
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    loadEvents()
      .then(({ data, error }) => {
        if (!active) return;
        setState(error
          ? { events: [], isLoading: false, error: 'We could not load the term events right now.' }
          : { events: data ?? [], isLoading: false, error: '' });
      })
      .catch(() => {
        if (active) setState({ events: [], isLoading: false, error: 'We could not load the term events right now.' });
      });
    return () => { active = false; };
  }, []);

  return state;
}
