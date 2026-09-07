import { useState } from 'react';
import { curriculum } from '../Education/Education';

// The strip lists what the club teaches. It reads from the curriculum the
// Education section renders, so the two can never drift apart.
const taught = curriculum.map((skill) => skill.toUpperCase());

/**
 * Continuous motion needs a control someone can actually operate: the track
 * holds no focusable elements, so pausing on hover or focus reaches neither a
 * keyboard nor a touch visitor. The button is that mechanism, and reduced-motion
 * users get a still strip from CSS regardless.
 */
export function CurriculumTicker({ skills = taught, startPaused = false }: { skills?: string[]; startPaused?: boolean }) {
  const [paused, setPaused] = useState(startPaused);

  return <section className="hero-bar" aria-label="What the club teaches" data-inspect="section.hero-bar">
    <p className="bar-label">What we teach</p>
    <div className="bar-viewport">
      <div className="bar-track" data-paused={paused}>
        {Array.from({ length: 4 }, (_, groupIndex) => <div className="bar-group" key={groupIndex} aria-hidden={groupIndex > 0}>
          {skills.map((entry, index) => <span key={entry}>
            <b className="bar-mark" aria-hidden="true" /><em>{entry}</em><small>{String(index + 1).padStart(2, '0')}</small>
          </span>)}
        </div>)}
      </div>
    </div>
    <button type="button" className="bar-toggle" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
      {paused ? 'Play' : 'Pause'}<span className="visually-hidden"> the list of what we teach</span>
    </button>
  </section>;
}
