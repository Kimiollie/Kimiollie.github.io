/**
 * Optional images. Vite finds whatever files exist at build time, so a missing image
 * just returns undefined and the page shows a placeholder instead of failing the build.
 */
type ImageMap = Record<string, string>;

const projectImages: ImageMap = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const portraitImages: ImageMap = import.meta.glob('../assets/portrait.webp', {
  eager: true,
  import: 'default',
});

const badgeImages: ImageMap = import.meta.glob('../assets/badges/*.{png,webp,svg}', {
  eager: true,
  import: 'default',
});

const galleryImages: ImageMap = import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const friendImages: ImageMap = import.meta.glob('../assets/friends/*_head.{png,webp}', {
  eager: true,
  import: 'default',
});

export function projectImage(file: string | undefined): string | undefined {
  return file ? projectImages[`../assets/projects/${file}`] : undefined;
}

export function portraitImage(): string | undefined {
  return portraitImages['../assets/portrait.webp'];
}

export function badgeImage(file: string): string | undefined {
  return badgeImages[`../assets/badges/${file}`];
}

export function galleryImage(file: string | undefined): string | undefined {
  return file ? galleryImages[`../assets/gallery/${file}`] : undefined;
}

/** Head portrait of one of Ollie's friends, e.g. friends/kiwi_head.webp. */
export function friendHead(id: string): string | undefined {
  return (
    friendImages[`../assets/friends/${id}_head.webp`] ??
    friendImages[`../assets/friends/${id}_head.png`]
  );
}

/** Known image sizes (px), for width/height attributes so the page doesn't jump while loading. */
export const PORTRAIT_SIZE = { width: 682, height: 877 };
export const FRIEND_HEAD_SIZE: Record<string, { width: number; height: number }> = {
  kiwi: { width: 232, height: 300 },
  moon: { width: 252, height: 300 },
  tho: { width: 240, height: 300 },
};
