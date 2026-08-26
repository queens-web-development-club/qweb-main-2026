import './SiteFooter.css';

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-top"><div><img src="/assets/qweb-text-white.png" alt="QWEB" /><p>Queen's Web Development Club<br />Queen's University, Kingston, ON</p></div><div className="footer-links"><div><span>Club</span><a href="#about">About</a><a href="#events">Events</a><a href="#projects">Projects</a><a href="#team">Team</a></div><div><span>Get involved</span><a href="#join">Become a member</a><a href="#projects">Have a project</a><a href="mailto:qweb@queensu.ca">Sponsor us</a><a href="mailto:qweb@queensu.ca">Contact</a></div></div></div></footer>;
}
