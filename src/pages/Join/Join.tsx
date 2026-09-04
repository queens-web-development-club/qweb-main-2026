import './Join.css';

const DISCORD_INVITE = 'https://discord.gg/3Zpw49BVrh';
const CLUB_EMAIL = 'qweb@queensu.ca';

export function Join() {
  return <section className="join reveal-on-scroll" aria-labelledby="join-title" data-inspect="section.join">
    <div className="join-panel" data-inspect="div.join-panel">
      <div className="join-copy">
        <p className="section-kicker">// Join QWEB</p>
        <h2 id="join-title">Build with us in<br />2026–27.</h2>
        <p>First year, fourth year, Artsci or Engineering — if you want to build things people can open in a browser, you belong here.</p>
      </div>
      <div className="join-actions">
        <a className="join-button" href={`mailto:${CLUB_EMAIL}`}>Email us<span>↗</span></a>
        <a className="discord-button" href={DISCORD_INVITE} target="_blank" rel="noreferrer">Join the Discord<span>↗</span></a>
        <small>No experience required</small>
      </div>
    </div>

    <div className="join-routes">
      <article className="join-route" data-inspect="article.join-route">
        <h3>Applications</h3>
        {/* No form exists yet. A disabled state is honest; a button to nowhere is not. */}
        <p className="join-route__pending">Developer applications for 2026–27 aren’t open yet. Ask on Discord and we’ll tell you the day they are.</p>
      </article>

      <article className="join-route" data-inspect="article.join-route">
        <h3>Reach us</h3>
        <ul className="join-contacts">
          <li><a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord<span>↗</span></a><small>Fastest. This is where the club actually talks.</small></li>
          <li><a href={`mailto:${CLUB_EMAIL}`}>{CLUB_EMAIL}<span>↗</span></a><small>Sponsorship, client work, anything formal.</small></li>
          <li><span className="join-contacts__later">Slack</span><small>Coming later this year.</small></li>
        </ul>
      </article>

      <article className="join-route" data-inspect="article.join-route">
        <h3>Where members end up</h3>
        <p className="join-route__pending">We’re collecting where QWEB members went after graduating — the internships, the first jobs, the teams. It’ll be listed here.</p>
      </article>
    </div>
  </section>;
}
