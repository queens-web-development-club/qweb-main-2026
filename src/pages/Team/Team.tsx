import { useEffect, useState } from 'react';
import { getTeamMembers, type TeamMember } from '../../lib/content';
import './Team.css';

type DisplayMember = TeamMember & { tone: string };

const fallbackMembers: DisplayMember[] = [
  { id: 'fallback-1', name: 'Co-chair', photo: null, role: 'Co-Chair', tone: 'blue' },
  { id: 'fallback-2', name: 'Co-chair', photo: null, role: 'Co-Chair', tone: 'teal' },
  { id: 'fallback-3', name: 'Development', photo: null, role: 'Development', tone: 'green' },
  { id: 'fallback-4', name: 'Education', photo: null, role: 'Education', tone: 'cyan' },
  { id: 'fallback-5', name: 'Outreach', photo: null, role: 'Outreach', tone: 'violet' },
  { id: 'fallback-6', name: 'Design', photo: null, role: 'Design', tone: 'blue' },
];

function Person({ person, index }: { person: DisplayMember; index: number }) {
  return <article className={`person person--${person.tone}`} data-inspect="article.person"><div className="person-art" style={{ position: 'relative', overflow: 'hidden' }}>{person.photo && <img src={person.photo} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}<span>{String(index + 1).padStart(2, '0')}</span></div><h3>{person.name}</h3><p>{person.role} · QWEB 2026–27</p></article>;
}

export function Team() {
  const [members, setMembers] = useState(fallbackMembers);
  useEffect(() => {
    getTeamMembers().then(({ data, error }) => {
      if (error) console.error('Could not load team members from Supabase:', error);
      if (data?.length) setMembers(data.map((member, index) => ({ ...member, tone: fallbackMembers[index]?.tone ?? 'blue' })));
    });
  }, []);
  const chairs = members.filter((member) => member.role === 'Co-Chair');
  const executives = members.filter((member) => member.role !== 'Co-Chair');
  return <section className="team-section reveal-on-scroll" id="team" aria-labelledby="team-title" data-inspect="section.team-section#team">
    <div className="section-heading"><div><p className="section-kicker">The people running it</p><h2 id="team-title">Made by students.</h2></div><p className="team-summary">The people behind the builds, the workshops, and the group chat that keeps it moving.</p></div>
    <div className="people-group"><p className="people-label">Co-chairs</p><div className="people-grid people-grid--chairs">{chairs.map((person, index) => <Person key={person.id} person={person} index={index} />)}</div></div>
    <div className="people-group"><p className="people-label">Executives</p><div className="people-grid">{executives.map((person, index) => <Person key={person.id} person={person} index={index + 2} />)}</div></div>
    <div className="join-panel" id="join" data-inspect="div.join-panel#join"><div className="join-copy"><p className="section-kicker">// Join QWEB</p><h2>Memberships for<br />2026–27 are open.</h2><p>First year, fourth year, Artsci or Engineering — if you want to build things people can open in a browser, you belong here.</p></div><div className="join-actions"><a className="join-button" href="mailto:qweb@queensu.ca">Apply Now!<span>↗</span></a><a className="discord-button" href="https://discord.gg/3Zpw49BVrh">Join the Discord <span>↗</span></a><small>NO EXPERIENCE REQUIRED</small></div></div>
  </section>;
}
