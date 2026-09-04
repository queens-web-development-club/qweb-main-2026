import { useEffect, useState } from 'react';
import { getTeamMembers, type TeamMember } from '../../lib/content';
import { splitTeam } from '../../lib/team';
import { SectionHeading } from '../../components/SectionHeading';
import './Team.css';

type DisplayMember = TeamMember & { tone: string };

// Roles only, with every personal detail null: the structure without inventing people.
const blank = { photo: null, year: null, program: null, responsibility: null, fun_fact: null };
const fallbackMembers: DisplayMember[] = [
  { id: 'fallback-1', name: 'Co-chair', role: 'Co-Chair', tone: 'blue', ...blank },
  { id: 'fallback-2', name: 'Co-chair', role: 'Co-Chair', tone: 'teal', ...blank },
  { id: 'fallback-3', name: 'Development', role: 'Development', tone: 'green', ...blank },
  { id: 'fallback-4', name: 'Education', role: 'Education', tone: 'cyan', ...blank },
  { id: 'fallback-5', name: 'Outreach', role: 'Outreach', tone: 'violet', ...blank },
  { id: 'fallback-6', name: 'Design', role: 'Design', tone: 'blue', ...blank },
];

function Person({ person }: { person: DisplayMember }) {
  const study = [person.year, person.program].filter(Boolean).join(' · ');

  return <article className={`person person--${person.tone}`} data-inspect="article.person">
    <div className="person-art">{person.photo && <img src={person.photo} alt="" loading="lazy" />}</div>
    <h3>{person.name}</h3>
    <p className="person-role">{person.role}{study && <span> · {study}</span>}</p>
    {person.responsibility && <p className="person-responsibility">{person.responsibility}</p>}
    {person.fun_fact && <p className="person-fact"><span aria-hidden="true">✦</span>{person.fun_fact}</p>}
  </article>;
}

export function Team() {
  const [members, setMembers] = useState(fallbackMembers);
  useEffect(() => {
    getTeamMembers().then(({ data, error }) => {
      if (error) console.error('Could not load team members from Supabase:', error);
      if (data?.length) setMembers(data.map((member, index) => ({ ...member, tone: fallbackMembers[index]?.tone ?? 'blue' })));
    });
  }, []);
  const { chairs, executives } = splitTeam(members);
  return <section className="team-section reveal-on-scroll" aria-labelledby="team-title" data-inspect="section.team-section">
    <SectionHeading id="team-title" title="Made by students." summary="The people behind the builds, the workshops, and the group chat that keeps it moving." />
    <div className="team-people">
      <div className="people-group"><p className="people-label">Co-chairs</p><div className="people-grid people-grid--chairs">{chairs.map((person) => <Person key={person.id} person={person} />)}</div></div>
      <div className="people-group"><p className="people-label">Executives</p><div className="people-grid">{executives.map((person) => <Person key={person.id} person={person} />)}</div></div>
    </div>
  </section>;
}
