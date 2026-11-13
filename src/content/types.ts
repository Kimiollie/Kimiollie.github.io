/** Shared types for the site content. All text lives in src/content/, pages only render it. */

/** A link to another site (opens in a new tab). */
export interface ExternalLink {
  label: string;
  href: string;
}

/** Marks content Kim still has to check. Shown as a yellow marker in development only. */
export interface Reviewable {
  needsReview?: boolean;
}

export type ProjectStatus = 'In progress' | 'Live' | 'This site';

export interface Project extends Reviewable {
  id: string;
  title: string;
  status?: ProjectStatus;
  /** Shown joined with " · ". */
  meta: string[];
  /** Heading above the bullets, e.g. "What I did". */
  bulletsLabel: string;
  bullets: string[];
  note?: string;
  tags: string[];
  links: ExternalLink[];
  /** Short text shown next to the links, e.g. "you're on it". */
  linksNote?: string;
  /** File name in src/assets/projects/. Without it, a striped placeholder is shown. */
  image?: string;
  imageAlt?: string;
}

export interface MoreProject extends Reviewable {
  name: string;
  description: string;
  href: string;
}

export interface QuickLink {
  label: string;
  href: string;
  kind: 'route' | 'external' | 'download' | 'email';
  /** Which item colour the link uses on hover. */
  accent: RoomItemId;
}

export type RoomItemId = 'projects' | 'about' | 'beyond' | 'contact' | 'cv';

export interface Fact {
  value: string;
  label: string;
}

export interface TimelineEntry {
  role: string;
  place: string;
  period: string;
  current?: boolean;
}

export interface SkillGroup {
  name: string;
  skills: string[];
}

export interface Badge extends Reviewable {
  name: string;
  issuer: string;
  date: string;
  /** Missing while needsReview is true. */
  verifyUrl?: string;
  /** File name in src/assets/badges/. */
  image: string;
}

export interface CertificateChip extends Reviewable {
  name: string;
}

export interface Hobby {
  name: string;
  detail?: string;
}

/** A gallery tile. Without `image` it renders as a dashed placeholder. */
export interface GalleryImage {
  /** File name in src/assets/gallery/. */
  image?: string;
  alt: string;
}

export interface Friend {
  id: 'kiwi' | 'moon' | 'tho';
  name: string;
  breed: string;
  line: string;
}

export interface ContactLink {
  label: string;
  /** Text shown for the link, e.g. the email address. */
  text: string;
  href: string;
  kind: 'email' | 'external';
}
