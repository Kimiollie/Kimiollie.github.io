import type { Project } from '../content/types.ts';
import { projectImage } from '../utils/images.ts';
import ExternalAnchor from './ExternalAnchor.tsx';
import NeedsReview from './NeedsReview.tsx';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const image = projectImage(project.image);
  const titleId = `project-${project.id}`;

  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={styles.media}>
        {image ? (
          <img src={image} alt={project.imageAlt ?? ''} loading="lazy" />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h2 id={titleId} className={styles.title}>
            {project.title}
          </h2>
          {project.status && <span className={styles.status}>{project.status}</span>}
          {project.needsReview && <NeedsReview />}
        </div>

        <p className={styles.meta}>{project.meta.join(' · ')}</p>

        <p className={styles.label}>{project.bulletsLabel}</p>
        <ul className={styles.bullets}>
          {project.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>

        {project.note && <p className={styles.note}>{project.note}</p>}

        <ul className={styles.tags} aria-label="Tech used">
          {project.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>

        {(project.links.length > 0 || project.linksNote) && (
          <div className={styles.links}>
            {project.links.map((link) => (
              <ExternalAnchor key={link.href} href={link.href} className={styles.link}>
                {link.label}
                <span className="visually-hidden">: {project.title}</span>
                <span aria-hidden="true"> ↗</span>
              </ExternalAnchor>
            ))}
            {project.linksNote && <span className={styles.linksNote}>{project.linksNote}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
