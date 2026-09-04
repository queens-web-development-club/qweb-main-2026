import { useInspectMode } from './useInspectMode';

/** The nav control for inspect mode. Renders nothing where hover does not exist. */
export function InspectToggle() {
  const { isInspecting, isSupported, toggle } = useInspectMode();
  if (!isSupported) return null;

  return <button type="button" className="inspect-toggle" onClick={toggle} aria-pressed={isInspecting} title="Label each section with the markup behind it">
    <span aria-hidden="true">&lt;/&gt;</span>Inspect
  </button>;
}
