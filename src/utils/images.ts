/**
 * Optional images. Vite finds whatever files exist at build time, so a missing image
 * just returns undefined and the page shows a placeholder instead of failing the build.
 */
const projectImages = import.meta.glob<string>('../assets/projects/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
});

const ollieImages = import.meta.glob<string>('../assets/ollie/*.{png,webp}', {
  eager: true,
  import: 'default',
});

export function projectImage(file: string | undefined): string | undefined {
  return file ? projectImages[`../assets/projects/${file}`] : undefined;
}

export function olliePose(name: string): string | undefined {
  return ollieImages[`../assets/ollie/${name}.webp`] ?? ollieImages[`../assets/ollie/${name}.png`];
}
