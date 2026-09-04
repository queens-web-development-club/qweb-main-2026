import { findNextEvent, formatEventDate } from '../../lib/events';
import { useTermEvents } from '../../lib/useTermEvents';

/**
 * The single next event, for Home. The full schedule lives in the Education
 * region; this is the one line that gives someone a reason to come back.
 */
export function NextEvent() {
  const { events } = useTermEvents();
  const next = findNextEvent(events);
  if (!next) return null;

  return <a className="next-event" href="#education" data-inspect="a.next-event">
    <span className="next-event__label">Next up</span>
    <strong>{next.event_name}</strong>
    <time dateTime={next.event_date}>{formatEventDate(next.event_date)}</time>
    {next.event_location && <span className="next-event__where">{next.event_location}</span>}
  </a>;
}
