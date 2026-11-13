import { friends } from '../content/beyond.ts';
import type { Friend } from '../content/types.ts';
import { FRIEND_VISIT } from './room.config.ts';

/** A random number in [0, 1). Injectable so tests can control the dice. */
export type Random = () => number;

/** One random friend. */
export function pickFriend(random: Random = Math.random): Friend {
  return friends[Math.min(friends.length - 1, Math.floor(random() * friends.length))];
}

/** Roll for a visiting friend: 1 in 2 chance (FRIEND_VISIT.chance), then a random friend. */
export function pickVisitor(random: Random = Math.random): Friend | null {
  return random() < FRIEND_VISIT.chance ? pickFriend(random) : null;
}
