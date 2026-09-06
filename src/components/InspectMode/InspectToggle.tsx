import { useInspectMode } from './useInspectMode';

/** The nav control for inspect mode, available on every input device. */
export function InspectToggle() {
  const { isInspecting, toggle } = useInspectMode();

  return <button type="button" className="inspect-toggle" onClick={toggle} aria-pressed={isInspecting} title="Label each section with the markup behind it">
    <span aria-hidden="true">&lt;/&gt;</span>Inspect
  </button>;
}
