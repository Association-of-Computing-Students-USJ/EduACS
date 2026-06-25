interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
}

/**
 * ProjectCard — Individual project showcase card.
 * SRP: Renders one project with thumbnail gradient, title, description, and tags.
 */
export default function ProjectCard({
  title,
  description,
  tags,
  image,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__thumbnail">
        <img src={image} alt={`${title} thumbnail`} className="project-card__image" />
      </div>

      <div className="project-card__info">
        <h3 className="project-card__title">{title}</h3>
        <p className="project-card__description">{description}</p>

        <div className="project-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="project-card__tag">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
