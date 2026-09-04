import type { ReactNode } from 'react';
import './SectionHeading.css';

/**
 * Shared section heading with one job: establish the title and its supporting
 * copy. The heading is allowed to carry the section without a decorative
 * kicker competing with it.
 */
export function SectionHeading({ title, summary, id }: { title: ReactNode; summary?: ReactNode; id?: string }) {
  return <div className="section-heading">
    <div>
      <h2 id={id}>{title}</h2>
    </div>
    {summary && <p className="section-summary">{summary}</p>}
  </div>;
}
