import type { ContactLink } from './types.ts';
import { CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL } from './site.ts';

export const contactPage = {
  title: 'Say hi',
  sub: 'Open to software, AI and hospitality roles in the Helsinki region or remote. Available now, full-time.',
  successMessage: 'Thanks! Kim will get back to you.',
};

export const email = EMAIL;

export const contactLinks: ContactLink[] = [
  { label: 'Email', text: EMAIL, href: `mailto:${EMAIL}`, kind: 'email' },
  { label: 'LinkedIn', text: 'linkedin.com/in/kim-tran-do', href: LINKEDIN_URL, kind: 'external' },
  { label: 'GitHub', text: 'github.com/Kimiollie', href: GITHUB_URL, kind: 'external' },
  { label: 'CV (PDF)', text: 'Kim_Ngan_Tran_CV.pdf', href: CV_URL, kind: 'download' },
];
