import './Term.css';

const events = [
  ['01', 'Kickoff night', 'Meet the room, set up your tools, ship a first page.', 'SEP 12', 'Open'],
  ['02', 'Workshop // HTML + CSS', 'Build a responsive page from a blank file.', 'SEP 26', 'Open'],
  ['03', 'Industry night', 'A working developer talks process, teams, and the first job.', 'OCT 17', 'Soon'],
  ['04', 'Project team formation', 'Choose a brief and turn a rough idea into a real build.', 'NOV 07', 'Soon'],
];

export function Term() {
  return <section className="term-section" id="events" aria-labelledby="term-title">
    <div className="section-heading"><div><p className="section-kicker">// 2026 — 2027</p><h2 id="term-title">This term at QWEB.</h2></div><span className="section-index">04 / 06</span></div>
    <div className="term-list">{events.map(([number,title,description,date,status])=><article className="term-row" key={number}><span className="term-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div><time>{date}</time><span className={`term-status term-status--${status.toLowerCase()}`}>{status}</span></article>)}</div>
  </section>;
}
