import { useEffect, useState } from 'react';

type InspectTarget = { label: string; rect: DOMRect };

/**
 * Draws the outline and selector label for whichever `[data-inspect]` element
 * the pointer is over. Rendered only while inspect mode is on.
 */
export function InspectOverlay() {
  const [target, setTarget] = useState<InspectTarget | null>(null);

  useEffect(() => {
    let element: HTMLElement | null = null;
    let frameId: number | undefined;

    const measure = () => {
      frameId = undefined;
      if (!element?.isConnected) return setTarget(null);
      setTarget({ label: element.dataset.inspect ?? '', rect: element.getBoundingClientRect() });
    };

    // Measuring on a frame keeps pointer and scroll handling off the layout path.
    const schedule = () => { if (frameId === undefined) frameId = requestAnimationFrame(measure); };

    const onPointerMove = (event: PointerEvent) => {
      const hovered = (event.target as Element | null)?.closest<HTMLElement>('[data-inspect]') ?? null;
      if (hovered === element) return;
      element = hovered;
      if (!element) return setTarget(null);
      schedule();
    };

    const onPointerLeave = () => { element = null; setTarget(null); };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  if (!target) return null;

  const { rect, label } = target;
  // Flip the label under the outline when the element is against the top edge.
  const isLabelBelow = rect.top < 28;

  return <div className="inspect-overlay" aria-hidden="true">
    <div className="inspect-outline" style={{ transform: `translate(${rect.left}px,${rect.top}px)`, width: rect.width, height: rect.height }}>
      <span className={isLabelBelow ? 'inspect-tag inspect-tag--below' : 'inspect-tag'}>{label}</span>
    </div>
  </div>;
}
