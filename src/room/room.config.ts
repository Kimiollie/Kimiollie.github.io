import { CV_URL, roomLabels, roomPortraitAlt } from '../content/site.ts';
import type { RoomItemId } from '../content/types.ts';

/** The room image is 1376 × 768. All positions below are in these image pixels. */
export const ROOM_W = 1376;
export const ROOM_H = 768;

/** y where the back wall meets the floor; the depth scale starts here. */
const HORIZON_Y = 480;

/** Things further back are smaller (PLAN.md 4.1). 0.62 at the back wall, 1 at the front edge. */
export function depthScale(y: number): number {
  return 0.62 + (0.38 * (y - HORIZON_Y)) / (ROOM_H - HORIZON_Y);
}

export interface Point {
  x: number;
  y: number;
}

export type RoomItemKey = RoomItemId | 'switch';

export type RoomAction =
  { type: 'route'; to: string } | { type: 'download'; href: string } | { type: 'toggleTheme' };

export type ItemImage = 'desk' | 'easel' | 'mailbox' | 'ball';

export interface RoomItemConfig {
  id: RoomItemKey;
  /** Floor items stand on the floor and get the depth scale; wall items do not. */
  kind: 'floor' | 'wall';
  /** Bottom-centre of the item (where it touches the floor), in image px. */
  x: number;
  y: number;
  /** Height in image px, before the depth scale. */
  h: number;
  /** Width ÷ height of the item's box (the visible drawing, without the image's padding). */
  aspect: number;
  action: RoomAction;
  /** CSS colour shown on hover. */
  colour: string;
  label: string;
  /** Floor items: src/assets/items/<image>.webp and <image>_c.webp. */
  image?: ItemImage;
  /** Ollie's pose at this item (used from step 3.4). */
  pose?: string;
  poseDx?: number;
  poseH?: number;
  /** Wall items: where Ollie stands below the item. */
  standAt?: Point;
  /** Wall items: a picture shown inside the item, placed by image px (no depth scale). */
  picture?: WallPicture;
}

export interface WallPicture {
  image: 'portraitWall';
  alt: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Starting positions from PLAN.md 4.2. Fine-tune with /?debug. */
export const ROOM_ITEMS: RoomItemConfig[] = [
  {
    id: 'projects',
    kind: 'floor',
    x: 525,
    y: 505,
    h: 215,
    aspect: 282 / 270,
    action: { type: 'route', to: '/projects' },
    colour: 'var(--c-projects)',
    label: roomLabels.projects,
    image: 'desk',
    pose: 'laptop',
    poseDx: 25,
    poseH: 265,
  },
  {
    id: 'about',
    kind: 'wall',
    x: 876,
    y: 368,
    h: 64,
    aspect: 56 / 64,
    action: { type: 'route', to: '/about' },
    colour: 'var(--c-about)',
    label: roomLabels.about,
    pose: 'lookup',
    poseH: 135,
    standAt: { x: 876, y: 540 },
    // Inside the frame's inner white area.
    picture: { image: 'portraitWall', alt: roomPortraitAlt, x1: 857, y1: 313, x2: 896, y2: 361 },
  },
  {
    id: 'beyond',
    kind: 'floor',
    x: 215,
    y: 705,
    h: 265,
    aspect: 185 / 327,
    action: { type: 'route', to: '/beyond' },
    colour: 'var(--c-beyond)',
    label: roomLabels.beyond,
    image: 'easel',
    pose: 'easel',
    poseDx: -30,
    poseH: 285,
  },
  {
    id: 'contact',
    kind: 'floor',
    x: 1050,
    y: 655,
    h: 215,
    aspect: 176 / 282,
    action: { type: 'route', to: '/contact' },
    colour: 'var(--c-contact)',
    label: roomLabels.contact,
    image: 'mailbox',
    pose: 'mailbox',
    poseDx: -45,
    poseH: 220,
  },
  {
    id: 'cv',
    kind: 'floor',
    x: 700,
    y: 742,
    h: 62,
    aspect: 192 / 193,
    action: { type: 'download', href: CV_URL },
    colour: 'var(--c-cv)',
    label: roomLabels.cv,
    image: 'ball',
    pose: 'fetch',
    poseDx: -25,
    poseH: 125,
  },
  {
    id: 'switch',
    kind: 'wall',
    x: 1110,
    y: 420,
    h: 40,
    aspect: 26 / 40,
    action: { type: 'toggleTheme' },
    colour: 'var(--c-about)',
    label: roomLabels.switch,
    pose: 'lookup',
    standAt: { x: 1095, y: 560 },
  },
];

/** Ollie's home: the dog bed. */
export const HOME: Point = { x: 688, y: 585 };

/** Ollie's sprite heights in image px, before the depth scale (PLAN.md 4.2). */
export const OLLIE_HEIGHT = { sit: 135, walk: 125 };

/** Walking (PLAN.md 4.3). */
export const WALK = {
  /** Image px per second. */
  speed: 300,
  /** How far the path dips towards the viewer, as a share of the distance… */
  dipRatio: 0.18,
  /** …but never more than this many image px. */
  maxDip: 70,
  /** Each walk frame is shown this long (ms). */
  frameMs: 150,
};

export const PAW_PRINTS = {
  everyMs: 240,
  fadeMs: 1600,
  max: 12,
  /** Paw print size in image px, before the depth scale. */
  size: 22,
  /** Left and right paws sit this many × size to either side of the path. */
  trackOffset: 0.3,
};

/** Where Ollie walks to for an item: next to the item's pose spot, or below a wall item. */
export function walkTarget(item: RoomItemConfig): Point {
  if (item.standAt) return item.standAt;
  return { x: item.x + (item.poseDx ?? 0), y: item.y };
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** The item's box in image px, after the depth scale for floor items. */
export function itemBox(item: RoomItemConfig): Box {
  const height = item.kind === 'floor' ? item.h * depthScale(item.y) : item.h;
  const width = height * item.aspect;
  return { left: item.x - width / 2, top: item.y - height, width, height };
}

/** A wall picture's position as CSS percentages of its item's box. */
export function pictureToPercent(item: RoomItemConfig, picture: WallPicture) {
  const box = itemBox(item);
  return {
    left: `${((picture.x1 - box.left) / box.width) * 100}%`,
    top: `${((picture.y1 - box.top) / box.height) * 100}%`,
    width: `${((picture.x2 - picture.x1) / box.width) * 100}%`,
    height: `${((picture.y2 - picture.y1) / box.height) * 100}%`,
  };
}

/** The same box as CSS percentages of the room, so the room scales with the screen. */
export function boxToPercent(box: Box) {
  return {
    left: `${(box.left / ROOM_W) * 100}%`,
    top: `${(box.top / ROOM_H) * 100}%`,
    width: `${(box.width / ROOM_W) * 100}%`,
    height: `${(box.height / ROOM_H) * 100}%`,
  };
}
