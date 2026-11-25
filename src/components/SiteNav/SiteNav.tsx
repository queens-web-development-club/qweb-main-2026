import { InspectToggle } from '../InspectMode'
import { DIRECTOR_FORM } from '../../pages/Join/Join'
import { assetUrl } from '../../lib/urls'

export function SiteNav({ archive = false }: { archive?: boolean }) {
  const home = archive ? import.meta.env.BASE_URL : ''

  return (
    <header className="nav page-load" data-inspect="header.nav">
      <a className="brand" href={home + '#home'} aria-label="Queen's Web Development Club home">
        <img src={assetUrl('/assets/qweb-text-white.png')} alt="QWEB" />
      </a>
      <nav aria-label="Main navigation">
        <a href={home + '#about'}>About</a>
        <a href={home + '#education'}>Education</a>
        <a href={assetUrl('/tutorials/')} aria-current={archive ? 'page' : undefined}>Tutorials</a>
        <a href={home + '#join'}>Join</a>
      </nav>
      <InspectToggle />
      <a className="nav-cta" href={DIRECTOR_FORM} target="_blank" rel="noreferrer">Join QWEB</a>
    </header>
  )
}
