"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness, Check, Code2, GraduationCap, Mail, MapPin, Menu, MessageCircle, X } from "lucide-react";
import { Github, Linkedin } from "./brand-icons";
import { profile, skills, learning } from "@/data/profile";
import { sortProjects, type Locale } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { translations } from "@/lib/translations";
import { ContactForm } from "./contact-form";

const sections = ["inicio", "sobre", "projetos", "experiencias", "contato"];
const external = { target: "_blank", rel: "noopener noreferrer" };
export function Portfolio() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const menuButton = useRef<HTMLButtonElement>(null);
  const t = translations[locale];
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("portfolio-language");
      // Restore preference after hydration; SSR remains deterministic.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "en" || saved === "pt") setLocale(saved);
    } catch { /* Use Portuguese when browser storage is unavailable. */ }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => { document.documentElement.lang = locale === "pt" ? "pt-BR" : "en"; }, [locale]);
  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  function changeLanguage(value: Locale) {
    // Restore the visible section's relative position when translated text changes height.
    const current = document.getElementById(active);
    const offset = current?.getBoundingClientRect().top;
    setLocale(value);
    try { window.localStorage.setItem("portfolio-language", value); } catch { /* Private browsing may disable storage. */ }
    requestAnimationFrame(() => {
      if (current && offset !== undefined) window.scrollBy({ top: current.getBoundingClientRect().top - offset, behavior: "instant" });
    });
  }
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="header">
      <div className="container header-inner">
        <a href="#inicio" className="wordmark" aria-label={`${profile.shortName} — ${t.nav[0]}`} onClick={() => setMenuOpen(false)}>luiz<span>moura.</span></a>
        <nav id="main-navigation" className={`navigation ${menuOpen ? "is-open" : ""}`} aria-label={locale === "pt" ? "Navegação principal" : "Main navigation"}>
          {sections.map((id, index) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined} onClick={() => setMenuOpen(false)}>{t.nav[index]}</a>)}
        </nav>
        <div className="header-controls"><div className="language-switch" role="group" aria-label={t.language}>
          {(["pt", "en"] as const).map(lang => <button key={lang} onClick={() => changeLanguage(lang)} aria-pressed={locale === lang} lang={lang} aria-label={lang === "pt" ? "Português" : "English"}>{lang.toUpperCase()}</button>)}
        </div><button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? t.close : t.menu} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>
      </div>
    </header>
    <main id="main">
      <section id="inicio" className="hero section" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy"><div className="availability"><span className="status-dot" />{t.availability}</div>
            <p className="hero-hello">{t.hello}</p><h1 id="hero-title">Luiz Moura<span>.</span></h1>
            <h2 className="hero-title">{t.title}</h2><p className="hero-subtitle">{t.subtitle}</p><p className="hero-intro">{t.intro}</p>
            <div className="hero-actions"><a href="#projetos" className="button button-primary">{t.viewProjects}<ArrowUpRight size={19} /></a><a href="#contato" className="button button-outline">{t.getInTouch}<ArrowUpRight size={19} /></a></div>
            <div className="hero-meta"><MapPin size={15} /><span>{t.location}</span><span className="meta-divider" /><a href={profile.github} {...external} aria-label="GitHub"><Github size={18} /></a><a href={profile.linkedin} {...external} aria-label="LinkedIn"><Linkedin size={18} /></a></div>
          </div>
          <div className="profile-art" aria-label={t.profileCaption}>
            <div className="art-top"><span className="tiny-label">{t.profileLabel}</span><ArrowUpRight size={22} /></div>
            <div className="profile-photo"><Image src="/images/luiz-linkedin.png" alt={t.profilePhotoAlt} fill sizes="(max-width: 700px) 280px, (max-width: 900px) 270px, 340px" preload /></div>
            <div className="art-bottom"><span>{t.profileCaption}</span><Code2 size={26} /></div>
            <div className="education-float"><div className="icon-box"><GraduationCap size={24} /></div><div><strong>{t.courseShort}</strong><span>{t.university} <span className="lime">/</span> {t.ongoing}</span></div></div>
          </div>
        </div>
        <div className="container hero-bottom"><span>PORTFOLIO / 2026</span><a href="#sobre">{t.nav[1]}<ArrowDown size={16} /></a><span>DIAW · PUC MINAS</span></div>
      </section>

      <section id="sobre" className="section about-section" aria-labelledby="about-title"><div className="container">
        <p className="eyebrow">{t.aboutEyebrow}</p><div className="about-grid">
          <div><h2 id="about-title" className="section-title">{t.aboutTitle}<br /><span>{t.aboutAccent}</span></h2><div className="about-text">{t.about.map(p => <p key={p}>{p}</p>)}</div>
            <div className="education-note"><GraduationCap size={22} /><div><span className="tiny-label">{t.education}</span><strong>{t.courseShort} · {t.university}</strong><p>{t.campus}</p><span className="education-status">{t.ongoing}</span></div></div>
          </div>
          <aside className="skills-panel"><Code2 className="lime" size={27} /><h3>{t.skills}</h3><div className="tags">{skills.map(s => <span key={s}>{s}</span>)}</div><h4>{t.learning}</h4><div className="tags learning-tags">{learning.map(s => <span key={s}>{s}</span>)}</div><div className="languages"><h4>{t.languages}</h4>{t.languageList.map(([name, level]) => <div key={name}><span>{name}</span><span>{level}</span></div>)}</div></aside>
        </div>
      </div></section>

      <section id="projetos" className="section projects-section" aria-labelledby="projects-title"><div className="container">
        <p className="eyebrow">{t.projectsEyebrow}</p><div className="section-heading"><h2 id="projects-title" className="section-title">{t.projectsTitle}<br /><span>{t.projectsAccent}</span></h2><p>{t.projectsIntro}</p></div>
        <ol className="project-timeline" aria-label={t.timeline}>{sortProjects().map(project => <li key={project.id}>
          <div className="timeline-marker"><span /><time dateTime={project.startDate}>{project.period[locale]}</time></div>
          <article className="project-card"><div className="project-visual"><div className="browser-bar"><i /><i /><i /><span>voluntarize / {locale === "pt" ? "perfil do voluntário" : "volunteer profile"}</span><ArrowUpRight size={14} /></div><a href={project.repository} {...external} aria-label={`${project.name} — GitHub`}><Image src={project.image} alt={project.imageAlt[locale]} width={1401} height={827} sizes="(max-width: 900px) 90vw, 560px" /></a><p>{t.screenshot}</p></div>
            <div className="project-copy"><p className="tiny-label lime">{project.category[locale]}</p><h3>{project.name}<span>↗</span></h3><p>{project.description[locale]}</p><div className="tags project-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div><h4>{t.contribution}</h4><ul className="contributions">{project.contributions.map(item => <li key={item[locale]}><Check size={16} /><span>{item[locale]}</span></li>)}</ul><details><summary>{t.evidence}</summary><ul>{project.evidence.map(e => <li key={e.url}><a href={e.url} {...external}>{e.label[locale]} <ArrowUpRight size={13} /></a></li>)}</ul></details><a className="project-link" href={project.repository} {...external}><Github size={18} />{t.repository}<ArrowUpRight size={18} /></a></div>
          </article>
        </li>)}</ol>
      </div></section>

      <section id="experiencias" className="section experience-section" aria-labelledby="experience-title"><div className="container"><p className="eyebrow">{t.experienceEyebrow}</p><div className="section-heading"><h2 id="experience-title" className="section-title">{t.experienceTitle}<br /><span>{t.experienceAccent}</span></h2><p>{t.experienceIntro}</p></div>
        <div className="experience-list">{experiences.map((experience, index) => <article className="experience-row" key={experience.company}><span className="experience-index">0{index + 1}</span><div className="experience-company"><h3>{experience.company}</h3><p>{experience.role[locale]}</p></div><div className="experience-detail"><span className="period"><BriefcaseBusiness size={14} />{experience.period[locale]}</span><p>{experience.description[locale]}</p></div></article>)}</div>
      </div></section>

      <section id="contato" className="section contact-section" aria-labelledby="contact-title"><div className="container contact-grid"><div><p className="eyebrow">{t.contactEyebrow}</p><h2 id="contact-title" className="section-title">{t.contactTitle}<br /><span>{t.contactAccent}</span></h2><p className="contact-intro">{t.contactIntro}</p>
        <div className="contact-links"><a href={`mailto:${profile.email}`}><div className="icon-box"><Mail size={22} /></div><div><span>{t.email}</span><strong>{profile.email}</strong></div><ArrowUpRight size={19} /></a><a href={profile.whatsapp} {...external}><div className="icon-box"><MessageCircle size={22} /></div><div><span>{t.whatsapp}</span><strong>{profile.phone}</strong></div><ArrowUpRight size={19} /></a></div>
        <div className="social-links"><a href={profile.github} {...external}><Github size={19} />GitHub<ArrowUpRight size={14} /><span className="sr-only"> — {t.github}</span></a><a href={profile.linkedin} {...external}><Linkedin size={19} />LinkedIn<ArrowUpRight size={14} /><span className="sr-only"> — {t.linkedin}</span></a></div>
      </div><ContactForm locale={locale} /></div></section>
    </main>
    <footer className="footer"><div className="container footer-top"><a href="#inicio" className="wordmark">luiz<span>moura.</span></a><p>{t.footer}</p><a className="back-top" href="#inicio" aria-label={t.back}><ArrowUp size={20} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><span>{t.discipline}</span></div></footer>
  </>;
}
