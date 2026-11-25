import { useEffect, useRef } from 'react'
import { SectionHeading } from '../../components/SectionHeading'
import { formatEventDate } from '../../lib/events'
import { tutorials } from './tutorials'
import './TutorialArchive.css'

export function TutorialArchive() {
  const archive = useRef<HTMLElement>(null)

  useEffect(() => {
    function openLinkedSession() {
      const target = document.getElementById(window.location.hash.slice(1))
      if (target instanceof HTMLDetailsElement && archive.current?.contains(target)) {
        target.open = true
        target.scrollIntoView({ behavior: 'instant' })
      }
    }

    openLinkedSession()
    window.addEventListener('hashchange', openLinkedSession)
    return () => window.removeEventListener('hashchange', openLinkedSession)
  }, [])

  return (
    <section ref={archive} id="tutorial-archive" className="tutorial-archive" aria-labelledby="archive-title" data-inspect="section.tutorial-archive">
      <SectionHeading id="archive-title" title="Tutorial archive." summary="Missed a workshop? Pick a session to see what we built and try it yourself." />
      <header className="archive-term">
        <h3>Fall 2026</h3>
        <span>Sample walkthroughs</span>
      </header>
      {tutorials.map(tutorial => {
        const id = 'tutorial-' + tutorial.date
        return (
          <details className="archive-session" id={id} key={id}>
            <summary>
              <span className="archive-meta">
                <span>Session {String(tutorial.session).padStart(2, '0')}</span>
                <time dateTime={tutorial.date}>{formatEventDate(tutorial.date)}</time>
              </span>
              <span className="archive-overview">
                <strong>{tutorial.title}</strong>
                <span>{tutorial.outcome}</span>
              </span>
              <span className="archive-indicator" aria-hidden="true" />
            </summary>
            <div className="archive-content">
              <h4>Before you start</h4>
              <p>{tutorial.preparation}</p>
              <h4>Walkthrough</h4>
              <ol>{tutorial.steps.map(step => <li key={step}>{step}</li>)}</ol>
              <figure>
                <figcaption>{tutorial.material}</figcaption>
                <pre><code>{tutorial.example}</code></pre>
              </figure>
              <h4>Check your work</h4>
              <p>{tutorial.check}</p>
              <a href={'#' + id} aria-label={'Link to session ' + tutorial.session}>Link to session</a>
            </div>
          </details>
        )
      })}
    </section>
  )
}
