# Ollie's House

The portfolio of Kim Ngan Tran: software engineering, AI and a hospitality background. The home page is an illustrated room where Ollie, a black-and-white French bulldog, walks over to whatever you hover and shows you around: the desk leads to projects, the portrait to the About page, the easel to life beyond code, the wall phone to contact details, and the ball fetches the CV.

**Live:** https://kimiollie.github.io

<!-- Screenshot placeholder: add docs/screenshot.png and uncomment the line below. -->
<!-- ![The room, with Ollie at the desk](docs/screenshot.png) -->

## Features

- **Interactive room:** hover or Tab to an item and Ollie walks there along a gentle curve, with depth scaling, a walk cycle, fading paw prints and a speech bubble. Click or press Enter to open the page.
- **Day and night:** follows the visitor's local time, and can be flipped with the light switch on the wall or the icon in the header.
- **Wall phone:** the contact item. Ollie picks up the receiver when he gets there.
- **Visiting friends:** sometimes one of Ollie's friends (Kiwi, Moon or Tho) is sitting by the door. Hover them and Ollie goes over to say hi.
- **Accessible and mobile-friendly:** keyboard and screen-reader support, visible focus, `prefers-reduced-motion` respected (no walking or paw prints), and a simpler card layout on small screens instead of the room.

## Tech stack

React, TypeScript and Vite · React Router · plain CSS (CSS modules and custom properties) · Vitest and Testing Library · ESLint and Prettier · Formspree for the contact form · GitHub Actions and GitHub Pages.

## Run it

Needs Node.js 20.19 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

The contact form needs a Formspree form ID in `.env.local` (not committed):

```bash
VITE_FORMSPREE_ID=your-form-id
```

| Command           | What it does                                               |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Development server                                         |
| `npm test`        | Run the tests once (`npm run test:watch` to keep watching) |
| `npm run lint`    | ESLint                                                     |
| `npm run format`  | Prettier                                                   |
| `npm run build`   | Type-check and build to `dist/`                            |
| `npm run preview` | Serve the production build locally                         |

## Deployment

On every push to `main`, a GitHub Actions workflow runs lint, tests and the build, then publishes `dist/` to GitHub Pages. A copy of `index.html` is served as `404.html`, so deep links such as `/projects` work.

The workflow is `.github/workflows/deploy.yml`. The contact form's Formspree ID comes from the repository variable `VITE_FORMSPREE_ID` (Settings → Secrets and variables → Actions → Variables).

## Project structure

```
public/            favicon, social preview image, robots.txt, sitemap.xml
src/
  assets/          room, items, Ollie's poses, friends, portrait
  content/         all text and personal facts, as typed data
  components/      header, footer, page header, project card, theme toggle, …
  pages/           Home, Projects, About, Beyond code, Contact, 404
  room/            the interactive room: layout config, Ollie, walking, items, mobile cards
  room/editor/     dev-only layout editor
  styles/          design tokens and global styles
  theme/           day/night logic and provider
```

### Layout editor (development only)

Run `npm run dev` and open `/?edit` on a desktop-sized window. Drag the items, the visiting friend's spot and Ollie's bed into place (arrow keys nudge, `+` / `-` change the size), then use **Copy as TypeScript** and paste the values into `src/room/room.config.ts`. The editor is not included in the production build.

## Credits

The Ollie illustrations were created by Kim with an AI image tool, from photos of her dog Ollie. Ollie is the real boss of this house.
