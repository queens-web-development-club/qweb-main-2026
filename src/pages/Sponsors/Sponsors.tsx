import { SectionHeading } from '../../components/SectionHeading';
import { getSponsors, type Sponsor } from '../../lib/content';
import { useContentList } from '../../lib/useContentList';
import './Sponsors.css';

/** The sponsor-facing tail of the About region: reach, work shipped, and who backs it. */
export function Sponsors() {
  const { items: sponsors, isLoading, hasError } = useContentList<Sponsor>(getSponsors);

  return <section className="sponsors reveal-on-scroll" aria-labelledby="sponsors-title" aria-busy={isLoading} data-inspect="section.sponsors">
    <SectionHeading id="sponsors-title" title="Backed by people who build things." summary="Sponsoring QWEB puts you in front of students who ship, all year, not once at a career fair." />

    <dl className="sponsors__reach">
      <div><dt>Members reached</dt><dd>300+</dd></div>
      <div><dt>Client sites shipped</dt><dd>11</dd></div>
      <div><dt>Cost to a student</dt><dd>$0</dd></div>
    </dl>

    {isLoading && <p className="sponsors-feedback" role="status">Loading sponsors...</p>}
    {!isLoading && hasError && <p className="sponsors-feedback" role="alert">Sponsors are unavailable right now. Please try again later.</p>}
    {!isLoading && !hasError && sponsors.length === 0 && <p className="sponsors-feedback">No sponsors have been added yet.</p>}
    {sponsors.length > 0 && <ul className="sponsors__logos">
      {sponsors.map((sponsor) => <li key={sponsor.id}>
        <a href={sponsor.link} target="_blank" rel="noreferrer" data-inspect="a.sponsors__logo"><img src={sponsor.logo} alt={sponsor.name} loading="lazy" /></a>
      </li>)}
    </ul>}

    <a className="sponsors__cta" href="mailto:qweb@queensu.ca">Sponsor QWEB<span aria-hidden="true">↗</span></a>
  </section>;
}
