import { Link } from 'react-router-dom';
import ExternalAnchor from '../components/ExternalAnchor.tsx';
import NeedsReview from '../components/NeedsReview.tsx';
import ProjectCard from '../components/ProjectCard.tsx';
import { moreProjects, projects, projectsPage } from '../content/projects.ts';
import { olliePose } from '../utils/images.ts';
import styles from './Projects.module.css';

function Projects() {
  const laptopPose = olliePose('laptop');

  return (
    <>
      <header className={styles.head}>
        <div className={styles.headText}>
          <h1 className={styles.title}>
            <span className={styles.accent} aria-hidden="true" />
            {projectsPage.title}
          </h1>
          <p className={styles.intro}>{projectsPage.intro}</p>
          <Link to="/" className={styles.back}>
            <span aria-hidden="true">← </span>
            {projectsPage.backLink}
          </Link>
        </div>
        <div className={styles.pose} aria-hidden="true">
          {laptopPose ? (
            <img src={laptopPose} alt="" />
          ) : (
            <div className={styles.posePlaceholder} />
          )}
        </div>
      </header>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <section className={styles.more} aria-labelledby="more-projects">
        <h2 id="more-projects">{projectsPage.moreTitle}</h2>
        <ul className={styles.moreList}>
          {moreProjects.map((item) => (
            <li key={item.name} className={styles.moreRow}>
              <h3 className={styles.moreName}>
                {item.name}
                {item.needsReview && <NeedsReview />}
              </h3>
              <p className={styles.moreDesc}>{item.description}</p>
              <ExternalAnchor href={item.href} className={styles.moreLink}>
                GitHub<span className="visually-hidden">: {item.name}</span>
                <span aria-hidden="true"> ↗</span>
              </ExternalAnchor>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Projects;
