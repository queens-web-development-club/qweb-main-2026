import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { InspectModeContext } from './useInspectMode';
import { InspectOverlay } from './InspectOverlay';
import './InspectMode.css';

/**
 * Inspect mode lets the site show its own markup: with it on, hovering a
 * section labels it with the selector it is really built from.
 *
 * Hovering or tapping selects a section. The decorative overlay never changes
 * layout and stays out of the accessibility tree. Inspect mode is off by default.
 */
export function InspectModeProvider({ children }: { children: ReactNode }) {
  const [isInspecting, setIsInspecting] = useState(false);

  const toggle = useCallback(() => setIsInspecting((wasInspecting) => !wasInspecting), []);

  useEffect(() => {
    if (!isInspecting) return undefined;
    document.body.dataset.inspect = 'on';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsInspecting(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      delete document.body.dataset.inspect;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isInspecting]);

  const value = useMemo(() => ({ isInspecting, toggle }), [isInspecting, toggle]);

  return <InspectModeContext.Provider value={value}>
    {children}
    {isInspecting && <InspectOverlay />}
  </InspectModeContext.Provider>;
}
