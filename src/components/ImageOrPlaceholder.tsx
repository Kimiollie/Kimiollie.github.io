import styles from './ImageOrPlaceholder.module.css';

interface ImageOrPlaceholderProps {
  src: string | undefined;
  /** Used for the image, and as the placeholder's accessible name. Empty = decorative. */
  alt: string;
  className?: string;
  lazy?: boolean;
  /** cover = fill the frame and crop; contain = show the whole image. */
  fit?: 'cover' | 'contain';
}

/** Shows the image, or a dashed box of the same size while the file is missing. */
function ImageOrPlaceholder({
  src,
  alt,
  className,
  lazy = true,
  fit = 'cover',
}: ImageOrPlaceholderProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${styles[fit]} ${className ?? ''}`}
        loading={lazy ? 'lazy' : undefined}
      />
    );
  }

  const a11y = alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true };
  return <div {...a11y} className={`${styles.placeholder} ${className ?? ''}`} />;
}

export default ImageOrPlaceholder;
