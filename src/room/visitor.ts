import { friends } from '../content/beyond.ts';
import type { Friend, FriendId } from '../content/types.ts';
import { FRIEND_VISIT, depthScale, friendHeight, type Box } from './room.config.ts';
import { friendSprites } from './roomAssets.ts';

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

/** The friend by name from the URL (?friend=tho), for checking sizes in debug mode. */
export function friendById(id: string | null): Friend | null {
  return friends.find((friend) => friend.id === id) ?? null;
}

/** Where the visiting friend sits, in image px (bottom-centre on the spot, depth-scaled). */
export function visitorBox(id: FriendId): Box {
  const art = friendSprites[id];
  const { x, y } = FRIEND_VISIT.spot;
  const height = friendHeight(id) * depthScale(y);
  const width = (height * (art.width - 2 * art.pad)) / (art.height - 2 * art.pad);
  return { left: x - width / 2, top: y - height, width, height };
}
