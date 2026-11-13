import Gallery from '../components/Gallery.tsx';
import ImageOrPlaceholder from '../components/ImageOrPlaceholder.tsx';
import PageHeader from '../components/PageHeader.tsx';
import {
  beyondPage,
  friends,
  friendsTitle,
  hobbies,
  hobbiesTitle,
  ollie,
  paintings,
} from '../content/beyond.ts';
import { friendHead } from '../utils/images.ts';
import styles from './Beyond.module.css';

function Beyond() {
  return (
    <>
      <PageHeader
        title={beyondPage.title}
        sub={beyondPage.sub}
        accent="var(--c-beyond)"
        pose="easel"
      />

      <div className={styles.sections}>
        <section aria-labelledby="paintings-title">
          <h2 id="paintings-title" className={styles.sectionTitle}>
            {paintings.title}
          </h2>
          <p className={styles.intro}>{paintings.intro}</p>
          <Gallery images={paintings.images} />
        </section>

        <section aria-labelledby="hobbies-title">
          <h2 id="hobbies-title" className={styles.sectionTitle}>
            {hobbiesTitle}
          </h2>
          <ul className={styles.hobbies}>
            {hobbies.map((hobby) => (
              <li key={hobby.name} className={styles.hobby} data-testid="hobby">
                <span className={styles.hobbyName}>{hobby.name}</span>
                {hobby.detail && <span className={styles.hobbyDetail}>{hobby.detail}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="ollie-title">
          <h2 id="ollie-title" className={styles.sectionTitle}>
            {ollie.title}
          </h2>
          <p className={styles.intro}>{ollie.text}</p>
          <Gallery images={ollie.images} />
        </section>

        <section aria-labelledby="friends-title">
          <h2 id="friends-title" className={styles.sectionTitle}>
            {friendsTitle}
          </h2>
          <ul className={styles.friends}>
            {friends.map((friend) => (
              <li key={friend.id} className={styles.friend}>
                <article aria-labelledby={`friend-${friend.id}`}>
                  <div className={styles.friendHead}>
                    <ImageOrPlaceholder
                      src={friendHead(friend.id)}
                      alt={`${friend.name}, ${friend.breed}`}
                      fit="contain"
                    />
                  </div>
                  <h3 id={`friend-${friend.id}`} className={styles.friendName}>
                    {friend.name}
                  </h3>
                  <p className={styles.friendBreed}>{friend.breed}</p>
                  <p className={styles.friendLine}>{friend.line}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default Beyond;
