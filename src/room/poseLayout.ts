import {
  depthScale,
  itemBox,
  walkTarget,
  type Box,
  type Point,
  type RoomItemConfig,
} from './room.config.ts';
import { itemImages, poseImages } from './roomAssets.ts';

export interface PoseLayout {
  /** The pose's box in image px (the drawing, without the image's padding). */
  box: Box;
  /** Where Ollie's feet are: the spot he walks to, and the pose's depth (zIndex). */
  feet: Point;
}

/**
 * Where Ollie's item pose is drawn.
 * - Floor items: bottom-centre at the item (+ poseDx), poseH tall, depth-scaled.
 * - Wall items with a pose (the phone): scaled and placed so the phone body in the pose
 *   overlaps the wall phone's body exactly.
 */
export function poseLayout(item: RoomItemConfig): PoseLayout | null {
  if (!item.pose) return null;
  const pose = poseImages[item.pose];
  const poseW = pose.width - 2 * pose.pad;
  const poseH = pose.height - 2 * pose.pad;

  const itemArt = item.image ? itemImages[item.image] : undefined;
  if (item.kind === 'wall' && itemArt?.body && pose.body && pose.foot) {
    const itemBoxPx = itemBox(item);
    const itemScale = itemBoxPx.height / (itemArt.height - 2 * itemArt.pad);
    const bodyLeft = itemBoxPx.left + (itemArt.body.x1 - itemArt.pad) * itemScale;
    const bodyTop = itemBoxPx.top + (itemArt.body.y1 - itemArt.pad) * itemScale;
    const bodyWidth = (itemArt.body.x2 - itemArt.body.x1) * itemScale;

    const scale = bodyWidth / (pose.body.x2 - pose.body.x1);
    const left = bodyLeft - (pose.body.x1 - pose.pad) * scale;
    const top = bodyTop - (pose.body.y1 - pose.pad) * scale;
    return {
      box: { left, top, width: poseW * scale, height: poseH * scale },
      feet: {
        x: left + (pose.foot.x - pose.pad) * scale,
        y: top + (pose.foot.y - pose.pad) * scale,
      },
    };
  }

  const height = (item.poseH ?? 0) * depthScale(item.y);
  const width = (height * poseW) / poseH;
  const x = item.x + (item.poseDx ?? 0);
  return {
    box: { left: x - width / 2, top: item.y - height, width, height },
    feet: { x, y: item.y },
  };
}

/** Where Ollie walks to for an item. */
export function walkTargetFor(item: RoomItemConfig): Point {
  if (item.kind === 'wall' && item.pose) return poseLayout(item)!.feet;
  return walkTarget(item);
}
