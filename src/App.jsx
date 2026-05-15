import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  MousePointer2,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { displaySlides, profile, projects, slides } from "./data/portfolio.js";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function PortfolioImage({ slide, className = "", onClick, priority = false }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <button className={`missing-image ${className}`} onClick={onClick} type="button">
        <span>{String(slide.id).padStart(2, "0")}</span>
        <strong>{slide.title}</strong>
        <small>Place image file in public/portfolio</small>
      </button>
    );
  }

  return (
    <button className={`image-button ${className}`} onClick={onClick} type="button">
      <img
        src={slide.src}
        alt={slide.title}
        loading={priority ? "eager" : "lazy"}
        onError={() => setMissing(true)}
      />
    </button>
  );
}

function Lightbox({ index, setIndex, close }) {
  const activeIndex = Math.max(
    0,
    displaySlides.findIndex((slide) => slide.id === slides[index]?.id),
  );
  const slide = displaySlides[activeIndex];
  const goTo = (offset) => {
    const nextIndex = (activeIndex + offset + displaySlides.length) % displaySlides.length;
    setIndex(displaySlides[nextIndex].id - 1);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") goTo(1);
      if (event.key === "ArrowLeft") goTo(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close]);

  return (
    <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="icon-button lightbox-close" onClick={close} aria-label="Close image" type="button">
        <X size={22} />
      </button>
      <button
        className="icon-button lightbox-prev"
        onClick={() => goTo(-1)}
        aria-label="Previous image"
        type="button"
      >
        <ChevronLeft size={26} />
      </button>
      <div className="lightbox-frame">
        <PortfolioImage slide={slide} className="lightbox-image" priority />
        <div className="lightbox-caption">
          <span>{activeIndex + 1} / {displaySlides.length}</span>
          <strong>{slide.title}</strong>
        </div>
      </div>
      <button
        className="icon-button lightbox-next"
        onClick={() => goTo(1)}
        aria-label="Next image"
        type="button"
      >
        <ChevronRight size={26} />
      </button>
    </motion.div>
  );
}

function Hero({ openLightbox }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <motion.div
        className="hero-copy"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="eyebrow">
          <Sparkles size={16} /> Fashion Communication Portfolio
        </span>
        <h1>
          Hello,
          <span>I'm {profile.name}</span>
        </h1>
        <p>{profile.intro}</p>
        <div className="hero-actions">
          <a href="#projects" className="primary-button">
            View Projects <ArrowRight size={18} />
          </a>
          <a href="mailto:pooja.pooja@nift.ac.in" className="ghost-button">
            <Mail size={18} /> Contact
          </a>
        </div>
      </motion.div>
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
      >
        <div className="camera-shell">
          <PortfolioImage slide={slides[0]} onClick={() => openLightbox(0)} priority />
        </div>
        <div className="skill-strip">
          {profile.skills.slice(0, 4).map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StickyNav() {
  return (
    <nav className="sticky-nav" aria-label="Project navigation">
      <a href="#top">P</a>
      {projects.map((project) => (
        <a key={project.id} href={`#${project.id}`}>
          {project.number}
        </a>
      ))}
    </nav>
  );
}

function ProjectIndex() {
  return (
    <section className="project-index" id="projects">
      <motion.div
        className="section-heading"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
      >
        <span className="eyebrow">Selected work</span>
        <h2>Four stories, one visual language.</h2>
      </motion.div>
      <div className="index-grid">
        {projects.map((project, index) => (
          <motion.a
            href={`#${project.id}`}
            className={`index-card ${project.tone}`}
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08 }}
          >
            <span>{project.number}</span>
            <h3>{project.title}</h3>
            <p>{project.subtitle}</p>
            <ArrowRight size={18} />
          </motion.a>
        ))}
      </div>
    </section>
  );
}

function FloatingWall({ openLightbox }) {
  const wallSlides = useMemo(() => [slides[2], slides[12], slides[20], slides[31], slides[1]], []);

  return (
    <section className="floating-wall">
      <div className="section-heading">
        <span className="eyebrow">
          <MousePointer2 size={15} /> Interactive wall
        </span>
        <h2>Move through the portfolio like an exhibition.</h2>
      </div>
      <div className="wall-stage">
        {wallSlides.map((slide, index) => (
          <motion.div
            className="wall-plane"
            key={slide.id}
            style={{
              "--x": `${(index - 2) * 18}%`,
              "--z": `${index % 2 === 0 ? 40 : -20}px`,
              "--r": `${(index - 2) * -7}deg`,
            }}
            animate={{ y: [0, -12, 0], rotateY: [(index - 2) * -7, (index - 2) * -7 + 4, (index - 2) * -7] }}
            transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
          >
            <PortfolioImage slide={slide} onClick={() => openLightbox(slide.id - 1)} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProjectSection({ project, openLightbox }) {
  return (
    <section className={`project-section ${project.tone}`} id={project.id}>
      <motion.div
        className="project-intro"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
      >
        <span style={{ color: project.accent }}>{project.number}</span>
        <div>
          <h2>{project.title}</h2>
          <p>{project.subtitle}</p>
          <div className="keyword-row">
            {project.keywords.map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="gallery-grid">
        {project.slides.map((slide, index) => (
          <motion.article
            className={index === 0 ? "gallery-item feature" : "gallery-item"}
            key={slide.id}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.24) }}
          >
            <PortfolioImage slide={slide} onClick={() => openLightbox(slide.id - 1)} />
            <div>
              <span>{String(slide.id).padStart(2, "0")}</span>
              <strong>{slide.title}</strong>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact">
      <div>
        <span className="eyebrow">Let us connect</span>
        <h2>Portfolio by Pooja</h2>
      </div>
      <div className="contact-links">
        <a href="tel:+919950495041">
          <Phone size={17} /> {profile.contact[0]}
        </a>
        <a href="mailto:pooja.pooja@nift.ac.in">
          <Mail size={17} /> {profile.contact[1]}
        </a>
        <span>
          <MapPin size={17} /> {profile.contact[2]}
        </span>
      </div>
    </footer>
  );
}

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = reduceMotion ? "auto" : "smooth";
  }, [reduceMotion]);

  return (
    <>
      <StickyNav />
      <main>
        <Hero openLightbox={setLightboxIndex} />
        <ProjectIndex />
        <FloatingWall openLightbox={setLightboxIndex} />
        {projects.map((project) => (
          <ProjectSection key={project.id} project={project} openLightbox={setLightboxIndex} />
        ))}
      </main>
      <Contact />
      {lightboxIndex !== null && (
        <Lightbox index={lightboxIndex} setIndex={setLightboxIndex} close={() => setLightboxIndex(null)} />
      )}
    </>
  );
}
