import type { ContactLink } from './types.ts';
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from './site.ts';

export const contactPage = {
  title: 'Say hi',
  sub: 'Open to software, AI and hospitality roles in the Helsinki region or remote. Available now, full-time.',
  successMessage: 'Thanks! Kim will get back to you.',
  linksLabel: 'Other ways to reach Kim',
};

/** Form labels and messages. */
export const contactForm = {
  nameLabel: 'Name',
  emailLabel: 'Email',
  messageLabel: 'Message',
  submit: 'Send message',
  sending: 'Sending…',
  errors: {
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address, like name@example.com.',
    messageRequired: 'Please write a message.',
  },
  /** Shown before the email address when sending fails. */
  sendError: "Sorry, the message couldn't be sent. Please email Kim directly at",
  /** Development only. */
  missingIdWarning:
    'VITE_FORMSPREE_ID is not set, so the form does not send. Add it to .env.local and restart npm run dev.',
};

export const email = EMAIL;

export const contactLinks: ContactLink[] = [
  { label: 'Email', text: EMAIL, href: `mailto:${EMAIL}`, kind: 'email' },
  { label: 'LinkedIn', text: 'linkedin.com/in/kim-tran-do', href: LINKEDIN_URL, kind: 'external' },
  { label: 'GitHub', text: 'github.com/Kimiollie', href: GITHUB_URL, kind: 'external' },
];
