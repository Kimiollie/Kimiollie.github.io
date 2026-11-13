import {
  FRIEND_VISIT,
  HOME,
  ROOM_H,
  ROOM_ITEMS,
  ROOM_W,
  type Point,
  type RoomItemKey,
} from '../room.config.ts';

/** Dev-only layout editor (/?edit): the values you can move. */
export interface ItemPlacement {
  x: number;
  y: number;
  h: number;
}

export interface RoomLayout {
  items: Record<RoomItemKey, ItemPlacement>;
  friendSpot: Point;
  home: Point;
}

export type Selectable = RoomItemKey | 'friend' | 'home';

export const LAYOUT_STORAGE_KEY = 'ollie-room-layout';
const MIN_H = 4;

/** The layout as it is in room.config.ts. */
export function configLayout(): RoomLayout {
  const items = {} as Record<RoomItemKey, ItemPlacement>;
  for (const item of ROOM_ITEMS) items[item.id] = { x: item.x, y: item.y, h: item.h };
  return { items, friendSpot: { ...FRIEND_VISIT.spot }, home: { ...HOME } };
}

/** Keeps an anchor inside the 1376 × 768 room, in whole image px. */
export function clampPoint(point: Point): Point {
  return {
    x: Math.round(Math.min(ROOM_W, Math.max(0, point.x))),
    y: Math.round(Math.min(ROOM_H, Math.max(0, point.y))),
  };
}

export function clampHeight(h: number): number {
  return Math.round(Math.min(ROOM_H, Math.max(MIN_H, h)));
}

/** Moves the selected thing's bottom-centre anchor (clamped to the room). */
export function moveTo(layout: RoomLayout, target: Selectable, point: Point): RoomLayout {
  const p = clampPoint(point);
  if (target === 'friend') return { ...layout, friendSpot: p };
  if (target === 'home') return { ...layout, home: p };
  return { ...layout, items: { ...layout.items, [target]: { ...layout.items[target], ...p } } };
}

export function anchorOf(layout: RoomLayout, target: Selectable): Point {
  if (target === 'friend') return layout.friendSpot;
  if (target === 'home') return layout.home;
  return layout.items[target];
}

export function nudge(layout: RoomLayout, target: Selectable, dx: number, dy: number): RoomLayout {
  const at = anchorOf(layout, target);
  return moveTo(layout, target, { x: at.x + dx, y: at.y + dy });
}

/** Changes an item's height (friend and home have none). */
export function resize(layout: RoomLayout, target: Selectable, dh: number): RoomLayout {
  if (target === 'friend' || target === 'home') return layout;
  const item = layout.items[target];
  return {
    ...layout,
    items: { ...layout.items, [target]: { ...item, h: clampHeight(item.h + dh) } },
  };
}

const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

/** Ids of items whose x, y or h differ from room.config.ts. */
export function changedItems(layout: RoomLayout, base = configLayout()): RoomItemKey[] {
  return ROOM_ITEMS.map((item) => item.id).filter((id) => {
    const a = layout.items[id];
    const b = base.items[id];
    return a.x !== b.x || a.y !== b.y || a.h !== b.h;
  });
}

/** A snippet with only the changed values, to paste into room.config.ts by hand. */
export function toSnippet(layout: RoomLayout, base = configLayout()): string {
  const items = changedItems(layout, base);
  const friendChanged = !samePoint(layout.friendSpot, base.friendSpot);
  const homeChanged = !samePoint(layout.home, base.home);
  if (items.length === 0 && !friendChanged && !homeChanged) {
    return '// Room layout: no changes from room.config.ts';
  }

  const lines = ['// Room layout from /?edit: copy each value into room.config.ts'];
  if (items.length > 0) {
    lines.push('// ROOM_ITEMS (x, y, h)');
    for (const id of items) {
      const { x, y, h } = layout.items[id];
      lines.push(`{ id: '${id}', x: ${x}, y: ${y}, h: ${h} },`);
    }
  }
  if (friendChanged) {
    const { x, y } = layout.friendSpot;
    lines.push('// FRIEND_VISIT', `spot: { x: ${x}, y: ${y} },`);
  }
  if (homeChanged) {
    const { x, y } = layout.home;
    lines.push(`export const HOME: Point = { x: ${x}, y: ${y} };`);
  }
  return lines.join('\n');
}

/** The working layout saved while editing, if it is still valid for the current items. */
export function loadLayout(): RoomLayout | null {
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoomLayout;
    const base = configLayout();
    const ok =
      ROOM_ITEMS.every((item) => isPlacement(parsed.items?.[item.id])) &&
      isPoint(parsed.friendSpot) &&
      isPoint(parsed.home);
    if (!ok) return null;
    const items = { ...base.items };
    for (const item of ROOM_ITEMS) items[item.id] = { ...parsed.items[item.id] };
    return { items, friendSpot: parsed.friendSpot, home: parsed.home };
  } catch {
    return null;
  }
}

export function saveLayout(layout: RoomLayout): void {
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // Storage blocked: the layout still works until reload.
  }
}

export function clearLayout(): void {
  try {
    window.localStorage.removeItem(LAYOUT_STORAGE_KEY);
  } catch {
    // Nothing saved.
  }
}

function isPoint(value: unknown): value is Point {
  const p = value as Point | undefined;
  return typeof p?.x === 'number' && typeof p?.y === 'number';
}

function isPlacement(value: unknown): value is ItemPlacement {
  return isPoint(value) && typeof (value as ItemPlacement).h === 'number';
}
