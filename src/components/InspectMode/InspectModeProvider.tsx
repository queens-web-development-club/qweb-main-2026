import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { InspectModeContext } from './useInspectMode';
import { InspectOverlay } from './InspectOverlay';
import './InspectMode.css';

/**
 * Inspect mode lets the site show its own markup: with it on, hovering a
 * section labels it with the selector it is really built from.
 *
 * It is a pointer-only flourish. It never changes layout, it is off by
 * default, and nothing about it reaches the accessibility tree — so when it is
 * off, the page behaves exactly as it would without it.
 */
export function InspectModeProvider({ children }: { children: ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => setIsSupported(window.matchMedia('(pointer: fine)').matches), []);

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

  const value = useMemo(() => ({ isInspecting, isSupported, toggle }), [isInspecting, isSupported, toggle]);

  return <InspectModeContext.Provider value={value}>
    {children}
    {isInspecting && <InspectOverlay />}
  </InspectModeContext.Provider>;
}
