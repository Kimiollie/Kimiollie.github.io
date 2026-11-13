import roomDay from '../assets/room/room_day_empty.webp';
import roomNight from '../assets/room/room_night_empty.webp';
import desk from '../assets/items/desk.webp';
import deskColour from '../assets/items/desk_c.webp';
import easel from '../assets/items/easel.webp';
import easelColour from '../assets/items/easel_c.webp';
import phone from '../assets/items/phone.webp';
import phoneColour from '../assets/items/phone_c.webp';
import ball from '../assets/items/ball.webp';
import ballColour from '../assets/items/ball_c.webp';
import portraitWall from '../assets/items/portrait_wall.webp';
import kiwiSit from '../assets/friends/kiwi_sit.webp';
import moonSit from '../assets/friends/moon_sit.webp';
import thoSit from '../assets/friends/tho_sit.webp';
import type { FriendId } from '../content/types.ts';
import type { ItemImage, ItemPose } from './room.config.ts';

export const roomBackgrounds = { day: roomDay, night: roomNight };

// The old mailbox pose is no longer used (contact is a wall phone now), so it is left out.
const ollieUrls: Record<string, string> = import.meta.glob(
  ['../assets/ollie/*.webp', '!../assets/ollie/mailbox*.webp'],
  { eager: true, import: 'default' },
);

/** Every Ollie image, for preloading. */
export const allOllieImages = Object.values(ollieUrls);

export type OllieSprite = 'sit' | 'lookup' | 'walk_1' | 'walk_2' | 'walk_3';

/** Ollie's room sprites, with natural size and transparent padding (px). */
export const ollieSprites: Record<OllieSprite, ItemArt> = {
  sit: sprite('sit', 285, 392),
  lookup: sprite('lookup', 291, 396),
  walk_1: sprite('walk_1', 405, 321),
  walk_2: sprite('walk_2', 340, 329),
  walk_3: sprite('walk_3', 394, 325),
};

/** Ollie's item poses (each includes its item). */
export const poseImages: Record<ItemPose, ItemArt> = {
  laptop: sprite('laptop', 873, 924, 22),
  easel: sprite('easel', 861, 794, 22),
  // The pose's phone body is drawn at `body`; it is lined up with the wall phone's body.
  // `foot` is where Ollie's feet are in the pose: the spot he walks to.
  phone: {
    ...sprite('phone', 593, 725, 6),
    colour: ollieUrls['../assets/ollie/phone_c.webp'],
    body: { x1: 53, y1: 11, x2: 207, y2: 246 },
    foot: { x: 440, y: 719 },
  },
  fetch: sprite('fetch', 389, 324, 7),
};

function sprite(name: string, width: number, height: number, pad = 8): ItemArt {
  const url = ollieUrls[`../assets/ollie/${name}.webp`];
  return { white: url, colour: url, width, height, pad };
}

/** Ollie's friends, sitting (used by the room visitor and the 404 page). */
export const friendSprites: Record<FriendId, ItemArt> = {
  kiwi: { white: kiwiSit, colour: kiwiSit, width: 322, height: 515, pad: 10 },
  moon: { white: moonSit, colour: moonSit, width: 291, height: 528, pad: 10 },
  tho: { white: thoSit, colour: thoSit, width: 302, height: 522, pad: 10 },
};

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
  /** Phone body rectangle in image px, for lining up the phone pose with the wall phone. */
  body?: { x1: number; y1: number; x2: number; y2: number };
  /** Ollie's feet in image px (poses that are lined up with a wall item). */
  foot?: { x: number; y: number };
}

/** White and coloured (hover) version of each floor item. */
export const itemImages: Record<ItemImage, ItemArt> = {
  desk: { white: desk, colour: deskColour, width: 332, height: 320, pad: 25 },
  easel: { white: easel, colour: easelColour, width: 235, height: 377, pad: 25 },
  phone: {
    white: phone,
    colour: phoneColour,
    width: 462,
    height: 606,
    pad: 6,
    body: { x1: 174, y1: 16, x2: 445, y2: 417 },
  },
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
