import './Team.css';

const chairs = [['01', 'Co-chair', 'blue'], ['02', 'Co-chair', 'teal']];
const executives = [['01', 'Development', 'green'], ['02', 'Education', 'cyan'], ['03', 'Outreach', 'violet'], ['04', 'Design', 'blue']];

function Person({ person }: { person: string[] }) {
  const [number, role, tone] = person;
  return <article className={`person person--${tone}`}><div className="person-art"><span>{number}</span></div><h3>{role}</h3><p>QWEB 2026–27</p></article>;
}

export function Team() {
  return <section className="team-section" id="team" aria-labelledby="team-title">
    <div className="section-heading"><div><p className="section-kicker">// The people running it</p><h2 id="team-title">Made by students.</h2></div><p className="team-summary">The people behind the builds, the workshops, and the group chat that keeps it moving.</p></div>
    <div className="people-group"><p className="people-label">Co-chairs</p><div className="people-grid people-grid--chairs">{chairs.map((person) => <Person key={person[0]} person={person} />)}</div></div>
    <div className="people-group"><p className="people-label">Executives</p><div className="people-grid">{executives.map((person) => <Person key={person[1]} person={person} />)}</div></div>
    <div className="join-panel" id="join"><div className="join-copy"><p className="section-kicker">// Join QWEB</p><h2>Memberships for<br />2026–27 are open.</h2><p>First year, fourth year, Artsci or Engineering — if you want to build things people can open in a browser, you belong here.</p></div><div className="join-actions"><a className="join-button" href="mailto:qweb@queensu.ca">Sign up — [link] <span>↗</span></a><a className="discord-button" href="mailto:qweb@queensu.ca">Join the Discord <span>↗</span></a><small>NO EXPERIENCE REQUIRED</small></div></div>
  </section>;
}
