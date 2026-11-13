import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { mobileOllieLine, ollieLines, roomLabel } from '../content/site.ts';
import type { RoomItemId } from '../content/types.ts';
import { ROOM_ITEMS, type RoomItemConfig } from './room.config.ts';
import { itemImages, ollieSprites, poseImages, wallPictures, type ItemArt } from './roomAssets.ts';
import styles from './MobileRoom.module.css';

/** How long Ollie's pose shows after a tap, before navigating (PLAN.md 4.4). */
export const POSE_FLASH_MS = 700;

/** Card order on mobile; the CV card comes last and spans both columns. */
const CARD_ORDER: RoomItemId[] = ['projects', 'about', 'beyond', 'contact', 'cv'];

interface Card {
  item: RoomItemConfig & { id: RoomItemId };
  href: string;
  download: boolean;
  /** The coloured item image (About uses the small wall portrait). */
  image: string;
  /** Ollie's pose shown for a moment after a tap. */
  pose: string;
}

function cardFor(id: RoomItemId): Card {
  const item = ROOM_ITEMS.find((i) => i.id === id)! as Card['item'];
  const image = item.image ? itemImages[item.image].colour : wallPictures.portraitWall;
  // Contact uses the plain phone pose here; the room uses its coloured version.
  const poseArt: ItemArt = item.pose ? poseImages[item.pose] : ollieSprites.lookup;
  const action = item.action;
  return {
    item,
    href: action.type === 'route' ? action.to : action.type === 'download' ? action.href : '/',
    download: action.type === 'download',
    image,
    pose: poseArt.white,
  };
}

const CARDS = CARD_ORDER.map(cardFor);

/** Mobile home (< 820 px): Ollie with a speech bubble, then a grid of item cards. */
function MobileRoom() {
  const navigate = useNavigate();
  const [tapped, setTapped] = useState<RoomItemId | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const downloadRefs = useRef<Partial<Record<RoomItemId, HTMLAnchorElement | null>>>({});
  const allowDownload = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCardClick = (card: Card) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Let new-tab clicks and the delayed CV download through untouched.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    if (card.download && allowDownload.current) {
      allowDownload.current = false;
      return;
    }
    event.preventDefault();
    if (tapped) return;

    setTapped(card.item.id);
    timer.current = window.setTimeout(() => {
      setTapped(null);
      if (card.download) {
        allowDownload.current = true;
        downloadRefs.current[card.item.id]?.click();
      } else {
        navigate(card.href);
      }
    }, POSE_FLASH_MS);
  };

  return (
    <section className={styles.mobile} aria-label={roomLabel}>
      <div className={styles.intro}>
        <img className={styles.ollie} src={ollieSprites.sit.white} alt="" />
        <p className={`${styles.bubble} fun`}>{mobileOllieLine}</p>
      </div>

      <ul className={styles.cards}>
        {CARDS.map((card) => {
          const id = card.item.id;
          const posing = tapped === id;
          return (
            <li key={id} className={id === 'cv' ? styles.wide : undefined}>
              <a
                ref={(el) => {
                  if (card.download) downloadRefs.current[id] = el;
                }}
                href={card.href}
                download={card.download || undefined}
                className={styles.card}
                style={{ '--item-colour': card.item.colour } as CSSProperties}
                onClick={onCardClick(card)}
                data-card={id}
                data-posing={posing || undefined}
              >
                <span className={styles.media}>
                  <img
                    className={`${styles.image} ${id === 'about' ? styles.portrait : ''}`}
                    src={card.image}
                    alt=""
                  />
                  <img className={styles.pose} src={card.pose} alt="" data-testid={`pose-${id}`} />
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{card.item.label}</span>
                  <span className={`${styles.line} fun`}>{ollieLines[id]}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default MobileRoom;
