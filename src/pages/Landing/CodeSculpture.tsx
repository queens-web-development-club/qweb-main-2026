import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './CodeSculpture.css';

// Five solid extruded strokes form the site's < /> mark.
const symbols = [
  { name: 'open', strokes: [{ x: -96, y: -25, length: 80, angle: -45 }, { x: -96, y: 25, length: 80, angle: 45 }] },
  { name: 'slash', strokes: [{ x: 0, y: 0, length: 132, angle: -70 }] },
  { name: 'close', strokes: [{ x: 96, y: -25, length: 80, angle: 45 }, { x: 96, y: 25, length: 80, angle: -45 }] },
];
const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];

export function CodeSculpture() {
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReduced(preference.matches);
    syncMotion();
    preference.addEventListener('change', syncMotion);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    const syncVisibility = () => {
      if (document.hidden) setVisible(false);
      else if (root.current) {
        const bounds = root.current.getBoundingClientRect();
        setVisible(bounds.bottom > 0 && bounds.top < window.innerHeight);
      }
    };
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  const resetTilt = () => {
    stage.current?.style.setProperty('--tilt-x', '0deg');
    stage.current?.style.setProperty('--tilt-y', '0deg');
  };

  return <aside ref={root} className="code-sculpture" aria-label="Interactive 3D code icon: opening bracket, slash, closing bracket"
    data-inspect="aside.code-sculpture" data-expanded={expanded} data-still={paused || reduced || !visible}>
    <div ref={stage} className="code-sculpture__stage" aria-hidden="true"
      onPointerMove={(event) => {
        if (reduced || paused || event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 20}deg`);
        event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 26}deg`);
      }} onPointerLeave={resetTilt}>
      <div className="code-sculpture__tilt">
        <div className="code-sculpture__orbit code-sculpture__orbit--a"><i /></div>
        <div className="code-sculpture__orbit code-sculpture__orbit--b"><i /></div>
        <div className="code-sculpture__orbit code-sculpture__orbit--c"><i /></div>
        <div className="code-sculpture__rotation">
          {symbols.map(({ name, strokes }) => <div key={name} className={`code-sculpture__symbol code-sculpture__symbol--${name}`}>
            {strokes.map(({ x, y, length, angle }, index) => <div key={index} className="code-sculpture__stroke"
              style={{ '--x': `${x}px`, '--y': `${y}px`, '--length': `${length}px`, '--angle': `${angle}deg` } as CSSProperties}>
              {faces.map((face) => <div key={face} className={`code-sculpture__face code-sculpture__face--${face}`} />)}
            </div>)}
          </div>)}
        </div>
      </div>
    </div>
    <div className="code-sculpture__footer">
      <div className="code-sculpture__controls">
        <button type="button" aria-pressed={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? '− Assemble' : '+ Explode'}</button>
        <button type="button" disabled={reduced} aria-label={reduced ? 'Animation disabled by reduced motion preference' : paused ? 'Play 3D animation' : 'Pause 3D animation'} aria-pressed={paused || reduced}
          onClick={() => { resetTilt(); setPaused((value) => !value); }}>{paused || reduced ? 'Play' : 'Pause'}</button>
      </div>
    </div>
  </aside>;
}
