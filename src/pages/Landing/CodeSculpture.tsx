import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './CodeSculpture.css';

const cubes = Array.from({ length: 27 }, (_, index) => ({
  x: index % 3 - 1,
  y: Math.floor(index / 3) % 3 - 1,
  z: Math.floor(index / 9) - 1,
}));
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

  return <aside ref={root} className="code-sculpture" aria-label="Interactive 3D code sculpture"
    data-inspect="aside.code-sculpture" data-expanded={expanded} data-still={paused || reduced || !visible}>
    <div className="code-sculpture__eyebrow"><span /> Built from curiosity <span className="code-sculpture__edition">Q / 001</span></div>
    <div ref={stage} className="code-sculpture__stage" aria-hidden="true"
      onPointerMove={(event) => {
        if (reduced || paused || event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 20}deg`);
        event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 26}deg`);
      }} onPointerLeave={resetTilt}>
      <div className="code-sculpture__halo" />
      <div className="code-sculpture__grid" />
      <span className="code-sculpture__coordinate code-sculpture__coordinate--top">01 / IDEAS INTO REALITY</span>
      <div className="code-sculpture__tilt">
        <div className="code-sculpture__orbit code-sculpture__orbit--a"><i /></div>
        <div className="code-sculpture__orbit code-sculpture__orbit--b"><i /></div>
        <div className="code-sculpture__orbit code-sculpture__orbit--c"><i /></div>
        <div className="code-sculpture__rotation">
          {cubes.map(({ x, y, z }, index) => <div key={index}
            className={`code-sculpture__cube${x === 0 && y === 0 && z === 0 ? ' code-sculpture__cube--core' : ''}`}
            style={{ '--x': x, '--y': y, '--z': z, '--delay': `${(Math.abs(x) + Math.abs(y) + Math.abs(z)) * 35}ms` } as CSSProperties}>
            {faces.map((face) => <div key={face} className={`code-sculpture__face code-sculpture__face--${face}`}>
              {face === 'front' && <span>{index === 13 ? '</>' : index % 4 === 0 ? '+' : '·'}</span>}
            </div>)}
          </div>)}
        </div>
      </div>
      <span className="code-sculpture__coordinate code-sculpture__coordinate--bottom">{expanded ? '27 PIECES. INFINITE POSSIBILITIES.' : 'THINK IT. BUILD IT.'}</span>
    </div>
    <div className="code-sculpture__footer">
      <div className="code-sculpture__caption"><strong>Small blocks. Big ideas.</strong><span>{reduced ? 'A different perspective on the web.' : 'Move your cursor. Break it apart.'}</span></div>
      <div className="code-sculpture__controls">
        <button type="button" aria-pressed={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? '− Assemble' : '+ Explode'}</button>
        <button type="button" disabled={reduced} aria-label={reduced ? 'Animation disabled by reduced motion preference' : paused ? 'Play 3D animation' : 'Pause 3D animation'} aria-pressed={paused || reduced}
          onClick={() => { resetTilt(); setPaused((value) => !value); }}>{paused || reduced ? 'Play' : 'Pause'}</button>
      </div>
    </div>
  </aside>;
}
