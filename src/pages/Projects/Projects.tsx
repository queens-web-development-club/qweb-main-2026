import { useEffect, useRef, useState } from 'react';
import { getProjects, type ClubProject } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';
import { useContentList } from '../../lib/useContentList';
import './Projects.css';

export function Projects() {
  const { items: projects, isLoading, hasError } = useContentList<ClubProject>(getProjects);
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(1);

  // The meter and the counter are the only scroll affordances: no dots, no arrows.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const ratio = max > 8 ? Math.min(1, rail.scrollLeft / max) : 0;
      setProgress(ratio);
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

  return <section className="projects-section reveal-on-scroll" id="projects" aria-labelledby="projects-title" aria-busy={isLoading} data-inspect="section.projects-section#projects">
    <SectionHeading id="projects-title" title="Live in the wild." />
    {isLoading && <p className="projects-feedback" role="status">Loading projects...</p>}
    {!isLoading && hasError && <p className="projects-feedback" role="alert">Projects are unavailable right now. Please try again later.</p>}
    {!isLoading && !hasError && projects.length === 0 && <p className="projects-feedback">No projects have been added yet.</p>}
    {projects.length > 0 && <>
    <div className="project-rail-wrap">
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
    </>}
  </section>;
}
