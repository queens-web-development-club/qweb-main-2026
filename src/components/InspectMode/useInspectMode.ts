import { createContext, useContext } from 'react';

export type InspectModeValue = {
  /** Whether the markup labels are currently showing. */
  isInspecting: boolean;
  /** False on coarse-pointer devices, where there is no hover to inspect with. */
  isSupported: boolean;
  toggle: () => void;
};

export const InspectModeContext = createContext<InspectModeValue | null>(null);

export function useInspectMode() {
  const value = useContext(InspectModeContext);
  if (!value) throw new Error('useInspectMode must be used inside an InspectModeProvider.');
  return value;
}
