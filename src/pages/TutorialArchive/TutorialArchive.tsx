import { useEffect, useRef } from 'react'
import { InspectModeProvider } from '../../components/InspectMode'
import { SiteNav } from '../../components/SiteNav/SiteNav'
import { SiteFooter } from '../Footer/SiteFooter'
import '../Landing/Landing.css'
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
    <InspectModeProvider>
      <a className="skip-link" href="#tutorial-archive">Skip to tutorials</a>
      <SiteNav archive />
      <main ref={archive} id="tutorial-archive" className="tutorial-archive" aria-labelledby="archive-title" tabIndex={-1} data-inspect="main.tutorial-archive">
        <header className="archive-heading">
          <h1 id="archive-title">Tutorial archive.</h1>
          <p>Missed a workshop? Pick a session to see what we built and try it yourself.</p>
        </header>
        <header className="archive-term">
          <h2>Fall 2026</h2>
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
                <h3>Before you start</h3>
                <p>{tutorial.preparation}</p>
                <h3>Walkthrough</h3>
                <ol>{tutorial.steps.map(step => <li key={step}>{step}</li>)}</ol>
                <figure>
                  <figcaption>{tutorial.material}</figcaption>
                  <pre><code>{tutorial.example}</code></pre>
                </figure>
                <h3>Check your work</h3>
                <p>{tutorial.check}</p>
                <a href={'#' + id} aria-label={'Link to session ' + tutorial.session}>Link to session</a>
              </div>
            </details>
          )
        })}
      </main>
      <SiteFooter home={import.meta.env.BASE_URL} />
    </InspectModeProvider>
  )
}
