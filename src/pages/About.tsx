import ExternalAnchor from '../components/ExternalAnchor.tsx';
import ImageOrPlaceholder from '../components/ImageOrPlaceholder.tsx';
import NeedsReview from '../components/NeedsReview.tsx';
import PageHeader from '../components/PageHeader.tsx';
import {
  aboutPage,
  badges,
  certificateChips,
  facts,
  skills,
  story,
  timeline,
} from '../content/about.ts';
import type { Badge } from '../content/types.ts';
import { PORTRAIT_SIZE, badgeImage, portraitImage } from '../utils/images.ts';
import styles from './About.module.css';

function BadgeItem({ badge }: { badge: Badge }) {
  const alt = `${badge.name}, ${badge.issuer}`;
  const image = (
    <ImageOrPlaceholder src={badgeImage(badge.image)} alt={alt} className={styles.badgeImage} />
  );

  return (
    <li className={styles.badge}>
      {badge.verifyUrl ? (
        <ExternalAnchor href={badge.verifyUrl} className={styles.badgeLink}>
          {image}
        </ExternalAnchor>
      ) : (
        <div className={styles.badgeLink}>{image}</div>
      )}
      <div className={styles.badgeText}>
        <span className={styles.badgeName}>
          {badge.name}
          {badge.needsReview && <NeedsReview />}
        </span>
        <span className={styles.badgeMeta}>
          {badge.issuer} · {badge.date}
        </span>
      </div>
    </li>
  );
}

function About() {
  return (
    <>
      <PageHeader
        title={aboutPage.title}
        sub={aboutPage.sub}
        accent="var(--c-about)"
        pose="lookup"
      />

      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.portraitCard}>
            <ImageOrPlaceholder
              src={portraitImage()}
              alt={aboutPage.portraitAlt}
              className={styles.portrait}
              lazy={false}
              fit="contain"
              {...PORTRAIT_SIZE}
            />
          </div>

          <section aria-labelledby="timeline-title">
            <h2 id="timeline-title" className={styles.sectionTitle}>
              {aboutPage.timelineTitle}
            </h2>
            <ol className={styles.timeline}>
              {timeline.map((entry) => (
                <li
                  key={`${entry.role}-${entry.period}`}
                  className={styles.entry}
                  data-current={entry.current ? 'true' : undefined}
                  aria-current={entry.current ? 'step' : undefined}
                >
                  <span className={styles.entryRole}>{entry.role}</span>
                  <span className={styles.entryPlace}>{entry.place}</span>
                  <span className={styles.entryPeriod}>{entry.period}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className={styles.right}>
          <section aria-labelledby="story-title">
            <h2 id="story-title" className={styles.sectionTitle}>
              {aboutPage.storyTitle}
            </h2>
            {story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <ul className={styles.facts}>
            {facts.map((fact) => (
              <li key={fact.value} className={styles.fact} data-testid="fact">
                <span className={styles.factValue}>{fact.value}</span>
                <span className={styles.factLabel}>{fact.label}</span>
              </li>
            ))}
          </ul>

          <section aria-labelledby="skills-title">
            <h2 id="skills-title" className={styles.sectionTitle}>
              {aboutPage.skillsTitle}
            </h2>
            <dl className={styles.skills}>
              {skills.map((group) => (
                <div key={group.name} className={styles.skillRow}>
                  <dt>{group.name}</dt>
                  <dd>{group.skills.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="badges-title">
            <h2 id="badges-title" className={styles.sectionTitle}>
              {aboutPage.badgesTitle}
            </h2>
            <ul className={styles.badges}>
              {badges.map((badge) => (
                <BadgeItem key={badge.name} badge={badge} />
              ))}
            </ul>
            <ul className={styles.chips}>
              {certificateChips.map((chip) => (
                <li key={chip.name} className={styles.chip}>
                  {chip.name}
                  {chip.needsReview && <NeedsReview />}
                </li>
              ))}
            </ul>
            <ExternalAnchor href={aboutPage.seeAllBadges.href} className={styles.seeAll}>
              {aboutPage.seeAllBadges.label}
              <span aria-hidden="true"> ↗</span>
            </ExternalAnchor>
          </section>
        </div>
      </div>
    </>
  );
}

export default About;
