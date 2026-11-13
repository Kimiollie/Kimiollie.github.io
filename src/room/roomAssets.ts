import roomDay from '../assets/room/room_day_empty.webp';
import roomNight from '../assets/room/room_night_empty.webp';
import desk from '../assets/items/desk.webp';
import deskColour from '../assets/items/desk_c.webp';
import easel from '../assets/items/easel.webp';
import easelColour from '../assets/items/easel_c.webp';
import mailbox from '../assets/items/mailbox.webp';
import mailboxColour from '../assets/items/mailbox_c.webp';
import ball from '../assets/items/ball.webp';
import ballColour from '../assets/items/ball_c.webp';
import portraitWall from '../assets/items/portrait_wall.webp';
import type { ItemImage } from './room.config.ts';

export const roomBackgrounds = { day: roomDay, night: roomNight };

/** Pictures shown inside wall items. */
export const wallPictures = { portraitWall };

export interface ItemArt {
  white: string;
  colour: string;
  /** Natural image size in px. */
  width: number;
  height: number;
  /** Transparent padding around the drawing, in px, on every side. */
  pad: number;
}

/** White and coloured (hover) version of each floor item. */
export const itemImages: Record<ItemImage, ItemArt> = {
  desk: { white: desk, colour: deskColour, width: 332, height: 320, pad: 25 },
  easel: { white: easel, colour: easelColour, width: 235, height: 377, pad: 25 },
  mailbox: { white: mailbox, colour: mailboxColour, width: 226, height: 332, pad: 25 },
  ball: { white: ball, colour: ballColour, width: 242, height: 243, pad: 25 },
};

/**
 * Places the image so its padding falls outside the item's box. The box then matches the
 * visible drawing, so the bottom-centre anchor and the shadow sit where the item touches the floor.
 */
export function artInset(art: ItemArt) {
  const padX = (art.pad / (art.width - 2 * art.pad)) * 100;
  const padY = (art.pad / (art.height - 2 * art.pad)) * 100;
  return {
    left: `-${padX}%`,
    top: `-${padY}%`,
    width: `${100 + 2 * padX}%`,
    height: `${100 + 2 * padY}%`,
  };
}
