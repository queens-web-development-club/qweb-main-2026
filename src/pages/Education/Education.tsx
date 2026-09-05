import { useState } from 'react';
import { SectionHeading } from '../../components/SectionHeading';
import './Education.css';

/**
 * What the club teaches, in the order it teaches it. Exported because the hero
 * ticker lists the same curriculum — the two must never drift apart.
 */
export const curriculum = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React'];

/** How a client project runs, start to finish. */
const process = ['Consult', 'Design', 'Develop', 'Test', 'Deploy'];

const lessons = [
  {
    role: 'Give it structure',
    title: 'A page starts with meaning.',
    description: 'Headings, links, and sections turn your content into a page people can navigate.',
    file: 'index.html',
    code: '<main>\n  <h1>Build with QWEB.</h1>\n  <p>Your first website starts here.</p>\n  <a href="#join">Join the club</a>\n</main>',
  },
  {
    role: 'Make it your own',
    title: 'Same content. Your design.',
    description: 'Use layout, type, and colour to give that page a visual identity that works on any screen.',
    file: 'style.css',
    code: 'main {\n  max-width: 64rem;\n  margin-inline: auto;\n  padding: clamp(1rem, 5vw, 4rem);\n  color: #e9edf1;\n  background: #030607;\n}',
  },
  {
    role: 'Add interaction',
    title: 'Let the page respond.',
    description: 'Listen for an action and update what someone sees. A static page becomes something they can use.',
    file: 'script.js',
    code: 'const button = document.querySelector("button");\n\nbutton.addEventListener("click", () => {\n  button.textContent = "Count me in!";\n  button.disabled = true;\n});',
  },
  {
    role: 'Work behind the scenes',
    title: 'Go beyond the browser.',
    description: 'Run JavaScript on a server to handle requests and send data back to your website.',
    file: 'server.js',
    code: 'import { createServer } from "node:http";\n\ncreateServer((request, response) => {\n  response.setHeader("Content-Type", "application/json");\n  response.end(JSON.stringify({ club: "QWEB" }));\n}).listen(3000);',
  },
  {
    role: 'Bring it together',
    title: 'Build in reusable pieces.',
    description: 'Combine structure, styling, and interaction in components you can use across an entire site.',
    file: 'JoinButton.jsx',
    code: 'import { useState } from "react";\n\nexport function JoinButton() {\n  const [joined, setJoined] = useState(false);\n  return (\n    <button onClick={() => setJoined(true)}>\n      {joined ? "Count me in!" : "Join QWEB"}\n    </button>\n  );\n}',
  },
];

export function Education() {
  const [selected, setSelected] = useState(0);
  const lesson = lessons[selected];

  return <section className="education reveal-on-scroll" aria-labelledby="education-title" data-inspect="section.education">
    <SectionHeading id="education-title" title="What you’ll actually learn." summary="Want more skills to put on your resume? We cover these — and more — in the curriculum." />

    <div className="education__workbench">
      <div>
        <p className="education__hint">Explore the curriculum</p>
        <ol className="education__curriculum">
          {curriculum.map((skill, index) => <li key={skill} data-inspect="li.education__skill">
            <button type="button" aria-pressed={selected === index} aria-controls="education-example" onClick={() => setSelected(index)}>
              <span className="education__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="education__skill-name">{skill}<small>{lessons[index].role}</small></span>
              <span className="education__selection" aria-hidden="true">→</span>
            </button>
          </li>)}
        </ol>
      </div>
      <div className="education__example" id="education-example" role="region" aria-label="Curriculum example" aria-live="polite" aria-atomic="true" data-inspect="div.education__example">
        <div className="education__lesson" key={selected}>
          <div className="education__example-meta"><span>{lesson.file}</span><span>Example {String(selected + 1).padStart(2, '0')} / 05</span></div>
          <h3>{lesson.title}</h3>
          <p>{lesson.description}</p>
          <pre><code>{lesson.code}</code></pre>
        </div>
      </div>
    </div>

    <div className="education__process" data-inspect="div.education__process">
      <header className="education__process-header">
        <p className="education__process-label">// How a client project runs</p>
        <span>Brief → handover</span>
      </header>
      <ol className="education__steps">{process.map((step) => <li key={step}>{step}</li>)}</ol>
    </div>
  </section>;
}
