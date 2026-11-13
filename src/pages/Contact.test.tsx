import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from './Contact.tsx';
import { contactForm, contactPage, email } from '../content/contact.ts';

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
}

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function fillValidForm() {
  fill('Name', 'Test Person');
  fill('Email', 'test@example.com');
  fill('Message', 'Hello Kim!');
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: contactForm.submit }));
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv('VITE_FORMSPREE_ID', 'test-form-id');
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Contact form validation', () => {
  it('shows an error under every empty field, linked with aria-describedby', () => {
    renderContact();
    submit();

    const cases = [
      ['Name', contactForm.errors.nameRequired],
      ['Email', contactForm.errors.emailRequired],
      ['Message', contactForm.errors.messageRequired],
    ] as const;
    for (const [label, message] of cases) {
      const field = screen.getByLabelText(label);
      expect(field.getAttribute('aria-invalid')).toBe('true');
      const errorId = field.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(document.getElementById(errorId!)?.textContent).toBe(message);
    }
    expect(document.activeElement).toBe(screen.getByLabelText('Name'));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a badly formatted email', () => {
    renderContact();
    fillValidForm();
    fill('Email', 'not-an-email');
    submit();

    expect(screen.getByText(contactForm.errors.emailInvalid)).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clears a field error when the user edits that field', () => {
    renderContact();
    submit();
    fill('Name', 'T');

    expect(screen.queryByText(contactForm.errors.nameRequired)).toBeNull();
    expect(screen.getByLabelText('Name').hasAttribute('aria-describedby')).toBe(false);
    expect(screen.getByText(contactForm.errors.emailRequired)).toBeDefined();
  });
});

describe('Contact form sending', () => {
  it('posts to Formspree and shows the success message', async () => {
    fetchMock.mockResolvedValue({ ok: true });
    renderContact();
    fillValidForm();
    submit();

    expect(screen.getByRole('button', { name: contactForm.sending }).hasAttribute('disabled')).toBe(
      true,
    );
    expect(await screen.findByText(contactPage.successMessage)).toBeDefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://formspree.io/f/test-form-id');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Accept).toBe('application/json');
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Test Person',
      email: 'test@example.com',
      message: 'Hello Kim!',
    });
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('');
  });

  it('shows the email address as a fallback when sending fails', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    renderContact();
    fillValidForm();
    submit();

    const fallback = await screen.findByRole('link', { name: email });
    expect(fallback.closest('[role="status"]')).not.toBeNull();
    expect(fallback.getAttribute('href')).toBe(`mailto:${email}`);
  });

  it('shows a dev warning instead of sending when the form ID is missing', () => {
    vi.stubEnv('VITE_FORMSPREE_ID', '');
    renderContact();
    fillValidForm();
    submit();

    expect(screen.getByText(contactForm.missingIdWarning)).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('Contact links', () => {
  it('shows email, LinkedIn and GitHub rows, with no CV row and no phone number', () => {
    renderContact();
    const list = screen.getByRole('list', { name: contactPage.linksLabel });
    const hrefs = [...list.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      `mailto:${email}`,
      'https://www.linkedin.com/in/kim-tran-do',
      'https://github.com/Kimiollie',
    ]);
    expect(list.querySelector('a[href^="tel:"]')).toBeNull();
    expect(list.querySelector('a[download]')).toBeNull();
  });
});
