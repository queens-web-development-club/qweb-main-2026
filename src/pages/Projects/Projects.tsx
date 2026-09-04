import { useEffect, useRef, useState } from 'react';
import { getProjects } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';
import { fallbackProjects } from '../../data/projects';
import './Projects.css';

export function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(1);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    getProjects().then(({ data, error }) => {
      if (error) console.error('Could not load club projects from Supabase:', error);
      if (data?.length) setProjects(data);
    });
  }, []);

  // The meter and the counter are the only scroll affordances: no dots, no arrows.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const ratio = max > 8 ? Math.min(1, rail.scrollLeft / max) : 0;
      setProgress(ratio);
      setAtEnd(max <= 8 || max - rail.scrollLeft < 8);
      const card = rail.querySelector<HTMLElement>('.project-card');
      const step = card ? card.offsetWidth + 14 : 1;
      setCurrent(Math.min(projects.length, Math.round(rail.scrollLeft / step) + 1));
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { rail.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [projects.length]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return <section className="projects-section reveal-on-scroll" id="projects" aria-labelledby="projects-title" data-inspect="section.projects-section#projects">
    <SectionHeading tag="Projects" id="projects-title" title="Live in the wild." />
    <div className="project-rail-wrap" data-end={atEnd || undefined}>
      <div
        className="project-rail"
        ref={railRef}
        tabIndex={0}
        role="group"
        aria-label={`${projects.length} client projects. Scroll sideways, or use the arrow keys.`}
        data-inspect="div.project-rail"
      >
        {projects.map((project, index) => {
          const card = <>
            <div className="project-art">
              {project.photo ? <img src={project.photo} alt="" loading="lazy" /> : <span className={`project-art__empty project-art__empty--${['blue', 'teal', 'green'][index % 3]}`} aria-hidden="true" />}
              <span className="project-index">{pad(index + 1)}</span>
            </div>
            <div className="project-meta">
              <div><h3>{project.name}</h3><p>{project.description}</p></div>
              {project.link && <span className="project-visit" aria-hidden="true">↗</span>}
            </div>
          </>;

          return project.link
            ? <a className="project-card" key={project.id} href={project.link} target="_blank" rel="noreferrer" data-inspect="a.project-card">{card}</a>
            : <article className="project-card" key={project.id} data-inspect="article.project-card">{card}</article>;
        })}
      </div>
    </div>
    <div className="project-rail__foot">
      <div className="project-meter" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(0.06, progress)})` }} /></div>
      <p className="project-count" aria-hidden="true">{pad(current)} <i>/</i> {pad(projects.length)}</p>
    </div>
  </section>;
}
