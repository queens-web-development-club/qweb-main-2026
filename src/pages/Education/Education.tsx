import { SectionHeading } from '../../components/SectionHeading';
import './Education.css';

/**
 * What the club teaches, in the order it teaches it. Exported because the hero
 * ticker lists the same curriculum — the two must never drift apart.
 */
export const curriculum = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React'];

/** How a client project runs, start to finish. */
const process = ['Consult', 'Design', 'Develop', 'Test', 'Deploy'];

export function Education() {
  return <section className="education reveal-on-scroll" aria-labelledby="education-title" data-inspect="section.education">
    <SectionHeading id="education-title" title="What you’ll actually learn." summary="Want more skills to put on your resume? We cover these — and more — in the curriculum." />

    <ol className="education__curriculum">
      {curriculum.map((skill, index) => <li key={skill} data-inspect="li.education__skill">
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{skill}
      </li>)}
    </ol>

    <div className="education__process" data-inspect="div.education__process">
      <header className="education__process-header">
        <p className="education__process-label">// How a client project runs</p>
        <span>Brief → handover</span>
      </header>
      <ol className="education__steps">{process.map((step) => <li key={step}>{step}</li>)}</ol>
    </div>
  </section>;
}
