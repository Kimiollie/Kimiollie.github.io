import type { Friend, GalleryImage, Hobby } from './types.ts';

export const beyondPage = {
  title: 'Beyond code',
  sub: "The things I do when I'm not debugging. Mostly involving dogs.",
};

export const paintings = {
  title: 'Dog paintings',
  intro: 'I paint dogs sometimes. Ollie is a frequent (and unpaid) model.',
  images: [
    {
      image: 'painting_1.webp',
      width: 1100,
      height: 1100,
      alt: 'Acrylic painting of Ollie in profile against a pale blue background',
    },
    {
      image: 'painting_2.webp',
      width: 1100,
      height: 1100,
      alt: 'Painting of Ollie lying on his back on a blanket, looking up at the viewer',
    },
    {
      image: 'painting_3.webp',
      width: 1100,
      height: 1100,
      alt: 'Painting of Ollie on a leash, standing in a snowy road at sunset',
    },
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
  images: [
    { image: 'ollie_1.webp', alt: 'Ollie on the sofa with a tennis ball in his mouth' },
    { image: 'ollie_2.webp', alt: 'Ollie sitting on the sofa next to his friend Kiwi' },
    { image: 'ollie_3.webp', alt: 'Ollie at the door with his friends Moon and Kiwi' },
  ] satisfies GalleryImage[],
};

export const friendsTitle = "Ollie's squad";

/** Ollie's greeting when you hover a visiting friend in the room (PLAN.md 4.3). */
export const greetLine = (name: string) => `Hi, ${name}!`;

/** 404 page title (PLAN.md 4.3). */
export const notFoundTitle = (name: string) => `Oops, ${name} buried this page.`;

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
