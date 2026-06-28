import React, { useState, useEffect, useRef } from 'react';
import profileImage from './Images/IMG_20251023_010948_805.png';

/* ─── GLOBAL STYLES ───────────────────────────────────────────────── */
const globalCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #0a0a0f;
    color: #e8e8f0;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; text-decoration: none; }
  ::selection { background: rgba(124,58,237,0.4); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }

  @media (max-width: 768px) {
    #about {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }
`;

/* ─── TOKENS ──────────────────────────────────────────────────────── */
const T = {
  violet:    '#7c3aed',
  violetLt:  '#a78bfa',
  violetDim: 'rgba(124,58,237,0.15)',
  bg:        '#0a0a0f',
  bgCard:    '#111118',
  bgCardHov: '#16161f',
  border:    'rgba(255,255,255,0.07)',
  borderHov: 'rgba(124,58,237,0.5)',
  textPri:   '#e8e8f0',
  textSec:   'rgba(232,232,240,0.55)',
  textMuted: 'rgba(232,232,240,0.3)',
  mono:      "'JetBrains Mono', monospace",
};

/* ─── TYPEWRITER HOOK ─────────────────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const delay = deleting ? speed / 2 : speed;

    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), pause);
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      } else {
        setDeleting(false);
        setWordIdx(i => (i + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─── INTERSECTION OBSERVER HOOK ─────────────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── NAV ─────────────────────────────────────────────────────────── */
function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Contact'];

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: '0 2rem',
    height: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: scrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? `1px solid ${T.border}` : 'none',
    transition: 'background 0.3s, border-color 0.3s',
  };

  return (
    <nav style={navStyle}>
      <span style={{ fontFamily: T.mono, fontSize: 14, color: T.violet, fontWeight: 600, letterSpacing: '-0.5px' }}>
        SS<span style={{ color: T.textMuted }}>.iam</span>
      </span>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {links.map(l => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            style={{
              fontSize: 13, fontWeight: 500,
              color: active === l.toLowerCase() ? T.violetLt : T.textSec,
              transition: 'color 0.2s',
              letterSpacing: '0.2px',
            }}
            onMouseEnter={e => e.target.style.color = T.violetLt}
            onMouseLeave={e => e.target.style.color = active === l.toLowerCase() ? T.violetLt : T.textSec}
          >
            {l}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────── */
function Hero() {
  const roles = ['SailPoint Developer', 'IAM Engineer', 'BeanShell Engineer', 'Identity Governance Specialist'];
  const typed = useTypewriter(roles);

  return (
    <section id="about" style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem',
      padding: '6rem 2rem 4rem',
      maxWidth: 900, margin: '0 auto',
      flexWrap: 'wrap',
    }}>
      <div style={{ animation: 'fadeUp 0.7s ease both', flex: '1 1 320px', maxWidth: 560 }}>
        {/* headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-1.5px',
          marginBottom: '1rem',
          color: T.textPri,
        }}>
          Sai Srinath Puducheri<br />
          <span style={{ color: T.violet }}>Enterprise</span>
        </h1>

        {/* typewriter */}
        <div style={{
          fontFamily: T.mono, fontSize: 'clamp(18px, 3vw, 26px)',
          color: T.violetLt, marginBottom: '1.5rem',
          minHeight: '2em',
        }}>
          {typed}
          <span style={{ animation: 'blink 1s step-end infinite', borderRight: `2px solid ${T.violetLt}`, marginLeft: 2 }} />
        </div>

        {/* bio */}
        <p style={{
          fontSize: 16, color: T.textSec, maxWidth: 560,
          lineHeight: 1.8, marginBottom: '2rem',
        }}>
          2+ years building identity governance automation for a large retail enterprise — SailPoint IIQ workflows,
          JML lifecycle automation, provisioning integrations, and production support across Workday, Active Directory,
          and LDAP. Based in Hyderabad, India.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#projects" style={btnPrimary}>View Projects</a>
          <a href="#contact" style={btnOutline}>Get in touch</a>
        </div>

        {/* stats row */}
        <div style={{
          display: 'flex', gap: '2.5rem', marginTop: '3rem',
          borderTop: `1px solid ${T.border}`, paddingTop: '2rem',
          flexWrap: 'wrap',
        }}>
          {[['2+', 'Years exp.'], ['30+', 'Rules deployed'], ['5', 'Integrations'], ['0', 'P1 outages']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 600, color: T.violet }}>{n}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        flex: '0 0 260px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        animation: 'fadeUp 0.8s ease both',
      }}>
        <img
          src={profileImage}
          alt="Sai Srinath"
          style={{
            width: '240px',
            height: '240px',
            objectFit: 'cover',
            borderRadius: '50%',
            border: `2px solid ${T.border}`,
            boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
          }}
        />
      </div>
    </section>
  );
}

const btnPrimary = {
  background: T.violet, color: '#fff',
  padding: '11px 24px', borderRadius: 8,
  fontSize: 14, fontWeight: 500,
  display: 'inline-block', cursor: 'pointer',
  transition: 'opacity 0.2s',
  border: 'none',
};
const btnOutline = {
  background: 'transparent', color: T.textPri,
  padding: '10px 24px', borderRadius: 8,
  fontSize: 14, fontWeight: 500,
  display: 'inline-block', cursor: 'pointer',
  border: `1px solid ${T.border}`,
  transition: 'border-color 0.2s, color 0.2s',
};

/* ─── SKILLS ──────────────────────────────────────────────────────── */
const skillGroups = [
  {
    label: 'IAM / IGA',
    color: '#7c3aed',
    items: ['SailPoint IIQ 8.4', 'JML Lifecycle Automation', 'Provisioning & Access Reviews', 'RBAC / Birthright Access'],
  },
  {
    label: 'Development',
    color: '#0ea5e9',
    items: ['BeanShell / Java', 'Rules & Workflows', 'REST / SCIM / JDBC', 'OAuth 2.0'],
  },
  {
    label: 'Directories & HR',
    color: '#10b981',
    items: ['Workday', 'Active Directory', 'LDAP / OpenDJ', 'ServiceNow'],
  },
  {
    label: 'Platforms & Tools',
    color: '#f59e0b',
    items: ['GCP / Azure', 'Splunk', 'Git', 'C# / .NET / SQL'],
  },
];

function Skills() {
  const [ref, visible] = useFadeIn();
  return (
    <section id="skills" ref={ref} style={sectionStyle}>
      <SectionLabel label="Skills" />
      <h2 style={sectionH2}>My toolkit</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginTop: '2rem',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s, transform 0.6s',
      }}>
        {skillGroups.map(g => (
          <div key={g.label} style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 12, padding: '1.25rem',
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 11, fontWeight: 600,
              color: g.color, textTransform: 'uppercase', letterSpacing: '1px',
              marginBottom: 12,
            }}>{g.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: T.textSec }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── PROJECTS ────────────────────────────────────────────────────── */
const projects = [
  {
    title: 'Vendor Logon Inactivity Rule',
    tag: 'Automation',
    tagColor: '#7c3aed',
    desc: 'Built end-to-end governance automation for inactivity detection, tiered reminder buckets, automated disablement, and reporting for vendor and franchise accounts.',
    stack: ['BeanShell', 'EDS/OpenDJ', 'Splunk', 'SailPoint IIQ'],
    highlight: true,
  },
  {
    title: 'Certificate Revocation Automation',
    tag: 'Integration',
    tagColor: '#0ea5e9',
    desc: 'Integrated chained API-driven certificate revocation into the production termination workflow with consolidated audit logging and change-management governance.',
    stack: ['REST API', 'IIQ Workflow', 'BeanShell', 'Audit Logging'],
  },
  {
    title: 'Zoom Re-Enable Automation',
    tag: 'Provisioning',
    tagColor: '#10b981',
    desc: 'Built reusable rule logic for Zoom re-enablement across contractor, vendor, and mover workflows, using SCIM and internal UUID handling.',
    stack: ['SCIM', 'IIQ Rules', 'BeanShell', 'Zoom API'],
  },
  {
    title: 'JML Termination Audit Dashboard',
    tag: 'Analytics',
    tagColor: '#f59e0b',
    desc: 'Cross-referenced Workday terminations against SailPoint audit logs to track midnight runs, hourly API activity, and AD account state changes.',
    stack: ['Python', 'Matplotlib', 'Workday XML', 'SailPoint Search'],
  },
  {
    title: 'Franchise Account Expiry',
    tag: 'Governance',
    tagColor: '#ec4899',
    desc: 'Delivered GAP-Rule-Franchise-Account-Expiry-Process with 180-day inactivity detection, reminder buckets, and automated disablement.',
    stack: ['BeanShell', 'EDS', 'Splunk', 'Email Templates'],
  },
  {
    title: 'PM POSHAN Tracker (ML) & SIH 2021',
    tag: 'Machine Learning',
    tagColor: '#8b5cf6',
    desc: 'Developed an ML-based nutrition tracker for student health monitoring and an OCR application for text extraction during the Smart India Hackathon.',
    stack: ['Python', 'ML', 'OCR', 'Hackathon'],
  },
  {
    title: 'Workday Terminated DC Users',
    tag: 'Lifecycle',
    tagColor: '#f59e0b',
    desc: 'Handled OAuth token refresh, per-org-code API iteration, Pacific timezone handling, and identity refresh to stabilize lifecycle automation.',
    stack: ['Workday API', 'OAuth 2.0', 'BeanShell', 'IIQ Workflows'],
  },
];

function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        background: hov ? T.bgCardHov : T.bgCard,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: 12, padding: '1.5rem',
        transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
        transform: hov ? 'translateY(-3px)' : 'none',
        animation: `fadeUp 0.5s ease ${index * 0.08}s both`,
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {project.highlight && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: T.violetDim, border: `1px solid rgba(124,58,237,0.3)`,
          borderRadius: 99, padding: '3px 10px',
          fontSize: 10, fontFamily: T.mono, color: T.violetLt, fontWeight: 600,
        }}>Featured</div>
      )}
      <div style={{
        display: 'inline-block',
        background: `${project.tagColor}18`,
        border: `1px solid ${project.tagColor}40`,
        color: project.tagColor,
        borderRadius: 99, padding: '3px 10px',
        fontSize: 11, fontFamily: T.mono, fontWeight: 600,
        marginBottom: 10,
      }}>{project.tag}</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.textPri, marginBottom: 8, lineHeight: 1.4 }}>
        {project.title}
      </h3>
      <p style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, marginBottom: 14 }}>
        {project.desc}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {project.stack.map(s => (
          <span key={s} style={{
            fontFamily: T.mono, fontSize: 11, color: T.textMuted,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${T.border}`,
            borderRadius: 4, padding: '2px 8px',
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  const [ref, visible] = useFadeIn();
  return (
    <section id="projects" ref={ref} style={sectionStyle}>
      <SectionLabel label="Projects" />
      <h2 style={sectionH2}>Things I've built</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16, marginTop: '2rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s',
      }}>
        {projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE TIMELINE ─────────────────────────────────────────── */
function Experience() {
  const [ref, visible] = useFadeIn();
  return (
    <section id="experience" ref={ref} style={sectionStyle}>
      <SectionLabel label="Experience" />
      <h2 style={sectionH2}>Where I've worked</h2>
      <div style={{
        marginTop: '2rem', position: 'relative',
        paddingLeft: 32,
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s, transform 0.6s',
      }}>
        {/* vertical line */}
        <div style={{
          position: 'absolute', left: 8, top: 8, bottom: 8,
          width: 1, background: T.border,
        }} />

        {[
          {
            role: 'SailPoint / IAM Developer',
            company: 'Gap Inc. (PT-IAM-CloudResources) · Hyderabad, India',
            period: 'Jul 2024 — Present',
            points: [
              'Developed 20+ SailPoint IIQ BeanShell rules and workflows automating Joiner, Mover, Leaver, and birthright access for 100,000+ identities.',
              'Built termination workflows integrating certificate revocation and downstream account disablement to strengthen offboarding security.',
              'Integrated Workday, AD, LDAP, Sectigo, Zoom, and Cerby through REST, SCIM, JDBC, and OAuth-based automation.',
              'Resolved production incidents around aggregation loops, Hibernate session issues, attribute mapping mismatches, and SQL parameter-limit failures.',
            ],
          },
          {
            role: '.NET Developer Intern',
            company: 'Verisk Analytics · Hyderabad, India',
            period: 'Jan 2024 — Jun 2024',
            points: [
              'Built and tested application features using C# and the .NET framework with SQL databases in an Agile delivery environment.',
              'Contributed to software engineering tasks and quality validation during a 6-month internship.',
            ],
          },
        ].map((exp, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 32 }}>
            <div style={{
              position: 'absolute', left: -28, top: 4,
              width: 10, height: 10, borderRadius: '50%',
              background: T.violet, border: `2px solid ${T.bg}`,
            }} />
            <div style={{
              background: T.bgCard, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: T.textPri }}>{exp.role}</span>
                <span style={{ fontFamily: T.mono, fontSize: 12, color: T.violet }}>{exp.period}</span>
              </div>
              <div style={{ fontSize: 13, color: T.textSec, marginBottom: 12 }}>{exp.company}</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {exp.points.map(p => (
                  <li key={p} style={{ display: 'flex', gap: 8, fontSize: 13, color: T.textSec }}>
                    <span style={{ color: T.violet, flexShrink: 0 }}>→</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── EDUCATION ──────────────────────────────────────────────────── */
function Education() {
  const [ref, visible] = useFadeIn();
  return (
    <section id="education" ref={ref} style={sectionStyle}>
      <SectionLabel label="Education" />
      <h2 style={sectionH2}>Academic background</h2>
      <div style={{
        marginTop: '2rem',
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: '1.5rem',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s, transform 0.6s',
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.textPri, marginBottom: 8 }}>
          Bachelor of Engineering
        </div>
        <div style={{ fontSize: 14, color: T.textSec, marginBottom: 10 }}>
          Vasavi College of Engineering, Hyderabad · CGPA: 9.2
        </div>
        <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.8 }}>
          Certifications & coursework: NPTEL – DSA & Programming (Python), Cisco NetAcad – Introduction to Networks.
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────────────── */
function Contact() {
  const [ref, visible] = useFadeIn();
  const [copied, setCopied] = useState(false);
  const email = 'saisrinath0814@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="contact" ref={ref} style={{ ...sectionStyle, paddingBottom: '6rem' }}>
      <SectionLabel label="Contact" />
      <div style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 16, padding: '3rem 2rem',
        textAlign: 'center', maxWidth: 560,
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.6s, transform 0.6s',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: T.textPri, marginBottom: 8 }}>
          Let's connect
        </h2>
        <p style={{ fontSize: 14, color: T.textSec, lineHeight: 1.8, marginBottom: 28 }}>
          Open to senior IAM / IGA roles — India or remote.<br />
          Hyderabad, India · +91 8897008834 · saisrinath0814@gmail.com
        </p>
        <button
          onClick={handleCopy}
          style={{
            ...btnPrimary,
            width: '100%', maxWidth: 280,
            justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14,
          }}
        >
          {copied ? '✓ Copied!' : `📋 ${email}`}
        </button>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 16 }}>
          {[
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/puducheri-sai-srinath-79884623a/' },
            { label: 'GitHub', href: 'https://github.com/spuduch' },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" style={{
              fontSize: 13, color: T.textMuted,
              borderBottom: `1px solid ${T.border}`,
              paddingBottom: 2,
              transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.target.style.color = T.violetLt; e.target.style.borderColor = T.violetLt; }}
              onMouseLeave={e => { e.target.style.color = T.textMuted; e.target.style.borderColor = T.border; }}
            >{label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: '1.5rem 2rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 8,
      maxWidth: 900, margin: '0 auto',
    }}>
      <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted }}>
        © 2026 Sai Srinath Puducheri · Hyderabad, India
      </span>
      <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted }}>
        Built with React
      </span>
    </footer>
  );
}

/* ─── HELPERS ─────────────────────────────────────────────────────── */
const sectionStyle = {
  maxWidth: 900, margin: '0 auto',
  padding: '5rem 2rem 2rem',
};
const sectionH2 = {
  fontSize: 28, fontWeight: 600, color: T.textPri,
  letterSpacing: '-0.5px', marginTop: 8,
};
function SectionLabel({ label }) {
  return (
    <div style={{
      fontFamily: T.mono, fontSize: 11, fontWeight: 600,
      color: T.violet, textTransform: 'uppercase', letterSpacing: '2px',
    }}>
      {`// ${label}`}
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <style>{globalCss}</style>
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
