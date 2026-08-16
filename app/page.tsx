"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    title: "Parselona",
    category: "Branding / Identity",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Sora Skincare",
    category: "Branding / Packaging",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Reflections",
    category: "Editorial / Photography",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=85",
  },
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
      hero.from(".hero-image", { scale: 1.08, duration: 1.8 })
        .from(".eyebrow", { y: 25, opacity: 0, duration: 0.7 }, "-=1.15")
        .from(".hero-title .line", { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.08 }, "-=0.45")
        .from(".hero-copy, .hero-cta", { y: 24, opacity: 0, duration: 0.65, stagger: 0.1 }, "-=0.45")
        .from(".scroll-cue", { opacity: 0, duration: 0.5 }, "-=0.15");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".work-image").forEach((el) => {
        gsap.fromTo(el, { scale: 1.08 }, {
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={root}>
      <header className="nav">
        <a href="#top" className="brand">LORENA MONTES LOMELI</a>
        <nav aria-label="Primary navigation">
          <a href="#work">WORK</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
          <button className="menu-button" aria-label="Open menu"><span /><span /><span /></button>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="hero-media">
          <img className="hero-image" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2200&q=90" alt="Editorial portrait" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">CREATIVE / DESIGN / VISUAL STORYTELLING</p>
          <h1 className="hero-title" aria-label="Lorena Montes Lomeli">
            <span className="line-wrap"><span className="line">LORENA</span></span>
            <span className="line-wrap"><span className="line">MONTES</span></span>
            <span className="line-wrap"><span className="line">LOMELI</span></span>
          </h1>
          <p className="hero-copy">I create visual experiences that combine creativity, strategy, and a strong sense of detail.</p>
          <a className="text-link hero-cta" href="#work">VIEW MY WORK <Arrow /></a>
        </div>
        <div className="scroll-cue"><span>SCROLL</span><i /></div>
      </section>

      <section id="about" className="about section-shell">
        <div className="about-image reveal image-frame">
          <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=85" alt="Quiet editorial interior" loading="lazy" />
        </div>
        <div className="about-copy reveal">
          <p className="section-number">01.</p>
          <h2>ABOUT LORENA</h2>
          <p>I&apos;m a creative professional passionate about design and visual storytelling. My work focuses on creating meaningful, aesthetic and functional solutions that connect brands with people.</p>
          <a className="text-link" href="/about">READ MORE ABOUT ME <Arrow /></a>
        </div>
      </section>

      <section id="work" className="work section-shell">
        <div className="section-heading reveal">
          <div><p className="section-number">02.</p><h2>SELECTED WORK</h2></div>
          <a className="text-link desktop-link" href="/work">VIEW ALL WORK <Arrow /></a>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a className="project reveal" href={`/work/${project.title.toLowerCase().replaceAll(" ", "-")}`} key={project.title}>
              <div className="project-media"><img className="work-image" src={project.image} alt={project.title} loading="lazy" /></div>
              <div className="project-meta">
                <h3>{project.title}</h3>
                <p>{project.category}</p>
                <span className="project-link">VIEW PROJECT <Arrow /></span>
              </div>
            </a>
          ))}
        </div>
        <div className="work-index"><span>←</span><span>01 / 05</span><span>→</span></div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-image"><img src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1600&q=85" alt="Lorena editorial portrait" loading="lazy" /></div>
        <div className="contact-copy">
          <p className="section-number">03.</p>
          <h2>LET&apos;S CREATE<br />SOMETHING<br />MEANINGFUL.</h2>
          <div className="contact-bottom">
            <div>
              <p>Have a project, collaboration, or opportunity in mind?</p>
              <p>I&apos;d love to hear from you.</p>
              <a className="text-link light-link" href="mailto:Lorena02ml@gmail.com">GET IN TOUCH <Arrow /></a>
            </div>
            <div className="details">
              <a href="mailto:Lorena02ml@gmail.com"><small>EMAIL</small><span>Lorena02ml@gmail.com</span></a>
              <a href="#"><small>INSTAGRAM</small><span>@Loreml_lml</span></a>
              <a href="tel:+15102004709"><small>PHONE</small><span>(510) 200-4709</span></a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">LORENA<br />MONTES<br />LOMELI</div>
        <div><small>PAGES</small><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></div>
        <div><small>INFO</small><a href="#">Instagram</a><a href="mailto:Lorena02ml@gmail.com">Email</a><a href="#">Privacy Policy</a></div>
        <div><small>SAY HELLO</small><p>Let&apos;s create, collaborate<br />and bring ideas to life.</p><a href="mailto:Lorena02ml@gmail.com">Lorena02ml@gmail.com</a></div>
        <div className="footer-thumb"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=500&q=80" alt="Editorial detail" loading="lazy" /></div>
        <p className="copyright">© 2026 ALL RIGHTS RESERVED</p>
      </footer>
    </main>
  );
}