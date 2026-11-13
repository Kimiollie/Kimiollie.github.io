import type { GalleryImage } from '../content/types.ts';
import { galleryImage } from '../utils/images.ts';
import ImageOrPlaceholder from './ImageOrPlaceholder.tsx';
import styles from './Gallery.module.css';

interface GalleryProps {
  images: GalleryImage[];
}

/** Square tiles in 3 columns. Missing images show as dashed placeholders. */
function Gallery({ images }: GalleryProps) {
  return (
    <ul className={styles.gallery}>
      {images.map((item) => (
        <li key={item.image ?? item.alt} className={styles.tile}>
          <ImageOrPlaceholder src={galleryImage(item.image)} alt={item.alt} />
        </li>
      ))}
    </ul>
  );
}

export default Gallery;
