import type { QuickLink, RoomItemId } from './types.ts';

export const BRAND = 'Kim Ngan Tran';
export const CV_URL = '/Kim_Ngan_Tran_CV.pdf';
export const EMAIL = 'sylviakimtran@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/kim-tran-do';
export const GITHUB_URL = 'https://github.com/Kimiollie';
export const REPO_URL = 'https://github.com/Kimiollie/Kimiollie.github.io';

export const cvButtonLabel = 'Fetch CV';
/** Shown instead of cvButtonLabel on very narrow screens (the link keeps the full name). */
export const cvButtonShortLabel = 'CV';

/** Header day/night button (screen-reader label and tooltip). */
export const themeToggleLabels = {
  toNight: 'Switch to night',
  toDay: 'Switch to day',
};

/** First link on every page, for keyboard and screen-reader users. */
export const skipLinkLabel = 'Skip to content';

export const backToRoom = 'Back to the room';

/** Browser tab titles (step 4.3). The home title must not contain the word "student". */
export const pageTitles = {
  home: 'Kim Ngan Tran · Software, AI and hospitality',
  projects: 'Projects · Kim Ngan Tran',
  about: 'About · Kim Ngan Tran',
  beyond: 'Beyond code · Kim Ngan Tran',
  contact: 'Contact · Kim Ngan Tran',
  notFound: 'Page not found · Kim Ngan Tran',
};

export const footerText = 'Illustrations of Ollie, the real boss of this house. Built by Kim.';

export const hero = {
  title: "Hi, I'm Kim.",
  tagline: {
    before: 'A ',
    highlight: 'tech-curious',
    after: ' weirdo who likes logic puzzles.',
  },
  sub: 'Software engineering, AI and a hospitality background',
  /** Desktop only. */
  hint: 'Hover things in the room. Ollie will show you around.',
};

export const quickLinksTitle = 'In a hurry?';

export const quickLinks: QuickLink[] = [
  { label: 'Projects', href: '/projects', kind: 'route', accent: 'projects' },
  { label: 'CV (PDF)', href: CV_URL, kind: 'download', accent: 'cv' },
  { label: 'LinkedIn', href: LINKEDIN_URL, kind: 'external', accent: 'contact' },
  { label: 'GitHub', href: GITHUB_URL, kind: 'external', accent: 'contact' },
  { label: 'Email', href: `mailto:${EMAIL}`, kind: 'email', accent: 'contact' },
];

/** Name of the interactive room, for screen readers. */
export const roomLabel = "Ollie's House";

/** The small portrait in the picture frame on the room's back wall. */
export const roomPortraitAlt = 'Portrait of Kim hugging Ollie';

/** Label pills above the room items. */
export const roomLabels: Record<RoomItemId | 'switch', string> = {
  projects: 'Projects',
  about: 'About',
  beyond: 'Beyond code',
  contact: 'Contact',
  cv: 'CV (PDF)',
  switch: 'Light switch',
};

/** Ollie's speech bubbles in the room (PLAN.md section 2.6). */
export const ollieLines: Record<RoomItemId, string> = {
  projects: "Woof! Kim's projects live here.",
  about: "That's Kim. And me, obviously.",
  beyond: 'Kim paints dogs. Mostly me.',
  contact: 'Ring ring! Say hi to Kim!',
  cv: "Fetch! Here's Kim's CV.",
};

export const lightSwitchLines = {
  on: 'Lights on!',
  off: 'Lights off…',
};

/** Ollie's bubble on the mobile home page (PLAN.md section 4.4). */
export const mobileOllieLine = "Hi! I'm Ollie. Tap something and I'll show you around.";
