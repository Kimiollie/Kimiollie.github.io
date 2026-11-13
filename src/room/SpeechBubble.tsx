import type { CSSProperties } from 'react';
import { ROOM_H, ROOM_W, type Point } from './room.config.ts';
import styles from './SpeechBubble.module.css';

interface SpeechBubbleProps {
  /** Top-centre of Ollie (or his pose), in image px. The tail points here. */
  anchor: Point;
  text: string;
}

/** Keeps the bubble's centre this far (in % of the room width) from the side walls. */
const EDGE = 13;

/** Ollie's speech bubble: white with a black outline and a tail, kept inside the room. */
function SpeechBubble({ anchor, text }: SpeechBubbleProps) {
  const x = (anchor.x / ROOM_W) * 100;
  const top = `${(anchor.y / ROOM_H) * 100}%`;
  const bubbleStyle = { left: `${Math.min(100 - EDGE, Math.max(EDGE, x))}%`, top } as CSSProperties;
  const tailStyle = { left: `${Math.min(96, Math.max(4, x))}%`, top } as CSSProperties;

  return (
    <div className={styles.layer} aria-hidden="true" data-testid="speech-bubble">
      <p className={`${styles.bubble} fun`} style={bubbleStyle}>
        {text}
      </p>
      <svg className={styles.tail} style={tailStyle} viewBox="0 0 20 14">
        <path d="M0 0 L20 0 L10 14 Z" className={styles.tailFill} />
        <path d="M0 0 L10 14 L20 0" className={styles.tailLine} />
      </svg>
    </div>
  );
}

export default SpeechBubble;
