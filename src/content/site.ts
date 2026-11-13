import type { QuickLink, RoomItemId } from './types.ts';

export const BRAND = 'Kim Ngan Tran';
export const CV_URL = '/Kim_Ngan_Tran_CV.pdf';
export const EMAIL = 'sylviakimtran@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/kim-tran-do';
export const GITHUB_URL = 'https://github.com/Kimiollie';
export const REPO_URL = 'https://github.com/Kimiollie/Kimiollie.github.io';

export const footerText = 'Illustrations of Ollie, the real boss of this house. Built by Kim.';

export const hero = {
  title: "Hi, I'm Kim.",
  tagline: {
    before: 'A ',
    highlight: 'tech-curious',
    after: ' weirdo who likes logic puzzles.',
  },
  sub: 'Software engineering, AI and a hospitality background · Helsinki',
  /** Desktop only. */
  hint: 'Hover things in the room. Ollie will show you around.',
};

export const quickLinksTitle = 'In a hurry?';

export const quickLinks: QuickLink[] = [
  { label: 'Projects', href: '/projects', kind: 'route' },
  { label: 'CV (PDF)', href: CV_URL, kind: 'download' },
  { label: 'LinkedIn', href: LINKEDIN_URL, kind: 'external' },
  { label: 'GitHub', href: GITHUB_URL, kind: 'external' },
  { label: 'Email', href: `mailto:${EMAIL}`, kind: 'email' },
];

/** Ollie's speech bubbles in the room (PLAN.md section 2.6). */
export const ollieLines: Record<RoomItemId, string> = {
  projects: "Woof! Kim's projects live here.",
  about: "That's Kim. And me, obviously.",
  beyond: 'Kim paints dogs. Mostly me.',
  contact: 'Got mail? Say hi to Kim!',
  cv: "Fetch! Here's Kim's CV.",
};

export const lightSwitchLines = {
  on: 'Lights on!',
  off: 'Lights off…',
};

/** Ollie's bubble on the mobile home page (PLAN.md section 4.4). */
export const mobileOllieLine = "Hi! I'm Ollie. Tap something and I'll show you around.";
