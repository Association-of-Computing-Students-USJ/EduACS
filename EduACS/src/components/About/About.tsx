import { useEffect, useRef } from 'react';
import './About.css';

/**
 * About — Mission and vision section with editorial two-column layout.
 * Uses IntersectionObserver for scroll-triggered reveal animation.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('is-visible');
            });
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about__content container">
        {/* Accent line */}
        <div className="about__accent reveal" aria-hidden="true" />

        {/* Section label */}
        <span className="about__label reveal reveal-delay-1">About Us</span>

        {/* Two-column layout */}
        <div className="about__grid">
          <div className="about__statement reveal reveal-delay-2">
            <h2 className="about__heading">
              We break boundaries to craft experiences that
              <span className="about__heading--accent"> stand out</span> and
              <span className="about__heading--accent"> deliver results</span>.
            </h2>
          </div>

          <div className="about__body reveal reveal-delay-3">
            <p className="about__text">
              EduACS is the premier student tech community at the Faculty of Computing, 
              University of Sri Jayewardenepura. We blend creativity with technical skill, 
              turning bold ideas into digital experiences that captivate and inspire.
            </p>
            <p className="about__text">
              From hackathons and workshops to open-source contributions and industry 
              collaborations, we provide a platform for students to grow, connect, and 
              make an impact in the tech world.
            </p>

            <div className="about__stats">
              <div className="about__stat">
                <span className="about__stat-number">200+</span>
                <span className="about__stat-label">Active Members</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">15+</span>
                <span className="about__stat-label">Events / Year</span>
              </div>
              <div className="about__stat">
                <span className="about__stat-number">50+</span>
                <span className="about__stat-label">Projects Built</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
