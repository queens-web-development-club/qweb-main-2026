import type { ReactNode } from 'react';
import './SectionHeading.css';

/**
 * The club's own section device, carried over from qweb.dev: a JSX-style tag
 * above the heading. The angle brackets are decorative, so they are hidden
 * from assistive tech and the tag name is read as ordinary text.
 */
export function SectionHeading({ tag, title, summary, id }: { tag: string; title: ReactNode; summary?: ReactNode; id?: string }) {
  return <div className="section-heading">
    <div>
      <p className="section-tag"><span aria-hidden="true">&lt;</span>{tag}<span aria-hidden="true">/&gt;</span></p>
      <h2 id={id}>{title}</h2>
    </div>
    {summary && <p className="section-summary">{summary}</p>}
  </div>;
}
