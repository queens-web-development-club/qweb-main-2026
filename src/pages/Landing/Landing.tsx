import { useEffect, useRef, useState } from 'react';
import { AboutUs } from '../AboutUs/AboutUs';
import { Projects } from '../Projects/Projects';
import { Term } from '../Term/Term';
import { NextEvent } from '../Term/NextEvent';
import { Education, curriculum } from '../Education/Education';
import { Team } from '../Team/Team';
import { Join } from '../Join/Join';
import { Sponsors } from '../Sponsors/Sponsors';
import { SiteFooter } from '../Footer/SiteFooter';
import { InspectModeProvider, InspectToggle } from '../../components/InspectMode';
import './Landing.css';

// The ticker lists what the club teaches. It reads from the curriculum the
// Education section renders, so the two can never drift apart.
const taught = curriculum.map((skill) => skill.toUpperCase());
// Member count from qweb.dev; sites shipped is the count of the archive. The
// old 'workshops a year' figure had no source, so it is gone rather than guessed.
const stats = [
  { value: 300, suffix: '+', label: 'Active members' },
  { value: 11, suffix: '', label: 'Client sites shipped' },
  { value: 0, prefix: '$', suffix: '', label: 'Cost to join' },
];

function AnimatedStat({ value, prefix = '', suffix = '', label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasStarted = useRef(false);
  const statRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => setDisplayValue(value);

    if (prefersReducedMotion) {
      finish();
      return undefined;
    }

    let frameId: number | undefined;
    const start = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      const startedAt = performance.now();
      const duration = 1100;

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setDisplayValue(Math.round(value * easedProgress));
        if (progress < 1) frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      start();
      return () => { if (frameId) cancelAnimationFrame(frameId); };
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

function SiteWaves() {
  return <div className="site-wave-field" aria-hidden="true">
    {['wave-a', 'wave-b', 'wave-c', 'wave-d', 'wave-e', 'wave-f'].map((line) => <div className={`wave ${line}`} key={line}><div className="wave-line" /></div>)}
  </div>;
}

export function Landing() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('.page');
    if (!page) return undefined;

    const frame = requestAnimationFrame(() => page.classList.add('motion-ready'));
    const revealItems = page.querySelectorAll<HTMLElement>('.reveal-on-scroll');

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <InspectModeProvider><main className="page">
    <div className="noise" aria-hidden="true" />
    <SiteWaves />
    <section className="landing-page" id="home" aria-label="QWEB landing page">
      <header className="nav page-load" data-inspect="header.nav">
        <a className="brand" href="#home" aria-label="Queen's Web Development Club home"><img src="/assets/qweb-text-white.png" alt="QWEB" /></a>
        <nav><a href="#about">About</a><a href="#education">Education</a><a href="#join">Join</a></nav>
        <InspectToggle />
        <a className="nav-cta" href="#join">Join QWEB</a>
      </header>

      <section className="hero" id="top" data-inspect="section.hero#top">
        <div className="hero-copy page-load page-load--delayed">
          <p className="eyebrow">Student-run <i>·</i> Queen's University <i>·</i> Kingston, ON</p>
          <h1>Queen's Web<br /><span>Development</span> Club</h1>
          <p className="intro">We teach students to build for the web, from your first line of HTML to a production deploy. Whether you are a team that ships or someone figuring it out, there is a place for you here.</p>
          <div className="actions"><a className="primary" href="#join">Join for 2026–27</a><a className="secondary" href="#projects">See our work</a></div>
        </div>
        <p className="year">2026–2027</p>
        <div className="wave-field" aria-hidden="true"><div className="wave wave-a"><div className="wave-line" /></div><div className="wave wave-b"><div className="wave-line" /></div><div className="wave wave-c"><div className="wave-line" /></div><div className="wave wave-d"><div className="wave-line" /></div><div className="wave wave-e"><div className="wave-line" /></div><div className="wave wave-f"><div className="wave-line" /></div></div>
        <section className="stats page-load page-load--delayed-more" id="stats" aria-label="QWEB statistics" data-inspect="section.stats#stats">{stats.map((stat) => <AnimatedStat key={stat.label} {...stat} />)}<NextEvent /></section>
      </section>

      <section className="hero-bar" aria-label="What the club teaches" data-inspect="section.hero-bar"><p className="bar-label">What we teach</p><div className="bar-viewport"><div className="bar-track">{Array.from({ length: 4 }, (_, groupIndex) => <div className="bar-group" key={groupIndex} aria-hidden={groupIndex > 0}>{taught.map((entry) => <span key={entry}><b>✦</b><em>{entry}</em><b>✦</b></span>)}</div>)}</div></div></section>
    </section>

    {/* Projects sits directly under About Us: that section claims the club turns four
        nights a month into a portfolio, and this is the portfolio. Claim, then proof,
        then the people, then who backs them. */}
    <section className="region" id="about" data-inspect="section.region#about"><AboutUs /><Projects /><Team /><Sponsors /></section>
    <section className="region" id="education" data-inspect="section.region#education"><Education /><Term /></section>
    <section className="region" id="join" data-inspect="section.region#join"><Join /></section>
    <SiteFooter />
  </main></InspectModeProvider>;
}
