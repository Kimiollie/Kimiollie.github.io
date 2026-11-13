import { afterEach, describe, expect, it } from 'vitest';
import {
  LAYOUT_STORAGE_KEY,
  clampHeight,
  clampPoint,
  clearLayout,
  configLayout,
  loadLayout,
  moveTo,
  nudge,
  resize,
  saveLayout,
  toSnippet,
} from './layoutModel.ts';

afterEach(() => {
  localStorage.clear();
});

describe('clamping', () => {
  it('keeps anchors inside the 1376 × 768 room, in whole px', () => {
    expect(clampPoint({ x: -20, y: -5 })).toEqual({ x: 0, y: 0 });
    expect(clampPoint({ x: 2000, y: 900 })).toEqual({ x: 1376, y: 768 });
    expect(clampPoint({ x: 500.6, y: 300.2 })).toEqual({ x: 501, y: 300 });
  });

  it('clamps when dragging and nudging past the edges', () => {
    const base = configLayout();
    expect(moveTo(base, 'projects', { x: 1500, y: -40 }).items.projects).toMatchObject({
      x: 1376,
      y: 0,
    });
    expect(moveTo(base, 'friend', { x: -1, y: 999 }).friendSpot).toEqual({ x: 0, y: 768 });
    expect(moveTo(base, 'home', { x: 10, y: 10 }).home).toEqual({ x: 10, y: 10 });

    const nearEdge = moveTo(base, 'cv', { x: 1370, y: 765 });
    expect(nudge(nearEdge, 'cv', 10, 10).items.cv).toMatchObject({ x: 1376, y: 768 });
  });

  it('keeps heights sensible and ignores h for the friend and home spots', () => {
    expect(clampHeight(1)).toBe(4);
    expect(clampHeight(5000)).toBe(768);
    const base = configLayout();
    expect(resize(base, 'beyond', 2).items.beyond.h).toBe(base.items.beyond.h + 2);
    expect(resize(base, 'friend', 2)).toBe(base);
    expect(resize(base, 'home', -2)).toBe(base);
  });
});

describe('snippet', () => {
  it('says so when nothing changed', () => {
    expect(toSnippet(configLayout())).toBe('// Room layout: no changes from room.config.ts');
  });

  it('lists only the changed items (id, x, y, h), then the friend and home spots', () => {
    let layout = configLayout();
    layout = moveTo(layout, 'projects', { x: 530, y: 510 });
    layout = resize(layout, 'contact', -4);
    layout = moveTo(layout, 'friend', { x: 1190, y: 645 });
    layout = moveTo(layout, 'home', { x: 690, y: 580 });
    const base = configLayout();

    expect(toSnippet(layout)).toBe(
      [
        '// Room layout from /?edit: copy each value into room.config.ts',
        '// ROOM_ITEMS (x, y, h)',
        `{ id: 'projects', x: 530, y: 510, h: ${base.items.projects.h} },`,
        `{ id: 'contact', x: ${base.items.contact.x}, y: ${base.items.contact.y}, h: ${base.items.contact.h - 4} },`,
        '// FRIEND_VISIT',
        'spot: { x: 1190, y: 645 },',
        'export const HOME: Point = { x: 690, y: 580 };',
      ].join('\n'),
    );
  });

  it('leaves out the friend and home spots when they did not move', () => {
    const layout = nudge(configLayout(), 'about', 1, 0);
    const snippet = toSnippet(layout);
    expect(snippet).toContain("{ id: 'about'");
    expect(snippet).not.toContain('spot:');
    expect(snippet).not.toContain('HOME');
    expect(snippet).not.toContain("id: 'projects'");
  });
});

describe('saved working layout', () => {
  it('survives a reload and is cleared on reset', () => {
    const layout = moveTo(configLayout(), 'cv', { x: 1, y: 1 });
    saveLayout(layout);
    expect(loadLayout()).toEqual(layout);
    clearLayout();
    expect(localStorage.getItem(LAYOUT_STORAGE_KEY)).toBeNull();
    expect(loadLayout()).toBeNull();
  });

  it('ignores a saved layout that no longer fits the items', () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify({ items: {}, home: { x: 1 } }));
    expect(loadLayout()).toBeNull();
    localStorage.setItem(LAYOUT_STORAGE_KEY, 'not json');
    expect(loadLayout()).toBeNull();
  });
});
