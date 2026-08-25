import './AboutUs.css';

const offerings = [
  { icon: '/assets/workshops.svg', title: 'Workshops', description: 'Zero to deployed. Weekly sessions that start at “what is a div” and end with your own site live on the internet, on your own domain.' },
  { icon: '/assets/build-nights.svg', title: 'Build nights', description: 'Bring a half-finished idea and a laptop. Exec and senior members float the room until the bug is dead and the thing works.' },
  { icon: '/assets/client-projects.svg', title: 'Client projects', description: 'Small teams build real sites for Queen’s club and Kingston businesses — scoped, reviewed, shipped, and handed over.' },
  { icon: '/assets/speakers-socials.svg', title: 'Speakers & socials', description: 'Alumni and working developers on what actually happens after graduation — plus the coffee, pizza and Discord that hold it together.' },
];

const milestones = [
  { month: 'September', title: 'Show up', description: 'Kickoff night, a laptop setup that works, and your first page in the browser before you leave.' },
  { month: 'October', title: 'Ship something', description: 'Your first deploy goes live and gets a real URL you can send to your parents.' },
  { month: 'November', title: 'Join a team', description: 'Project teams form around client briefs. You take a real ticket and open a real pull request.' },
  { month: 'March', title: 'Show your work', description: 'Demo night. Every team presents what they built, in front of members and industry guests.' },
];

export function AboutUs() {
  return <section className="about-us" id="about" aria-labelledby="about-title">
    <div className="about-us__intro">
      <div>
        <p className="about-us__eyebrow">// What we do</p>
        <h2 id="about-title">Four nights a month that<br /><span>turn into a portfolio.</span></h2>
      </div>
      <p className="about-us__summary">Everything we run is hands-on. You leave every session with something on your screen that wasn’t there when you walked in.</p>
    </div>

    <div className="about-us__offerings">
      {offerings.map((offering) => <article className="about-us__card" key={offering.title}>
        <img className="about-us__icon" src={offering.icon} alt="" aria-hidden="true" />
        <h3>{offering.title}</h3>
        <p>{offering.description}</p>
      </article>)}
    </div>

    <div className="about-us__timeline">
      <div className="about-us__timeline-header">
        <p className="about-us__eyebrow">// Your first year</p>
        <span>Fall → Spring</span>
      </div>
      <div className="about-us__line" aria-hidden="true" />
      <div className="about-us__milestones">
        {milestones.map((milestone) => <article key={milestone.month}>
          <p>{milestone.month}</p>
          <h3>{milestone.title}</h3>
          <span>{milestone.description}</span>
        </article>)}
      </div>
    </div>
  </section>;
}
