import { useEffect, useState } from 'react';
import { getProjects } from '../../lib/content';
import { SectionHeading } from '../../components/SectionHeading';
import { fallbackProjects } from '../../data/projects';
import './Projects.css';

export function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    getProjects().then(({ data, error }) => {
      if (error) console.error('Could not load club projects from Supabase:', error);
      if (data?.length) setProjects(data);
    });
  }, []);

  return <section className="projects-section reveal-on-scroll" aria-labelledby="projects-title" data-inspect="section.projects-section">
    <SectionHeading tag="Projects" id="projects-title" title="Live in the wild." />
    <div className="project-grid">
      {projects.map((project, index) => {
        const card = <>
          <div className="project-art">
            {project.photo ? <img src={project.photo} alt="" loading="lazy" /> : <span className={`project-art__empty project-art__empty--${['blue', 'teal', 'green'][index % 3]}`} aria-hidden="true" />}
            <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
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
  </section>;
}
