import { useEffect, useRef } from 'react';
import { SectionHeading } from '../../components/SectionHeading';
import './AboutUs.css';

const offerings = [
  { number: '01', title: 'Workshops', description: 'Ten Thursdays, six to seven. You deploy a live site on the first night, then spend the term rebuilding it by hand until every line of it is yours.', artifactLabel: 'deploy', artifactValue: 'site.live', artifactState: 'ready', artifact: 'browser' },
  { number: '02', title: 'Build nights', description: 'Bring a half-finished idea and a laptop. Exec and senior members float the room until the bug is dead and the thing works.', artifactLabel: 'issue', artifactValue: 'resolved', artifactState: 'closed', artifact: 'bug' },
  { number: '03', title: 'Client projects', description: 'Small teams build real sites for Queen’s clubs and Kingston businesses — scoped, reviewed, shipped, and handed over. Teams are forming now.', artifactLabel: 'pull request', artifactValue: 'merged', artifactState: 'approved', artifact: 'merge' },
  { number: '04', title: 'Two sprints a year', description: 'The fall sprint runs September to December, the winter sprint January to April. Start at the beginning of either one, or join partway through — people do.', artifactLabel: 'next sprint', artifactValue: 'jan → apr', artifactState: 'open', artifact: 'calendar' },
];

const milestones = [
  { month: 'September', title: 'Live in week one', description: 'You deploy a real site on the first night, with AI, and leave with the link. Then we start pulling it apart.' },
  { month: 'October', title: 'Own every line', description: 'Rebuild the page by hand — structure, styling, interaction — until you can explain any part of it without help.' },
  { month: 'November', title: 'Ship it properly', description: 'Git, Next.js and Vercel, then a polished portfolio you present to the room on the nineteenth.' },
  { month: 'January', title: 'Build for someone else', description: 'The winter sprint opens. Join a client team, take a real ticket, and open a real pull request.' },
];

function ArtifactGraphic({ type }: { type: string }) {
  if (type === 'browser') return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><rect x="7" y="9" width="42" height="34" rx="2" /><path d="M7 17h42M13 13h.01M17 13h.01M21 13h.01" /><path d="M16 29l5 5 12-12" /><path d="M16 38h24" /></svg>;
  if (type === 'bug') return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><path d="M28 17v22M20 22a9 9 0 0 1 16 0v10a8 8 0 0 1-16 0Z" /><path d="M20 25h-7m7 8h-8m24-8h7m-7 8h8M22 17l-3-5m15 5 3-5" /><path className="about-us__graphic-accent" d="m23 29 4 4 7-9" /></svg>;
  if (type === 'merge') return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><circle cx="16" cy="14" r="4" /><circle cx="16" cy="42" r="4" /><circle cx="40" cy="28" r="4" /><path d="M16 18v14c0 5 4 8 9 8h10M16 18c0 5 4 10 9 10h11" /><path className="about-us__graphic-accent" d="m36 24 5 4-5 4" /></svg>;
  return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><rect x="10" y="12" width="36" height="34" rx="2" /><path d="M10 22h36M18 8v8m20-8v8" /><path d="M17 29h5m5 0h5m5 0h2M17 37h5m5 0h5" /><path className="about-us__graphic-accent" d="M38 35v8m-4-4h8" /></svg>;
}

export function AboutUs() {
  const aboutRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const items = Array.from(journey.querySelectorAll('li'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-reached');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    const finish = () => {
      if (!preference.matches) return;
      items.forEach((item) => item.classList.add('is-reached'));
      observer.disconnect();
    };
    journey.classList.add('journey-ready');
    items.forEach((item) => observer.observe(item));
    finish();
    preference.addEventListener('change', finish);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', finish);
      journey.classList.remove('journey-ready');
    };
  }, []);

  useEffect(() => {
    const section = aboutRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const offerings = Array.from(section.querySelectorAll<HTMLElement>('.about-us__offering'));
    section.classList.add('about-us--motion-ready');
    let frameId: number | undefined;
    const updateActiveOffering = () => {
      frameId = undefined;
      const sectionRect = section.getBoundingClientRect();
      if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) return;
      const viewportCenter = window.innerHeight / 2;
      let activeIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      offerings.forEach((offering, index) => {
        const rect = offering.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeIndex = index;
        }
      });
      offerings.forEach((offering, index) => offering.classList.toggle('is-active', index === activeIndex));
    };
    const onScroll = () => {
      if (frameId === undefined) frameId = requestAnimationFrame(updateActiveOffering);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActiveOffering();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return <section ref={aboutRef} className="about-us reveal-on-scroll" aria-labelledby="about-title" data-inspect="section.about-us">
    <SectionHeading id="about-title" title={<>Four nights a month that<br /><span>turn into a portfolio.</span></>} summary="Everything we run is hands-on. You leave every session with something on your screen that wasn’t there when you walked in." />

    <p className="about-us__bio">QWEB is a student-run club that teaches people to build for the web. A sprint runs on one project — a personal portfolio that goes live on night one and gets rebuilt by hand until you understand it. We use AI in the room the way working developers actually do, as a tool you direct and then read, not a black box you copy from. Alongside that, teams of members build real sites for Queen’s clubs and Kingston businesses; experienced members lead, and the people on them range from first-timers to fourth years. We do the design as well as the code.</p>

    <div className="about-us__offerings" aria-label="What QWEB offers">
      {offerings.map((offering) => <article className="about-us__offering" key={offering.title} data-inspect="article.about-us__offering">
        <span className="about-us__number" aria-hidden="true">{offering.number}</span>
        <h3>{offering.title}</h3>
        <p>{offering.description}</p>
        <div className="about-us__artifact" aria-label={`${offering.artifactLabel}: ${offering.artifactValue}, ${offering.artifactState}`}>
          <ArtifactGraphic type={offering.artifact} />
          <div className="about-us__artifact-copy">
          <span>{offering.artifactLabel}</span>
          <strong>{offering.artifactValue}</strong>
          <i>{offering.artifactState}</i>
          </div>
        </div>
      </article>)}
    </div>

    <section ref={journeyRef} className="about-us__journey" aria-labelledby="journey-title" data-inspect="section.about-us__journey">
      <header className="about-us__journey-header">
        <p className="about-us__eyebrow" id="journey-title">// Your first year</p>
        <span>Sept → April</span>
      </header>
      <ol className="about-us__milestones">
        {milestones.map((milestone, index) => <li key={milestone.month}>
          <span className="about-us__marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <p>{milestone.month}</p>
          <h3>{milestone.title}</h3>
          <span>{milestone.description}</span>
        </li>)}
      </ol>
    </section>
  </section>;
}
