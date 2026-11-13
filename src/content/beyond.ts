import type { Friend, GalleryImage, Hobby } from './types.ts';

export const beyondPage = {
  title: 'Beyond code',
  sub: "The things I do when I'm not debugging. Mostly involving dogs.",
};

export const paintings = {
  title: 'Dog paintings',
  intro: 'I paint dogs sometimes. Ollie is a frequent (and unpaid) model.',
  // Placeholders until Kim adds 3–6 photos to src/assets/gallery/.
  images: [
    { alt: 'Dog painting 1' },
    { alt: 'Dog painting 2' },
    { alt: 'Dog painting 3' },
  ] satisfies GalleryImage[],
};

export const hobbiesTitle = 'Also me';

export const hobbies: Hobby[] = [
  { name: 'Swimming' },
  { name: 'Baking' },
  { name: 'Manga & anime' },
  { name: 'Science videos', detail: 'space and planets' },
  { name: 'Trivia & Wordle' },
  { name: 'Playing with AI', detail: 'building workflows, trying new features' },
];

export const ollie = {
  title: 'Ollie',
  text: 'Black-and-white French bulldog, professional nap taker and the main model for every illustration on this site.',
  // Placeholders until Kim adds 3 Ollie photos to src/assets/gallery/.
  images: [
    { alt: 'Ollie photo 1' },
    { alt: 'Ollie photo 2' },
    { alt: 'Ollie photo 3' },
  ] satisfies GalleryImage[],
};

export const friendsTitle = "Ollie's squad";

export const friends: Friend[] = [
  {
    id: 'kiwi',
    name: 'Kiwi',
    breed: 'Australian terrier, brown and yellow',
    line: 'Playful, full of energy, and never sits still. Chief of zoomies.',
  },
  {
    id: 'moon',
    name: 'Moon',
    breed: 'West Highland white terrier',
    line: 'Smart, and always available for belly rubs.',
  },
  {
    id: 'tho',
    name: 'Tho',
    breed: 'fluffy Chihuahua and Pomeranian mix',
    line: 'Shy, extremely fluffy and ridiculously cute.',
  },
];
