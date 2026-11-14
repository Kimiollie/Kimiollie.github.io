import type { Badge, CertificateChip, Fact, SkillGroup, TimelineEntry } from './types.ts';

export const aboutPage = {
  title: 'About me',
  sub: 'From hotel breakfasts to Kotlin Multiplatform, with Ollie supervising.',
  /** From PLAN.md section 2.3: "Portrait illustration (Kim hugging Ollie)". */
  portraitAlt: 'Portrait illustration of Kim hugging Ollie',
  storyTitle: 'My story',
  skillsTitle: 'Skills',
  timelineTitle: 'Timeline',
  badgesTitle: 'Certificates & badges',
  seeAllBadges: {
    label: 'See all badges',
    href: 'https://www.credly.com/users/kim-tran.400c7dc0/badges/credly',
  },
};

export const story: string[] = [
  'I started out in hospitality. I studied Hospitality Management and worked in hotels and kitchens, and I noticed that the part I enjoyed most was solving problems and finding the logic in a busy shift.',
  "During covid I took some IT courses out of curiosity, and that curiosity didn't go away. So I started a Bachelor's in Information Technology at Metropolia, majoring in software engineering.",
  "Now I build mobile, web and IoT projects, and I'm working on an iOS app at Metropolia's Software Factory. My years of working with people help me understand what users need and what they're looking for.",
];

export const facts: Fact[] = [
  { value: '4.9 / 5', label: 'grade average' },
  { value: 'Now', label: 'available, full-time' },
  { value: '3 languages', label: 'English, Vietnamese, Finnish' },
];

/** Newest first. */
export const timeline: TimelineEntry[] = [
  {
    role: 'Software development intern',
    place: 'Metropolia Software Factory',
    period: '2026 – now',
    current: true,
  },
  {
    role: 'BEng Information Technology (Software Engineering)',
    place: 'Metropolia UAS',
    period: '2023 – 2027 (expected)',
  },
  { role: 'Restaurant Operations Team Member', place: 'Avolta', period: '2023 – 2026' },
  { role: 'Textile and logistics operator', place: 'Lindström', period: '2022' },
  { role: 'Cook & assistant kitchen manager', place: 'PRTM Oy', period: '2020 – 2021' },
  {
    role: 'Bachelor of Hospitality Management (incl. hotel work placements)',
    place: 'Haaga-Helia UAS',
    period: '2016 – 2020',
  },
];

export const skills: SkillGroup[] = [
  {
    name: 'Languages',
    skills: [
      'Python',
      'Java',
      'Kotlin',
      'JavaScript / TypeScript',
      'SQL',
      'MicroPython',
      'Swift (learning)',
    ],
  },
  {
    name: 'Mobile',
    skills: [
      'Android (Jetpack Compose, MVVM, Room)',
      'Kotlin Multiplatform',
      'SwiftUI',
      'TensorFlow Lite',
    ],
  },
  { name: 'Web', skills: ['React', 'Node.js', 'Express', 'REST', 'JWT', 'MongoDB'] },
  {
    name: 'Data & AI',
    skills: [
      'MariaDB',
      'JPA / Hibernate',
      'machine learning with scikit-learn (learning)',
      'Power BI (basic)',
    ],
  },
  { name: 'Cloud', skills: ['AWS (AWS Academy courses)'] },
  {
    name: 'DevOps & testing',
    skills: [
      'Git',
      'GitHub Actions',
      'Jenkins',
      'Docker (basics)',
      'pytest',
      'JUnit',
      'Mockito',
      'SonarQube',
    ],
  },
  { name: 'IoT & industrial', skills: ['Raspberry Pi Pico', 'BLE', 'JSON-SCADA', 'IEC 104'] },
  { name: 'Office', skills: ['Excel', 'Word', 'PowerPoint'] },
  {
    name: 'Ways of working',
    skills: ['Agile / Scrum', 'documentation', 'testing', 'code review', 'customer service'],
  },
  { name: 'Spoken', skills: ['English (C2)', 'Vietnamese (native)', 'Finnish (A2)'] },
];

/** Badge images go in src/assets/badges/. Alt text = name + issuer. */
export const badges: Badge[] = [
  {
    name: 'AWS Academy Graduate, Engineering Operations Technicians (Training Badge, 20 hours)',
    issuer: 'AWS Academy',
    date: 'Oct 2026',
    verifyUrl: 'https://www.credly.com/go/Y6kM116h',
    image: 'aws.webp',
  },
  {
    name: 'Ethical Hacker',
    issuer: 'Cisco Networking Academy',
    date: 'Oct 2025',
    image: 'cisco.webp',
  },
  {
    name: 'User Experience Design Fundamentals',
    issuer: 'IBM SkillsBuild',
    date: 'Feb 2025',
    verifyUrl: 'https://www.credly.com/badges/b44e76f8-aea5-4d80-8eb7-0681e631b1b9',
    image: 'ibm.webp',
  },
  {
    name: 'Digiturvastartti (digital security basics)',
    issuer: 'Metropolia UAS',
    date: 'Nov 2026',
    verifyUrl: 'https://openbadgepassport.com/app/badge/info/1230081',
    image: 'digiturvastartti.webp',
  },
];

/** Certificates shown as text-only chips. */
export const certificateChips: CertificateChip[] = [
  { name: 'Hygiene passport' },
  {
    name: 'Travel Industry Safety Passport',
  },
];
