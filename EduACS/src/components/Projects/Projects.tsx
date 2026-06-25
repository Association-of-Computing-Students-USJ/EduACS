import { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import './Projects.css';

/** Project data */
interface ProjectData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: 'project-1',
    title: 'Bandaranayake Central College - Gampaha',
    description:
      'One day semiinar for the A/L ICT student. The biggest audience in the EduACS history',
    tags: ['A/l', 'ICT', 'EduACS', 'Udayanga Srimal Photography'],
    image: '/Banadaranayake.jpg',
  },
  {
    id: 'project-2',
    title: 'Rajapakse Central College - Weeraketiya',
    description:
      'Two day semiinar for the A/L ICT student. The first two day seminar in the EduACS history',
    tags: ['A/l', 'ICT', 'EduACS', 'Nisal Sanjaya Photography'],
    image: '/Rajapakse.jpg',
  },
];

/**
 * Projects — Showcase grid of featured projects/events.
 * Uses IntersectionObserver for scroll-triggered reveal animation.
 */
export default function Projects() {
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
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects__content container">
        {/* Accent line */}
        <div className="projects__accent reveal" aria-hidden="true" />

        {/* Section label */}
        <span className="projects__label reveal reveal-delay-1">Projects & Events</span>

        {/* Section header */}
        <h2 className="projects__heading reveal reveal-delay-2">
          What we're building
        </h2>

        {/* Grid */}
        <div className="projects__grid">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className={`reveal reveal-delay-${(index % 4) + 1}`}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                tags={project.tags}
                image={project.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
