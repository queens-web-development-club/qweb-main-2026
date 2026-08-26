import { useEffect, useState } from 'react';
import { getProjects, type ClubProject } from '../../lib/content';
import './Projects.css';

const fallbackProjects: ClubProject[] = [
  { id: 'fallback-1', name: 'Project name', photo: null, description: 'Client site' },
  { id: 'fallback-2', name: 'Project name', photo: null, description: 'Club platform' },
  { id: 'fallback-3', name: 'Project name', photo: null, description: 'Community build' },
];

export function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    getProjects().then(({ data, error }) => {
      if (error) console.error('Could not load club projects from Supabase:', error);
      if (data?.length) setProjects(data);
    });
  }, []);

  return <section className="projects-section reveal-on-scroll" id="projects" aria-labelledby="projects-title">
    <div className="section-heading">
      <div><p className="section-kicker">// Built by members</p><h2 id="projects-title">Live in the wild.</h2></div>
      <span className="section-index">03 / 06</span>
    </div>
    <div className="project-grid">
      {projects.map((project, index) => <article className={`project-card project-card--${['blue', 'teal', 'green'][index % 3]} reveal-on-scroll`} key={project.id}>
        <div className="project-art" aria-hidden={project.photo ? undefined : true}>{project.photo && <img src={project.photo} alt={`${project.name} project`} />}<span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="project-meta"><div><h3>{project.name}</h3><p>{project.description}</p></div></div>
      </article>)}
    </div>
  </section>;
}
