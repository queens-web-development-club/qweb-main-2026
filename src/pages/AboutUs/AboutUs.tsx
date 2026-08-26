import { useEffect, useRef } from 'react';
import './AboutUs.css';

const offerings = [
  { number: '01', title: 'Workshops', description: 'Zero to deployed. Weekly sessions that start at “what is a div” and end with your own site live on the internet, on your own domain.', artifactLabel: 'deploy', artifactValue: 'site.live', artifactState: 'ready', artifact: 'browser' },
  { number: '02', title: 'Build nights', description: 'Bring a half-finished idea and a laptop. Exec and senior members float the room until the bug is dead and the thing works.', artifactLabel: 'issue', artifactValue: 'resolved', artifactState: 'closed', artifact: 'bug' },
  { number: '03', title: 'Client projects', description: 'Small teams build real sites for Queen’s club and Kingston businesses — scoped, reviewed, shipped, and handed over.', artifactLabel: 'pull request', artifactValue: 'merged', artifactState: 'approved', artifact: 'merge' },
  { number: '04', title: 'Speakers & socials', description: 'Alumni and working developers on what actually happens after graduation — plus the coffee, pizza and Discord that hold it together.', artifactLabel: 'next event', artifactValue: 'thu · 7pm', artifactState: 'open', artifact: 'calendar' },
];

const milestones = [
  { month: 'September', title: 'Show up', description: 'Kickoff night, a laptop setup that works, and your first page in the browser before you leave.' },
  { month: 'October', title: 'Ship something', description: 'Your first deploy goes live and gets a real URL you can send to your parents.' },
  { month: 'November', title: 'Join a team', description: 'Project teams form around client briefs. You take a real ticket and open a real pull request.' },
  { month: 'March', title: 'Show your work', description: 'Demo night. Every team presents what they built, in front of members and industry guests.' },
];

function ArtifactGraphic({ type }: { type: string }) {
  if (type === 'browser') return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><rect x="7" y="9" width="42" height="34" rx="2" /><path d="M7 17h42M13 13h.01M17 13h.01M21 13h.01" /><path d="M16 29l5 5 12-12" /><path d="M16 38h24" /></svg>;
  if (type === 'bug') return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><path d="M28 17v22M20 22a9 9 0 0 1 16 0v10a8 8 0 0 1-16 0Z" /><path d="M20 25h-7m7 8h-8m24-8h7m-7 8h8M22 17l-3-5m15 5 3-5" /><path className="about-us__graphic-accent" d="m23 29 4 4 7-9" /></svg>;
  if (type === 'merge') return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><circle cx="16" cy="14" r="4" /><circle cx="16" cy="42" r="4" /><circle cx="40" cy="28" r="4" /><path d="M16 18v14c0 5 4 8 9 8h10M16 18c0 5 4 10 9 10h11" /><path className="about-us__graphic-accent" d="m36 24 5 4-5 4" /></svg>;
  return <svg className="about-us__graphic" viewBox="0 0 56 56" aria-hidden="true"><rect x="10" y="12" width="36" height="34" rx="2" /><path d="M10 22h36M18 8v8m20-8v8" /><path d="M17 29h5m5 0h5m5 0h2M17 37h5m5 0h5" /><path className="about-us__graphic-accent" d="M38 35v8m-4-4h8" /></svg>;
}

export function AboutUs() {
  const aboutRef = useRef<HTMLElement>(null);

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

  return <section ref={aboutRef} className="about-us reveal-on-scroll" id="about" aria-labelledby="about-title">
    <header className="about-us__intro">
      <div className="about-us__heading">
        <p className="about-us__eyebrow">// What we do</p>
        <h2 id="about-title">Four nights a month that<br /><span>turn into a portfolio.</span></h2>
      </div>
      <p className="about-us__summary">Everything we run is hands-on. You leave every session with something on your screen that wasn’t there when you walked in.</p>
    </header>

    <div className="about-us__offerings" aria-label="What QWEB offers">
      {offerings.map((offering) => <article className="about-us__offering" key={offering.title}>
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

    <section className="about-us__journey" aria-labelledby="journey-title">
      <header className="about-us__journey-header">
        <p className="about-us__eyebrow" id="journey-title">// Your first year</p>
        <span>Fall → Spring</span>
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
