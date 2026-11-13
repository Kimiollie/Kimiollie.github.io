import { CV_URL, roomLabels, roomPortraitAlt } from '../content/site.ts';
import type { FriendId, RoomItemId } from '../content/types.ts';

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

export type ItemImage = 'desk' | 'easel' | 'phone' | 'ball';

/**
 * Ollie's item poses. Wall items use the lookup sprite unless they have their own pose
 * (the phone): then the pose is lined up with the wall item, see poseLayout.ts.
 */
export type ItemPose = 'laptop' | 'easel' | 'phone' | 'fetch';

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
  /** Ollie's pose, shown when he arrives (the item and Ollie are hidden meanwhile). */
  pose?: ItemPose;
  /** Floor items: pose x offset from the item, in image px. */
  poseDx?: number;
  /**
   * Floor items: pose height in image px, before the depth scale.
   * Wall items without a pose: height of the lookup sprite.
   * Wall items with a pose ignore poseDx/poseH: the pose is sized and placed so it overlaps the item.
   */
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
    // Wall phone on the left wall. The phone pose is lined up with it automatically, so tune
    // x, y and h here: Ollie's feet land about 1.1 × h below the phone and he stands about 2 × h tall,
    // about 1.5 × h to the right of the phone. At h 110, x ≈ 200 keeps his pose clear of the lamp,
    // desk and easel (checked pixel by pixel), with the phone well below the ceiling line.
    id: 'contact',
    kind: 'wall',
    x: 198,
    y: 420,
    h: 110,
    aspect: 450 / 594,
    action: { type: 'route', to: '/contact' },
    colour: 'var(--c-contact)',
    label: roomLabels.contact,
    image: 'phone',
    pose: 'phone',
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
    poseH: 135,
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

/**
 * Visiting friend easter egg: 1-in-2 chance per home visit (PLAN.md 4.3 said 1 in 3).
 * The spot is on the right, on the floor in front of the door: clear of the contact item and
 * Ollie's spot there (1005, 655), the ball, the water bowl, Ollie at the light switch, and all of
 * Ollie's walking paths. (The left wall is kept free for the wall phone.)
 * Check with /?debug&friend=kiwi|moon|tho: the overlay outlines the friend with its size factor
 * and marks Ollie's greeting spot.
 */
export const FRIEND_VISIT = {
  chance: 1 / 2,
  spot: { x: 1185, y: 640 } satisfies Point,
  /**
   * Hovering the friend: Ollie walks to this offset from the friend's spot and greets it.
   * Every item and his bed are left of the door, so he always comes from the left: this puts him
   * just left of and slightly in front of the friend (clear of the friend, the water bowl, the
   * light switch, the ball and the phone).
   */
  greetOffset: { dx: -85, dy: 15 },
  /** Height as a fraction of Ollie's sit height (OLLIE_HEIGHT.sit), before the depth scale. */
  sizeFactor: { kiwi: 0.95, moon: 0.9, tho: 0.85 } satisfies Record<FriendId, number>,
};

/** Where Ollie stands to greet the visiting friend. */
export function greetSpot(): Point {
  const { spot, greetOffset } = FRIEND_VISIT;
  return { x: spot.x + greetOffset.dx, y: spot.y + greetOffset.dy };
}

/** A visiting friend's height in image px, before the depth scale. */
export function friendHeight(id: FriendId): number {
  return OLLIE_HEIGHT.sit * FRIEND_VISIT.sizeFactor[id];
}

/** Idle at home: every 5 s, a 50% chance of looking up for 1.5 s (PLAN.md 4.3). */
export const IDLE = {
  everyMs: 5000,
  chance: 0.5,
  lookupMs: 1500,
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

/** Where the item's pose is drawn, in image px (bottom-centre at the item, shifted by poseDx). */
export function poseBox(item: RoomItemConfig, aspect: number): Box {
  const height = (item.poseH ?? 0) * depthScale(item.y);
  const width = height * aspect;
  const x = item.x + (item.poseDx ?? 0);
  return { left: x - width / 2, top: item.y - height, width, height };
}

/** Items in keyboard order: left to right across the room. */
export const ITEMS_IN_TAB_ORDER = [...ROOM_ITEMS].sort((a, b) => a.x - b.x);

/** The same box as CSS percentages of the room, so the room scales with the screen. */
export function boxToPercent(box: Box) {
  return {
    left: `${(box.left / ROOM_W) * 100}%`,
    top: `${(box.top / ROOM_H) * 100}%`,
    width: `${(box.width / ROOM_W) * 100}%`,
    height: `${(box.height / ROOM_H) * 100}%`,
  };
}
