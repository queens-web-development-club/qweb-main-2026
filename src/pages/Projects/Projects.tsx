import './Projects.css';

const projects = [
  { name: 'Project name', type: 'Client site', year: '2026', tone: 'blue' },
  { name: 'Project name', type: 'Club platform', year: '2026', tone: 'teal' },
  { name: 'Project name', type: 'Community build', year: '2025', tone: 'green' },
];

export function Projects() {
  return <section className="projects-section" id="projects" aria-labelledby="projects-title">
    <div className="section-heading">
      <div><p className="section-kicker">// Built by members</p><h2 id="projects-title">Live in the wild.</h2></div>
      <span className="section-index">03 / 06</span>
    </div>
    <div className="project-grid">
      {projects.map((project, index) => <article className={`project-card project-card--${project.tone}`} key={`${project.name}-${index}`}>
        <div className="project-art" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="project-meta"><div><h3>{project.name}</h3><p>{project.type}</p></div><span>{project.year}</span></div>
      </article>)}
    </div>
  </section>;
}
