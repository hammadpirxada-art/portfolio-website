import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';

const projects = [
  {
    id: 'my-bakery',
    name: 'My Bakery',
    type: 'E-commerce · Food & hospitality',
    description: 'An online storefront for traditional sweets, celebration cakes, fresh bakes and savouries.',
    href: 'https://my-bakers.netlify.app/',
    cover: 'bakery',
    image: '/projects/bakery.webp',
    number: '01',
    secondary: { label: 'Google Sites version', href: 'https://sites.google.com/view/my-bakery-order-sweets-cakes-s/full-page-embed' },
  },
  {
    id: 'maintainly',
    name: 'Maintainly',
    type: 'Product design · Web app MVP',
    description: 'A business maintenance prototype for asset records, service reminders, vendor contacts and cost tracking.',
    href: 'https://maintainly-app.pages.dev/',
    cover: 'maintainly',
    image: '/projects/maintainly.png',
    number: '02',
  },
  {
    id: 'meadows',
    name: 'The Meadows Banquet',
    type: 'Hospitality · Website proposal',
    description: 'An interactive venue proposal featuring event options, venue information, a gallery and enquiry paths.',
    href: 'https://hammadpirxada-art.github.io/the-meadows-banquet/',
    cover: 'meadows',
    image: '/projects/meadows-banquet.png',
    number: '03',
  },
  {
    id: 'elara',
    name: 'ÉLARA',
    type: 'Beauty & wellness · Website demo',
    description: 'A luxury salon experience with service menus, pricing, gallery, artist profiles and appointment enquiries.',
    href: 'https://elara34.netlify.app/',
    cover: 'elara',
    image: '/projects/elara.jpg',
    number: '04',
  },
  {
    id: 'portfolio',
    name: 'Developer Portfolio',
    type: 'Personal website · WordPress & Shopify',
    description: 'A professional profile presenting services, selected projects, skills, education and contact information.',
    href: 'https://itsmehammad.netlify.app/',
    cover: 'portfolio',
    image: '/projects/portfolio-v1.png',
    number: '05',
  },
  {
    id: 'ahmed',
    name: 'Portfolio Design Demo',
    type: 'Layout exploration · Sample content',
    description: 'A visual portfolio exploration. The profile details shown in the demo are illustrative sample content.',
    href: 'https://ahmed-pirzada.netlify.app/',
    cover: 'ahmed',
    image: '/projects/ahmed-pirzada.png',
    number: '06',
  },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className="site-header shell" id="top">
      <Link className="brand" to="/" aria-label="Hammad Pirzada home">
        <span className="brand-mark">H<span>.</span></span>
        <span className="brand-name">Hammad Pirzada<small>Web developer &amp; designer</small></span>
      </Link>
      <button className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span />
      </button>
      <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/work">Work <span className="nav-count">06</span></NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink className="nav-cta" to="/contact">Let’s talk <span>↗</span></NavLink>
      </nav>
    </header>
  );
}

function GlobalDecor() {
  return <div className="ambient-scene" aria-hidden="true"><span className="ambient-orb ambient-orb-one" /><span className="ambient-orb ambient-orb-two" /><span className="ambient-ring ambient-ring-one" /><span className="ambient-ring ambient-ring-two" /><span className="ambient-grain" /></div>;
}

function CursorAura() {
  const auraRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    const aura = auraRef.current;
    if (!aura) return undefined;

    const follow = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.17;
      currentY += (targetY - currentY) * 0.17;
      aura.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) frame = window.requestAnimationFrame(follow);
    };
    const onPointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      aura.classList.add('is-visible');
      if (!frame) frame = window.requestAnimationFrame(follow);
    };
    const hide = () => aura.classList.remove('is-visible');
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', hide);
    document.documentElement.addEventListener('pointerleave', hide);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', hide);
      document.documentElement.removeEventListener('pointerleave', hide);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="cursor-aura" ref={auraRef} aria-hidden="true" />;
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
        frame = 0;
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

function RevealOnScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const targets = document.querySelectorAll('main section, .project-card.reveal, .expertise-intro, .expertise-list article, .capability-grid article, .learning-card, .contact-aside');
    const pendingTargets = [...targets].filter((target) => !target.classList.contains('is-visible'));
    if (!('IntersectionObserver' in window)) {
      pendingTargets.forEach((target) => target.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    pendingTargets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

function Footer() {
  return (
    <footer className="site-footer shell">
      <Link className="brand" to="/">
        <span className="brand-mark">H<span>.</span></span>
        <span className="brand-name">Hammad Pirzada<small>Web developer &amp; designer</small></span>
      </Link>
      <a className="footer-note footer-email" href="mailto:hammadpirxada@gmail.com">HAMMADPIRXADA@GMAIL.COM</a>
      <span>© {new Date().getFullYear()} HAMMAD PIRZADA</span>
      <a className="footer-top" href="#top">BACK TO TOP ↑</a>
    </footer>
  );
}

function ProjectArtwork({ project }) {
  const label = project.cover === 'maintainly' ? 'MAINTAINLY' : project.cover === 'bakery' ? 'MY BAKERY' : project.cover === 'meadows' ? 'THE MEADOWS' : project.cover === 'elara' ? 'ÉLARA' : project.cover === 'portfolio' ? 'HP.' : 'DESIGN STUDY';
  return (
    <div className={`project-art art-${project.cover}`} aria-hidden="true">
      {project.image && <img className="project-screenshot" src={project.image} alt="" loading="lazy" />}
      <div className="art-browser">
        <div className="art-browserbar"><span><i /><i /><i /></span><b>{label.toLowerCase().replaceAll(' ', '')}.site</b><span>···</span></div>
        <div className="art-canvas">
          {project.cover === 'bakery' && <><div className="bakery-mark">MY <b>BAKERY</b><i>✳</i></div><div className="bakery-headline">Made for<br /><em>sweet moments.</em></div><div className="bakery-plate"><span>✳</span></div><small>MITHAI · CAKES · BAKES</small></>}
          {project.cover === 'maintainly' && <><div className="dashboard-nav"><b>m.</b><span>OVERVIEW &nbsp;&nbsp; ASSETS &nbsp;&nbsp; SCHEDULE</span><i>H</i></div><div className="dashboard-title">Good morning, Hammad.<small>Here’s what needs your attention.</small></div><div className="dashboard-metrics"><div><small>TOTAL ASSETS</small><b>28</b><i>+4 this month</i></div><div><small>DUE SOON</small><b>04</b><i>Next 7 days</i></div><div><small>SPEND</small><b>Rs 86k</b><i>This month</i></div></div><div className="dashboard-lines"><span /><span /><span /></div></>}
          {project.cover === 'meadows' && <><div className="meadows-brand">THE MEADOWS <span>VENUE · KARACHI</span></div><div className="meadows-gate"><i /><b>✳</b><strong>WHERE EVERY<br />CELEBRATION<br /><em>FINDS ITS PLACE</em></strong></div><small>WEDDINGS · CELEBRATIONS · GATHERINGS</small></>}
          {project.cover === 'elara' && <><div className="elara-brand">ÉLARA <span>THE ART OF BEAUTIFUL LIVING</span></div><div className="elara-silhouette"><i /><b /></div><div className="elara-title">A moment<br /><em>for yourself.</em></div><small>HAIR · SKIN · BRIDAL</small></>}
          {project.cover === 'portfolio' && <><div className="personal-nav">HP<span>.</span><small>WORK&nbsp;&nbsp; ABOUT&nbsp;&nbsp; CONTACT</small></div><div className="personal-title">Business websites.<br /><em>Shopify stores.</em><br />Practical solutions.</div><div className="personal-chip">WORDPRESS&nbsp; / &nbsp;SHOPIFY&nbsp; / &nbsp;WEB</div></>}
          {project.cover === 'ahmed' && <><div className="study-orbit"><i /></div><div className="study-title">A personal<br /><em>portfolio concept.</em></div><small>LAYOUT STUDY · SAMPLE CONTENT</small></>}
        </div>
      </div>
      <span className="art-type">{project.type}</span>
    </div>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <article className={`project-card reveal ${featured ? 'project-card-featured' : ''}`}>
      <a className="project-visual" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
        <ProjectArtwork project={project} /><span className="project-launch">↗</span>
      </a>
      <div className="project-caption">
        <div><p className="project-index">PROJECT {project.number} <span>—</span> {project.type}</p><h3>{project.name}</h3><p className="project-summary">{project.description}</p></div>
        <a className="project-arrow" href={project.href} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`}>↗</a>
      </div>
      {project.secondary && <a className="secondary-project-link" href={project.secondary.href} target="_blank" rel="noreferrer">Also view: {project.secondary.label} ↗</a>}
    </article>
  );
}

function HeroArtwork() {
  return (
    <div className="hero-visual" aria-label="Design and development workspace illustration" role="img">
      <div className="visual-topline"><span>DESIGN × DEVELOPMENT</span><span>01 — 04</span></div>
      <div className="visual-window">
        <div className="window-bar"><span><i /><i /><i /></span><b>hammadpirzada.dev</b><span className="window-menu">···</span></div>
        <div className="window-content">
          <div className="window-nav"><b>HP<span>.</span></b><span>WORK &nbsp; ABOUT &nbsp; CONTACT</span></div>
          <div className="window-grid"><div className="window-copy"><span>THOUGHTFUL DIGITAL WORK</span><strong>Ideas into<br /><em>experiences.</em></strong><i /><small>Clear, useful websites built with intention.</small></div><div className="window-art"><div className="art-sun" /><div className="art-leaf leaf-a" /><div className="art-leaf leaf-b" /><div className="art-ground" /></div></div>
          <div className="window-bottom"><span>THOUGHTFUL BY DESIGN</span><span>BUILT FOR PEOPLE ↗</span></div>
        </div>
      </div>
      <div className="visual-stamp"><span>DESIGN</span><b>+</b><span>DEVELOP</span></div>
      <div className="visual-note"><span>01</span><p>Good work happens<br />at the meeting point.</p></div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <main>
        <section className="hero shell" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="availability-dot" /> AVAILABLE FOR PROJECTS <span className="eyebrow-divider">/</span> KARACHI, PK</p>
            <h1>Digital work,<br /><em>thoughtfully</em> made.</h1>
            <p className="hero-intro">I’m Hammad, a web developer and digital designer. I create distinctive business websites, e-commerce experiences, and practical web prototypes.</p>
            <div className="hero-actions"><Link className="button button-dark" to="/work">Explore my work <span>↗</span></Link><Link className="text-link" to="/about">A little about me <span>→</span></Link></div>
            <div className="hero-specialties"><span>WORDPRESS &amp; ELEMENTOR</span><i /><span>SHOPIFY</span><i /><span>REACT</span></div>
          </div>
          <HeroArtwork />
          <a className="hero-scroll" href="#selected-work"><span>SCROLL TO EXPLORE</span><b>↓</b></a>
        </section>

        <section className="proof-strip"><div className="shell proof-inner"><p>WHAT I DO</p><div><span>Digital design</span><i>✳</i><span>Business websites</span><i>✳</i><span>E-commerce</span><i>✳</i><span>Web prototypes</span></div></div></section>

        <section className="work-section shell" id="selected-work">
          <div className="section-heading"><div><p className="eyebrow">A SELECTION OF RECENT WORK</p><h2>Built to be useful.<br /><em>Designed to be remembered.</em></h2></div><Link className="view-all" to="/work">All projects <span>↗</span></Link></div>
          <div className="projects home-projects"><ProjectCard project={projects[1]} featured /><ProjectCard project={projects[0]} /><ProjectCard project={projects[2]} /></div>
          <div className="section-end"><span>MORE SELECTED PROJECTS ON THE WORK PAGE</span><Link to="/work">See all six projects <span>→</span></Link></div>
        </section>

        <section className="expertise-section"><div className="shell expertise-grid"><div className="expertise-intro"><p className="eyebrow">DESIGN SENSIBILITY. DEVELOPMENT THINKING.</p><h2>From first sketch<br />to <em>live website.</em></h2><p>I bring structure to ideas and care to every detail, creating digital experiences that feel considered and work smoothly across devices.</p><Link className="text-link" to="/about">More about how I work <span>→</span></Link></div><div className="expertise-list"><article><span>01</span><div><h3>Interface &amp; visual design</h3><p>Clear page structure, thoughtful typography, and visual systems with personality.</p></div><b>↗</b></article><article><span>02</span><div><h3>Websites &amp; e-commerce</h3><p>WordPress, Elementor, and Shopify sites that help businesses show up with confidence.</p></div><b>↗</b></article><article><span>03</span><div><h3>Web applications</h3><p>React interfaces and Node.js APIs, shaped around useful workflows and clear screens.</p></div><b>↗</b></article><article><span>04</span><div><h3>Growing into data engineering</h3><p>Currently learning Multi-Cloud Data Engineering and expanding how I think about digital products.</p></div><b>↗</b></article></div></div></section>

        <section className="home-contact"><div className="shell home-contact-inner"><div><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s make<br /><em>something matter.</em></h2></div><Link className="button button-light" to="/contact">Start a conversation <span>↗</span></Link></div></section>
      </main>
      <Footer />
    </>
  );
}

function WorkPage() {
  return (
    <>
      <main>
        <section className="page-intro shell"><p className="eyebrow">INDEPENDENT WORK · LIVE DEMOS</p><h1>Selected <em>work.</em></h1><div className="page-intro-bottom"><p>A mix of business websites, product prototypes, and digital concepts — each made to solve a real communication or workflow challenge.</p><span>06 PROJECTS<br />2024 — 2026</span></div></section>
        <section className="work-section shell page-work"><div className="projects work-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} featured={project.id === 'my-bakery'} />)}</div></section>
        <section className="page-cta"><div className="shell"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let’s build something<br />useful <em>together.</em></h2><Link className="button button-dark" to="/contact">Let’s talk <span>↗</span></Link></div></section>
      </main>
      <Footer />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <main>
        <section className="page-intro about-intro shell"><p className="eyebrow">A LITTLE ABOUT ME</p><h1>Curious by nature.<br /><em>Developer by craft.</em></h1><div className="page-intro-bottom"><p>I’m Hammad Pirzada, a Karachi-based web developer and digital designer focused on WordPress, Elementor, Shopify, React, and Node.js.</p><span>BASED IN<br />KARACHI, PAKISTAN</span></div><div className="about-orb"><span>H<span>.</span></span><i /><b>DESIGN<br />MEETS CODE</b></div></section>

        <section className="about-story"><div className="shell story-grid"><div><p className="eyebrow">HOW I THINK ABOUT THE WORK</p><h2>Good work begins<br />with <em>good questions.</em></h2></div><div className="about-copy"><p>I enjoy the space where design and technology meet. A strong website should feel easy to use, carry a point of view, and take care of small details without getting in the way.</p><p>I build business websites, personal portfolios, e-commerce stores, and web app prototypes. My process starts with understanding the goal, then shaping the content, visual direction, and build around it.</p><p>Alongside web development, I’m learning Multi-Cloud Data Engineering and exploring how data systems can support useful digital products.</p></div></div></section>

        <section className="capabilities"><div className="shell"><div className="section-heading compact-heading"><div><p className="eyebrow">MY TOOLKIT</p><h2>What I bring <em>to the table.</em></h2></div></div><div className="capability-grid"><article><span>01 / DESIGN</span><h3>Interface &amp; visual design</h3><p>Page structure, responsive layouts, visual hierarchy and design details that help a brand feel cohesive.</p><div className="tool-chips"><b>UI DESIGN</b><b>RESPONSIVE WEB</b></div></article><article><span>02 / DEVELOPMENT</span><h3>Websites &amp; e-commerce</h3><p>Business sites and online stores built with practical customer journeys and clear information.</p><div className="tool-chips"><b>WORDPRESS</b><b>ELEMENTOR</b><b>SHOPIFY</b></div></article><article><span>03 / FULL STACK</span><h3>Apps &amp; APIs</h3><p>React interfaces paired with Node.js APIs for useful, interactive web applications.</p><div className="tool-chips"><b>REACT</b><b>NODE.JS</b><b>REST API</b></div></article></div></div></section>

        <section className="learning-section"><div className="shell learning-card"><div><p className="eyebrow">CURRENTLY LEARNING</p><h2>Multi-Cloud<br /><em>Data Engineering.</em></h2></div><p>Expanding my understanding of cloud platforms, data pipelines and how modern applications move information reliably.</p><span className="learning-symbol">↗</span></div></section>
        <section className="about-contact"><div className="shell"><p className="eyebrow">LET’S BUILD SOMETHING USEFUL</p><h2>Have a good idea?<br /><em>Tell me about it.</em></h2><Link className="button button-dark" to="/contact">Get in touch <span>↗</span></Link></div></section>
      </main>
      <Footer />
    </>
  );
}

function ContactPage() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus('sending');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your message could not be sent.');
      setStatus('success');
      setMessage('Thanks — your message has been sent. I’ll be in touch soon.');
      formElement.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error.message === 'Failed to fetch' || error.message.includes('not connected') ? 'The contact form is not connected yet. Please email hammadpirxada@gmail.com or call / WhatsApp 0370 3426757.' : error.message);
    }
  }

  return (
    <>
      <main>
        <section className="contact-intro shell"><div className="contact-heading"><p className="eyebrow"><span className="availability-dot" /> OPEN TO GOOD PROJECTS</p><h1>Have an idea?<br /><em>Let’s talk.</em></h1><p>Tell me what you’re building, what needs to work better, or where you’d like a hand. I’ll get back to you as soon as I can.</p></div><div className="contact-side"><span className="contact-glyph">H<span>.</span></span><p>DESIGN MINDED.<br />DEVELOPMENT FOCUSED.</p></div></section>
        <section className="contact-content shell"><form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-heading"><p className="eyebrow">SEND A PROJECT NOTE</p><span>ALL FIELDS REQUIRED</span></div>
          <div className="honeypot" aria-hidden="true"><label>Website<input name="website" type="text" tabIndex="-1" autoComplete="off" /></label></div>
          <label>Your name<input name="name" type="text" placeholder="Name" minLength="2" maxLength="100" autoComplete="name" required /></label>
          <label>Email address<input name="email" type="email" placeholder="you@example.com" maxLength="200" autoComplete="email" required /></label>
          <label>What are you looking to build?<select name="projectType" defaultValue="" required><option value="" disabled>Select a project type</option><option>Business website</option><option>E-commerce store</option><option>Web application</option><option>Design collaboration</option><option>Something else</option></select></label>
          <label>Tell me a little about it<textarea name="message" placeholder="The idea, the challenge, the timeline — anything that helps me understand." minLength="15" maxLength="3000" rows="5" required /></label>
          <div className="form-end"><button className="button button-dark" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <span>↗</span></button><p aria-live="polite" className={`form-status status-${status}`}>{message}</p></div>
        </form><aside className="contact-aside"><div><p className="eyebrow">GET IN TOUCH</p><h2>Let’s make<br /><em>something useful.</em></h2><p className="contact-availability">Available for web projects and collaborations.</p></div><div className="contact-detail"><p className="eyebrow">EMAIL</p><a className="contact-method" href="mailto:hammadpirxada@gmail.com">hammadpirxada@gmail.com <span>↗</span></a></div><div className="contact-detail"><p className="eyebrow">CALL OR WHATSAPP</p><a className="contact-method" href="tel:+923703426757">0370 3426757 <span>↗</span></a><a className="contact-method contact-whatsapp" href="https://wa.me/923703426757" target="_blank" rel="noreferrer">Message on WhatsApp <span>↗</span></a></div><div className="contact-detail"><p className="eyebrow">BASED IN</p><p>Karachi, Pakistan · Available for remote work</p><a className="text-link contact-linkedin" href="https://www.linkedin.com/in/hammad-pirzada-5938583a7/" target="_blank" rel="noreferrer">Connect on LinkedIn <span>↗</span></a></div></aside></section>
      </main>
      <Footer />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  useEffect(() => {
    const titles = { '/': 'Hammad Pirzada — Web Developer & Digital Designer', '/work': 'Selected Work — Hammad Pirzada', '/about': 'About — Hammad Pirzada', '/contact': 'Contact — Hammad Pirzada' };
    document.title = titles[location.pathname] || titles['/'];
  }, [location.pathname]);

  return <><GlobalDecor /><div className="site-content"><ScrollProgress /><RevealOnScroll /><ScrollToTop /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/work" element={<WorkPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<HomePage />} /></Routes><CursorAura /></div></>;
}
