import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import LightSwitch from './LightSwitch.tsx';
import { boxToPercent, itemBox, pictureToPercent, type RoomItemConfig } from './room.config.ts';
import { artInset, itemImages, wallPictures } from './roomAssets.ts';
import styles from './RoomItem.module.css';

interface RoomItemProps {
  item: RoomItemConfig;
  /** Hovered or focused: coloured, label shown, Ollie walks here. */
  active: boolean;
  /** Ollie's pose is shown here, so the item's own image is hidden. */
  posed: boolean;
  onActivate: () => void;
  /** Called when the light switch is used (theme toggling comes in step 3.5). */
  onToggleTheme?: () => void;
}

function RoomItem({ item, active, posed, onActivate, onToggleTheme }: RoomItemProps) {
  const style = {
    ...boxToPercent(itemBox(item)),
    zIndex: Math.round(item.y),
    '--item-colour': item.colour,
  } as CSSProperties;
  const className = `${styles.item} ${item.kind === 'floor' ? styles.floor : styles.wall}`;

  const images = item.image ? itemImages[item.image] : undefined;
  const imageStyle = images ? artInset(images) : undefined;
  const content: ReactNode = (
    <>
      {item.kind === 'floor' && <span className={styles.shadow} aria-hidden="true" />}
      {images && (
        <>
          <img
            className={styles.white}
            style={imageStyle}
            src={images.white}
            alt=""
            draggable={false}
          />
          <img
            className={styles.colour}
            style={imageStyle}
            src={images.colour}
            alt=""
            draggable={false}
          />
        </>
      )}
      {item.picture && (
        <img
          className={styles.picture}
          style={pictureToPercent(item, item.picture)}
          src={wallPictures[item.picture.image]}
          alt={item.picture.alt}
          draggable={false}
        />
      )}
      {item.id === 'switch' && <LightSwitch />}
      <span className={`${styles.label} fun`} aria-hidden="true">
        {item.label}
      </span>
    </>
  );

  const common = {
    className,
    style,
    'aria-label': item.label,
    'data-item': item.id,
    'data-active': active || undefined,
    'data-posed': posed || undefined,
    onMouseEnter: onActivate,
    onFocus: onActivate,
  };

  switch (item.action.type) {
    case 'route':
      return (
        <Link to={item.action.to} {...common}>
          {content}
        </Link>
      );
    case 'download':
      return (
        <a href={item.action.href} download {...common}>
          {content}
        </a>
      );
    case 'toggleTheme':
      return (
        <button type="button" onClick={onToggleTheme} {...common}>
          {content}
        </button>
      );
  }
}

export default RoomItem;
