import { useEffect, useState } from 'react';
import { getTermEvents, type TermEvent } from './content';
import { isSupabaseConfigured } from './supabase';
import { fallbackEvents } from '../data/events';

/**
 * The schedule is read in two places — the next-up line on Home and the full
 * term list in Education — so the request is memoised at module level and both
 * consumers share one fetch.
 */
let pending: ReturnType<typeof getTermEvents> | null = null;
const loadEvents = () => (pending ??= getTermEvents());

export type TermEventsState = { events: TermEvent[]; isLoading: boolean; error: string };

export function useTermEvents(): TermEventsState {
  const [state, setState] = useState<TermEventsState>(
    isSupabaseConfigured ? { events: [], isLoading: true, error: '' } : { events: fallbackEvents, isLoading: false, error: '' },
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
