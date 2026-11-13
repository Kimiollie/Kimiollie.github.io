import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoomEditor from './RoomEditor.tsx';
import { LAYOUT_STORAGE_KEY, configLayout } from './layoutModel.ts';

function renderEditor(path = '/?edit') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <RoomEditor />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

const row = (id: string) =>
  within(screen.getByRole('table')).getByText(id).closest('tr')!.querySelectorAll('td');

describe('RoomEditor', () => {
  it('has no links or buttons in the room, and always shows the friend', () => {
    renderEditor('/?edit&friend=tho');
    const room = screen.getByTestId('edit-room');
    expect(room.querySelector('a, button')).toBeNull();
    expect(screen.getByTestId('edit-friend').getAttribute('aria-label')).toContain('Tho');
  });

  it('nudges the selected item with arrows (Shift = 10 px) and resizes with + / -', () => {
    renderEditor();
    const base = configLayout().items.projects;
    fireEvent.pointerDown(screen.getByTestId('edit-projects'));

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowDown', shiftKey: true });
    fireEvent.keyDown(window, { key: '+' });
    fireEvent.keyDown(window, { key: '+' });
    fireEvent.keyDown(window, { key: '-' });

    const cells = row('projects');
    expect(cells[1].textContent).toBe(String(base.x + 1));
    expect(cells[2].textContent).toBe(String(base.y + 10));
    expect(cells[3].textContent).toBe(String(base.h + 2));
    expect(
      screen.getByText(`projects · x ${base.x + 1} · y ${base.y + 10} · h ${base.h + 2}`),
    ).toBeDefined();
    expect(screen.getByTestId('edit-snippet').textContent).toContain(
      `{ id: 'projects', x: ${base.x + 1}, y: ${base.y + 10}, h: ${base.h + 2} },`,
    );
  });

  it('drags an anchor with the same image-px conversion, clamped to the room', () => {
    renderEditor();
    const room = screen.getByTestId('edit-room');
    vi.spyOn(room, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 688,
      height: 384,
    } as DOMRect);
    const home = configLayout().home;

    // Grab Ollie exactly at his anchor (image px → half-size screen px), then drag.
    fireEvent.pointerDown(screen.getByTestId('edit-home'), {
      clientX: home.x / 2,
      clientY: home.y / 2,
    });
    fireEvent.pointerMove(room, { clientX: 100, clientY: 150 });
    expect(row('Ollie home')[1].textContent).toBe('200');
    expect(row('Ollie home')[2].textContent).toBe('300');

    fireEvent.pointerMove(room, { clientX: 5000, clientY: -50 });
    expect(row('Ollie home')[1].textContent).toBe('1376');
    expect(row('Ollie home')[2].textContent).toBe('0');
    fireEvent.pointerUp(room);
  });

  it('keeps the working layout across a reload, and Reset clears it', () => {
    renderEditor();
    fireEvent.pointerDown(screen.getByTestId('edit-cv'));
    fireEvent.keyDown(window, { key: 'ArrowLeft', shiftKey: true });
    expect(localStorage.getItem(LAYOUT_STORAGE_KEY)).not.toBeNull();
    cleanup();

    renderEditor();
    const base = configLayout().items.cv;
    expect(row('cv')[1].textContent).toBe(String(base.x - 10));

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(row('cv')[1].textContent).toBe(String(base.x));
    expect(localStorage.getItem(LAYOUT_STORAGE_KEY)).toBeNull();
  });

  it('copies the snippet to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    renderEditor();
    fireEvent.pointerDown(screen.getByTestId('edit-about'));
    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.click(screen.getByRole('button', { name: 'Copy as TypeScript' }));

    expect(await screen.findByText('Copied!')).toBeDefined();
    expect(writeText).toHaveBeenCalledWith(screen.getByTestId('edit-snippet').textContent);
    vi.unstubAllGlobals();
  });
});
