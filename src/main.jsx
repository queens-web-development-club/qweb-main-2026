import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const languages = ['JAVASCRIPT', 'CSS', 'TYPESCRIPT', 'REACT', 'NODE.JS'];
const stats = [
  { value: 150, suffix: '+', label: 'Active members' },
  { value: 20, suffix: '+', label: 'Workshops a year' },
  { value: 8, suffix: '', label: 'Client sites shipped' },
  { value: 0, prefix: '$', suffix: '', label: 'Cost to join' },
];

function AnimatedStat({ value, prefix = '', suffix = '', label }) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasStarted = useRef(false);
  const statRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => setDisplayValue(value);

    if (prefersReducedMotion) {
      finish();
      return undefined;
    }

    let frameId;
    const start = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      const startedAt = performance.now();
      const duration = 1100;

      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setDisplayValue(Math.round(value * easedProgress));

        if (progress < 1) frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      start();
      return () => {
        if (frameId) cancelAnimationFrame(frameId);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    if (statRef.current) observer.observe(statRef.current);

    return () => {
      observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [value]);

  return <article ref={statRef}><strong>{prefix}{displayValue}<span>{suffix}</span></strong><small>{label}</small></article>;
}

function App() {
  return <main className="page">
    <div className="noise" aria-hidden="true" />
    <header className="nav">
      <a className="brand" href="#top" aria-label="Queen's Web Development Club home"><span className="brand-mark">Q</span><span>web</span></a>
      <nav><a href="#about">About</a><a href="#events">Events</a><a href="#projects">Projects</a><a href="#team">Team</a></nav>
      <a className="nav-cta" href="#join">Join QWEB <span>↗</span></a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span className="signal" /> Student-run <i>·</i> Queen's University <i>·</i> Kingston, ON</p>
        <h1>Queen's Web<br /><span>Development</span> Club</h1>
        <p className="intro">We teach students to build for the web, from your first line of HTML to a production deploy. Whether you are a team that ships or someone figuring it out, there is a place for you here.</p>
        <div className="actions"><a className="primary" href="#join">Join for 2026–27 <span>↗</span></a><a className="secondary" href="#events">See our work <span>↗</span></a></div>
      </div>
      <p className="year">2026–2027</p>
      <div className="wave-field" aria-hidden="true"><div className="wave wave-a" /><div className="wave wave-b" /><div className="wave wave-c" /><div className="wave wave-d" /><div className="wave wave-e" /><div className="wave wave-f" /></div>
    </section>

    <section className="hero-bar" aria-label="Technologies we work with"><div className="bar-track">{[...languages, ...languages].map((language, index) => <span key={index}>{language}<b>✦</b></span>)}</div></section>
    <section className="stats" id="about">{stats.map((stat) => <AnimatedStat key={stat.label} {...stat} />)}</section>
    <footer><span>QWEB / Queen's Web Development Club</span><span>Built by students in Kingston, ON</span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />);
