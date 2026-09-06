import { useState, type CSSProperties } from 'react';
import './CodeSculpture.css';

type Point = readonly [number, number];
// Each symbol has one continuous outline, so bracket elbows have no bar seams.
const symbols: { name: string; x: number; width: number; points: Point[] }[] = [
  { name: 'open', x: -142, width: 88, points: [[72, 0], [88, 18], [30, 70], [88, 122], [72, 140], [0, 70]] },
  { name: 'slash', x: -32, width: 64, points: [[42, 0], [64, 0], [22, 140], [0, 140]] },
  { name: 'close', x: 54, width: 88, points: [[16, 0], [88, 70], [16, 140], [0, 122], [58, 70], [0, 18]] },
];

export function CodeSculpture() {
  const [expanded, setExpanded] = useState(false);

  return <aside className="code-sculpture" aria-label="3D code icon: opening bracket, slash, closing bracket" data-inspect="aside.code-sculpture" data-expanded={expanded}>
    <div className="code-sculpture__stage" aria-hidden="true">
      <div className="code-sculpture__scene">
        <div className="code-sculpture__orbit code-sculpture__orbit--a" />
        <div className="code-sculpture__orbit code-sculpture__orbit--b" />
        <div className="code-sculpture__mark">
          {symbols.map(({ name, x, width, points }) => <div key={name} className={`code-sculpture__symbol code-sculpture__symbol--${name}`}
            style={{ width, '--offset': `${x}px` } as CSSProperties}>
            {['back', 'front'].map((face) => <svg key={face} className={`code-sculpture__face code-sculpture__face--${face}`}
              viewBox={`0 0 ${width} 140`} focusable="false">
              <polygon points={points.map((point) => point.join(',')).join(' ')} />
            </svg>)}
            {points.map(([px, py], index) => {
              const [nx, ny] = points[(index + 1) % points.length];
              const length = Math.hypot(nx - px, ny - py);
              const angle = Math.atan2(ny - py, nx - px) * 180 / Math.PI;
              return <div key={index} className="code-sculpture__edge" style={{
                width: length, '--edge-x': `${px}px`, '--edge-y': `${py}px`, '--edge-angle': `${angle}deg`,
              } as CSSProperties} />;
            })}
          </div>)}
        </div>
      </div>
    </div>
    <div className="code-sculpture__controls">
      <button type="button" aria-pressed={expanded} onClick={() => setExpanded((value) => !value)}>
        {expanded ? '− Assemble' : '+ Explode'}
      </button>
    </div>
  </aside>;
}
