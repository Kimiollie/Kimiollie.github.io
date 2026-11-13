import ExternalAnchor from '../components/ExternalAnchor.tsx';
import NeedsReview from '../components/NeedsReview.tsx';
import PageHeader from '../components/PageHeader.tsx';
import ProjectCard from '../components/ProjectCard.tsx';
import { moreProjects, projects, projectsPage } from '../content/projects.ts';
import styles from './Projects.module.css';
import { pageTitles } from '../content/site.ts';
import { useDocumentTitle } from '../utils/useDocumentTitle.ts';

function Projects() {
  useDocumentTitle(pageTitles.projects);
  return (
    <>
      <PageHeader
        title={projectsPage.title}
        sub={projectsPage.intro}
        accent="var(--c-projects)"
        pose="laptop"
      />

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
