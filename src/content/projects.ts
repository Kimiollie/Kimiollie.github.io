import type { MoreProject, Project } from './types.ts';
import { REPO_URL } from './site.ts';

export const projectsPage = {
  title: 'Projects',
  intro:
    'Mobile, web, IoT and industrial projects, some solo and some in teams. For team projects I describe only my own part.',
  backLink: 'Back to the room',
  moreTitle: 'More projects',
};

/** Featured projects, in this order. For team projects, only Kim's own part. */
export const projects: Project[] = [
  {
    id: 'carbon-footprint',
    title: 'Carbon footprint app (iOS)',
    status: 'In progress',
    meta: [
      'Metropolia Software Factory',
      'Software development intern',
      'Team of 4–5',
      'Sep 2026 – now',
    ],
    bulletsLabel: 'What I do',
    bullets: [
      'Build the iOS version with Kotlin Multiplatform and SwiftUI: login, sign-up, app overview and more screens.',
      'Check features with the Android developer so both apps behave the same.',
      'Weekly reports to the project manager and monthly demos.',
    ],
    note: "The app will be piloted by Metropolia's sustainability department.",
    tags: ['Kotlin Multiplatform', 'SwiftUI', 'Agile'],
    links: [],
    // Image only after the team/project manager approves. Until then, a styled placeholder.
  },
  {
    id: 'ollies-house',
    title: "Ollie's House (this website)",
    status: 'This site',
    meta: ['Personal project', '2026'],
    bulletsLabel: 'What I did',
    bullets: [
      'Designed the concept and the illustrated room, created the Ollie illustrations, and built the site with React, TypeScript and Vite.',
      'Interactive room: Ollie walks to the item you hover, with a walk cycle, depth scaling and day/night mode.',
      'Tested with Vitest and deployed with GitHub Actions to GitHub Pages.',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'CSS', 'Vitest', 'GitHub Actions'],
    links: [{ label: 'Code', href: REPO_URL }],
    linksNote: "you're on it",
  },
  {
    id: 'mushroomhunter',
    title: 'MushroomHunter',
    meta: ['Android app', 'School team project', 'Grade 5/5'],
    bulletsLabel: 'What I did',
    bullets: [
      'Built the app UI.',
      'Integrated the TensorFlow Lite model into the app.',
      'Built the map and location features.',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'TensorFlow Lite', 'MVVM', 'Room', 'Maps'],
    links: [{ label: 'GitHub', href: 'https://github.com/Kimiollie/MushroomHunter' }],
  },
  {
    id: 'metrade',
    title: 'Metrade',
    status: 'Live',
    meta: ['Full-stack e-commerce', 'School team project', 'Grade 5/5'],
    bulletsLabel: 'What I did',
    bullets: [
      'Built frontend pages and worked across the stack: wrote the backend logic and connected it to the front page, the user-role pages (such as the admin view), the product listing page and the add-product page.',
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    links: [
      { label: 'Live', href: 'https://metrade-frontend.onrender.com' },
      { label: 'GitHub', href: 'https://github.com/Kimiollie/metrade' },
    ],
  },
  {
    id: 'scada',
    title: 'Industrial SCADA monitoring',
    meta: ['University client project for SaveLAN Oy', 'Jan – May 2026', 'Grade 5/5'],
    bulletsLabel: 'What I did',
    bullets: [
      "Configured JSON-SCADA on the company's virtual machine and connected it to an IEC 104 data source.",
      "Built an SVG monitoring view for 5 stations and tested it with the client's real data.",
      "Wrote documentation for the client's users and handed the system over.",
    ],
    note: "No public code: the work ran on the client's own machine.",
    tags: ['JSON-SCADA', 'IEC 104', 'SVG'],
    links: [],
    // Image only if SaveLAN Oy allows.
  },
  {
    id: 'weather-rater',
    title: 'Weather Rater',
    meta: ['Personal solo project', 'Python CLI', '2026'],
    bulletsLabel: 'What it does',
    bullets: [
      'Asks for three cities, fetches 3-day forecasts from WeatherAPI, scores each city for beach weather on the next two days, ranks them and opens an interactive map with colour-coded markers.',
    ],
    tags: ['Python', 'REST API', 'Folium', 'pytest', 'GitHub Actions'],
    links: [{ label: 'GitHub', href: 'https://github.com/Kimiollie/weather_rating' }],
  },
  {
    id: 'data-pipeline',
    title: 'data-pipeline',
    meta: ['Personal project', 'Python'],
    bulletsLabel: 'What I did',
    bullets: [
      'Modular image collection and processing tool using protocol and strategy patterns. 96% test coverage, CI with GitHub Actions.',
    ],
    tags: ['Python', 'pytest', 'GitHub Actions', 'design patterns'],
    links: [{ label: 'GitHub', href: 'https://github.com/Kimiollie/data-pipeline' }],
  },
  {
    id: 'heart-rate-monitor',
    title: 'Heart Rate Monitor',
    meta: ['Solo IoT project', 'Grade 5/5'],
    bulletsLabel: 'What I did',
    bullets: ['MicroPython on a Raspberry Pi Pico, BLE, and a React dashboard.'],
    tags: ['MicroPython', 'Raspberry Pi Pico', 'BLE', 'React'],
    links: [{ label: 'GitHub', href: 'https://github.com/Kimiollie/HeartRateMonitor' }],
  },
  {
    id: 'superflash',
    title: 'SuperFlash',
    meta: ['JavaFX flashcard app', 'School team project', 'Grade 5/5'],
    bulletsLabel: 'What I did',
    bullets: [
      'Set up the Jenkins pipeline: build, automated tests, coverage reports and Docker image build and push.',
      'The project reached 85% coverage.',
    ],
    tags: ['Java', 'JavaFX', 'Jenkins', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/Kimiollie/flash_card' }],
  },
  {
    id: 'hospital-simulator',
    title: 'Hospital System Simulator',
    meta: ['Patient flow simulation in Java', 'School team project', 'Grade 5/5'],
    bulletsLabel: 'What I did',
    bullets: ['Applied the simulation, calculated bottlenecks and visualised patient flow.'],
    tags: ['Java', 'JavaFX', 'MariaDB', 'JPA / Hibernate', 'JUnit'],
    links: [{ label: 'GitHub', href: 'https://github.com/Kimiollie/hospital-simulation' }],
  },
];

export const moreProjects: MoreProject[] = [
  {
    name: 'Crashless',
    description:
      'European geography quiz game, first-year team project (grade 5). I worked on the game logic and quiz mechanics, navigation, and the UI and responsive layout. A teammate added the dark mode.',
    href: 'https://github.com/Kimiollie/Crashless',
  },
  {
    name: 'Dog café website',
    description:
      'my first website (2023), made for the dog café idea from my hospitality thesis. HTML and CSS.',
    href: 'https://github.com/Kimiollie/Dog_cafe_website',
  },
  {
    name: 'Space Dodge',
    description: 'one of my first coding experiences (2023), a small Python game made with Pygame.',
    href: 'https://github.com/Kimiollie/Space_dodge_game',
  },
];
